import { escapeHtml, loadJsonData, toggleDetailViewClass } from "./sharedRuntime.js";

const DEFAULT_INGREDIENTS = [
  {
    id: "spoiled-apple",
    key: "apple",
    name: "사과",
    count: 2,
    emoji: "🍎"
  },
  {
    id: "opened-milk",
    key: "milk",
    name: "우유",
    count: 1,
    emoji: "🥛"
  },
  {
    id: "stale-bread",
    key: "bread",
    name: "빵",
    count: 1,
    emoji: "🍞"
  },
  {
    id: "leftover-meat",
    key: "meat",
    name: "고기",
    count: 1,
    emoji: "🥩"
  }
];

const DEFAULT_IMPACT_RULES = {
  waterPerUnitL: {
    apple: 70,
    milk: 255,
    bread: 40,
    meat: 1540
  },
  priceKrw: {
    apple: 1500,
    milk: 2800,
    bread: 3200,
    meat: 4800
  },
  avgUnitWeightKg: {
    apple: 0.18,
    milk: 1.0,
    bread: 0.45,
    meat: 0.28
  },
  mealCostKrw: 600,
  co2eKgPerKgWaste: 2.5,
  methaneMultiplier: 25,
  drinkPerPersonLPerDay: 2
};

const DEFAULT_COPY = {
  headline: "잊혀진 냉장고의 복수",
  introLead: "당신이 버리는 음식, 지구는 기억합니다",
  introCue: "냉장고를 클릭하세요",
  openButton: "냉장고 열기",
  selectTitle: "오늘 버릴 음식을 선택하세요",
  selectLead: "냉장고 속 유통기한이 지난 음식들",
  selectCtaReady: "버리기",
  selectCtaIdle: "음식을 선택하세요",
  selectedCountTemplate: "{count}개 선택됨",
  reportTitle: "당신이 버린 것들",
  reportMessage: "전 세계에서 생산되는 음식의 1/3이 버려집니다. 작은 변화가 지구를 지킵니다.",
  retryButton: "다시 해보기",
  resourcesTitle: "관련 자료",
  resourcesLead: "체험 수치를 실제 데이터와 연결해 보세요.",
  resources: [
    {
      type: "DATA",
      title: "Water Footprint Network",
      description: "식재료별 물 사용량을 확인할 수 있는 데이터베이스",
      url: "https://www.waterfootprint.org/"
    },
    {
      type: "REPORT",
      title: "UNEP Food Waste Index",
      description: "전 세계 음식물 폐기량과 환경 영향 보고서",
      url: "https://www.unep.org/resources/report/unep-food-waste-index-report-2024"
    },
    {
      type: "ARTICLE",
      title: "WFP Hunger Explained",
      description: "기아 문제와 식량 접근성의 구조적 원인",
      url: "https://www.wfp.org/hunger"
    }
  ]
};

const [ingredientsData, impactRulesData, copyData] = await Promise.all([
  loadJsonData("/app/data/sdg02/ingredients.json", DEFAULT_INGREDIENTS),
  loadJsonData("/app/data/sdg02/impactRules.json", DEFAULT_IMPACT_RULES),
  loadJsonData("/app/data/sdg02/copy.json", DEFAULT_COPY)
]);

const INGREDIENTS = Array.isArray(ingredientsData) && ingredientsData.length
  ? ingredientsData
  : DEFAULT_INGREDIENTS;

const IMPACT_RULES = {
  ...DEFAULT_IMPACT_RULES,
  ...(impactRulesData || {})
};

const COPY = {
  ...DEFAULT_COPY,
  ...(copyData || {})
};

function getGsap() {
  if (typeof window === "undefined") return null;
  return window.gsap && typeof window.gsap.to === "function" ? window.gsap : null;
}

