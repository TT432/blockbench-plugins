# YSS 动画控制器

YesSteveSkill（YSS）专用编辑器插件：在 Blockbench 里直接编排连招（动画控制器节点图，类似蓝图）并配置攻击效果（hit.json）。

## 快速开始

1. **设置工程目录**：菜单栏 → YSS → 设置 YSS 工程目录。
   - 无内置默认路径：点「浏览…」选择你的 `<游戏目录>/config/yes_steve_skill` 目录（即 YSS 模组存放各模型 `hit.json` 的配置根目录）。
   - modelId 默认从当前工程文件名推导（去路径与 `.zip/.7z/.ysm/.bbmodel` 后缀，非法字符转 `_`），可在此覆盖。
2. 打开你的 YSM 模型工程（带攻击动画）。
3. 两个编辑器：
   - **YSS → 打开连招编辑器**：以节点图编辑工程的动画控制器（状态机）。无控制器时点「新建 YSS 控制器」（默认名 `controller.animation.yss_combat`）。
   - **YSS → 打开攻击效果编辑器**：编辑 `<根目录>/<modelId>/hit.json`。

## 连招编辑器

- 状态 = 节点，可拖拽摆放（位置随工程文件保存）；初始状态有醒目边框，可在右上角下拉切换。
- 迁移 = 有向边：从节点右侧圆点拖到目标节点创建（拖到自身 = 自环，用于连招段重置）；点击边打开条件编辑器；右键边删除。
- 条件编辑器：行式构建（AND/OR 组合，比较符 ==/!=/>/</>=/<= 或真值判断），内置 `yss.is_key_down(n)` / `yss.is_key_up(n)` / `yss.get_key(n)`（槽位 0=左键攻击、1=右键使用、2~11=自定义键 1~10）与 `query.anim_time` / `query.all_animations_finished` / `query.any_animation_finished`；提供普攻连击、长按判定等快捷模板。底部 molang 原文与构建器双向同步，解析失败时保留原文、锁定构建器，不丢手写表达式。
- 节点上动画名带 ⚔ 徽标表示该动画已在 hit.json 配置攻击效果，点击跳转攻击效果编辑器。
- 「连招模板」按钮一键生成 idle → attack_1 → attack_2 普攻连击链（条件 `yss.is_key_down(0)`）。
- 「导出控制器 JSON」导出基岩版 `animation_controllers` 格式文件，可直接放入 YSM 模型 controller 目录。
- 所有改动落在 BB 工程模型上，支持 Undo/Redo，随工程保存。

> **重要**：自定义键（槽位 2~11）默认未绑定，玩家需在 MC 控制设置 → `key.category.yessteveskill` 分类下自行绑定按键，否则 molang 按键条件永远为 0。

## 攻击效果编辑器（hit.json）

- 左栏为动画（技能）列表，支持添加（下拉选工程动画或手输）、重命名、删除。
- 每个动画可配置：
  - `segments[]` 判定段：时间窗（秒，留空=全程）、判定骨骼（多选）、去重策略（once / on_exit / interval）、damage、knockback / knockup / hitstop / interrupt（均为可选折叠，未启用则不写入 JSON）、出伤时机（instant / delayed）。段可增删、上下移动——**注意：数组顺序 = 网络协议段索引，删除/重排会改变索引语义**。
  - `caster_moves[]` 施法者位移（facing/world、impulse/sustained，向后闪避用 angle_offset=180）。
  - `hover` 滞空（duration 必须 > 0）、`root_motion` 开关。
- 底部全局区：`width_scale` / `height_scale`、`movement` 七项移动倍率、`entity_overrides` 实体属性表（anti_interrupt ∈ [0,1]、weight、hardness）。
- 保存前自动校验：时间窗倒置、duration ≤ 0、非法 scale 等**错误会阻断保存并定位到字段**；未知骨骼/动画名只给**警告**（运行时可用 YSM 资产兜底）。
- 永远写出新格式（`animation` 对象 map）；读取旧扁平格式文件时在内存中自动升级，保存后即升级完成。

## 热重载

hit.json 保存即写入 `<根目录>/<modelId>/hit.json`，YSS 双端按 mtime 失效自动热重载——**保存后立即在游戏中生效**，无需重启。旧格式升级提示见编辑器顶部徽标。
