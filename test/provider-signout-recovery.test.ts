/**
 * What happens to the work in progress when the agent an account owns goes
 * away, and what happens when it comes back.
 *
 * Both halves are driven through the real webview entry points — the `logout`
 * command, a `resumeSession` open, a `recheckConnection` from the gear — because
 * the defects here were in the wiring between them, not in any single method.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { GrokSidebar } from "../src/sidebar";
import { en } from "../src/i18n";
import { RemoteClientState } from "../src/remote-client-state";
import { Session } from "../src/session";
import type { HostMsg } from "../src/protocol";

const fixtureAdapter = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "fake-codex-acp.cjs",
);

type Memento = Record<string, unknown>;

/**
 * A sidebar with real message routing over stubbed I/O. `memento` is shared on
 * purpose: passing the same object to a second sidebar is what a host restart
 * looks like from globalState's side.
 */
function makeSidebar(options: {
  memento?: Memento;
  connected?: ("grok" | "codex")[];
  cwd?: string;
} = {}): any {
  const cwd = options.cwd ?? "/repo";
  const memento: Memento = options.memento ?? {};
  const sidebar = Object.create(GrokSidebar.prototype) as any;
  const connected = options.connected ?? ["grok"];
  sidebar.providerConnectionState = { grok: true, codex: false };
  sidebar.providerConnections = vi.fn(() => sidebar.providerConnectionState);
  sidebar.locateProvider = vi.fn((provider: "grok" | "codex") => provider);
  sidebar.locatedProviders = vi.fn(() => ({
    grok: connected.includes("grok"),
    codex: connected.includes("codex"),
  }));
  sidebar.connectedProviders = vi.fn(() => connected);
  sidebar.defaultProviderForProject = vi.fn(() => connected[0] ?? "grok");
  sidebar.remoteClients = new RemoteClientState<Session>(cwd);
  sidebar.pool = new Set<Session>();
  sidebar.sessionCache = new Map();
  sidebar.sessionLoadReservations = new Map();
  sidebar.codexSessionCache = new Map();
  sidebar.codexSessionCacheAt = new Map();
  sidebar.codexSessionRefresh = new Map();
  sidebar.loginReprobeTimers = new Map();
  sidebar.worktreeCache = [];
  sidebar.focused = new Session();
  sidebar.focused.cwd = cwd;
  sidebar.sessionMetaWrites = Promise.resolve();
  sidebar.state = {
    get: vi.fn((key: string, fallback: unknown) =>
      (Object.prototype.hasOwnProperty.call(memento, key) ? memento[key] : fallback)),
    update: vi.fn(async (key: string, value: unknown) => { memento[key] = value; }),
  };
  sidebar.host = {
    canSwitchWorkspaceFolder: false,
    appendLine: vi.fn(),
    showWarningMessage: vi.fn(async () => en["common.signOut"]),
    showErrorMessage: vi.fn(async () => undefined),
    showInformationMessage: vi.fn(async () => undefined),
    createTerminal: vi.fn(() => ({ show: vi.fn(), sendText: vi.fn() })),
    getConfiguration: vi.fn(() => ({
      get: (_key: string, fallback: unknown) => fallback,
      inspect: () => undefined,
      update: vi.fn(async () => {}),
    })),
    fs: {
      readFile: vi.fn(async () => Buffer.from("")),
      writeFile: vi.fn(async () => {}),
      createDirectory: vi.fn(async () => {}),
    },
  };
  sidebar.postSessionsList = vi.fn();
  sidebar.postRepoCatalog = vi.fn();
  sidebar.postProviderState = vi.fn();
  sidebar.postSessionName = vi.fn();
  sidebar.dotForId = vi.fn(() => "none");
  sidebar.dropRemoteVoice = vi.fn();
  sidebar.stopVoiceInput = vi.fn();
  sidebar.workspaceRoot = vi.fn(() => cwd);
  sidebar.authorizedSessionCwds = vi.fn(() => [cwd]);
  sidebar.remoteAuthorizedSessionCwds = vi.fn(() => [cwd]);
  sidebar.sessionCwd = vi.fn((session: Session) => session.cwd || cwd);
  sidebar.setSessionCwd = vi.fn((session: Session, target: string) => { session.cwd = target; });
  sidebar.persistWorktreeBinding = vi.fn(async () => {});
  sidebar.sweepEmptySessions = vi.fn();
  sidebar.sendRemoteSessionList = vi.fn();
  sidebar.sendRemoteClient = vi.fn();
  sidebar.sendRemoteSession = vi.fn();
  sidebar.sendRemoteHistorySnapshot = vi.fn();
  sidebar.buildSessionsList = vi.fn(() => ({
    type: "sessions", entries: [], activeId: null, dots: {}, offset: 0,
    total: 0, hasMore: false, nextOffset: 0, query: "",
  }));
  sidebar.localizeHistoryMessage = (message: HostMsg) => message;
  sidebar.startSession = vi.fn(async () => {});
  return sidebar;
}

