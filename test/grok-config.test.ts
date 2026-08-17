import { describe, it, expect } from "vitest";
import * as path from "node:path";
import {
  configForcesAlwaysApprove,
  ensureConfigToml,
  globalConfigPath,
  GLOBAL_CONFIG_STUB,
  isAlwaysApprovePermission,
  modelKeyFromId,
  projectConfigPath,
  PROJECT_CONFIG_STUB,
  readModelSections,
  readUiPermissionMode,
  tomlQuote,
  upsertModelSection,
} from "../src/grok-config";

// A realistic grok config.toml, mirroring the on-disk shape.
const CONFIG = (permission: string) => `[cli]
installer = "internal"
auto_update = false
channel = "stable"

[features]
feedback = true
support_permission = true

[ui]
max_thoughts_width = 120
fork_secondary_model = "grok-build"
yolo = false
compact_mode = false
permission_mode = "${permission}"

[marketplace]
official_marketplace_auto_installed = true

[[marketplace.sources]]
name = "xAI Official"
git = "https://github.com/xai-org/plugin-marketplace.git"

[models]
default = "grok-build"
`;

describe("isAlwaysApprovePermission", () => {
  it("matches the hyphenated value grok writes", () => {
    expect(isAlwaysApprovePermission("always-approve")).toBe(true);
  });

  it("accepts the underscore variant and stray case/whitespace", () => {
    expect(isAlwaysApprovePermission("always_approve")).toBe(true);
    expect(isAlwaysApprovePermission("  Always-Approve  ")).toBe(true);
  });

  it("rejects other modes and empties", () => {
    expect(isAlwaysApprovePermission("ask")).toBe(false);
    expect(isAlwaysApprovePermission("")).toBe(false);
    expect(isAlwaysApprovePermission(undefined)).toBe(false);
  });
});

describe("readUiPermissionMode", () => {
  it("reads permission_mode from the [ui] table", () => {
    expect(readUiPermissionMode(CONFIG("always-approve"))).toBe("always-approve");
    expect(readUiPermissionMode(CONFIG("ask"))).toBe("ask");
  });

  it("returns undefined when the key is absent", () => {
    expect(readUiPermissionMode("[ui]\nyolo = false\n")).toBeUndefined();
    expect(readUiPermissionMode("")).toBeUndefined();
  });

  it("ignores a permission_mode outside the [ui] table", () => {
    const toml = `[other]\npermission_mode = "always-approve"\n\n[ui]\nyolo = false\n`;
    expect(readUiPermissionMode(toml)).toBeUndefined();
  });

  it("does not misread the array table [[marketplace.sources]] as [ui]", () => {
    // The array-table line must not flip the in-ui flag on.
    const toml = `[[marketplace.sources]]\npermission_mode = "always-approve"\n`;
    expect(readUiPermissionMode(toml)).toBeUndefined();
  });

  it("strips inline comments and single quotes", () => {
    expect(readUiPermissionMode(`[ui]\npermission_mode = 'ask' # default\n`)).toBe("ask");
  });

  it("tolerates CRLF line endings", () => {
    expect(readUiPermissionMode(`[ui]\r\npermission_mode = "always-approve"\r\n`)).toBe(
      "always-approve",
    );
  });
});

describe("configForcesAlwaysApprove", () => {
  it("true when global config sets always-approve", () => {
    expect(configForcesAlwaysApprove({ global: CONFIG("always-approve") })).toBe(true);
  });

  it("false when global config is the default ask", () => {
    expect(configForcesAlwaysApprove({ global: CONFIG("ask") })).toBe(false);
  });

  it("false when neither config is present", () => {
    expect(configForcesAlwaysApprove({})).toBe(false);
    expect(configForcesAlwaysApprove({ project: undefined, global: undefined })).toBe(false);
  });

  it("project config overrides global (project ask beats global always-approve)", () => {
    expect(
      configForcesAlwaysApprove({ project: CONFIG("ask"), global: CONFIG("always-approve") }),
    ).toBe(false);
  });

  it("project config overrides global (project always-approve beats global ask)", () => {
    expect(
      configForcesAlwaysApprove({ project: CONFIG("always-approve"), global: CONFIG("ask") }),
    ).toBe(true);
  });

  it("falls back to global when project has no permission_mode", () => {
    const projectWithoutKey = `[ui]\nyolo = false\n`;
    expect(
      configForcesAlwaysApprove({ project: projectWithoutKey, global: CONFIG("always-approve") }),
    ).toBe(true);
  });
});

