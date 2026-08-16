import { describe, it, expect } from "vitest";
import { detectSystemLocale, localeFromConfig } from "../src/i18n";

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