function logout(sidebar: any, provider: "grok" | "codex" = "grok"): Promise<void> {
  return sidebar.onMessage({ type: "logout", provider }, "local");
}

describe("a background conversation's draft when its provider signs out", () => {
  it("real logout parks the draft on that conversation and tells no remote tab", async () => {
    const sidebar = makeSidebar({ connected: ["codex"] });
    // The desk is reading a Codex conversation; a phone is attached to it. The
    // draft belongs to a Grok conversation neither of them is looking at.
    const desk = sidebar.focused as Session;
    desk.provider = "codex";
    desk.activeSessionId = "codex-desk";
    sidebar.remoteClients.identify("phone", "stable-phone-tab");
    sidebar.remoteClients.ready("phone");
    sidebar.remoteClients.setActive("phone", desk);
    const background = new Session();
    background.provider = "grok";
    background.cwd = "/repo";
    background.activeSessionId = "background-grok";
    background.hasHistory = true;
    background.client = { dispose: vi.fn() } as any;
    background.queuedSends = ["the secret draft"];
    sidebar.pool.add(background);
    sidebar.sessionDisplayName = vi.fn((session: Session) =>
      session === background ? "Background investigation" : "Codex desk");
    const local: HostMsg[] = [];
    const remote: HostMsg[] = [];
    sidebar.view = { webview: { postMessage: (message: HostMsg) => local.push(message) } };
    sidebar.sendRemoteSession = vi.fn((_session: Session, message: HostMsg) => remote.push(message));
    sidebar.sendRemoteClient = vi.fn((_clientId: string, message: HostMsg) => remote.push(message));
    delete sidebar.post; // the real fan-out is the thing under test

    await logout(sidebar);

    expect(JSON.stringify(remote)).not.toContain("the secret draft");
    expect(JSON.stringify(remote)).not.toContain("Background investigation");
    const notice = local.find((message) =>
      message.type === "error" && message.text.includes("Background investigation"));
    expect(notice).toBeDefined();
    expect(JSON.stringify(notice)).not.toContain("the secret draft");
    expect((sidebar.state.get("grok.sessionMeta", {}) as any)["background-grok"].queuedDraft)
      .toBe("the secret draft");
  });

  it("shows the text when a background start race has no conversation id yet", async () => {
    const sidebar = makeSidebar({ connected: ["codex"] });
    sidebar.focused.provider = "codex";
    const background = new Session();
    background.provider = "grok";
    background.cwd = "/repo";
    background.queuedSends = ["draft typed during startup"];
    background.client = { dispose: vi.fn() } as any;
    sidebar.pool.add(background);
    sidebar.sessionDisplayName = vi.fn(() => "Starting conversation");
    const local: HostMsg[] = [];
    sidebar.view = { webview: { postMessage: (message: HostMsg) => local.push(message) } };
    delete sidebar.post;

    await logout(sidebar);

    expect(local).toContainEqual({
      type: "error",
      text: expect.stringContaining("draft typed during startup"),
    });
  });

  it("real logout keeps the local-only notice out of every replay buffer", async () => {
    const sidebar = makeSidebar({ connected: ["codex"] });
    const desk = sidebar.focused as Session;
    desk.provider = "codex";
    const background = new Session();
    background.provider = "grok";
    background.cwd = "/repo";
    background.activeSessionId = "background-grok";
    background.client = { dispose: vi.fn() } as any;
    background.queuedSends = ["draft text"];
    sidebar.pool.add(background);
    sidebar.sessionDisplayName = vi.fn(() => "Background investigation");
    sidebar.view = { webview: { postMessage: vi.fn() } };
    delete sidebar.post;

    await logout(sidebar);

    // The draft is durable in META; the notice is deliberately transient so a
    // remote snapshot can never replay a desk-only account event.
    expect(desk.buffer.some((message) =>
      message.type === "error" && message.text.includes("Background investigation"))).toBe(false);
    expect((sidebar.state.get("grok.sessionMeta", {}) as any)["background-grok"].queuedDraft)
      .toBe("draft text");
  });
});

