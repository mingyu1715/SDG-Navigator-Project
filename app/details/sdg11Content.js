import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG11_CONTROLS,
  SDG11_INTENSITY,
  SDG11_MODEL_NOTE,
  SDG11_STAGE_INTRO,
  SDG11_STRATEGIES,
  calculateSdg11Scenario,
  createSdg11InitialState,
  formatSdg11AirDelta,
  formatSdg11Delta,
  renderSdg11ResourceItems,
  resetSdg11Planner,
  selectSdg11Strategy,
  startSdg11Experience,
  updateSdg11Intensity
} from "./sdg11ContentModel.js";

function renderSdg11Strategies() {
  return SDG11_STRATEGIES.map((strategy) => `
    <button type="button" class="sdg11-strategy-btn" data-strategy="${escapeHtml(strategy.key)}">
      <span>${escapeHtml(strategy.label)}</span>
      <strong>${escapeHtml(strategy.title)}</strong>
      <small>${escapeHtml(strategy.copy)}</small>
    </button>
  `).join("");
}

function renderSdg11MixRows() {
  return SDG11_CONTROLS.map((control) => `
    <article class="sdg11-mix-row">
      <span>${escapeHtml(control.shortLabel)}</span>
      <div class="sdg11-mix-bar" aria-hidden="true">
        <i data-mix-fill="${escapeHtml(control.key)}"></i>
      </div>
      <strong data-mix-value="${escapeHtml(control.key)}">${control.defaultValue}${escapeHtml(control.unit)}</strong>
    </article>
  `).join("");
}

function renderSdg11CityCells(cells) {
  return cells.map((cell) => {
    const classes = ["sdg11-city-cell"];
    if (cell.isPark) classes.push("is-park");
    if (cell.isTransit) classes.push("is-transit");
    if (cell.isRecycle) classes.push("is-recycle");
    if (cell.isCivic) classes.push("is-civic");

    return `
      <span class="${classes.join(" ")}" data-cell="${cell.index}">
        ${cell.isRecycle ? "<span class=\"sdg11-recycle-mark\">R</span>" : ""}
        ${cell.hasWalker ? "<span class=\"sdg11-walker\"></span>" : ""}
      </span>
    `;
  }).join("");
}

