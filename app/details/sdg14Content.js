import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG14_MAX_PLASTIC,
  SDG14_MODEL_NOTE,
  SDG14_STAGE_INTRO,
  addSdg14Plastic,
  calculateSdg14Scenario,
  createSdg14InitialState,
  renderSdg14Fragments,
  renderSdg14ResourceItems,
  renderSdg14SpeciesItems,
  resetSdg14Experience
} from "./sdg14ContentModel.js";

export class Sdg14DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg14";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg14InitialState();
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg14-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg14-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg14-exp" data-role="root" data-stage="${SDG14_STAGE_INTRO}">
        <div class="sdg14-scene" aria-label="바다거북 위장 체험 장면">
          <div class="sdg14-water-light" aria-hidden="true"></div>
          <div class="sdg14-current is-1" aria-hidden="true"></div>
          <div class="sdg14-current is-2" aria-hidden="true"></div>
          <div class="sdg14-seafloor" aria-hidden="true">
            <span class="sdg14-grass is-1"></span>
            <span class="sdg14-grass is-2"></span>
            <span class="sdg14-grass is-3"></span>
          </div>

          <button type="button" class="sdg14-click-layer" data-action="addPlastic" aria-label="플라스틱 파편 추가"></button>

          <div class="sdg14-turtle-wrap" aria-hidden="true">
            <div class="sdg14-turtle">
              <span class="sdg14-flipper is-front-left"></span>
              <span class="sdg14-flipper is-front-right"></span>
              <span class="sdg14-flipper is-back-left"></span>
              <span class="sdg14-flipper is-back-right"></span>
              <span class="sdg14-head"></span>
              <span class="sdg14-shell"></span>
              <span class="sdg14-shell-line is-1"></span>
              <span class="sdg14-shell-line is-2"></span>
              <span class="sdg14-stomach"></span>
              <span class="sdg14-stomach-glow"></span>
              <span class="sdg14-fragment-layer" data-role="fragmentLayer"></span>
            </div>
          </div>
        </div>

        <header class="sdg14-hero" aria-labelledby="sdg14Title">
          <p class="sdg14-goal-label">SDG GOAL 14</p>
          <h3 id="sdg14Title" class="sdg14-title">The Ocean's Stomach</h3>
          <p class="sdg14-subtitle">바다의 위장</p>
          <p class="sdg14-lead">한 번의 편리함이 바다 생물의 몸 안에 어떤 무게로 남는지 클릭으로 확인합니다.</p>
        </header>

        <section class="sdg14-control-panel" aria-label="플라스틱 파편 입력">
          <div class="sdg14-panel-head">
            <p class="sdg14-kicker">Click Input</p>
            <span data-role="progressLabel">0/${SDG14_MAX_PLASTIC}</span>
          </div>
          <button type="button" class="sdg14-primary-btn" data-action="addPlastic">
            플라스틱 파편 떨어뜨리기
          </button>
          <div class="sdg14-progress-track" aria-hidden="true">
            <span data-role="progressFill"></span>
          </div>
          <p class="sdg14-control-copy" data-role="weightLabel">아직 맑은 위장</p>
        </section>

        <section class="sdg14-result-panel" aria-label="해양 생물 건강 결과">
          <div class="sdg14-result-head">
            <div>
              <p class="sdg14-kicker">Output</p>
              <h4 data-role="resultTitle">위장에 쌓이는 조각</h4>
            </div>
            <span class="sdg14-status-pill" data-role="statusPill">0 pieces</span>
          </div>
          <div class="sdg14-metric-grid">
            <article>
              <span>건강 지수</span>
              <strong data-role="healthValue">100/100</strong>
              <small>체험용 지표</small>
            </article>
            <article>
              <span>미세 플라스틱 축적</span>
              <strong data-role="loadValue">0 units</strong>
              <small>simulated load</small>
            </article>
          </div>
          <div class="sdg14-species-list" data-role="speciesList"></div>
          <p class="sdg14-final-message" data-role="finalMessage">당신의 편리함이 이 거북이에게는 평생의 무게가 됩니다.</p>
          <p class="sdg14-model-note">${escapeHtml(SDG14_MODEL_NOTE)}</p>
          <div class="sdg14-result-actions">
            <button type="button" class="sdg14-secondary-btn" data-action="reset">다시 보기</button>
          </div>
          <div class="sdg14-resource-list">
            ${renderSdg14ResourceItems()}
          </div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      fragmentLayer: get("fragmentLayer"),
      progressLabel: get("progressLabel"),
      progressFill: get("progressFill"),
      weightLabel: get("weightLabel"),
      resultTitle: get("resultTitle"),
      statusPill: get("statusPill"),
      healthValue: get("healthValue"),
      loadValue: get("loadValue"),
      speciesList: get("speciesList"),
      finalMessage: get("finalMessage"),
      addButtons: this.host.querySelectorAll("[data-action=\"addPlastic\"]")
    };
  }

  bindEvents() {
    this.host.addEventListener("click", (event) => {
      const actionTarget = event.target.closest("[data-action]");
      if (!actionTarget || !this.host.contains(actionTarget)) return;

      const action = actionTarget.dataset.action;
      if (action === "addPlastic") {
        this.state = addSdg14Plastic(this.state);
        this.renderAll();
      }
      if (action === "reset") {
        this.state = resetSdg14Experience();
        this.renderAll();
      }
    });
  }

  renderAll() {
    const scenario = calculateSdg14Scenario(this.state);
    const percent = Math.round(scenario.loadRatio * 100);

    if (this.refs.root) {
      this.refs.root.dataset.stage = scenario.stage;
      this.refs.root.style.setProperty("--sdg14-load", scenario.loadRatio.toFixed(2));
      this.refs.root.style.setProperty("--sdg14-health", (scenario.healthIndex / 100).toFixed(2));
      this.refs.root.style.setProperty("--sdg14-murk", scenario.murkLevel);
      this.refs.root.style.setProperty("--sdg14-swim-duration", scenario.swimDuration);
    }

    if (this.refs.fragmentLayer) {
      this.refs.fragmentLayer.innerHTML = renderSdg14Fragments(scenario.visibleFragments);
    }
    if (this.refs.progressLabel) {
      this.refs.progressLabel.textContent = `${scenario.plasticCount}/${SDG14_MAX_PLASTIC}`;
    }
    if (this.refs.progressFill) this.refs.progressFill.style.inlineSize = `${percent}%`;
    if (this.refs.weightLabel) this.refs.weightLabel.textContent = scenario.weightLabel;
    this.refs.addButtons?.forEach((button) => {
      button.disabled = scenario.plasticCount >= SDG14_MAX_PLASTIC;
    });
    if (this.refs.resultTitle) {
      this.refs.resultTitle.textContent = scenario.stage === SDG14_STAGE_INTRO
        ? "위장에 쌓이는 조각"
        : "몸 안에 남은 플라스틱";
    }
    if (this.refs.statusPill) this.refs.statusPill.textContent = `${scenario.plasticCount} pieces`;
    if (this.refs.healthValue) this.refs.healthValue.textContent = scenario.healthLabel;
    if (this.refs.loadValue) this.refs.loadValue.textContent = scenario.microplasticLabel;
    if (this.refs.speciesList) {
      this.refs.speciesList.innerHTML = renderSdg14SpeciesItems(scenario.activeSpecies);
    }
  }

  render() {
    if (!this.host) return;
    this.state = createSdg14InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
  }

  destroy() {
    this.setThemeActive(false);
    this.setTitleSectorHidden(false);
    this.host = null;
    this.refs = {};
  }
}
