import { MainView } from "./views/mainView.js";
import { DetailView } from "./views/detailView.js";
import { SDG_DATA, getGoalById, toGoalRoute } from "./data/sdgs.js";
import { navigate, parseRoute, startRouter, subscribe, emitRoute } from "./router.js";
import { transitionMainToDetail, transitionDetailToMain } from "./transitions.js";
import { ensureLoader, showLoader, hideLoader } from "../js/components/loader.js";

const appState = {
  currentView: "main",
  currentGoalId: null,
  transitioning: false,
  initialized: false
};

const mainRoot = document.getElementById("mainView");
const detailRoot = document.getElementById("detailView");
const FIRST_VISIT_KEY = "sdgSpaFirstVisitDoneSessionV1";

const PRELOAD_REQ_TIMEOUT_MS = 1200;
const MIN_INITIAL_LOADER_MS = 520;
let bootPreloadStarted = false;
let detailRenderWarmCalls = 0;
const warmedDetailGoalIds = new Set();
const CUSTOM_DETAIL_MODULE_PATHS = new Map([
  [1, "./details/sdg01Content.js"],
  [2, "./details/sdg02Content.js"],
  [3, "./details/sdg03Content.js"],
  [4, "./details/sdg04Content.js"]
]);
const DETAIL_WARM_RENDER_PASSES = 3;
const MAX_DETAIL_RENDER_WARM_CALLS = 8;

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }
    await document.exitFullscreen();
  } catch {
    // ignore
  }
}

const mainView = new MainView(mainRoot, {
  onSelect: (goalId, cardEl) => {
    void openDetail(goalId, { source: "user", cardEl });
  },
  onFullscreen: () => {
    void toggleFullscreen();
  }
});

const detailView = new DetailView(detailRoot, {
  onBack: () => {
    void openMain({ source: "user" });
  },
  onFullscreen: () => {
    void toggleFullscreen();
  }
});

function setMainVisible(visible) {
  mainRoot.style.pointerEvents = visible ? "auto" : "none";
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    Promise.resolve(promise).catch(() => null),
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))
  ]);
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function scheduleBackgroundTask(task) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => {
      void task();
    }, { timeout: 1600 });
    return;
  }

  window.setTimeout(() => {
    void task();
  }, 0);
}

function getBootPreloadTargets() {
  const apiTargets = SDG_DATA.map((goal) => `/api/sdgs/${goal.id}`);
  return apiTargets;
}

function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    credentials: "same-origin",
    cache: "force-cache",
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timer);
  });
}

async function preloadOnBoot() {
  if (bootPreloadStarted) return;
  bootPreloadStarted = true;

  const urls = getBootPreloadTargets();

  await Promise.allSettled(
    urls.map((url) =>
      fetchWithTimeout(url, PRELOAD_REQ_TIMEOUT_MS)
        .catch(() => null)
    )
  );
}

async function warmDetailNetworkCache(goalId) {
  const id = Number(goalId);
  if (!Number.isFinite(id) || id <= 0) return;
  if (id > SDG_DATA.length) return;
  if (warmedDetailGoalIds.has(id)) return;
  warmedDetailGoalIds.add(id);

  const customModulePath = CUSTOM_DETAIL_MODULE_PATHS.get(id);
  if (customModulePath) {
    await import(customModulePath);
    return;
  }

  await fetchWithTimeout(`/api/sdgs/${id}`, PRELOAD_REQ_TIMEOUT_MS).catch(() => null);
}

function getDetailWarmTargetIds(goalId) {
  const id = Number(goalId);
  const raw = [
    id,
    id - 1,
    id + 1,
    id - 2,
    id + 2,
    1,
    2,
    3,
    4
  ];
  const unique = new Set();
  raw.forEach((value) => {
    if (!Number.isFinite(value)) return;
    if (value < 1 || value > SDG_DATA.length) return;
    unique.add(value);
  });
  return Array.from(unique);
}

async function warmDetailRenderPath() {
  if (detailRenderWarmCalls >= MAX_DETAIL_RENDER_WARM_CALLS) return;
  detailRenderWarmCalls += 1;

  await nextFrame();

  // Warm up JIT on tiny math workload before heavier interactive scripts run.
  let warmAcc = 0;
  for (let pass = 0; pass < DETAIL_WARM_RENDER_PASSES; pass += 1) {
    for (let i = 0; i < 3200; i += 1) {
      warmAcc += Math.sin(i * 0.01) * Math.cos(i * 0.02 + pass * 0.1);
    }
  }
  if (!Number.isFinite(warmAcc)) {
    detailRenderWarmCalls = Math.max(0, detailRenderWarmCalls - 1);
  }

  const gsap = window.gsap;
  if (!gsap || typeof gsap.set !== "function") return;

  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.left = "-9999px";
  probe.style.top = "-9999px";
  probe.style.width = "1px";
  probe.style.height = "1px";
  probe.style.opacity = "0";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);

  try {
    gsap.set(probe, { x: 0, y: 0, force3D: true });
    for (let pass = 0; pass < DETAIL_WARM_RENDER_PASSES; pass += 1) {
      await new Promise((resolve) => {
        gsap.to(probe, {
          duration: 0.02,
          x: (pass + 1) * 2,
          y: pass % 2 === 0 ? 1 : -1,
          scale: 1 + pass * 0.015,
          overwrite: true,
          onComplete: resolve,
          onInterrupt: resolve
        });
      });
    }
  } finally {
    if (probe.parentNode) {
      probe.parentNode.removeChild(probe);
    }
  }
}

