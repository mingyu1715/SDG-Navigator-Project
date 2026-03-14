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

const BOOT_MAX_WAIT_MS = 4500;
const PRELOAD_REQ_TIMEOUT_MS = 1200;
const MIN_INITIAL_LOADER_MS = 520;

const mainView = new MainView(mainRoot, {
  onSelect: (goalId, cardEl) => {
    void openDetail(goalId, { source: "user", cardEl });
  },
  onFullscreen: async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  }
});

const detailView = new DetailView(detailRoot, {
  onBack: () => {
    void openMain({ source: "user" });
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

function getBootPreloadTargets() {
  const detailPages = SDG_DATA.map((goal) => `/detailed/sdg-${String(goal.id).padStart(2, "0")}/index.html`);
  const apiTargets = SDG_DATA.map((goal) => `/api/sdgs/${goal.id}`);
  return [...detailPages, ...apiTargets];
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
  const urls = getBootPreloadTargets();

  await Promise.allSettled(
    urls.map((url) =>
      fetchWithTimeout(url, PRELOAD_REQ_TIMEOUT_MS)
        .catch(() => null)
    )
  );
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
  const detailLoadPromise = withTimeout(detailView.load(goalId), 3600);
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
        waitForReady: () => detailLoadPromise
      });
    } else {
      setMainVisible(false);
      detailView.setVisible(true);
      await detailLoadPromise;
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

  try {
    if (isFirstVisit) {
      await Promise.race([
        preloadOnBoot(),
        new Promise((resolve) => setTimeout(resolve, BOOT_MAX_WAIT_MS))
      ]);
    }
  } finally {
    bootstrapApp();
    // Keep loader visible for a minimum duration to avoid flicker on fast boots.
    const elapsed = performance.now() - loaderShownAt;
    const remain = Math.max(0, MIN_INITIAL_LOADER_MS - elapsed);
    if (remain > 0) {
      await new Promise((resolve) => setTimeout(resolve, remain));
    }
    hideLoader();
  }
}

void bootstrap();