function fillTemplate(template, values) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return String(values[key]);
    }
    return "";
  });
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function formatDecimal(value, digits = 1) {
  const fixed = Number(value || 0).toFixed(digits);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

function toCount(item) {
  const count = Number(item?.count);
  return Number.isFinite(count) && count > 0 ? count : 1;
}

export class Sdg02DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg02";
    this.frameMode = "immersive";
    this.refs = {};
    this.disposeRequested = false;
    this.timers = new Set();
    this.rafIds = new Set();
    this.throwGhosts = new Set();
    this.throwAnimations = new Set();

    this.state = this.createInitialState();
    this.binDragDepth = 0;
    this.throwingIds = new Set();

    this.boundIntroStart = () => this.startIntro();
    this.boundFoodClick = (event) => this.onFoodClick(event);
    this.boundFoodDragStart = (event) => this.onFoodDragStart(event);
    this.boundFoodDragEnd = (event) => this.onFoodDragEnd(event);
    this.boundBinDragEnter = (event) => this.onBinDragEnter(event);
    this.boundBinDragLeave = (event) => this.onBinDragLeave(event);
    this.boundBinDragOver = (event) => this.onBinDragOver(event);
    this.boundBinDrop = (event) => this.onBinDrop(event);
    this.boundConfirm = () => this.goReport();
    this.boundReset = () => this.resetExperience();
  }

  createInitialState() {
    return {
      stage: "intro",
      selectedIds: new Set(),
      transitionLock: false,
      impact: null,
      draggingId: null,
      dropCommitted: false
    };
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg02-title-hidden", hidden);
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg02-theme", active);
  }

  setTimer(fn, delay) {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      if (this.disposeRequested) return;
      fn();
    }, delay);
    this.timers.add(id);
  }

  clearTimers() {
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers.clear();
  }

  setRaf(callback) {
    const id = window.requestAnimationFrame((time) => {
      this.rafIds.delete(id);
      if (this.disposeRequested) return;
      callback(time);
    });
    this.rafIds.add(id);
    return id;
  }

  clearRafs() {
    this.rafIds.forEach((id) => window.cancelAnimationFrame(id));
    this.rafIds.clear();
  }

  clearThrowArtifacts() {
    this.throwAnimations.forEach((animation) => {
      try {
        animation.cancel();
      } catch {
        // ignore
      }
    });
    this.throwAnimations.clear();

    this.throwGhosts.forEach((ghost) => {
      if (ghost.parentNode) {
        ghost.parentNode.removeChild(ghost);
      }
    });
    this.throwGhosts.clear();
  }

  render() {
    if (!this.host) return;

    this.teardownRuntime();
    this.disposeRequested = false;
    this.state = this.createInitialState();
    this.binDragDepth = 0;
    this.throwingIds.clear();

    this.setThemeActive(true);
    this.setTitleSectorHidden(true);

    this.host.innerHTML = `
      <div class="sdg02-rx-exp" data-role="root">
        <section class="sdg02-rx-stage sdg02-rx-stage-intro is-active" data-role="stageIntro">
          <button type="button" class="sdg02-rx-intro-fridge-btn" data-role="introStartButton" aria-label="${escapeHtml(COPY.openButton || "냉장고 열기")}">
            <div class="sdg02-rx-fridge-shell" aria-hidden="true">
              <div class="sdg02-rx-fridge-back">
                <div class="sdg02-rx-fridge-divider"></div>
              </div>
              <div class="sdg02-rx-door-plane" data-role="introDoorGroup">
                <div class="sdg02-rx-door-divider"></div>
                <span class="sdg02-rx-door-handle sdg02-rx-door-handle-top"></span>
                <span class="sdg02-rx-door-handle sdg02-rx-door-handle-bottom"></span>
              </div>
            </div>
            <span class="sdg02-rx-intro-glow"></span>
          </button>

          <h2 class="sdg02-rx-intro-title">${escapeHtml(COPY.headline || "잊혀진 냉장고의 복수")}</h2>
          <p class="sdg02-rx-intro-lead">${escapeHtml(COPY.introLead || "당신이 버리는 음식, 지구는 기억합니다")}</p>
          <p class="sdg02-rx-intro-cue">${escapeHtml(COPY.introCue || "냉장고를 클릭하세요")}</p>
        </section>

        <section class="sdg02-rx-stage sdg02-rx-stage-select" data-role="stageSelect" hidden>
          <header class="sdg02-rx-stage-head">
            <h3 class="sdg02-rx-stage-title">${escapeHtml(COPY.selectTitle || "오늘 버릴 음식을 선택하세요")}</h3>
            <p class="sdg02-rx-stage-sub">${escapeHtml(COPY.selectLead || "음식을 클릭하면 쓰레기통으로 버려집니다")}</p>
          </header>

          <div class="sdg02-rx-select-workspace">
            <div class="sdg02-rx-select-fridge">
              <div class="sdg02-rx-food-grid" data-role="foodGrid"></div>
            </div>

            <aside class="sdg02-rx-bin-panel" aria-label="버리기 영역">
              <div class="sdg02-rx-bin" data-role="binDropzone">
                <span class="sdg02-rx-bin-lid" aria-hidden="true"></span>
                <span class="sdg02-rx-bin-body" aria-hidden="true"></span>
              </div>
              <p class="sdg02-rx-bin-caption">${escapeHtml(COPY.binLabel || "버리는 순간, 낭비는 끝나지 않습니다.")}</p>
            </aside>
          </div>

          <div class="sdg02-rx-select-actions">
            <p class="sdg02-rx-drag-hint">${escapeHtml(COPY.dragHint || "식재료를 잡아 버려보세요.")}</p>
            <p class="sdg02-rx-action-feedback" data-role="actionFeedback">음식을 클릭해 버려보세요</p>
            <p class="sdg02-rx-select-count" data-role="selectedCount"></p>
            <button type="button" class="sdg02-rx-confirm-btn" data-role="confirmButton" disabled>
              먼저 음식을 버려주세요
            </button>
          </div>
        </section>

        <section class="sdg02-rx-stage sdg02-rx-stage-report" data-role="stageReport" hidden>
          <header class="sdg02-rx-stage-head">
            <h3 class="sdg02-rx-stage-title" data-role="reportTitle">${escapeHtml(COPY.reportTitle || "당신이 버린 것들")}</h3>
            <div class="sdg02-rx-report-emojis" data-role="reportEmojis"></div>
          </header>

          <div class="sdg02-rx-stats">
            <article class="sdg02-rx-stat sdg02-rx-stat-water">
              <div class="sdg02-rx-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" /></svg>
              </div>
              <div class="sdg02-rx-stat-body">
                <p class="sdg02-rx-stat-label">낭비된 물</p>
                <p class="sdg02-rx-stat-value"><span data-role="waterValue">0</span><small>L</small></p>
                <p class="sdg02-rx-stat-desc" data-role="waterDesc">-</p>
              </div>
            </article>

            <article class="sdg02-rx-stat sdg02-rx-stat-carbon">
              <div class="sdg02-rx-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" /></svg>
              </div>
              <div class="sdg02-rx-stat-body">
                <p class="sdg02-rx-stat-label">탄소 배출</p>
                <p class="sdg02-rx-stat-value"><span data-role="carbonValue">0</span><small>kgCO2</small></p>
                <p class="sdg02-rx-stat-desc" data-role="carbonDesc">-</p>
              </div>
            </article>

            <article class="sdg02-rx-stat sdg02-rx-stat-cost">
              <div class="sdg02-rx-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
              </div>
              <div class="sdg02-rx-stat-body">
                <p class="sdg02-rx-stat-label">낭비된 비용</p>
                <p class="sdg02-rx-stat-value"><span data-role="priceValue">0</span><small>원</small></p>
                <p class="sdg02-rx-stat-desc" data-role="priceDesc">-</p>
              </div>
            </article>
          </div>

          <p class="sdg02-rx-report-message">${escapeHtml(COPY.reportMessage || "전 세계에서 생산되는 음식의 1/3이 버려집니다. 작은 변화가 지구를 지킵니다.")}</p>

          <button type="button" class="sdg02-rx-reset-btn" data-role="resetButton">
            ${escapeHtml(COPY.retryButton || "다시 해보기")}
          </button>

          ${this.renderResourcesSection()}
        </section>
      </div>
    `;

    this.cacheRefs();
    this.renderFoodGrid();
    this.bindEvents();
    this.updateSelectUi();
  }

  renderResourcesSection() {
    const resources = Array.isArray(COPY.resources)
      ? COPY.resources.filter((item) => item && item.url)
      : [];

    if (!resources.length) return "";

    return `
      <section class="sdg02-rx-resources">
        <p class="sdg02-rx-resources-overline">현실 자료</p>
        <h4 class="sdg02-rx-resources-title">${escapeHtml(COPY.resourcesTitle || "관련 자료")}</h4>
        <p class="sdg02-rx-resources-copy">${escapeHtml(COPY.resourcesLead || "체험 수치를 실제 데이터와 연결해 보세요.")}</p>
        <div class="sdg02-rx-resource-list">
          ${this.renderResourceItems(resources)}
        </div>
      </section>
    `;
  }

  renderResourceItems(resources) {
    return resources.map((resource, index) => {
      const type = escapeHtml(resource.type || "자료");
      const title = escapeHtml(resource.title || "자료 제목");
      const description = escapeHtml(resource.description || "자료 설명");
      const url = escapeHtml(resource.url || "#");
      const delay = index * 90;

      return `
        <article class="sdg02-rx-resource-item" style="--rx-delay:${delay}ms">
          <p class="sdg02-rx-resource-type">${type}</p>
          <h5 class="sdg02-rx-resource-title">${title}</h5>
          <p class="sdg02-rx-resource-desc">${description}</p>
          <a class="sdg02-rx-resource-open" href="${url}" target="_blank" rel="noopener noreferrer">열기</a>
        </article>
      `;
    }).join("");
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      stageIntro: get("stageIntro"),
      stageSelect: get("stageSelect"),
      stageReport: get("stageReport"),
      introStartButton: get("introStartButton"),
      introDoorGroup: get("introDoorGroup"),
      foodGrid: get("foodGrid"),
      binDropzone: get("binDropzone"),
      actionFeedback: get("actionFeedback"),
      selectedCount: get("selectedCount"),
      confirmButton: get("confirmButton"),
      reportTitle: get("reportTitle"),
      reportEmojis: get("reportEmojis"),
      waterValue: get("waterValue"),
      waterDesc: get("waterDesc"),
      carbonValue: get("carbonValue"),
      carbonDesc: get("carbonDesc"),
      priceValue: get("priceValue"),
      priceDesc: get("priceDesc"),
      resetButton: get("resetButton")
    };
  }

  bindEvents() {
    this.refs.introStartButton?.addEventListener("click", this.boundIntroStart);
    this.refs.foodGrid?.addEventListener("click", this.boundFoodClick);
    this.refs.foodGrid?.addEventListener("dragstart", this.boundFoodDragStart);
    this.refs.foodGrid?.addEventListener("dragend", this.boundFoodDragEnd);
    this.refs.binDropzone?.addEventListener("dragenter", this.boundBinDragEnter);
    this.refs.binDropzone?.addEventListener("dragleave", this.boundBinDragLeave);
    this.refs.binDropzone?.addEventListener("dragover", this.boundBinDragOver);
    this.refs.binDropzone?.addEventListener("drop", this.boundBinDrop);
    this.refs.confirmButton?.addEventListener("click", this.boundConfirm);
    this.refs.resetButton?.addEventListener("click", this.boundReset);
  }

  teardownRuntime() {
    this.refs.introStartButton?.removeEventListener("click", this.boundIntroStart);
    this.refs.foodGrid?.removeEventListener("click", this.boundFoodClick);
    this.refs.foodGrid?.removeEventListener("dragstart", this.boundFoodDragStart);
    this.refs.foodGrid?.removeEventListener("dragend", this.boundFoodDragEnd);
    this.refs.binDropzone?.removeEventListener("dragenter", this.boundBinDragEnter);
    this.refs.binDropzone?.removeEventListener("dragleave", this.boundBinDragLeave);
    this.refs.binDropzone?.removeEventListener("dragover", this.boundBinDragOver);
    this.refs.binDropzone?.removeEventListener("drop", this.boundBinDrop);
    this.refs.confirmButton?.removeEventListener("click", this.boundConfirm);
    this.refs.resetButton?.removeEventListener("click", this.boundReset);
    this.clearTimers();
    this.clearRafs();
    this.clearThrowArtifacts();
  }

  renderFoodGrid() {
    if (!this.refs.foodGrid) return;

    this.refs.foodGrid.innerHTML = INGREDIENTS.map((item) => `
      <button type="button" class="sdg02-rx-food-item" data-role="foodItem" data-id="${escapeHtml(item.id)}" draggable="true">
        <span class="sdg02-rx-food-emoji">${escapeHtml(item.emoji || "")}</span>
        <span class="sdg02-rx-food-name">${escapeHtml(item.name || item.key || "식재료")}</span>
        <span class="sdg02-rx-food-status">${escapeHtml(item.status || "임박")}</span>
      </button>
    `).join("");
  }

  getIngredientById(id) {
    return INGREDIENTS.find((item) => item.id === id) || null;
  }

  calculateItemImpact(item) {
    if (!item) return null;
    const count = toCount(item);
    const water = (Number(IMPACT_RULES.waterPerUnitL?.[item.key]) || 0) * count;
    const price = (Number(IMPACT_RULES.priceKrw?.[item.key]) || 0) * count;
    const weight = (Number(IMPACT_RULES.avgUnitWeightKg?.[item.key]) || 0) * count;
    const carbon = weight * (Number(IMPACT_RULES.co2eKgPerKgWaste) || 0);
    return { water, price, carbon };
  }

  updateActionFeedback(item) {
    if (!this.refs.actionFeedback || !item) return;
    const impact = this.calculateItemImpact(item);
    if (!impact) return;

    const name = item.name || item.key || "식재료";
    this.refs.actionFeedback.textContent = `${name} 버림 · 물 +${formatNumber(Math.round(impact.water))}L · 탄소 +${formatDecimal(impact.carbon, 1)}kgCO2 · 비용 +${formatNumber(Math.round(impact.price))}원`;
    this.refs.actionFeedback.classList.remove("is-live");
    this.setTimer(() => {
      this.refs.actionFeedback?.classList.add("is-live");
    }, 0);
  }

  animateThrowToBin(button, item) {
    return new Promise((resolve) => {
      const bin = this.refs.binDropzone;
      if (!button || !bin) {
        resolve();
        return;
      }

      const buttonRect = button.getBoundingClientRect();
      const binRect = bin.getBoundingClientRect();
      const startX = buttonRect.left + buttonRect.width / 2 - 26;
      const startY = buttonRect.top + buttonRect.height / 2 - 26;
      const endX = binRect.left + binRect.width / 2 - 26;
      const endY = binRect.top + 38;
      const midX = startX + (endX - startX) * 0.56;
      const midY = Math.min(startY, endY) - 72;

      const ghost = document.createElement("div");
      ghost.className = "sdg02-rx-throw-ghost";
      ghost.textContent = item?.emoji || "🍽️";
      this.throwGhosts.add(ghost);
      document.body.appendChild(ghost);

      const cleanup = () => {
        if (animation) {
          this.throwAnimations.delete(animation);
        }
        this.throwGhosts.delete(ghost);
        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
        resolve();
      };

      const animation = ghost.animate(
        [
          { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 1, offset: 0 },
          { transform: `translate(${midX}px, ${midY}px) scale(1.08)`, opacity: 0.98, offset: 0.45 },
          { transform: `translate(${endX}px, ${endY}px) scale(0.22)`, opacity: 0, offset: 1 }
        ],
        {
          duration: 460,
          easing: "cubic-bezier(0.22, 0.85, 0.2, 1)",
          fill: "forwards"
        }
      );
      this.throwAnimations.add(animation);

      if (animation && animation.finished && typeof animation.finished.then === "function") {
        animation.finished.then(cleanup).catch(cleanup);
      } else {
        this.setTimer(cleanup, 460);
      }
    });
  }

  commitDisposal(id, item = null) {
    if (!id || this.state.selectedIds.has(id)) {
      this.closeBin();
      return;
    }
    const targetItem = item || this.getIngredientById(id);
    this.state.selectedIds.add(id);
    if (targetItem) {
      this.updateActionFeedback(targetItem);
    }
    this.playBinChomp();
    this.updateSelectUi();
  }

  switchStage(stage, instant = false) {
    const stageMap = {
      intro: this.refs.stageIntro,
      select: this.refs.stageSelect,
      report: this.refs.stageReport
    };

    this.state.stage = stage;

    Object.entries(stageMap).forEach(([key, element]) => {
      if (!element) return;
      const active = key === stage;

      if (active) {
        element.hidden = false;
        if (instant) {
          element.classList.add("is-active");
        } else {
          this.setRaf(() => element.classList.add("is-active"));
        }
        return;
      }

      element.classList.remove("is-active");
      if (instant) {
        element.hidden = true;
      } else {
        this.setTimer(() => {
          if (this.state.stage !== key) element.hidden = true;
        }, 220);
      }
    });
  }

  startIntro() {
    if (this.state.stage !== "intro" || this.state.transitionLock) return;

    this.state.transitionLock = true;
    this.refs.introStartButton?.classList.add("is-opening");

    const finish = () => {
      this.state.transitionLock = false;
      this.switchStage("select");
      this.updateSelectUi();
    };

    this.setTimer(finish, 740);
  }

  onFoodClick(event) {
    const button = event.target?.closest("[data-role='foodItem']");
    if (!button) return;

    const id = button.getAttribute("data-id");
    if (!id) return;
    if (this.state.selectedIds.has(id)) return;
    if (this.throwingIds.has(id)) return;

    const item = this.getIngredientById(id);
    this.throwingIds.add(id);
    button.classList.add("is-throwing");
    this.refs.binDropzone?.classList.add("is-open", "is-hot");

    void this.animateThrowToBin(button, item).then(() => {
      this.throwingIds.delete(id);
      button.classList.remove("is-throwing");
      this.commitDisposal(id, item);
    });
  }

  onFoodDragStart(event) {
    const button = event.target?.closest("[data-role='foodItem']");
    if (!button) return;

    const id = button.getAttribute("data-id");
    if (!id || this.state.selectedIds.has(id)) {
      event.preventDefault();
      return;
    }

    this.state.draggingId = id;
    this.state.dropCommitted = false;
    button.classList.add("is-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", id);
    }
    this.refs.binDropzone?.classList.add("is-open");
  }

  onFoodDragEnd(event) {
    const button = event.target?.closest("[data-role='foodItem']");
    button?.classList.remove("is-dragging");

    if (this.state.dropCommitted) {
      this.state.dropCommitted = false;
      this.state.draggingId = null;
      return;
    }

    this.state.draggingId = null;
    this.closeBin();
  }

  onBinDragEnter(event) {
    if (!this.state.draggingId) return;
    event.preventDefault();
    this.binDragDepth += 1;
    this.refs.binDropzone?.classList.add("is-open", "is-hot");
  }

  onBinDragLeave() {
    if (!this.state.draggingId) return;
    this.binDragDepth = Math.max(0, this.binDragDepth - 1);
    if (this.binDragDepth === 0) {
      this.refs.binDropzone?.classList.remove("is-hot");
    }
  }

  onBinDragOver(event) {
    if (!this.state.draggingId) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    this.refs.binDropzone?.classList.add("is-open", "is-hot");
  }

  onBinDrop(event) {
    if (!this.state.draggingId) return;
    event.preventDefault();

    const droppedId = event.dataTransfer?.getData("text/plain") || this.state.draggingId;
    const droppedItem = this.getIngredientById(droppedId);

    this.state.dropCommitted = true;
    this.state.draggingId = null;
    this.binDragDepth = 0;
    this.commitDisposal(droppedId, droppedItem);
  }

  closeBin() {
    this.binDragDepth = 0;
    this.refs.binDropzone?.classList.remove("is-open", "is-hot", "is-chomp");
  }

  playBinChomp() {
    const bin = this.refs.binDropzone;
    if (!bin) return;

    bin.classList.remove("is-hot");
    bin.classList.add("is-open", "is-chomp");
    this.setTimer(() => {
      bin.classList.remove("is-chomp");
      bin.classList.remove("is-open");
    }, 300);
  }

  updateSelectUi() {
    const buttons = this.refs.foodGrid?.querySelectorAll("[data-role='foodItem']") || [];
    buttons.forEach((button) => {
      const id = button.getAttribute("data-id");
      const disposed = id ? this.state.selectedIds.has(id) : false;
      button.classList.toggle("is-selected", disposed);
      button.classList.toggle("is-disposed", disposed);
      button.disabled = disposed;
      button.draggable = !disposed;
    });

    const count = this.state.selectedIds.size;
    if (this.refs.selectedCount) {
      this.refs.selectedCount.textContent = count > 0
        ? `버린 음식 ${formatNumber(count)}개`
        : "버린 음식 없음";
    }

    if (this.refs.confirmButton) {
      const ready = count > 0;
      this.refs.confirmButton.disabled = !ready;
      this.refs.confirmButton.textContent = ready
        ? `버린 결과 확인하기 (${formatNumber(count)}개)`
        : "먼저 음식을 버려주세요";
    }

    if (this.refs.actionFeedback && count === 0 && !this.state.draggingId) {
      this.refs.actionFeedback.textContent = "음식을 클릭해 버려보세요";
      this.refs.actionFeedback.classList.remove("is-live");
    }
  }

  getSelectedItems() {
    return INGREDIENTS.filter((item) => this.state.selectedIds.has(item.id));
  }

  calculateImpact(items) {
    const waterPerUnitL = IMPACT_RULES.waterPerUnitL || {};
    const priceKrw = IMPACT_RULES.priceKrw || {};
    const avgUnitWeightKg = IMPACT_RULES.avgUnitWeightKg || {};
    const mealCost = Number(IMPACT_RULES.mealCostKrw) || 600;
    const carbonPerKg = Number(IMPACT_RULES.co2eKgPerKgWaste) || 0;
    const drinkPerDay = Number(IMPACT_RULES.drinkPerPersonLPerDay) || 2;

    let totalWater = 0;
    let totalPrice = 0;
    let totalWeight = 0;

    items.forEach((item) => {
      const count = toCount(item);
      totalWater += (Number(waterPerUnitL[item.key]) || 0) * count;
      totalPrice += (Number(priceKrw[item.key]) || 0) * count;
      totalWeight += (Number(avgUnitWeightKg[item.key]) || 0) * count;
    });

    const totalCarbon = totalWeight * carbonPerKg;
    return {
      totalWater,
      totalPrice,
      totalCarbon,
      waterDays: Math.floor(totalWater / drinkPerDay),
      mealsLost: Math.floor(totalPrice / mealCost),
      carKm: Math.round(totalCarbon * 4)
    };
  }

  goReport() {
    if (this.state.stage !== "select") return;
    const selectedItems = this.getSelectedItems();
    if (!selectedItems.length) return;

    this.state.impact = this.calculateImpact(selectedItems);
    this.renderReport(selectedItems, this.state.impact);
    this.refs.stageReport?.classList.remove("is-report-ready");
    this.switchStage("report");
    this.setTimer(() => {
      this.refs.stageReport?.classList.add("is-report-ready");
    }, 170);
  }

  renderReport(selectedItems, impact) {
    if (!impact) {
      if (this.refs.reportEmojis) this.refs.reportEmojis.innerHTML = "";
      if (this.refs.waterValue) this.refs.waterValue.textContent = "0";
      if (this.refs.carbonValue) this.refs.carbonValue.textContent = "0";
      if (this.refs.priceValue) this.refs.priceValue.textContent = "0";
      if (this.refs.waterDesc) this.refs.waterDesc.textContent = "-";
      if (this.refs.carbonDesc) this.refs.carbonDesc.textContent = "-";
      if (this.refs.priceDesc) this.refs.priceDesc.textContent = "-";
      return;
    }

    if (this.refs.reportEmojis) {
      this.refs.reportEmojis.innerHTML = selectedItems.map((item) => `<span>${escapeHtml(item.emoji || "")}</span>`).join("");
    }

    this.animateValue(this.refs.waterValue, impact.totalWater, {
      duration: 860,
      formatter: (value) => formatNumber(Math.round(value))
    });
    this.animateValue(this.refs.carbonValue, impact.totalCarbon, {
      duration: 920,
      formatter: (value) => formatDecimal(value, 1)
    });
    this.animateValue(this.refs.priceValue, impact.totalPrice, {
      duration: 900,
      formatter: (value) => formatNumber(Math.round(value))
    });

    if (this.refs.waterDesc) {
      this.refs.waterDesc.textContent = `${formatNumber(impact.waterDays)}일치 식수`;
    }
    if (this.refs.carbonDesc) {
      this.refs.carbonDesc.textContent = `자동차 ${formatNumber(impact.carKm)}km 주행`;
    }
    if (this.refs.priceDesc) {
      this.refs.priceDesc.textContent = `기아 아동 ${formatNumber(impact.mealsLost)}끼 식사`;
    }
  }

  resetExperience() {
    this.clearTimers();
    this.clearRafs();
    this.state = this.createInitialState();
    this.binDragDepth = 0;
    this.throwingIds.clear();

    if (this.refs.introDoorGroup) {
      this.refs.introDoorGroup.style.transform = "";
    }

    this.refs.introStartButton?.classList.remove("is-opening");
    this.closeBin();
    this.refs.stageReport?.classList.remove("is-report-ready");
    document.querySelectorAll(".sdg02-rx-throw-ghost").forEach((node) => node.remove());
    this.renderReport([], null);
    this.updateSelectUi();
    this.switchStage("intro");
  }

  animateValue(node, target, options = {}) {
    if (!node) return;

    const formatter = typeof options.formatter === "function"
      ? options.formatter
      : (value) => String(value);
    const duration = Number(options.duration) || 850;
    const endValue = Number(target) || 0;
    const startValue = 0;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = startValue + (endValue - startValue) * eased;
      node.textContent = formatter(current);

      if (progress < 1) {
        this.setRaf(tick);
      }
    };

    this.setRaf(tick);
  }

  destroy() {
    this.disposeRequested = true;
    this.teardownRuntime();
    this.setThemeActive(false);
    this.setTitleSectorHidden(false);
    if (this.host) this.host.innerHTML = "";
  }
}
