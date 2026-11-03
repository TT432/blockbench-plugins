/*
 * BB Connect（bbconnectmod）
 * Yes Steve Model（1.20.1 Forge 模组）↔ Blockbench Community 桥接插件。
 *
 * 连接方向：游戏端主动拨号（模组 BbConnectClient），插件只在 127.0.0.1 上监听。
 * 协议：UTF-8、换行分隔的 JSON 对象，字段见 about.md。
 *
 * 依赖 ysm_utils：项目遵循 ysm_utils 的 Project.ysm_project_info.path 约定，
 * 因此打开的项目可以直接使用 ysm_utils 的「当前信息」菜单编辑 ysm.json。
 */
(function () {
	'use strict';

	const PLUGIN_ID = 'bbconnectmod';
	const PROTOCOL_VERSION = 1;
	const DEFAULT_PORT = 41234;
	const MAX_LINE_BYTES = 16 * 1024 * 1024;
	const LS_PORT = 'bbconnectmod_port';

	const state = {
		fs: null,
		path: null,
		net: null,
		server: null,
		peers: new Set(),
		status: 'stopped',
		detail: '',
		save_listener: null,
		quick_save_listener: null,
		sync_timer: null,
	};

	// ---------- 设置 ----------

	function getPort() {
		let port = parseInt(localStorage.getItem(LS_PORT), 10);
		return Number.isFinite(port) && port >= 1024 && port <= 65535 ? port : DEFAULT_PORT;
	}
	function setPort(port) {
		let value = parseInt(port, 10);
		if (!Number.isFinite(value) || value < 1024 || value > 65535) return false;
		localStorage.setItem(LS_PORT, String(value));
		return true;
	}

	// ---------- 模块 ----------

	function loadModules() {
		state.fs = require('fs');
		state.path = require('path');
		state.net = require('net');
	}

	// ---------- 协议 ----------

	function send(peer, message) {
		if (!peer || peer.closed) return;
		try {
			peer.socket.write(JSON.stringify(Object.assign({v: PROTOCOL_VERSION}, message)) + '\n');
		} catch (err) {
			console.error('[bbconnectmod] 发送失败', err);
			closePeer(peer);
		}
	}
	function sendError(peer, message) {
		send(peer, {type: 'error', message: String(message)});
	}

	function closePeer(peer) {
		if (!peer) return;
		peer.closed = true;
		state.peers.delete(peer);
		try { peer.socket.destroy(); } catch (err) { /* 断开已失效的 socket 不是可处理错误 */ }
	}

	function handleClient(socket) {
		const peer = {socket, buffer: '', closed: false, hello: null};
		state.peers.add(peer);
		socket.setEncoding('utf8');
		socket.setNoDelay(true);
		socket.on('data', chunk => {
			peer.buffer += chunk;
			if (peer.buffer.length > MAX_LINE_BYTES) {
				console.error('[bbconnectmod] 单行消息过大，断开连接');
				closePeer(peer);
				return;
			}
			let index;
			while ((index = peer.buffer.indexOf('\n')) >= 0) {
				let line = peer.buffer.slice(0, index).trim();
				peer.buffer = peer.buffer.slice(index + 1);
				if (line) dispatch(peer, line);
			}
		});
		socket.on('error', err => {
			console.warn('[bbconnectmod] 连接错误', err);
			closePeer(peer);
		});
		socket.on('close', () => closePeer(peer));
		send(peer, {type: 'hello_ack', plugin: PLUGIN_ID, plugin_version: '1.0.0', port: getPort()});
	}

	function dispatch(peer, line) {
		let message;
		try {
			message = JSON.parse(line);
		} catch (err) {
			sendError(peer, '无法解析消息');
			return;
		}
		if (!message || typeof message !== 'object') return;
		switch (message.type) {
			case 'hello':
				peer.hello = message;
				break;
			case 'open':
				handleOpen(peer, message);
				break;
			case 'sync_ack':
				console.log('[bbconnectmod] 游戏端同步结果', message);
				Blockbench.showQuickMessage(message.ok
					? `游戏已重载模型（${message.reload || 'unknown'}）`
					: `游戏端重载失败：${message.reload || 'unknown'}`, 4000);
				break;
			case 'ping':
				send(peer, {type: 'pong'});
				break;
			default:
				break;
		}
	}

	// ---------- 监听 ----------

	function stopServer(silent) {
		if (state.server) {
			try { state.server.close(); } catch (err) { /* ignore */ }
			state.server = null;
		}
		for (let peer of Array.from(state.peers)) closePeer(peer);
		state.status = 'stopped';
		state.detail = '';
		if (!silent) Blockbench.showQuickMessage('BB Connect 已停止监听', 3000);
	}

	function startServer(attempt) {
		if (!state.net) return;
		attempt = attempt || 0;
		stopServer(true);
		let port = getPort();
		let server;
		try {
			server = state.net.createServer(handleClient);
		} catch (err) {
			state.status = 'error';
			state.detail = String(err);
			console.error('[bbconnectmod] 创建监听失败', err);
			return;
		}
		server.on('error', err => {
			const code = err && err.code;
			// 端口切换/插件重载时旧监听仍在关闭中，短暂重试即可。
			if (code === 'EADDRINUSE' && attempt < 5) {
				console.warn(`[bbconnectmod] 端口 ${port} 仍被占用，重试 ${attempt + 1}`);
				setTimeout(() => startServer(attempt + 1), 200);
				return;
			}
			state.status = 'error';
			state.detail = err && err.message ? err.message : String(err);
			console.error('[bbconnectmod] 监听错误', err);
			Blockbench.showQuickMessage(`BB Connect 监听失败：${state.detail}`, 5000);
		});
		server.listen(port, '127.0.0.1', () => {
			if (state.server !== server) {
				try { server.close(); } catch (err) { /* 已被替换 */ }
				return;
			}
			state.status = 'listening';
			state.detail = `127.0.0.1:${port}`;
			console.log(`[bbconnectmod] 正在监听 ${state.detail}`);
			Blockbench.showQuickMessage(`BB Connect 正在监听 ${state.detail}`, 3000);
		});
		state.server = server;
	}

	// ---------- YSM 模型包 ----------

	function readManifest(dir) {
		let file = state.path.join(dir, 'ysm.json');
		return JSON.parse(state.fs.readFileSync(file, 'utf8'));
	}

	function playerSection(manifest) {
		let files = manifest && manifest.files;
		return files && files.player ? files.player : null;
	}

	function textureEntries(player) {
		let texture = player && player.texture;
		if (typeof texture === 'string') return [texture];
		if (!Array.isArray(texture)) return [];
		return texture.map(entry => typeof entry === 'string' ? entry : (entry && entry.uv)).filter(Boolean);
	}

	function animationFiles(player) {
		let result = [];
		let animation = player && player.animation;
		if (typeof animation === 'string' && animation) {
			result.push(animation);
		} else if (animation && typeof animation === 'object') {
			for (let value of Object.values(animation)) {
				if (typeof value === 'string' && value) result.push(value);
			}
		}
		let controllers = player && player.animation_controllers;
		if (Array.isArray(controllers)) {
			for (let value of controllers) if (typeof value === 'string' && value) result.push(value);
		}
		return result;
	}

	/** 模型目录内的相对路径（统一正斜杠），目录外返回 null。 */
	function relativeInside(dir, file) {
		let rel = state.path.relative(dir, file);
		if (rel.startsWith('..') || state.path.isAbsolute(rel)) return null;
		return rel.split(state.path.sep).join('/');
	}

	function hasManifest(dir) {
		return !!dir && state.fs.existsSync(state.path.join(dir, 'ysm.json'));
	}

	/** 项目对应的 YSM 模型包目录：记录的包路径优先，其次从导出/保存路径向上查找 ysm.json。 */
	function projectPackDir(project) {
		if (!project) return null;
		if (hasManifest(project.bbconnect_pack)) return project.bbconnect_pack;
		let start = project.export_path || project.save_path;
		if (!start) return null;
		let current = state.path.dirname(start);
		for (let depth = 0; depth < 8 && current; depth++) {
			if (hasManifest(current)) return current;
			let parent = state.path.dirname(current);
			if (parent === current) break;
			current = parent;
		}
		return null;
	}

	function rememberPack(project, packDir) {
		project.bbconnect_pack = packDir;
		// 与 ysm_utils 的约定：指向模型包根目录，供其「当前信息」菜单使用。
		project.ysm_project_info = {path: packDir};
	}

	/** 插件自管的 .bbmodel 保存位置，避免把额外文件写进模型包目录。 */
	function projectSavePath(packDir) {
		let userData = state.path.dirname(Plugins.path || '');
		let dir = state.path.join(userData, 'bbconnect');
		try {
			state.fs.mkdirSync(dir, {recursive: true});
		} catch (err) {
			console.warn('[bbconnectmod] 无法创建项目缓存目录', err);
		}
		return state.path.join(dir, state.path.basename(packDir) + '.bbmodel');
	}

	function pushAnimationFiles(dir, player) {
		let loaded = 0;
		for (let rel of animationFiles(player)) {
			let full = state.path.join(dir, rel);
			if (!state.fs.existsSync(full)) continue;
			let content = state.fs.readFileSync(full, 'utf8');
			let json = autoParseJSON(content, {file_path: full});
			if (!json) continue;
			let codec = json.animation_controllers
				? AnimationCodec.codecs.bedrock_animation_controller
				: AnimationCodec.codecs.bedrock;
			codec.loadFile({path: full, name: state.path.basename(full), content});
			loaded++;
		}
		return loaded;
	}

	function pushTextures(dir, player) {
		let loaded = 0;
		for (let rel of textureEntries(player)) {
			let full = state.path.join(dir, rel);
			if (!state.fs.existsSync(full)) continue;
			let dataUrl = 'data:image/png;base64,' + state.fs.readFileSync(full).toString('base64');
			new Texture()
				.fromFile({path: full, name: state.path.basename(full), content: dataUrl})
				.add(false, false);
			loaded++;
		}
		return loaded;
	}

	/**
	 * 把一个 YSM 模型文件夹导入为 Blockbench 项目。
	 * 复用核心 loadModelFile（Bedrock geometry）以及 AnimationCodec 的 bedrock 载入流程。
	 */
	async function importPack(dir) {
		let packDir = state.path.resolve(dir);
		let manifest = readManifest(packDir);
		let player = playerSection(manifest);
		if (!player || !player.model || !player.model.main) {
			throw new Error('ysm.json 缺少 files.player.model.main');
		}
		let mainPath = state.path.join(packDir, player.model.main);
		if (!state.fs.existsSync(mainPath)) {
			throw new Error(`主模型文件不存在：${player.model.main}`);
		}

		let existing = typeof ModelProject === 'undefined' ? null
			: ModelProject.all.find(project => projectPackDir(project) === packDir);
		if (existing) {
			// 同一个包再次连接时只切回已有项目：重复导入会让贴图/动画在这份项目里翻倍。
			existing.select();
			rememberPack(existing, packDir);
			Blockbench.showQuickMessage(`YSM 模型已在 Blockbench 中打开：${state.path.basename(packDir)}`, 3000);
			return existing;
		}

		loadModelFile({
			path: mainPath,
			name: state.path.basename(mainPath),
			content: state.fs.readFileSync(mainPath, 'utf8'),
		});
		if (!Project) throw new Error('无法创建 Blockbench 项目');

		rememberPack(Project, packDir);
		// Ctrl+S 只写 .bbmodel；几何由本插件写回，避免核心 bedrock codec 的「按 identifier 合并」
		// 去改写 YSM 的模型文件。保存位置放在插件自管目录，不往模型包里塞多余文件。
		Project.export_path = '';
		Project.export_codec = '';
		if (!Project.save_path) Project.save_path = projectSavePath(packDir);

		Undo.initEdit({textures: []});
		let textures = pushTextures(packDir, player);
		Undo.finishEdit('导入 YSM 贴图');

		Undo.initEdit({animations: []});
		let animations = pushAnimationFiles(packDir, player);
		Undo.finishEdit('导入 YSM 动画');

		Blockbench.showQuickMessage(
			`已打开 YSM 模型：${state.path.basename(packDir)}（${textures} 张贴图，${animations} 个动画文件）`, 4000);
		return Project;
	}

	/** 把当前项目写回模型文件夹，返回实际写入的相对路径列表。 */
	function exportPack(project) {
		let packDir = projectPackDir(project);
		if (!packDir) return [];
		let manifest = readManifest(packDir);
		let player = playerSection(manifest);
		if (!player || !player.model || !player.model.main) {
			throw new Error('ysm.json 缺少 files.player.model.main');
		}
		let written = [];

		let codec = (project.format && project.format.codec) || (typeof Format !== 'undefined' ? Format.codec : null);
		if (!codec || typeof codec.compile !== 'function') {
			throw new Error('当前项目格式没有可用的几何导出器');
		}
		let mainPath = state.path.join(packDir, player.model.main);
		// 直接落盘而不是 codec.write：后者对已存在的文件按 geometry identifier 合并，会改写 YSM 包。
		state.fs.writeFileSync(mainPath, codec.compile());
		written.push(relativeInside(packDir, mainPath));

		for (let texture of Texture.all) {
			if (!texture.path) continue;
			let rel = relativeInside(packDir, texture.path);
			if (!rel) continue;
			state.fs.writeFileSync(texture.path, Buffer.from(texture.getBase64(), 'base64'));
			written.push(rel);
		}

		written.push(...writeAnimationFiles(packDir));
		return written.filter(Boolean);
	}

	function writeAnimationFiles(packDir) {
		let written = [];
		let bedrock = AnimationCodec.codecs.bedrock;
		let controllers = AnimationCodec.codecs.bedrock_animation_controller;

		let groups = new Map();
		let collect = (items, codec) => {
			if (!codec || typeof codec.compileFile !== 'function') return;
			for (let item of items) {
				if (!item.path) continue;
				let rel = relativeInside(packDir, item.path);
				if (!rel) continue;
				let key = item.path;
				if (!groups.has(key)) groups.set(key, {codec, items: []});
				groups.get(key).items.push(item);
			}
		};
		collect(Animation.all, bedrock);
		collect(AnimationController.all, controllers);

		for (let [file, group] of groups) {
			let content = group.codec.compileFile(group.items);
			state.fs.writeFileSync(file, autoStringify(content));
			written.push(relativeInside(packDir, file));
		}
		return written;
	}

	function syncToGame(silent) {
		let packDir = Project ? projectPackDir(Project) : null;
		if (!packDir) {
			if (!silent) Blockbench.showQuickMessage('当前项目不是从游戏打开的 YSM 模型', 3000);
			return;
		}
		rememberPack(Project, packDir);
		let files;
		try {
			files = exportPack(Project);
		} catch (err) {
			console.error('[bbconnectmod] 写回模型包失败', err);
			Blockbench.showQuickMessage(`写回模型包失败：${(err && err.message) || err}`, 5000);
			for (let peer of state.peers) sendError(peer, (err && err.message) || String(err));
			return;
		}
		if (!state.peers.size) {
			if (!silent) Blockbench.showQuickMessage(`已写回 ${files.length} 个文件（游戏未连接）`, 3000);
			return;
		}
		for (let peer of state.peers) send(peer, {type: 'save', path: packDir, files});
		if (!silent) Blockbench.showQuickMessage(`已写回 ${files.length} 个文件，等待游戏重载模型`, 3000);
	}

	async function handleOpen(peer, message) {
		let dir = message.path;
		if (typeof dir !== 'string' || !dir) {
			sendError(peer, '缺少模型目录');
			return;
		}
		try {
			if (!state.fs.existsSync(state.path.join(dir, 'ysm.json'))) {
				sendError(peer, `模型目录缺少 ysm.json：${dir}`);
				return;
			}
			let project = await importPack(dir);
			send(peer, {type: 'opened', path: dir, project: project ? (project.name || '') : ''});
		} catch (err) {
			console.error('[bbconnectmod] 打开模型失败', err);
			sendError(peer, (err && err.message) || String(err));
		}
	}

	// ---------- 保存钩子 ----------

	// 一次 Ctrl+S 会连着触发 save_project（编译 bbmodel）与 quick_save_model（动作结束），去抖成一次同步。
	function scheduleSync() {
		if (!Project || !projectPackDir(Project)) return;
		if (state.sync_timer) clearTimeout(state.sync_timer);
		state.sync_timer = setTimeout(() => {
			state.sync_timer = null;
			syncToGame(true);
		}, 150);
	}

	function installSaveHooks() {
		state.save_listener = Blockbench.on('save_project', scheduleSync);
		state.quick_save_listener = Blockbench.on('quick_save_model', scheduleSync);
	}
	function removeSaveHooks() {
		for (let key of ['save_listener', 'quick_save_listener']) {
			let listener = state[key];
			if (listener && typeof listener.delete === 'function') listener.delete();
			state[key] = null;
		}
		if (state.sync_timer) {
			clearTimeout(state.sync_timer);
			state.sync_timer = null;
		}
	}

	// ---------- 界面 ----------

	new Action('bbconnectmod_status', {
		name: 'BB Connect 状态',
		description: '查看监听状态、修改端口、手动同步当前项目',
		icon: 'cable',
		click() { showStatusDialog(); },
	});
	new Action('bbconnectmod_sync', {
		name: '同步到游戏',
		description: '把当前 YSM 项目写回模型文件夹并通知游戏重载',
		icon: 'sync',
		click() { syncToGame(false); },
	});

	function showStatusDialog() {
		let text = state.status === 'listening'
			? `正在监听 ${state.detail}（${state.peers.size} 个连接）`
			: (state.status === 'error' ? `监听失败：${state.detail}` : '未监听');
		new Dialog({
			id: 'bbconnectmod_status_dialog',
			title: 'BB Connect',
			form: {
				status: {type: 'info', label: '状态', text: text},
				port: {type: 'number', label: '端口', value: getPort(), min: 1024, max: 65535},
			},
			onConfirm(form) {
				if (setPort(form.port)) {
					startServer();
				} else {
					Blockbench.showQuickMessage('端口无效（1024-65535）', 3000);
				}
				this.hide();
			},
		}).show();
	}

	new BarMenu('bbconnectmod', ['bbconnectmod_status', 'bbconnectmod_sync']);
	MenuBar.update();

	Plugin.register(PLUGIN_ID, {
		title: 'BB Connect (YSM ↔ Blockbench)',
		author: 'tt432',
		description: '把 Yes Steve Model 文件夹模型接到 Blockbench：游戏内点击「连接到 BB」打开项目，保存即写回并通知游戏重载模型。',
		icon: 'cable',
		variant: 'desktop',
		version: '1.0.0',
		min_version: '5.3.85',
		dependencies: ['ysm_utils'],
		tags: ['Minecraft: Java Edition', 'Yes Steve Model', 'Bridge'],
		onload() {
			new Setting('bbconnectmod_port', {
				name: 'BB Connect 端口',
				description: '插件监听端口；需与模组 config/bbconnectmod-client.toml 的 bridge.port 一致。',
				category: 'general',
				plugin: PLUGIN_ID,
				type: 'number',
				value: DEFAULT_PORT,
				min: 1024,
				max: 65535,
				step: 1,
				onChange: value => {
					setPort(value);
					if (state.status === 'listening') startServer();
				},
			});
			loadModules();
			new Property(ModelProject, 'string', 'bbconnect_pack', {default: ''});
			installSaveHooks();
			startServer();
		},
		onunload() {
			removeSaveHooks();
			stopServer(true);
		},
	});
})();
