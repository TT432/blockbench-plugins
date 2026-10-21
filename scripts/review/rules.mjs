/**
 * 确定性规则层。只做可复现判定，不做语义推断。
 *
 * 输入 ctx：
 *   changes   [{ status:'A'|'M'|'D', path }]   本次 PR 相对 base 的变更
 *   files     Map<path, {text?:string, bytes:number, binary:boolean}>  head 处内容（已删除文件不在此表）
 *   pjBase / pjHead / upBase / upHead           JSON.parse 后的插件清单（缺失为 null）
 *   pluginFiles Map<id, Map<path, {text?, binary, bytes}>>  被触及插件的**整目录**内容
 *
 * 输出 { findings, touchedIds, manualOnly }
 *   findings: { check, severity:'block'|'warn', category, file, line?, quote?, reason }
 *   manualOnly: true 表示禁止自动合并（删除、基础设施改动等）
 */

import {
	ABS_PATH_RE,
	ALLOWED_BINARY_EXTENSIONS,
	ALLOWED_PATH_PREFIXES,
	BLOCKED_PATH_PREFIXES,
	BLOCK_TERMS,
	DANGEROUS_APIS,
	EGRESS_ALLOW_HOSTS,
	EGRESS_RE,
	INSECURE_EGRESS_RE,
	LIMITS,
	OBFUSCATION_CHECKS,
	PLUGIN_ID_RE,
	PROMPT_INJECTION_CHECKS,
	REQUIRED_PLUGIN_FIELDS,
	SEMVER_RE,
	TEXT_EXTENSIONS,
	WARN_TERMS,
} from './policy.mjs';

const MAX_HITS_PER_CHECK = 5;

function lineAt(text, index) {
	let line = 1;
	for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
	return line;
}

function quote(text, index, len = 80) {
	const start = Math.max(0, index - 20);
	const raw = text.slice(start, index + len).replace(/\s+/g, ' ');
	return (start > 0 ? '…' : '') + raw + (index + len < text.length ? '…' : '');
}

function extOf(path) {
	const m = /\.[A-Za-z0-9]+$/.exec(path);
	return m ? m[0].toLowerCase() : '';
}

/**
 * 词表匹配：英文条目按整词（\b）匹配，中文条目按子串匹配。
 * 纯子串会把 between/alpha 命成 "bet"/"alpha"，是噪音源。
 */
function findTermIndex(text, term) {
	if (!/[A-Za-z]/.test(term)) return text.toLowerCase().indexOf(term.toLowerCase());
	const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = new RegExp(`\\b${escaped}\\b`, 'i').exec(text);
	return match ? match.index : -1;
}

function isText(path) {
	return TEXT_EXTENSIONS.includes(extOf(path));
}

/** 键序无关的规范化，用于 manifest 语义比对。 */
function normalize(value) {
	if (Array.isArray(value)) return value.map(normalize);
	if (value && typeof value === 'object') {
		const out = {};
		for (const key of Object.keys(value).sort()) out[key] = normalize(value[key]);
		return out;
	}
	return value;
}

