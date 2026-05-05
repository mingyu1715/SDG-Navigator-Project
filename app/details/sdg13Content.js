import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG13_MODEL_NOTE,
  SDG13_STAGE_INTRO,
  calculateSdg13Scenario,
  createSdg13InitialState,
  renderSdg13LocationItems,
  renderSdg13ResourceItems,
  renderSdg13ScenarioButtons,
  resetSdg13Experience,
  selectSdg13Scenario
} from "./sdg13ContentModel.js";

export class Sdg13DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg13";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg13InitialState();
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg13-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg13-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg13-exp" data-role="root" data-stage="${SDG13_STAGE_INTRO}" data-tone="warning">
        <div class="sdg13-scene" aria-hidden="true">
          <div class="sdg13-sky">
            <span class="sdg13-heat-ring is-1"></span>
            <span class="sdg13-heat-ring is-2"></span>
          </div>
          <div class="sdg13-coastline">
            <span class="sdg13-land-strip"></span>
            <div class="sdg13-city-silhouette">
              <span class="sdg13-building is-1"></span>
              <span class="sdg13-building is-2"></span>
              <span class="sdg13-building is-3"></span>
              <span class="sdg13-building is-4"></span>
              <span class="sdg13-building is-5"></span>
              <span class="sdg13-building is-tower"></span>
              <span class="sdg13-building is-bridge"></span>
              <span class="sdg13-building is-port"></span>
            </div>
          </div>
          <div class="sdg13-water" data-role="water">
            <span class="sdg13-wave is-front"></span>
            <span class="sdg13-wave is-back"></span>
            <span class="sdg13-flood-glow"></span>
          </div>
          <div class="sdg13-rising-line" data-role="risingLine">
            <span data-role="lineLabel">현재 해안선</span>
          </div>
        </div>

        <header class="sdg13-hero" aria-labelledby="sdg13Title">
          <p class="sdg13-goal-label">SDG GOAL 13</p>
          <h3 id="sdg13Title" class="sdg13-title">The Rising Line</h3>
          <p class="sdg13-subtitle">침수 한계선</p>
          <p class="sdg13-lead">기온 상승폭이 달라질 때 해안 도시의 어느 선까지 물이 차오르는지 한 장면으로 확인합니다.</p>
        </header>

        <section class="sdg13-choice-panel" aria-label="예상 지구 기온 상승폭 선택">
          <div class="sdg13-panel-head">
            <p class="sdg13-kicker">Temperature Path</p>
            <span>상승폭을 선택하면 수면선이 이동합니다</span>
          </div>
          <div class="sdg13-scenario-grid" data-role="scenarioGrid">
            ${renderSdg13ScenarioButtons()}
          </div>
        </section>

        <section class="sdg13-result-panel" aria-label="침수 위험 결과">
          <div class="sdg13-result-head">
            <div>
              <p class="sdg13-kicker">Flood Exposure</p>
              <h4 data-role="resultTitle">-</h4>
            </div>
            <span class="sdg13-temp-pill" data-role="temperatureLabel">1.5°C</span>
          </div>
          <p class="sdg13-result-copy" data-role="resultCopy">-</p>
          <div class="sdg13-metric-grid">
            <article>
              <span>2100 해수면 참고</span>
              <strong data-role="seaLevelValue">-</strong>
              <small data-role="seaLevelBasis">-</small>
            </article>
            <article>
              <span>위험 강도</span>
              <strong data-role="riskValue">-</strong>
              <small>체험용 지표</small>
            </article>
          </div>
          <div class="sdg13-location-list" data-role="locationList"></div>
          <p class="sdg13-model-note">${escapeHtml(SDG13_MODEL_NOTE)}</p>
          <div class="sdg13-result-actions">
            <button type="button" class="sdg13-secondary-btn" data-role="resetButton">처음으로</button>
          </div>
          <div class="sdg13-resource-list">
            ${renderSdg13ResourceItems()}
          </div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      scenarioGrid: get("scenarioGrid"),
      lineLabel: get("lineLabel"),
      resultTitle: get("resultTitle"),
      temperatureLabel: get("temperatureLabel"),
      resultCopy: get("resultCopy"),
      seaLevelValue: get("seaLevelValue"),
      seaLevelBasis: get("seaLevelBasis"),
      riskValue: get("riskValue"),
      locationList: get("locationList"),
      resetButton: get("resetButton")
    };
  }

  bindEvents() {
    this.refs.scenarioGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-scenario-key]");
      if (!button || !this.refs.scenarioGrid.contains(button)) return;
      this.state = selectSdg13Scenario(this.state, button.dataset.scenarioKey);
      this.renderAll();
    });

    this.refs.resetButton?.addEventListener("click", () => {
      this.state = resetSdg13Experience();
      this.renderAll();
    });
  }

  renderScenarioButtons(result) {
    const shouldShowActive = result.stage !== SDG13_STAGE_INTRO;

    this.refs.scenarioGrid?.querySelectorAll(".sdg13-scenario-btn").forEach((button) => {
      button.classList.toggle(
        "is-active",
        shouldShowActive && button.dataset.scenarioKey === result.scenario.key
      );
    });
  }

  renderAll() {
    const result = calculateSdg13Scenario(this.state);
    const scenario = result.scenario;

    if (this.refs.root) {
      this.refs.root.dataset.stage = result.stage;
      this.refs.root.dataset.tone = scenario.tone;
      this.refs.root.style.setProperty("--sdg13-water-level", `${result.waterLevel}%`);
      this.refs.root.style.setProperty("--sdg13-risk", (scenario.riskScore / 100).toFixed(2));
    }

    if (this.refs.lineLabel) this.refs.lineLabel.textContent = result.lineLabel;
    if (this.refs.resultTitle) this.refs.resultTitle.textContent = scenario.headline;
    if (this.refs.temperatureLabel) this.refs.temperatureLabel.textContent = scenario.label;
    if (this.refs.resultCopy) this.refs.resultCopy.textContent = scenario.resultCopy;
    if (this.refs.seaLevelValue) this.refs.seaLevelValue.textContent = result.seaLevelLabel;
    if (this.refs.seaLevelBasis) this.refs.seaLevelBasis.textContent = scenario.seaLevelBasis;
    if (this.refs.riskValue) this.refs.riskValue.textContent = result.riskLabel;
    if (this.refs.locationList) {
      this.refs.locationList.innerHTML = renderSdg13LocationItems(result.visibleLocations);
    }

    this.renderScenarioButtons(result);
  }

  render() {
    if (!this.host) return;
    this.state = createSdg13InitialState();
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
