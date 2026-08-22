/**
 * Desktop update rail: notice from `updateAvailable`, swap to restart when
 * `updateReady` arrives. Host-local frames; no IS_DESKTOP gate.
 */
import { describe, expect, it } from "vitest";
import { bootWebview, click, dispatch } from "./webview-harness";

function mountRail(doc: Document) {
  const rail = doc.createElement("aside");
  rail.id = "projects-rail";
  rail.innerHTML = `
    <div class="rail-foot">
      <div class="rail-user"></div>
      <button id="rail-gear-btn" type="button"></button>
    </div>`;
  doc.body.appendChild(rail);
  return rail;
}

describe("desktop update rail affordance", () => {
  it("shows Update available from updateAvailable and starts an in-app download", () => {
    const h = bootWebview({ ready: true });
    mountRail(h.doc);
    dispatch(h.window, {
      type: "updateAvailable",
      version: "3.8.0",
      url: "https://afkpilot.com/desktop-update?from=3.7.0",
    });
    const btn = h.doc.getElementById("rail-update-btn") as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.hidden).toBe(false);
    expect(btn.textContent).toBe("Update available");
    click(h.window, btn);
    const open = h.doc.querySelector(".rail-update-open") as HTMLButtonElement;
    expect(open.textContent).toBe("Download & install");
    h.posted.length = 0;
    click(h.window, open);
    expect(h.posted).toContainEqual({ type: "downloadUpdate" });
  });

  it("swaps the same button to Restart to update when updateReady arrives", () => {
    const h = bootWebview({ ready: true });
    mountRail(h.doc);
    dispatch(h.window, {
      type: "updateAvailable",
      version: "3.8.0",
      url: "https://afkpilot.com/desktop-update?from=3.7.0",
    });
    expect(h.doc.getElementById("rail-update-btn")!.textContent).toBe("Update available");
    dispatch(h.window, { type: "updateReady", version: "3.8.0" });
    const btn = h.doc.getElementById("rail-update-btn") as HTMLButtonElement;
    expect(btn.textContent).toBe("Restart to update");
    click(h.window, btn);
    const primary = h.doc.querySelector(".rail-update-open") as HTMLButtonElement;
    expect(primary.textContent).toBe("Restart now");
    const body = h.doc.querySelector(".rail-update-body") as HTMLParagraphElement;
    expect(body.textContent).toContain("in-flight agent turn");
    expect(body.textContent).toMatch(/not keep/i);
    expect(body.textContent).toContain("next normal quit");
    expect(body.textContent).toContain("Not now");
    const dismiss = h.doc.querySelector(".rail-update-dismiss") as HTMLButtonElement;
    expect(dismiss.textContent).toBe("Not now");
    const panel = h.doc.getElementById("rail-update-panel") as HTMLElement;
    expect(panel.hidden).toBe(false);
    h.posted.length = 0;
    click(h.window, dismiss);
    expect(panel.hidden).toBe(true);
    expect(h.posted).toEqual([]);
    click(h.window, btn);
    h.posted.length = 0;
    click(h.window, primary);
    expect(h.posted).toContainEqual({ type: "restartToUpdate" });
    expect(h.posted.some((m) => m.type === "openUpdateRelease")).toBe(false);
  });

  it("shows Restart to update from updateReady alone", () => {
    const h = bootWebview({ ready: true });
    mountRail(h.doc);
    dispatch(h.window, { type: "updateReady", version: "3.8.1" });
    const btn = h.doc.getElementById("rail-update-btn") as HTMLButtonElement;
    expect(btn.hidden).toBe(false);
    expect(btn.textContent).toBe("Restart to update");
    expect(btn.getAttribute("aria-label")).toContain("3.8.1");
  });
});
