import { describe, expect, it, vi } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { GrokSidebar } from "../src/sidebar";
import { RemoteClientState } from "../src/remote-client-state";
import { Session } from "../src/session";
import { sessionsDirFor, type SessionListEntry } from "../src/sessions";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sidebar = fs.readFileSync(path.join(root, "src", "sidebar.ts"), "utf8").replace(/\r\n/g, "\n");
const desktopSources = fs.readdirSync(path.join(root, "src", "desktop"))
  .filter((name) => name.endsWith(".ts"))
  .map((name) => fs.readFileSync(path.join(root, "src", "desktop", name), "utf8"))
  .join("\n");

function methodBody(signature: string): string {
  const start = sidebar.indexOf(signature);
  expect(start, `${signature} must exist`).toBeGreaterThan(-1);
  const next = sidebar.indexOf("\n  private ", start + signature.length);
  return sidebar.slice(start, next < 0 ? sidebar.length : next);
}

describe("multi-provider review regressions", () => {
  it("proves cold Codex session existence from the adapter-backed cache before Grok disk lookup", () => {
    const body = methodBody("private remoteSessionTarget(");
    expect(body).toContain("findCachedCodexSession(");
    expect(body.indexOf("findCachedCodexSession(")).toBeLessThan(body.indexOf("indexSessions("));
    expect(body).toContain("sessionCwdBelongsToRepo");
  });

  it("builds pinned Codex rows from the adapter-backed cache", () => {
    const body = methodBody("private buildPinnedSessions(");
    expect(body).toContain("this.codexSessionCache.values()");
    expect(body).toContain("this.scheduleCodexHistoryRefresh(cwd)");
    expect(body).toContain("findCachedCodexSession(");
    expect(body).toContain("pinnedAt: overrides[id]?.pinnedAt");
  });

  it("uses one ordinary Grok page and the complete cached Codex catalog for combined history", () => {
    const body = methodBody("private buildSessionsList(");
    expect(body).toContain("{ offset: providerCursor.grokOffset, limit, query }");
    expect(body).toContain('providers.includes("codex") ? codex : []');
    expect(body).not.toContain("slotOffsets");
    expect(body).not.toContain("lookAhead");
  });

  it("real remote history request revalidates cwd before scheduling a Codex adapter scan", () => {
    const instance = Object.create(GrokSidebar.prototype) as any;
    const closed = path.join(os.tmpdir(), "closed-project");
    const open = path.join(os.tmpdir(), "open-project");
    const remoteClients = new RemoteClientState<Session>(closed);
    remoteClients.ready("phone");
    const session = new Session();
    session.cwd = closed;
    session.provider = "codex";
    remoteClients.setActive("phone", session);
    instance.remoteClients = remoteClients;
    instance.focused = new Session();
    instance.host = { appendLine: vi.fn() };
    instance.remoteTargetableCwd = vi.fn(() => true);
    // The project closes after ingress validation but before the list builder.
    // The combined builder must own the second check because it owns the scan.
    instance.remoteAuthorizedSessionCwds = vi
      .fn()
      .mockReturnValueOnce([closed])
      .mockReturnValue([open]);
    instance.isAuthorizedCwd = vi.fn(() => false);
    instance.sendRemoteClient = vi.fn();
    instance.scheduleCodexHistoryRefresh = vi.fn();
    instance.codexSessionCache = new Map([["sentinel", [{ id: "keep" }]]]);
    instance.codexSessionCacheAt = new Map([["sentinel", 123]]);

    instance.installTestHooks().fromRemote({ type: "listSessions", offset: 0, query: "" }, "phone");

    expect(instance.scheduleCodexHistoryRefresh).not.toHaveBeenCalled();
    expect(instance.codexSessionCache.get("sentinel")).toEqual([{ id: "keep" }]);
    expect(instance.codexSessionCacheAt.get("sentinel")).toBe(123);
    expect(instance.sendRemoteClient).toHaveBeenCalledWith("phone", {
      type: "sessions",
      entries: [],
      activeId: null,
      dots: {},
      offset: 0,
      total: 0,
      hasMore: false,
      nextOffset: 0,
      query: "",
    });
  });

  it("exact-sorts the loaded Grok window before combined-provider merging", () => {
    const grokHome = fs.mkdtempSync(path.join(os.tmpdir(), "grok-combined-order-"));
    const cwd = path.join(grokHome, "repo");
    const catalog = sessionsDirFor(grokHome, cwd);
    const previousHome = process.env.GROK_HOME;
    try {
      process.env.GROK_HOME = grokHome;
      for (const [id, mtime] of [["mtime-new", 2_000], ["mtime-old", 1_000]] as const) {
        const dir = path.join(catalog, id);
        fs.mkdirSync(dir, { recursive: true });
        const summary = path.join(dir, "summary.json");
        fs.writeFileSync(summary, "{}");
        fs.utimesSync(summary, mtime / 1_000, mtime / 1_000);
      }

      const instance = Object.create(GrokSidebar.prototype) as any;
      instance.authorizedSessionCwds = vi.fn(() => [cwd]);
      instance.sessionCwdsForRepo = vi.fn(() => [cwd]);
      instance.refreshWorktreeCache = vi.fn(async () => {});
      instance.state = { get: vi.fn(() => ({})) };
      instance.host = { appendLine: vi.fn() };
      instance.pool = new Set<Session>();
      instance.annotateWorktreeLabels = vi.fn();
      instance.dotForId = vi.fn(() => "none");
      instance.readEntriesCachedMulti = vi.fn((ids: string[]) => ids.map((id): SessionListEntry => ({
        id,
        cwd,
        displayName: id,
        rawSummary: id,
        updatedAt: id === "mtime-old" ? 200 : 100,
        createdAt: 1,
        numMessages: 1,
      })));

      const result = instance.buildGrokSessionsList(
        cwd,
        { offset: 0, limit: 2 },
        null,
        "local",
      );

      expect(result.entries.map((entry: SessionListEntry) => entry.id)).toEqual(["mtime-old", "mtime-new"]);
      expect(result.nextOffset).toBe(2);
    } finally {
      if (previousHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = previousHome;
      fs.rmSync(grokHome, { recursive: true, force: true });
    }
  });

  it("routes every sidebar Codex discovery through the class-owned locator", () => {
    expect(sidebar.match(/locateCodexCli\(/g)).toHaveLength(1);
    expect(desktopSources).not.toContain("locateCodexCli(");
    const start = methodBody("private async startSession(");
    expect(start).toContain("this.locateProvider(session.provider)");
    expect(start).not.toContain("locateCodexCli(");
    const owner = methodBody("private locateProvider(");
    expect(owner).toContain("managedStorageRoot: this.context.globalStorageUri.fsPath");
    expect(owner).toContain("arch: process.arch");
  });

  it("observes Codex logout success before entering the synchronous logout reset", () => {
    const body = sidebar.slice(sidebar.indexOf("async logout("), sidebar.indexOf("dispose(): void"));
    const exec = body.indexOf('await execGrokCli(cliPath, ["logout"]');
    const disconnect = body.indexOf('await this.finishProviderLogout("codex")');
    expect(exec).toBeGreaterThan(-1);
    expect(disconnect).toBeGreaterThan(exec);
    expect(body.slice(exec, disconnect)).toContain("catch (error)");
    expect(body).toContain('chat.error.codexSignOutFailed');
    expect(body).toContain('this.locateProvider("codex")');
    expect(body).toContain('this.locateProvider("grok")');
    expect(body).toContain('await this.finishProviderLogout("codex")');
    expect(body).toContain('await this.finishProviderLogout("grok")');
  });

  it("posts provider-specific recovery UI after a second auth failure", () => {
    const body = methodBody("private async recoverAuthAndResend(");
    expect(body).toContain("providerLoginState(session.provider)");
  });

  it("routes Re-check through the provider credential probe without allowing Codex warm-up failure to escape", () => {
    const warm = methodBody("private async warmConnectedCodexModels(");
    expect(warm).toContain("await warmCodexModelCache(");
    expect(warm).toContain("model-cache warm-up failed");
    const reprobe = methodBody("private async reprobeProviderCredentials(");
    expect(reprobe).toContain('if (provider === "codex")');
    expect(reprobe).toContain("this.warmConnectedCodexModels()");
    const recheck = sidebar.slice(sidebar.indexOf('case "recheckConnection":'), sidebar.indexOf('case "logout":'));
    expect(recheck).toContain("await this.reprobeProviderCredentials(provider)");
  });

  it("puts minimal provider state in every remote client snapshot", () => {
    const instance = Object.create(GrokSidebar.prototype) as any;
    instance.providerConnections = vi.fn(() => ({ grok: true, codex: true }));
    instance.locatedProviders = vi.fn(() => ({ grok: true, codex: false }));
    expect(instance.providerStateMessage()).toEqual({
      type: "providerState",
      providers: [
        { id: "grok", connected: true },
        { id: "codex", connected: false },
      ],
    });

    const snapshot = methodBody("private buildRemoteSnapshot(");
    expect(snapshot).toContain("snap.push(this.providerStateMessage());");
    expect(snapshot.indexOf("snap.push(initial);")).toBeLessThan(
      snapshot.indexOf("snap.push(this.providerStateMessage());"),
    );
  });

  it("routes an empty remote provider pick through the cross-backend restart", async () => {
    const instance = Object.create(GrokSidebar.prototype) as any;
    const session = new Session();
    session.provider = "grok";
    session.activeSessionId = "empty-grok";
    session.client = { setModel: vi.fn() } as any;
    instance.connectedProviders = vi.fn(() => ["grok", "codex"]);
    instance.sessionCwd = vi.fn(() => "/repo");
    instance.rememberProjectProvider = vi.fn(async () => {});
    instance.startSession = vi.fn(async () => {});
    instance.discardRestartedEmptySession = vi.fn();

    await instance.switchModel("gpt-5.6-sol", session, { clientId: "phone" }, "codex");

    expect(session.provider).toBe("codex");
    expect(instance.rememberProjectProvider).toHaveBeenCalledWith("/repo", "codex", "gpt-5.6-sol");
    expect(instance.startSession).toHaveBeenCalledWith(undefined, session);
    expect(instance.discardRestartedEmptySession).toHaveBeenCalledWith("empty-grok", session);
    expect(session.client.setModel).not.toHaveBeenCalled();
  });

  it("infers an old client's cross-provider model and returns a targeted backstop", async () => {
    const instance = Object.create(GrokSidebar.prototype) as any;
    instance.state = {
      get: vi.fn(() => ({
        grok: { models: [{ modelId: "grok-build" }], seenAt: 1 },
        codex: { models: [{ modelId: "gpt-5.6-sol" }], seenAt: 1 },
      })),
    };
    const inferred = instance.providerForRequestedModel("grok-build", "codex");
    expect(inferred).toBe("grok");

    const session = new Session();
    session.provider = "codex";
    session.hasHistory = true;
    session.client = { setModel: vi.fn(async () => { throw new Error("Invalid params (-32602)"); }) } as any;
    instance.sendRemoteRequester = vi.fn();

    await instance.switchModel("grok-build", session, { clientId: "phone" }, inferred);

    expect(session.client.setModel).not.toHaveBeenCalled();
    expect(instance.sendRemoteRequester).toHaveBeenCalledWith(
      { clientId: "phone" },
      {
        type: "hostNotice",
        level: "warning",
        text: "This Codex conversation can only use Codex models. Start a new conversation to switch to Grok.",
      },
    );
    expect(sidebar.slice(sidebar.indexOf('case "setModel":'), sidebar.indexOf('case "installCodex":')))
      .toContain("providerForRequestedModel");
  });
});
