function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

const RETURN_RECT_SESSION_KEY = "sdgReturnCardRect";
const MAIN_HISTORY_URL = "/";

let currentGoalData = null;
let returningToMain = false;

function renderGoal(goal) {
  currentGoalData = goal;
  setText("goalTitle", `SDG ${String(goal.id).padStart(2, "0")}. ${goal.title}`);
  setText("goalSub", goal.subtitle);
  setText("goalDesc", goal.description);

  const label = document.getElementById("goalLabel");
  if (label) {
    label.textContent = `SDG GOAL ${String(goal.id).padStart(2, "0")}`;
  }

  const badge = document.getElementById("goalBadge");
  if (badge) {
    badge.textContent = goal.id;
    badge.style.background = goal.color;
  }

  const features = document.getElementById("goalFeatures");
  if (features) {
    features.innerHTML = "";
    goal.features.forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      features.appendChild(li);
    });
  }

  setText("backendStatus", "API 연결 완료");
}

function buildDetailHistoryPath(goalId) {
  return `/detailed/sdg-${String(goalId).padStart(2, "0")}/`;
}

function applyDetailHistoryRouting(goalId) {
  const expectedPath = buildDetailHistoryPath(goalId);
  if (window.location.pathname !== expectedPath) {
    history.replaceState(history.state || {}, "", expectedPath);
  }
  return true;
}

async function loadGoal(goalId) {
  const res = await fetch(`/api/sdgs/${goalId}`);
  if (!res.ok) {
    throw new Error(`Failed to load goal: ${res.status}`);
  }
  return res.json();
}

async function markVisit(goalId) {
  const res = await fetch(`/api/sdgs/${goalId}/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "detail-page" })
  });
  if (!res.ok) {
    throw new Error(`Failed to mark visit: ${res.status}`);
  }
  return res.json();
}

async function callSampleAction(goalId) {
  const res = await fetch(`/api/sdgs/${goalId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "demo-run" })
  });
  if (!res.ok) {
    throw new Error(`Action failed: ${res.status}`);
  }
  return res.json();
}

async function navigateToMainWithReverse(goalId) {
  if (returningToMain) return;
  returningToMain = true;

  const page = document.body;
  if (!page || !("animate" in page)) {
    window.location.href = "/index.html";
    return;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let targetLeft = (vw - Math.min(250, vw * 0.58)) / 2;
  let targetTop = (vh - Math.min(250, vw * 0.58) * (36 / 25)) / 2;
  let targetWidth = Math.min(250, vw * 0.58);
  let targetHeight = targetWidth * (36 / 25);

  try {
    const saved = JSON.parse(sessionStorage.getItem(RETURN_RECT_SESSION_KEY) || "null");
    if (saved && Number(saved.goalId) === Number(goalId)) {
      targetLeft = saved.left * vw;
      targetTop = saved.top * vh;
      targetWidth = saved.width * vw;
      targetHeight = saved.height * vh;
    }
  } catch {
    // keep fallback target
  }

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  page.style.position = "relative";
  page.style.zIndex = "9999";
  page.style.willChange = "transform, clip-path, filter";

  const targetScale = Math.min(targetWidth / vw, targetHeight / vh);
  const targetCenterX = targetLeft + targetWidth / 2;
  const targetCenterY = targetTop + targetHeight / 2;
  const dx = targetCenterX - vw / 2;
  const dy = targetCenterY - vh / 2;
  const insetTop = Math.max(0, targetTop);
  const insetRight = Math.max(0, vw - (targetLeft + targetWidth));
  const insetBottom = Math.max(0, vh - (targetTop + targetHeight));
  const insetLeft = Math.max(0, targetLeft);

  const shrink = page.animate(
    [
      {
        transformOrigin: "50% 50%",
        transform: "translate3d(0, 0, 0) scale(1)",
        clipPath: "inset(0px 0px 0px 0px round 0px)",
        filter: "brightness(1)"
      },
      {
        transformOrigin: "50% 50%",
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${targetScale})`,
        clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 14px)`,
        filter: "brightness(0.96)"
      }
    ],
    { duration: 980, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
  );

  await shrink.finished.catch(() => null);
  window.location.href = "/index.html";
}

function initDetailPage(goalId) {
  if (!applyDetailHistoryRouting(goalId)) return;

  const backBtn = document.getElementById("backBtn");
  const simulateBtn = document.getElementById("simulateBtn");

  if (backBtn) {
    backBtn.addEventListener("click", (event) => {
      event.preventDefault();
      void navigateToMainWithReverse(goalId);
    });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener("click", async () => {
      const statusEl = document.getElementById("backendStatus");
      if (statusEl) statusEl.textContent = "샘플 액션 호출 중...";

      try {
        const result = await callSampleAction(goalId);
        if (statusEl) statusEl.textContent = `샘플 액션 성공: ${result.message}`;
      } catch (error) {
        if (statusEl) statusEl.textContent = `샘플 액션 실패: ${error.message}`;
      }
    });
  }

  (async () => {
    try {
      const goal = await loadGoal(goalId);
      renderGoal(goal);

      const visit = await markVisit(goalId);
      setText("visitMeta", `이 목표 상세 페이지 방문 수: ${visit.visits}`);
    } catch (error) {
      setText("goalTitle", "데이터를 불러오지 못했습니다.");
      setText("goalSub", "요청한 목표 정보를 확인해 주세요.");
      setText("goalDesc", "백엔드 응답이 없거나 유효하지 않습니다.");
      setText("backendStatus", `에러: ${error.message}`);
    }
  })();
}
