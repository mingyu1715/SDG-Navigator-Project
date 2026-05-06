import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG16_MODEL_NOTE,
  SDG16_STAGE_INTRO,
  SDG16_STAGE_RESULT,
  calculateSdg16Scenario,
  formatSdg16CurrentTime,
  createSdg16InitialState,
  renderSdg16Hotspots,
  renderSdg16SourceItems,
  resetSdg16Experience,
  runSdg16Experience,
  setSdg16Time
} from "./sdg16ContentModel.js";

export class Sdg16DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg16";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg16InitialState();
    this.boundHandleClick = (event) => this.handleClick(event);
    this.boundHandleTimeChange = (event) => this.handleTimeChange(event);
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg16-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg16-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg16-exp" data-role="root" data-stage="${SDG16_STAGE_INTRO}">
        <div class="sdg16-scene" aria-label="평화로운 일상과 분쟁 충격 시각화">
          <div class="sdg16-morning-light" aria-hidden="true"></div>
          <div class="sdg16-window" aria-hidden="true">
            <span class="sdg16-window-frame is-vertical"></span>
            <span class="sdg16-window-frame is-horizontal"></span>
          </div>
          <div class="sdg16-city" aria-hidden="true">
            <span class="sdg16-building is-1"></span>
            <span class="sdg16-building is-2"></span>
            <span class="sdg16-building is-3"></span>
            <span class="sdg16-building is-4"></span>
            <span class="sdg16-building is-5"></span>
          </div>
          <div class="sdg16-foreground" aria-hidden="true">
            <span class="sdg16-bench"></span>
            <span class="sdg16-person is-1"></span>
            <span class="sdg16-person is-2"></span>
          </div>
          <div class="sdg16-map" aria-hidden="true">
            <span class="sdg16-map-mass is-1"></span>
            <span class="sdg16-map-mass is-2"></span>
            <span class="sdg16-map-mass is-3"></span>
            <span class="sdg16-map-mass is-4"></span>
            <span class="sdg16-hotspot-layer" data-role="hotspotLayer"></span>
          </div>
        </div>

        <header class="sdg16-hero" aria-labelledby="sdg16Title">
          <p class="sdg16-goal-label">SDG GOAL 16</p>
          <h3 id="sdg16Title" class="sdg16-title">The Silence of Conflict</h3>
          <p class="sdg16-subtitle">침묵의 총성</p>
          <p class="sdg16-lead">평화로운 일상 뒤편에서 지금도 흔들리는 세계의 현실을 현재 시각으로 환산해 봅니다.</p>
        </header>

        <section class="sdg16-control-panel" aria-label="현재 시각 입력">
          <div class="sdg16-panel-head">
            <div>
              <p class="sdg16-kicker">Input</p>
              <h4>지금 몇 시 몇 분인가요?</h4>
            </div>
            <span data-role="progressLabel">대기 중</span>
          </div>
          <div class="sdg16-time-row">
            <label class="sdg16-time-field">
              <span>현재 시각</span>
              <input type="time" data-role="timeInput" aria-label="현재 시각">
            </label>
            <button type="button" class="sdg16-now-btn" data-action="setNow">지금</button>
          </div>
          <button type="button" class="sdg16-primary-btn" data-action="runExperience">이 순간 보기</button>
        </section>

        <section class="sdg16-result-panel" data-role="resultPanel" aria-label="분쟁과 폭력 통계 결과" aria-hidden="true">
          <div class="sdg16-result-head">
            <div>
              <p class="sdg16-kicker">Output</p>
              <h4 data-role="resultTitle">침묵 뒤의 통계</h4>
            </div>
            <button type="button" class="sdg16-reset-btn" data-action="reset">처음으로</button>
          </div>
          <p class="sdg16-result-copy" data-role="resultCopy"></p>
          <div class="sdg16-metric-grid">
            <article>
              <span>오늘 00:00부터</span>
              <strong data-role="conflictValue">-</strong>
              <small data-role="conflictBasis">분쟁 관련 사망 환산</small>
            </article>
            <article>
              <span>보호 대상 사망</span>
              <strong data-role="protectedValue">-</strong>
              <small>인권옹호자·언론인·노동조합원</small>
            </article>
            <article>
              <span>의도적 살인율</span>
              <strong data-role="homicideRate">-</strong>
              <small>2023년 공식 지표</small>
            </article>
            <article>
              <span>강제 이주 상태</span>
              <strong data-role="displacedValue">-</strong>
              <small>2024년 말 기준</small>
            </article>
          </div>
          <p class="sdg16-model-note">${escapeHtml(SDG16_MODEL_NOTE)}</p>
          <div class="sdg16-source-list" data-role="sourceList"></div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      hotspotLayer: get("hotspotLayer"),
      timeInput: get("timeInput"),
      progressLabel: get("progressLabel"),
      resultPanel: get("resultPanel"),
      resultTitle: get("resultTitle"),
      resultCopy: get("resultCopy"),
      conflictValue: get("conflictValue"),
      conflictBasis: get("conflictBasis"),
      protectedValue: get("protectedValue"),
      homicideRate: get("homicideRate"),
      displacedValue: get("displacedValue"),
      sourceList: get("sourceList")
    };
  }

  bindEvents() {
    this.host.addEventListener("click", this.boundHandleClick);
    this.refs.timeInput?.addEventListener("change", this.boundHandleTimeChange);
  }

  handleClick(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !this.host?.contains(actionTarget)) return;

    const action = actionTarget.dataset.action;
    if (action === "setNow") {
      const currentTime = formatSdg16CurrentTime();
      this.state = setSdg16Time(this.state, currentTime);
      this.renderAll();
      return;
    }

    if (action === "runExperience") {
      this.state = runSdg16Experience(this.state, this.refs.timeInput?.value);
      this.renderAll();
      return;
    }

    if (action === "reset") {
      this.state = resetSdg16Experience();
      this.renderAll();
    }
  }

  handleTimeChange(event) {
    this.state = setSdg16Time(this.state, event.target.value);
    this.renderAll();
  }

  renderAll() {
    const result = calculateSdg16Scenario(this.state);

    if (this.refs.root) {
      this.refs.root.dataset.stage = result.stage;
      this.refs.root.style.setProperty("--sdg16-impact", result.impactLevel.toFixed(2));
      this.refs.root.style.setProperty("--sdg16-hotspots", result.hotspotCount);
    }

    if (this.refs.hotspotLayer) {
      this.refs.hotspotLayer.innerHTML = renderSdg16Hotspots(result.visibleHotspots);
    }
    if (this.refs.timeInput) this.refs.timeInput.value = result.timeValue;
    if (this.refs.progressLabel) {
      this.refs.progressLabel.textContent = result.stage === SDG16_STAGE_INTRO
        ? "대기 중"
        : `${result.timeLabel} 기준`;
    }
    if (this.refs.resultPanel) {
      const visible = result.stage === SDG16_STAGE_RESULT;
      this.refs.resultPanel.setAttribute("aria-hidden", visible ? "false" : "true");
    }
    if (this.refs.resultTitle) this.refs.resultTitle.textContent = `${result.timeLabel}의 침묵`;
    if (this.refs.resultCopy) this.refs.resultCopy.textContent = result.resultCopy;
    if (this.refs.conflictValue) this.refs.conflictValue.textContent = result.conflictExpectedLabel;
    if (this.refs.conflictBasis) this.refs.conflictBasis.textContent = result.conflictIntervalLabel;
    if (this.refs.protectedValue) this.refs.protectedValue.textContent = result.protectedExpectedLabel;
    if (this.refs.homicideRate) this.refs.homicideRate.textContent = result.homicideRateLabel;
    if (this.refs.displacedValue) this.refs.displacedValue.textContent = result.displacedLabel;
    if (this.refs.sourceList) this.refs.sourceList.innerHTML = renderSdg16SourceItems(result.sourceItems);
  }

  render() {
    if (!this.host) return;
    this.state = createSdg16InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
  }

  destroy() {
    if (this.host) {
      this.host.removeEventListener("click", this.boundHandleClick);
    }
    this.refs.timeInput?.removeEventListener("change", this.boundHandleTimeChange);
    this.setThemeActive(false);
    this.setTitleSectorHidden(false);
    this.host = null;
    this.refs = {};
  }
}
