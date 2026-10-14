# YSS Animation Controller 插件规格

> 需求来源：社区版反馈表 #99「YSS的专用动画控制器：在 bb 里直接配置 YSS 的连招/按键/攻击效果，类似 UE 蓝图」。
> 数据模型依据：yessteveskill 仓库代码事实（见 §1 引用）。
> 版本：v0.1（2026-10-14）

## 0. 概念模型（YSS 侧事实，勿臆造）

- **技能** = `hit.json` 的 `animation` map 里登记的 YSM 动画名；动画播放即释放，YSS 只观测不触发。
- **连招** = YSM 动画控制器 JSON（基岩版 animation controller 状态机）中的状态迁移链，迁移条件用 molang；YSS 注入按键查询 `yss.is_key_down(n)` / `yss.is_key_up(n)` / `yss.get_key(n)`，n∈0..11（0=左键，1=右键，2~11=自定义键1~10，玩家在 MC 控制设置绑定）。
- **攻击效果** = `hit.json` 中每个动画的 `segments`（HitSegment）+ `caster_moves` + `hover` + `root_motion`；全局 `width_scale`/`height_scale`/`movement`/`entity_overrides`。
- **运行时路径**：`<游戏config>/yes_steve_skill/<modelId>/hit.json`（必需）+ 可选 `main.json`（几何覆盖）+ `animations.json`（动画+相机扩展）。双端读同一文件，mtime 失效自动热重载——**插件写文件即生效**。
- **modelId 规范化**：去路径前缀、剥 `.zip/.7z/.ysm` 后缀、Windows 非法字符 `<>:"/\|?*` 及控制字符 → `_`。
- **协议约束**：`segments[]`/`caster_moves[]` 数组顺序 = 网络包索引，删除/重排会改索引语义（编辑器应提示）；`time` 单位秒（= animTicks/20），`end>=start`；`hover.duration>0`；`anti_interrupt∈[0,1]`；`width/height_scale>0`；knockup 滞空服务端钳 [10,60] tick。
- **hit.json 永远写新格式**（`animation` 为对象 map）；旧扁平格式（数组）只读兼容，加载后保存即升级。

## 1. 插件形态

- id `yss_animation_controller`，desktop only（需要 fs 写 config 目录），min_version 5.2.0。
- 单文件插件（BB 插件 API，`Plugin.register`/`BBPlugin.register`），不依赖打包器。
- 入口：菜单栏新增「YSS」菜单（`MenuBar` addAction），含：
  1. `打开连招编辑器`（节点图对话框）
  2. `打开攻击效果编辑器`（hit.json 对话框）
  3. `设置 YSS 工程目录`（无内置默认路径，首次需浏览选择，持久化到 localStorage）
- modelId 推导：当前 Project 文件名规范化；可在设置中覆盖。无打开工程时两个编辑器均禁用并提示。未设置工程目录时打开攻击效果编辑器会先引导至设置对话框（连招编辑器不依赖文件系统，hit.json 徽标缓存静默跳过）。

## 2. 攻击效果编辑器（hit.json）

### 2.1 数据源
- 动画名候选：`Project` 的 `Animation.all` 名字 ∪ 已有 hit.json 的 keys。
- 骨骼名候选：当前工程 `Group.all`/`Outliner` 骨骼名（用于 `bones` 下拉与校验）。
- 加载：读 `<root>/<modelId>/hit.json`（存在则解析，旧格式自动转新格式展示）；不存在则从空模板开始。
- 保存：写回同路径（新格式，2 空格缩进 UTF-8，目录不存在则创建）。保存前跑 §2.4 校验，错误阻断保存并定位到字段，警告允许保存。

### 2.2 UI 结构（Dialog + Vue）
- 左栏：动画列表（技能列表），每项显示动画名与段数徽标；支持添加（下拉选动画名或手输）、重命名 key、删除。
- 右栏（选中动画）：
  - `segments[]` 卡片列表：id、time[start,end]（秒，留空=全程）、bones（多选 chips）、hit_reset（select: once/on_exit/interval+秒数）、damage、knockback（可选折叠：power/dir skill|radial/angle_offset）、knockup（power）、hitstop（可选折叠：self{ticks,scale_by_target_hardness,multi_target_decay}/target{ticks,scale_by_hardness}/forced）、interrupt（power）、damage_timing（instant/delayed）。段可增删、上下移动（移动时提示「数组顺序=协议索引」）。
  - `caster_moves[]` 卡片列表：time、direction(facing/world)、angle_offset、power、type(impulse/sustained)。
  - `hover`（可选折叠）：duration、gravity_scale[0,1]、block_input。
  - `root_motion`：checkbox。
- 底部全局区（折叠面板）：`width_scale`/`height_scale`、`movement`（7 项倍率）、`entity_overrides`（实体ID → anti_interrupt/weight/hardness 表格增删行）。

### 2.3 省略语义
optional 对象（knockback/knockup/hitstop/interrupt/self/target）未启用 = JSON 中省略该字段，不写默认值。空 segments=[] 合法。

