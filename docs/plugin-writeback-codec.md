# 插件写回模型文件的坑（Bedrock codec）

面向「插件把当前工程写回磁盘上已有的模型文件」这一场景（例如把 YSM/基岩模型文件夹交给编辑器后回写）。结论先给：**不要用 `Project.format.codec.write()` 写回，自己 `compile()` 后直接落盘**。

## `Codec.write()` 在文件已存在时会走 `overwrite`

`js/io/codec.ts:321`：

```js
write(content, path) {
    if (fs.existsSync(path) && this.overwrite) {
        this.overwrite(content, path, path => this.afterSave(path))
    } else {
        Blockbench.writeFile(path, {content}, path => this.afterSave(path));
    }
}
```

基岩格式实现了 `overwrite`（`js/formats/bedrock/bedrock.js:1437`），语义是**按 identifier 合并进已有文件**：

- 模型 id 取 `geometry.<this.context?.model_identifier || Project.geometry_name || 'unknown'>`；
- 在磁盘文件的 `minecraft:geometry` 数组里按 `description.identifier` 找下标，找到就**整项替换**，找不到就**追加**；
- 然后 `autoStringify` 整个数组写回。

对导出产物（目标文件是新建的）没影响；对「回写已经存在的 `.geo.json`」就是改写用户资产：多几何文件里同 identifier 的旧条目被替换、identifier 对不上时文件里会多出一份几何。同时 `format_version` 会被提升到当前格式版本。

## 更隐蔽的一点：不可解析的目标文件会弹原生对话框

同一函数里，读文件/解析/格式校验失败会调用 `dialog.showMessageBox`（`type: 'warning'`，按钮「覆盖」/「取消」）。这个对话框在渲染线程同步阻塞，**自动化脚本（CDP / 无头驱动）无法点击**，表现为插件保存流程挂死、不返回、也不报错。写回流程里任何 `codec.write` 都有可能踩到（文件是空壳、是别的格式、被半截写入损坏）。

## 推荐写法

```js
// 几何：compile() 得到完整 JSON，整体覆盖
const mainPath = ...;                      // 目标 .geo.json
state.fs.writeFileSync(mainPath, codec.compile());

// 贴图：逐个写回，不要走 texture.export() 的对话框路径
state.fs.writeFileSync(texture.path, Buffer.from(texture.getBase64(), 'base64'));

// 动画：按 codec 分组 compileFile，再整文件写
const content = group.codec.compileFile(group.items);
state.fs.writeFileSync(file, autoStringify(content));
```

配套的约定（`blockbench-plugins/plugins/bbconnectmod` 的实现即如此）：

- 回写前把 `Project.export_path` / `Project.export_codec` 清空，避免 Ctrl+S 走核心的导出/覆盖分支；
- Ctrl+S 的语义固定为「写 `.bbmodel` 存档」，几何/贴图/动画由插件自己的通道写回，两条路径不要互相触发；
- 写回是整文件覆盖，因此要保留 YSM/基岩包内本插件不认识的字段，就不能靠 codec 覆盖，应在导入时保留原始 JSON 并在写回时只替换自己负责的部分。

## 增量写盘与「扫描窗口」约束

整文件覆盖是对目标模型最省事的做法，但会被游戏端的目录扫描者观察到。实机撞到的两个约束：

- **按内容判断是否需要写**：每个即将写出的文件先读现有字节比较，一致就跳过。这样「无改动保存」不会改 mtime、不会触发游戏端重载（Yes Steve Model 用内容哈希标识模型，任何重写都会换 id 并把玩家选择打回默认模型）。
  ```js
  function writeIfChanged(file, data) {
      const next = Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'utf8');
      try {
          const current = state.fs.readFileSync(file);
          if (current.length === next.length && current.equals(next)) return false;
      } catch (err) {
          if (err && err.code !== 'ENOENT') throw err;   // 只有「文件不存在」才继续写
      }
      const tmp = file + '.bbtmp';
      state.fs.writeFileSync(tmp, next);
      state.fs.renameSync(tmp, file);      // 原子替换，避免扫描读到半个文件
      return true;
  }
  ```
- **同一目录同时只能有一批写入**：扫模型目录的一方（如 Yes Steve Model 的 `ReloadableModelCatalog`）会校验「扫描期间目录是否变化」，扫描中写盘会让整次扫描失败并保留旧目录（`Model source changed while loading` / `Model root changed while scanning`），玩家看到的是「保存了但游戏里没变」。协议里带确认回执（`sync_ack`）时，插件必须在回执到达前**不写盘**，把期间的保存合并成一次延后同步；没有回执机制时可退化为按时间串行（上一批写完后才能启动下一批）。
