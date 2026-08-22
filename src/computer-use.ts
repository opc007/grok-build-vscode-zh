/**
 * Computer-use helpers — pure, no Electron, no I/O.
 *
 * The AI controls this Mac through the CLI's bash tool (screencapture,
 * osascript / cliclick). The client provides the missing half of the loop:
 * after each model turn it captures the screen itself and injects it as a
 * vision image into the next turn, so the model can see the result of its
 * actions. These helpers build the model's instructions and detect completion.
 *
 * UX notes (aligned with Codex Computer Use product patterns, not its MCP):
 * - Screen Recording + Accessibility must be granted for the host app.
 * - The loop auto-approves tool permissions while running (like "allowed apps").
 * - Host-side terminal is required, so only Grok sessions work today — Codex
 *   runs shell commands inside its own sandbox and cannot drive the Mac GUI.
 */

/** Hard cap on loop turns, so a stuck agent cannot run forever. */
export const COMPUTER_USE_MAX_STEPS = 50;

/** Host-side screenshot path (also the path the model is told to use). */
export const COMPUTER_USE_SCREENSHOT_PATH = "/tmp/cu-screen.jpg";

/** Reply the model must END with when the task is done (zh). */
export const COMPUTER_USE_DONE_MARKER = "【完成】";

/** English completion marker (Codex-style bilingual prompts). */
export const COMPUTER_USE_DONE_MARKER_EN = "[DONE]";

export type ComputerUseLocale = "en" | "zh-CN" | string;

/** True on desktop macOS only — GUI control needs local screencapture + AX. */
export function isComputerUseHostSupported(
  platform: NodeJS.Platform | string,
  isDesktop: boolean,
): boolean {
  return isDesktop && platform === "darwin";
}

/**
 * Computer-use drives the Mac through the host's `terminal/*` handlers.
 * Codex executes shell server-side in its sandbox, so GUI tools never reach
 * the real desktop — only Grok sessions are supported.
 */
export function computerUseSupportsProvider(provider: string | null | undefined): boolean {
  return provider === "grok" || provider == null || provider === "";
}

/** Screen capture command the model is told to run via bash. */
export function screenCaptureCommand(): string {
  return `screencapture -x -t jpg ${COMPUTER_USE_SCREENSHOT_PATH}`;
}

function isZh(locale: ComputerUseLocale | undefined): boolean {
  return String(locale || "").toLowerCase().startsWith("zh");
}

/** Initial instructions sent with the user's task. */
export function buildComputerUseInstructions(
  task: string,
  locale: ComputerUseLocale = "zh-CN",
): string {
  const zh = isZh(locale);
  const done = zh ? COMPUTER_USE_DONE_MARKER : COMPUTER_USE_DONE_MARKER_EN;
  if (zh) {
    return [
      "你正在通过命令行控制这台 macOS 电脑。请完成用户的任务。",
      "",
      "规则：",
      "1. 每轮只做一个操作，然后立即结束本轮对话。应用会在每轮结束后自动截屏，并把最新屏幕截图作为一张图片消息发给你，你看到结果后再决定下一步。",
      `2. 如果你看不到消息里的图片，可以用 read_file 工具读取屏幕截图文件：${COMPUTER_USE_SCREENSHOT_PATH}`,
      "3. 不要在同一轮里连续做多步操作；一次只做一个动作，等看到结果。",
      "",
      "可用的命令（通过 bash 工具执行）：",
      `- 截屏：${screenCaptureCommand()}（通常不需要，应用会自动截屏；需要自己看时可用）`,
      `- 点击：cliclick c:X,Y  （如 cliclick c:500,300；没有 cliclick 时用 osascript -e 'tell application "System Events" to click at {X, Y}'）`,
      `- 输入文字：osascript -e 'tell application "System Events" to keystroke "文字"'`,
      `- 按键：osascript -e 'tell application "System Events" to key code 36'（36=回车，48=Tab，125=下箭头，49=空格）`,
      `- 组合键：osascript -e 'tell application "System Events" to keystroke "c" using command down'`,
      `- 滚动：cliclick w:X,Y（向上滚动用 w:-1）`,
      `- 其他：用 bash 工具执行任意 shell 命令（ls、open、touch、echo、osascript 等）`,
      "",
      "如果命令需要系统权限（辅助功能、屏幕录制），先尝试执行，应用会提示你授权。",
      "所有坐标单位是屏幕逻辑像素，与截图分辨率不同（Retina 需除以 2）。",
      "",
      `任务：${task}`,
      "",
      `任务完成后，你回复的最后一句话必须以「${done}」结尾，然后本轮结束。`,
    ].join("\n");
  }
  return [
    "You are controlling this macOS computer through the shell. Complete the user's task.",
    "",
    "Rules:",
    "1. Do exactly one action per turn, then end the turn. The app captures the screen after each turn and sends you the fresh screenshot as an image so you can decide the next step.",
    `2. If you cannot see the image in the message, read the screenshot file with the read_file tool: ${COMPUTER_USE_SCREENSHOT_PATH}`,
    "3. Never chain multiple GUI actions in one turn — one action, then wait for the next screenshot.",
    "",
    "Useful commands (via the bash / terminal tool):",
    `- Screenshot: ${screenCaptureCommand()} (usually unnecessary — the app screenshots for you)`,
    `- Click: cliclick c:X,Y  (e.g. cliclick c:500,300; fallback: osascript -e 'tell application "System Events" to click at {X, Y}')`,
    `- Type: osascript -e 'tell application "System Events" to keystroke "text"'`,
    `- Key: osascript -e 'tell application "System Events" to key code 36' (36=Return, 48=Tab, 125=Down, 49=Space)`,
    `- Chord: osascript -e 'tell application "System Events" to keystroke "c" using command down'`,
    `- Scroll: cliclick w:X,Y (use w:-1 to scroll up)`,
    `- Anything else: run shell commands (ls, open, touch, echo, osascript, …)`,
    "",
    "If a command needs Screen Recording or Accessibility permission, try it once — the app will prompt the user.",
    "Coordinates are logical screen pixels (on Retina, divide physical screenshot pixels by 2).",
    "",
    `Task: ${task}`,
    "",
    `When finished, end your reply with ${done} as the last words.`,
  ].join("\n");
}

/** The message the client sends along with each fresh screenshot. */
export function buildComputerUseContinueText(locale: ComputerUseLocale = "zh-CN"): string {
  if (isZh(locale)) {
    return `这是当前屏幕截图，请查看后继续操作。若任务已完成，回复的最后一句话以「${COMPUTER_USE_DONE_MARKER}」结尾。`;
  }
  return `Here is the current screenshot — inspect it and continue. When the task is done, end your reply with ${COMPUTER_USE_DONE_MARKER_EN}.`;
}

/** User-visible bubble label for the task (short; instructions stay in the prompt). */
export function buildComputerUseUserLabel(task: string, locale: ComputerUseLocale = "zh-CN"): string {
  const prefix = isZh(locale) ? "电脑控制" : "Computer use";
  return `${prefix}: ${task}`;
}

/** True when the assistant's reply signals the task is complete. */
export function detectComputerUseDone(reply: string | null | undefined): boolean {
  const t = String(reply || "").trim();
  if (!t) return false;
  if (t.includes(COMPUTER_USE_DONE_MARKER) || t.includes(COMPUTER_USE_DONE_MARKER_EN)) return true;
  // Chinese prose fallback used by older prompts; English requires an explicit marker.
  return /任务(已)?完成/.test(t);
}
