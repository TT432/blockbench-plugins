# 插件依赖与延后启用

插件可在元数据里声明 `dependencies: string[]`（被依赖插件的 ID）。宿主据此决定是否执行插件代码。

## 状态语义

| 状态 | `installed` | `disabled` | `dependency_blocked` | 插件代码 |
|---|---|---|---|---|
| 正常启用 | true | false | false | 已执行，`onload` 已调用 |
| 用户禁用 | true | true | false | 已执行，`onload` 未调用 |
| 缺前置（延后启用） | true | false | true | **未执行** |
| 未安装 | false | false | false | — |

「缺前置」不同于「用户禁用」：用户没有表达禁用意图，插件仍算已安装，依赖满足后会自动启用；它只是被宿主挡在加载之前，避免在缺少前置时执行半截代码。

前置不可用的三种原因分别记录：

- 未安装；
- 已安装但被用户禁用；
- 自身也缺前置（传递性）。

## 加载流程

1. `loadInstalledPlugins()` 逐条处理 `Plugins.installed`。入口先用 `installation.dependencies`（上次加载持久化的依赖）或注册表条目里的 `dependencies` 判断前置是否可用（安装存在、未禁用、且自身未阻塞）。
2. 有不可用前置时不执行插件代码，只把对应 `Plugin` 实例标记为 `dependency_blocked` 并记录 `missing_dependencies`；`installed` 置 true，`disabled` 保持不变。
3. 依赖顺序解析（`resolveDependencies`）仍负责把前置排到依赖者之前。
4. `Plugin.register` 再检查一次：文件/URL 插件的依赖只有执行到 `Plugin.register` 才知道，此处的检查是第二道闸门——代码已执行，但不调用 `onload`。
5. 全部加载结束后，若有被延后的插件，控制台记录一份汇总，并用快捷提示列出「插件（缺失的前置及原因）」。

## 运行时变化

前置在运行期消失时，已加载的依赖者不能继续跑半截逻辑，但它也不该被记成「被用户禁用」。因此：

- `Plugin.uninstall()` 与 `Plugin.disable()` 结束时调用 `Plugins.updateBlockedDependents(id)`：对每个直接依赖者重新计算 `checkDependencies()`，不满足就置 `dependency_blocked = true` 并 `unload()`（执行它的 `onunload`，让监听/定时器/菜单等副作用停下），`disabled` 保持不变；再递归处理依赖者的依赖者，因此 `A → B → C` 里卸载 `C` 会同时挡下 `B` 与 `A`。
- 恢复仍走 `loadBlockedDependents`：重新安装或重新启用前置后，被挡住的插件按原来源重新执行源码并清空 `dependency_blocked`。前置本身若也是被挡住的，它被恢复时会继续触发依赖者的恢复，传递链同样成立。
- 用户会收到一条快捷提示「插件 %0 已暂停：前置插件不可用：%1」。

被 `unload()` 的插件其**注册项**（菜单动作、设置项）不会被宿主自动移除——这与用户主动 `disable()` 的行为一致；需要干净移除时由插件自己在 `onunload` 里做。

## 自动启用

`Plugins.loadBlockedDependents(dependency_id?)` 在以下时机被调用：

- 插件安装完成（`Plugin.install()` → `download()` 结束）；
- 插件从文件/URL/缓存加载完成；
- 用户在详情页/右键菜单启用一个被禁用的前置（`Plugin.enable()`）。

被延后的插件依赖已满足时，宿主用与启动时相同的来源（file/url/store）重新执行其源码；成功后清空 `dependency_blocked` 与 `missing_dependencies`，并提示「插件 X 已自动启用」。

## 界面

- 插件列表：被延后的行带 `dependency_blocked_plugin` 类，右上角显示「⚠ 缺少前置插件」，`title` 为缺失前置的名称与原因。
- 详情页：状态标签显示「缺少前置插件」而不是「已禁用」；依赖列表里每项后缀标注 `（未安装）` / `（已安装但被禁用）` / `（自身缺少前置）`；下方红色说明给出完整清单，并提供「安装前置插件」按钮（逐个安装/启用，随后自动启用本插件）。
- 被延后的插件不显示「禁用/启用」按钮，避免与用户主动禁用混淆。
- 事件：被延后时派发 `plugin_dependency_blocked`（`{plugin}`）。

## 持久化

`dependencies` 随 `Plugins.installed` 条目持久化，因此重启后仍能在执行插件代码前判断。`dependency_blocked` / `missing_dependencies` 是派生状态，不持久化：依赖修好后重启即可正常加载。

## 验证口径

- 用两个合成插件（`bbconnect_test_dependent` 依赖 `bbconnect_test_dep`），先在真实实例里只加载依赖者：断言 `installed=true`、`disabled=false`、`dependency_blocked=true`、`onload` 未执行、`installed_plugins` 条目已记录依赖；插件浏览器显示「⚠ 缺少前置插件」且 `title` 指出缺失的前置与其原因。
- 再加载前置：断言依赖者自动执行 `onload`、`dependency_blocked=false`、`missing_dependencies` 为空。
- 真实插件回归：`bbconnectmod`（依赖 `ysm_utils`）在前置缺席时不监听端口；加载前置后自动开始监听。
- 运行期卸载/禁用前置（2026-11-03 实测，真实 `bbconnectmod` + 同名 id 的替身前置，因真实 `ysm_utils` 的 `onload` 在自动化环境里弹阻塞式原生对话框）：卸载前置后依赖者立刻 `dependency_blocked=true`、`disabled=false`、`missing_dependencies=['ysm_utils']`，且 `onunload` 生效（监听端口消失、`BarItems` 动作在重启后的起始状态里不存在）；重新安装前置（`loadFromFile` → `loadBlockedDependents`）后 `dependency_blocked=false`、`missing_dependencies=[]`、动作重新注册、端口重新监听；禁用前置与重新启用得到同样的两段结果。
- 插件浏览器里被挡住的插件显示「⚠ 缺少前置插件」、`Depends on: ysm_utils ⚠`、红色原因清单与「Install dependencies」按钮，且**不**显示「禁用/启用」按钮；前置是侧载（`source=file`）且已卸载时，点该按钮会提示「ysm_utils 不在插件仓库中，无法自动安装」，需要用户用「从文件加载」重新装入。

## 已知边界

- 依赖尚未出现在任何已配置的插件源里（离线/未上架）时，界面只能显示插件 ID，无法显示标题。
- `resolveDependencies` 的既有 TODO 仍在：异步加载的插件（网页端更新场景）没有等待依赖加载完成的额外保证；延后启用机制只在代码执行前判断状态。