export class Sdg11DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg11";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg11InitialState();
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg11-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg11-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg11-exp" data-role="root" data-stage="${SDG11_STAGE_INTRO}" data-tone="bad">
        <div class="sdg11-city-scene" aria-hidden="true">
          <div class="sdg11-smog-layer"></div>
          <div class="sdg11-city-grid" data-role="cityGrid"></div>
          <div class="sdg11-bus-stream">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <header class="sdg11-title-panel" aria-labelledby="sdg11Title">
          <p class="sdg11-goal-label">SDG GOAL 11</p>
          <h3 id="sdg11Title" class="sdg11-title">City Planner</h3>
          <p class="sdg11-subtitle">스마트 그린 시티 설계</p>
          <p class="sdg11-lead">회색 격자 도시를 공원, 대중교통, 재활용 거점으로 채워 시민의 생활감과 대기질이 어떻게 달라지는지 확인합니다.</p>
          <button type="button" class="sdg11-primary-btn" data-role="introButton">도시 설계 시작</button>
        </header>

        <section class="sdg11-dashboard" aria-label="도시 계획 대시보드">
          <div class="sdg11-dashboard-head">
            <div>
              <p class="sdg11-kicker">Planner Board</p>
              <h4>도시 구성과 결과</h4>
            </div>
            <span>전략과 강도만 정하면 세 비율이 자동 배분됩니다</span>
          </div>

          <div class="sdg11-dashboard-grid">
            <section class="sdg11-control-panel" aria-label="도시 구성 요소 조절">
              <div class="sdg11-panel-head">
                <p class="sdg11-kicker">Strategy</p>
                <button type="button" class="sdg11-secondary-btn" data-role="resetButton">기본값</button>
              </div>
              <div class="sdg11-strategy-list" data-role="strategyList">
                ${renderSdg11Strategies()}
              </div>
              <label class="sdg11-intensity-control" for="sdg11Intensity">
                <span class="sdg11-control-head">
                  <strong>전환 강도</strong>
                  <output data-role="intensityValue">${SDG11_INTENSITY.defaultValue}%</output>
                </span>
                <input
                  id="sdg11Intensity"
                  type="range"
                  min="${SDG11_INTENSITY.min}"
                  max="${SDG11_INTENSITY.max}"
                  step="${SDG11_INTENSITY.step}"
                  value="${SDG11_INTENSITY.defaultValue}"
                  data-role="intensityRange"
                >
              </label>
              <div class="sdg11-mix-list" aria-label="자동 배분 비율">
                ${renderSdg11MixRows()}
              </div>
            </section>

            <section class="sdg11-result-panel" aria-label="도시 결과">
              <div class="sdg11-result-head">
                <div>
                  <p class="sdg11-kicker">Output</p>
                  <h4 data-role="statusLabel">회색 도시 경고</h4>
                </div>
                <span class="sdg11-status-pill" data-role="toneLabel">PM2.5</span>
              </div>
              <p class="sdg11-summary" data-role="summaryText">-</p>
              <div class="sdg11-result-grid">
                <article>
                  <span>행복 지수</span>
                  <strong data-role="happinessValue">0</strong>
                  <small data-role="happinessDelta">0</small>
                </article>
                <article>
                  <span>미세먼지 PM2.5</span>
                  <strong data-role="pm25Value">0</strong>
                  <small data-role="pm25Delta">0</small>
                </article>
              </div>
              <p class="sdg11-result-message" data-role="plannerMessage">-</p>
              <p class="sdg11-model-note">${escapeHtml(SDG11_MODEL_NOTE)}</p>
              <div class="sdg11-resource-list">
                ${renderSdg11ResourceItems()}
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      cityGrid: get("cityGrid"),
      introButton: get("introButton"),
      strategyList: get("strategyList"),
      intensityRange: get("intensityRange"),
      intensityValue: get("intensityValue"),
      resetButton: get("resetButton"),
      statusLabel: get("statusLabel"),
      toneLabel: get("toneLabel"),
      summaryText: get("summaryText"),
      plannerMessage: get("plannerMessage"),
      happinessValue: get("happinessValue"),
      happinessDelta: get("happinessDelta"),
      pm25Value: get("pm25Value"),
      pm25Delta: get("pm25Delta")
    };
  }

  bindEvents() {
    this.refs.introButton?.addEventListener("click", () => {
      this.state = startSdg11Experience(this.state);
      this.renderAll();
    });

    this.refs.strategyList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-strategy]");
      if (!button || !this.refs.strategyList.contains(button)) return;
      this.state = selectSdg11Strategy(this.state, button.dataset.strategy);
      this.renderAll();
    });

    this.refs.intensityRange?.addEventListener("input", () => {
      this.state = updateSdg11Intensity(this.state, this.refs.intensityRange.value);
      this.renderAll();
    });

    this.refs.resetButton?.addEventListener("click", () => {
      this.state = resetSdg11Planner(this.state);
      this.renderAll();
    });
  }

  renderInputs(scenario) {
    const settings = scenario.settings;

    this.host.querySelectorAll("[data-strategy]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.strategy === scenario.strategy.key);
    });

    if (this.refs.intensityRange) this.refs.intensityRange.value = scenario.intensity;
    if (this.refs.intensityValue) this.refs.intensityValue.textContent = `${scenario.intensity}%`;

    SDG11_CONTROLS.forEach((control) => {
      const value = settings[control.key];
      const fill = this.host.querySelector(`[data-mix-fill="${control.key}"]`);
      const output = this.host.querySelector(`[data-mix-value="${control.key}"]`);
      if (fill) fill.style.inlineSize = `${value}%`;
      if (output) output.textContent = `${value}${control.unit}`;
    });
  }

  renderAll() {
    const scenario = calculateSdg11Scenario(this.state);

    if (this.refs.root) {
      this.refs.root.dataset.stage = scenario.stage;
      this.refs.root.dataset.tone = scenario.tone;
      this.refs.root.style.setProperty("--sdg11-smog", scenario.smogLevel.toFixed(2));
    }
    if (this.refs.cityGrid) this.refs.cityGrid.innerHTML = renderSdg11CityCells(scenario.cells);
    if (this.refs.statusLabel) this.refs.statusLabel.textContent = scenario.statusLabel;
    if (this.refs.toneLabel) this.refs.toneLabel.textContent = `${scenario.metrics.pm25} ug/m3`;
    if (this.refs.summaryText) this.refs.summaryText.textContent = scenario.summary;
    if (this.refs.plannerMessage) this.refs.plannerMessage.textContent = scenario.plannerMessage;
    if (this.refs.happinessValue) this.refs.happinessValue.textContent = scenario.metrics.happiness;
    if (this.refs.happinessDelta) {
      this.refs.happinessDelta.textContent = `초기 대비 ${formatSdg11Delta(scenario.deltas.happiness)}`;
    }
    if (this.refs.pm25Value) this.refs.pm25Value.textContent = `${scenario.metrics.pm25}`;
    if (this.refs.pm25Delta) {
      this.refs.pm25Delta.textContent = formatSdg11AirDelta(scenario.deltas.pm25);
    }

    this.renderInputs(scenario);
  }

  render() {
    if (!this.host) return;
    this.state = createSdg11InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
  }

  reset() {
    this.state = createSdg11InitialState();
    this.renderAll();
  }

  destroy() {
    this.refs = {};
    this.state = createSdg11InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);
    if (this.host) this.host.innerHTML = "";
  }
}
