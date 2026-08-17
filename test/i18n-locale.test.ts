import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { detectSystemLocale, localeFromConfig, en } from "../src/i18n";

const require_ = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaI18n = require_(path.join(root, "media", "i18n.js")) as { EN: Record<string, string> };

describe("detectSystemLocale", () => {
  it("maps Chinese-language tags to zh-CN", () => {
    expect(detectSystemLocale("zh-CN")).toBe("zh-CN");
    expect(detectSystemLocale("zh_TW")).toBe("zh-CN");
    expect(detectSystemLocale("zh")).toBe("zh-CN");
    expect(detectSystemLocale("ZH-cn")).toBe("zh-CN");
  });

  it("maps everything else to en", () => {
    expect(detectSystemLocale("en")).toBe("en");
    expect(detectSystemLocale("en-US")).toBe("en");
    expect(detectSystemLocale("ja")).toBe("en");
    expect(detectSystemLocale("")).toBe("en");
  });
});

describe("dictionary sync", () => {
  it("keeps media/i18n.js EN a mirror of src/i18n.ts en", () => {
    const srcKeys = Object.keys(en).sort();
    const mediaKeys = Object.keys(mediaI18n.EN).sort();
    // A missing key in either place makes the webview (or Node fallback) render
    // a raw key instead of text, and the two sides are hand-maintained — so the
    // drift is asserted mechanically, not trusted to memory.
    expect(mediaKeys).toEqual(srcKeys);
  });
});

describe("localeFromConfig", () => {
  it("passes explicit choices through untouched", () => {
    expect(localeFromConfig("en", "zh-CN")).toBe("en");
    expect(localeFromConfig("zh-CN", "en")).toBe("zh-CN");
  });

  it("resolves auto / unknown / missing to the supplied system locale", () => {
    expect(localeFromConfig("auto", "zh-CN")).toBe("zh-CN");
    expect(localeFromConfig("auto", "en")).toBe("en");
    expect(localeFromConfig("garbage", "zh-CN")).toBe("zh-CN");
    expect(localeFromConfig(undefined, "zh-CN")).toBe("zh-CN");
  });

  it("defaults the system locale to en when none is supplied", () => {
    expect(localeFromConfig("auto")).toBe("en");
    expect(localeFromConfig("weird", "en")).toBe("en");
  });
});
