/**
 * 插件审查策略。所有可调阈值与词表集中在此，方便审阅与调整。
 *
 * 设计原则：
 * - 规则层只做**可确定性判定**的事（路径、清单一致性、危险 API、混淆特征、明确违规词）。
 * - 语义判定（政治/歧视/不良内容的边界）交给 LLM 层，规则层只提供证据。
 * - 任何一层不确定时 fail-closed：不自动合并。
 */

/** 五类审查维度。id 用于报告与 LLM 输出对齐。 */
export const CATEGORIES = {
	malicious: {
		label: '恶意代码',
		description:
			'未经用户知情的数据外发、文件系统/进程越权访问、剪贴板与凭据窃取、远程代码执行、自我隐藏与反调试、供应链投毒（篡改其他插件或用户工程）等。',
	},
	political: {
		label: '政治敏感内容',
		description:
			'涉及国家主权与领土、政治人物与历史事件、政治宣传与动员的内容；**包括未被平台强制禁止、但在公开社区具争议的身份政治题材**（族群/宗教/性别向的政治立场表达、政治口号、旗帜徽记、纪念日等）。插件功能本身中立而仅出现相关名词时不算。',
	},
	vice: {
		label: '色情/赌博/毒品等不良内容',
		description: '色情或性暗示素材、真实或模拟赌博机制、毒品及其制作/交易、暴力血腥、自伤引导。',
	},
	illegal: {
		label: '违法内容',
		description: '违反中国大陆法律法规的内容：规避监管、未授权破解与盗版分发、窃取个人信息的实现、诈骗与资金盘、违禁品交易。',
	},
	discrimination: {
		label: '针对个体或群体的歧视',
		description: '针对特定个人或群体的侮辱、贬损、刻板印象、仇恨言论，或按其身份（种族/民族/性别/性取向/宗教/残障/地域/年龄）区别对待的代码逻辑（如按身份拒绝功能）。',
	},
};

export const CATEGORY_IDS = Object.keys(CATEGORIES);

/** 变更允许落在这些前缀下，其余一律拒绝（防止 PR 改审查设施自证清白）。 */
export const ALLOWED_PATH_PREFIXES = ['plugins/', 'plugins.json', 'updates.json'];

/** 显式禁止：审查基础设施只能由维护者改动。 */
export const BLOCKED_PATH_PREFIXES = ['.github/', 'scripts/', 'node_modules/'];

export const LIMITS = {
	maxFiles: 40,
	maxFileBytes: 320 * 1024,
	maxTotalBytes: 2 * 1024 * 1024,
	maxPluginsPerPr: 1,
	maxChunkChars: 48000,
	llmMaxFindings: 20,
	llmRetries: 2,
};

/** plugins.json 条目必填字段（README 约定）。 */
export const REQUIRED_PLUGIN_FIELDS = [
	'title',
	'author',
	'description',
	'icon',
	'version',
	'variant',
	'min_version',
	'tags',
	'new_repository_format',
	'repository',
	'bug_tracker',
];