### 2.4 校验（保存前 + 实时提示）
- `time.end >= time.start`；`hover.duration > 0`；`anti_interrupt ∈ [0,1]`（UI 钳制）；`width/height_scale > 0`；damage/power 为有限数。
- `bones` 每个名字 ⊆ 当前工程骨骼集（不在 → 警告级，因为运行时可用 YSM 模型几何兜底，但列出名字）。
- `animation` key 不在当前工程动画列表 → 警告级（运行时可用 animations.json/YSM 资产兜底）。
- `entity_overrides` key 形如 `namespace:path`。

## 3. 连招编辑器（动画控制器节点图，「蓝图」）

### 3.1 数据宿主
- 直接读写 BB 工程的 `AnimationController`（bedrock 格式，js/animation_controllers.js 的既有模型）：状态机 = `controller.states`（uuid/name/animations/transitions/on_entry/on_exit/blend_transition 等），初始状态 `controller.initial_state`。
- 这样控制器随 bbmodel/YSM 导出管线走，插件不另起文件格式。工程无控制器时提供「新建 YSS 控制器」按钮（名称默认 `controller.animation.yss_combat`）。
- **Undo 纪律**：所有修改包 `Undo.initEdit({controllers})` + `Undo.finishEdit`；initEdit 后必须按 uuid 重查 state 对象（快照会替换数组内对象引用，社区版 AGENTS.md 已警示）。`AnimationControllerState` 构造自注册，禁止手动 push。

### 3.2 节点图 UI（Dialog 内 SVG/Canvas，自绘，无外部依赖）
- 状态 = 节点：圆角矩形，标题=状态名，副行=动画名列表与 `on_entry` 概要；初始状态带醒目边框；可拖拽（位置存 `state.蓝图表存字段`：用 `state.storage`？——控制器 JSON 无位置字段，**位置存 Project 的插件命名空间**：`Project.yss_layout[controller.uuid][state.uuid] = {x,y}`，随工程保存）。
- 迁移 = 有向边：source→target，线中标签=条件摘要（molang 过长时截断）。自环允许（连招段重置）。点击边打开条件编辑器；右键边删除；从节点拖出箭头到目标节点创建迁移。
- 左侧面板：状态列表 + 「添加状态」（选动画）；底部：初始状态下拉。
- 状态节点编辑（双击或选中后右侧属性栏）：名称、animations（多选工程动画，写 `animations: [{short_name?}]`——bedrock 格式 animations 数组元素为字符串或 `{name: blend}` 对象，插件生成字符串形式）、`on_entry`/`on_exit`（molang 文本）、`blend_transition`。
- **molang 条件构建器**（边编辑对话框的核心）：
  - 可视化行式构建：多条件 AND/OR 组合；每行 = [左操作数] [比较符 ==/!=/>/</>=/<=] [右操作数]。
  - 操作数下拉含 YSS 按键函数快捷项：`yss.is_key_down(n)`/`yss.is_key_up(n)`/`yss.get_key(n)`（n 下拉带语义名：0 左键攻击 / 1 右键使用 / 2~11 自定义键1~10）、`query.anim_time`、`query.all_animations_finished`、`query.any_animation_finished`、常量。
  - 「连招段位」模板快捷按钮：生成 `yss.is_key_down(0)`（普攻连击）、`yss.get_key(n) > 0.5`（长按判定）等常见片段。
  - 底部始终是可手改的 molang 原文文本框（构建器与原文双向同步；解析失败时锁定构建器、保留原文——不丢用户手写的复杂表达式）。
  - 提示条：「自定义键需在 MC 控制设置 → key.category.yessteveskill 绑定」。

### 3.3 与攻击效果编辑器的联动
- 节点上若动画名 ∈ hit.json keys 显示伤害徽标（段数/总 damage），点击跳转攻击效果编辑器对应动画。
- 连招编辑器的动画名下拉同样来自工程动画。

## 4. 导出/保存动作
- 「保存 hit.json」：§2.1。
- 控制器：改动直接落在 BB 工程模型（随工程保存/导出）；另提供「导出控制器 JSON」按钮（bedrock `animation_controllers` 格式单文件保存对话框，供直接放入 YSM 模型的 controller 目录）。
- 不做：`main.json` 几何导出（v0.1 范围外，运行时可用 YSM 当前模型几何兜底；后续版本用 BB bedrock 几何 codec 补）。

## 5. 验收标准
1. 插件从社区源安装后，菜单出现「YSS」三个动作。
2. 打开带 YSM 动画的工程 → 攻击效果编辑器能新建动画条目、加段（含全部机制字段）、保存出合法新格式 hit.json 到设置目录；重开对话框能读回。
3. 连招编辑器能建状态机：≥3 状态、含 `yss.is_key_down(0)` 条件的迁移链；Undo/Redo 不破坏数据；导出 JSON 可被 YSM 解析（结构符合 bedrock controller schema）。
4. 校验：time 倒置阻断保存；未知骨骼/动画名给警告不阻断。
5. hit.json 写入 dev 环境 `run/config/yes_steve_skill/<modelId>/` 后游戏内热重载生效（本插件自验到「文件写入正确」为止，游戏内验证归测试员）。

## 6. 非目标（v0.1 明确不做）
- 相机扩展（animations.json extension.camera）编辑。
- main.json 几何导出、.yss 二进制打包。
- 实体 CombatStats 的 NBT/capability 编辑（无配置接口）。
