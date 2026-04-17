import { withTimeout } from "./detailWarmup.js";

export function createAppNavigation({
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
}) {
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
        // Start loading immediately so the overlay appears before warmup runs,
        // preventing a brief flash of the frame-header at the wrong position.
        void startDetailLoad();
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

  return {
    openDetail,
    openMain,
    handleRoute
  };
}