describe("reopening a conversation whose draft was parked", () => {
  const previousAdapter = process.env.GROK_TEST_CODEX_ACP_ADAPTER_PATH;
  const previousNodeEnv = process.env.NODE_ENV;
  let workspace: string;

  beforeEach(() => {
    process.env.NODE_ENV = "test";
    process.env.GROK_TEST_CODEX_ACP_ADAPTER_PATH = fixtureAdapter;
    workspace = fs.mkdtempSync(path.join(os.tmpdir(), "grok-draft-ws-"));
  });

  afterEach(() => {
    if (previousAdapter === undefined) delete process.env.GROK_TEST_CODEX_ACP_ADAPTER_PATH;
    else process.env.GROK_TEST_CODEX_ACP_ADAPTER_PATH = previousAdapter;
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    fs.rmSync(workspace, { recursive: true, force: true });
  });

  function makeResumableSidebar(memento: Memento): any {
    const sidebar = makeSidebar({ memento, connected: ["codex"], cwd: workspace });
    sidebar.focused.provider = "codex";
    sidebar.locateProvider = vi.fn(() => "codex");
    sidebar.localTrustedSessionCwds = vi.fn(() => [workspace]);
    sidebar.resolveLocalRepoTarget = vi.fn(() => undefined);
    sidebar.parkFocused = vi.fn();
    sidebar.markRead = vi.fn();
    sidebar.emitContextUsage = vi.fn();
    sidebar.restoreUsage = vi.fn();
    sidebar.cacheProviderModels = vi.fn(() => Promise.resolve());
    sidebar.touch = vi.fn();
    sidebar.reapPool = vi.fn();
    sidebar.maybeFlushQueuedSends = vi.fn(async () => {});
    sidebar.terminalManager = { create: vi.fn(), disposeAll: vi.fn() };
    sidebar.context = { globalStorageUri: { fsPath: workspace }, subscriptions: [] };
    sidebar.turnOrderTimers = new Set();
    sidebar.fullImagePaths = new Map();
    sidebar.pendingAttach = new Set();
    sidebar.pushDot = vi.fn();
    delete sidebar.startSession; // the real spawn against the fake adapter
    return sidebar;
  }

  async function reopen(sidebar: any, id: string): Promise<HostMsg[]> {
    const seen: HostMsg[] = [];
    sidebar.view = { webview: { postMessage: (message: HostMsg) => seen.push(message) } };
    await sidebar.onMessage({ type: "resumeSession", id, cwd: workspace }, "local");
    await sidebar.focused.client?.dispose();
    return seen;
  }

  it("a fresh host restores the parked draft on reopen, and only once", async () => {
    // The park happens in one process; the restore happens in the next one.
    // Sharing the memento is what makes this a reload rather than a re-render.
    const memento: Memento = {
      "grok.sessionMeta": {
        "codex-live-1": { provider: "codex", providerCwd: workspace, queuedDraft: "half-typed idea" },
      },
    };

    const restored = await reopen(makeResumableSidebar(memento), "codex-live-1");
    expect(restored).toContainEqual({ type: "restoreComposer", text: "half-typed idea" });

    // `restoreComposer` appends, so a draft left in meta would stack another
    // copy on every reopen.
    const again = await reopen(makeResumableSidebar(memento), "codex-live-1");
    expect(again.some((message) => message.type === "restoreComposer")).toBe(false);
    expect((memento["grok.sessionMeta"] as any)["codex-live-1"].queuedDraft).toBeUndefined();
    expect((memento["grok.sessionMeta"] as any)["codex-live-1"].provider).toBe("codex");
  }, 20_000);

  it("restores a parked draft when the Projects rail opens it before the chat webview resolves", async () => {
    const memento: Memento = {
      "grok.sessionMeta": {
        "codex-rail-1": { provider: "codex", providerCwd: workspace, queuedDraft: "rail draft" },
      },
    };
    const sidebar = makeResumableSidebar(memento);
    const seen: HostMsg[] = [];
    const chatView = {
      webview: {
        options: {},
        html: "",
        postMessage: (message: HostMsg) => seen.push(message),
        onDidReceiveMessage: vi.fn(),
      },
    };
    sidebar.chatLocalResourceRoots = vi.fn(() => []);
    sidebar.getHtml = vi.fn(() => "");
    sidebar.watchActiveEditor = vi.fn();
    sidebar.reaper = {};
    sidebar.host.onDidChangeConfiguration = vi.fn(() => ({ dispose: vi.fn() }));
    sidebar.host.createFileSystemWatcher = vi.fn(() => ({
      onDidCreate: vi.fn(),
      onDidChange: vi.fn(),
      onDidDelete: vi.fn(),
      dispose: vi.fn(),
    }));
    sidebar.applyTerminalShellPref = vi.fn();
    sidebar.maybeStartUplink = vi.fn();
    sidebar.host.revealChatView = vi.fn(async () => {
      expect(sidebar.focused.client).toBeDefined();
      expect((memento["grok.sessionMeta"] as any)["codex-rail-1"].queuedDraft).toBe("rail draft");
      expect(seen.some((message) => message.type === "restoreComposer")).toBe(false);
      sidebar.resolveWebviewView(chatView);
    });

    await sidebar.onProjectsRailMessage({
      type: "resumeSession",
      id: "codex-rail-1",
      cwd: workspace,
    });
    await sidebar.sessionMetaWrites;
    await sidebar.focused.client?.dispose();

    expect(sidebar.host.revealChatView).toHaveBeenCalledOnce();
    expect(seen.filter((message) => message.type === "restoreComposer")).toEqual([
      { type: "restoreComposer", text: "rail draft" },
    ]);
    expect((memento["grok.sessionMeta"] as any)["codex-rail-1"].queuedDraft).toBeUndefined();
  }, 20_000);
});