function sameJson(a, b) {
	return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

/** 两份清单的语义差异。 */
export function diffIds(base, head) {
	const added = new Set();
	const removed = new Set();
	const changed = new Set();
	const b = base && typeof base === 'object' ? base : {};
	const h = head && typeof head === 'object' ? head : {};
	for (const id of Object.keys(h)) {
		if (!(id in b)) added.add(id);
		else if (!sameJson(b[id], h[id])) changed.add(id);
	}
	for (const id of Object.keys(b)) if (!(id in h)) removed.add(id);
	return { added, removed, changed };
}

function collectStrings(value, path = '', out = []) {
	if (typeof value === 'string') out.push([path, value]);
	else if (Array.isArray(value)) value.forEach((item, i) => collectStrings(item, `${path}[${i}]`, out));
	else if (value && typeof value === 'object') {
		for (const key of Object.keys(value)) collectStrings(value[key], path ? `${path}.${key}` : key, out);
	}
	return out;
}

export function runRules(ctx) {
	const findings = [];
	const add = (finding) => {
		if (findings.filter((f) => f.check === finding.check).length < MAX_HITS_PER_CHECK) findings.push(finding);
	};
	let manualOnly = false;

	const { changes, files, pjBase, pjHead, upBase, upHead, pluginFiles } = ctx;

	// ── 1. 路径闸门 ──────────────────────────────────────────────
	const touchedIds = new Set();
	for (const change of changes) {
		const path = change.path;
		if (BLOCKED_PATH_PREFIXES.some((p) => path.startsWith(p))) {
			add({
				check: 'path-gate',
				severity: 'block',
				category: 'malicious',
				file: path,
				reason: '审查基础设施（工作流/脚本）不可由 PR 修改，请改用 issue 讨论',
			});
			manualOnly = true;
			continue;
		}
		if (!ALLOWED_PATH_PREFIXES.some((p) => path === p || path.startsWith(p))) {
			add({
				check: 'path-gate',
				severity: 'block',
				category: 'malicious',
				file: path,
				reason: '变更超出允许范围：仅可提交 plugins/<id>/**、plugins.json、updates.json',
			});
			continue;
		}
		const m = /^plugins\/([^/]+)\//.exec(path);
		if (m) touchedIds.add(m[1]);
	}

	const pjDiff = diffIds(pjBase, pjHead);
	const upDiff = diffIds(upBase, upHead);
	for (const id of [...pjDiff.added, ...pjDiff.removed, ...pjDiff.changed]) touchedIds.add(id);
	for (const id of [...upDiff.added, ...upDiff.removed, ...upDiff.changed]) touchedIds.add(id);

	const ids = [...touchedIds].sort();
	if (ids.length === 0) {
		add({
			check: 'single-plugin',
			severity: 'block',
			category: 'malicious',
			file: '-',
			reason: '未能识别出被修改的插件 id（清单与文件不一致）',
		});
	}
	if (ids.length > LIMITS.maxPluginsPerPr) {
		add({
			check: 'single-plugin',
			severity: 'block',
			category: 'malicious',
			file: ids.join(', '),
			reason: `一个 PR 只能涉及 1 个插件，本次涉及 ${ids.length} 个：${ids.join(', ')}。请拆分 PR`,
		});
	}
	for (const id of ids) {
		if (!PLUGIN_ID_RE.test(id)) {
			add({
				check: 'single-plugin',
				severity: 'block',
				category: 'malicious',
				file: `plugins/${id}`,
				reason: '插件 id 必须匹配 ^[a-z0-9_]{2,48}$',
			});
		}
	}

	// 删除类变更不走自动合并：允许自动合并等于允许自动下架他人插件
	const deletedPluginIds = [...pjDiff.removed];
	const deletedPluginFiles = changes.filter((c) => c.status === 'D' && c.path.startsWith('plugins/')).length;
	if (deletedPluginIds.length || deletedPluginFiles) {
		manualOnly = true;
		add({
			check: 'single-plugin',
			severity: 'warn',
			category: 'malicious',
			file: deletedPluginIds.join(', ') || 'plugins/',
			reason: '包含删除操作：删除要么有下架理由，要么是误删，一律转人工处理（不自动合并）',
		});
	}

	// ── 2. 体量闸门 ──────────────────────────────────────────────
	if (changes.length > LIMITS.maxFiles) {
		add({
			check: 'limits',
			severity: 'block',
			category: 'malicious',
			file: '-',
			reason: `变更文件数 ${changes.length} 超过上限 ${LIMITS.maxFiles}`,
		});
	}
	let totalBytes = 0;
	for (const change of changes) {
		const file = files.get(change.path);
		if (!file) continue;
		totalBytes += file.bytes;
		if (file.bytes > LIMITS.maxFileBytes) {
			add({
				check: 'limits',
				severity: 'block',
				category: 'malicious',
				file: change.path,
				reason: `单文件 ${file.bytes} 字节超过上限 ${LIMITS.maxFileBytes}（体积过大无法完整审查）`,
			});
		}
		const ext = extOf(change.path);
		if (file.binary && !ALLOWED_BINARY_EXTENSIONS.includes(ext)) {
			add({
				check: 'limits',
				severity: 'block',
				category: 'malicious',
				file: change.path,
				reason: `不允许的二进制文件类型 ${ext || '(无扩展名)'}；仅允许 ${ALLOWED_BINARY_EXTENSIONS.join(' ')}`,
			});
		}
	}
	if (totalBytes > LIMITS.maxTotalBytes) {
		add({
			check: 'limits',
			severity: 'block',
			category: 'malicious',
			file: '-',
			reason: `变更总量 ${totalBytes} 字节超过上限 ${LIMITS.maxTotalBytes}`,
		});
	}

	// ── 3. 清单 schema ───────────────────────────────────────────
	if (!pjHead || typeof pjHead !== 'object') {
		add({
			check: 'manifest',
			severity: 'block',
			category: 'malicious',
			file: 'plugins.json',
			reason: 'plugins.json 缺失或不是合法 JSON 对象',
		});
	}
	for (const id of ids) {
		const entry = pjHead?.[id];
		if (!entry) {
			if (!pjDiff.removed.has(id)) {
				add({
					check: 'manifest',
					severity: 'block',
					category: 'malicious',
					file: 'plugins.json',
					reason: `插件 ${id} 在 plugins.json 中缺少条目`,
				});
			}
			continue;
		}
		for (const field of REQUIRED_PLUGIN_FIELDS) {
			if (!(field in entry)) {
				add({
					check: 'manifest',
					severity: 'block',
					category: 'malicious',
					file: 'plugins.json',
					reason: `${id} 缺少必填字段 ${field}`,
				});
			}
		}
		if (typeof entry.version === 'string' && !SEMVER_RE.test(entry.version)) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: 'plugins.json',
				reason: `${id} 的 version「${entry.version}」不是 x.y.z 形式`,
			});
		}
		if (entry.min_version && !SEMVER_RE.test(String(entry.min_version))) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: 'plugins.json',
				reason: `${id} 的 min_version「${entry.min_version}」不是 x.y.z 形式`,
			});
		}
		if (!Array.isArray(entry.tags) || entry.tags.length === 0 || entry.tags.length > 12) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: 'plugins.json',
				reason: `${id} 的 tags 必须是 1-12 项的字符串数组`,
			});
		}
		if (!String(entry.description || '').trim()) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: 'plugins.json',
				reason: `${id} 的 description 为空`,
			});
		}
		if (entry.new_repository_format !== true) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: 'plugins.json',
				reason: `${id} 必须设置 new_repository_format: true`,
			});
		}
		for (const field of ['repository', 'bug_tracker']) {
			const url = entry[field];
			if (typeof url !== 'string' || !/^https:\/\//.test(url)) {
				add({
					check: 'manifest',
					severity: 'block',
					category: 'malicious',
					file: 'plugins.json',
					reason: `${id} 的 ${field} 必须是 https:// 链接（不能留空，否则客户端指向官方仓库）`,
				});
			} else if (/JannisX11\/blockbench-plugins/i.test(url)) {
				add({
					check: 'manifest',
					severity: 'block',
					category: 'malicious',
					file: 'plugins.json',
					reason: `${id} 的 ${field} 指向官方插件库，应指向作者自己的仓库`,
				});
			}
		}
		// 目录与主文件必须存在
		const dir = `plugins/${id}/`;
		const mainFile = `${dir}${id}.js`;
		const dirFiles = pluginFiles.get(id) || new Map();
		const hasMain = [...dirFiles.keys()].includes(mainFile) || changes.some((c) => c.path === mainFile && c.status !== 'D');
		if (!hasMain) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: mainFile,
				reason: `缺少主文件 plugins/${id}/${id}.js（新仓库格式要求文件名与 id 一致）`,
			});
		}
		if (![...dirFiles.keys()].some((p) => p.endsWith('/about.md'))) {
			add({
				check: 'manifest',
				severity: 'warn',
				category: 'malicious',
				file: `plugins/${id}/about.md`,
				reason: '缺少 about.md，商店 About 页将为空',
			});
		}
		// updates.json 版本必须与清单一致
		const up = upHead?.[id];
		if (up && entry.version && up.version !== entry.version) {
			add({
				check: 'manifest',
				severity: 'block',
				category: 'malicious',
				file: 'updates.json',
				reason: `${id} 的 updates.json 版本 ${up.version} 与 plugins.json 版本 ${entry.version} 不一致`,
			});
		}
	}

	// ── 4. 注册信息一致性 ───────────────────────────────────────
	for (const id of ids) {
		const mainFile = `plugins/${id}/${id}.js`;
		const text = pluginFiles.get(id)?.get(mainFile)?.text;
		const entry = pjHead?.[id];
		if (!text || !entry) continue;
		const register = /BBPlugin\.register\s*\(([\s\S]{0,600}?)\)\s*;?\s*$/m.exec(text) || /BBPlugin\.register\s*\(([\s\S]{0,600})/.exec(text);
		if (!register) {
			add({
				check: 'register',
				severity: 'block',
				category: 'malicious',
				file: mainFile,
				reason: '未找到 BBPlugin.register 调用',
			});
			continue;
		}
		const body = register[1];
		const idLiteral = /^\s*['"]([^'"]+)['"]/.exec(body)?.[1];
		const idConst = /(?:const|let|var)\s+PLUGIN_ID\s*=\s*['"]([^'"]+)['"]/.exec(text)?.[1];
		const registeredId = idLiteral || idConst;
		if (registeredId && registeredId !== id) {
			add({
				check: 'register',
				severity: 'block',
				category: 'malicious',
				file: mainFile,
				reason: `register 的 id「${registeredId}」与插件 id「${id}」不一致`,
			});
		}
		const regVersion = /\bversion\s*:\s*['"]([^'"]+)['"]/.exec(body)?.[1];
		if (regVersion && entry.version && regVersion !== entry.version) {
			add({
				check: 'register',
				severity: 'block',
				category: 'malicious',
				file: mainFile,
				reason: `register 的 version「${regVersion}」与清单 version「${entry.version}」不一致`,
			});
		}
	}

	// ── 5. 文本规则（对整目录内容执行，不只 diff） ───────────────
	const textFiles = [];
	for (const [id, dirMap] of pluginFiles) {
		for (const [path, file] of dirMap) {
			if (file.text != null) textFiles.push([path, file.text]);
			void id;
		}
	}
	for (const change of changes) {
		// 被 path-gate 拒绝的路径已硬阻断，不再做内容扫描（避免审查器自己的词表自我命中）
		if (BLOCKED_PATH_PREFIXES.some((p) => change.path.startsWith(p))) continue;
		const file = files.get(change.path);
		if (file?.text != null && !textFiles.some(([p]) => p === change.path)) textFiles.push([change.path, file.text]);
	}

	for (const [path, text] of textFiles) {
		// 危险 API
		for (const api of DANGEROUS_APIS) {
			const match = api.re.exec(text);
			if (match) {
				add({
					check: 'dangerous-api',
					severity: 'block',
					category: 'malicious',
					file: path,
					line: lineAt(text, match.index),
					quote: quote(text, match.index),
					reason: api.reason,
				});
			}
		}
		// 明文 HTTP 外发
		const insecure = INSECURE_EGRESS_RE.exec(text);
		if (insecure) {
			add({
				check: 'egress',
				severity: 'block',
				category: 'malicious',
				file: path,
				line: lineAt(text, insecure.index),
				quote: quote(text, insecure.index),
				reason: '使用明文 HTTP 外发数据（可被篡改，后门常见信道）',
			});
		}
		// 非白名单外联 → warn
		EGRESS_RE.lastIndex = 0;
		let egress;
		const seenHosts = new Set();
		while ((egress = EGRESS_RE.exec(text))) {
			let host = '';
			try {
				host = new URL(egress[1]).hostname;
			} catch {
				continue;
			}
			if (EGRESS_ALLOW_HOSTS.includes(host) || seenHosts.has(host)) continue;
			seenHosts.add(host);
			add({
				check: 'egress',
				severity: 'warn',
				category: 'malicious',
				file: path,
				line: lineAt(text, egress.index),
				quote: host,
				reason: '向非白名单域名发起网络请求，需确认用途（数据外发风险）',
			});
		}
		// 混淆特征
		for (const rule of OBFUSCATION_CHECKS) {
			rule.re.lastIndex = 0;
			let count = 0;
			let firstIndex = -1;
			let m;
			while ((m = rule.re.exec(text))) {
				count++;
				if (firstIndex < 0) firstIndex = m.index;
				if (count >= rule.min) break;
			}
			if (count >= rule.min) {
				add({
					check: 'obfuscation',
					severity: 'block',
					category: 'malicious',
					file: path,
					line: lineAt(text, firstIndex),
					quote: quote(text, firstIndex, 60),
					reason: rule.reason,
				});
			}
		}
		// 提示注入
		for (const re of PROMPT_INJECTION_CHECKS) {
			const m = re.exec(text);
			if (m) {
				add({
					check: 'prompt-injection',
					severity: 'block',
					category: 'malicious',
					file: path,
					line: lineAt(text, m.index),
					quote: quote(text, m.index),
					reason: '文本中出现试图操纵审查器的指令（提示注入）',
				});
				break;
			}
		}
		// 明确违规词
		for (const { term, category } of BLOCK_TERMS) {
			const idx = findTermIndex(text, term);
			if (idx >= 0) {
				add({
					check: 'blocked-term',
					severity: 'block',
					category,
					file: path,
					line: lineAt(text, idx),
					quote: quote(text, idx),
					reason: `命中明确违规词「${term}」`,
				});
			}
		}
		// 可疑词 → warn，作为 LLM 定位线索
		for (const { term, category } of WARN_TERMS) {
			const idx = findTermIndex(text, term);
			if (idx >= 0) {
				add({
					check: 'suspect-term',
					severity: 'warn',
					category,
					file: path,
					line: lineAt(text, idx),
					quote: quote(text, idx),
					reason: `命中需语义判定的可疑词「${term}」`,
				});
			}
		}
	}

	// ── 6. 本机绝对路径（发布产物污染） ─────────────────────────
	for (const [path, text] of textFiles) {
		const m = ABS_PATH_RE.exec(text);
		if (m) {
			add({
				check: 'abs-path',
				severity: 'block',
				category: 'malicious',
				file: path,
				line: lineAt(text, m.index),
				quote: quote(text, m.index),
				reason: '发布产物中出现本机绝对路径（泄露作者环境且对他人无效）',
			});
		}
	}

	// 清单字符串也纳入绝对路径检查（文件表里可能没有 plugins.json）
	for (const [path, value] of [['plugins.json', pjHead], ['updates.json', upHead]]) {
		if (!value) continue;
		for (const [pointer, str] of collectStrings(value)) {
			const m = ABS_PATH_RE.exec(str);
			if (m) {
				add({
					check: 'abs-path',
					severity: 'block',
					category: 'malicious',
					file: path,
					quote: quote(str, m.index),
					reason: `字段 ${pointer} 含本机绝对路径`,
				});
			}
		}
	}

	return { findings, touchedIds: ids, manualOnly };
}

/** 供 review.mjs 判断是否需要把某个文件送 LLM。 */
export { isText, extOf };
