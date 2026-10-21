#!/usr/bin/env node
/**
 * 插件 PR 自动审查入口。
 *
 * 用法：
 *   node scripts/review/review.mjs --base <sha/ref> --head <ref> [--out review-report.md]
 *   node scripts/review/review.mjs --base HEAD~1 --head HEAD --rules-only
 *
 * 退出码：0 = 通过（可自动合并）；1 = 不通过；2 = 需人工（不可自动合并，但不算违规）。
 *
 * 安全前提：本脚本由 base 分支检出后执行；PR 内容只作为文本读取，从不执行。
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { CATEGORIES, LIMITS } from './policy.mjs';
import { extOf, isText, runRules } from './rules.mjs';
import { reviewTexts } from './llm.mjs';

const MAX_BUFFER = 32 * 1024 * 1024;

function git(args) {
	return execFileSync('git', args, { maxBuffer: MAX_BUFFER, encoding: 'buffer' });
}

function gitText(args) {
	return execFileSync('git', args, { maxBuffer: MAX_BUFFER, encoding: 'utf8' });
}

/** 返回 { text } 或 { binary:true }，文件不存在返回 null。 */
function readBlob(ref, path) {
	let buffer;
	try {
		buffer = git(['show', `${ref}:${path}`]);
	} catch {
		return null;
	}
	if (buffer.includes(0)) return { binary: true, bytes: buffer.length };
	try {
		const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
		return { text, bytes: buffer.length };
	} catch {
		return { binary: true, bytes: buffer.length };
	}
}

function readJson(ref, path) {
	const blob = readBlob(ref, path);
	if (!blob?.text) return null;
	try {
		return JSON.parse(blob.text);
	} catch {
		return null;
	}
}

function parseArgs(argv) {
	const args = { out: 'review-report.md', base: 'HEAD~1', head: 'HEAD', rulesOnly: false, verdictOut: 'review-verdict.json' };
	for (let i = 0; i < argv.length; i++) {
		const token = argv[i];
		if (token === '--base') args.base = argv[++i];
		else if (token === '--head') args.head = argv[++i];
		else if (token === '--out') args.out = argv[++i];
		else if (token === '--verdict-out') args.verdictOut = argv[++i];
		else if (token === '--rules-only') args.rulesOnly = true;
	}
	return args;
}

function listChanges(base, head) {
	const output = gitText(['diff', '--name-status', '--no-renames', base, head]);
	return output
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const [status, ...rest] = line.split('\t');
			return { status: status[0], path: rest.join('\t').trim() };
		})
		.filter((change) => change.path);
}

function listTree(ref, dir) {
	try {
		return gitText(['ls-tree', '-r', '--name-only', ref, '--', dir]).split('\n').filter(Boolean);
	} catch {
		return [];
	}
}

function collectPluginFiles(ref, ids) {
	const map = new Map();
	for (const id of ids) {
		const dir = `plugins/${id}/`;
		const inner = new Map();
		for (const path of listTree(ref, dir)) {
			const blob = readBlob(ref, path);
			if (blob) inner.set(path, blob);
		}
		map.set(id, inner);
	}
	return map;
}

function metaItem(id, entry) {
	if (!entry) return null;
	const fields = ['title', 'author', 'description', 'tags', 'variant', 'min_version'];
	const subset = {};
	for (const field of fields) if (field in entry) subset[field] = entry[field];
	return { path: `plugins.json#${id}`, text: JSON.stringify(subset, null, 2) };
}

function fmtBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function renderTable(rows, headers) {
	if (rows.length === 0) return '';
	const head = `| ${headers.join(' | ')} |`;
	const sep = `|${headers.map(() => '---').join('|')}|`;
	const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
	return `${head}\n${sep}\n${body}`;
}

