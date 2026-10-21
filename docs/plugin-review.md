# 插件审查规范

本仓库通过 GitHub Actions 对每个 PR 自动审查，**通过即自动合并**（`squash`），随后经 jsDelivr 对客户端生效。审查由两层组成：可复现的规则层 + DeepSeek 语义层。

## 提交流程

1. Fork 本仓库，新建分支，只改**一个插件**：
   - `plugins/<id>/<id>.js`（主文件，文件名必须与 id 一致）
   - `plugins/<id>/about.md`、`plugins/<id>/changelog.json`、`plugins/<id>/icon.*`
   - `plugins.json` 中该 id 的条目、`updates.json` 中该 id 的条目
2. 向 `master` 提 PR，填写 PR 模板。
3. 审查结果以评论形式回写（同一条评论会就地更新，不刷屏），并打标签：
   - `review-passed` → 自动合并；
   - `review-failed` → 评论里列出阻断项，修好后再 push 会自动重审；
   - `review-manual` → 需人工处理（删除类 PR、审查异常、模型不可用）。
4. 重跑：维护者可在 Actions 里 `workflow_dispatch` 并填 PR 编号。

## 审查维度

| 类别 | 判定内容 |
|---|---|
| 恶意代码 | 数据外发、文件系统/进程越权、剪贴板与凭据窃取、远程代码执行、反调试、供应链投毒 |
| 政治敏感 | 主权与领土、政治人物与历史事件、政治宣传；**包括未被平台强制禁止但具争议的身份政治题材** |
| 色情/赌博/毒品 | 色情或性暗示素材、真实或模拟赌博机制、毒品制作与交易、血腥暴力、自伤引导 |
| 违法内容 | 规避监管、未授权破解与盗版分发、窃取个人信息、诈骗与资金盘、违禁品交易 |
| 歧视 | 针对个人或群体的侮辱、贬损、刻板印象、仇恨言论，或按身份区别对待的代码逻辑 |

## 规则层检查项

| 检查 | 阻断 | 说明 |
|---|---|---|
| 路径闸门 | ✅ | 只允许 `plugins/**`、`plugins.json`、`updates.json`；`.github/**`、`scripts/**` 一律拒绝 |
| 单插件限制 | ✅ | 按**语义 diff** 归并触及的插件 id（编辑器重排 JSON 不会误判），必须恰好 1 个 |
| 体量 | ✅ | ≤40 文件、单文件 ≤320 KB、总量 ≤2 MB；插件目录内二进制仅允许图片且 ≤320 KB |
| 清单 | ✅ | 必填字段、semver、tags 数量、`new_repository_format`、`repository`/`bug_tracker` 非官方库 |
| 注册一致性 | ✅ | `BBPlugin.register` 的 id/version 必须与 `plugins.json` 一致；`updates.json` 版本必须一致 |
| 危险 API | ✅ | `child_process`、`eval`/`new Function`、`process.binding`、cookie/剪贴板读取、`net`/`tls`/`vm` 模块 |
| 外联 | ✅ 明文 HTTP；⚠ 非白名单域名 | 白名单：jsDelivr、GitHub |
| 混淆 | ✅ | hex 变量名、密集转义、超长 base64、密集 `fromCharCode` |
| 提示注入 | ✅ | 文本中出现「忽略以上指令」等操纵审查器的内容 |
| 违规词 | ✅ 明确条目；⚠ 可疑条目 | 英文按整词匹配，中文按子串 |
| 绝对路径 | ✅ | `C:\...`、`/home/...`、`/Users/...` 不得出现在发布产物中 |

规则层对**被触及插件的整目录内容**执行（不只 diff），确保更新类 PR 无法藏匿在未改动的文件里。

## 自动合并的边界（为什么不是全自动）

- **删除类 PR 不自动合并**：否则任何人可通过 PR 自动下架他人插件。
- **非 pass 时检查变红**：`Run review` 失败会让 job 结论为 failure；发布评论与标签仍会执行（不自动合并）。
- **两段 job**：`review` 出结论并变绿，`merge` 在其之后执行。合并不能写在同一个 job 里——必需检查只有 job 结束后才变绿，同 job 内合并会被分支保护拒绝。
- **分支保护不要开启「要求评审批准」**：否则自动合并在缺少人工 approval 时无法完成。当前配置：必需检查 `review`、`strict=false`、`enforce_admins=false`。
- **语义层不可用（缺 key、网络失败、输出不合结构）不自动合并**：fail-closed。
- **合并锁定 commit**：PR merge API 的 `sha` 参数设为被审查的 head，审查完成后再 force-push 会 409 而不会误合。
- **变更基准是 merge-base**：`merge-base..head` 而不是 `base..head`，否则分支落后时会把"base 上新增内容的反向变更"算进 PR。
- **PR 内容从不执行**：工作流用 `pull_request_target` 拿到写权限，但审查代码从 base 分支检出，PR 内容只作为文本读取。

## 维护者配置

1. 仓库 secret：`DEEPSEEK_API_KEY`（缺省时所有 PR 都转人工，不会静默放行）。可选：`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL` 通过工作流 env 覆盖。
2. 建议开启 `master` 分支保护：禁止直接 push、要求 `plugin review` 检查通过。
3. 本地自测（无需 key）：

   ```bash
   node scripts/review/review.mjs --base origin/master --head HEAD --rules-only
   # 产出 review-report.md / review-verdict.json，退出码 0 通过 / 1 不通过 / 2 需人工
   # --rules-only 只跑规则层（无需 API key），语义审查仍只在 CI 执行
   ```

## 已知局限

- 语义层是模型判定，存在漏判与误判；`review-manual` 标签与评论中的证据行号用于人工复核。
- 规则层词表与危险 API 列表是**穷举式**的，新手法需要维护 `scripts/review/policy.mjs`。
- 单次 PR 的模型调用量与变更体量成正比，上限为 400k 字符，超出直接转人工。
