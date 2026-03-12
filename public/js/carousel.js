const SDG_DATA = [
  { id: 1, color: "#E5243B", title: "NO POVERTY", sub: "빈곤 퇴치", detailed: "취약계층 기본생활 보장과 안전망 강화로 빈곤의 악순환을 줄입니다." },
  { id: 2, color: "#DDA63A", title: "ZERO HUNGER", sub: "기아 종식", detailed: "안정적 식량 접근성과 영양 개선으로 기아와 영양 불균형을 해소합니다." },
  { id: 3, color: "#4C9F38", title: "GOOD HEALTH", sub: "건강과 웰빙", detailed: "예방 중심 보건체계와 의료 접근성 개선으로 건강한 삶을 지원합니다." },
  { id: 4, color: "#C5192D", title: "QUALITY EDUCATION", sub: "양질의 교육", detailed: "포용적 교육 기회 확대를 통해 학습격차를 줄이고 역량을 강화합니다.", titleSize: 27 },
  { id: 5, color: "#FF3A21", title: "GENDER EQUALITY", sub: "성평등", detailed: "성별 차별과 폭력 감소를 통해 동등한 기회와 권리를 보장합니다.", titleSize: 28 },
  { id: 6, color: "#26BDE2", title: "CLEAN WATER", sub: "깨끗한 물", detailed: "안전한 식수와 위생 환경 확보로 지속가능한 생활 기반을 만듭니다." },
  { id: 7, color: "#FCC30B", title: "CLEAN ENERGY", sub: "에너지", detailed: "재생에너지 확대와 효율 개선으로 모두를 위한 에너지 전환을 촉진합니다." },
  { id: 8, color: "#A21942", title: "DECENT WORK", sub: "양질의 일자리", detailed: "안전하고 공정한 노동환경을 통해 지속가능한 성장과 고용을 만듭니다." },
  { id: 9, color: "#FD6925", title: "INDUSTRY INNOVATION", sub: "산업과 혁신", detailed: "회복력 있는 인프라와 기술 혁신으로 미래 경쟁력을 강화합니다.", titleSize: 24 },
  { id: 10, color: "#DD1367", title: "REDUCED INEQUALITIES", sub: "불평등 완화", detailed: "소득과 기회 격차를 줄여 사회 참여의 공정성을 높입니다.", titleSize: 23 },
  { id: 11, color: "#FD9D24", title: "SUSTAINABLE CITIES", sub: "지속가능 도시", detailed: "주거·교통·환경 개선을 통해 포용적이고 안전한 도시를 구축합니다.", titleSize: 22 },
  { id: 12, color: "#BF8B2E", title: "RESPONSIBLE CONSUMPTION", sub: "책임 소비", detailed: "자원 순환과 폐기물 감축으로 지속가능한 소비·생산 체계를 확산합니다.", titleSize: 20 },
  { id: 13, color: "#3F7E44", title: "CLIMATE ACTION", sub: "기후 행동", detailed: "감축과 적응 전략을 강화해 기후위기에 대한 회복력을 높입니다." },
  { id: 14, color: "#0A97D9", title: "LIFE BELOW WATER", sub: "해양 생태", detailed: "해양 오염을 줄이고 바다 생태계를 보호해 지속가능성을 확보합니다.", titleSize: 24 },
  { id: 15, color: "#56C02B", title: "LIFE ON LAND", sub: "육상 생태", detailed: "산림·토양·생물다양성 보호와 복원으로 육상 생태를 지킵니다." },
  { id: 16, color: "#00689D", title: "PEACE JUSTICE", sub: "평화와 제도", detailed: "투명하고 책임 있는 제도 구축으로 사회 신뢰를 높입니다.", titleSize: 25 },
  { id: 17, color: "#19486A", title: "PARTNERSHIPS", sub: "협력", detailed: "정부·기업·시민사회 협력을 통해 목표 이행 역량을 확장합니다.", titleSize: 21 }
];

const BLACK_FILLER = { id: 0, color: "#111111", title: "", sub: "", detailed: "", isFiller: true };

const stage = document.getElementById("stage");
const cardsLayer = document.getElementById("cardsLayer");
const arc = document.getElementById("arc");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const state = {
  rotation: 0,
  suppressClick: false
};
const ROTATION_COOKIE_NAME = "sdgCarouselRotation";

const config = {
  cardWidth: 230,
  cardHeight: 332,
  radiusRatio: 1.28,
  centerYRatio: 1.90,
  centerX: () => window.innerWidth * 0.5,
  baseStart: -72,
  gap: 360 / 44,
  focusAngle: 0,
  centerSnapThreshold: 0.8,
  snapDurationMs: 680,
  inertiaSnapDurationMs: 560,
  dragSensitivity: 0.105,
  moveThreshold: 6
};