describe("startup refusal cleanup", () => {
  it("a real re-check clears priming and locked busy when the cwd is refused", async () => {
    const sidebar = makeSidebar({ connected: ["codex"], cwd: "/closed" });
    const session = sidebar.focused as Session;
    session.provider = "codex";
    session.cwd = "/closed";
    session.priming = true;
    sidebar.host.canSwitchWorkspaceFolder = true;
    sidebar.isAuthorizedCwd = vi.fn(() => false);
    sidebar.locateProvider = vi.fn(() => "codex");
    sidebar.setProviderConnected = vi.fn(async () => {});
    sidebar.reprobeProviderCredentials = vi.fn(async () => true);
    const emitted: HostMsg[] = [];
    sidebar.emit = vi.fn((_session: Session, message: HostMsg) => emitted.push(message));
    delete sidebar.startSession;

    await sidebar.onMessage({ type: "recheckConnection", provider: "codex" }, "local");

    expect(session.priming).toBe(false);
    expect(emitted).toContainEqual({ type: "setBusy", value: false });
  });
});

describe("signing back in after the last provider signed out", () => {
  it("real logout leaves no session bound to the agent that is not connected", async () => {
    const sidebar = makeSidebar({ connected: ["grok"] });
    // Grok is the only account. `connectedProviders` reflects the world AFTER
    // the sign-out, which is the state the replacements are minted in.
    sidebar.connectedProviders = vi.fn(() => []);
    sidebar.defaultProviderForProject = vi.fn(() => "grok");
    const desk = sidebar.focused as Session;
    desk.provider = "grok";
    desk.client = { dispose: vi.fn() } as any;
    const phone = new Session();
    phone.provider = "grok";
    phone.cwd = "/repo";
    phone.client = { dispose: vi.fn() } as any;
    phone.queuedSends = ["ask about the migration"];
    sidebar.remoteClients.identify("phone", "stable-phone-tab-after-logout");
    sidebar.remoteClients.ready("phone");
    sidebar.remoteClients.setActive("phone", phone);
    sidebar.pool = new Set([desk, phone]);

    await logout(sidebar);

    const replacement = sidebar.remoteClients.active("phone") as Session;
    expect(replacement).not.toBe(phone);
    expect(replacement.provider).not.toBe("codex");
    expect(replacement.needsProvider).toBe(true);
    expect(replacement.client).toBeUndefined();
    expect(sidebar.focused.needsProvider).toBe(true);
    expect(sidebar.startSession).not.toHaveBeenCalled();
    expect(sidebar.sendRemoteClient).toHaveBeenCalledWith("phone", expect.objectContaining({
      type: "onboarding",
      state: "connect-agent",
    }));

    sidebar.installTestHooks().remoteClientLeft("phone");
    expect(sidebar.remoteClients.detachedActiveValues()).toContain(replacement);
  });

  it("the real New-session entry parks an agent-less draft instead of discarding it", async () => {
    const sidebar = makeSidebar({ connected: ["grok"] });
    sidebar.connectedProviders = vi.fn(() => []);
    const old = sidebar.focused as Session;
    old.provider = "grok";
    old.activeSessionId = "park-origin";
    old.queuedSends = ["park me"];
    old.client = { dispose: vi.fn() } as any;
    await logout(sidebar);
    const stranded = sidebar.focused as Session;
    sidebar.resolveLocalRepoTarget = vi.fn(() => undefined);
    sidebar.historyCwdFor = vi.fn(() => "/repo");

    await sidebar.onMessage({ type: "newSession" }, "local");

    expect(sidebar.focused).not.toBe(stranded);
    expect(sidebar.pool.has(stranded)).toBe(true);
    expect(stranded.needsProvider).toBe(true);
    expect(stranded.strandedDraft).toBe("park me");
  });

  it("desk-first sign-in leaves a detached draft in META until that phone reconnects", async () => {
    const sidebar = makeSidebar({ connected: ["grok"] });
    sidebar.connectedProviders = vi.fn(() => []);
    sidebar.defaultProviderForProject = vi.fn(() => "grok");
    const desk = sidebar.focused as Session;
    desk.provider = "grok";
    desk.client = { dispose: vi.fn() } as any;
    const phone = new Session();
    phone.provider = "grok";
    phone.cwd = "/repo";
    phone.client = { dispose: vi.fn() } as any;
    phone.queuedSends = ["ask about the migration"];
    const detached = new Session();
    detached.provider = "grok";
    detached.cwd = "/repo";
    detached.activeSessionId = "detached-grok";
    detached.hasHistory = true;
    detached.client = { dispose: vi.fn() } as any;
    detached.queuedSends = ["draft from the disconnected phone"];
    sidebar.remoteClients.ready("phone");
    sidebar.remoteClients.setActive("phone", phone);
    sidebar.remoteClients.identify("old-socket", "stable-tab");
    sidebar.remoteClients.ready("old-socket");
    sidebar.remoteClients.setActive("old-socket", detached);
    sidebar.pool = new Set([desk, phone, detached]);
    sidebar.installTestHooks().remoteClientLeft("old-socket");

    await logout(sidebar);

    const replacement = sidebar.remoteClients.active("phone") as Session;
    const detachedBeforeReconnect = sidebar.remoteClients.detachedActiveValues()[0] as Session;
    // Prove adoption scans the detached store itself, not the pool side effect.
    sidebar.pool.delete(detachedBeforeReconnect);
    const restored: Array<{ session: Session; text: string }> = [];
    sidebar.emit = vi.fn((session: Session, message: HostMsg) => {
      if (message.type === "restoreComposer") restored.push({ session, text: message.text });
    });
    // Signing back in at the desk, exactly as the onboarding button does it.
    sidebar.connectedProviders = vi.fn(() => ["grok"]);
    sidebar.locateProvider = vi.fn(() => "grok");
    sidebar.setProviderConnected = vi.fn(async () => {});
    sidebar.warmConnectedCodexModels = vi.fn(async () => {});
    sidebar.reprobeProviderCredentials = vi.fn(async () => true);
    sidebar.startSession = vi.fn(async (_resumeId: undefined, session: Session) => {
      session.needsProvider = false;
      session.activeSessionId = "fresh-grok";
      session.client = { dispose: vi.fn() } as any;
      return session.client;
    });

    await sidebar.onMessage({ type: "recheckConnection", provider: "grok" }, "local");

    const started: Session[] = sidebar.startSession.mock.calls.map((call: any[]) => call[1]);
    expect(started).toContain(sidebar.focused);
    expect(started).toContain(replacement);
    // The tab that was gone when its provider signed out is adopted too — its
    // replacement is a pool member with no client of its own.
    const detachedReplacement = started.find((session) =>
      session !== sidebar.focused && session !== replacement);
    expect(detachedReplacement).toBeDefined();
    expect(detachedReplacement!.provider).toBe("grok");
    expect(replacement.provider).toBe("grok");
    expect(restored).toContainEqual({ session: replacement, text: "ask about the migration" });
    expect(restored).not.toContainEqual({
      session: detachedReplacement,
      text: "draft from the disconnected phone",
    });
    await sidebar.sessionMetaWrites;
    expect((sidebar.state.get("grok.sessionMeta", {}) as any)["detached-grok"].queuedDraft)
      .toBe("draft from the disconnected phone");
    expect(detachedReplacement!.strandedDraft).toBe("draft from the disconnected phone");

    sidebar.startingForRemote = new WeakSet();
    sidebar.handleRemoteClientReady("new-socket", "stable-tab");
    await sidebar.sessionMetaWrites;
    expect(restored).toContainEqual({
      session: detachedReplacement,
      text: "draft from the disconnected phone",
    });
    expect((sidebar.state.get("grok.sessionMeta", {}) as any)["detached-grok"].queuedDraft)
      .toBeUndefined();
    expect(detachedReplacement!.strandedDraft).toBeUndefined();
    expect(replacement.strandedDraft).toBeUndefined();
    expect(sidebar.sendRemoteSessionList).toHaveBeenCalled();
  });

  it("keeps the META draft through a refused adoption and clears it only after a successful retry", async () => {
    const memento: Memento = {};
    const sidebar = makeSidebar({ memento, connected: ["grok"] });
    sidebar.connectedProviders = vi.fn(() => []);
    const old = sidebar.focused as Session;
    old.provider = "grok";
    old.activeSessionId = "draft-origin";
    old.queuedSends = ["survive failed retry"];
    old.client = { dispose: vi.fn() } as any;
    await logout(sidebar);

    sidebar.connectedProviders = vi.fn(() => ["grok"]);
    sidebar.locateProvider = vi.fn(() => "grok");
    sidebar.setProviderConnected = vi.fn(async () => {});
    sidebar.reprobeProviderCredentials = vi.fn(async () => true);
    sidebar.startSession = vi.fn(async () => undefined);
    const restored: HostMsg[] = [];
    sidebar.emit = vi.fn((_session: Session, message: HostMsg) => restored.push(message));

    await sidebar.onMessage({ type: "recheckConnection", provider: "grok" }, "local");
    expect(sidebar.focused.needsProvider).toBe(true);
    expect(sidebar.focused.strandedDraft).toBe("survive failed retry");
    expect((memento["grok.sessionMeta"] as any)["draft-origin"].queuedDraft).toBe("survive failed retry");
    expect(restored.some((message) => message.type === "restoreComposer")).toBe(false);

    sidebar.startSession = vi.fn(async (_id: undefined, session: Session) => {
      session.needsProvider = false;
      session.activeSessionId = "fresh-after-login";
      return {};
    });
    await sidebar.onMessage({ type: "recheckConnection", provider: "grok" }, "local");
    await sidebar.sessionMetaWrites;
    expect(restored).toContainEqual({ type: "restoreComposer", text: "survive failed retry" });
    expect((memento["grok.sessionMeta"] as any)["draft-origin"].queuedDraft).toBeUndefined();
  });

  it("keeps a stranded draft when replacement startup fails with another provider connected", async () => {
    const memento: Memento = {};
    const sidebar = makeSidebar({ memento, connected: ["grok", "codex"] });
    const old = sidebar.focused as Session;
    old.provider = "grok";
    old.activeSessionId = "cross-provider-origin";
    old.queuedSends = ["survive the Codex replacement refusal"];
    old.client = { dispose: vi.fn() } as any;
    sidebar.startSession = vi.fn(async () => undefined);
    const restored: HostMsg[] = [];
    sidebar.emit = vi.fn((_session: Session, message: HostMsg) => restored.push(message));

    await logout(sidebar);
    await sidebar.sessionMetaWrites;

    expect(sidebar.focused.needsProvider).toBe(false);
    expect(sidebar.focused.strandedDraft).toBe("survive the Codex replacement refusal");
    expect((memento["grok.sessionMeta"] as any)["cross-provider-origin"].queuedDraft)
      .toBe("survive the Codex replacement refusal");
    expect(restored.some((message) => message.type === "restoreComposer")).toBe(false);
  });
});
