import { describe, it, expect } from "vitest";
import {
  COMPUTER_USE_DONE_MARKER,
  COMPUTER_USE_DONE_MARKER_EN,
  COMPUTER_USE_MAX_STEPS,
  COMPUTER_USE_SCREENSHOT_PATH,
  buildComputerUseContinueText,
  buildComputerUseInstructions,
  buildComputerUseUserLabel,
  computerUseSupportsProvider,
  detectComputerUseDone,
  isComputerUseHostSupported,
  screenCaptureCommand,
} from "../src/computer-use";

describe("computer-use helpers", () => {
  it("exposes sane loop constants", () => {
    expect(COMPUTER_USE_MAX_STEPS).toBeGreaterThan(0);
    expect(COMPUTER_USE_SCREENSHOT_PATH).toMatch(/\.jpg$/);
    expect(COMPUTER_USE_DONE_MARKER).toMatch(/完成/);
    expect(COMPUTER_USE_DONE_MARKER_EN).toBe("[DONE]");
  });

  it("is desktop macOS only", () => {
    expect(isComputerUseHostSupported("darwin", true)).toBe(true);
    expect(isComputerUseHostSupported("darwin", false)).toBe(false);
    expect(isComputerUseHostSupported("win32", true)).toBe(false);
    expect(isComputerUseHostSupported("linux", true)).toBe(false);
  });

  it("supports Grok sessions only (Codex sandboxes shell)", () => {
    expect(computerUseSupportsProvider("grok")).toBe(true);
    expect(computerUseSupportsProvider(null)).toBe(true);
    expect(computerUseSupportsProvider("codex")).toBe(false);
  });

  it("builds zh instructions that mention the task and marker", () => {
    const text = buildComputerUseInstructions("打开计算器", "zh-CN");
    expect(text).toContain("打开计算器");
    expect(text).toContain(COMPUTER_USE_DONE_MARKER);
    expect(text).toContain(COMPUTER_USE_SCREENSHOT_PATH);
  });

  it("builds en instructions with the English done marker", () => {
    const text = buildComputerUseInstructions("open Calculator", "en");
    expect(text).toContain("open Calculator");
    expect(text).toContain(COMPUTER_USE_DONE_MARKER_EN);
    expect(text).toMatch(/one action/i);
  });

  it("builds continue prompts in both locales", () => {
    expect(buildComputerUseContinueText("zh-CN")).toContain(COMPUTER_USE_DONE_MARKER);
    expect(buildComputerUseContinueText("en")).toContain(COMPUTER_USE_DONE_MARKER_EN);
  });

  it("labels the user bubble with a localized prefix", () => {
    expect(buildComputerUseUserLabel("x", "zh-CN")).toMatch(/^电脑控制:/);
    expect(buildComputerUseUserLabel("x", "en")).toMatch(/^Computer use:/);
  });

  it("detects completion markers and Chinese prose, not loose English", () => {
    expect(detectComputerUseDone(`done ${COMPUTER_USE_DONE_MARKER}`)).toBe(true);
    expect(detectComputerUseDone(`All set ${COMPUTER_USE_DONE_MARKER_EN}`)).toBe(true);
    expect(detectComputerUseDone("任务已完成")).toBe(true);
    expect(detectComputerUseDone("still working")).toBe(false);
    expect(detectComputerUseDone("click the Done button")).toBe(false);
    expect(detectComputerUseDone("")).toBe(false);
  });

  it("produces a screen-capture command with the shared path", () => {
    expect(screenCaptureCommand()).toContain(COMPUTER_USE_SCREENSHOT_PATH);
  });
});
