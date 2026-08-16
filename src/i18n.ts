/**
 * Internationalization (i18n) for Grok Build (Community).
 *
 * This is the single source of truth for UI strings. The webview runtime
 * (`media/i18n.js`) receives a serialized copy of the active locale's
 * dictionary via `window.__I18N` (injected by `getHtml`), so the same keys
 * work on both the extension side and the webview side with no drift.
 *
 * Adding a translation:
 *   1. Add the key + English text to `en`.
 *   2. Add the Chinese text (if any) to `zhCN`.
 *   3. Use `t(locale, "key")` on the extension side, or `window.t("key")`
 *      on the webview side. Missing keys fall back to English, then to the
 *      raw key, so the UI never breaks while translations are rolled out.
 */

export type Locale = "en" | "zh-CN";

export const SUPPORTED_LOCALES: ReadonlyArray<{ id: Locale; label: string }> = [
  { id: "en", label: "English" },
  { id: "zh-CN", label: "简体中文" },
];

export const DEFAULT_LOCALE: Locale = "en";

export const LANGUAGE_SETTING = "language";

/** English is the source of truth. Every other locale overrides a subset. */
export const en: Record<string, string> = {
  // ----- generic -----
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.reset": "Reset",
  "common.enable": "Enable",
  "common.disable": "Disable",
  "common.signOut": "Sign out",
  "common.close": "Close",
  "common.continue": "Continue",
  "common.learnMore": "Learn more",

  // ----- settings shell -----
  "settings.title": "Settings",
  "settings.category.general": "General",
  "settings.category.voice": "Voice",
  "settings.category.notifications": "Notifications",
  "settings.category.providers": "Providers",
  "settings.category.account": "Account",
  "settings.category.advanced": "Advanced",
  "settings.category.about": "About",

  // ----- settings rows -----
  "settings.language.title": "Language",
  "settings.language.description": "Interface language for this app. Grok still understands prompts in any language.",
  "settings.appPurpose.title": "Use this app for",
  "settings.appPurpose.description": "Knowledge work hides worktrees, thinking traces, and tool details. Coding unlocks those controls, still off by default.",
  "settings.appPurpose.knowledge": "Knowledge work",
  "settings.appPurpose.coding": "Coding",
  "settings.telemetry.title": "Anonymous usage stats",
  "settings.showThinking.title": "Show thinking traces",
  "settings.showThinking.description": "Show Grok's reasoning traces in chat, including on already-loaded sessions.",
  "settings.expandToolDetails.title": "Expand tool details",
  "settings.expandToolDetails.description": "Pre-open each command's IN/OUT block and each edit's inline diff instead of clicking a row to expand it.",
  "settings.steerByDefault.title": "Steer by default",
  "settings.steerByDefault.description": "Send straight into the running turn instead of queueing until it finishes. Steering does not cancel work in progress.",
  "settings.textSize.title": "Text size",
  "settings.textSize.description": "Chat text size on this device only. Keyboard zoom stays in sync with this slider.",
  "settings.soundNotifications.title": "Sound notifications",
  "settings.soundNotifications.description": "Play a short sound when a turn finishes or errors, only when the Grok panel is not focused.",
  "settings.processingSound.title": "Still-processing sound",
  "settings.processingSound.description": "Play a quiet reminder while a turn is still working. It starts after seven seconds and repeats every eight seconds.",
  "settings.readRepliesAloud.title": "Read replies aloud",
  "settings.readRepliesAloud.description": "Read completed replies aloud. Code blocks are skipped.",
  "settings.summarizeRepliesAloud.title": "Read simplified summaries",
  "settings.summarizeRepliesAloud.description": "Use xAI to speak a brief summary of each reply. This costs an extra call and falls back to the full text on failure.",

  // ----- about -----
  "settings.about.disclaimer":
    "Unofficial · community-built · MIT | " +
    "A VS Code UI for SpaceXAI’s Grok Build CLI - not affiliated with or endorsed by SpaceXAI (formerly xAI). " +
    "Grok, Grok Build, and xAI are trademarks of xAI; this project uses those names only to describe what it’s compatible with.",
  "settings.about.telemetry":
    "Anonymous usage stats only: a single session-start event with an anonymous install id — never prompts, code, file paths or names, and no identity. The IP address is discarded, never stored.",

  // ----- chat chrome -----
  "chat.rail.hideProjects": "Hide projects",
  "chat.rail.toggleTheme": "Toggle light and dark theme",
  "chat.welcome.heading": "Grok Build (Community)",
  "chat.welcome.byline": "by Paweł Huryn",
  "chat.composer.placeholder": "Ask Grok...",
  "chat.composer.voice": "Voice control",
  "chat.composer.addContext": "Add context",
  "chat.composer.settings": "Settings",
  "chat.composer.contextUsage": "Context usage",
  "chat.composer.send": "Send",
  "chat.composer.newSession": "New session",
  "chat.composer.sessionHistory": "Session history",
  "chat.composer.chooseRepository": "Choose repository",
  "chat.composer.continueRemotely": "Continue remotely",
  "chat.composer.scrollToBottom": "Scroll to bottom",
  "chat.welcome.starting": "Starting",
  "chat.welcome.connectGrok": "Connect Grok",
  "chat.mode.pick": "Pick mode",
  "chat.mode.agent": "Agent",
  "chat.mode.plan": "Plan",
  "chat.mode.autoAccept": "Auto accept",

  // ----- permission card -----
  "perm.allowOnce": "Allow once",
  "perm.allowAlways": "Always allow",
  "perm.reject": "Reject",
  "perm.preview": "Preview",
  "perm.approveActions": "Approve actions",

  // ----- permission card (resolved verb) -----
  "perm.resolved.allowed": "Allowed",
  "perm.resolved.rejected": "Rejected",
  "perm.resolved.answered": "Answered",

  // ----- generic confirm dialog -----
  "common.ok": "OK",

  // ----- chat chrome -----
  "chat.action.copy": "Copy",
  "chat.action.copied": "Copied",
  "chat.action.saveAs": "Save As",
  "chat.action.compact": "Compact conversation",
  "chat.code.copy": "Copy code",
  "chat.msg.copy": "Copy message",
  "chat.msg.rewind": "Rewind to this message",
  "chat.msg.edit": "Edit and send again",
  "chat.ctx.copyLink": "Copy Link",
  "chat.status.working": "Working",
  "chat.status.needsYou": "Needs you",
  "chat.status.unread": "Finished while no view was watching",
  "chat.status.error": "Errored while no view was watching",
  "chat.status.thinking": "Thinking",
  "chat.status.grokThinking": "Grok is thinking",
  "chat.status.loadingConversation": "Loading conversation",
  "chat.status.connected": "Connected",
  "chat.status.signInDesk": "Sign in at the desk",
  "chat.status.connectAgent": "Connect an agent",
  "chat.status.cliNotInstalled": "CLI not installed",
  "chat.status.codexNotFound": "Codex CLI not found",
  "chat.status.finishSignIn": "Finish signing in",
  "chat.status.authRequired": "Authentication required",
  "chat.status.updatingCli": "Updating Grok Build CLI",
  "chat.attach.imageAlt": "Attached image",
  "chat.onb.signInDeskHeading": "Sign in at the desk",
  "chat.onb.signInDeskDesc": "{provider} accounts can only be connected on the computer running this workspace. Sign in there, then refresh this remote view.",
  "chat.onb.connectAgentHeading": "Connect an agent",
  "chat.onb.connectAgentDesc": "Choose the command-line agent that will own this conversation.",
  "chat.onb.grokCliMissingDeskHeading": "Grok CLI is missing at the desk",
  "chat.onb.grokCliMissingDeskDesc": "Install it on the computer running this workspace, then refresh this remote view.",
  "chat.onb.installGrokCliHeading": "Install the Grok CLI",
  "chat.onb.codexCliMissingDeskHeading": "Codex CLI is missing at the desk",
  "chat.onb.codexCliMissingDeskDesc": "Install or configure Codex on the computer running this workspace, then refresh this remote view.",
  "chat.onb.installCodexCliHeading": "Install the Codex CLI",
  "chat.onb.installCodexDesc": "Install the pinned official Codex release into this app's storage, or use your own installation.",
  "chat.onb.codexLoginHeading": "Complete <code>codex login</code>",
  "chat.onb.codexLoginDesc": "Finish the sign-in flow in the terminal, then continue here.",
  "chat.onb.authRequiredHeading": "Sign in to continue",
  "chat.onb.authRequiredDesc1": "<strong>SuperGrok or X Premium+ subscription</strong> &mdash; either unlocks the <em>Grok Build</em> entitlement.",
  "chat.onb.authRequiredApiDesc": "<strong>API key</strong> &mdash; pay per token. Get a key at <a href=\"https://console.x.ai\" class=\"onb-link\">console.x.ai</a>, then add to your shell or a workspace <code>.env</code>:",
  "chat.onb.authRequiredKeyNote": "A cached sign-in takes precedence over the API key &mdash; run <code>grok logout</code> first to use the key. If signing in succeeds but prompts still fail, check the error in the chat: your account may lack the Grok Build entitlement.",
  "tool.Read": "Read",
  "tool.Write": "Write",
  "tool.Run": "Run",
  "tool.List": "List",
  "tool.Search": "Search",
  "tool.Edit": "Edit",
  "tool.WebSearch": "Web search",
  "tool.Fetch": "Fetch",
  "tool.Generate": "Generate",
  "tool.Delete": "Delete",
  "tool.status.listingPath": "Listing {path}",
  "tool.status.listing": "Listing files",
  "tool.status.readingPath": "Reading {path}",
  "tool.status.reading": "Reading file",
  "tool.status.searchingWeb": "Searching web",
  "tool.status.fetching": "Fetching page",
  "tool.status.searching": "Searching",
  "tool.status.editingPath": "Editing {path}",
  "tool.status.editing": "Editing file",
  "tool.status.deletingPath": "Deleting {path}",
  "tool.status.deleting": "Deleting file",
  "tool.status.generating": "Generating",
  "tool.status.runningCmd": "Running command",
  "tool.status.runningName": "Running {name}",
  "tool.status.runningTool": "Running tool",
  "tool.summary.explore": "explored {count} item{s}",
  "tool.summary.edit": "edited {count} file{s}",
  "tool.summary.delete": "deleted {count} file{s}",
  "tool.summary.generate": "generated {count} item{s}",
  "tool.summary.web": "searched web",
  "tool.summary.command": "ran {count} command{s}",
  "tool.summary.fallback": "Tool calls",
  "chat.empty.noRepositories": "No repositories with Grok sessions.",
  "chat.update.restartNow": "Restart now",
  "chat.update.openReleasePage": "Open release page",
  "chat.update.notNow": "Not now",

  // ----- chat mode picker -----
  "chat.mode.agentMode": "Agent mode",
  "chat.mode.planMode": "Plan mode",
  "chat.mode.agent.desc": "Grok acts directly, asking approval only for changes it judges sensitive",
  "chat.mode.plan.desc": "Grok explores and proposes a plan; file writes and commands are blocked until you approve it",
  "chat.mode.yolo.desc": "Grok automatically approves all permission requests (YOLO)",
  "chat.mode.availableWhenReady": "available once the session is ready",

  // ----- AFK Pilot explainer dialog -----
  "afkpilot.title": "How AFK Pilot works",
  "afkpilot.step1": "Link this device. Sign in with your account.",
  "afkpilot.step2Desktop": "Keep this app open.",
  "afkpilot.step2Editor": "Keep VS Code, Cursor, or Antigravity open.",
  "afkpilot.copyUrl": "Copy afkpilot.com",
  "afkpilot.note": "You can then work 100% remotely — it keeps this device awake, and never stores your prompts or code.",
  "afkpilot.moreFaq": "More & FAQ",
  "afkpilot.openPrefix": "Open",
  "afkpilot.openSuffix": "on your phone and sign in.",

  // ----- repo / session panel -----
  "chat.repo.live": "Live",
  "chat.repo.unavailable": "Unavailable",
  "chat.repo.loadingTitle": "Loading conversation... repository switching is disabled until it finishes.",
  "chat.repo.browsing": "Browsing {selected}; live session is in {active}",

  // ----- session history panel -----
  "chat.history.loading": "Loading…",
  "chat.history.searchPlaceholder": "Search sessions…",
  "chat.history.clearAll": "Clear all history",
  "chat.history.clearAllTitle": "Delete all sessions in this repository's history",
  "chat.history.clearTitle": "Clear history for “{repo}”?",
  "common.deleteAll": "Delete All",
  "common.rename": "Rename",
  "common.delete": "Delete",
  "common.none": "None",
  "common.stop": "Stop",

  // ----- session management -----
  "chat.session.worktree": "Worktree",
  "chat.session.worktreeTitle": "Worktree: {label}",
  "chat.session.worktreeFixed": "Worktree name is fixed to the checkout",
  "chat.session.deleteTitle": "Delete “{name}”?",
  "chat.session.deleteThis": "Delete this session?",
  "chat.session.cannotUndo": "This cannot be undone.",
  "chat.session.stopping": "Grok is still working; that stops.",
  "chat.session.deleteActiveBody": "This is the conversation you have open. It will close and a new one will start in the same project.",
  "chat.session.renameTitle": "Rename session",
  "chat.session.namePlaceholder": "Session name",
  "chat.session.untitled": "Untitled",
  "chat.resize.dragToResize": "Drag to resize",

  // ----- desktop application menu -----
  "menu.file": "File",
  "menu.file.addProjectFolder": "Add Project Folder…",
  "menu.file.closeProjectFolder": "Close Project Folder",
  "menu.file.quit": "Quit",
  "menu.edit": "Edit",
  "menu.view": "View",
  "menu.view.toggleDevTools": "Toggle Developer Tools",
  "menu.view.actualSize": "Actual Size",
  "menu.view.zoomIn": "Zoom In",
  "menu.view.zoomOut": "Zoom Out",
  "menu.help": "Help",
  "menu.help.githubRepo": "GitHub Repository",
  "menu.help.about": "About {name}",
};

