import { MainView } from "./views/mainView.js";
import { DetailView } from "./views/detailView.js";
import { SDG_DATA, getGoalById, toGoalRoute } from "./data/sdgs.js";
import { preloadCustomDetailRenderer } from "./details/registry.js";
import { createAppNavigation } from "./appNavigation.js";
import { createDetailWarmupController, nextFrame, scheduleBackgroundTask } from "./detailWarmup.js";
import { navigate, parseRoute, startRouter, subscribe, emitRoute } from "./router.js";
import { transitionMainToDetail, transitionDetailToMain } from "./transitions.js";
import { ensureLoader, showLoader, hideLoader } from "../js/components/loader.js";

const appState = {
  currentView: "main",
  currentGoalId: null,
  transitioning: false
};

const mainRoot = document.getElementById("mainView");
const detailRoot = document.getElementById("detailView");
const FIRST_VISIT_KEY = "sdgSpaFirstVisitDoneSessionV1";

const PRELOAD_REQ_TIMEOUT_MS = 1200;
const MIN_INITIAL_LOADER_MS = 520;
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

const { preloadOnBoot, runDetailWarmups } = createDetailWarmupController({
  goalIds: SDG_DATA.map((goal) => goal.id),
  goalCount: SDG_DATA.length,
  preloadRequestTimeoutMs: PRELOAD_REQ_TIMEOUT_MS,
  detailWarmRenderPasses: DETAIL_WARM_RENDER_PASSES,
  maxDetailRenderWarmCalls: MAX_DETAIL_RENDER_WARM_CALLS,
  preloadCustomDetailRenderer
});

let openDetail = async () => {};
let openMain = async () => {};
let handleRoute = async () => {};

({ openDetail, openMain, handleRoute } = createAppNavigation({
  appState,
  mainView,
  detailView,
  detailRoot,
  getGoalById,
  navigate,
  toGoalRoute,
  transitionMainToDetail,
  transitionDetailToMain,
  nextFrame,
  runDetailWarmups,
  setMainVisible
}));

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
