/**
 * Webview i18n runtime for Grok Build (Community).
 *
 * The extension injects the active locale's dictionary as
 * `window.__I18N = { locale, dict }` (see sidebar.ts getHtml). `t(key, vars)`
 * prefers that injected dictionary (so it can return 简体中文), and falls back
 * to the embedded English below so the UI always renders readable text — even
 * in environments where the dictionary was never injected (unit tests that
 * import this module directly in Node, or a missing/old host).
 *
 * NOTE: the `EN` map mirrors `src/i18n.ts` `en`. Keep the two in sync; a future
 * build step may generate this file from the TypeScript source.
 */
(function (root) {
  var EN = {
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.reset": "Reset",
    "common.enable": "Enable",
    "common.disable": "Disable",
    "common.signOut": "Sign out",
    "common.close": "Close",
    "common.continue": "Continue",
    "common.learnMore": "Learn more",

    "settings.title": "Settings",
    "settings.category.general": "General",
    "settings.category.voice": "Voice",
    "settings.category.notifications": "Notifications",
    "settings.category.providers": "Providers",
    "settings.category.account": "Account",
    "settings.category.advanced": "Advanced",
    "settings.category.about": "About",

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

    "settings.about.disclaimer":
      "Unofficial · community-built · MIT | " +
      "A VS Code UI for SpaceXAI’s Grok Build CLI - not affiliated with or endorsed by SpaceXAI (formerly xAI). " +
      "Grok, Grok Build, and xAI are trademarks of xAI; this project uses those names only to describe what it’s compatible with.",
    "settings.about.telemetry":
      "Anonymous usage stats only: a single session-start event with an anonymous install id — never prompts, code, file paths or names, and no identity. The IP address is discarded, never stored.",

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

    "perm.allowOnce": "Allow once",
    "perm.allowAlways": "Always allow",
    "perm.reject": "Reject",
    "perm.preview": "Preview",
    "perm.approveActions": "Approve actions",

    "perm.resolved.allowed": "Allowed",
    "perm.resolved.rejected": "Rejected",
    "perm.resolved.answered": "Answered",

    "common.ok": "OK",

    "chat.action.copy": "Copy",
    "chat.action.copied": "Copied",
    "chat.action.saveAs": "Save As",
    "chat.action.compact": "Compact conversation",
    "chat.status.working": "Working",
    "chat.status.needsYou": "Needs you",
    "chat.status.unread": "Finished while no view was watching",
    "chat.status.error": "Errored while no view was watching",
    "chat.empty.noRepositories": "No repositories with Grok sessions.",
    "chat.update.restartNow": "Restart now",
    "chat.update.openReleasePage": "Open release page",
    "chat.update.notNow": "Not now",

    "chat.mode.agentMode": "Agent mode",
    "chat.mode.planMode": "Plan mode",
    "chat.mode.agent.desc": "Grok acts directly, asking approval only for changes it judges sensitive",
    "chat.mode.plan.desc": "Grok explores and proposes a plan; file writes and commands are blocked until you approve it",
    "chat.mode.yolo.desc": "Grok automatically approves all permission requests (YOLO)",
    "chat.mode.availableWhenReady": "available once the session is ready",

    "afkpilot.title": "How AFK Pilot works",
    "afkpilot.step1": "Link this device. Sign in with your account.",
    "afkpilot.step2Desktop": "Keep this app open.",
    "afkpilot.step2Editor": "Keep VS Code, Cursor, or Antigravity open.",
    "afkpilot.copyUrl": "Copy afkpilot.com",
    "afkpilot.note": "You can then work 100% remotely — it keeps this device awake, and never stores your prompts or code.",
    "afkpilot.moreFaq": "More & FAQ",
    "afkpilot.openPrefix": "Open",
    "afkpilot.openSuffix": "on your phone and sign in.",

    "chat.repo.live": "Live",
    "chat.repo.unavailable": "Unavailable",
    "chat.repo.loadingTitle": "Loading conversation... repository switching is disabled until it finishes.",
    "chat.repo.browsing": "Browsing {selected}; live session is in {active}",

    "chat.history.loading": "Loading…",
    "chat.history.searchPlaceholder": "Search sessions…",
    "chat.history.clearAll": "Clear all history",
    "chat.history.clearAllTitle": "Delete all sessions in this repository's history",
    "chat.history.clearTitle": "Clear history for “{repo}”?",
    "common.deleteAll": "Delete All",
    "common.rename": "Rename",
    "common.delete": "Delete",
    "common.none": "None",

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
    "chat.resize.dragToResize": "Drag to resize"
  };

  var data = (root && root.__I18N) || { locale: "en", dict: {} };
  var dict = data.dict || {};
  var locale = data.locale || "en";

  function t(key, vars) {
    var s = (dict && dict[key] != null) ? dict[key] : EN[key];
    if (s == null) s = key; // last-resort fallback (key is English by convention)
    if (vars) {
      for (var k in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, k)) {
          s = s.split("{" + k + "}").join(String(vars[k]));
        }
      }
    }
    return s;
  }

  root.t = t;
  root.__locale = locale;

  // Node (direct module import in unit tests): expose for require().
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { t: t, EN: EN };
  }
})(typeof window !== "undefined" ? window : this);
