# 构建与验证

## 来源

- 原作者：tartaric_acid。
- 上游仓库：<https://github.com/YesSteveModel/YSM-Utils-Plugins>。
- 基线：2.5.2，提交 `627eb75b020b79adb205b8f1258bb7a606850a8f`。
- 注册表版本：`2.5.2-community.2`，插件 ID：`ysm_utils`。
- 本目录的 `source.patch.txt` 包含相对该上游提交的完整源码、打包配置与直接依赖版本变更。

## 重建

使用 Node.js 20 或更新版本以及 npm，在上游仓库的干净副本中执行：

```sh
git checkout 627eb75b020b79adb205b8f1258bb7a606850a8f
git apply /path/to/source.patch.txt
npm install --ignore-scripts --no-audit --no-fund
npm run build
```

将生成的 `ysm-utils.js` 以 `ysm_utils.js` 名称放入本目录。Vue 2 构建插件及编译器版本在补丁中固定，样式在脚本内注入，关闭调试样式源映射并保留可读排版。默认模板通过固定上游提交及逐文件 SHA-256 校验加载，未执行下载内容。

## 检查

```sh
node --check plugins/ysm_utils/ysm_utils.js
node scripts/review/review.mjs --base origin/master --head HEAD --rules-only
```

本次兼容实现还验证了目录与文件选择的成功/取消路径、文件类型过滤、原生模块权限拒绝、Windows 文件身份比较，以及当前动画导入接口与旧接口回退。默认包创建额外验证固定资源哈希、下载失败、重试、缓存及目标目录冲突。

普通导入功能的兼容修复已在 Blockbench Community 5.3.74（Windows）中实测主体、贴图、动画、控制器导入。仓库发布版本的完整脚本另做隔离加载和实际模型文件读取检查；不在用户现有模型文件上测试删除、覆盖操作。
