export function withTimeout(promise, timeoutMs) {
  return Promise.race([
    Promise.resolve(promise).catch(() => null),
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))
  ]);
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function scheduleBackgroundTask(task) {
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

export function createDetailWarmupController({
  goalIds,
  goalCount,
  preloadRequestTimeoutMs,
  detailWarmRenderPasses,
  maxDetailRenderWarmCalls,
  preloadCustomDetailRenderer
}) {
  let bootPreloadStarted = false;
  let detailRenderWarmCalls = 0;
  const warmedDetailGoalIds = new Set();

  function getBootPreloadTargets() {
    return goalIds.map((goalId) => `/api/sdgs/${goalId}`);
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
        fetchWithTimeout(url, preloadRequestTimeoutMs)
          .catch(() => null)
      )
    );
  }

  async function warmDetailNetworkCache(goalId) {
    const id = Number(goalId);
    if (!Number.isFinite(id) || id <= 0) return;
    if (id > goalCount) return;
    if (warmedDetailGoalIds.has(id)) return;
    warmedDetailGoalIds.add(id);

    if (await preloadCustomDetailRenderer(id)) {
      return;
    }

    await fetchWithTimeout(`/api/sdgs/${id}`, preloadRequestTimeoutMs).catch(() => null);
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
      if (value < 1 || value > goalCount) return;
      unique.add(value);
    });
    return Array.from(unique);
  }

  async function warmDetailRenderPath() {
    if (detailRenderWarmCalls >= maxDetailRenderWarmCalls) return;
    detailRenderWarmCalls += 1;

    await nextFrame();

    // Warm up JIT on tiny math workload before heavier interactive scripts run.
    let warmAcc = 0;
    for (let pass = 0; pass < detailWarmRenderPasses; pass += 1) {
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
      for (let pass = 0; pass < detailWarmRenderPasses; pass += 1) {
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

  return {
    preloadOnBoot,
    runDetailWarmups
  };
}