/** Simplified Chinese overrides. Only keys that differ from English. */
export const zhCN: Record<string, string> = {
  "common.cancel": "取消",
  "common.save": "保存",
  "common.reset": "重置",
  "common.enable": "启用",
  "common.disable": "禁用",
  "common.signOut": "退出登录",
  "common.close": "关闭",
  "common.continue": "继续",
  "common.learnMore": "了解更多",

  "settings.title": "设置",
  "settings.category.general": "通用",
  "settings.category.voice": "语音",
  "settings.category.notifications": "通知",
  "settings.category.providers": "提供商",
  "settings.category.account": "账户",
  "settings.category.advanced": "高级",
  "settings.category.about": "关于",

  "settings.language.title": "语言",
  "settings.language.description": "本应用的界面语言。Grok 仍然能理解任何语言的输入。",
  "settings.appPurpose.title": "将此应用用于",
  "settings.appPurpose.description": "知识工作会隐藏工作树、思考过程和工具细节。编码模式会解锁这些控件，默认仍关闭。",
  "settings.appPurpose.knowledge": "知识工作",
  "settings.appPurpose.coding": "编码",
  "settings.telemetry.title": "匿名使用统计",
  "settings.showThinking.title": "显示思考过程",
  "settings.showThinking.description": "在聊天中显示 Grok 的推理过程，包括已加载的会话。",
  "settings.expandToolDetails.title": "展开工具详情",
  "settings.expandToolDetails.description": "预先展开每个命令的输入/输出块和每次编辑的行内差异，而不必点击行展开。",
  "settings.steerByDefault.title": "默认接管",
  "settings.steerByDefault.description": "直接发送到正在进行的回合，而不是排队等待其完成。接管不会取消正在进行的工作。",
  "settings.textSize.title": "文字大小",
  "settings.textSize.description": "仅本设备的聊天文字大小。键盘缩放与此滑块保持同步。",
  "settings.soundNotifications.title": "声音通知",
  "settings.soundNotifications.description": "当一轮结束或出错时，仅在 Grok 面板未聚焦的情况下播放短提示音。",
  "settings.processingSound.title": "处理中提示音",
  "settings.processingSound.description": "当回合仍在处理时播放轻柔的提醒音。它会在七秒后开始，并每八秒重复一次。",
  "settings.readRepliesAloud.title": "朗读回复",
  "settings.readRepliesAloud.description": "朗读已完成的回复。代码块会被跳过。",
  "settings.summarizeRepliesAloud.title": "朗读精简摘要",
  "settings.summarizeRepliesAloud.description": "使用 xAI 朗读每条回复的简短摘要。这会产生一次额外调用，失败时会回退到完整文本。",

  "settings.about.disclaimer":
    "非官方 · 社区构建 · MIT | " +
    "SpaceXAI 的 Grok Build CLI 的 VS Code 界面 — 与 SpaceXAI（原 xAI）无关，也未获其认可。" +
    "Grok、Grok Build 和 xAI 是 xAI 的商标；本项目仅使用这些名称来描述其兼容的对象。",
  "settings.about.telemetry":
    "仅匿名使用统计：一条带有匿名安装 ID 的会话启动事件 — 绝不收集提示词、代码、文件路径或名称，也无身份信息。IP 地址会被丢弃，绝不存储。",

  "chat.rail.hideProjects": "隐藏项目",
  "chat.rail.toggleTheme": "切换浅色/深色主题",
  "chat.welcome.heading": "Grok Build（社区版）",
  "chat.welcome.byline": "作者：Paweł Huryn",
  "chat.composer.placeholder": "问问 Grok…",
  "chat.composer.voice": "语音控制",
  "chat.composer.addContext": "添加上下文",
  "chat.composer.settings": "设置",
  "chat.composer.contextUsage": "上下文用量",
  "chat.composer.send": "发送",
  "chat.composer.newSession": "新建会话",
  "chat.composer.sessionHistory": "会话历史",
  "chat.composer.chooseRepository": "选择仓库",
  "chat.composer.continueRemotely": "远程继续",
  "chat.composer.scrollToBottom": "滚动到底部",
  "chat.welcome.starting": "正在启动",
  "chat.welcome.connectGrok": "连接 Grok",
  "chat.mode.pick": "选择模式",
  "chat.mode.agent": "智能体",
  "chat.mode.plan": "计划",
  "chat.mode.autoAccept": "自动接受",

  "perm.allowOnce": "仅此次允许",
  "perm.allowAlways": "始终允许",
  "perm.reject": "拒绝",
  "perm.preview": "预览",
  "perm.approveActions": "批准操作",

  "perm.resolved.allowed": "已允许",
  "perm.resolved.rejected": "已拒绝",
  "perm.resolved.answered": "已回答",

  "common.ok": "确定",

  "chat.action.copy": "复制",
  "chat.action.copied": "已复制",
  "chat.action.saveAs": "另存为",
  "chat.action.compact": "压缩对话",
  "chat.code.copy": "复制代码",
  "chat.msg.copy": "复制消息",
  "chat.msg.rewind": "回退到这条消息",
  "chat.msg.edit": "编辑并重新发送",
  "chat.ctx.copyLink": "复制链接",
  "chat.status.working": "处理中",
  "chat.status.needsYou": "需要你处理",
  "chat.status.unread": "在无视图时已完成",
  "chat.status.error": "在无视图时出错",
  "chat.status.thinking": "思考中",
  "chat.status.grokThinking": "Grok 正在思考",
  "chat.status.loadingConversation": "正在加载对话",
  "chat.status.connected": "已连接",
  "chat.status.signInDesk": "在桌面端登录",
  "chat.status.connectAgent": "连接一个智能体",
  "chat.status.cliNotInstalled": "未安装 CLI",
  "chat.status.codexNotFound": "未找到 Codex CLI",
  "chat.status.finishSignIn": "完成登录",
  "chat.status.authRequired": "需要身份验证",
  "chat.status.updatingCli": "正在更新 Grok Build CLI",
  "chat.onb.signInDeskHeading": "请在桌面端登录",
  "chat.onb.signInDeskDesc": "{provider} 账户只能在运行此工作区的电脑上连接。请在那里登录，然后刷新此远程视图。",
  "chat.onb.connectAgentHeading": "连接一个智能体",
  "chat.onb.connectAgentDesc": "选择将接管此对话的命令行智能体。",
  "chat.onb.grokCliMissingDeskHeading": "桌面端缺少 Grok CLI",
  "chat.onb.grokCliMissingDeskDesc": "请在运行此工作区的电脑上安装，然后刷新此远程视图。",
  "chat.onb.installGrokCliHeading": "安装 Grok CLI",
  "chat.onb.codexCliMissingDeskHeading": "桌面端缺少 Codex CLI",
  "chat.onb.codexCliMissingDeskDesc": "请在运行此工作区的电脑上安装或配置 Codex，然后刷新此远程视图。",
  "chat.onb.installCodexCliHeading": "安装 Codex CLI",
  "chat.onb.installCodexDesc": "将官方固定版本的 Codex 安装到本应用的存储中，或使用你自己的安装。",
  "chat.onb.codexLoginHeading": "完成 <code>codex login</code>",
  "chat.onb.codexLoginDesc": "在终端中完成登录流程，然后返回此处继续。",
  "chat.onb.authRequiredHeading": "登录以继续",
  "chat.onb.authRequiredDesc1": "<strong>SuperGrok 或 X Premium+ 订阅</strong> &mdash; 任一皆可解锁 <em>Grok Build</em> 权益。",
  "chat.onb.authRequiredApiDesc": "<strong>API key</strong> &mdash; 按 token 计费。前往 <a href=\"https://console.x.ai\" class=\"onb-link\">console.x.ai</a> 获取密钥，然后添加到你的 shell 或工作区 <code>.env</code>：",
  "chat.onb.authRequiredKeyNote": "缓存的登录会优先于 API key &mdash; 若要使用密钥，请先运行 <code>grok logout</code>。如果登录成功但提示仍然失败，请检查对话中的错误：你的账户可能缺少 Grok Build 权限。",
  "tool.Read": "读取",
  "tool.Write": "写入",
  "tool.Run": "运行",
  "tool.List": "列出",
  "tool.Search": "搜索",
  "tool.Edit": "编辑",
  "tool.WebSearch": "网络搜索",
  "tool.Fetch": "抓取",
  "tool.Generate": "生成",
  "tool.Delete": "删除",
  "tool.status.listingPath": "正在列出 {path}",
  "tool.status.listing": "正在列出文件",
  "tool.status.readingPath": "正在读取 {path}",
  "tool.status.reading": "正在读取文件",
  "tool.status.searchingWeb": "正在搜索网络",
  "tool.status.fetching": "正在抓取页面",
  "tool.status.searching": "正在搜索",
  "tool.status.editingPath": "正在编辑 {path}",
  "tool.status.editing": "正在编辑文件",
  "tool.status.deletingPath": "正在删除 {path}",
  "tool.status.deleting": "正在删除文件",
  "tool.status.generating": "正在生成",
  "tool.status.runningCmd": "正在运行命令",
  "tool.status.runningName": "正在运行 {name}",
  "tool.status.runningTool": "正在运行工具",
  "tool.summary.explore": "探查了 {count} 个项目",
  "tool.summary.edit": "编辑了 {count} 个文件",
  "tool.summary.delete": "删除了 {count} 个文件",
  "tool.summary.generate": "生成了 {count} 项",
  "tool.summary.web": "已搜索网络",
  "tool.summary.command": "运行了 {count} 条命令",
  "tool.summary.fallback": "工具调用",
  "chat.empty.noRepositories": "没有包含 Grok 会话的仓库。",
  "chat.attach.imageAlt": "已附图片",
  "chat.update.restartNow": "立即重启",
  "chat.update.openReleasePage": "打开发布页",
  "chat.update.notNow": "暂不",

  "chat.mode.agentMode": "智能体模式",
  "chat.mode.planMode": "计划模式",
  "chat.mode.agent.desc": "Grok 直接行动，仅对认为敏感的操作请求批准",
  "chat.mode.plan.desc": "Grok 探索并提出计划；在您批准前，文件写入和命令均被阻止",
  "chat.mode.yolo.desc": "Grok 自动批准所有权限请求（YOLO）",
  "chat.mode.availableWhenReady": "会话就绪后可用",

  "afkpilot.title": "AFK Pilot 的工作原理",
  "afkpilot.step1": "关联此设备。使用你的账户登录。",
  "afkpilot.step2Desktop": "保持此应用打开。",
  "afkpilot.step2Editor": "保持 VS Code、Cursor 或 Antigravity 打开。",
  "afkpilot.copyUrl": "复制 afkpilot.com",
  "afkpilot.note": "之后你即可 100% 远程工作 —— 它会保持此设备唤醒，且绝不会存储你的提示词或代码。",
  "afkpilot.moreFaq": "更多与常见问题",
  "afkpilot.openPrefix": "打开",
  "afkpilot.openSuffix": "，然后在手机上登录。",

  "chat.repo.live": "进行中",
  "chat.repo.unavailable": "不可用",
  "chat.repo.loadingTitle": "正在加载对话……在加载完成前无法切换仓库。",
  "chat.repo.browsing": "正在浏览 {selected}；实时会话位于 {active}",

  "chat.history.loading": "加载中…",
  "chat.history.searchPlaceholder": "搜索会话…",
  "chat.history.clearAll": "清除全部历史",
  "chat.history.clearAllTitle": "删除此仓库历史中的所有会话",
  "chat.history.clearTitle": "清除“{repo}”的历史？",
  "common.deleteAll": "删除全部",
  "common.rename": "重命名",
  "common.delete": "删除",
  "common.none": "无",
  "common.stop": "停止",

  "chat.session.worktree": "工作树",
  "chat.session.worktreeTitle": "工作树：{label}",
  "chat.session.worktreeFixed": "工作树名称已固定为检出路径",
  "chat.session.deleteTitle": "删除“{name}”？",
  "chat.session.deleteThis": "删除此会话？",
  "chat.session.cannotUndo": "此操作无法撤销。",
  "chat.session.stopping": "Grok 仍在工作；删除会停止它。",
  "chat.session.deleteActiveBody": "这是你当前打开的对话。它会关闭，并在同一项目中开启一个新对话。",
  "chat.session.renameTitle": "重命名会话",
  "chat.session.namePlaceholder": "会话名称",
  "chat.session.untitled": "未命名",
  "chat.resize.dragToResize": "拖动以调整大小",

  "menu.file": "文件",
  "menu.file.addProjectFolder": "添加项目文件夹…",
  "menu.file.closeProjectFolder": "关闭项目文件夹",
  "menu.file.quit": "退出",
  "menu.edit": "编辑",
  "menu.view": "视图",
  "menu.view.toggleDevTools": "切换开发者工具",
  "menu.view.actualSize": "实际大小",
  "menu.view.zoomIn": "放大",
  "menu.view.zoomOut": "缩小",
  "menu.help": "帮助",
  "menu.help.githubRepo": "GitHub 仓库",
  "menu.help.about": "关于 {name}",
};

/** Merge English with a locale's overrides so missing keys fall back to English. */
export function dictionaryFor(locale: Locale): Record<string, string> {
  return locale === "zh-CN" ? { ...en, ...zhCN } : { ...en };
}

function fill(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`
  );
}

/** Translate a key for the extension side. Falls back to English, then the key. */
export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const table = locale === "zh-CN" ? { ...en, ...zhCN } : en;
  return fill(table[key] ?? en[key] ?? key, vars);
}

/** Normalize an arbitrary config value into a supported Locale. */
export function localeFromConfig(raw: unknown): Locale {
  return raw === "zh-CN" ? "zh-CN" : "en";
}
