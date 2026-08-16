# Grok Build (Community)

[![License: FSL-1.1-MIT](https://img.shields.io/badge/License-FSL--1.1--MIT-blue.svg)](LICENSE) [![VS Code](https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com) [![Cursor](https://badgen.net/badge/Cursor/Extension/007ACC)](https://cursor.com) [![The Product Compass](https://img.shields.io/badge/The%20Product%20Compass-productcompass.pm-FF6B35)](https://www.productcompass.pm)

> **GUI for Grok Build CLI (incl. Grok 4.6)** — not affiliated with or endorsed by SpaceXAI (formerly xAI). *Grok*, *Grok Build*, and *xAI* are trademarks of xAI; this project uses those names only to describe what it's compatible with.

Two ways to use the same agent UI on top of the **Grok Build CLI**:

| | **VS Code extension** | **Grok Build Desktop** |
|---|---|---|
| **What** | Sidebar chat inside VS Code / Cursor | Standalone Electron app (no editor required) |
| **Get it** | [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=PawelHuryn.grok-vscode-phuryn) · [Open VSX](https://open-vsx.org/extension/PawelHuryn/grok-vscode-phuryn) | [GitHub Releases](https://github.com/phuryn/grok-build-vscode/releases) (see [Desktop install](#grok-build-desktop)) |
| **Best when** | You already live in the editor | You want the agent as its own window |

Both speak JSON-RPC to `grok agent stdio`, share chat history under `~/.grok`, and support **Remote Control** via **[AFK Pilot](https://afkpilot.com)** — pair once and watch, approve, and steer from your phone or any browser. Drop files in as `@`-context, run **multiple sessions**, generate **images & video inline**, and dictate by **voice**.

No manual setup on either host: onboarding **walks you through installing the `grok` CLI and signing in** — with a **SuperGrok or X Premium+ subscription**, or an **xAI API key**.

> 🌏 **简体中文界面已内置 / Simplified Chinese built in** — 可在 **设置 → 扩展 → Grok → Language** 选择「简体中文」，或在桌面版顶部菜单的 **语言** 中切换。下文提供 [中文版说明](#简体中文说明)。 / Switch the UI to Chinese in **Settings → Extensions → Grok → Language**, or the desktop menu's **Language** entry. A [Chinese translation](#简体中文说明) follows below.

![Grok Build in the VS Code sidebar, running Grok](docs/screenshots/grok_4.5.png)

![Grok Build Desktop — projects, the conversation with an image generated inline, and the file panel](docs/screenshots/grok-desktop.webp)

---

## Why use this?

If you live in your editor **or** want a dedicated agent window, this puts Grok Build in a graphical workflow on top of the CLI: **diff preview** on every proposed edit, **open files and selection as context**, **parallel sessions** with status dots, **resumable history**, **inline images & video**, and **voice dictation**. The CLI does the heavy lifting; these hosts are the GUI for when you'd rather not be in a terminal.

### Features & capabilities

_Click any feature to expand._

<details>
<summary><strong>Permission cards with diff preview</strong> — see every edit in VS Code's native diff before you approve</summary>

When Grok proposes an edit, hit **open diff →** to review the whole file in VS Code's native diff editor, focused on the first changed line, then *Allow once / always* or *Reject*. The file is written only **after** you approve.

![Permission card with a native VS Code diff preview before approval](docs/screenshots/permission_diff.png)

</details>

<details>
<summary><strong>Modes — Agent, Plan & Auto accept</strong></summary>

Switch from the bottom toolbar — even mid-turn, so you can flip to **Auto accept** to stop approving cards without stopping Grok. **Plan** is enforced by the *extension*, not the CLI — workspace writes and non-read-only commands are genuinely blocked until you approve the plan (see [How it works](#how-it-works)). **Auto accept** approves actions automatically; approving a plan returns you to whichever mode you were in before planning.

![The mode picker — Agent, Plan, and Auto accept](docs/screenshots/agent_modes.png)

</details>

<details>
<summary><strong>Image & video generation</strong> — <code>/imagine</code> renders right in the chat</summary>

Type `/imagine <prompt>` (or `/imagine-video <prompt>`) and the result renders **inline** — images as thumbnails, videos with playback controls, **Copy path** / **Open in VS Code** on hover. Editing a reference photo works too. Both are subscription-only Grok features, and both survive a session resume.

</details>

<details>
<summary><strong>Paste or attach images</strong> — Grok sees the pixels, not just a path</summary>

**Ctrl+V a screenshot**, drag-drop an image, or attach one with the **+** picker (png/jpg/gif/webp, up to 20 MiB) — it's sent as vision input, so you can ask *"what's wrong with this UI?"* about a dialog you just captured. Disk imports keep their file path so Grok can also act on the real file, and chips restore when you reopen the session.

![Several pasted images attached in the composer as removable chips](docs/screenshots/paste_attach_images.png)

</details>

<details>
<summary><strong>Voice control</strong> — hands-free dictation with live transcription</summary>

The **microphone button** dictates speech via [SpaceXAI's Speech-to-Text API](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text) — words appear live as you talk. Say **"grok send"** to submit hands-free and keep dictating; messages spoken while Grok responds queue and flush when it finishes.

It works out of the box once you're signed in (your `grok login` token is reused automatically) — you only need [`ffmpeg`](https://ffmpeg.org) installed to record. Setup, devices, and costs: **[docs/voice-setup.md](docs/voice-setup.md)**.

![Voice control with live transcription in the composer](docs/screenshots/voice_mode.png)

</details>

<details>
<summary><strong>File chips</strong> — your editor and selection as <code>@file</code> context</summary>

The active editor rides along automatically; add more by **typing `@` in the composer** (a workspace file picker opens — arrow keys + Enter, fuzzy-matched), dragging from the Explorer, right-click → **Grok: Send File**, **Alt+G**, or the **+** button. Chips send as `@/path` references, so content stays current and history stays small. **Shift-drag** embeds the file inline instead.

![Composer with an image, a file, and a selection chip attached](docs/screenshots/file_chips.png)

</details>

<details>
<summary><strong>Session history</strong> — parallel sessions with status dots; resume, rename, search & clear</summary>

The clock icon lists this project's sessions, newest first. Click a row to resume — images, plans, and reasoning intact — or hover to rename or delete it. The **search box** filters your whole history, older sessions load as you scroll, and **Clear all history** sweeps everything but the current session.

Sessions run in **parallel**: start a new one with **+** while another is mid-turn and switch between them from this list — the one you leave keeps working in the background, and switching back is instant, with no reload. Each row's **status dot** tells you what it's doing:

| Dot | Meaning |
|---|---|
| 🔵 Blue | Working |
| 🟡 Yellow | Needs you — a permission, question, or plan is waiting |
| 🟢 Green | Finished, with results you haven't opened yet |
| 🔴 Red | Finished with an error you haven't opened |
| ⚪ Gray | At rest |

The green/red dot is an **unread badge** — it survives a VS Code restart and clears when you open the session, so after firing off a few agents the green dots are exactly the results waiting for you.

![Session history dropdown with status dots](docs/screenshots/session_history.png)

</details>

<details>
<summary><strong>Queue or steer</strong> — type while Grok works, without ever interrupting it</summary>

A message you send mid-turn **never cancels** anything. By default it **queues** — a pending block at the end of the chat (Edit / Remove), sent the moment the turn ends; type more and it merges into the same message. Hit **Steer** on it to redirect Grok *now* instead: the text goes straight into the running turn without losing the tool work in flight. Prefer that always? Turn on **Steer by default** (gear → *Config & debug*).

![A queued message with the Steer button](docs/screenshots/steer.png)

</details>

<details>
<summary><strong>Fork conversation</strong> — branch a thread without touching the original</summary>

Gear → *Fork conversation* copies the conversation into a **new session** named `(Fork) <the original's name>` and opens it — try a tangent or a different approach while the original stays **byte-for-byte unchanged** in your history. It branches the conversation, not your code: files on disk are untouched.

![Fork conversation in the gear menu](docs/screenshots/fork.png)

</details>

<details>
<summary><strong>Worktree session</strong> — isolate code edits in a git worktree</summary>

**Grok: New Worktree Session** (gear → *New worktree session*, or the Command Palette) creates an isolated git worktree under `~/.grok/worktrees/` and opens a fresh session whose cwd is that checkout — so agent edits don't touch your main tree until you **Apply worktree**. **Remove worktree** deletes the isolated checkout. History rows for worktree sessions show a `WT <label>` badge and reopen with the correct cwd.

</details>

<details>
<summary><strong>Rewind</strong> — roll the conversation (and files) back to an earlier point</summary>

Hover a message you sent → **Rewind** (or **Grok: Rewind Conversation**), confirm, and Grok rolls back to that point — truncating the chat and, optionally, restoring the files it changed since then from its own snapshots. A safety prompt shows first, because rewinding can revert code on disk.

</details>

<details>
<summary><strong>Deep Research / Workflow progress</strong> — a live progress card with Pause / Resume / Stop</summary>

When Grok runs a Deep Research, Workflow, or Goal task, a progress card streams its steps live and gives you **Pause**, **Resume**, and **Stop** controls, so long autonomous runs stay visible and interruptible.

</details>

<details>
<summary><strong>Context & cost</strong> — what's in the window, and what the turns actually bill</summary>

Click the **context donut** for the exact `used / window (%)`, plus what the conversation has **billed** — input, cache read, output, and the CLI-reported **USD cost** — as a session total and a per-turn split with its model calls. **Compact conversation** lives here too, right next to the number that tells you when you need it.

![The context popover — window usage, billed totals, and Compact](docs/screenshots/context.png)

</details>

<details>
<summary><strong>Subagents</strong> — delegated tasks render as cards with their result</summary>

When Grok delegates work to a subagent, the chat shows a card with the task and a live timer, then the subagent's output when it finishes — background subagents included, whose result folds back into the card when it lands.

![A subagent call rendered as a card in the chat](docs/screenshots/subagents.png)

</details>

<details>
<summary><strong>Tool calls</strong> — every read, edit & command inline; expand for full details</summary>

Every action appears as a category-iconed row, batched and summarized ("Explored 5 items", "Edited 2 files"); a failed tool turns red with the reason. Edits show a `+N −M` change count and expand to an inline diff at the file's real line numbers; shell commands expand to an **IN/OUT block** with the full command and its complete output — exactly what Grok received, exit code included. To audit an Auto-accept run, pre-expand everything with `grok.expandCommandOutputs`, or **Grok: Expand All Tool Details** from the Command Palette.

![A tool batch with a command expanded to its IN/OUT block](docs/screenshots/tool_calls.png)

</details>

<details>
<summary><strong>Math &amp; LaTeX rendering</strong> — equations render as math, not raw TeX</summary>

LaTeX in answers — inline `\(…\)`, display `\[…\]`, matrices, integrals, Greek — renders as real typeset math via [MathJax](https://www.mathjax.org), bundled so it works **offline**. Hover a display equation to copy its source or export it as PNG or SVG. (Bare `$…$` is deliberately not a delimiter — it would mangle "it costs $5".)

![LaTeX expressions rendered as typeset math](docs/screenshots/v1.4.5%20LaTeX%20expressions.png)

</details>

<details>
<summary><strong>Mermaid diagrams</strong> — flowcharts and sequence diagrams render as diagrams</summary>

A ` ```mermaid ` block renders as a real diagram via [Mermaid](https://mermaid.js.org) — bundled, offline, themed to your light/dark mode. Hover to copy the source or export it as PNG or SVG; while it's still streaming, or if it's malformed, the readable source is shown instead.

![Mermaid diagram rendered inline in the chat](docs/screenshots/v1.4.6%20Mermaid%20diagrams.png)

</details>

<details>
<summary><strong>Model picker</strong> — switch models live, no restart</summary>

Click the model name in the gear popover. The list comes from your CLI; switching is live in most cases. (A few models belong to a different agent and need a quick restart — the extension detects that and carries your context forward.)

</details>

<details>
<summary><strong>Reasoning effort</strong> — trade tokens for depth</summary>

Gear → the effort dots next to the model, `none` → `xhigh`. On recent CLIs it applies **live** to the running session; older ones restart, with an optional *Summarize & Restart* that carries context forward.

![Model and reasoning-effort picker in the gear menu](docs/screenshots/effort.png)

</details>

<details>
<summary><strong>Remote Control (AFK Pilot)</strong> — watch and steer your sessions from a phone or any browser</summary>

Gear → *Remote Control* → **Sign in (link this device)** pairs this machine with **[AFK Pilot](https://afkpilot.com)** (its relay server + web client are [open source](https://github.com/phuryn/afkpilot)), a companion web client that mirrors this chat in the browser: follow a running turn, approve permissions, answer questions, and send or steer messages from your phone while away from your desk. The extension dials **out** to the service — no inbound port, no port forwarding — and **Sign out** unlinks the device again. The mobile view renders the retained chat window in full fidelity (diffs, images, equations, diagrams) with touch-sized controls; on reconnect, the remote snapshot is capped at the last 10 user messages while the VS Code view keeps the complete buffer. Its own **+** picker attaches a photo or a document (`.md`/`.txt`/`.pdf`/`.csv`/`.xlsx`/`.docx`) straight from your phone. You can **dictate** there too — say *"grok send"* to submit hands-free — give each browser tab its **own conversation and repository**, and pick up the very conversation VS Code has open, live in both.

A **projects rail** lists every repository with Grok history and its newest conversations, with pinned conversations lifted above them across all projects and a search over both. You can start a session in any project without switching to it first, and rename, delete or clear history from the row — from the ⋯ button or by right-clicking it. Give a project a **colour** and its folder is tinted everywhere the rail appears, including your phone. Projects you put away — and any left untouched for 30 days — fold into **Archived**, and come back on their own the moment you work in one again. On a phone the rail is a drawer behind the handle in the header.

While a device is linked, the extension also **keeps the machine awake** (`caffeinate` on macOS, `SetThreadExecutionState` on Windows, `systemd-inhibit` on Linux) so a turn you kicked off from your phone isn't cut short by idle sleep. The display still sleeps — only system sleep is blocked — and the lock is released the moment you sign out. Turn it off with `grok.remote.keepAwake`. A **closed laptop lid still suspends** on every OS; no application can override that.

![AFK Pilot — your Grok agent from any browser](docs/screenshots/remote.webp)

</details>

---

## Requirements

- **VS Code** 1.106+ (or a compatible editor on the same base — Cursor 3.x qualifies; Antigravity is still on base 1.104 and keeps the last compatible extension version).
- **The Grok Build CLI** (`grok`) on macOS, Linux, or Windows. The CLI ships a native Windows build, so the extension runs natively on all three — no WSL required (WSL2 + Remote-WSL still works if you prefer it).
- **A login:** either a **SuperGrok or X Premium+** subscription (`grok login`) or an xAI API key. Either subscription unlocks **Grok Build**; with an API key you also get the **grok-4.x** models and **grok-imagine**. (Grok's free tier does **not** include the CLI agent.)
- **Voice control** is optional and works out of the box once you're signed in — it just needs [`ffmpeg`](https://ffmpeg.org) to record. Setup + advanced options: [docs/voice-setup.md](docs/voice-setup.md).

---

## Install

### VS Code / Cursor extension

**1. Install the extension.** In VS Code or Cursor, open **Extensions** (`Ctrl/Cmd+Shift+X`) and search **"Grok Build for VS Code (Community)"** — or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=PawelHuryn.grok-vscode-phuryn) / [Open VSX Registry](https://open-vsx.org/extension/PawelHuryn/grok-vscode-phuryn).

**2. Open Grok and sign in.** Press `Ctrl/Cmd+;`. The sidebar **walks you through installing the `grok` CLI and signing in** — one click per step, with your SuperGrok / X Premium+ subscription or an xAI API key. That's the whole setup.

Grok opens in the **Secondary Side Bar** (right side, next to other AI tools). Prefer it elsewhere? Gear → **Config & debug** → **Move view** relocates it to the Panel or Primary Side Bar in one click.

> Prefer the terminal, building from source, or installing into several IDEs at once? See **[docs/INSTALL.md](docs/INSTALL.md)**.

### Grok Build Desktop

Standalone app for **macOS** (Apple Silicon + Intel) and **Windows** (x64). Same agent UI as the extension; no VS Code required.

**1. Download** the installer for your platform from the latest [GitHub Release](https://github.com/phuryn/grok-build-vscode/releases). Asset names:

| Platform | File |
|---|---|
| macOS Apple Silicon | `Grok-Build-Desktop-<version>-mac-arm64.dmg` |
| macOS Intel | `Grok-Build-Desktop-<version>-mac-x64.dmg` |
| Windows x64 | `Grok-Build-Desktop-<version>-win-x64.exe` |

(Zip archives are also published for macOS: `…-mac-arm64.zip` / `…-mac-x64.zip`.)

**2. Install and open** the app, then pick a project folder (File → Add Project Folder). Onboarding installs the `grok` CLI and signs you in the same way as the extension.

**Unsigned builds (today).** There is no Apple or Microsoft signing certificate yet, so the OS will warn on first open:

- **macOS:** Gatekeeper may say the app “cannot be opened because it is from an unidentified developer.” Right-click the app → **Open**, or System Settings → Privacy & Security → **Open Anyway**.
- **Windows:** SmartScreen may show “Windows protected your PC.” Choose **More info** → **Run anyway**.

Details, build-from-source, and signing notes: **[docs/desktop.md](docs/desktop.md)**.

---

## Quick start

1. **Open** Grok — in VS Code: `Ctrl/Cmd+;` (Secondary Side Bar by default); in Desktop: launch the app and add a project folder.
2. **Type a prompt** and press **Enter**. Grok streams its answer, showing a *Thinking…* line while it reasons. Want the full reasoning inline? Turn on **Show thinking traces** in the gear menu → *Config & debug*.
3. **Approve actions.** When Grok wants to write a file or run a command it may raise a permission card — preview an edit (native diff in VS Code; in-app viewer on Desktop), then *Allow once / always / Reject*.
4. **Pick your mode** (Agent / Plan / Auto accept), **model**, and **reasoning effort** from the bottom toolbar and gear menu.
5. **Resume anytime** — the clock icon lists past sessions for this project.

---

## Configuration

<details>
<summary><strong>All <code>grok.*</code> settings</strong> (VS Code Settings → search "grok")</summary>

| Setting | Default | Notes |
|---|---|---|
| `grok.cliPath` | `""` | Path to the `grok` binary. Empty = auto-discover (`~/.grok/bin/grok` → PATH). |
| `grok.defaultModel` | `""` | Model ID for new sessions. Empty = CLI default. |
| `grok.defaultEffort` | `""` | Reasoning effort forwarded as `--reasoning-effort` (`none` / `minimal` / `low` / `medium` / `high` / `xhigh`). Empty = CLI default. Applies live on recent CLIs; older CLIs (and resetting to the model default) restart the session. |
| `grok.defaultMode` | `""` | Mode for new sessions, remembered automatically from your last Agent / Auto accept switch (Plan is never remembered). Empty = Agent. |
| `grok.includeActiveFileByDefault` | `true` | Auto-add the active editor as a context chip. Sends the file **path** (not its contents) unless you have text selected, in which case the selected lines are included. Click the chip to toggle it off — that choice is remembered across file switches and restarts. |
| `grok.mentionIndexLimit` | `5000` | How many workspace files the composer's **@** autocomplete indexes. Raise it (no upper limit) if files are missing from the `@` list in a large repo; applies on the next `@`. Files you have open as tabs are always mentionable regardless of this cap. |
| `grok.useCtrlEnterToSend` | `false` | When true, Enter inserts a newline and Ctrl/Cmd+Enter sends. |
| `grok.showThinking` | `false` | Show Grok's reasoning (thinking) traces in chat. Off shows a *Thinking…* stand-in. Also toggleable live from gear → Config & debug. |
| `grok.expandCommandOutputs` | `false` | Expand tool details by default — each shell command's IN/OUT block and each edit's inline diff (useful for auditing Auto-accept sessions). With this setting on, groups containing command or edit details open too; read/explore-only groups stay collapsed, and a lone command outside a group opens its details. Edit rows always show a `+N −M` change count, even when their diff is closed. Toggle live from gear → Config & debug → **Expand tool details**. (Setting key kept for compatibility.) |
| `grok.steerByDefault` | `false` | Send straight into Grok's running turn instead of queueing. Off: a message sent mid-turn waits and flushes when the turn ends (steer it on demand with the **Steer** button). On: it skips the queue and redirects Grok immediately. Never cancels the turn or discards work in progress; plain text only (no chips, editor context, or `/commands`). Toggle live from gear → Config & debug → **Steer by default**. |
| `grok.soundNotifications` | `false` | Play a short tone when Grok finishes a turn or errors — a rising chime for done, a lower tone for errors — but **only when the Grok panel isn't focused**, so it notifies you when you've stepped away. Toggle live from gear → Config & debug → **Sound notifications**. |
| `grok.telemetry.enabled` | `true` | Send anonymous, privacy-first usage telemetry (see [Privacy](#privacy)). Also honors VS Code's global `telemetry.telemetryLevel`. |
| `grok.chatFontScale` | `100` | Zoom for the chat panel only, as a percent (`150`, `200`, …). Scales the whole chat UI without rescaling the rest of VS Code (unlike `Ctrl/Cmd+Shift+=`). Applies live; supports User (global) and Workspace (local) scope. |
| `grok.language` | `"en"` | **UI language** — `"en"` (English) or `"zh-CN"` (Simplified Chinese). Added by the zh-CN localization. Switch live from Settings → Extensions → Grok → Language, or the desktop menu's **Language** entry. |
| `grok.voiceApiKey` | `""` | Optional override key for voice Speech-to-Text. Empty = reuse your `grok login` token automatically, else `GROK_VOICE_API_KEY` / `XAI_API_KEY` from the workspace `.env`. See [docs/voice-setup.md](docs/voice-setup.md). |
| `grok.ffmpegPath` | `""` | Path to `ffmpeg` for microphone recording. Empty = use `ffmpeg` from `PATH`. |
| `grok.voiceInputDevice` | `""` | Microphone device override. Empty = system default (Windows auto-detects the first DirectShow audio device). |
| `grok.voiceSendPhrase` | `"grok send"` | Spoken phrase that auto-submits when it ends a transcription. Empty = disable hands-free sending. |
| `grok.voiceKeyterms` | `[]` | Words or phrases that bias streaming recognition toward code and project vocabulary. Sent to SpaceXAI with each streaming connection; up to 100 terms of 50 characters, including the send phrase and `Grok`. |
| `grok.voiceLanguage` | `""` | Optional language code for streaming text formatting (for example `en`, `fr`, `de`, or `ja`). Empty preserves spoken-form text. |
| `grok.voiceStreaming` | `true` | Stream transcription live as you speak. `false` = one-shot batch mode. Streaming costs $0.20/hr vs $0.10/hr batch. |

</details>

---

## Commands & keybindings

<details>
<summary><strong>VS Code commands & keys</strong> (Ctrl/Cmd+Shift+P → "Grok")</summary>

VS Code commands (not Grok slash commands):

| Command | What it does |
|---|---|
| `Grok: Open` | Open the Grok sidebar |
| `Grok: New Session` | Start a fresh session |
| `Grok: Compact Conversation` | Compact the current session to reclaim context |
| `Grok: Pick Model` | Open the model picker |
| `Grok: Toggle Plan / Agent Mode` | Open the mode picker (Agent / Plan / Auto accept) |
| `Grok: Send File` | Add a file to the composer (right-clicked file, active editor, or a file picker) |
| `Add Selection to Grok` | Attach the selected lines as a snippet chip in the composer |
| `Grok: Insert @-Mention` | Insert an `@`-mention for the active file into the composer |
| `Grok: Expand All Tool Details (This Session)` | Open every tool group, command IN/OUT box, and edit inline diff, and keep new ones open — this session only |
| `Grok: Collapse All Tool Details (This Session)` | Collapse them all, and keep new ones collapsed — this session only |
| `Grok: Show Logs` | Open the Grok output channel (ACP messages, errors) |
| `Grok: Log Out` | Sign out of the Grok CLI (`grok logout`) and return to the sign-in screen |

| Key | Action |
|---|---|
| `Ctrl+;` / `Cmd+;` | Open Grok sidebar |
| `Alt+G` | Insert `@`-mention for the active file (when the editor is focused) |

Grok's own **slash commands** (`/imagine`, `/compact`, …) autocomplete in the composer when you type `/`, sourced live from your installed CLI version. Reference snapshot: [docs/SLASH-COMMANDS.md](docs/SLASH-COMMANDS.md).

</details>

---

## How it works

The extension is intentionally **thin**: it speaks JSON-RPC over `grok agent stdio` and renders the results. Grok owns sessions, memory, MCP, models, and tool execution; the extension mediates file reads/writes, terminal requests, diff previews, the webview UI — and **Plan Mode**.

Plan Mode is the one place the extension adds defense-in-depth. The CLI owns the plan review and receives native JSON-RPC success outcomes (`approved`, `cancelled` for Keep planning, or `abandoned` for Cancel), so approval or revision continues inside the original turn. An Approve/Keep-planning comment is interjected before that verdict releases the turn; a Cancel comment queues as the next ordinary prompt because abandonment has no continuation step. The extension's **gate** still blocks workspace writes and non-read-only commands while planning because the CLI's own terminal path remains porous. No hidden primer, bracket marker, follow-up verdict prompt, or verdict-time turn cancellation is sent. Plan is disabled fail-closed when the CLI is older than the required version or its version cannot be verified.

Full diagram, message flow, module map, and design notes: **[docs/architecture.md](docs/architecture.md)**.

---

## Development

Building, testing and repo conventions live in **[docs/development.md](docs/development.md)**.

The engineering documentation for the whole system — the architecture across
the extension and its relay, the remote-control wire protocol, authentication,
the cross-repo test matrix, and how releases ship — lives in the companion
**[afkpilot](https://github.com/phuryn/afkpilot)** repository (the AFK
Pilot relay server + web client, open source). Contributions to either half
are welcome; start with its
[docs index](https://github.com/phuryn/afkpilot/tree/main/docs) and
[CONTRIBUTING](https://github.com/phuryn/afkpilot/blob/main/CONTRIBUTING.md).

---

## Known limits

- **Diff preview semantics.** The native editor reconstructs both full-file sides from Grok's replaced-region metadata and the current file on disk, then opens on the first changed line. If the file is unreadable, oversized, or has moved on so the region cannot be located, it safely falls back to the region-only diff. The write happens only after approval.
- **View placement.** The view defaults to the **Secondary Side Bar** (requires VS Code 1.106+, the extension's engine floor). Relocate it anytime via gear → **Config & debug** → **Move view** (one click: Panel / Primary Side Bar / Secondary Side Bar) — useful in Cursor, whose side-bar context menu hides the built-in "Move To" entry.

---

## Privacy

**Privacy by design** — no message content, code, or file paths leave your machine automatically. The only automatic report is an anonymous, opt-out `session_start` (turn it off with `grok.telemetry.enabled: false` or VS Code's global `telemetry.telemetryLevel`). It carries an install id plus a low-cardinality settings snapshot, including mode / model / effort, host kind, UI preferences, whether voice input is available, and which agents are connected — **never** message content, code, paths, or free-text settings. The full field list is in [docs/privacy.md](docs/privacy.md). Data leaves only through features you explicitly enable or invoke: Voice input sends audio to SpaceXAI for transcription; the optional **Read simplified summaries** switch in VS Code or AFK Pilot sends the cleaned spoken reply to SpaceXAI for a brief version; Remote Control relays the chat to your linked devices. Each is disclosed separately from telemetry.

More: [docs/privacy.md](docs/privacy.md).

---

## License & attribution

Licensed under the **Functional Source License, Version 1.1, MIT Future License (FSL-1.1-MIT)** — see [LICENSE](LICENSE). In short: use, modify, and redistribute freely for any purpose **except** offering a competing commercial product or service. Versions up to and including 1.8.1 were published under MIT and remain MIT. The copyright notice and license text must travel with all copies, including compiled builds — if you're reusing this project, see [docs/attribution.md](docs/attribution.md) for how to credit it properly.

---

## 简体中文说明

> 本仓库是 **Grok Build（社区版）** 的**中文本地化版本**。应用界面已内置简体中文，可在 **设置 → 扩展 → Grok → Language** 选择「简体中文」，或在桌面版（Grok Build Desktop）顶部菜单的 **语言** 中切换。下方为中文版介绍；英文原版见上文。

### 这是什么？

Grok Build（社区版）是一个**图形界面（GUI）**，让你像用聊天工具一样驱动 **Grok Build CLI**（含 Grok 4.6 等模型）。它**与 SpaceXAI（原 xAI）无关，也未获其背书**。`Grok`、`Grok Build`、`xAI` 是 xAI 的商标，本项目仅用这些名称说明其兼容对象。

它提供**两种使用方式**，底层都是同一套智能体界面，跑在 Grok Build CLI 之上：

| | **VS Code 扩展** | **Grok Build 桌面版** |
|---|---|---|
| **是什么** | VS Code / Cursor 内的侧边栏聊天 | 独立的 Electron 桌面应用（无需编辑器） |
| **怎么获取** | [VS Code 插件市场](https://marketplace.visualstudio.com/items?itemName=PawelHuryn.grok-vscode-phuryn) · [Open VSX](https://open-vsx.org/extension/PawelHuryn/grok-vscode-phuryn) | [GitHub Releases](https://github.com/phuryn/grok-build-vscode/releases) |
| **适合谁** | 你本来就泡在编辑器里 | 你想把智能体当成独立窗口 |

两者都通过 JSON-RPC 与 `grok agent stdio` 通信，在 `~/.grok` 下共享聊天历史，并支持通过 **[AFK Pilot](https://afkpilot.com)** 进行**远程控制**——一次配对后，即可在手机或任意浏览器里查看、批准、引导对话。可以把文件作为 `@` 上下文丢进去，运行**多个会话**，在对话中**直接生成图片与视频**，还能**语音输入**。

两种宿主都无需手动配置：首次使用会**引导你安装 `grok` CLI 并完成登录**——使用 **SuperGrok 或 X Premium+ 订阅**，或一个 **xAI API key** 即可。

### 为什么用这个？

如果你常驻编辑器，**或**想要一个独立的智能体窗口，它就把 Grok Build 放进了一套可视化的工作流里：每次提案修改都有**差异预览**，可以把**打开的文件和选中内容作为上下文**，**并行会话**带状态点，**可恢复的历史**，**行内图片与视频**，以及**语音输入**。重活由 CLI 干，这些宿主只是你不想待在终端时的图形界面。

#### 主要功能

- **带差异预览的权限卡片**：Grok 提案修改时，点「open diff →」即可在原生差异编辑器里审阅整份文件，再选择「允许一次 / 始终允许」或「拒绝」。文件只有在你批准后才会写入。
- **模式切换——Agent / Plan / 自动接受**：从底部工具栏切换，中途也能切；切到「自动接受」可不再逐个批准卡片。
- **图片与视频生成**：输入 `/imagine <提示词>`（或 `/imagine-video <提示词>`），结果直接渲染在对话中。
- **粘贴或附加图片**：`Ctrl+V` 截图、拖拽图片、或点「+」选图（png/jpg/gif/webp，最大 20 MiB），作为视觉输入发给 Grok。
- **语音控制**：麦克风按钮通过 xAI 的语音转文字 API 实时听写；说「grok send」即可免手提交。
- **文件 chips**：当前编辑器自动带上；在输入框输入 `@` 可添加文件，拖拽、右键菜单、快捷键均可。
- **会话历史**：并行会话带状态点，可恢复、重命名、搜索、清空。
- **排队或引导（Steer）**：Grok 干活时你也能打字，不会打断它。
- **Fork 对话**：把对话分支到新会话，不改原对话、不动磁盘代码。
- **Worktree 会话**：在 git worktree 中隔离代码修改。
- **回退（Rewind）**：把对话（和文件）回滚到更早的点。
- **深度研究 / 工作流进度**：实时进度卡，可暂停 / 继续 / 停止。
- **上下文与费用**：查看窗口占用与每次对话的实际计费。
- **子智能体**、**工具调用**、**数学 / LaTeX 渲染**、**Mermaid 图表**、**模型选择**、**推理强度**、**远程控制（AFK Pilot）** 等。

### 环境要求

- **VS Code** 1.106+（或同内核的兼容编辑器，如 Cursor 3.x）。
- **Grok Build CLI**（`grok`），支持 macOS / Linux / Windows。
- **登录**：SuperGrok 或 X Premium+ 订阅（`grok login`），或 xAI API key。
- **语音控制**（可选）：登录后即可用，仅需安装 [`ffmpeg`](https://ffmpeg.org) 录音。

### 安装

#### VS Code / Cursor 扩展

1. **安装扩展**：在 VS Code / Cursor 打开**扩展**（`Ctrl/Cmd+Shift+X`），搜索「Grok Build for VS Code (Community)」，或从 [VS Code 插件市场](https://marketplace.visualstudio.com/items?itemName=PawelHuryn.grok-vscode-phuryn) / [Open VSX](https://open-vsx.org/extension/PawelHuryn/grok-vscode-phuryn) 安装。
2. **打开 Grok 并登录**：按 `Ctrl/Cmd+;`。侧边栏会**引导你安装 `grok` CLI 并完成登录**——每步一键，用你的 SuperGrok / X Premium+ 订阅或 xAI API key 即可。这就是全部安装过程。

Grok 默认打开在**次要侧边栏**（右侧）。想换位置？齿轮 → **Config & debug** → **Move view** 一键迁移。

#### Grok Build 桌面版

独立的 macOS（Apple Silicon + Intel）与 Windows（x64）应用。界面与扩展一致，无需 VS Code。

1. 从最新 [GitHub Release](https://github.com/phuryn/grok-build-vscode/releases) 下载对应安装包。
2. 安装并打开，选择项目文件夹（File → Add Project Folder）。首次引导同样会安装 `grok` CLI 并登录。

> 当前为**未签名构建**：macOS / Windows 首次打开会弹出安全警告，按系统提示「仍要打开 / 仍要运行」即可。

### 快速开始

1. **打开** Grok——VS Code 中按 `Ctrl/Cmd+;`（默认在次要侧边栏）；桌面版启动应用并添加项目文件夹。
2. **输入提示词**回车。Grok 流式输出，思考时显示「Thinking…」一行。想看完整推理？在齿轮菜单 → *Config & debug* 打开「Show thinking traces」。
3. **批准操作**：Grok 要写文件或跑命令时会弹出权限卡片——预览修改后选择「允许一次 / 始终允许 / 拒绝」。
4. **选择模式**（Agent / Plan / 自动接受）、**模型**、**推理强度**。
5. **随时恢复**：时钟图标列出本项目的过往会话。
6. **切换中文（本版本新增）**：打开 **设置 → 扩展 → Grok → Language**，选择 **简体中文**；或在桌面版顶部菜单的 **语言** 中选择「简体中文」。整个界面（菜单 + 聊天）会立即切换。

### 配置

VS Code 设置中搜索「grok」可见全部 `grok.*` 配置项。常用项：

| 设置 | 默认值 | 说明 |
|---|---|---|
| `grok.cliPath` | `""` | `grok` 可执行文件路径。空 = 自动发现。 |
| `grok.defaultModel` | `""` | 新会话默认模型。 |
| `grok.defaultEffort` | `""` | 推理强度（`none` / `minimal` / `low` / `medium` / `high` / `xhigh`）。 |
| `grok.defaultMode` | `""` | 新会话默认模式（Agent / 自动接受；Plan 不记忆）。 |
| `grok.showThinking` | `false` | 在对话中显示 Grok 的推理过程。 |
| `grok.language` | `"en"` | **界面语言**：`en`（英文）或 `zh-CN`（简体中文）。本中文本地化版本新增。 |
| `grok.soundNotifications` | `false` | Grok 完成一轮或出错时播放提示音。 |
| `grok.telemetry.enabled` | `true` | 发送匿名、隐私优先的使用遥测。 |

> 完整配置项见上方英文版「Configuration」折叠区。

### 命令与快捷键

| 命令 | 作用 |
|---|---|
| `Grok: Open` | 打开 Grok 侧边栏 |
| `Grok: New Session` | 新建会话 |
| `Grok: Compact Conversation` | 压缩当前会话以回收上下文 |
| `Grok: Pick Model` | 打开模型选择器 |
| `Grok: Toggle Plan / Agent Mode` | 打开模式选择器 |
| `Grok: Send File` | 把文件加入输入框 |
| `Grok: Log Out` | 退出 Grok CLI 登录 |

| 快捷键 | 作用 |
|---|---|
| `Ctrl+;` / `Cmd+;` | 打开 Grok 侧边栏 |
| `Alt+G` | 为当前文件插入 `@` 提及 |

### 工作原理

扩展刻意做得**很薄**：它通过 `grok agent stdio` 走 JSON-RPC，并渲染结果。会话、记忆、MCP、模型、工具执行都由 Grok 掌管；扩展负责文件读写、终端请求、差异预览、webview 界面——以及 **Plan 模式**的安全把关。详见 [docs/architecture.md](docs/architecture.md)。

### 开发

构建、测试与仓库规范见 [docs/development.md](docs/development.md)。

### 已知限制

- **差异预览语义**：原生编辑器根据 Grok 提供的替换区域与磁盘当前文件重建两侧全文；若文件不可读、过大或已移动，会安全回退到仅区域差异。写入仅在批准后发生。
- **视图位置**：默认在次要侧边栏（需 VS Code 1.106+）。可随时用齿轮 → **Config & debug** → **Move view** 迁移。

### 隐私

**默认隐私优先**——消息内容、代码、文件路径都不会自动离开你的机器。唯一的自动上报是匿名的、可关闭的 `session_start`（用 `grok.telemetry.enabled: false` 关闭）。只有你显式开启的功能才会外发数据（语音输入、远程控制等）。详见 [docs/privacy.md](docs/privacy.md)。

### 许可证与署名

基于 **Functional Source License, Version 1.1, MIT Future License (FSL-1.1-MIT)** 授权——见 [LICENSE](LICENSE)。简而言之：可自由用于任何用途，**除了**提供竞争性的商业产品或服务。1.8.1 及之前版本以 MIT 发布，仍为 MIT。版权声明与许可文本须随所有副本（含编译产物）一并保留。本仓库在**保留原作者署名与 FSL 声明**的前提下，新增了简体中文界面本地化。
