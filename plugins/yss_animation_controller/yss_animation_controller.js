/*
 * YSS 动画控制器（yss_animation_controller）
 * YesSteveSkill 专用：连招编辑器（动画控制器节点图）+ 攻击效果编辑器（hit.json）
 * 数据模型依据：yessteveskill 仓库 hit.json schema / yss.is_key_down(n) molang 按键 API
 */
(function () {
	'use strict';

	const PLUGIN_ID = 'yss_animation_controller';
	const LS_ROOT = 'yss_ac_root_dir';
	const LS_MODEL = 'yss_ac_model_id';
	const DEFAULT_CONTROLLER_NAME = 'controller.animation.yss_combat';

	// YSS 按键槽位语义（YssCustomKeys：0=攻击/左键 1=使用/右键 2~11=自定义键1~10）
	const KEY_SLOTS = ['左键 · 攻击', '右键 · 使用'];
	for (let i = 1; i <= 10; i++) KEY_SLOTS.push('自定义键 ' + i);

	const QUERY_OPTIONS = ['query.anim_time', 'query.all_animations_finished', 'query.any_animation_finished'];
	const CMP_OPS = ['', '==', '!=', '>', '<', '>=', '<='];
	const MOVEMENT_KEYS = ['walk', 'run', 'sneak', 'swim', 'climb', 'crawl', 'jump_height'];

	// ---------- 设置 / 路径 ----------

	function getRootDir() {
		// 无内置默认路径：未设置时返回 ''，由入口守卫提示用户先设置
		return (localStorage.getItem(LS_ROOT) || '').trim();
	}
	function normalizeModelId(name) {
		// 与 YssPathHelper.normalizeModelId 对齐：去路径前缀、剥已知后缀、非法字符→_
		let id = String(name || '');
		id = id.substring(id.lastIndexOf('/') + 1);
		id = id.substring(id.lastIndexOf('\\') + 1);
		id = id.replace(/\.(zip|7z|ysm|bbmodel)$/i, '');
		return id.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
	}
	function getModelId() {
		const override = (localStorage.getItem(LS_MODEL) || '').trim();
		if (override) return normalizeModelId(override);
		if (!Project) return '';
		const base = Project.save_path
			? Project.save_path.replace(/\\/g, '/').split('/').pop()
			: (Project.name || '');
		return normalizeModelId(base);
	}
	function getHitPath() {
		if (typeof PathModule === 'undefined') return '';
		const root = getRootDir();
		if (!root) return '';
		return PathModule.join(root, getModelId(), 'hit.json');
	}

	// ---------- 文件访问（BB 5.x 插件作用域 require + 权限闸门） ----------
	// 桌面端无全局 fs；Node 模块必须经插件注入的 require 获取（native_apis.ts getModule）。
	// scope 变化（设置里改根目录）后自动重新请求授权。
	let cachedFs = null;
	let cachedFsScope = null;
	function getFs() {
		if (typeof isApp === 'undefined' || !isApp) return null; // web 兜底（variant 已是 desktop）
		if (typeof require === 'undefined') return null;
		const scope = getRootDir();
		if (!scope) return null; // 未设置工程目录：被动调用（徽标缓存等）静默跳过，入口守卫负责提示
		if (cachedFs && cachedFsScope === scope) return cachedFs;
		try {
			cachedFs = require('fs', {
				scope,
				message: '读写 YSS 工程的 hit.json，保存后游戏双端热重载',
				optional: false
			});
			cachedFsScope = scope;
		} catch (e) {
			cachedFs = null;
		}
		if (!cachedFs) {
			Blockbench.showQuickMessage('未获得文件访问权限，操作已取消（可在插件权限中允许 fs 访问）', 3000);
		}
		return cachedFs || null;
	}

	// ---------- 工程候选数据 ----------

	function getAnimationNames() {
		return (typeof Animation !== 'undefined' ? Animation.all : []).map(a => a.name);
	}
	function getBoneNames() {
		return (typeof Group !== 'undefined' ? Group.all : []).map(g => g.name);
	}

	// ---------- hit.json 数据转换 ----------

	function emptyDoc() {
		return {
			width_scale: 1.0,
			height_scale: 1.0,
			animation: {},
			entity_overrides: {},
			movement: {}
		};
	}

	function defaultSegment() {
		return {
			id: '',
			has_time: false, time_start: 0, time_end: 0,
			bones: [],
			hit_reset_mode: 'once', hit_reset_interval: 0.5,
			damage: 0,
			en_knockback: false, knockback: { power: 0, dir: 'skill', angle_offset: 0 },
			en_knockup: false, knockup_power: 0,
			en_hitstop: false,
			en_hitstop_self: true, hs_self_ticks: 2, hs_self_scale: false, hs_self_decay: 1.0,
			en_hitstop_target: true, hs_target_ticks: 3, hs_target_scale: true,
			hs_forced: false,
			en_interrupt: false, interrupt_power: 0,
			damage_timing: 'instant'
		};
	}
	function defaultCasterMove() {
		return { has_time: false, time_start: 0, time_end: 0, direction: 'facing', angle_offset: 0, power: 0, type: 'impulse' };
	}
	function defaultAnimCfg() {
		return {
			segments: [],
			caster_moves: [],
			en_hover: false, hover_duration: 1.0, hover_gravity_scale: 1.0, hover_block_input: true,
			root_motion: false
		};
	}

	// 旧扁平格式 → 新格式（parseLegacy 等价：每个动画共享 bone 集合、全程激活、once 去重）
	function upgradeLegacy(raw) {
		const doc = emptyDoc();
		if (typeof raw.width_scale === 'number') doc.width_scale = raw.width_scale;
		if (typeof raw.height_scale === 'number') doc.height_scale = raw.height_scale;
		const bones = raw.bone instanceof Array ? raw.bone.slice() : [];
		const names = raw.animation instanceof Array ? raw.animation : [];
		names.forEach(name => {
			const cfg = defaultAnimCfg();
			const seg = defaultSegment();
			seg.bones = bones.slice();
			seg.hit_reset_mode = 'once';
			cfg.segments.push(seg);
			doc.animation[String(name)] = cfg;
		});
		doc._upgraded = true;
		return doc;
	}

	function parseHitJson(raw) {
		if (!raw || typeof raw !== 'object') return emptyDoc();
		if (raw.animation instanceof Array) return upgradeLegacy(raw);
		const doc = emptyDoc();
		if (typeof raw.width_scale === 'number') doc.width_scale = raw.width_scale;
		if (typeof raw.height_scale === 'number') doc.height_scale = raw.height_scale;
		if (raw.animation && typeof raw.animation === 'object') {
			for (const name in raw.animation) {
				const src = raw.animation[name] || {};
				const cfg = defaultAnimCfg();
				if (src.segments instanceof Array) {
					cfg.segments = src.segments.map(s => {
						const seg = defaultSegment();
						if (typeof s.id === 'string') seg.id = s.id;
						if (s.time instanceof Array && s.time.length >= 2) {
							seg.has_time = true;
							seg.time_start = Number(s.time[0]);
							seg.time_end = Number(s.time[1]);
						}
						if (s.bones instanceof Array) seg.bones = s.bones.map(String);
						if (typeof s.hit_reset === 'string') {
							seg.hit_reset_mode = (s.hit_reset === 'on_exit') ? 'on_exit' : 'once';
						} else if (s.hit_reset && typeof s.hit_reset === 'object') {
							seg.hit_reset_mode = 'interval';
							seg.hit_reset_interval = Number(s.hit_reset.interval) || 0.5;
						}
						if (typeof s.damage === 'number') seg.damage = s.damage;
						if (s.knockback && typeof s.knockback === 'object') {
							seg.en_knockback = true;
							seg.knockback.power = Number(s.knockback.power) || 0;
							seg.knockback.dir = s.knockback.dir === 'radial' ? 'radial' : 'skill';
							seg.knockback.angle_offset = Number(s.knockback.angle_offset) || 0;
						}
						if (s.knockup && typeof s.knockup === 'object') {
							seg.en_knockup = true;
							seg.knockup_power = Number(s.knockup.power) || 0;
						}
						if (s.hitstop && typeof s.hitstop === 'object') {
							seg.en_hitstop = true;
							if (s.hitstop.self && typeof s.hitstop.self === 'object') {
								seg.en_hitstop_self = true;
								seg.hs_self_ticks = Number(s.hitstop.self.ticks) || 0;
								seg.hs_self_scale = !!s.hitstop.self.scale_by_target_hardness;
								seg.hs_self_decay = typeof s.hitstop.self.multi_target_decay === 'number' ? s.hitstop.self.multi_target_decay : 1.0;
							} else seg.en_hitstop_self = false;
							if (s.hitstop.target && typeof s.hitstop.target === 'object') {
								seg.en_hitstop_target = true;
								seg.hs_target_ticks = Number(s.hitstop.target.ticks) || 0;
								seg.hs_target_scale = s.hitstop.target.scale_by_hardness !== false;
							} else seg.en_hitstop_target = false;
							seg.hs_forced = !!s.hitstop.forced;
						}
						if (s.interrupt && typeof s.interrupt === 'object') {
							seg.en_interrupt = true;
							seg.interrupt_power = Number(s.interrupt.power) || 0;
						}
						if (s.damage_timing === 'delayed') seg.damage_timing = 'delayed';
						return seg;
					});
				}
				if (src.caster_moves instanceof Array) {
					cfg.caster_moves = src.caster_moves.map(m => {
						const cm = defaultCasterMove();
						if (m.time instanceof Array && m.time.length >= 2) {
							cm.has_time = true;
							cm.time_start = Number(m.time[0]);
							cm.time_end = Number(m.time[1]);
						}
						if (m.direction === 'world') cm.direction = 'world';
						cm.angle_offset = Number(m.angle_offset) || 0;
						cm.power = Number(m.power) || 0;
						if (m.type === 'sustained') cm.type = 'sustained';
						return cm;
					});
				}
				if (src.hover && typeof src.hover === 'object') {
					cfg.en_hover = true;
					cfg.hover_duration = Number(src.hover.duration) || 0;
					cfg.hover_gravity_scale = typeof src.hover.gravity_scale === 'number' ? s_clamp01(src.hover.gravity_scale) : 1.0;
					cfg.hover_block_input = src.hover.block_input !== false;
				}
				cfg.root_motion = !!src.root_motion;
				doc.animation[name] = cfg;
			}
		}
		if (raw.entity_overrides && typeof raw.entity_overrides === 'object') {
			for (const key in raw.entity_overrides) {
				const e = raw.entity_overrides[key] || {};
				doc.entity_overrides[key] = {
					anti_interrupt: s_clamp01(Number(e.anti_interrupt) || 0),
					weight: Math.max(0, Number(e.weight) || 0),
					hardness: Math.max(0, Number(e.hardness) || 0)
				};
			}
		}
		if (raw.movement && typeof raw.movement === 'object') {
			MOVEMENT_KEYS.forEach(k => {
				if (typeof raw.movement[k] === 'number' && isFinite(raw.movement[k]) && raw.movement[k] >= 0) {
					doc.movement[k] = raw.movement[k];
				}
			});
		}
		return doc;
	}

	function s_clamp01(v) { return Math.min(1, Math.max(0, v)); }

	// 序列化：§2.3 省略语义——未启用的 optional 对象整体省略
	function serializeHitJson(doc) {
		const out = {};
		if (doc.width_scale !== 1.0) out.width_scale = doc.width_scale;
		if (doc.height_scale !== 1.0) out.height_scale = doc.height_scale;
		const animation = {};
		for (const name in doc.animation) {
			const cfg = doc.animation[name];
			const o = {};
			if (cfg.segments.length) {
				o.segments = cfg.segments.map(seg => {
					const s = {};
					if (seg.id) s.id = seg.id;
					if (seg.has_time) s.time = [seg.time_start, seg.time_end];
					if (seg.bones.length) s.bones = seg.bones.slice();
					if (seg.hit_reset_mode === 'interval') {
						s.hit_reset = { type: 'interval', interval: seg.hit_reset_interval };
					} else if (seg.hit_reset_mode === 'on_exit') {
						s.hit_reset = 'on_exit';
					}
					if (seg.damage !== 0) s.damage = seg.damage;
					if (seg.en_knockback) {
						const kb = { power: seg.knockback.power };
						if (seg.knockback.dir !== 'skill') kb.dir = seg.knockback.dir;
						if (seg.knockback.angle_offset !== 0) kb.angle_offset = seg.knockback.angle_offset;
						s.knockback = kb;
					}
					if (seg.en_knockup) s.knockup = { power: seg.knockup_power };
					if (seg.en_hitstop) {
						const hs = {};
						if (seg.en_hitstop_self) {
							const self = { ticks: seg.hs_self_ticks };
							if (seg.hs_self_scale) self.scale_by_target_hardness = true;
							if (seg.hs_self_decay !== 1.0) self.multi_target_decay = seg.hs_self_decay;
							hs.self = self;
						}
						if (seg.en_hitstop_target) {
							const target = { ticks: seg.hs_target_ticks };
							if (!seg.hs_target_scale) target.scale_by_hardness = false;
							hs.target = target;
						}
						if (seg.hs_forced) hs.forced = true;
						s.hitstop = hs;
					}
					if (seg.en_interrupt) s.interrupt = { power: seg.interrupt_power };
					if (seg.damage_timing !== 'instant') s.damage_timing = seg.damage_timing;
					return s;
				});
			}
			if (cfg.caster_moves.length) {
				o.caster_moves = cfg.caster_moves.map(cm => {
					const m = {};
					if (cm.has_time) m.time = [cm.time_start, cm.time_end];
					if (cm.direction !== 'facing') m.direction = cm.direction;
					if (cm.angle_offset !== 0) m.angle_offset = cm.angle_offset;
					if (cm.power !== 0) m.power = cm.power;
					if (cm.type !== 'impulse') m.type = cm.type;
					return m;
				});
			}
			if (cfg.en_hover) {
				const h = { duration: cfg.hover_duration };
				if (cfg.hover_gravity_scale !== 1.0) h.gravity_scale = cfg.hover_gravity_scale;
				if (!cfg.hover_block_input) h.block_input = false;
				o.hover = h;
			}
			if (cfg.root_motion) o.root_motion = true;
			animation[name] = o;
		}
		out.animation = animation;
		const overrides = {};
		let hasOverrides = false;
		for (const key in doc.entity_overrides) {
			const e = doc.entity_overrides[key];
			overrides[key] = { anti_interrupt: s_clamp01(e.anti_interrupt), weight: e.weight, hardness: e.hardness };
			hasOverrides = true;
		}
		if (hasOverrides) out.entity_overrides = overrides;
		const movement = {};
		let hasMovement = false;
		MOVEMENT_KEYS.forEach(k => {
			const v = doc.movement[k];
			if (typeof v === 'number' && v !== 1.0) { movement[k] = v; hasMovement = true; }
		});
		if (hasMovement) out.movement = movement;
		return out;
	}

	// §2.4 校验：errors 阻断保存；warnings 允许保存
	function validateHitJson(doc, boneSet, animNameSet) {
		const errors = [];
		const warnings = [];
		const isNum = v => typeof v === 'number' && isFinite(v);
		for (const name in doc.animation) {
			const cfg = doc.animation[name];
			if (animNameSet && !animNameSet.has(name)) {
				warnings.push({ anim: name, msg: `动画「${name}」不在当前工程动画列表中（运行时可由 animations.json / YSM 资产兜底）` });
			}
			cfg.segments.forEach((seg, i) => {
				const at = `${name} → 段 ${i + 1}`;
				if (seg.has_time) {
					if (!isNum(seg.time_start) || !isNum(seg.time_end)) {
						errors.push({ anim: name, seg: i, msg: `${at}：time 必须是有限数字` });
					} else if (seg.time_end < seg.time_start) {
						errors.push({ anim: name, seg: i, msg: `${at}：time.end (${seg.time_end}) 必须 ≥ time.start (${seg.time_start})` });
					}
				}
				if (!isNum(seg.damage)) errors.push({ anim: name, seg: i, msg: `${at}：damage 必须是有限数字` });
				if (seg.en_knockback && !isNum(seg.knockback.power)) errors.push({ anim: name, seg: i, msg: `${at}：knockback.power 必须是有限数字` });
				if (seg.en_knockup && !isNum(seg.knockup_power)) errors.push({ anim: name, seg: i, msg: `${at}：knockup.power 必须是有限数字` });
				if (seg.en_interrupt && !isNum(seg.interrupt_power)) errors.push({ anim: name, seg: i, msg: `${at}：interrupt.power 必须是有限数字` });
				if (seg.hit_reset_mode === 'interval' && !isNum(seg.hit_reset_interval)) errors.push({ anim: name, seg: i, msg: `${at}：hit_reset 冷却秒数必须是有限数字` });
				seg.bones.forEach(b => {
					if (boneSet && !boneSet.has(b)) {
						warnings.push({ anim: name, seg: i, msg: `${at}：骨骼「${b}」不在当前工程骨骼集中（运行时可用 YSM 模型几何兜底）` });
					}
				});
			});
			cfg.caster_moves.forEach((cm, i) => {
				if (cm.has_time && isNum(cm.time_start) && isNum(cm.time_end) && cm.time_end < cm.time_start) {
					errors.push({ anim: name, msg: `${name} → 位移 ${i + 1}：time.end 必须 ≥ time.start` });
				}
				if (!isNum(cm.power)) errors.push({ anim: name, msg: `${name} → 位移 ${i + 1}：power 必须是有限数字` });
			});
			if (cfg.en_hover && !(isNum(cfg.hover_duration) && cfg.hover_duration > 0)) {
				errors.push({ anim: name, msg: `${name}：hover.duration 必须 > 0` });
			}
		}
		if (!(isNum(doc.width_scale) && doc.width_scale > 0)) errors.push({ msg: 'width_scale 必须 > 0' });
		if (!(isNum(doc.height_scale) && doc.height_scale > 0)) errors.push({ msg: 'height_scale 必须 > 0' });
		for (const key in doc.entity_overrides) {
			if (!/^[^\s:]+:[^\s:]+$/.test(key)) {
				warnings.push({ msg: `entity_overrides key「${key}」不符合 namespace:path 形式` });
			}
		}
		return { errors, warnings };
	}

	// ---------- molang 条件构建器 ----------

	// operand: {kind:'key', func, slot} | {kind:'query', name} | {kind:'number', value} | {kind:'raw', text}
	function operandToString(op) {
		if (!op) return '';
		switch (op.kind) {
			case 'key': return `yss.${op.func}(${op.slot})`;
			case 'query': return op.name;
			case 'number': return String(op.value);
			default: return op.text || '';
		}
	}
	function parseOperand(text) {
		text = text.trim();
		let m = text.match(/^yss\.(is_key_down|is_key_up|get_key)\(\s*(\d+)\s*\)$/);
		if (m) return { kind: 'key', func: m[1], slot: Math.min(11, Math.max(0, parseInt(m[2]))) };
		if (/^query\.[\w.]+$/.test(text)) return { kind: 'query', name: text };
		if (/^-?\d+(\.\d+)?$/.test(text)) return { kind: 'number', value: parseFloat(text) };
		if (text) return { kind: 'raw', text };
		return null;
	}
	// row: {join:'&&'|'||', left, cmp, right}
	function buildCondition(rows) {
		return rows.map((row, i) => {
			let seg = operandToString(row.left);
			if (row.cmp) seg += ` ${row.cmp} ${operandToString(row.right)}`;
			return i ? `${row.join} ${seg}` : seg;
		}).join(' ');
	}
	function parseCondition(text) {
		text = (text || '').trim();
		if (!text) return { ok: true, rows: [] };
		// 顶层（括号深度 0）按 && / || 切分
		const parts = [];
		let depth = 0, cur = '', i = 0;
		while (i < text.length) {
			const c = text[i];
			if (c === '(') depth++;
			else if (c === ')') { depth--; if (depth < 0) return { ok: false }; }
			if (depth === 0 && (c === '&' && text[i + 1] === '&' || c === '|' && text[i + 1] === '|')) {
				parts.push({ expr: cur.trim(), join: c === '&' ? '&&' : '||' });
				cur = ''; i += 2; continue;
			}
			cur += c; i++;
		}
		if (depth !== 0) return { ok: false };
		parts.push({ expr: cur.trim(), join: '' });
		const rows = [];
		for (let idx = 0; idx < parts.length; idx++) {
			const p = parts[idx];
			if (!p.expr) return { ok: false };
			const m = p.expr.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
			let row;
			if (m) {
				const left = parseOperand(m[1]);
				const right = parseOperand(m[3]);
				if (!left || !right) return { ok: false };
				row = { join: idx ? p.join : '&&', left, cmp: m[2], right };
			} else {
				const left = parseOperand(p.expr);
				if (!left) return { ok: false };
				row = { join: idx ? p.join : '&&', left, cmp: '', right: { kind: 'number', value: 1 } };
			}
			rows.push(row);
		}
		return { ok: true, rows };
	}

	// ---------- 工程命名空间布局存储（随工程保存，经 ModelProject Property） ----------

	function ensureLayout(project) {
		// Property 默认值为共享 {}，先深拷贝脱离引用，避免污染其它工程
		project.yss_layout = project.yss_layout ? JSON.parse(JSON.stringify(project.yss_layout)) : {};
		return project.yss_layout;
	}
	function getLayout(controllerUuid) {
		if (!Project) return {};
		if (!Project.yss_layout) Project.yss_layout = {};
		if (!Project.yss_layout[controllerUuid]) Project.yss_layout[controllerUuid] = {};
		return Project.yss_layout[controllerUuid];
	}
	function saveNodePos(controllerUuid, stateUuid, x, y) {
		const layout = ensureLayout(Project);
		if (!layout[controllerUuid]) layout[controllerUuid] = {};
		layout[controllerUuid][stateUuid] = { x, y };
	}
	// #109 编组/泛用迁移：编辑期结构，持久化在 yss_layout 的保留键下（与状态 uuid 不冲突）
	const LAYOUT_GROUPS_KEY = '__groups';
	const LAYOUT_UNIVERSAL_KEY = '__universal';
	function saveGraphExtras(controllerUuid, groups, universal) {
		const layout = ensureLayout(Project);
		if (!layout[controllerUuid]) layout[controllerUuid] = {};
		layout[controllerUuid][LAYOUT_GROUPS_KEY] = JSON.parse(JSON.stringify(groups));
		layout[controllerUuid][LAYOUT_UNIVERSAL_KEY] = JSON.parse(JSON.stringify(universal));
	}

	// ---------- Undo 辅助（铁律：initEdit 后按 uuid 重查 state） ----------

	function findController(uuid) {
		return AnimationController.all.find(c => c.uuid === uuid);
	}
	function findState(controllerUuid, stateUuid) {
		const c = findController(controllerUuid);
		return c && c.states.find(s => s.uuid === stateUuid);
	}
	function editController(controllerUuid, label, fn) {
		const controller = findController(controllerUuid);
		if (!controller) return;
		Undo.initEdit({ animation_controllers: [controller] });
		const c2 = findController(controllerUuid);
		fn(c2);
		Undo.finishEdit(label);
	}
	function editState(controllerUuid, stateUuid, label, fn) {
		const state = findState(controllerUuid, stateUuid);
		if (!state) return;
		Undo.initEdit({ animation_controller_state: state });
		const s2 = findState(controllerUuid, stateUuid);
		if (s2) fn(s2);
		Undo.finishEdit(label);
	}

	// ---------- 共享状态 ----------

	let hitDialog = null;
	let comboDialog = null;
	let conditionDialog = null;
	let settingsDialog = null;
	let yssMenu = null;
	let cssHandle = null;
	let layoutProperty = null;
	const eventHandles = [];
	const actions = [];
	let hitKeyCache = {}; // 连招编辑器徽标联动用的 hit.json keys → 概要

	function refreshHitKeyCache() {
		hitKeyCache = {};
		try {
			const fs = getFs();
			if (!fs) return;
			const path = getHitPath();
			if (!path || !fs.existsSync(path)) return;
			const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
			if (raw && raw.animation && !(raw.animation instanceof Array)) {
				for (const name in raw.animation) {
					const cfg = raw.animation[name] || {};
					const segs = cfg.segments instanceof Array ? cfg.segments : [];
					hitKeyCache[name] = {
						segments: segs.length,
						damage: segs.reduce((sum, s) => sum + (Number(s.damage) || 0), 0)
					};
				}
			} else if (raw && raw.animation instanceof Array) {
				raw.animation.forEach(name => { hitKeyCache[String(name)] = { segments: 1, damage: 0 }; });
			}
		} catch (e) { /* 缓存失败不影响编辑器 */ }
	}

	// ---------- CSS ----------

	const CSS = `
.yss-ac-body { display: flex; flex-direction: column; gap: 6px; height: 560px; font-size: 12px; }
/* #106：对话框被拉大/缩小时内容跟随。dialog_content 改为 flex 列，body 作为 flex 项填充；
   未手动调整尺寸时 dialog 高度为 auto，body 的 height:560px 决定初始高度 */
#yss_ac_combo_editor .dialog_wrapper { display: flex; flex-direction: column; min-height: 0; }
#yss_ac_combo_editor .dialog_content { display: flex; flex-direction: column; min-height: 0; }
#yss_ac_combo_editor .yss-ac-body { flex: 1 1 auto; min-height: 0; }
.yss-ac-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding-bottom: 4px; border-bottom: 1px solid var(--color-border); }
.yss-ac-toolbar .spacer { flex: 1; }
.yss-ac-main { display: flex; gap: 8px; flex: 1; min-height: 0; }
.yss-ac-list { width: 200px; min-width: 200px; overflow-y: auto; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-back); }
.yss-ac-list-item { padding: 6px 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 4px; border-bottom: 1px solid var(--color-border); }
.yss-ac-list-item:hover { background: var(--color-button); }
.yss-ac-list-item.selected { background: var(--color-accent); color: var(--color-accent-text); }
.yss-ac-badge { background: var(--color-accent); color: var(--color-accent-text); border-radius: 8px; padding: 0 6px; font-size: 11px; }
.yss-ac-list-item.selected .yss-ac-badge { background: rgba(0,0,0,0.35); }
.yss-ac-detail { flex: 1; overflow-y: auto; padding-right: 4px; }
.yss-ac-card { border: 1px solid var(--color-border); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--color-ui); }
.yss-ac-card h4 { margin: 0 0 6px 0; display: flex; align-items: center; gap: 6px; }
.yss-ac-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 4px 0; }
.yss-ac-row label { display: flex; gap: 4px; align-items: center; white-space: nowrap; }
.yss-ac-row input[type=number], .yss-ac-row input[type=text] { width: 90px; }
.yss-ac-row input.short { width: 60px; }
.yss-ac-chips { display: inline-flex; gap: 4px; flex-wrap: wrap; }
.yss-ac-chip { background: var(--color-button); border: 1px solid var(--color-border); border-radius: 10px; padding: 1px 8px; cursor: default; }
.yss-ac-chip .x { cursor: pointer; margin-left: 4px; color: var(--color-subtle_text); }
.yss-ac-chip .x:hover { color: var(--color-error); }
.yss-ac-fold { border: 1px dashed var(--color-border); border-radius: 4px; padding: 4px 8px; margin: 4px 0; }
.yss-ac-msg-error { color: var(--color-error); cursor: pointer; }
.yss-ac-msg-warn { color: var(--color-warning, #e6a23c); }
.yss-ac-hint { color: var(--color-subtle_text); font-size: 11px; }
.yss-ac-graph-wrap { flex: 1; min-width: 0; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-back); overflow: hidden; position: relative; }
.yss-ac-graph-wrap svg { width: 100%; height: 100%; display: block; }
.yss-ac-node rect.body { fill: var(--color-ui); stroke: var(--color-border); stroke-width: 1.5; rx: 8; cursor: grab; }
.yss-ac-node.initial rect.body { stroke: var(--color-accent); stroke-width: 3; }
.yss-ac-node.selected rect.body { stroke: var(--color-accent); stroke-dasharray: 5 3; stroke-width: 2.5; }
.yss-ac-node text { fill: var(--color-text); font-size: 12px; pointer-events: none; }
.yss-ac-node text.sub { fill: var(--color-subtle_text); font-size: 10px; }
.yss-ac-node .port { fill: var(--color-accent); cursor: crosshair; }
.yss-ac-edge { stroke: var(--color-subtle_text); stroke-width: 1.8; fill: none; cursor: pointer; }
.yss-ac-edge:hover { stroke: var(--color-accent); }
.yss-ac-edge-label { fill: var(--color-text); font-size: 10px; paint-order: stroke; stroke: var(--color-back); stroke-width: 3; cursor: pointer; }
.yss-ac-hit-badge { fill: var(--color-accent); cursor: pointer; }
.yss-ac-hit-badge-text { fill: var(--color-accent-text); font-size: 9px; pointer-events: none; }
.yss-ac-props { width: 250px; min-width: 250px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid var(--color-border); border-radius: 4px; padding: 8px; background: var(--color-ui); }
.yss-ac-props textarea { width: 100%; min-height: 48px; }
/* #106：属性面板内部分区——上部固定、文本域吃掉剩余高度并自滚、底部按钮固定可见 */
.yss-ac-props .props-fixed { flex: 0 1 auto; min-height: 0; overflow-y: auto; }
.yss-ac-props .anim-chips { max-height: 92px; overflow-y: auto; }
.yss-ac-props .props-grow { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
.yss-ac-props .props-grow textarea { flex: 1 1 auto; min-height: 36px; resize: none; overflow-y: auto; }
.yss-ac-props .yss-ac-btn-row { flex: 0 0 auto; }
/* #109 编组包围盒 */
.yss-ac-group rect.body { fill: var(--color-accent); fill-opacity: 0.07; stroke: var(--color-accent); stroke-dasharray: 6 4; stroke-width: 1.5; cursor: grab; }
.yss-ac-group.selected rect.body { fill-opacity: 0.14; stroke-width: 2.5; stroke-dasharray: none; }
.yss-ac-group > text { fill: var(--color-accent); font-size: 12px; pointer-events: none; }
.yss-ac-group .port { fill: var(--color-accent); cursor: crosshair; }
.yss-ac-uni-port { fill: var(--color-warning, #e6a23c); stroke: var(--color-back); stroke-width: 1; }
/* #107 视图控制按钮 */
.yss-ac-view-btns { position: absolute; right: 8px; bottom: 8px; display: flex; gap: 4px; z-index: 2; }
.yss-ac-view-btns button { opacity: 0.85; font-size: 11px; padding: 2px 8px; }
.yss-ac-btn-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
`;

	// ---------- 攻击效果编辑器 ----------

	function openHitEditor(selectAnim) {
		if (!Project) { Blockbench.showQuickMessage('请先打开一个工程', 2000); return; }
		if (typeof isApp === 'undefined' || !isApp) { Blockbench.showQuickMessage('此插件仅支持桌面版', 2000); return; }
		if (!getRootDir()) {
			Blockbench.showQuickMessage('请先设置 YSS 工程目录', 2500);
			openSettingsDialog();
			return;
		}
		if (hitDialog) { hitDialog.close(); hitDialog = null; }
		refreshHitKeyCache();

		const animCfgKeys = () => Object.keys(hitDialog.content_vue.doc.animation);

		hitDialog = new Dialog({
			id: 'yss_ac_hit_editor',
			title: 'YSS 攻击效果编辑器（hit.json）',
			width: 980,
			resizable: true,
			buttons: [],
			component: {
				data() {
					return {
						doc: emptyDoc(),
						selected: '',
						loaded: false,
						file_exists: false,
						upgraded: false,
						newAnimName: '',
						renameTarget: '',
						global_open: false,
						newOverrideKey: '',
						segIndex: -1
					};
				},
				computed: {
					animNames() {
						const set = new Set(getAnimationNames().concat(Object.keys(this.doc.animation)));
						return [...set];
					},
					boneNames() { return getBoneNames(); },
					cfg() { return this.doc.animation[this.selected] || null; },
					validation() {
						return validateHitJson(this.doc, new Set(getBoneNames()), new Set(getAnimationNames()));
					},
					path() { return getHitPath(); },
					modelId() { return getModelId(); },
					keySlotsMovement() { return MOVEMENT_KEYS; }
				},
				methods: {
					load() {
						const fs = getFs();
						if (!fs) return;
						const path = getHitPath();
						this.loaded = true;
						this.upgraded = false;
						if (!fs.existsSync(path)) {
							this.doc = emptyDoc();
							this.file_exists = false;
							this.selected = '';
							return;
						}
						try {
							const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
							this.doc = parseHitJson(raw);
							this.upgraded = !!this.doc._upgraded;
							delete this.doc._upgraded;
							this.file_exists = true;
							if (!this.doc.animation[this.selected]) this.selected = Object.keys(this.doc.animation)[0] || '';
							Blockbench.showQuickMessage('已加载 hit.json', 1500);
						} catch (e) {
							Blockbench.showMessageBox({ title: '解析失败', message: 'hit.json 不是合法 JSON：\n' + e.message });
						}
					},
					save() {
						const v = this.validation;
						if (v.errors.length) {
							this.locate(v.errors[0]);
							Blockbench.showMessageBox({
								title: '校验错误，已阻断保存',
								message: v.errors.slice(0, 8).map(e => '• ' + e.msg).join('\n')
									+ (v.errors.length > 8 ? `\n…共 ${v.errors.length} 条` : '')
							});
							return;
						}
						const out = serializeHitJson(this.doc);
						const fs = getFs();
						if (!fs) return;
						try {
							fs.mkdirSync(PathModule.dirname(getHitPath()), { recursive: true });
							fs.writeFileSync(getHitPath(), JSON.stringify(out, null, 2), 'utf8');
							this.file_exists = true;
							refreshHitKeyCache();
							Blockbench.showQuickMessage(
								'已保存 hit.json（游戏内热重载自动生效）'
									+ (v.warnings.length ? `；${v.warnings.length} 条警告` : ''), 2500);
						} catch (e) {
							Blockbench.showMessageBox({ title: '写入失败', message: e.message });
						}
					},
					locate(item) {
						if (item.anim && this.doc.animation[item.anim]) {
							this.selected = item.anim;
							if (typeof item.seg === 'number') this.segIndex = item.seg;
							this.$nextTick(() => {
								const el = this.$el.querySelector(`[data-seg="${item.seg}"]`) || this.$el.querySelector('.yss-ac-detail');
								if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' });
							});
						}
					},
					select(name) { this.selected = name; this.segIndex = -1; },
					addAnim(name) {
						name = (name || this.newAnimName || '').trim();
						if (!name) return;
						if (this.doc.animation[name]) { this.selected = name; return; }
						this.$set(this.doc.animation, name, defaultAnimCfg());
						this.newAnimName = '';
						this.selected = name;
					},
					renameAnim() {
						const to = this.renameTarget.trim();
						if (!to || to === this.selected || this.doc.animation[to]) return;
						const cfg = this.doc.animation[this.selected];
						const nobj = {};
						for (const k in this.doc.animation) nobj[k === this.selected ? to : k] = this.doc.animation[k];
						this.doc.animation = nobj;
						this.selected = to;
						this.renameTarget = '';
					},
					removeAnim(name) {
						this.$delete(this.doc.animation, name);
						if (this.selected === name) this.selected = Object.keys(this.doc.animation)[0] || '';
					},
					addSegment() { this.cfg.segments.push(defaultSegment()); },
					removeSegment(i) { this.cfg.segments.splice(i, 1); },
					moveSegment(i, dir) {
						const j = i + dir;
						if (j < 0 || j >= this.cfg.segments.length) return;
						const arr = this.cfg.segments;
						[arr[i], arr[j]] = [arr[j], arr[i]];
					},
					addBone(seg, event) {
						const v = event.target.value;
						if (v && !seg.bones.includes(v)) seg.bones.push(v);
						event.target.value = '';
					},
					addMove() { this.cfg.caster_moves.push(defaultCasterMove()); },
					addOverride() {
						const key = this.newOverrideKey.trim();
						if (!key || this.doc.entity_overrides[key]) return;
						this.$set(this.doc.entity_overrides, key, { anti_interrupt: 0, weight: 0, hardness: 0 });
						this.newOverrideKey = '';
					},
					clampAnti(e) { e.anti_interrupt = s_clamp01(Number(e.anti_interrupt) || 0); },
					keySlots() { return KEY_SLOTS; }
				},
				mounted() {
					this.load();
					if (selectAnim && this.doc.animation[selectAnim]) this.selected = selectAnim;
				},
				template: `
<div class="yss-ac-body">
	<div class="yss-ac-toolbar">
		<span class="yss-ac-hint">路径：{{ path }}</span>
		<span v-if="!file_exists && loaded" class="yss-ac-badge">新文件</span>
		<span v-if="upgraded" class="yss-ac-badge" title="旧扁平格式已在内存中升级为对象 map 格式">旧格式已升级</span>
		<span class="spacer"></span>
		<button @click="load">重新加载</button>
		<button class="accented" @click="save">保存 hit.json</button>
	</div>
	<div class="yss-ac-toolbar">
		<span class="yss-ac-hint">modelId：{{ modelId }}（在「设置 YSS 工程目录」中可覆盖）</span>
		<span class="spacer"></span>
		<span class="yss-ac-hint">⚠ segments / caster_moves 数组顺序 = 网络协议索引，删除/重排会改变索引语义</span>
	</div>
	<div class="yss-ac-main">
		<div class="yss-ac-list">
			<div v-for="name in Object.keys(doc.animation)" :key="name"
				class="yss-ac-list-item" :class="{selected: name === selected}" @click="select(name)">
				<span style="overflow:hidden;text-overflow:ellipsis">{{ name }}</span>
				<span class="yss-ac-badge">{{ doc.animation[name].segments.length }} 段</span>
			</div>
			<div style="padding:6px">
				<input type="text" v-model="newAnimName" list="yss-ac-anim-names" placeholder="动画名（下拉或手输）" style="width:100%" @keyup.enter="addAnim()"/>
				<datalist id="yss-ac-anim-names"><option v-for="n in animNames" :value="n" :key="n"/></datalist>
				<button style="width:100%;margin-top:4px" @click="addAnim()">添加动画条目</button>
			</div>
		</div>
		<div class="yss-ac-detail" v-if="cfg">
			<div class="yss-ac-card">
				<h4>动画条目：{{ selected }}
					<span class="spacer" style="flex:1"></span>
					<input type="text" v-model="renameTarget" placeholder="重命名为…" style="width:120px"/>
					<button @click="renameAnim">重命名</button>
					<button @click="removeAnim(selected)" style="color:var(--color-error)">删除</button>
				</h4>
				<div class="yss-ac-row">
					<label><input type="checkbox" v-model="cfg.root_motion"/> root_motion（Root 位移转实体位移）</label>
				</div>
			</div>

			<div class="yss-ac-card">
				<h4>判定段 segments <button @click="addSegment">+ 添加段</button></h4>
				<div v-for="(seg, i) in cfg.segments" :key="i" class="yss-ac-card" :data-seg="i"
					:style="segIndex === i ? 'border-color: var(--color-error)' : ''">
					<div class="yss-ac-row">
						<b>#{{ i }}</b>
						<label>id <input type="text" v-model="seg.id" class="short" placeholder="按索引自动"/></label>
						<label><input type="checkbox" v-model="seg.has_time"/> 时间窗</label>
						<template v-if="seg.has_time">
							<label>start <input type="number" step="0.05" v-model.number="seg.time_start" class="short"/></label>
							<label>end <input type="number" step="0.05" v-model.number="seg.time_end" class="short"/></label>
							<span v-if="seg.time_end < seg.time_start" class="yss-ac-msg-error">end 必须 ≥ start</span>
						</template>
						<span v-else class="yss-ac-hint">全程激活</span>
						<span style="flex:1"></span>
						<button title="上移（⚠ 改变协议索引）" @click="moveSegment(i, -1)">↑</button>
						<button title="下移（⚠ 改变协议索引）" @click="moveSegment(i, 1)">↓</button>
						<button @click="removeSegment(i)" style="color:var(--color-error)">删</button>
					</div>
					<div class="yss-ac-row">
						<span>判定骨骼：</span>
						<span class="yss-ac-chips">
							<span v-for="b in seg.bones" :key="b" class="yss-ac-chip">{{ b }}<span class="x" @click="seg.bones.remove(b)">×</span></span>
						</span>
						<select @change="addBone(seg, $event)">
							<option value="">+ 添加骨骼</option>
							<option v-for="b in boneNames" :value="b" :key="b">{{ b }}</option>
						</select>
					</div>
					<div class="yss-ac-row">
						<label>去重
							<select v-model="seg.hit_reset_mode">
								<option value="once">once（仅一次）</option>
								<option value="on_exit">on_exit（离开再进入）</option>
								<option value="interval">interval（冷却）</option>
							</select>
						</label>
						<label v-if="seg.hit_reset_mode === 'interval'">冷却秒 <input type="number" step="0.1" v-model.number="seg.hit_reset_interval" class="short"/></label>
						<label>damage <input type="number" step="0.5" v-model.number="seg.damage" class="short"/></label>
						<label>出伤时机
							<select v-model="seg.damage_timing">
								<option value="instant">instant（命中即伤）</option>
								<option value="delayed">delayed（停帧后出伤）</option>
							</select>
						</label>
					</div>
					<div class="yss-ac-fold">
						<label><input type="checkbox" v-model="seg.en_knockback"/> knockback 击退</label>
						<div v-if="seg.en_knockback" class="yss-ac-row">
							<label>power <input type="number" step="0.1" v-model.number="seg.knockback.power" class="short"/></label>
							<label>方向
								<select v-model="seg.knockback.dir">
									<option value="skill">skill（施法者朝向）</option>
									<option value="radial">radial（径向）</option>
								</select>
							</label>
							<label>angle_offset° <input type="number" v-model.number="seg.knockback.angle_offset" class="short"/></label>
						</div>
					</div>
					<div class="yss-ac-fold">
						<label><input type="checkbox" v-model="seg.en_knockup"/> knockup 击飞（服务端滞空钳制 [10,60] tick）</label>
						<div v-if="seg.en_knockup" class="yss-ac-row">
							<label>power <input type="number" step="0.1" v-model.number="seg.knockup_power" class="short"/></label>
						</div>
					</div>
					<div class="yss-ac-fold">
						<label><input type="checkbox" v-model="seg.en_hitstop"/> hitstop 停帧</label>
						<div v-if="seg.en_hitstop">
							<div class="yss-ac-row">
								<label><input type="checkbox" v-model="seg.en_hitstop_self"/> self</label>
								<template v-if="seg.en_hitstop_self">
									<label>ticks <input type="number" v-model.number="seg.hs_self_ticks" class="short"/></label>
									<label><input type="checkbox" v-model="seg.hs_self_scale"/> 按目标硬度缩放</label>
									<label>多目标衰减 <input type="number" step="0.1" v-model.number="seg.hs_self_decay" class="short"/></label>
								</template>
							</div>
							<div class="yss-ac-row">
								<label><input type="checkbox" v-model="seg.en_hitstop_target"/> target</label>
								<template v-if="seg.en_hitstop_target">
									<label>ticks <input type="number" v-model.number="seg.hs_target_ticks" class="short"/></label>
									<label><input type="checkbox" v-model="seg.hs_target_scale"/> 按硬度缩放</label>
								</template>
								<label><input type="checkbox" v-model="seg.hs_forced"/> forced（无视硬度）</label>
							</div>
						</div>
					</div>
					<div class="yss-ac-fold">
						<label><input type="checkbox" v-model="seg.en_interrupt"/> interrupt 打断</label>
						<div v-if="seg.en_interrupt" class="yss-ac-row">
							<label>power <input type="number" step="0.1" v-model.number="seg.interrupt_power" class="short"/></label>
						</div>
					</div>
				</div>
			</div>

			<div class="yss-ac-card">
				<h4>施法者位移 caster_moves <button @click="addMove">+ 添加位移</button></h4>
				<div v-for="(cm, i) in cfg.caster_moves" :key="i" class="yss-ac-card">
					<div class="yss-ac-row">
						<b>#{{ i }}</b>
						<label><input type="checkbox" v-model="cm.has_time"/> 时间窗</label>
						<template v-if="cm.has_time">
							<label>start <input type="number" step="0.05" v-model.number="cm.time_start" class="short"/></label>
							<label>end <input type="number" step="0.05" v-model.number="cm.time_end" class="short"/></label>
						</template>
						<label>方向
							<select v-model="cm.direction">
								<option value="facing">facing（朝向+偏移）</option>
								<option value="world">world（世界角度）</option>
							</select>
						</label>
						<label>angle_offset° <input type="number" v-model.number="cm.angle_offset" class="short" title="向后闪避=180"/></label>
						<label>power <input type="number" step="0.1" v-model.number="cm.power" class="short"/></label>
						<label>类型
							<select v-model="cm.type">
								<option value="impulse">impulse（单次）</option>
								<option value="sustained">sustained（持续）</option>
							</select>
						</label>
						<button @click="cfg.caster_moves.splice(i,1)" style="color:var(--color-error)">删</button>
					</div>
				</div>
			</div>

			<div class="yss-ac-card">
				<h4><label><input type="checkbox" v-model="cfg.en_hover"/> hover 滞空</label></h4>
				<div v-if="cfg.en_hover" class="yss-ac-row">
					<label>duration 秒 <input type="number" step="0.1" v-model.number="cfg.hover_duration" class="short"/></label>
					<span v-if="!(cfg.hover_duration > 0)" class="yss-ac-msg-error">duration 必须 > 0</span>
					<label>gravity_scale <input type="number" step="0.1" min="0" max="1" v-model.number="cfg.hover_gravity_scale" class="short"/></label>
					<label><input type="checkbox" v-model="cfg.hover_block_input"/> block_input（拦截 WASD）</label>
				</div>
			</div>
		</div>
		<div class="yss-ac-detail" v-else>
			<p class="yss-ac-hint" style="padding:12px">左侧添加或选择一个动画条目开始配置攻击效果。</p>
		</div>
	</div>
	<div class="yss-ac-card">
		<h4 @click="global_open = !global_open" style="cursor:pointer">{{ global_open ? '▾' : '▸' }} 全局设置（width/height_scale、movement、entity_overrides）</h4>
		<div v-if="global_open">
			<div class="yss-ac-row">
				<label>width_scale <input type="number" step="0.1" v-model.number="doc.width_scale" class="short"/></label>
				<label>height_scale <input type="number" step="0.1" v-model.number="doc.height_scale" class="short"/></label>
			</div>
			<div class="yss-ac-row">
				<span>movement：</span>
				<label v-for="k in keySlotsMovement" :key="k">{{ k }} <input type="number" step="0.1" class="short"
					:value="doc.movement[k] === undefined ? 1.0 : doc.movement[k]"
					@change="doc.movement[k] = parseFloat($event.target.value)"/></label>
			</div>
			<div>
				<div class="yss-ac-row">
					<span>entity_overrides：</span>
					<input type="text" v-model="newOverrideKey" placeholder="minecraft:iron_golem" style="width:180px"/>
					<button @click="addOverride">+ 添加实体</button>
				</div>
				<div v-for="(e, key) in doc.entity_overrides" :key="key" class="yss-ac-row">
					<b>{{ key }}</b>
					<label>anti_interrupt <input type="number" step="0.05" min="0" max="1" v-model.number="e.anti_interrupt" @change="clampAnti(e)" class="short"/></label>
					<label>weight <input type="number" step="0.5" min="0" v-model.number="e.weight" class="short"/></label>
					<label>hardness <input type="number" step="0.1" min="0" v-model.number="e.hardness" class="short"/></label>
					<button @click="$delete(doc.entity_overrides, key)" style="color:var(--color-error)">删</button>
				</div>
			</div>
		</div>
	</div>
	<div v-if="validation.errors.length || validation.warnings.length" class="yss-ac-card" style="max-height:110px;overflow-y:auto">
		<div v-for="(e, i) in validation.errors" :key="'e'+i" class="yss-ac-msg-error" @click="locate(e)">✕ {{ e.msg }}</div>
		<div v-for="(w, i) in validation.warnings" :key="'w'+i" class="yss-ac-msg-warn">⚠ {{ w.msg }}</div>
	</div>
</div>`
			}
		});
		hitDialog.show();
	}

	// ---------- molang 条件编辑对话框 ----------

	function openConditionEditor(currentCondition, onSave) {
		if (conditionDialog) { conditionDialog.close(); conditionDialog = null; }
		const parsed = parseCondition(currentCondition);
		conditionDialog = new Dialog({
			id: 'yss_ac_condition',
			title: '编辑迁移条件（molang）',
			width: 720,
			buttons: ['dialog.confirm', 'dialog.cancel'],
			onConfirm() {
				onSave(conditionDialog.content_vue.raw);
			},
			component: {
				data() {
					return {
						rows: parsed.ok ? parsed.rows : [],
						parse_ok: parsed.ok,
						raw: currentCondition || '',
						syncing: false,
						keySlots: KEY_SLOTS,
						queries: QUERY_OPTIONS,
						cmps: CMP_OPS,
						keyFuncs: ['is_key_down', 'is_key_up', 'get_key']
					};
				},
				watch: {
					rows: {
						deep: true,
						handler() {
							if (!this.parse_ok) return;
							this.syncing = true;
							this.raw = buildCondition(this.rows);
							this.$nextTick(() => { this.syncing = false; });
						}
					},
					raw(val) {
						if (this.syncing) return;
						const p = parseCondition(val);
						this.parse_ok = p.ok;
						if (p.ok) this.rows = p.rows;
					}
				},
				methods: {
					newOperand(kind) {
						if (kind === 'key') return { kind: 'key', func: 'is_key_down', slot: 0 };
						if (kind === 'query') return { kind: 'query', name: QUERY_OPTIONS[0] };
						if (kind === 'number') return { kind: 'number', value: 1 };
						return { kind: 'raw', text: '' };
					},
					addRow() {
						this.rows.push({ join: '&&', left: this.newOperand('key'), cmp: '', right: this.newOperand('number') });
					},
					template_key_down(slot) {
						this.rows.push({ join: this.rows.length ? '&&' : '&&', left: { kind: 'key', func: 'is_key_down', slot }, cmp: '', right: this.newOperand('number') });
					},
					template_key_up(slot) {
						this.rows.push({ join: this.rows.length ? '&&' : '&&', left: { kind: 'key', func: 'is_key_up', slot }, cmp: '', right: this.newOperand('number') });
					},
					template_hold(slot) {
						this.rows.push({ join: this.rows.length ? '&&' : '&&', left: { kind: 'key', func: 'get_key', slot }, cmp: '>', right: { kind: 'number', value: 0.5 } });
					},
					template_finished(which) {
						this.rows.push({ join: this.rows.length ? '&&' : '&&', left: { kind: 'query', name: which }, cmp: '', right: this.newOperand('number') });
					},
					opKind(op) { return op.kind; },
					setOpKind(op, kind) {
						const fresh = this.newOperand(kind);
						Object.keys(op).forEach(k => delete op[k]);
						Object.assign(op, fresh);
					}
				},
				template: `
<div>
	<div style="margin-bottom:6px">
		<span style="font-size:11px">快捷模板：</span>
		<button @click="template_key_down(0)">按下左键攻击</button>
		<button @click="template_key_down(1)">按下右键使用</button>
		<button @click="template_key_down(2)">按下自定义键1</button>
		<button @click="template_hold(0)">长按判定 get_key > 0.5</button>
		<button @click="template_finished('query.all_animations_finished')">全部动画播完</button>
		<button @click="template_finished('query.any_animation_finished')">任一动画播完</button>
	</div>
	<div v-if="!parse_ok" style="color:var(--color-warning,#e6a23c);margin:6px 0">
		⚠ 原文无法解析为行式条件，构建器已锁定；可直接在下方文本框中修改原文，不会丢失内容。
	</div>
	<table v-if="parse_ok" style="width:100%;margin:6px 0">
		<tr v-for="(row, i) in rows" :key="i">
			<td style="width:70px">
				<select v-if="i" v-model="row.join"><option value="&&">AND</option><option value="||">OR</option></select>
				<span v-else style="opacity:0.5">当</span>
			</td>
			<td>
				<select :value="opKind(row.left)" @change="setOpKind(row.left, $event.target.value)" style="width:88px">
					<option value="key">按键函数</option><option value="query">query</option>
					<option value="number">常量</option><option value="raw">自定义</option>
				</select>
				<template v-if="row.left.kind === 'key'">
					<select v-model="row.left.func">
						<option v-for="f in keyFuncs" :value="f" :key="f">yss.{{ f }}</option>
					</select>
					<select v-model.number="row.left.slot">
						<option v-for="(n, s) in keySlots" :value="s" :key="s">{{ s }} = {{ n }}</option>
					</select>
				</template>
				<input v-else-if="row.left.kind === 'query'" v-model="row.left.name" list="yss-ac-queries" style="width:190px"/>
				<input v-else-if="row.left.kind === 'number'" type="number" step="0.1" v-model.number="row.left.value" style="width:80px"/>
				<input v-else v-model="row.left.text" placeholder="molang 表达式" style="width:190px"/>
			</td>
			<td style="width:70px">
				<select v-model="row.cmp">
					<option value="">（真值）</option>
					<option v-for="c in cmps.slice(1)" :value="c" :key="c">{{ c }}</option>
				</select>
			</td>
			<td>
				<template v-if="row.cmp">
					<select :value="opKind(row.right)" @change="setOpKind(row.right, $event.target.value)" style="width:88px">
						<option value="key">按键函数</option><option value="query">query</option>
						<option value="number">常量</option><option value="raw">自定义</option>
					</select>
					<template v-if="row.right.kind === 'key'">
						<select v-model="row.right.func">
							<option v-for="f in keyFuncs" :value="f" :key="f">yss.{{ f }}</option>
						</select>
						<select v-model.number="row.right.slot">
							<option v-for="(n, s) in keySlots" :value="s" :key="s">{{ s }} = {{ n }}</option>
						</select>
					</template>
					<input v-else-if="row.right.kind === 'query'" v-model="row.right.name" list="yss-ac-queries" style="width:190px"/>
					<input v-else-if="row.right.kind === 'number'" type="number" step="0.1" v-model.number="row.right.value" style="width:80px"/>
					<input v-else v-model="row.right.text" placeholder="molang 表达式" style="width:190px"/>
				</template>
			</td>
			<td style="width:40px"><button @click="rows.splice(i,1)">×</button></td>
		</tr>
	</table>
	<button v-if="parse_ok" @click="addRow">+ 添加条件行</button>
	<datalist id="yss-ac-queries"><option v-for="q in queries" :value="q" :key="q"/></datalist>
	<div style="margin-top:8px">
		<div style="margin-bottom:2px;font-size:11px">molang 原文（与构建器双向同步）：</div>
		<textarea v-model="raw" style="width:100%;min-height:44px" spellcheck="false"></textarea>
	</div>
	<p style="font-size:11px;color:var(--color-subtle_text)">
		自定义键（槽位 2~11）需在 MC 控制设置 → key.category.yessteveskill 中绑定后生效；0=左键攻击，1=右键使用。
	</p>
</div>`
			}
		});
		conditionDialog.show();
	}

	// ---------- 连招编辑器（节点图） ----------

	const NODE_W = 190;
	const NODE_H = 66;

	function openComboEditor() {
		if (!Project) { Blockbench.showQuickMessage('请先打开一个工程', 2000); return; }
		if (comboDialog) { comboDialog.close(); comboDialog = null; }
		refreshHitKeyCache();

		comboDialog = new Dialog({
			id: 'yss_ac_combo_editor',
			title: 'YSS 连招编辑器（动画控制器节点图）',
			width: 1080,
			resizable: true,
			buttons: [],
			onOpen() {
				// mounted 时对话框尚未排版（clientWidth=0），首次打开后补一次适配视图
				const vue = comboDialog.content_vue;
				if (vue && !vue.viewFitted) vue.$nextTick(() => vue.zoomToFit());
			},
			component: {
				data() {
					return {
						controllerUuid: '',
						nodes: [], // {uuid,name,x,y,animNames,initial,hit:{segments,damage}|null,on_entry_lines}
						edges: [], // {uuid,from,to,condition,summary}
						selectedNode: '',
						selectedEdge: null,
						props: null, // 选中状态的编辑副本
						drag: null,
						linkDrag: null,
						panDrag: null, // #107 空白/中键平移
						groupDrag: null, // #109 整组拖动
						justPanned: false, // 平移后的 click 不再触发取消选中
						hitKeys: hitKeyCache,
						view: { x: 0, y: 0, zoom: 1 }, // #107 手动视图：screen = world * zoom + (x, y)
						viewFitted: false,
						groups: [], // #109 {uuid,name,members:[stateUuid],transitions:[{uuid,target,condition}]}
						universal: {}, // #109 泛用迁移目标：stateUuid -> {condition}
						groupPick: [], // 左侧列表勾选待编组的状态 uuid
						selectedGroup: '',
						groupProps: null, // 选中编组的编辑副本 {uuid,name}
						newControllerName: DEFAULT_CONTROLLER_NAME
					};
				},
				computed: {
					controllers() { return AnimationController.all.slice(); },
					controller() { return findController(this.controllerUuid); },
					animNames() { return getAnimationNames(); },
					worldTransform() {
						return `translate(${this.view.x} ${this.view.y}) scale(${this.view.zoom})`;
					},
					// #109 编组包围盒：由成员节点位置推导（无独立位置）
					groupBoxes() {
						const PAD = 18, HEAD = 22;
						const byUuid = {};
						this.nodes.forEach(n => { byUuid[n.uuid] = n; });
						const out = [];
						this.groups.forEach(g => {
							let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
							g.members.forEach(uuid => {
								const n = byUuid[uuid];
								if (!n) return;
								minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
								maxX = Math.max(maxX, n.x + NODE_W); maxY = Math.max(maxY, n.y + NODE_H);
							});
							if (!isFinite(minX)) return;
							out.push({
								group: g,
								x: minX - PAD, y: minY - PAD - HEAD,
								w: (maxX - minX) + PAD * 2, h: (maxY - minY) + PAD * 2 + HEAD
							});
						});
						return out;
					},
					// #109 组级迁移边（编辑期结构，导出时展开到成员状态）
					groupEdges() {
						const byUuid = {};
						this.nodes.forEach(n => { byUuid[n.uuid] = n; });
						const out = [];
						this.groups.forEach(g => {
							g.transitions.forEach(t => {
								if (!byUuid[t.target]) return;
								const cond = t.condition || '';
								out.push({
									uuid: t.uuid, group: g.uuid, to: t.target, condition: cond,
									summary: cond.length > 34 ? cond.substring(0, 32) + '…' : cond
								});
							});
						});
						return out;
					}
				},
				methods: {
					refresh(keepSelection) {
						const c = this.controller;
						if (!c) {
							this.nodes = []; this.edges = []; this.props = null;
							this.groups = []; this.universal = {};
							return;
						}
						const layout = getLayout(c.uuid);
						// #109 读取编组/泛用迁移（剔除已不存在的状态）
						const stateSet = new Set(c.states.map(s => s.uuid));
						const rawGroups = layout[LAYOUT_GROUPS_KEY] instanceof Array ? layout[LAYOUT_GROUPS_KEY] : [];
						this.groups = rawGroups.map(g => ({
							uuid: g.uuid,
							name: typeof g.name === 'string' && g.name.trim() ? g.name : '编组',
							members: (g.members instanceof Array ? g.members : []).filter(uuid => stateSet.has(uuid)),
							transitions: (g.transitions instanceof Array ? g.transitions : [])
								.filter(t => t && stateSet.has(t.target))
								.map(t => ({ uuid: t.uuid || guid(), target: t.target, condition: t.condition || '' }))
						})).filter(g => g.members.length);
						this.universal = {};
						const rawUni = layout[LAYOUT_UNIVERSAL_KEY];
						if (rawUni && typeof rawUni === 'object') {
							for (const k in rawUni) {
								if (stateSet.has(k) && rawUni[k]) {
									this.universal[k] = { condition: String(rawUni[k].condition || '') };
								}
							}
						}
						this.nodes = c.states.map((s, i) => {
							const saved = layout[s.uuid];
							const x = saved ? saved.x : 40 + (i % 4) * (NODE_W + 50);
							const y = saved ? saved.y : 40 + Math.floor(i / 4) * (NODE_H + 70);
							const animNames = s.animations.map(a => {
								const anim = Animation.all.find(an => an.uuid === a.animation);
								return anim ? anim.name : a.key;
							}).filter(n => n);
							const hitName = animNames.find(n => this.hitKeys[n]);
							return {
								uuid: s.uuid, name: s.name, x, y, animNames,
								initial: c.initial_state === s.uuid,
								hit: hitName ? Object.assign({ name: hitName }, this.hitKeys[hitName]) : null,
								on_entry_lines: (s.on_entry || '').split('\n').filter(l => l.trim()).length
							};
						});
						const byUuid = {};
						this.nodes.forEach(n => { byUuid[n.uuid] = n; });
						this.edges = [];
						c.states.forEach(s => {
							s.transitions.forEach(t => {
								const from = byUuid[s.uuid], to = byUuid[t.target];
								if (!from || !to) return;
								const cond = t.condition || '';
								this.edges.push({
									uuid: t.uuid, from: s.uuid, to: t.target,
									condition: cond,
									summary: cond.length > 34 ? cond.substring(0, 32) + '…' : cond
								});
							});
						});
						if (keepSelection && this.selectedNode) this.selectNode(this.selectedNode, true);
						else if (keepSelection && this.selectedGroup) this.selectGroup(this.selectedGroup, true);
						else if (!keepSelection) {
							this.selectedNode = ''; this.props = null;
							this.selectedGroup = ''; this.groupProps = null;
						}
						// #107 控制器切换时才复位视图；编辑刷新保持用户缩放/平移
						if (this._fittedController !== c.uuid) {
							this._fittedController = c.uuid;
							this.viewFitted = false;
						}
						if (!this.viewFitted) this.$nextTick(() => this.zoomToFit());
					},
					// ---- 控制器 ----
					createController() {
						const name = (this.newControllerName || '').trim() || DEFAULT_CONTROLLER_NAME;
						Undo.initEdit({ animation_controllers: [] });
						const controller = new AnimationController({ name });
						controller.add(true);
						controller.createUniqueName();
						const state = new AnimationControllerState(controller, { name: 'default' });
						controller.initial_state = state.uuid;
						Undo.finishEdit('新建 YSS 控制器');
						this.controllerUuid = controller.uuid;
						this.refresh();
					},
					// ---- 状态 ----
					addState() {
						const c = this.controller;
						if (!c) return;
						const animNameList = getAnimationNames();
						const base = 'attack_' + (c.states.length);
						editController(c.uuid, '添加连招状态', c2 => {
							const state = new AnimationControllerState(c2);
							state.extend({ name: this.uniqueStateName(c2, base) });
							if (animNameList.length) {
								const anim = Animation.all.find(a => a.name === animNameList[0]);
								if (anim) state.extend({ animations: [{ uuid: guid(), key: anim.getShortName(), animation: anim.uuid }] });
							}
							if (!c2.initial_state) c2.initial_state = state.uuid;
						});
						this.refresh();
					},
					uniqueStateName(controller, base) {
						let name = base, i = 1;
						while (controller.states.find(s => s.name === name)) name = base + '_' + (++i);
						return name;
					},
					removeState(uuid) {
						editController(this.controllerUuid, '删除连招状态', c2 => {
							c2.states.remove(c2.states.find(s => s.uuid === uuid));
							c2.states.forEach(s => {
								s.transitions.remove(...s.transitions.filter(t => t.target === uuid));
							});
							if (c2.initial_state === uuid) c2.initial_state = c2.states[0] ? c2.states[0].uuid : '';
						});
						// #109 同步清理编组/泛用迁移中的引用（布局数据，非 Undo 范畴，与节点位置一致）
						this.groups.forEach(g => {
							g.members = g.members.filter(m => m !== uuid);
							g.transitions = g.transitions.filter(t => t.target !== uuid);
						});
						this.groups = this.groups.filter(g => g.members.length);
						if (this.universal[uuid]) this.$delete(this.universal, uuid);
						this.saveGraphExtras();
						this.selectedNode = ''; this.props = null;
						this.refresh();
					},
					setInitial(uuid) {
						editController(this.controllerUuid, '设置初始状态', c2 => { c2.initial_state = uuid; });
						this.refresh();
					},
					selectNode(uuid, silent) {
						this.selectedNode = uuid;
						this.selectedEdge = null;
						this.selectedGroup = '';
						this.groupProps = null;
						const s = findState(this.controllerUuid, uuid);
						if (!s) { this.props = null; return; }
						this.props = {
							uuid: s.uuid,
							name: s.name,
							on_entry: s.on_entry || '',
							on_exit: s.on_exit || '',
							blend_transition: s.blend_transition || 0,
							animations: s.animations.map(a => {
								const anim = Animation.all.find(an => an.uuid === a.animation);
								return { uuid: a.uuid, key: a.key, name: anim ? anim.name : a.key };
							})
						};
					},
					// #110 名称独立提交：失焦/回车即改，校验空名与重名；迁移/初始状态按 uuid 引用，导出按当前名编译，全部自动同步
					commitRename(value) {
						if (!this.props) return;
						const s = findState(this.controllerUuid, this.props.uuid);
						if (!s) return;
						const name = (value || '').trim();
						if (name === s.name) { this.refresh(true); return; }
						if (!name) {
							Blockbench.showQuickMessage('状态名不能为空', 2000);
							this.refresh(true); // 回显旧名
							return;
						}
						const c = this.controller;
						if (c && c.states.some(x => x.uuid !== s.uuid && x.name === name)) {
							Blockbench.showQuickMessage(`状态名「${name}」已存在，未应用`, 2500);
							this.refresh(true);
							return;
						}
						editState(this.controllerUuid, s.uuid, '重命名状态', s2 => { s2.name = name; });
						this.refresh(true);
					},
					applyProps() {
						if (!this.props) return;
						const p = this.props;
						editState(this.controllerUuid, p.uuid, '编辑状态属性', s2 => {
							// 名称由 commitRename 单独校验提交，这里不动
							s2.on_entry = p.on_entry;
							s2.on_exit = p.on_exit;
							s2.blend_transition = Number(p.blend_transition) || 0;
						});
						this.refresh(true);
					},
					addStateAnimation(animName) {
						if (!animName || !this.props) return;
						const anim = Animation.all.find(a => a.name === animName);
						if (!anim) return;
						editState(this.controllerUuid, this.props.uuid, '添加状态动画', s2 => {
							s2.animations.push({ uuid: guid(), key: anim.getShortName(), animation: anim.uuid, blend_value: '' });
						});
						this.refresh(true);
					},
					removeStateAnimation(linkUuid) {
						editState(this.controllerUuid, this.props.uuid, '移除状态动画', s2 => {
							s2.animations.remove(s2.animations.find(a => a.uuid === linkUuid));
						});
						this.refresh(true);
					},
					// ---- 迁移 ----
					createTransition(fromUuid, toUuid) {
						editState(this.controllerUuid, fromUuid, '添加迁移', s2 => {
							if (s2.transitions.find(t => t.target === toUuid)) return;
							s2.transitions.push({ uuid: guid(), target: toUuid, condition: '' });
						});
						this.refresh(true);
					},
					selectEdge(edge) {
						this.selectedEdge = edge;
						this.selectedNode = '';
						this.props = null;
						this.selectedGroup = '';
						this.groupProps = null;
						openConditionEditor(edge.condition, (raw) => {
							editState(this.controllerUuid, edge.from, '编辑迁移条件', s2 => {
								const t = s2.transitions.find(t => t.uuid === edge.uuid);
								if (t) t.condition = raw.replace(/\n/g, ' ').trim();
							});
							this.refresh(true);
						});
					},
					deleteEdge(edge) {
						editState(this.controllerUuid, edge.from, '删除迁移', s2 => {
							s2.transitions.remove(s2.transitions.find(t => t.uuid === edge.uuid));
						});
						this.refresh(true);
					},
					edgePath(edge) {
						const a = this.nodes.find(n => n.uuid === edge.from);
						const b = this.nodes.find(n => n.uuid === edge.to);
						if (!a || !b) return '';
						if (a === b) {
							// 自环（连招段重置）
							const x = a.x + NODE_W, y = a.y + NODE_H / 2;
							return `M ${x} ${y - 14} C ${x + 60} ${y - 70}, ${x + 60} ${y + 70}, ${x} ${y + 14}`;
						}
						const x1 = a.x + NODE_W / 2, y1 = a.y + NODE_H / 2;
						const x2 = b.x + NODE_W / 2, y2 = b.y + NODE_H / 2;
						const dx = Math.max(50, Math.abs(x2 - x1) / 2);
						return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
					},
					edgeLabelPos(edge) {
						const a = this.nodes.find(n => n.uuid === edge.from);
						const b = this.nodes.find(n => n.uuid === edge.to);
						if (!a || !b) return { x: 0, y: 0 };
						if (a === b) return { x: a.x + NODE_W + 58, y: a.y + NODE_H / 2 };
						return { x: (a.x + b.x) / 2 + NODE_W / 2, y: (a.y + b.y) / 2 + NODE_H / 2 - 8 };
					},
					// ---- #107 视图：缩放 / 平移 / 适配 ----
					svgLocalPoint(event) {
						// 屏幕坐标 → svg 像素坐标（svg 无 viewBox，本地坐标=像素）
						const svg = this.$refs.svg;
						if (!svg) return { x: 0, y: 0 };
						const pt = svg.createSVGPoint();
						pt.x = event.clientX; pt.y = event.clientY;
						const ctm = svg.getScreenCTM();
						return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
					},
					worldPoint(event) {
						// 屏幕坐标 → 世界（节点）坐标，经过缩放/平移变换
						const g = this.$refs.world;
						if (!g) return this.svgLocalPoint(event);
						const pt = this.$refs.svg.createSVGPoint();
						pt.x = event.clientX; pt.y = event.clientY;
						const ctm = g.getScreenCTM();
						return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
					},
					onWheel(event) {
						const old = this.view.zoom;
						const zoom = Math.min(2.5, Math.max(0.15, old * (event.deltaY < 0 ? 1.12 : 1 / 1.12)));
						if (zoom === old) return;
						const m = this.svgLocalPoint(event);
						// 以鼠标位置为锚点：缩放前后光标下的世界点保持不动
						this.view.x = m.x - (m.x - this.view.x) * (zoom / old);
						this.view.y = m.y - (m.y - this.view.y) * (zoom / old);
						this.view.zoom = zoom;
					},
					zoomToFit() {
						const svg = this.$refs.svg;
						if (!svg || !svg.clientWidth || !svg.clientHeight) return;
						let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
						this.nodes.forEach(n => {
							minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
							maxX = Math.max(maxX, n.x + NODE_W); maxY = Math.max(maxY, n.y + NODE_H);
						});
						if (!isFinite(minX)) { minX = 0; minY = 0; maxX = 800; maxY = 500; }
						const M = 60; // 边距（世界单位）
						const w = svg.clientWidth, h = svg.clientHeight;
						const zoom = Math.min(2, Math.max(0.15, Math.min(w / (maxX - minX + M * 2), h / (maxY - minY + M * 2))));
						this.view.zoom = Math.round(zoom * 100) / 100;
						this.view.x = Math.round((w - (maxX - minX) * this.view.zoom) / 2 - minX * this.view.zoom);
						this.view.y = Math.round((h - (maxY - minY) * this.view.zoom) / 2 - minY * this.view.zoom);
						this.viewFitted = true;
					},
					zoomReset() {
						const svg = this.$refs.svg;
						if (!svg) return;
						// 1:1 复位：保持当前视图中心
						const old = this.view.zoom;
						const cx = svg.clientWidth / 2, cy = svg.clientHeight / 2;
						this.view.x = cx - (cx - this.view.x) / old;
						this.view.y = cy - (cy - this.view.y) / old;
						this.view.zoom = 1;
					},
					// ---- 拖拽（节点 / 编组 / 平移 / 连线共用一组 window 监听） ----
					beginWindowDrag() {
						window.addEventListener('pointermove', this.onDragMove);
						window.addEventListener('pointerup', this.endDrag, { once: true });
					},
					startNodeDrag(node, event) {
						if (event.button !== 0) return;
						event.stopPropagation(); // 不触发背景平移
						this.drag = { uuid: node.uuid, startX: event.clientX, startY: event.clientY, ox: node.x, oy: node.y };
						this.beginWindowDrag();
					},
					startGroupDrag(group, event) {
						if (event.button !== 0) return;
						event.stopPropagation();
						const members = this.nodes
							.filter(n => group.members.includes(n.uuid))
							.map(n => ({ uuid: n.uuid, ox: n.x, oy: n.y }));
						this.groupDrag = { uuid: group.uuid, startX: event.clientX, startY: event.clientY, members };
						this.beginWindowDrag();
					},
					startPan(event) {
						this.justPanned = false; // 清除上次平移遗留（指针在 svg 外松开时 click 未触发）
						this.panDrag = { startX: event.clientX, startY: event.clientY, ox: this.view.x, oy: this.view.y };
						this.beginWindowDrag();
					},
					onSvgPointerDown(event) {
						if (event.button === 1) {
							// 中键：任意位置平移（拦截浏览器自动滚动）
							event.preventDefault();
							this.startPan(event);
						} else if (event.button === 0 && event.target === this.$refs.svg) {
							// 左键空白处平移（节点/编组/连线均 stopPropagation 或不是 svg 本体）
							this.startPan(event);
						}
					},
					onBackgroundClick() {
						if (this.justPanned) { this.justPanned = false; return; }
						this.selectedNode = ''; this.props = null;
						this.selectedEdge = null;
						this.selectedGroup = ''; this.groupProps = null;
					},
					onDragMove(event) {
						if (this.drag) {
							const z = this.view.zoom;
							const node = this.nodes.find(n => n.uuid === this.drag.uuid);
							if (node) {
								node.x = Math.round(this.drag.ox + (event.clientX - this.drag.startX) / z);
								node.y = Math.round(this.drag.oy + (event.clientY - this.drag.startY) / z);
							}
						} else if (this.groupDrag) {
							const z = this.view.zoom;
							const dx = (event.clientX - this.groupDrag.startX) / z;
							const dy = (event.clientY - this.groupDrag.startY) / z;
							this.groupDrag.members.forEach(m => {
								const node = this.nodes.find(n => n.uuid === m.uuid);
								if (node) { node.x = Math.round(m.ox + dx); node.y = Math.round(m.oy + dy); }
							});
						} else if (this.panDrag) {
							this.view.x = this.panDrag.ox + (event.clientX - this.panDrag.startX);
							this.view.y = this.panDrag.oy + (event.clientY - this.panDrag.startY);
						} else if (this.linkDrag) {
							this.linkDrag.mx = event.clientX;
							this.linkDrag.my = event.clientY;
						}
					},
					endDrag(event) {
						window.removeEventListener('pointermove', this.onDragMove);
						if (this.drag) {
							const node = this.nodes.find(n => n.uuid === this.drag.uuid);
							if (node) saveNodePos(this.controllerUuid, node.uuid, node.x, node.y);
							this.drag = null;
						}
						if (this.groupDrag) {
							this.groupDrag.members.forEach(m => {
								const node = this.nodes.find(n => n.uuid === m.uuid);
								if (node) saveNodePos(this.controllerUuid, node.uuid, node.x, node.y);
							});
							this.groupDrag = null;
						}
						if (this.panDrag) {
							if (Math.hypot(event.clientX - this.panDrag.startX, event.clientY - this.panDrag.startY) > 3) {
								this.justPanned = true;
							}
							this.panDrag = null;
						}
						if (this.linkDrag) {
							const ld = this.linkDrag;
							this.linkDrag = null;
							if (Math.hypot(event.clientX - ld.startX, event.clientY - ld.startY) >= 5) {
								const el = document.elementFromPoint(event.clientX, event.clientY);
								const g = el && el.closest('.yss-ac-node');
								const targetUuid = g && g.getAttribute('data-uuid');
								if (targetUuid) {
									if (ld.fromGroup) this.createGroupTransition(ld.fromGroup, targetUuid);
									else this.createTransition(ld.from, targetUuid);
								}
							}
						}
					},
					startLinkDrag(node, event) {
						if (event.button !== 0) return;
						event.stopPropagation();
						this.linkDrag = { from: node.uuid, mx: event.clientX, my: event.clientY, startX: event.clientX, startY: event.clientY };
						this.beginWindowDrag();
					},
					startGroupLinkDrag(group, event) {
						if (event.button !== 0) return;
						event.stopPropagation();
						this.linkDrag = { fromGroup: group.uuid, mx: event.clientX, my: event.clientY, startX: event.clientX, startY: event.clientY };
						this.beginWindowDrag();
					},
					linkDragLine() {
						if (!this.linkDrag) return '';
						let x1, y1;
						if (this.linkDrag.fromGroup) {
							const gb = this.groupBoxes.find(b => b.group.uuid === this.linkDrag.fromGroup);
							if (!gb) return '';
							x1 = gb.x + gb.w; y1 = gb.y + gb.h / 2;
						} else {
							const from = this.nodes.find(n => n.uuid === this.linkDrag.from);
							if (!from) return '';
							x1 = from.x + NODE_W; y1 = from.y + NODE_H / 2;
						}
						const loc = this.worldPoint({ clientX: this.linkDrag.mx, clientY: this.linkDrag.my });
						return `M ${x1} ${y1} L ${loc.x} ${loc.y}`;
					},
					// ---- #109 编组 ----
					saveGraphExtras() {
						if (!this.controllerUuid || !Project) return;
						saveGraphExtras(this.controllerUuid, this.groups, this.universal);
					},
					togglePick(uuid) {
						const i = this.groupPick.indexOf(uuid);
						if (i >= 0) this.groupPick.splice(i, 1);
						else this.groupPick.push(uuid);
					},
					createGroupFromPick() {
						if (!this.controller || !this.groupPick.length) return;
						const members = this.groupPick.filter(uuid => this.nodes.some(n => n.uuid === uuid));
						if (!members.length) return;
						// 已在其它编组中的状态自动迁出（一个状态只属于一个组，避免导出语义歧义）
						this.groups.forEach(g => { g.members = g.members.filter(m => !members.includes(m)); });
						this.groups = this.groups.filter(g => g.members.length);
						const g = { uuid: guid(), name: '编组 ' + (this.groups.length + 1), members, transitions: [] };
						this.groups.push(g);
						this.groupPick = [];
						this.saveGraphExtras();
						this.selectGroup(g.uuid);
					},
					selectGroup(uuid, silent) {
						this.selectedGroup = uuid;
						this.selectedNode = ''; this.props = null; this.selectedEdge = null;
						const g = this.groups.find(g => g.uuid === uuid);
						this.groupProps = g ? { uuid: g.uuid, name: g.name } : null;
					},
					renameGroup(value) {
						const g = this.groups.find(g => g.uuid === this.selectedGroup);
						if (!g) return;
						const name = (value || '').trim();
						if (!name) { Blockbench.showQuickMessage('编组名不能为空', 2000); this.refresh(true); return; }
						g.name = name;
						this.saveGraphExtras();
						this.refresh(true);
					},
					addGroupMember(stateUuid) {
						const g = this.groups.find(g => g.uuid === this.selectedGroup);
						if (!g || !stateUuid || g.members.includes(stateUuid)) return;
						this.groups.forEach(o => { if (o !== g) o.members = o.members.filter(m => m !== stateUuid); });
						this.groups = this.groups.filter(o => o.members.length);
						g.members.push(stateUuid);
						this.saveGraphExtras();
						this.refresh(true);
					},
					removeGroupMember(stateUuid) {
						const g = this.groups.find(g => g.uuid === this.selectedGroup);
						if (!g) return;
						g.members = g.members.filter(m => m !== stateUuid);
						if (!g.members.length) {
							this.groups.remove(g);
							this.selectedGroup = ''; this.groupProps = null;
						}
						this.saveGraphExtras();
						this.refresh(!!this.selectedGroup);
					},
					dissolveGroup(uuid) {
						const g = this.groups.find(g => g.uuid === uuid);
						if (!g) return;
						this.groups.remove(g); // 只解散编组，不删状态
						this.saveGraphExtras();
						this.selectedGroup = ''; this.groupProps = null;
						this.refresh();
					},
					createGroupTransition(groupUuid, targetUuid) {
						const g = this.groups.find(g => g.uuid === groupUuid);
						if (!g) return;
						if (g.members.includes(targetUuid)) {
							Blockbench.showQuickMessage('组级迁移不能指向组内成员（请从具体节点连出）', 2500);
							return;
						}
						if (g.transitions.find(t => t.target === targetUuid)) return;
						g.transitions.push({ uuid: guid(), target: targetUuid, condition: '' });
						this.saveGraphExtras();
						this.refresh(true);
					},
					selectGroupEdge(edge) {
						this.selectedEdge = edge;
						this.selectedNode = ''; this.props = null;
						const g = this.groups.find(g => g.uuid === edge.group);
						if (!g) return;
						openConditionEditor(edge.condition, (raw) => {
							const t = g.transitions.find(t => t.uuid === edge.uuid);
							if (t) t.condition = raw.replace(/\n/g, ' ').trim();
							this.saveGraphExtras();
							this.refresh(true);
						});
					},
					deleteGroupEdge(edge) {
						const g = this.groups.find(g => g.uuid === edge.group);
						if (!g) return;
						g.transitions = g.transitions.filter(t => t.uuid !== edge.uuid);
						this.saveGraphExtras();
						this.refresh(true);
					},
					groupEdgePath(edge) {
						const gb = this.groupBoxes.find(b => b.group.uuid === edge.group);
						const b = this.nodes.find(n => n.uuid === edge.to);
						if (!gb || !b) return '';
						const x1 = gb.x + gb.w, y1 = gb.y + gb.h / 2;
						const x2 = b.x + NODE_W / 2, y2 = b.y + NODE_H / 2;
						const dx = Math.max(50, Math.abs(x2 - x1) / 2);
						return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
					},
					groupEdgeLabelPos(edge) {
						const gb = this.groupBoxes.find(b => b.group.uuid === edge.group);
						const b = this.nodes.find(n => n.uuid === edge.to);
						if (!gb || !b) return { x: 0, y: 0 };
						return { x: (gb.x + gb.w + b.x + NODE_W / 2) / 2, y: (gb.y + gb.h / 2 + b.y + NODE_H / 2) / 2 - 8 };
					},
					groupName(uuid) {
						const g = this.groups.find(g => g.uuid === uuid);
						return g ? g.name : '';
					},
					// ---- #109 泛用迁移目标 ----
					toggleUniversal(stateUuid, on) {
						if (on) this.$set(this.universal, stateUuid, { condition: '' });
						else this.$delete(this.universal, stateUuid);
						this.saveGraphExtras();
						this.refresh(true);
					},
					editUniversalCondition(stateUuid) {
						const entry = this.universal[stateUuid];
						if (!entry) return;
						openConditionEditor(entry.condition, (raw) => {
							entry.condition = raw.replace(/\n/g, ' ').trim();
							this.saveGraphExtras();
							this.refresh(true);
						});
					},
					// ---- 联动 / 导出 ----
					openHitBadge(node) {
						openHitEditor(node.hit && node.hit.name);
					},
					exportController() {
						const c = this.controller;
						if (!c) return;
						const compiled = c.compileForBedrock();
						// #109 导出时把编组/泛用迁移展开为各状态的真实 transitions（bedrock 合法格式）
						const uuidToName = {};
						c.states.forEach(s => { uuidToName[s.uuid] = s.name; });
						let expanded = 0;
						const pushTransition = (fromUuid, targetUuid, condition) => {
							const fromName = uuidToName[fromUuid], toName = uuidToName[targetUuid];
							if (!fromName || !toName || fromName === toName) return;
							const st = compiled.states && compiled.states[fromName];
							if (!st) return;
							if (!(st.transitions instanceof Array)) st.transitions = [];
							// 状态自身的迁移优先；同目标不重复写入
							if (st.transitions.some(t => Object.keys(t)[0] === toName)) return;
							st.transitions.push({ [toName]: condition || '' });
							expanded++;
						};
						this.groups.forEach(g => {
							g.members.forEach(m => {
								g.transitions.forEach(t => pushTransition(m, t.target, t.condition));
							});
						});
						for (const targetUuid in this.universal) {
							c.states.forEach(s => {
								if (s.uuid !== targetUuid) pushTransition(s.uuid, targetUuid, this.universal[targetUuid].condition);
							});
						}
						const content = JSON.stringify({
							format_version: '1.10.0',
							animation_controllers: { [c.name]: compiled }
						}, null, '\t');
						Blockbench.exportFile({
							type: 'JSON', extensions: ['json'], savetype: 'text',
							name: c.name.split('.').pop() + '.animation_controllers.json',
							content
						}, () => Blockbench.showQuickMessage(
							'控制器 JSON 已导出' + (expanded ? `（编组/泛用迁移已展开为 ${expanded} 条状态迁移）` : ''), 2500));
					},
					templateCombo() {
						// 常用连招模板：idle ⇄ attack_1 → attack_2 链，条件 yss.is_key_down(0) / 播完回 idle
						const c = this.controller;
						if (!c) return;
						editController(c.uuid, '应用连招模板', c2 => {
							const mk = (name) => {
								let s = c2.states.find(x => x.name === name);
								if (!s) { s = new AnimationControllerState(c2); s.extend({ name }); }
								return s;
							};
							const idle = mk('idle');
							const atk1 = mk('attack_1');
							const atk2 = mk('attack_2');
							if (!c2.initial_state) c2.initial_state = idle.uuid;
							const link = (from, to, cond) => {
								if (!from.transitions.find(t => t.target === to.uuid)) {
									from.transitions.push({ uuid: guid(), target: to.uuid, condition: cond });
								}
							};
							link(idle, atk1, 'yss.is_key_down(0)');
							link(atk1, atk2, 'yss.is_key_down(0) && query.anim_time > 0.2');
							link(atk1, idle, 'query.all_animations_finished');
							link(atk2, idle, 'query.all_animations_finished');
						});
						this.refresh();
					}
				},
				mounted() {
					const c = AnimationController.all[0];
					this.controllerUuid = c ? c.uuid : '';
					this.refresh();
				},
				beforeDestroy() {
					window.removeEventListener('pointermove', this.onDragMove);
				},
				template: `
<div class="yss-ac-body">
	<div class="yss-ac-toolbar">
		<label>控制器
			<select v-model="controllerUuid" @change="refresh()">
				<option value="">（无）</option>
				<option v-for="c in controllers" :value="c.uuid" :key="c.uuid">{{ c.name }}</option>
			</select>
		</label>
		<button v-if="controllers.length === 0" class="accented" @click="createController">新建 YSS 控制器（{{ newControllerName }}）</button>
		<template v-else>
			<button @click="addState" :disabled="!controller">+ 添加状态</button>
			<button @click="templateCombo" :disabled="!controller">连招模板（普攻连击链）</button>
			<button @click="exportController" :disabled="!controller">导出控制器 JSON</button>
		</template>
		<span class="spacer"></span>
		<label v-if="controller">初始状态
			<select :value="controller.initial_state" @change="setInitial($event.target.value)">
				<option v-for="n in nodes" :value="n.uuid" :key="n.uuid">{{ n.name }}</option>
			</select>
		</label>
	</div>
	<div class="yss-ac-main" v-if="controller">
		<div class="yss-ac-list">
			<div v-for="n in nodes" :key="n.uuid" class="yss-ac-list-item" :class="{selected: n.uuid === selectedNode}" @click="selectNode(n.uuid)">
				<input type="checkbox" :checked="groupPick.includes(n.uuid)" @click.stop @change="togglePick(n.uuid)" title="勾选后可编组"/>
				<span style="flex:1;overflow:hidden;text-overflow:ellipsis">{{ n.name }}<span v-if="n.initial" class="yss-ac-badge" style="margin-left:4px">初始</span></span>
				<span class="yss-ac-badge">{{ n.animNames.length }} 动画</span>
			</div>
			<div style="padding:6px">
				<button style="width:100%" :disabled="!groupPick.length" @click="createGroupFromPick">将勾选状态编组（{{ groupPick.length }}）</button>
			</div>
			<template v-if="groups.length">
				<div class="yss-ac-hint" style="padding:4px 8px 0">编组（点击编辑，导出时组迁移展开到成员）</div>
				<div v-for="g in groups" :key="g.uuid" class="yss-ac-list-item" :class="{selected: g.uuid === selectedGroup}" @click="selectGroup(g.uuid)">
					<span style="flex:1;overflow:hidden;text-overflow:ellipsis">▣ {{ g.name }}</span>
					<span class="yss-ac-badge">{{ g.members.length }} 状态</span>
				</div>
			</template>
			<p class="yss-ac-hint" style="padding:6px">拖拽节点移动；从节点/编组右侧圆点拖到目标创建迁移（拖到自身=自环）；滚轮缩放，空白或中键拖拽平移，双击空白适配视图；点击边编辑条件，右键边删除。</p>
		</div>
		<div class="yss-ac-graph-wrap">
			<svg ref="svg" @wheel.prevent="onWheel" @pointerdown="onSvgPointerDown" @click.self="onBackgroundClick" @dblclick.self="zoomToFit">
				<defs>
					<marker id="yss-ac-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
						<path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-subtle_text)"/>
					</marker>
				</defs>
				<g ref="world" :transform="worldTransform">
					<g v-for="gb in groupBoxes" :key="gb.group.uuid" class="yss-ac-group" :class="{selected: gb.group.uuid === selectedGroup}">
						<rect class="body" :x="gb.x" :y="gb.y" :width="gb.w" :height="gb.h" rx="10"
							@pointerdown="startGroupDrag(gb.group, $event)" @click.stop="selectGroup(gb.group.uuid)"/>
						<text :x="gb.x + 10" :y="gb.y + 16">▣ {{ gb.group.name }}（{{ gb.group.members.length }}）</text>
						<circle class="port" :cx="gb.x + gb.w" :cy="gb.y + gb.h / 2" r="6" @pointerdown="startGroupLinkDrag(gb.group, $event)">
							<title>拖出 = 组级迁移（导出时展开为组内所有状态的迁移）</title>
						</circle>
					</g>
					<g v-for="e in edges" :key="e.uuid">
						<path class="yss-ac-edge" :d="edgePath(e)" marker-end="url(#yss-ac-arrow)"
							@click="selectEdge(e)" @contextmenu.prevent="deleteEdge(e)"/>
						<text class="yss-ac-edge-label" :x="edgeLabelPos(e).x" :y="edgeLabelPos(e).y" text-anchor="middle"
							@click="selectEdge(e)">{{ e.summary || '（无条件）' }}</text>
					</g>
					<g v-for="e in groupEdges" :key="'g'+e.uuid">
						<path class="yss-ac-edge" style="stroke:var(--color-accent);stroke-dasharray:7 4" :d="groupEdgePath(e)" marker-end="url(#yss-ac-arrow)"
							@click="selectGroupEdge(e)" @contextmenu.prevent="deleteGroupEdge(e)"/>
						<text class="yss-ac-edge-label" :x="groupEdgeLabelPos(e).x" :y="groupEdgeLabelPos(e).y" text-anchor="middle"
							@click="selectGroupEdge(e)">[{{ groupName(e.group) }}] {{ e.summary || '（无条件）' }}</text>
					</g>
					<path v-if="linkDrag" :d="linkDragLine()" stroke="var(--color-accent)" stroke-width="2" fill="none" stroke-dasharray="4 3"/>
					<g v-for="n in nodes" :key="n.uuid" class="yss-ac-node" :data-uuid="n.uuid"
						:class="{initial: n.initial, selected: n.uuid === selectedNode}"
						:transform="'translate(' + n.x + ',' + n.y + ')'">
						<rect class="body" :width="190" :height="66"
							@pointerdown="startNodeDrag(n, $event)" @dblclick="selectNode(n.uuid)" @click="selectNode(n.uuid)"/>
						<circle v-if="universal[n.uuid]" class="yss-ac-uni-port" :cx="0" :cy="33" r="5">
							<title>泛用迁移目标：导出时其它所有状态自动获得指向本状态的迁移</title>
						</circle>
						<text x="10" y="18">{{ n.name }}</text>
						<text class="sub" x="10" y="34">{{ n.animNames.join(', ') || '（无动画）' }}</text>
						<text class="sub" x="10" y="50" v-if="n.on_entry_lines">on_entry: {{ n.on_entry_lines }} 行</text>
						<g v-if="n.hit" @click.stop="openHitBadge(n)" style="cursor:pointer">
							<rect class="yss-ac-hit-badge" :x="120" :y="6" width="62" height="14" rx="7"/>
							<text class="yss-ac-hit-badge-text" :x="151" y="16" text-anchor="middle">⚔{{ n.hit.segments }}段/{{ n.hit.damage }}伤</text>
						</g>
						<circle class="port" :cx="190" :cy="33" r="6" @pointerdown="startLinkDrag(n, $event)"/>
					</g>
				</g>
			</svg>
			<div class="yss-ac-view-btns">
				<button @click="zoomReset" title="恢复 100% 缩放（保持视图中心）">1:1</button>
				<button @click="zoomToFit" title="缩放平移以容纳全部节点（双击空白同效）">适配视图</button>
			</div>
		</div>
		<div class="yss-ac-props" v-if="props">
			<h4 style="margin-top:0;flex:0 0 auto">状态属性</h4>
			<div class="props-fixed">
				<div class="yss-ac-row"><label>名称 <input type="text" :value="props.name" style="width:130px"
					@change="commitRename($event.target.value)" @keyup.enter="$event.target.blur()"/></label></div>
				<div class="yss-ac-row"><label>blend_transition <input type="number" step="0.05" v-model.number="props.blend_transition" class="short"/></label></div>
				<div class="yss-ac-row">
					<label title="导出时其它所有状态自动获得指向本状态的迁移（适合跳跃/闪避等随处可切入的状态）">
						<input type="checkbox" :checked="!!universal[props.uuid]" @change="toggleUniversal(props.uuid, $event.target.checked)"/> 泛用迁移目标
					</label>
					<button v-if="universal[props.uuid]" @click="editUniversalCondition(props.uuid)">编辑条件</button>
				</div>
				<div v-if="universal[props.uuid]" class="yss-ac-hint">导出时展开到其它全部状态，条件：{{ universal[props.uuid].condition || '（空）' }}</div>
				<div>动画（bedrock 字符串形式）：</div>
				<div class="anim-chips">
					<div v-for="a in props.animations" :key="a.uuid" class="yss-ac-row">
						<span class="yss-ac-chip">{{ a.name }}<span class="x" @click="removeStateAnimation(a.uuid)">×</span></span>
					</div>
				</div>
				<div class="yss-ac-row">
					<select @change="addStateAnimation($event.target.value); $event.target.value=''">
						<option value="">+ 添加动画</option>
						<option v-for="n in animNames" :value="n" :key="n">{{ n }}</option>
					</select>
				</div>
			</div>
			<div class="props-grow">
				<div>on_entry（molang / 命令，每行一条）：</div>
				<textarea v-model="props.on_entry" spellcheck="false"></textarea>
				<div>on_exit：</div>
				<textarea v-model="props.on_exit" spellcheck="false"></textarea>
			</div>
			<div class="yss-ac-btn-row">
				<button class="accented" @click="applyProps">应用</button>
				<button @click="refresh(true)">还原</button>
				<button @click="removeState(props.uuid)" style="color:var(--color-error)">删除状态</button>
			</div>
		</div>
		<div class="yss-ac-props" v-else-if="groupProps">
			<h4 style="margin-top:0;flex:0 0 auto">编组属性</h4>
			<div class="props-fixed">
				<div class="yss-ac-row"><label>名称 <input type="text" :value="groupProps.name" style="width:130px"
					@change="renameGroup($event.target.value)" @keyup.enter="$event.target.blur()"/></label></div>
				<div>成员状态：</div>
				<div class="anim-chips">
					<div v-for="m in (groups.find(g => g.uuid === selectedGroup) || {members:[]}).members" :key="m" class="yss-ac-row">
						<span class="yss-ac-chip">{{ (nodes.find(n => n.uuid === m) || {}).name || m }}<span class="x" @click="removeGroupMember(m)">×</span></span>
					</div>
				</div>
				<div class="yss-ac-row">
					<select @change="addGroupMember($event.target.value); $event.target.value=''">
						<option value="">+ 添加成员</option>
						<option v-for="n in nodes" :value="n.uuid" :key="n.uuid">{{ n.name }}</option>
					</select>
				</div>
				<div class="yss-ac-hint">组级迁移（从组右侧圆点拖出）：导出时展开为组内每个状态指向目标的迁移；组成员仍可单独向外连线。</div>
			</div>
			<div class="props-grow" style="overflow-y:auto">
				<div>组级迁移：</div>
				<div v-for="t in (groups.find(g => g.uuid === selectedGroup) || {transitions:[]}).transitions" :key="t.uuid" class="yss-ac-row">
					<span class="yss-ac-chip" style="cursor:pointer" @click="selectGroupEdge({uuid:t.uuid, group:selectedGroup, to:t.target, condition:t.condition})">
						→ {{ (nodes.find(n => n.uuid === t.target) || {}).name || '?' }}：{{ t.condition || '（无条件）' }}
						<span class="x" @click.stop="deleteGroupEdge({uuid:t.uuid, group:selectedGroup})">×</span>
					</span>
				</div>
			</div>
			<div class="yss-ac-btn-row">
				<button @click="dissolveGroup(selectedGroup)" style="color:var(--color-error)">解散编组（保留状态）</button>
			</div>
		</div>
	</div>
	<div v-else class="yss-ac-hint" style="padding:20px">
		当前工程没有动画控制器。点击上方「新建 YSS 控制器」创建 {{ newControllerName }}，然后在节点图中编排连招。
	</div>
	<p class="yss-ac-hint">
		改动直接写入工程的动画控制器并支持 Undo/Redo，随工程一起保存；节点位置与编组/泛用迁移保存在工程文件插件命名空间 yss_layout 中（编组仅编辑期存在，导出时展开为各状态的真实 transitions）。
		动画名带 ⚔ 徽标表示已在 hit.json 中配置攻击效果，点击徽标跳转到攻击效果编辑器。
	</p>
</div>`
			}
		});
		comboDialog.show();
	}

	// ---------- 设置对话框 ----------

	function openSettingsDialog() {
		if (settingsDialog) { settingsDialog.close(); settingsDialog = null; }
		settingsDialog = new Dialog({
			id: 'yss_ac_settings',
			title: '设置 YSS 工程目录',
			width: 560,
			form: {
				root: {
					label: 'YSS 配置根目录',
					type: 'text',
					value: getRootDir(),
					placeholder: '例如 <游戏目录>/config/yes_steve_skill',
					description: 'hit.json 将读写 <根目录>/<modelId>/hit.json'
				},
				browse: {
					type: 'buttons',
					buttons: ['浏览…'],
					click() {
						const dir = Blockbench.pickDirectory({ title: '选择 yes_steve_skill 配置目录', startpath: getRootDir() || undefined });
						if (dir) settingsDialog.setFormValues({ root: dir });
					}
				},
				model_id: {
					label: 'modelId 覆盖',
					type: 'text',
					value: localStorage.getItem(LS_MODEL) || '',
					placeholder: Project ? normalizeModelId(Project.name || '') : '',
					description: '留空则从当前工程文件名推导（去路径与扩展名，非法字符转下划线）'
				}
			},
			onConfirm(result) {
				localStorage.setItem(LS_ROOT, (result.root || '').trim());
				localStorage.setItem(LS_MODEL, (result.model_id || '').trim());
				Blockbench.showQuickMessage('YSS 工程目录设置已保存', 2000);
			}
		});
		settingsDialog.show();
	}

	// ---------- 插件注册 ----------

	BBPlugin.register(PLUGIN_ID, {
		title: 'YSS 动画控制器',
		author: 'YSS 社区',
		description: 'YesSteveSkill 专用：在 Blockbench 中编排连招（动画控制器节点图 + molang 按键条件）并编辑攻击效果 hit.json。',
		version: '0.1.2',
		icon: 'sports_esports',
		tags: ['Minecraft: Java Edition', 'Animation'],
		variant: 'desktop',
		min_version: '5.2.0',
		has_changelog: true,
		onload() {
			// 节点布局命名空间：注册为工程属性，随 bbmodel 保存/加载
			layoutProperty = new Property(ModelProject, 'object', 'yss_layout', { exposed: false });

			cssHandle = Blockbench.addCSS(CSS);

			yssMenu = new BarMenu('yss', [], { name: 'YSS' });

			const needProject = () => !!Project;
			const mk = (id, name, icon, click, condition) => {
				const action = new Action(id, { name, icon, click, condition });
				actions.push(action);
				MenuBar.addAction(action, 'yss');
				return action;
			};
			mk('yss_ac_open_combo', '打开连招编辑器', 'account_tree', openComboEditor, needProject);
			mk('yss_ac_open_hit', '打开攻击效果编辑器', 'target', openHitEditor, needProject);
			mk('yss_ac_settings', '设置 YSS 工程目录', 'folder', openSettingsDialog);
			MenuBar.update();

			// 工程切换/关闭：重读上下文，避免对话框状态泄漏到其它工程
			eventHandles.push(Blockbench.on('select_project', () => {
				if (Project) ensureLayout(Project);
				if (hitDialog && Dialog.open === hitDialog) hitDialog.content_vue && hitDialog.content_vue.load();
				if (comboDialog && Dialog.open === comboDialog && comboDialog.content_vue) {
					const vue = comboDialog.content_vue;
					const c = AnimationController.all.find(x => x.uuid === vue.controllerUuid) || AnimationController.all[0];
					vue.controllerUuid = c ? c.uuid : '';
					vue.refresh();
				}
			}));
			eventHandles.push(Blockbench.on('close_project', () => {
				[hitDialog, comboDialog, conditionDialog].forEach(d => { if (d && Dialog.open === d) d.cancel(); });
				[settingsDialog].forEach(d => { if (d && Dialog.open === d) d.cancel(); });
			}));
		},
		onunload() {
			[hitDialog, comboDialog, conditionDialog, settingsDialog].forEach(d => {
				if (d) { if (Dialog.open === d) d.hide(); d.delete(); }
			});
			hitDialog = comboDialog = conditionDialog = settingsDialog = null;
			actions.forEach(a => a.delete());
			actions.empty();
			if (yssMenu) {
				yssMenu.delete();
				delete MenuBar.menus.yss;
				yssMenu = null;
				MenuBar.update();
			}
			if (cssHandle) { cssHandle.delete(); cssHandle = null; }
			eventHandles.forEach(h => h.delete());
			eventHandles.empty();
			if (layoutProperty) { layoutProperty.delete(); layoutProperty = null; }
		}
	});
})();
