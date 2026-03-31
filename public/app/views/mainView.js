import { SDG_DATA } from "../data/sdgs.js";

const BLACK_FILLER = { id: 0, color: "#111111", title: "", sub: "", detailed: "", isFiller: true };

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

export class MainView {
  constructor(root, options = {}) {
    this.root = root;
    this.cardsLayer = root.querySelector("#cardsLayer");
    this.arc = root.querySelector("#arc");
    this.onSelect = options.onSelect || (() => {});
    this.onFullscreen = options.onFullscreen || (() => {});

    this.state = {
      rotation: 0,
      suppressClick: false
    };

    this.config = {
      cardWidth: 250,
      cardHeight: 360,
      radiusRatio: 1.28,
      centerYRatio: 1.9,
      centerX: () => window.innerWidth * 0.5,
      baseStart: -72,
      gap: 360 / 44,
      focusAngle: 0,
      centerSnapThreshold: 0.8,
      snapDurationMs: 680,
      inertiaSnapDurationMs: 560,
      dragSensitivity: 0.105,
      moveThreshold: 6,
      introGoalId: 9,
      introSpinTurns: 2,
      introDurationMs: 1500
    };

    this.layout = {
      scale: 1,
      cardWidth: 230,
      cardHeight: 332,
      centerX: 0,
      centerY: 0,
      radius: 0
    };

    this.drag = {
      pointerId: null,
      isDown: false,
      moved: false,
      startX: 0,
      lastX: 0,
      lastT: 0,
      velocityDeg: 0,
      rafId: null
    };

    this.tweenRafId = null;
    this.items = [];
    this.isIntroPlaying = false;
  }

  mount() {
    this.buildCards();
    this.bindEvents();
    this.updateLayout();
    this.render();
  }

  playIntroToGoal(goalId = this.config.introGoalId) {
    if (this.isIntroPlaying) return;
    const item = this.items.find((entry) => !entry.isFiller && entry.goalId === Number(goalId));
    if (!item) return;

    this.stopTween();
    this.stopInertia();
    this.state.suppressClick = true;
    this.isIntroPlaying = true;

    const diff = normalizeAngle(item.baseAngle + this.state.rotation - this.config.focusAngle);
    const settleRotation = this.state.rotation - diff;
    const targetRotation = settleRotation + this.config.introSpinTurns * 360;

    this.animateRotationTo(targetRotation, this.config.introDurationMs, () => {
      this.state.rotation = normalizeAngle(this.state.rotation);
      this.state.suppressClick = false;
      this.isIntroPlaying = false;
      this.render();
    });
  }