export const PLUGIN_ID_RE = /^[a-z0-9_]{2,48}$/;
export const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** 条目里禁止出现本机绝对路径（发布产物污染 + 泄露作者环境）。 */
export const ABS_PATH_RE = /(?:\b[A-Z]:[\\/][^\s"'`()<>]{2,}|\B\/(?:home|Users)\/[^\s"'`()<>]{2,})/;

/**
 * 明确违规词：命中即 block。保持精简且无歧义——有歧义的词放 WARN_TERMS，
 * 由 LLM 结合上下文判定，避免把「赌场地图」这类正常游戏素材误判为赌博机制。
 * 英文条目按整词匹配（\b），避免 between/alpha 之类的子串误报。
 */
export const BLOCK_TERMS = [
	{ term: '儿童色情', category: 'vice' },
	{ term: 'child porn', category: 'vice' },
	{ term: 'childporn', category: 'vice' },
	{ term: 'lolicon', category: 'vice' },
	{ term: 'shotacon', category: 'vice' },
	{ term: '赌博网站', category: 'vice' },
	{ term: '博彩平台', category: 'vice' },
	{ term: '线上赌场', category: 'vice' },
	{ term: '网赌', category: 'vice' },
	{ term: 'casino site', category: 'vice' },
	{ term: 'betting site', category: 'vice' },
	{ term: '冰毒', category: 'vice' },
	{ term: '海洛因', category: 'vice' },
	{ term: '摇头丸', category: 'vice' },
	{ term: 'methamphetamine', category: 'vice' },
	{ term: 'heroin', category: 'vice' },
	{ term: 'fentanyl', category: 'vice' },
	{ term: '翻墙教程', category: 'illegal' },
	{ term: '代开发票', category: 'illegal' },
	{ term: '办证刷单', category: 'illegal' },
	{ term: '银行卡出售', category: 'illegal' },
	{ term: '身份证出售', category: 'illegal' },
];

/** 需语义判定的可疑词：命中记为 warn，作为 LLM 的定位线索。 */
export const WARN_TERMS = [
	{ term: '色情', category: 'vice' },
	{ term: '裸体', category: 'vice' },
	{ term: '裸照', category: 'vice' },
	{ term: 'porn', category: 'vice' },
	{ term: 'nsfw', category: 'vice' },
	{ term: 'hentai', category: 'vice' },
	{ term: '性行为', category: 'vice' },
	{ term: '赌博', category: 'vice' },
	{ term: '赌场', category: 'vice' },
	{ term: 'casino', category: 'vice' },
	{ term: 'gambling', category: 'vice' },
	{ term: 'lottery', category: 'vice' },
	{ term: '毒品', category: 'vice' },
	{ term: '大麻', category: 'vice' },
	{ term: 'cocaine', category: 'vice' },
	{ term: '政治', category: 'political' },
	{ term: '政府', category: 'political' },
	{ term: '总统', category: 'political' },
	{ term: '主席', category: 'political' },
	{ term: '共产党', category: 'political' },
	{ term: '国民党', category: 'political' },
	{ term: '台独', category: 'political' },
	{ term: '港独', category: 'political' },
	{ term: '藏独', category: 'political' },
	{ term: '疆独', category: 'political' },
	{ term: '六四', category: 'political' },
	{ term: '天安门', category: 'political' },
	{ term: '法轮功', category: 'political' },
	{ term: '游行', category: 'political' },
	{ term: '示威', category: 'political' },
	{ term: 'nigger', category: 'discrimination' },
	{ term: 'nazi', category: 'discrimination' },
	{ term: 'kkk', category: 'discrimination' },
	{ term: 'chink', category: 'discrimination' },
	{ term: 'faggot', category: 'discrimination' },
	{ term: 'retard', category: 'discrimination' },
	{ term: '劣等', category: 'discrimination' },
	{ term: '低等民族', category: 'discrimination' },
	{ term: '支那', category: 'discrimination' },
];

/** 危险 API：桌面端插件可以通过 require 拿到 Node 能力，故按模块与危险面收敛。 */
export const DANGEROUS_APIS = [
	{ re: /\bchild_process\b/, reason: '启用子进程执行（可运行任意系统命令）' },
	{ re: /\bexecSync\s*\(|\bexecFileSync\s*\(|\bspawnSync\s*\(/, reason: '同步执行系统命令' },
	{ re: /\bprocess\.binding\s*\(|\bprocess\.dlopen\s*\(/, reason: '绕过 Node 模块系统加载原生代码' },
	{ re: /\beval\s*\(|\bnew\s+Function\s*\(/, reason: '动态求值字符串（远程代码执行常规载体）' },
	{ re: /document\.cookie/, reason: '读取 cookie' },
	{ re: /\bnavigator\.sendBeacon\s*\(/, reason: '静默外发数据' },
	{ re: /\bclipboard\.(?:readText|read)\s*\(/, reason: '读取剪贴板内容' },
	{ re: /require\s*\(\s*['"](?:net|tls|dgram|vm|dns)['"]/, reason: '直接使用底层网络/虚拟机模块' },
	{ re: /\bos\.homedir\s*\(\s*\)[\s\S]{0,200}?require\s*\(\s*['"]fs['"]/, reason: '枚举家目录后访问文件系统' },
];

/** 明文 HTTP 外发：直接拒绝（可被中间人篡改，且是后门常见信道）。 */
export const INSECURE_EGRESS_RE = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b[\s\S]{0,80}?http:\/\//;

/** 非白名单外联：记为 warn，交 LLM 与维护者确认。 */
export const EGRESS_RE = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b[\s\S]{0,120}?(https?:\/\/[^\s"'`)]+)/g;
export const EGRESS_ALLOW_HOSTS = [
	'cdn.jsdelivr.net',
	'purge.jsdelivr.net',
	'raw.githubusercontent.com',
	'api.github.com',
	'github.com',
];

/** 混淆特征：官方插件允许压缩（单行/短变量），但不允许 hex 变量名、长 base64 载荷、密集转义。 */
export const OBFUSCATION_CHECKS = [
	{ re: /_0x[0-9a-fA-F]{4,}/g, min: 5, reason: '十六进制变量名（obfuscator.io 特征）' },
	{ re: /\\x[0-9a-fA-F]{2}/g, min: 40, reason: '密集十六进制转义（加密字符串特征）' },
	{ re: /[A-Za-z0-9+/]{400,}={0,2}/g, min: 1, reason: '超长 base64 块（隐藏载荷常见载体）' },
	{ re: /String\.fromCharCode\s*\(\s*\d+\s*,/g, min: 8, reason: '密集 fromCharCode 拼接字符串' },
];

/** 提示注入：插件文本会喂给 LLM，必须拦截试图操纵审查器的内容。 */
export const PROMPT_INJECTION_CHECKS = [
	/ignore\s+(?:all\s+)?(?:the\s+)?(?:previous|above|prior)\s+instructions/i,
	/disregard\s+(?:all\s+)?(?:previous|above)\s+instructions/i,
	/忽略(?:以上|之前|前面|上述)(?:的)?(?:全部)?(?:指令|提示|要求)/,
	/你现在(?:是|扮演)/,
	/\b(?:system|assistant)\s*prompt\b/i,
	/<\|\s*im_start\s*\|>/i,
	/\[\/?INST\]/,
	/^\s*(?:SYSTEM|系统)\s*[:：]\s*/m,
	/output\s+(?:only\s+)?["']?pass["']?/i,
];

/** 这些扩展名按文本送审；其余视为二进制。 */
export const TEXT_EXTENSIONS = ['.js', '.mjs', '.json', '.md', '.txt', '.html', '.css', '.svg', '.yml', '.yaml'];
/** 插件目录内允许的二进制素材。 */
export const ALLOWED_BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico'];
