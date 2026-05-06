import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG15_CHAIN_DURATION_MS,
  SDG15_MODEL_NOTE,
  SDG15_STAGE_CHAIN,
  SDG15_STAGE_INTRO,
  SDG15_STAGE_RESULT,
  calculateSdg15ViewModel,
  createSdg15InitialState,
  renderSdg15DominoChain,
  renderSdg15ScenarioButtons,
  renderSdg15SourceItems,
  renderSdg15SpeciesItems,
  resetSdg15Experience,
  revealSdg15Result,
  selectSdg15Scenario
} from "./sdg15ContentModel.js";

export class Sdg15DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg15";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg15InitialState();
    this.resultTimer = 0;
    this.runVersion = 0;
    this.boundHandleClick = (event) => this.handleClick(event);
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg15-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg15-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg15-exp" data-role="root" data-stage="${SDG15_STAGE_INTRO}">
        <div class="sdg15-scene" aria-label="생태계 도미노 체험 장면">
          <div class="sdg15-sky" aria-hidden="true"></div>
          <div class="sdg15-sun" aria-hidden="true"></div>
          <div class="sdg15-ridge is-back" aria-hidden="true"></div>
          <div class="sdg15-ridge is-front" aria-hidden="true"></div>
          <div class="sdg15-canopy" aria-hidden="true">
            <span class="sdg15-tree is-1"></span>
            <span class="sdg15-tree is-2"></span>
            <span class="sdg15-tree is-3"></span>
            <span class="sdg15-tree is-4"></span>
          </div>
          <div class="sdg15-clearing" aria-hidden="true"></div>
          <div class="sdg15-domino-track" aria-label="서식지 붕괴 도미노">
            <div class="sdg15-domino-line" data-role="dominoLine"></div>
          </div>
          <p class="sdg15-empty-message" data-role="emptyMessage" aria-live="polite"></p>
        </div>

        <header class="sdg15-hero" aria-labelledby="sdg15Title">
          <p class="sdg15-goal-label">SDG GOAL 15</p>
          <h3 id="sdg15Title" class="sdg15-title">The Extinction Domino</h3>
          <p class="sdg15-subtitle">멸종의 도미노</p>
          <p class="sdg15-lead">하나의 소비가 숲의 첫 도미노를 밀면, 생태계 연결망은 순서대로 무너집니다.</p>
        </header>

        <section class="sdg15-choice-panel" aria-label="소비 자원 선택">
          <div class="sdg15-panel-head">
            <div>
              <p class="sdg15-kicker">Input</p>
              <h4>무너뜨릴 첫 도미노</h4>
            </div>
            <span data-role="progressLabel">도미노 대기 중</span>
          </div>
          <div class="sdg15-choice-grid" data-role="choiceGrid"></div>
        </section>

        <section class="sdg15-result-panel" data-role="resultPanel" aria-label="멸종 도미노 결과" aria-hidden="true">
          <div class="sdg15-result-head">
            <div>
              <p class="sdg15-kicker">Output</p>
              <h4 data-role="resultTitle">서식지 붕괴 결과</h4>
            </div>
            <button type="button" class="sdg15-reset-btn" data-action="reset">다시 보기</button>
          </div>
          <p class="sdg15-result-message" data-role="resultMessage"></p>
          <div class="sdg15-metric-grid">
            <article>
              <span>파괴되는 서식지</span>
              <strong data-role="habitatValue"></strong>
              <small data-role="regionValue"></small>
            </article>
            <article>
              <span>서식지 압박</span>
              <strong data-role="pressureValue"></strong>
              <small>체험용 지표</small>
            </article>
          </div>
          <p class="sdg15-habitat-copy" data-role="habitatCopy"></p>
          <div class="sdg15-species-list" data-role="speciesList"></div>
          <p class="sdg15-model-note">${escapeHtml(SDG15_MODEL_NOTE)}</p>
          <div class="sdg15-source-list" data-role="sourceList"></div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      choiceGrid: get("choiceGrid"),
      dominoLine: get("dominoLine"),
      emptyMessage: get("emptyMessage"),
      progressLabel: get("progressLabel"),
      resultPanel: get("resultPanel"),
      resultTitle: get("resultTitle"),
      resultMessage: get("resultMessage"),
      habitatValue: get("habitatValue"),
      regionValue: get("regionValue"),
      pressureValue: get("pressureValue"),
      habitatCopy: get("habitatCopy"),
      speciesList: get("speciesList"),
      sourceList: get("sourceList")
    };
  }

  bindEvents() {
    this.host.addEventListener("click", this.boundHandleClick);
  }

  clearResultTimer() {
    if (!this.resultTimer) return;
    window.clearTimeout(this.resultTimer);
    this.resultTimer = 0;
  }

  handleClick(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !this.host?.contains(actionTarget)) return;

    const action = actionTarget.dataset.action;
    if (action === "selectScenario") {
      this.startScenario(actionTarget.dataset.scenario);
      return;
    }

    if (action === "reset") {
      this.resetExperience();
    }
  }

  startScenario(scenarioKey) {
    if (this.state.stage === SDG15_STAGE_CHAIN) return;

    this.clearResultTimer();
    this.runVersion += 1;
    const runId = this.runVersion;
    this.state = selectSdg15Scenario(this.state, scenarioKey);
    this.renderAll();

    this.resultTimer = window.setTimeout(() => {
      if (runId !== this.runVersion) return;
      this.state = revealSdg15Result(this.state);
      this.renderAll();
    }, SDG15_CHAIN_DURATION_MS);
  }

  resetExperience() {
    this.clearResultTimer();
    this.runVersion += 1;
    this.state = resetSdg15Experience();
    this.renderAll();
  }

  renderAll() {
    const viewModel = calculateSdg15ViewModel(this.state);
    const { stage, scenario } = viewModel;

    if (this.refs.root) {
      this.refs.root.dataset.stage = stage;
      this.refs.root.dataset.scenario = scenario.key;
      this.refs.root.style.setProperty("--sdg15-accent", scenario.accent);
      this.refs.root.style.setProperty("--sdg15-pressure", (scenario.pressureScore / 100).toFixed(2));
    }

    if (this.refs.choiceGrid) {
      this.refs.choiceGrid.innerHTML = renderSdg15ScenarioButtons(scenario.key);
      this.refs.choiceGrid.querySelectorAll("[data-action=\"selectScenario\"]").forEach((button) => {
        button.disabled = stage === SDG15_STAGE_CHAIN;
      });
    }

    if (this.refs.dominoLine) {
      this.refs.dominoLine.innerHTML = renderSdg15DominoChain(viewModel.chain);
    }

    if (this.refs.emptyMessage) {
      this.refs.emptyMessage.textContent = stage === SDG15_STAGE_RESULT ? scenario.finalMessage : "";
    }

    if (this.refs.progressLabel) this.refs.progressLabel.textContent = viewModel.progressLabel;
    if (this.refs.resultPanel) {
      const visible = stage === SDG15_STAGE_RESULT;
      this.refs.resultPanel.setAttribute("aria-hidden", visible ? "false" : "true");
    }
    if (this.refs.resultTitle) this.refs.resultTitle.textContent = scenario.title;
    if (this.refs.resultMessage) this.refs.resultMessage.textContent = scenario.finalMessage;
    if (this.refs.habitatValue) this.refs.habitatValue.textContent = scenario.habitat;
    if (this.refs.regionValue) this.refs.regionValue.textContent = scenario.region;
    if (this.refs.pressureValue) this.refs.pressureValue.textContent = `${scenario.pressureScore}/100`;
    if (this.refs.habitatCopy) this.refs.habitatCopy.textContent = scenario.habitatDetail;
    if (this.refs.speciesList) {
      this.refs.speciesList.innerHTML = renderSdg15SpeciesItems(viewModel.species);
    }
    if (this.refs.sourceList) {
      this.refs.sourceList.innerHTML = renderSdg15SourceItems(viewModel.sourceItems);
    }
  }

  render() {
    if (!this.host) return;
    this.state = createSdg15InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
  }

  destroy() {
    this.clearResultTimer();
    if (this.host) {
      this.host.removeEventListener("click", this.boundHandleClick);
    }
    this.setThemeActive(false);
    this.setTitleSectorHidden(false);
    this.host = null;
    this.refs = {};
  }
}