async function runDetailWarmups(goalId, rounds = 1) {
  const targets = getDetailWarmTargetIds(goalId);
  const repeatCount = Math.max(1, Number(rounds) || 1);

  for (let round = 0; round < repeatCount; round += 1) {
    const networkWarmups = targets.map((id) =>
      withTimeout(warmDetailNetworkCache(id), 900)
    );
    await Promise.allSettled([
      ...networkWarmups,
      withTimeout(warmDetailRenderPath(), 360)
    ]);
  }
}

function createDetailLoadStarter(goalId) {
  let loadPromise = null;
  return () => {
    if (!loadPromise) {
      loadPromise = withTimeout(detailView.load(goalId), 3600);
    }
    return loadPromise;
  };
}

async function openDetail(goalId, options = {}) {
  const { source = "route", cardEl = null } = options;
  if (appState.transitioning) return;
  if (appState.currentView === "detail" && appState.currentGoalId === goalId) return;

  const goal = getGoalById(goalId);
  if (!goal) return;

  appState.transitioning = true;
  appState.currentGoalId = goalId;

  if (source === "user") {
    navigate(toGoalRoute(goalId), { emit: false, state: { view: "detail", goalId } });
  }

  mainView.focusGoal(goalId, { animate: source === "route" });

  const selectedRect = cardEl ? cardEl.getBoundingClientRect() : mainView.getCardRect(goalId);
  if (selectedRect) {
    try {
      sessionStorage.setItem(
        "sdgReturnCardRect",
        JSON.stringify({
          goalId,
          left: selectedRect.left / window.innerWidth,
          top: selectedRect.top / window.innerHeight,
          width: selectedRect.width / window.innerWidth,
          height: selectedRect.height / window.innerHeight,
          ts: Date.now()
        })
      );
    } catch {
      // ignore
    }
  }

  detailView.setAccent(goal.color);
  const startDetailLoad = createDetailLoadStarter(goalId);
  try {
    if (source === "user" && cardEl) {
      await transitionMainToDetail({
        cardEl,
        accent: goal.color,
        detailRoot,
        onHalfOpen: () => {
          setMainVisible(false);
          detailView.setVisible(true);
        },
        waitForReady: async () => {
          // Let the transition-layer loader paint first, then start heavy work.
          await nextFrame();
          await runDetailWarmups(goalId, 1);
          void runDetailWarmups(goalId, 3).catch(() => null);
          return startDetailLoad();
        }
      });
    } else {
      setMainVisible(false);
      detailView.setVisible(true);
      await runDetailWarmups(goalId, 1);
      void runDetailWarmups(goalId, 3).catch(() => null);
      await startDetailLoad();
    }

    appState.currentView = "detail";
  } finally {
    appState.transitioning = false;
  }
}

async function openMain(options = {}) {
  const { source = "route" } = options;
  if (appState.transitioning) return;
  if (appState.currentView === "main") return;

  appState.transitioning = true;

  if (source === "user") {
    navigate("/", { emit: false, state: { view: "main" } });
  }

  try {
    setMainVisible(true);
    await nextFrame();
    const targetRect = mainView.getCenterCardRect();
    await transitionDetailToMain({ detailRoot, targetRect });
  } finally {
    detailView.reset();
    detailView.setVisible(false);
    appState.currentView = "main";
    appState.currentGoalId = null;
    appState.transitioning = false;
  }
}

async function handleRoute(route) {
  if (!route) return;

  if (route.name === "detail" && route.goalId) {
    if (!getGoalById(route.goalId)) {
      navigate("/", { replace: true, emit: false, state: { view: "main" } });
      await openMain({ source: "route" });
      return;
    }

    await openDetail(route.goalId, { source: "route" });
    return;
  }

  await openMain({ source: "route" });
}

function bootstrapApp() {
  mainView.mount();
  detailView.mount();
  detailView.setVisible(false);
  setMainVisible(true);

  startRouter();
  subscribe((route) => {
    void handleRoute(route);
  });

  const initial = parseRoute(window.location.pathname);
  if (initial.path !== window.location.pathname) {
    navigate(initial.path, { replace: true, emit: false });
  }
  emitRoute(initial);

  appState.initialized = true;
  return initial;
}

async function bootstrap() {
  ensureLoader();
  showLoader();
  const loaderShownAt = performance.now();

  let isFirstVisit = true;
  try {
    isFirstVisit = sessionStorage.getItem(FIRST_VISIT_KEY) !== "1";
    if (isFirstVisit) {
      sessionStorage.setItem(FIRST_VISIT_KEY, "1");
    }
  } catch {
    // sessionStorage unavailable: treat as first visit
    isFirstVisit = true;
  }

  const initialRoute = bootstrapApp();
  // Keep loader visible for a minimum duration to avoid flicker on fast boots.
  const elapsed = performance.now() - loaderShownAt;
  const remain = Math.max(0, MIN_INITIAL_LOADER_MS - elapsed);
  if (remain > 0) {
    await new Promise((resolve) => setTimeout(resolve, remain));
  }
  hideLoader();
  if (initialRoute?.name === "main") {
    await nextFrame();
    mainView.playIntroToGoal(9);
  }

  if (isFirstVisit) {
    scheduleBackgroundTask(async () => {
      await preloadOnBoot();
    });
  }
}

void bootstrap();