  bindEvents() {
    this.root.addEventListener("pointerdown", (event) => {
      if (this.isIntroPlaying) return;
      if (event.button !== 0) return;

      this.drag.pointerId = event.pointerId;
      this.drag.isDown = true;
      this.drag.moved = false;
      this.drag.startX = event.clientX;
      this.drag.lastX = event.clientX;
      this.drag.lastT = performance.now();
      this.drag.velocityDeg = 0;
      this.state.suppressClick = false;
      this.stopTween();
      this.stopInertia();
    });

    this.root.addEventListener("pointermove", (event) => {
      if (!this.drag.isDown || event.pointerId !== this.drag.pointerId) return;

      const dx = event.clientX - this.drag.lastX;
      const now = performance.now();
      const dt = Math.max(now - this.drag.lastT, 1);
      if (Math.abs(event.clientX - this.drag.startX) > this.config.moveThreshold || this.drag.moved) {
        this.drag.moved = true;
        this.state.suppressClick = true;
      }

      this.state.rotation += dx * this.config.dragSensitivity;
      this.drag.lastX = event.clientX;
      this.drag.lastT = now;
      this.drag.velocityDeg = (dx * this.config.dragSensitivity) / dt;
      this.render();
    });

    const finishPointer = (event) => {
      if (!this.drag.isDown || event.pointerId !== this.drag.pointerId) return;
      this.drag.isDown = false;
      if (this.drag.moved) {
        this.startInertia();
      }
      setTimeout(() => {
        this.state.suppressClick = false;
      }, 0);
    };

    this.root.addEventListener("pointerup", finishPointer);
    this.root.addEventListener("pointercancel", finishPointer);

    window.addEventListener("resize", () => {
      this.updateLayout();
      this.render();
    });

    const fullscreenBtn = this.root.querySelector("#mainFullscreenBtn");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => this.onFullscreen());
    }
  }

  buildCards() {
    const ringSlots = 44;
    const sequence = [
      ...SDG_DATA,
      ...Array.from({ length: 5 }, () => BLACK_FILLER),
      ...SDG_DATA,
      ...Array.from({ length: 5 }, () => BLACK_FILLER)
    ];

    this.items = Array.from({ length: ringSlots }, (_, index) => {
      const itemData = sequence[index];
      const isFiller = Boolean(itemData.isFiller);
      const baseAngle = this.config.baseStart + index * this.config.gap;

      const el = document.createElement("button");
      el.className = "card-item";
      el.type = "button";
      el.dataset.index = String(index);
      el.dataset.baseAngle = String(baseAngle);
      el.dataset.goalId = String(itemData.id);

      const card = document.createElement("div");
      card.className = "card";
      card.style.setProperty("--card", itemData.color);
      if (isFiller) card.classList.add("filler-card");
      const titleStyle = itemData.titleSize ? ` style=\"font-size:${itemData.titleSize}px\"` : "";
      card.innerHTML = isFiller
        ? ""
        : `
          <p class="goal-no">${String(itemData.id).padStart(2, "0")}</p>
          <h1 class="goal-title"${titleStyle}>${itemData.title}</h1>
          <p class="goal-sub">${itemData.sub}</p>
          <p class="desc">${itemData.detailed}</p>
          <div class="meta"><span>SDG NAVIGATOR</span><span>TEXT EDITION</span></div>
        `;

      el.appendChild(card);
      this.cardsLayer.appendChild(el);

      el.addEventListener("click", (event) => {
        if (this.isIntroPlaying) {
          event.preventDefault();
          return;
        }
        if (this.state.suppressClick) {
          event.preventDefault();
          return;
        }
        if (isFiller) return;
        this.focusCardAndSelect({ el, baseAngle, isFiller, goalId: itemData.id });
      });

      return { el, baseAngle, isFiller, goalId: itemData.id };
    });
  }

  focusCardAndSelect(item) {
    this.stopTween();
    const diff = normalizeAngle(item.baseAngle + this.state.rotation - this.config.focusAngle);

    if (Math.abs(diff) <= this.config.centerSnapThreshold) {
      this.onSelect(item.goalId, item.el);
      return;
    }

    this.animateRotationTo(this.state.rotation - diff, this.config.snapDurationMs, () => {
      this.onSelect(item.goalId, item.el);
    });
  }

  getCardRect(goalId) {
    const item = this.items.find((entry) => !entry.isFiller && entry.goalId === Number(goalId));
    if (!item) return null;
    return item.el.getBoundingClientRect();
  }

  getCenterCardRect() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    let bestRect = null;
    let bestDist = Number.POSITIVE_INFINITY;

    this.items.forEach((item) => {
      if (item.isFiller) return;
      const rect = item.el.getBoundingClientRect();
      const mx = rect.left + rect.width / 2;
      const my = rect.top + rect.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);
      if (dist < bestDist) {
        bestDist = dist;
        bestRect = rect;
      }
    });

    return bestRect;
  }

  focusGoal(goalId, options = {}) {
    const { animate = false } = options;
    const item = this.items.find((entry) => !entry.isFiller && entry.goalId === Number(goalId));
    if (!item) return;

    const diff = normalizeAngle(item.baseAngle + this.state.rotation - this.config.focusAngle);
    if (Math.abs(diff) <= this.config.centerSnapThreshold) return;

    if (animate) {
      this.animateRotationTo(this.state.rotation - diff, this.config.snapDurationMs);
    } else {
      this.state.rotation -= diff;
      this.render();
    }
  }

  stopTween() {
    if (this.tweenRafId !== null) {
      cancelAnimationFrame(this.tweenRafId);
      this.tweenRafId = null;
    }
  }

  stopInertia() {
    if (this.drag.rafId !== null) {
      cancelAnimationFrame(this.drag.rafId);
      this.drag.rafId = null;
    }
  }

  startInertia() {
    this.stopInertia();
    const decay = 0.88;
    const minSpeed = 0.004;

    const tick = () => {
      this.drag.velocityDeg *= decay;
      if (Math.abs(this.drag.velocityDeg) < minSpeed) {
        this.stopInertia();
        return;
      }

      this.state.rotation += this.drag.velocityDeg * 16;
      this.render();
      this.drag.rafId = requestAnimationFrame(tick);
    };

    this.drag.rafId = requestAnimationFrame(tick);
  }

  animateRotationTo(targetRotation, durationMs, onComplete) {
    this.stopTween();
    const startRotation = this.state.rotation;
    const diff = targetRotation - startRotation;
    const start = performance.now();

    const tick = (now) => {
      const t = clamp((now - start) / durationMs, 0, 1);
      const eased = easeOutCubic(t);
      this.state.rotation = startRotation + diff * eased;
      this.render();

      if (t < 1) {
        this.tweenRafId = requestAnimationFrame(tick);
        return;
      }

      this.tweenRafId = null;
      if (onComplete) onComplete();
    };

    this.tweenRafId = requestAnimationFrame(tick);
  }

  updateLayout() {
    this.layout.scale = window.innerHeight / 1920;
    this.layout.cardWidth = this.config.cardWidth;
    this.layout.cardHeight = this.config.cardHeight;
    this.layout.centerX = this.config.centerX();
    this.layout.radius = window.innerHeight * this.config.radiusRatio;
    this.layout.centerY = window.innerHeight * this.config.centerYRatio;

    this.root.style.setProperty("--card-w", `${this.layout.cardWidth}px`);
    this.root.style.setProperty("--card-h", `${this.layout.cardHeight}px`);
    this.root.style.setProperty("--arc-center-x", `${this.layout.centerX}px`);
    this.root.style.setProperty("--arc-center-y", `${this.layout.centerY}px`);
    this.root.style.setProperty("--arc-size", `${this.layout.radius * 2}px`);
    this.root.style.setProperty("--arc-border", `${Math.max(2, 4 * this.layout.scale)}px`);

    this.arc.style.display = "block";
  }

  render() {
    const cx = this.layout.centerX;
    const cy = this.layout.centerY;
    const radius = this.layout.radius;

    this.items.forEach((item, idx) => {
      const angleDeg = item.baseAngle + this.state.rotation;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = cx + Math.sin(angleRad) * radius;
      const y = cy - Math.cos(angleRad) * radius;

      const focusDiff = normalizeAngle(angleDeg - this.config.focusAngle);
      const depthFactor = 1 - clamp(Math.abs(focusDiff) / 120, 0, 1);
      const easedDepth = Math.pow(depthFactor, 1.42);
      const scale = 0.56 + easedDepth * 0.38;
      const zIndex = Math.round(depthFactor * 10000) * 100 + (44 - idx);

      const tx = x - this.layout.cardWidth / 2;
      const ty = y - this.layout.cardHeight / 2;

      item.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${angleDeg}deg) scale(${scale})`;
      item.el.style.opacity = "1";
      item.el.style.zIndex = String(zIndex);
    });
  }
}