function escapeCell(value) {
	return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const headSha = gitText(['rev-parse', args.head]).trim();
	const baseSha = gitText(['rev-parse', args.base]).trim();
	// PR 的真实改动是 merge-base..head。直接用 base..head 会把"分支落后于 base 造成的
	// 反向变更"（例如作者分支上没有刚合入的工作流修复）当成 PR 内容，导致误判。
	const mergeBase = gitText(['merge-base', args.base, args.head]).trim();

	const changes = listChanges(mergeBase, args.head);
	const files = new Map();
	for (const change of changes) {
		if (change.status === 'D') continue;
		const blob = readBlob(args.head, change.path);
		if (blob) files.set(change.path, blob);
	}

	const pjBase = readJson(mergeBase, 'plugins.json');
	const pjHead = readJson(args.head, 'plugins.json');
	const upBase = readJson(mergeBase, 'updates.json');
	const upHead = readJson(args.head, 'updates.json');

	// 先粗测被触及的 id，再加载整目录内容做全量确定性扫描
	const roughIds = new Set();
	for (const change of changes) {
		const m = /^plugins\/([^/]+)\//.exec(change.path);
		if (m) roughIds.add(m[1]);
	}
	for (const source of [pjBase, pjHead, upBase, upHead]) {
		if (source && typeof source === 'object') Object.keys(source).forEach((id) => roughIds.add(id));
	}
	const pluginFiles = collectPluginFiles(args.head, roughIds);

	const ruleResult = runRules({ changes, files, pjBase, pjHead, upBase, upHead, pluginFiles });
	const { findings, touchedIds, manualOnly: ruleManual } = ruleResult;

	// 语义审查：变更的文本文件 + 被触及插件的清单元数据
	const llmItems = [];
	const seen = new Set();
	for (const change of changes) {
		if (change.status === 'D') continue;
		// 清单文件只送被触及插件的条目（metaItem），避免把其他插件的文案一并判罚
		if (change.path === 'plugins.json' || change.path === 'updates.json') continue;
		const blob = files.get(change.path);
		if (!blob?.text || !isText(change.path)) continue;
		if (seen.has(change.path)) continue;
		seen.add(change.path);
		llmItems.push({ path: change.path, text: blob.text });
	}
	for (const id of touchedIds) {
		const item = metaItem(id, pjHead?.[id]);
		if (item && !seen.has(item.path)) {
			seen.add(item.path);
			llmItems.push(item);
		}
	}

	let llmFindings = [];
	let llmError = '';
	let llmResults = [];
	if (!args.rulesOnly) {
		const llm = await reviewTexts({
			apiKey: process.env.DEEPSEEK_API_KEY || '',
			baseUrl: process.env.DEEPSEEK_BASE_URL || undefined,
			model: process.env.DEEPSEEK_MODEL || undefined,
			items: llmItems,
		});
		if (llm.ok) {
			llmFindings = llm.findings;
			llmResults = llm.results;
		} else {
			llmError = llm.error;
		}
	}

	const allFindings = [...findings, ...llmFindings];
	const blocks = allFindings.filter((f) => f.severity === 'block');
	const warns = allFindings.filter((f) => f.severity !== 'block');
	const manual = ruleManual || Boolean(llmError);
	const verdict = blocks.length > 0 ? 'fail' : manual ? 'manual' : 'pass';

	// ── 报告渲染 ──────────────────────────────────────────────
	const lines = [];
	lines.push('<!-- plugin-review-report -->');
	lines.push(`## 插件审查报告 · ${verdict === 'pass' ? '通过' : verdict === 'fail' ? '不通过' : '需人工'}`);
	lines.push('');
	lines.push(`> 自动审查 · base \`${baseSha.slice(0, 7)}\` / 变更基准 \`${mergeBase.slice(0, 7)}\` → \`${headSha.slice(0, 7)}\` · 插件：${touchedIds.map((id) => `\`${id}\``).join('、') || '（未识别）'}`);
	lines.push('');
	if (verdict === 'pass') {
		lines.push(
			args.rulesOnly
				? '**结论：规则层通过（本次未执行语义审查）。**'
				: '**结论：通过，将自动合并。**',
		);
	} else if (verdict === 'fail') {
		lines.push(`**结论：不通过。** 存在 ${blocks.length} 个阻断问题${warns.length ? `、${warns.length} 个警告` : ''}，请修改后重新推送。`);
	} else {
		lines.push('**结论：需人工处理。** ' + (llmError ? `语义审查不可用：${llmError}` : '包含需要人工确认的变更（如删除）。'));
	}
	lines.push('');

	lines.push('### 检查项');
	const checkSummary = new Map();
	for (const finding of allFindings) {
		const key = finding.check;
		const entry = checkSummary.get(key) || { block: 0, warn: 0 };
		if (finding.severity === 'block') entry.block++;
		else entry.warn++;
		checkSummary.set(key, entry);
	}
	const checkRows = [
		['变更范围', changes.length ? `${changes.length} 个文件 / ${fmtBytes([...files.values()].reduce((n, f) => n + f.bytes, 0))}` : '—'],
		['单插件限制', touchedIds.length <= LIMITS.maxPluginsPerPr && touchedIds.length > 0 ? '通过' : '不通过'],
		['清单一致性', checkSummary.has('manifest') || checkSummary.has('register') ? '不通过' : '通过'],
		['危险 API / 混淆 / 注入', ['dangerous-api', 'obfuscation', 'prompt-injection', 'egress'].some((k) => checkSummary.has(k)) ? '有问题' : '通过'],
		['绝对路径', checkSummary.has('abs-path') ? '不通过' : '通过'],
		['语义审查（5 类）', llmError ? '不可用' : args.rulesOnly ? '未执行' : llmFindings.length ? '有问题' : '通过'],
	];
	lines.push(renderTable(checkRows.map((row) => row.map(escapeCell)), ['项目', '结果']));
	lines.push('');

	if (blocks.length) {
		lines.push('### 阻断问题');
		lines.push(
			renderTable(
				blocks.map((f) => [
					escapeCell(CATEGORIES[f.category]?.label || f.category),
					escapeCell(`${f.file}${f.line ? `:${f.line}` : ''}`),
					escapeCell(f.quote ? `\`${f.quote.slice(0, 120)}\`` : '—'),
					escapeCell(f.reason),
				]),
				['类别', '位置', '证据', '理由'],
			),
		);
		lines.push('');
	}
	if (warns.length) {
		lines.push('### 警告（不阻断，但请确认）');
		lines.push(
			renderTable(
				warns.map((f) => [
					escapeCell(CATEGORIES[f.category]?.label || f.category),
					escapeCell(`${f.file}${f.line ? `:${f.line}` : ''}`),
					escapeCell(f.reason),
				]),
				['类别', '位置', '理由'],
			),
		);
		lines.push('');
	}
	if (llmResults.length) {
		lines.push('### 语义审查明细');
		lines.push(renderTable(llmResults.map((r) => [escapeCell(r.path), escapeCell(r.verdict === 'pass' ? '通过' : '不通过')]), ['文件', '结论']));
		lines.push('');
	}
	lines.push('<sub>审查规则见 `docs/plugin-review.md`。规则层判断可复现；语义层由 DeepSeek 给出，任何一层异常都会转人工。</sub>');

	const report = lines.join('\n') + '\n';
	writeFileSync(args.out, report);
	writeFileSync(args.verdictOut, JSON.stringify({ verdict, head: headSha, base: baseSha, mergeBase, ids: touchedIds, blocks: blocks.length, warns: warns.length, llmError }, null, 2) + '\n');

	console.log(report);
	console.error(`\nverdict=${verdict} blocks=${blocks.length} warns=${warns.length}${llmError ? ` llmError=${llmError}` : ''}`);

	// 不用 process.exit()：Windows 上在 fetch 失败后强制退出会触发 libuv 断言（exit 9）
	process.exitCode = verdict === 'pass' ? 0 : verdict === 'fail' ? 1 : 2;
}

main().catch((error) => {
	console.error('审查执行失败：', error);
	process.exitCode = 2;
});
