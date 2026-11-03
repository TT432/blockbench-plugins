# BB Connect (YSM ↔ Blockbench)

把 Yes Steve Model 模型包从游戏接到 Blockbench Community，并把 Blockbench 里的改动同步回游戏。

## 依赖

需要 **Blockbench 社区版 ≥ 5.3.85**（插件依赖与延后启用机制自 5.3.85 起提供）：https://github.com/TT432/blockbench

本插件依赖 `ysm_utils`（YSM Mod Plugin，社区源当前版本 `2.5.2-community.1`）。缺少该前置时插件保持安装状态但不会启用，插件商店里会显示「缺少前置插件」并可直接安装。

同时需要在 1.20.1 Forge 客户端安装配套模组 `bbconnectmod`（https://github.com/TT432/bbconnectmod ，CI 构建产物在 Actions / Releases 里，README 有中英文安装与用法说明）。

## 工作方式

- 连接由**游戏端主动拨号**：插件只在 `127.0.0.1` 上监听，游戏内点击连接才会建立会话，插件不会扫描或发现游戏。
- 端口可在两端分别配置，默认 `41234`：
  - 插件端：`设置 → 插件 → BB Connect` 的 `bbconnectmod_port`
  - 模组端：`config/bbconnectmod-client.toml` 的 `bridge.port`
- 在 Yes Steve Model 的模型界面里，**以文件夹形式加载**的模型卡片下方会出现「连接到 BB」按钮：
  - 点击后插件把该模型文件夹导入为 Blockbench 项目（几何 + 贴图 + 动画 + 控制器）；
  - 在 Blockbench 里保存项目时，插件把几何、贴图与动画写回同一文件夹，然后通知游戏重载模型目录。
- 只处理文件夹形式的模型：`.zip` / `.ysm` 等归档与加密来源不显示按钮。

## 写回的粒度

- **只写真正变化的文件**：每个导出文件先与磁盘上的现有内容逐字节比较，一致就跳过；写入走「临时文件 + rename」，不会留下半个文件。只改一个方块时，通常只有 `models/main.json` 被写。
- **内容没变化的保存不发通知**：没有文件变化就不写盘、不请求重载，避免无意义的模组扫描。
- **桥接项目不改名**：YSM 模型包里的骨骼、定位器、动画、动画控制器名称由包内文件按名引用。打开的项目带有桥接标记（`Project.bbconnect_pack`，同时写入 ysm_utils 约定的 `Project.ysm_project_info.path`），Blockbench 的「Bedrock Export: Normalize Names」在这类项目下锁定为关闭，写回时不替换任何名称。
- **同步是串行的**：上一批同步还没收到游戏端确认时，新的保存只记账，等确认后合并为一次同步。Yes Steve Model 在扫描期间发现模型目录被改写会判定整次扫描失败，串行化可以避开这个窗口。

## 游戏内的模型选择

Yes Steve Model 用内容哈希标识模型，写回改变内容就会换 id，玩家原本的选择会掉回默认模型。配套模组在重载前按**模型路径**记住选择、重载后重新选中同一路径的模型，因此保存后玩家仍停留在自己正在编辑的那个模型上（聊天栏会显示 `selection:kept`）。

## 权限

插件需要 `net`（本地监听）与 `fs`（读写模型包目录）。首次使用会请求授权；拒绝后连接功能不可用，读不到模型目录。

## 故障排查

| 现象 | 检查 |
|---|---|
| 点击按钮后提示连接失败 | 插件是否启用、端口是否与模组一致、`127.0.0.1` 是否被安全软件拦截 |
| Blockbench 未打开项目 | 插件面板状态是否显示「等待游戏连接」；模型目录是否有 `ysm.json` |
| 保存后游戏内模型未变 | 模组 `sync.auto_reload` 是否为 true；查看日志中的模型重载结果 |
| 换端口后监听启动失败 | Windows 会把部分端口段（如 `50000–50059`、Hyper-V 保留段）排除在 bind 之外，报 `EADDRINUSE` 但 `netstat` 看不到占用；换到 `20000–40000` 区间里未被排除的端口 |
| 聊天栏出现 `selection:unchanged` | 内容哈希没变（本次保存内容与目录一致），玩家选择无需修复，属正常 |
| 聊天栏出现 `selection:unavailable` | 当前不是单人集成服务器（连接到远程服务器），模组无法改写远端选择 |
