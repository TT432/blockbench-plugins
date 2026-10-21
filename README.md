# blockbench-plugins

社区版 Blockbench（[TT432/blockbench](https://github.com/TT432/blockbench)）的社区插件注册表，与官方源 [JannisX11/blockbench-plugins](https://github.com/JannisX11/blockbench-plugins) 同构，社区版客户端通过多源合并同时展示官方与本仓库的插件。

## 结构

- `plugins.json` — 插件清单（schema 与官方一致）
- `updates.json` — 更新记录 `{id: {version, created, updated}}`
- `plugins/<id>/<id>.js` + `icon.*` + `about.md` + `changelog.json` — 新仓库格式（`new_repository_format: true`）

## 插件条目必填字段

`title`、`author`、`description`、`icon`、`version`、`variant`、`min_version`、`tags`、`new_repository_format: true`，以及**必须显式给出** `repository` 与 `bug_tracker`（否则客户端会默认指向官方仓库）。

`icon` 可为 Material Symbols 图标名（如 `account_tree`）或目录内的图片文件名。

## CDN 注意

经 jsDelivr 服务：`https://cdn.jsdelivr.net/gh/TT432/blockbench-plugins/plugins`。分支引用有缓存，新文件即时生效；已缓存文件更新可用 `https://purge.jsdelivr.net/gh/TT432/blockbench-plugins/<path>` 强制刷新。

## 投稿与审查

新增或更新插件请提 PR，**一个 PR 只涉及一个插件**。PR 会自动审查（恶意代码 / 政治敏感 / 色情赌博毒品 / 违法 / 歧视五类），结果以评论回写并打标签：

- `review-passed` — 通过并**自动合并**；
- `review-failed` — 评论列出阻断项，修改后重推即自动重审；
- `review-manual` — 删除类 PR 或审查异常，转人工。

规则层与语义层细节、维护者配置、本地自测方法见 [docs/plugin-review.md](docs/plugin-review.md)。