const layout = {
  scale: 1,
  cardWidth: 230,
  cardHeight: 332,
  centerX: 0,
  centerY: 0,
  radius: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(deg) {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

let tweenRafId = null;
function stopTween() {
  if (tweenRafId !== null) {
    cancelAnimationFrame(tweenRafId);
    tweenRafId = null;
  }
}

function animateRotationTo(targetRotation, durationMs, onComplete) {
  stopTween();
  const startRotation = state.rotation;
  const diff = targetRotation - startRotation;
  const start = performance.now();

  function tick(now) {
    const t = clamp((now - start) / durationMs, 0, 1);
    const eased = easeOutCubic(t);
    state.rotation = startRotation + diff * eased;
    render();

    if (t < 1) {
      tweenRafId = requestAnimationFrame(tick);
      return;
    }

    tweenRafId = null;
    if (onComplete) onComplete();
  }

  tweenRafId = requestAnimationFrame(tick);
}

function persistRotation() {
  const value = encodeURIComponent(state.rotation.toFixed(4));
  document.cookie = `${ROTATION_COOKIE_NAME}=${value}; Path=/; Max-Age=86400; SameSite=Lax`;
}

function restoreRotation() {
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const found = cookies.find((row) => row.startsWith(`${ROTATION_COOKIE_NAME}=`));
  if (!found) return;
  const value = Number(decodeURIComponent(found.split("=")[1]));
  if (Number.isFinite(value)) {
    state.rotation = value;
  }
}

function updateLayout() {
  layout.scale = window.innerHeight / 1920;
  layout.cardWidth = config.cardWidth;
  layout.cardHeight = config.cardHeight;
  layout.centerX = config.centerX();
  layout.radius = window.innerHeight * config.radiusRatio;
  layout.centerY = window.innerHeight * config.centerYRatio;

  stage.style.setProperty("--card-w", `${layout.cardWidth}px`);
  stage.style.setProperty("--card-h", `${layout.cardHeight}px`);
  stage.style.setProperty("--label-top", `${-74 * layout.scale}px`);
  stage.style.setProperty("--label-size", `${13 * layout.scale}px`);
  stage.style.setProperty("--label-title-size", `${32 * layout.scale}px`);
  stage.style.setProperty("--arc-center-x", `${layout.centerX}px`);
  stage.style.setProperty("--arc-center-y", `${layout.centerY}px`);
  stage.style.setProperty("--arc-size", `${layout.radius * 2}px`);
  stage.style.setProperty("--arc-border", `${Math.max(2, 4 * layout.scale)}px`);

  arc.style.display = "block";
}

const ringSlots = 44;
const sequence = [
  ...SDG_DATA,
  ...Array.from({ length: 5 }, () => BLACK_FILLER),
  ...SDG_DATA,
  ...Array.from({ length: 5 }, () => BLACK_FILLER)
];

const items = Array.from({ length: ringSlots }, (_, index) => {
  const itemData = sequence[index];
  const isFiller = Boolean(itemData.isFiller);
  const baseAngle = config.baseStart + index * config.gap;

  const el = document.createElement("button");
  el.className = "card-item";
  el.type = "button";
  el.dataset.index = String(index);
  el.dataset.baseAngle = String(baseAngle);
  el.dataset.goalId = String(itemData.id);
  el.setAttribute("aria-label", isFiller ? "black filler card" : `${itemData.id} ${itemData.title}`);

  const card = document.createElement("div");
  card.className = "card";
  card.style.setProperty("--card", itemData.color);
  if (isFiller) card.classList.add("filler-card");
  const titleStyle = itemData.titleSize ? ` style="font-size:${itemData.titleSize}px"` : "";
  card.innerHTML = isFiller ? "" : `
    <p class="goal-no">${String(itemData.id).padStart(2, "0")}</p>
    <h1 class="goal-title"${titleStyle}>${itemData.title}</h1>
    <p class="goal-sub">${itemData.sub}</p>
    <p class="desc">${itemData.detailed}</p>
    <div class="meta">
      <span>SDG NAVIGATOR</span>
      <span>TEXT EDITION</span>
    </div>
  `;

  const label = document.createElement("div");
  label.className = "label";
  label.innerHTML = "";

  el.appendChild(card);
  el.appendChild(label);
  cardsLayer.appendChild(el);

  return { el, label, baseAngle, index, isFiller, goalId: itemData.id };
});

function focusCard(item) {
  stopTween();

  const diff = normalizeAngle(item.baseAngle + state.rotation - config.focusAngle);
  if (Math.abs(diff) <= config.centerSnapThreshold) {
    return;
  }

  animateRotationTo(state.rotation - diff, config.snapDurationMs);
}

function openDetail(goalId) {
  persistRotation();
  window.location.href = `/sdg.html?id=${goalId}`;
}

function focusCardAndOpenDetail(item) {
  stopTween();
  const diff = normalizeAngle(item.baseAngle + state.rotation - config.focusAngle);

  if (Math.abs(diff) <= config.centerSnapThreshold) {
    openDetail(item.goalId);
    return;
  }

  animateRotationTo(state.rotation - diff, config.snapDurationMs, () => {
    openDetail(item.goalId);
  });
}


items.forEach((item) => {
  item.el.addEventListener("click", (event) => {
    if (state.suppressClick) {
      event.preventDefault();
      return;
    }
    event.stopPropagation();
    if (item.isFiller) return;
    focusCardAndOpenDetail(item);
  });
});

function render() {
  const cx = layout.centerX;
  const cy = layout.centerY;
  const radius = layout.radius;

  items.forEach((item) => {
    const angleDeg = item.baseAngle + state.rotation;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + Math.sin(angleRad) * radius;
    const y = cy - Math.cos(angleRad) * radius;

    const focusDiff = normalizeAngle(angleDeg - config.focusAngle);
    const depthFactor = 1 - clamp(Math.abs(focusDiff) / 120, 0, 1);

    const easedDepth = Math.pow(depthFactor, 1.42);
    const scale = 0.56 + easedDepth * 0.38;
    const opacity = 1;
    const depthRank = Math.round(depthFactor * 10000);
    const zIndex = depthRank * 100 + (ringSlots - item.index);

    const tx = x - layout.cardWidth / 2;
    const ty = y - layout.cardHeight / 2;

    item.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${angleDeg}deg) scale(${scale})`;
    item.el.style.opacity = String(opacity);
    item.el.style.zIndex = String(zIndex);
    item.el.style.pointerEvents = "auto";
    item.el.style.filter = "none";

  });
  persistRotation();
}

const drag = {
  pointerId: null,
  isDown: false,
  moved: false,
  startX: 0,
  lastX: 0,
  lastT: 0,
  velocityDeg: 0,
  rafId: null
};

function stopInertia() {
  if (drag.rafId !== null) {
    cancelAnimationFrame(drag.rafId);
    drag.rafId = null;
  }
}

function startInertia() {
  stopInertia();
  const decay = 0.88;
  const minSpeed = 0.004;

  function tick() {
    drag.velocityDeg *= decay;
    if (Math.abs(drag.velocityDeg) < minSpeed) {
      stopInertia();
      return;
    }

    state.rotation += drag.velocityDeg * 16;
    render();
    drag.rafId = requestAnimationFrame(tick);
  }

  drag.rafId = requestAnimationFrame(tick);
}

stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;

  drag.pointerId = event.pointerId;
  drag.isDown = true;
  drag.moved = false;
  drag.startX = event.clientX;
  drag.lastX = event.clientX;
  drag.lastT = performance.now();
  drag.velocityDeg = 0;
  state.suppressClick = false;
  stopInertia();
  stopTween();
});

stage.addEventListener("pointermove", (event) => {
  if (!drag.isDown || event.pointerId !== drag.pointerId) return;

  const now = performance.now();
  const dt = Math.max(now - drag.lastT, 1);
  const dx = event.clientX - drag.lastX;

  if (Math.abs(event.clientX - drag.startX) > config.moveThreshold || drag.moved) {
    drag.moved = true;
    state.suppressClick = true;
  }

  state.rotation += dx * config.dragSensitivity;
  drag.velocityDeg = (dx * config.dragSensitivity) / dt;
  drag.lastX = event.clientX;
  drag.lastT = now;

  render();
});

function finishPointer(event) {
  if (!drag.isDown || event.pointerId !== drag.pointerId) return;

  drag.isDown = false;
  if (drag.moved) {
    startInertia();
  }

  setTimeout(() => {
    state.suppressClick = false;
  }, 0);
}

stage.addEventListener("pointerup", finishPointer);
stage.addEventListener("pointercancel", finishPointer);

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // fullscreen permission can be denied by browser policy/user gesture restrictions
    }
  });
}

restoreRotation();
updateLayout();
render();
window.addEventListener("resize", () => {
  updateLayout();
  render();
});
