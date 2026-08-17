/**
 * One-shot / rebuild helper: regenerate README.marketplace.md from README.md
 * by taking the extension-facing body and wrapping an extension-only header.
 * Run: node scripts/gen-marketplace-readme.cjs
 *
 * Packaging always uses --readme-path README.marketplace.md; this script is
 * only for regenerating content after large README edits.
 *
 * `buildMarketplaceReadme` is exported so the suite can assert the committed
 * file still matches what this produces. That check is the point: the listing
 * is generated, so a hand-edit to the output is silently destroyed the next
 * time anyone runs the script — which is how `## Companion apps` came to exist
 * only in the output file, and would have vanished on the next regeneration.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const header = `# Grok Build for VS Code (Community)

[![License: FSL-1.1-MIT](https://img.shields.io/badge/License-FSL--1.1--MIT-blue.svg)](https://github.com/phuryn/grok-build-vscode/blob/main/LICENSE) [![VS Code](https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com) [![Cursor](https://badgen.net/badge/Cursor/Extension/007ACC)](https://cursor.com) [![The Product Compass](https://img.shields.io/badge/The%20Product%20Compass-productcompass.pm-FF6B35)](https://www.productcompass.pm)

> **GUI for Grok Build CLI (incl. Grok 4.6)** — not affiliated with or endorsed by SpaceXAI (formerly xAI). *Grok*, *Grok Build*, and *xAI* are trademarks of xAI; this project uses those names only to describe what it's compatible with.

The GUI for **Grok Build CLI** (incl. **Grok 4.6**), right in your editor — with **Remote Control**: pair **[AFK Pilot](https://afkpilot.com)** once and watch, approve, and steer your agent from your phone or any browser while away from your desk. Drop open files in as \`@\`-context, run **multiple sessions** at once, keep **resumable chat history**, generate **images & video inline**, and dictate by **voice**. If you'd rather stay in VS Code than a terminal, this brings Grok Build's agent into your sidebar.

No manual setup: the extension **walks you through installing the \`grok\` CLI and signing in** — with a **SuperGrok or X Premium+ subscription**, or an **xAI API key** — right from the sidebar, one click per step.

![Grok Build in the VS Code sidebar, running Grok](https://raw.githubusercontent.com/phuryn/grok-build-vscode/main/docs/screenshots/grok_4.5.png)

![Generated image rendered inline from /imagine](https://raw.githubusercontent.com/phuryn/grok-build-vscode/main/docs/screenshots/imagine.webp)

---

## Why use this?

If you live in your editor, this puts Grok Build right next to your code — a graphical workflow on top of the CLI: the **native diff editor** on every proposed edit, your **open files and selection as context**, **parallel sessions** with status dots, **resumable history**, **inline images & video**, and **voice dictation**. The CLI does the heavy lifting; this is the GUI for when you'd rather not be in a terminal.

`;

// Install + Quick start for the marketplace: extension only. README.md's own
// pair is dual-host, so it is sliced out of the body rather than shipped —
// see buildMarketplaceReadme. Deliberately does NOT link to the Marketplace or
// Open VSX the way README.md does: this page IS the store page.
const installBlock = `## Install

**1. Install the extension.** In VS Code or Cursor, open **Extensions** (\`Ctrl/Cmd+Shift+X\`) and search **"Grok Build for VS Code (Community)"**.

**2. Open Grok and sign in.** Press \`Ctrl/Cmd+;\`. The sidebar **walks you through installing the \`grok\` CLI and signing in** — one click per step, with your SuperGrok / X Premium+ subscription or an xAI API key. That's the whole setup.

Grok opens in the **Secondary Side Bar** (right side, next to other AI tools). Prefer it elsewhere? Gear → **Config & debug** → **Move view** relocates it to the Panel or Primary Side Bar in one click.

> Prefer the terminal, building from source, or installing into several IDEs at once? See the project [INSTALL docs](https://github.com/phuryn/grok-build-vscode/blob/main/docs/INSTALL.md).

---

## Quick start

1. **Open** the Grok view (\`Ctrl/Cmd+;\`, or **Grok: Open** from the command palette) — it lives in the Secondary Side Bar by default.
2. **Type a prompt** and press **Enter**. Grok streams its answer, showing a *Thinking…* line while it reasons. Want the full reasoning inline? Turn on **Show thinking traces** in the gear menu → *Config & debug*.
3. **Approve actions.** When Grok wants to write a file or run a command it may raise a permission card — preview an edit in the native **diff editor**, with full-file context focused on the first changed line, then *Allow once / always / Reject*.
4. **Pick your mode** (Agent / Plan / Auto accept), **model**, and **reasoning effort** from the bottom toolbar and gear menu.
5. **Resume anytime** — the clock icon lists past sessions for this project.

---

`;

// The companions the listing may mention. The marketplace Install section is
// extension-only, so this is the one place a reader learns AFK Pilot and the
// desktop app exist. Generator-owned rather than carried from README.md,
// because README.md covers the same ground inside `## Install` — the section
// this file replaces wholesale.
const companionBlock = `## Companion apps

This extension is complete on its own. Two optional companions share the same
chat UI and the same Grok Build CLI:

- **[AFK Pilot](https://afkpilot.com)** — watch, approve, and steer this
  extension's agent from your phone or any browser. Pair once from the gear
  menu.
- **[Grok Build Desktop (Community)](https://afkpilot.com/desktop)** — the same
  agent as a standalone app for Windows and macOS, for machines where you would
  rather not install an editor. Free.

Neither is required, and nothing here depends on them.

---

`;

// Dual-host wording that must not drift in from README.md. Checked against the
// body-derived parts only — the blocks above are authored here and say "Grok
// Build Desktop" deliberately, so scanning the whole output would fire on our
// own text.
const BANNED_IN_BODY = [
  /Grok Build Desktop/i,
  /desktop app/i,
  /standalone Electron/i,
  /npm run dist/i,
  /dist-desktop/i,
  /electron-builder/i,
];

function buildMarketplaceReadme(githubReadme) {
  const github =
    githubReadme ?? fs.readFileSync(path.join(root, "README.md"), "utf8");

  const featIdx = github.indexOf("### Features");
  if (featIdx < 0) throw new Error("README.md missing ### Features section");

  let body = github.slice(featIdx);

  // Drop repo Development section (marketplace listing is usage-focused).
  const dev = body.indexOf("## Development");
  const known = body.indexOf("## Known limits");
  if (dev >= 0 && known > dev) {
    body = body.slice(0, dev) + body.slice(known);
  }

  // Drop the bilingual README tail (## 简体中文说明 …) — the store listing is
  // English-only; the Chinese section belongs on the GitHub README, and its
  // desktop-app wording would trip the dual-host guard below.
  const zhIdx = body.indexOf("## 简体中文说明");
  if (zhIdx >= 0) {
    body = body.slice(0, zhIdx).trimEnd() + "\n";
  }

  // Strip dual-host install / quick-start wording if present in the body.
  body = body.replace(/\n### Grok Build Desktop[\s\S]*?(?=\n### |\n## )/m, "\n");
  body = body.replace(/\n### VS Code \/ Cursor extension\n\n/m, "\n");
  body = body.replace(
    /1\. \*\*Open\*\* Grok — in VS Code: `Ctrl\/Cmd\+;` \(Secondary Side Bar by default\); in Desktop: launch the app and add a project folder\./,
    "1. **Open** the Grok view (`Ctrl/Cmd+;`, or **Grok: Open** from the command palette) — it lives in the Secondary Side Bar by default.",
  );
  body = body.replace(
    /preview an edit \(native diff in VS Code; in-app viewer on Desktop\)/,
    "preview an edit in the native **diff editor**, with full-file context focused on the first changed line",
  );

  // Marketplace prefers absolute image/doc URLs (no local repo tree in the store).
  body = body.replace(
    /\((docs\/screenshots\/[^)]+)\)/g,
    "(https://raw.githubusercontent.com/phuryn/grok-build-vscode/main/$1)",
  );
  body = body.replace(
    /\]\((docs\/[^)]+)\)/g,
    "](https://github.com/phuryn/grok-build-vscode/blob/main/$1)",
  );
  body = body.replace(
    /\]\(LICENSE\)/g,
    "](https://github.com/phuryn/grok-build-vscode/blob/main/LICENSE)",
  );

  // README.md order is Requirements → Install → Quick start → Configuration.
  // Keep that reading order, but swap in the extension-only Install/Quick start
  // pair by slicing the body AROUND the two sections we replace. Appending ours
  // in front of them instead is what printed both headings twice.
  const reqIdx = body.indexOf("## Requirements");
  const installIdx = body.indexOf("## Install");
  const configIdx = body.indexOf("## Configuration");
  const privacyIdx = body.indexOf("## Privacy");
  for (const [name, idx] of [
    ["## Requirements", reqIdx],
    ["## Install", installIdx],
    ["## Configuration", configIdx],
    ["## Privacy", privacyIdx],
  ]) {
    if (idx < 0) throw new Error(`README.md missing ${name}`);
  }
  if (!(reqIdx < installIdx && installIdx < configIdx && configIdx < privacyIdx)) {
    throw new Error("README.md sections are out of the expected order");
  }

  const featuresOnly = body.slice(0, reqIdx);
  const requirements = body.slice(reqIdx, installIdx);
  // Configuration .. Known limits. Install/Quick start are dropped on purpose.
  const middle = body.slice(configIdx, privacyIdx);
  const tail = body.slice(privacyIdx);

  const bodyDerived = featuresOnly + requirements + middle + tail;
  for (const re of BANNED_IN_BODY) {
    if (re.test(bodyDerived)) {
      throw new Error(`marketplace README still matches ${re}`);
    }
  }

  const out =
    header +
    featuresOnly +
    requirements +
    installBlock +
    middle +
    companionBlock +
    tail;

  // README.md is CRLF on disk while the blocks above are LF template literals,
  // so the concatenation is mixed. Markdown does not care, but a generated file
  // with two line endings in it is noise in every diff — normalise to LF and let
  // git renormalise on checkout.
  return out.replace(/\r\n/g, "\n");
}

module.exports = { buildMarketplaceReadme };

if (require.main === module) {
  const out = buildMarketplaceReadme();
  fs.writeFileSync(path.join(root, "README.marketplace.md"), out, "utf8");
  console.log("Wrote README.marketplace.md (%d bytes)", Buffer.byteLength(out, "utf8"));
}