describe("readModelSections / upsertModelSection (third-party model management)", () => {
  const TOML = `[cli]
installer = "internal"

[model.longcat]
model = "LongCat-2.0"
base_url = "https://api.longcat.chat/openai/v1"
name = "LongCat（美团）"
description = "第三方：LongCat-2.0"
env_key = "LONGCAT_API_KEY"
api_backend = "chat_completions"
context_window = 1000000
max_completion_tokens = 16384

[model.minimax]
model = "MiniMax-M3"
base_url = "https://api.minimaxi.com/v1"

[models]
default = "grok-4.6"
`;

  it("parses every [model.*] table into typed sections", () => {
    const sections = readModelSections(TOML);
    expect(sections).toHaveLength(2);
    expect(sections[0]).toEqual({
      key: "longcat",
      model: "LongCat-2.0",
      base_url: "https://api.longcat.chat/openai/v1",
      name: "LongCat（美团）",
      description: "第三方：LongCat-2.0",
      env_key: "LONGCAT_API_KEY",
      api_backend: "chat_completions",
      context_window: 1000000,
      max_completion_tokens: 16384,
    });
    expect(sections[1]).toEqual({
      key: "minimax",
      model: "MiniMax-M3",
      base_url: "https://api.minimaxi.com/v1",
    });
  });

  it("skips non-model tables and unparseable values", () => {
    const sections = readModelSections(`[models]\ndefault = "grok-build"\n\n[model.x]\nmodel = "X-1"\nflag = true\nbroken = }\n`);
    expect(sections).toEqual([{ key: "x", model: "X-1", flag: true }]);
  });

  it("appends a new model section and keeps the rest of the file", () => {
    const next = upsertModelSection(TOML, {
      key: "qwen",
      name: "Qwen-VL",
      model: "qwen-vl-max",
      base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      env_key: "QWEN_API_KEY",
      api_backend: "chat_completions",
    });
    expect(next).toContain('[model.qwen]');
    expect(next).toContain('model = "qwen-vl-max"');
    expect(next).toContain('name = "Qwen-VL"');
    expect(next).toContain('[model.longcat]');
    expect(next).toContain('default = "grok-4.6"');
    expect(readModelSections(next)).toHaveLength(3);
  });

  it("replaces an existing model section in place", () => {
    const next = upsertModelSection(TOML, {
      key: "minimax",
      name: "MiniMax New",
      model: "MiniMax-M3.5",
      base_url: "https://api.minimaxi.com/v1",
    });
    expect(next).not.toContain('name = "MiniMax-M3"');
    expect(next).toContain('name = "MiniMax New"');
    expect(next).toContain('model = "MiniMax-M3.5"');
    expect(readModelSections(next)).toHaveLength(2);
    const minimax = readModelSections(next).find((s) => s.key === "minimax");
    expect(minimax?.name).toBe("MiniMax New");
    // A replace drops fields the caller did not supply (edit, not merge).
    expect(minimax?.env_key).toBeUndefined();
  });

  it("escapes quotes and backslashes in string values", () => {
    expect(tomlQuote('a"b\\c')).toBe('"a\\"b\\\\c"');
    expect(tomlQuote(16384)).toBe("16384");
    const next = upsertModelSection("", { key: "odd", name: 'we"ird', base_url: "http://x" });
    expect(readModelSections(next)[0].name).toBe('we"ird');
  });

  it("modelKeyFromId normalizes a free-form model id to a stable key", () => {
    expect(modelKeyFromId("LongCat-2.0")).toBe("longcat-2.0");
    expect(modelKeyFromId("  Grok 4.6 VISION ")).toBe("grok-4.6-vision");
    expect(modelKeyFromId("😀")).toBe("model");
  });
});

describe("config path helpers (host-resolved intents)", () => {
  it("globalConfigPath is GROK_HOME/config.toml", () => {
    expect(globalConfigPath({ GROK_HOME: "/tmp/fake-grok-home" } as NodeJS.ProcessEnv, "linux")).toBe(
      path.join("/tmp/fake-grok-home", "config.toml"),
    );
  });

  it("projectConfigPath is <cwd>/.grok/config.toml", () => {
    expect(projectConfigPath("/work/repo")).toBe(path.join("/work/repo", ".grok", "config.toml"));
  });

  it("ensureConfigToml creates a stub when missing and leaves an existing file", () => {
    const created: string[] = [];
    const written: Array<{ p: string; data: string }> = [];
    const files = new Set<string>();
    const fs = {
      existsSync: (p: string) => files.has(p),
      mkdirSync: (p: string) => {
        created.push(p);
      },
      writeFileSync: (p: string, data: string) => {
        files.add(p);
        written.push({ p, data });
      },
    };
    const target = path.join("/tmp", ".grok", "config.toml");
    ensureConfigToml(target, GLOBAL_CONFIG_STUB, fs);
    expect(created).toEqual([path.dirname(target)]);
    expect(written).toEqual([{ p: target, data: GLOBAL_CONFIG_STUB }]);
    // Second call is a no-op.
    ensureConfigToml(target, PROJECT_CONFIG_STUB, fs);
    expect(written).toHaveLength(1);
  });
});
