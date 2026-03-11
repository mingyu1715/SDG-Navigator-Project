const CARD_DATA = [
  { name: "fermin guerrero", sub: "uruguay" },
  { name: "kike farias", sub: "brazil" },
  { name: "homa delvaray", sub: "iran" },
  { name: "victor soma", sub: "poland" },
  { name: "hellepanos", sub: "greece" },
  { name: "kouglof", sub: "france" },
  { name: "ryan volt", sub: "canada" },
  { name: "mira tan", sub: "singapore" }
];

const stage = document.getElementById("stage");
const cardsLayer = document.getElementById("cardsLayer");
const arc = document.getElementById("arc");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const state = {
  rotation: 0,
  suppressClick: false
};

const config = {
  cardHeightRatio: 0.315,
  cardAspectRatio: 250 / 360,
  radiusRatio: 1.10,
  centerYRatio: 1.72,
  centerX: () => window.innerWidth * 0.5,
  baseStart: -72,
  gap: 360 / 46,
  focusAngle: 0,
  centerSnapThreshold: 0.8,
  snapDurationMs: 680,
  inertiaSnapDurationMs: 560,
  dragSensitivity: 0.18,
  moveThreshold: 6
};

const layout = {
  scale: 1,
  cardWidth: 437,
  cardHeight: 663,
  centerX: 0,
  centerY: 0,
  radius: 0
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

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

function updateLayout() {
  layout.scale = window.innerHeight / 1920;
  layout.cardHeight = window.innerHeight * config.cardHeightRatio;
  layout.cardWidth = layout.cardHeight * config.cardAspectRatio;
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

const ringSlots = 46;

const items = Array.from({ length: ringSlots }, (_, index) => {
  const person = CARD_DATA[mod(index, CARD_DATA.length)];
  const baseAngle = config.baseStart + index * config.gap;

  const el = document.createElement("button");
  el.className = "card-item";
  el.type = "button";
  el.dataset.index = String(index);
  el.dataset.baseAngle = String(baseAngle);
  el.setAttribute("aria-label", `${person.name}, ${person.sub}`);

  const card = document.createElement("div");
  card.className = "card";

  const label = document.createElement("div");
  label.className = "label";
  label.innerHTML = `<strong>${person.name}</strong><span>${person.sub}</span>`;

  el.appendChild(card);
  el.appendChild(label);
  cardsLayer.appendChild(el);

  return { el, label, baseAngle, index };
});

function stopInertia() {
  if (drag.rafId !== null) {
    cancelAnimationFrame(drag.rafId);
    drag.rafId = null;
  }
}

function focusCard(item) {
  stopInertia();
  stopTween();

  const diff = normalizeAngle(item.baseAngle + state.rotation - config.focusAngle);
  if (Math.abs(diff) <= config.centerSnapThreshold) {
    return;
  }

  animateRotationTo(state.rotation - diff, config.snapDurationMs);
}

items.forEach((item) => {
  item.el.addEventListener("click", (event) => {
    if (state.suppressClick) {
      event.preventDefault();
      return;
    }
    event.stopPropagation();
    focusCard(item);
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

    const easedDepth = Math.pow(depthFactor, 1.22);
    const scale = 0.76 + easedDepth * 0.26;
    const opacity = 0.50 + depthFactor * 0.50;
    const depthRank = Math.round(depthFactor * 10000);
    const zIndex = depthRank * 100 + (ringSlots - item.index);

    const tx = x - layout.cardWidth / 2;
    const ty = y - layout.cardHeight / 2;

    item.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${angleDeg}deg) scale(${scale})`;
    item.el.style.opacity = String(opacity);
    item.el.style.zIndex = String(zIndex);
    item.el.style.pointerEvents = "auto";

    item.label.style.transform = `translateX(-50%) rotate(${-angleDeg}deg)`;
  });
}

function snapToClosestCard() {
  const currentRotation = state.rotation;
  let closestDiff = Infinity;
  let targetRotation = currentRotation;

  items.forEach((item) => {
    const diff = normalizeAngle(item.baseAngle + currentRotation - config.focusAngle);
    const absDiff = Math.abs(diff);
    if (absDiff < closestDiff) {
      closestDiff = absDiff;
      targetRotation = currentRotation - diff;
    }
  });

  animateRotationTo(targetRotation, config.inertiaSnapDurationMs);
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

function startInertia() {
  stopInertia();
  const decay = 0.92;
  const minSpeed = 0.005;

  function tick() {
    drag.velocityDeg *= decay;

    if (Math.abs(drag.velocityDeg) < minSpeed) {
      stopInertia();
      snapToClosestCard();
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
  if (state.suppressClick) {
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

updateLayout();
render();
window.addEventListener("resize", () => {
  updateLayout();
  render();
});
