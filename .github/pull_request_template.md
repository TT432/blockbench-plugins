## 插件

- 插件 id：
- 变更类型：新增 / 更新 / 删除
- 版本变化：（如 `0.1.2` → `0.1.3`）

## 这个插件做什么

<!-- 一两句话说明功能；商店 description 之外的补充信息写这里 -->

## 作者声明

- [ ] 本 PR **只涉及一个插件**（`plugins/<id>/**` + 该 id 在 `plugins.json` / `updates.json` 的条目）
- [ ] 代码不含 `eval` / `new Function` / `child_process` / 混淆载荷 / 向非白名单域名外发用户数据
- [ ] 内容不含政治敏感（含具争议的身份政治题材）、色情赌博毒品、违法内容、针对个人或群体的歧视
- [ ] `plugins.json` 与 `updates.json` 的版本号一致，且与 `BBPlugin.register` 中的 `version` 一致
- [ ] 未写入本机绝对路径（如 `C:\Users\...`、`/home/...`）
- [ ] 已本地跑过 `node scripts/review/review.mjs --base origin/master --head HEAD --rules-only`

> 审查通过会自动合并。删除类 PR 与审查异常一律转人工，不会自动合并。
