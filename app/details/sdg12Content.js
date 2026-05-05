import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG12_ITEMS,
  SDG12_MODEL_NOTE,
  SDG12_STAGE_INTRO,
  calculateSdg12Scenario,
  createSdg12InitialState,
  renderSdg12ResourceItems,
  resetSdg12Experience,
  selectSdg12Item
} from "./sdg12ContentModel.js";

function renderSdg12ItemOptions() {
  return SDG12_ITEMS.map((item) => `
    <button type="button" class="sdg12-item-btn" data-item="${escapeHtml(item.key)}">
      <span class="sdg12-item-icon is-${escapeHtml(item.icon)}"></span>
      <span class="sdg12-item-text">
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.sourceDetail)}</small>
      </span>
    </button>
  `).join("");
}

function renderSdg12TimelineStops(stops) {
  return stops.map((stop) => `
    <span class="sdg12-time-mark ${stop.ghostStillHere ? "is-haunted" : "is-faded"}">
      <b>${stop.year}</b>
      <small>${stop.ghostStillHere ? "ghost remains" : "trace uncertain"}</small>
    </span>
  `).join("");
}

export class Sdg12DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg12";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg12InitialState();
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg12-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg12-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg12-exp" data-role="root" data-stage="${SDG12_STAGE_INTRO}" data-item="plasticCup">
        <div class="sdg12-scene" aria-hidden="true">
          <div class="sdg12-horizon"></div>
          <div class="sdg12-bin">
            <span class="sdg12-bin-lid"></span>
            <span class="sdg12-bin-body"></span>
            <span class="sdg12-grave-marker"></span>
            <span class="sdg12-grave-label">일회용품의<br>봉분</span>
          </div>
          <div class="sdg12-trash-object" data-role="trashObject">
            <span class="sdg12-trash-shape"></span>
          </div>
          <div class="sdg12-ghost" data-role="ghost">
            <span class="sdg12-ghost-shape"></span>
            <span class="sdg12-ghost-tail is-1"></span>
            <span class="sdg12-ghost-tail is-2"></span>
          </div>
          <div class="sdg12-year-stream" data-role="timelineStops"></div>
        </div>

        <header class="sdg12-hero" aria-labelledby="sdg12Title">
          <p class="sdg12-goal-label">SDG GOAL 12</p>
          <h3 id="sdg12Title" class="sdg12-title">The Trash Ghost</h3>
          <p class="sdg12-subtitle">쓰레기 유령</p>
          <p class="sdg12-lead">버린 순간 물건은 눈앞에서 사라지지만, 그 흔적은 오래 남아 다음 세대의 풍경을 따라다닙니다.</p>
        </header>

        <section class="sdg12-choice-panel" aria-label="오늘 버린 일회용품 선택">
          <div class="sdg12-panel-head">
            <p class="sdg12-kicker">Today I threw away</p>
            <span>하나를 고르면 시간이 흐릅니다</span>
          </div>
          <div class="sdg12-item-grid" data-role="itemGrid">
            ${renderSdg12ItemOptions()}
          </div>
        </section>

        <section class="sdg12-result-panel" aria-label="쓰레기 잔류 결과">
          <div class="sdg12-result-head">
            <div>
              <p class="sdg12-kicker">Ghost Result</p>
              <h4 data-role="itemLabel">플라스틱 컵</h4>
            </div>
            <span class="sdg12-danger-pill" data-role="persistenceLabel">약 450년</span>
          </div>

          <p class="sdg12-warning-copy" data-role="warningCopy">-</p>
          <div class="sdg12-result-grid">
            <article>
              <span>예상 잔류 연도</span>
              <strong data-role="endYearValue">-</strong>
            </article>
            <article>
              <span>세대 환산</span>
              <strong data-role="generationValue">-</strong>
            </article>
          </div>
          <p class="sdg12-family-warning">당신의 손자는 이 유령과 함께 살게 됩니다.</p>
          <p class="sdg12-model-note">${escapeHtml(SDG12_MODEL_NOTE)}</p>
          <div class="sdg12-result-actions">
            <button type="button" class="sdg12-secondary-btn" data-role="resetButton">다른 물건 보기</button>
          </div>
          <div class="sdg12-resource-list">
            ${renderSdg12ResourceItems()}
          </div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      itemGrid: get("itemGrid"),
      trashObject: get("trashObject"),
      ghost: get("ghost"),
      timelineStops: get("timelineStops"),
      itemLabel: get("itemLabel"),
      persistenceLabel: get("persistenceLabel"),
      warningCopy: get("warningCopy"),
      endYearValue: get("endYearValue"),
      generationValue: get("generationValue"),
      resetButton: get("resetButton")
    };
  }

  bindEvents() {
    this.refs.itemGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-item]");
      if (!button || !this.refs.itemGrid.contains(button)) return;
      this.state = selectSdg12Item(this.state, button.dataset.item);
      this.renderAll();
    });

    this.refs.resetButton?.addEventListener("click", () => {
      this.state = resetSdg12Experience();
      this.renderAll();
    });
  }

  renderSelections(scenario) {
    const shouldShowActive = scenario.stage !== SDG12_STAGE_INTRO;

    this.refs.itemGrid?.querySelectorAll(".sdg12-item-btn").forEach((button) => {
      button.classList.toggle("is-active", shouldShowActive && button.dataset.item === scenario.item.key);
    });
  }

  renderAll() {
    const scenario = calculateSdg12Scenario(this.state);

    if (this.refs.root) {
      this.refs.root.dataset.stage = scenario.stage;
      this.refs.root.dataset.item = scenario.item.icon;
      this.refs.root.style.setProperty("--sdg12-ghost-strength", scenario.ghostStrength.toFixed(2));
    }
    if (this.refs.timelineStops) {
      this.refs.timelineStops.innerHTML = renderSdg12TimelineStops(scenario.visibleStops);
    }
    if (this.refs.itemLabel) this.refs.itemLabel.textContent = scenario.item.label;
    if (this.refs.persistenceLabel) this.refs.persistenceLabel.textContent = scenario.persistenceLabel;
    if (this.refs.warningCopy) this.refs.warningCopy.textContent = scenario.item.warning;
    if (this.refs.endYearValue) this.refs.endYearValue.textContent = scenario.endYearLabel;
    if (this.refs.generationValue) this.refs.generationValue.textContent = scenario.generationLabel;

    this.renderSelections(scenario);
  }

  render() {
    if (!this.host) return;
    this.state = createSdg12InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
  }

  reset() {
    this.state = createSdg12InitialState();
    this.renderAll();
  }

  destroy() {
    this.refs = {};
    this.state = createSdg12InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);
    if (this.host) this.host.innerHTML = "";
  }
}
