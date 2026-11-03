# YSM Mod Plugin (Community)

为 Java 版 Yes Steve Model 模型包提供导入、信息编辑、资源管理、旧包转换和默认模型包创建功能。

基于 tartaric_acid 的 [YSM Utils Plugins 2.5.2](https://github.com/YesSteveModel/YSM-Utils-Plugins/tree/627eb75b020b79adb205b8f1258bb7a606850a8f)，由 TheDivisionISAC 提供 Blockbench Community 兼容修订。原项目采用 MIT 许可，完整许可见本目录 `LICENSE.txt`。

## 安装与使用

- 要求桌面版 Blockbench Community 5.3.74 或更新版本；已在 Windows 的 5.3.74 版本验证兼容修复。
- 如果已从本地文件安装旧的 `ysm-utils` 插件，请先禁用或卸载旧插件，避免两个插件同时注册 YSM 菜单。本商店版本的 ID 为 `ysm_utils`。
- 安装后从顶部 **YSM** 菜单选择“直接导入”，再选择包含 `ysm.json` 的模型包目录。
- 按程序提示授予文件操作权限。保存确认和打开文件夹、回收站操作会按需申请原生模块权限；拒绝权限时终止该操作。

## 兼容修复

- 文件选择使用 Blockbench 的公开接口，不再依赖全局 `electron` 和 `currentwindow`。
- 文件访问使用插件作用域内的 `fs` 模块。
- 文件去重使用文件身份信息识别相同文件、硬链接和 Windows 大小写路径，不依赖未公开的 `realpathSync`。
- 动画和动画控制器通过当前 `AnimationCodec` 接口导入。

## 默认模板与联网行为

导入和编辑已有本地模型包不发起模板下载。只有选择“新建默认模型包”并确认包名后，插件才从 `raw.githubusercontent.com` 下载上游固定提交中的 31 份默认模型、动画、贴图和配置资源。每份资源都有内置 SHA-256 校验值；校验全部通过后才创建目标目录。下载失败会显示错误并允许重试，不创建残缺模型包。

模板只在当前程序会话中缓存。新建默认模型包需要联网；此操作只读取固定的公开模板地址，不上传用户模型。固定提交为 `627eb75b020b79adb205b8f1258bb7a606850a8f`。

源码变更与构建步骤见 `source.patch.txt` 和 `BUILD.md`。问题请提交到[社区插件仓库](https://github.com/TT432/blockbench-plugins/issues)，并说明 Blockbench 和插件版本。
