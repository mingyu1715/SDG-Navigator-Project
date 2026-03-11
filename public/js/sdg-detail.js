function getGoalIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  return Number.isInteger(id) && id > 0 ? id : 1;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderGoal(goal) {
  setText("goalTitle", `SDG ${goal.id}. ${goal.title}`);
  setText("goalSub", goal.subtitle);
  setText("goalDesc", goal.description);

  const badge = document.getElementById("goalBadge");
  badge.textContent = goal.id;
  badge.style.background = goal.color;

  const features = document.getElementById("goalFeatures");
  features.innerHTML = "";
  goal.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    features.appendChild(li);
  });

  setText("backendStatus", "API 연결 완료");
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

async function bootstrap() {
  const goalId = getGoalIdFromQuery();

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/";
  });

  document.getElementById("simulateBtn").addEventListener("click", async () => {
    const statusEl = document.getElementById("backendStatus");
    statusEl.textContent = "샘플 액션 호출 중...";

    try {
      const result = await callSampleAction(goalId);
      statusEl.textContent = `샘플 액션 성공: ${result.message}`;
    } catch (error) {
      statusEl.textContent = `샘플 액션 실패: ${error.message}`;
    }
  });

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
}

bootstrap();
