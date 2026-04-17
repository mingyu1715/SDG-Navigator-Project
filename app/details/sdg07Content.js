import { toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG07_STAGE_EXPERIENCE,
  SDG07_STAGE_INTRO,
  calculateSdg07Scenario,
  createSdg07InitialState,
  createSdg07MixFromTransitionLevel,
  formatSdg07Percent,
  normalizeSdg07TransitionLevel
} from "./sdg07ContentModel.js";

const SDG07_STAGE_OUTRO_MS = 1300;
const SDG07_RESULT_REVEAL_MS = 560;
const SDG07_RESOURCE_ITEMS = Object.freeze([
  {
    source: "UN SDG",
    title: "Goal 7: Affordable and Clean Energy",
    href: "https://sdgs.un.org/goals/goal7"
  },
  {
    source: "IEA",
    title: "Tracking SDG 7: The Energy Progress Report",
    href: "https://www.iea.org/reports/tracking-sdg7-the-energy-progress-report-2024"
  },
  {
    source: "IRENA",
    title: "Renewable Capacity Statistics",
    href: "https://www.irena.org/Publications"
  }
]);

function renderSdg07ResourceItems() {
  return SDG07_RESOURCE_ITEMS.map((item) => {
    return `
      <a class="sdg07-resource-link" href="${item.href}" target="_blank" rel="noopener noreferrer">
        <span class="sdg07-resource-source">${item.source}</span>
        <span class="sdg07-resource-title">${item.title}</span>
      </a>
    `;
  }).join("");
}

function renderSdg07CityStage(role, extraClass = "") {
  return `
    <div class="sdg07-city-stage ${extraClass}" data-role="${role}" role="img" aria-label="도시 시각화">
      <div class="sdg07-sun-glow" aria-hidden="true"></div>
      <div class="sdg07-sun-core" aria-hidden="true"></div>

      <div class="sdg07-cloud sdg07-cloud-a" aria-hidden="true"></div>
      <div class="sdg07-cloud sdg07-cloud-b" aria-hidden="true"></div>
      <div class="sdg07-cloud sdg07-cloud-c" aria-hidden="true"></div>

      <div class="sdg07-haze" aria-hidden="true"></div>
      <div class="sdg07-smog sdg07-smog-a" aria-hidden="true"></div>
      <div class="sdg07-smog sdg07-smog-b" aria-hidden="true"></div>

      <div class="sdg07-turbine-row" aria-hidden="true">
        <div class="sdg07-turbine is-large">
          <span class="sdg07-turbine-mast"></span>
          <span class="sdg07-turbine-hub">
            <span class="sdg07-turbine-blade is-one"></span>
            <span class="sdg07-turbine-blade is-two"></span>
            <span class="sdg07-turbine-blade is-three"></span>
          </span>
        </div>
        <div class="sdg07-turbine">
          <span class="sdg07-turbine-mast"></span>
          <span class="sdg07-turbine-hub">
            <span class="sdg07-turbine-blade is-one"></span>
            <span class="sdg07-turbine-blade is-two"></span>
            <span class="sdg07-turbine-blade is-three"></span>
          </span>
        </div>
      </div>

      <div class="sdg07-smokestack-group" aria-hidden="true">
        <div class="sdg07-stack">
          <span class="sdg07-stack-body"></span>
          <span class="sdg07-stack-plume"></span>
        </div>
        <div class="sdg07-stack is-small">
          <span class="sdg07-stack-body"></span>
          <span class="sdg07-stack-plume"></span>
        </div>
      </div>

      <div class="sdg07-solar-farm" aria-hidden="true">
        <span class="sdg07-solar-panel"></span>
        <span class="sdg07-solar-panel"></span>
        <span class="sdg07-solar-panel"></span>
        <span class="sdg07-solar-panel"></span>
      </div>

      <div class="sdg07-skyline" aria-hidden="true">
        <span class="sdg07-building is-1"></span>
        <span class="sdg07-building is-2"></span>
        <span class="sdg07-building is-3"></span>
        <span class="sdg07-building is-4"></span>
        <span class="sdg07-building is-5"></span>
        <span class="sdg07-building is-6"></span>
        <span class="sdg07-building is-7"></span>
      </div>

      <div class="sdg07-ground" aria-hidden="true"></div>
    </div>
  `;
}

export class Sdg07DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg07";
    this.frameMode = "generic";

    this.refs = {};
    this.state = createSdg07InitialState();
    this.disposeRequested = false;
    this.stageSwitchTimerId = null;
    this.startButtonLabel = "시작하기";
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg07-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg07-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg07-exp" data-role="root" data-stage="${this.state.stage}">
        <section
          class="sdg07-stage sdg07-stage-intro"
          data-role="introStage"
          data-active="${this.state.stage === SDG07_STAGE_INTRO ? "true" : "false"}"
        >
          <div class="sdg07-hero-stage">
            ${renderSdg07CityStage("introCityStage", "is-hero-blur")}
            <div class="sdg07-hero-veil" aria-hidden="true"></div>

            <div class="sdg07-hero-copy">
              <section class="sdg07-panel sdg07-master-panel" aria-labelledby="sdg07MasterTitle">
                <div class="sdg07-panel-head">
                  <div class="sdg07-panel-head-copy">
                    <p class="sdg07-kicker">Control Panel</p>
                    <h3 id="sdg07MasterTitle" class="sdg07-panel-title">전환 레벨</h3>
                  </div>
                  <strong class="sdg07-master-level" data-role="transitionLevelValue">0%</strong>
                </div>

                <input
                  class="sdg07-range is-master"
                  data-role="transitionRange"
                  data-energy="solar"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="${this.state.transitionLevel}"
                  aria-label="에너지 전환 레벨"
                />

                <div class="sdg07-master-meta" aria-hidden="true">
                  <span>화력 중심</span>
                  <span>재생에너지 중심</span>
                </div>

                <button type="button" class="sdg07-primary-btn" data-role="confirmButton">${this.startButtonLabel}</button>
              </section>
            </div>
          </div>
        </section>

        <section
          class="sdg07-stage sdg07-stage-result"
          data-role="resultStage"
          data-active="${this.state.stage === SDG07_STAGE_EXPERIENCE ? "true" : "false"}"
          aria-hidden="true"
        >
          <div class="sdg07-result-visual">
            ${renderSdg07CityStage("cityStage", "is-result-visual")}

            <div class="sdg07-result-overlay">
              <div class="sdg07-result-stack">
                <aside
                  class="sdg07-panel sdg07-result-panel"
                  data-role="resultPanel"
                  aria-labelledby="sdg07ResultTitle"
                  aria-live="polite"
                >
                  <div class="sdg07-panel-head">
                    <div class="sdg07-panel-head-copy">
                      <p class="sdg07-kicker">Result</p>
                      <h3 id="sdg07ResultTitle" class="sdg07-panel-title">전환 결과 확인</h3>
                      <p class="sdg07-panel-copy" data-role="visualCaption">도시가 에너지 전환에 맞춰 반응합니다.</p>
                    </div>
                    <button type="button" class="sdg07-secondary-btn sdg07-reset-btn" data-role="resetButton">다시 조절하기</button>
                  </div>

                  <div class="sdg07-status-row">
                    <span class="sdg07-status-pill" data-role="dominantSource">-</span>
                    <span class="sdg07-status-pill is-carbon" data-role="carbonBadge">탄소 절감 0%</span>
                  </div>

                  <div class="sdg07-mix-balance" aria-label="현재 에너지 비율">
                    <div class="sdg07-mix-bar">
                      <span class="sdg07-mix-segment is-solar" data-role="solarSegment"></span>
                      <span class="sdg07-mix-segment is-wind" data-role="windSegment"></span>
                      <span class="sdg07-mix-segment is-thermal" data-role="thermalSegment"></span>
                    </div>
                    <div class="sdg07-mix-meta">
                      <span class="sdg07-mix-total">총합 100%</span>
                      <strong class="sdg07-mix-renewable" data-role="renewableSummary">재생에너지 0%</strong>
                    </div>
                  </div>

                  <article class="sdg07-result-card" data-role="airCard" data-tone="moderate">
                    <div class="sdg07-result-head">
                      <span class="sdg07-result-label">공기질 등급</span>
                      <strong class="sdg07-result-main" data-role="airLabel">보통</strong>
                    </div>
                    <div class="sdg07-meter" aria-hidden="true">
                      <span class="sdg07-meter-fill" data-role="airMeterFill"></span>
                    </div>
                    <p class="sdg07-result-meta" data-role="airScore">0 / 100</p>
                  </article>

                  <article class="sdg07-result-card sdg07-result-card-carbon" data-role="carbonCard">
                    <div class="sdg07-result-head">
                      <span class="sdg07-result-label">탄소 절감량</span>
                      <strong class="sdg07-result-main" data-role="carbonValue">0%</strong>
                    </div>
                    <div class="sdg07-meter" aria-hidden="true">
                      <span class="sdg07-meter-fill" data-role="carbonMeterFill"></span>
                    </div>
                    <p class="sdg07-result-copy" data-role="carbonDescription">탄소 절감량이 여기에 표시됩니다.</p>
                  </article>
                </aside>

                <section class="sdg07-panel sdg07-inline-info sdg07-result-extra" aria-label="추가 정보">
                  <article class="sdg07-inline-info-card">
                    <p class="sdg07-inline-overline">추가 정보</p>
                    <p class="sdg07-inline-body" data-role="impactLine">재생에너지 비율에 따라 공기질과 탄소 부담이 함께 달라집니다.</p>
                    <p class="sdg07-inline-sub" data-role="actionLine">전환 결과를 바탕으로 다음 선택을 비교해 보세요.</p>
                  </article>

                  <article class="sdg07-inline-info-card">
                    <p class="sdg07-inline-overline">관련 자료</p>
                    <div class="sdg07-resource-list">
                      ${renderSdg07ResourceItems()}
                    </div>
                  </article>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);

    this.refs = {
      root: get("root"),
      introStage: get("introStage"),
      resultStage: get("resultStage"),
      introCityStage: get("introCityStage"),
      transitionRange: get("transitionRange"),
      transitionLevelValue: get("transitionLevelValue"),
      confirmButton: get("confirmButton"),
      resetButton: get("resetButton"),
      resultPanel: get("resultPanel"),
      cityStage: get("cityStage"),
      visualCaption: get("visualCaption"),
      dominantSource: get("dominantSource"),
      carbonBadge: get("carbonBadge"),
      solarSegment: get("solarSegment"),
      windSegment: get("windSegment"),
      thermalSegment: get("thermalSegment"),
      renewableSummary: get("renewableSummary"),
      resultSolarValue: get("resultSolarValue"),
      resultWindValue: get("resultWindValue"),
      resultThermalValue: get("resultThermalValue"),
      airCard: get("airCard"),
      airLabel: get("airLabel"),
      airMeterFill: get("airMeterFill"),
      airDescription: get("airDescription"),
      airScore: get("airScore"),
      carbonValue: get("carbonValue"),
      carbonMeterFill: get("carbonMeterFill"),
      carbonDescription: get("carbonDescription"),
      impactLine: get("impactLine"),
      actionLine: get("actionLine")
    };
  }

  bindEvents() {
    if (this.refs.transitionRange) {
      this.refs.transitionRange.addEventListener("input", (event) => {
        this.updateTransitionLevel(event.currentTarget.value);
      });
    }

    if (this.refs.confirmButton) {
      this.refs.confirmButton.addEventListener("click", () => {
        this.showResults();
      });
    }

    if (this.refs.resetButton) {
      this.refs.resetButton.addEventListener("click", () => {
        this.resetExperience();
      });
    }
  }

  shouldReduceMotion() {
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  }

  clearStageSwitch() {
    if (this.stageSwitchTimerId) {
      window.clearTimeout(this.stageSwitchTimerId);
      this.stageSwitchTimerId = null;
    }
    this.state.transition = null;
    this.refs.root?.removeAttribute("data-transition");
    this.setStartButtonBusy(false);
  }

  setStartButtonBusy(busy) {
    if (!this.refs.confirmButton) return;
    this.refs.confirmButton.disabled = Boolean(busy);
    this.refs.confirmButton.textContent = busy ? "도시 전환 중..." : this.startButtonLabel;
  }

  animateResultStage(reduceMotion = false) {
    const target = this.refs.resultPanel || this.refs.resultStage;
    if (reduceMotion || typeof target?.animate !== "function") return;
    target.animate(
      [
        { opacity: 0, transform: "translateY(24px) scale(0.98)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ],
      {
        duration: SDG07_RESULT_REVEAL_MS,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards"
      }
    );
  }

  setStage(stage) {
    const nextStage = stage === SDG07_STAGE_EXPERIENCE ? SDG07_STAGE_EXPERIENCE : SDG07_STAGE_INTRO;
    this.state.stage = nextStage;
    this.state.hasStarted = nextStage === SDG07_STAGE_EXPERIENCE;

    if (this.refs.root) {
      this.refs.root.dataset.stage = nextStage;
    }

    const stageMap = [
      [SDG07_STAGE_INTRO, this.refs.introStage],
      [SDG07_STAGE_EXPERIENCE, this.refs.resultStage]
    ];

    stageMap.forEach(([name, node]) => {
      if (!node) return;
      const active = name === nextStage;
      node.dataset.active = active ? "true" : "false";
      node.setAttribute("aria-hidden", active ? "false" : "true");
    });

    this.setTitleSectorHidden(nextStage === SDG07_STAGE_EXPERIENCE);
  }

  updateTransitionLevel(nextValue) {
    const transitionLevel = normalizeSdg07TransitionLevel(nextValue);
    this.state.transitionLevel = transitionLevel;
    this.state.mix = createSdg07MixFromTransitionLevel(transitionLevel);
    this.renderScenario();
  }

  showResults() {
    if (this.state.transition || this.state.stage === SDG07_STAGE_EXPERIENCE) return;

    const reduceMotion = this.shouldReduceMotion();
    const stageSwitchDelay = reduceMotion ? 0 : SDG07_STAGE_OUTRO_MS;

    this.state.transition = "stage-outro";
    if (!reduceMotion) {
      this.refs.root?.setAttribute("data-transition", "stage-outro");
    }
    this.setTitleSectorHidden(true);
    this.setStartButtonBusy(true);

    const switchToResult = () => {
      if (this.disposeRequested) return;
      this.refs.root?.removeAttribute("data-transition");
      this.setStage(SDG07_STAGE_EXPERIENCE);
      this.renderScenario();
      this.setStartButtonBusy(false);
      this.state.transition = null;
      this.animateResultStage(reduceMotion);
    };

    if (stageSwitchDelay <= 0) {
      switchToResult();
      return;
    }

    this.stageSwitchTimerId = window.setTimeout(() => {
      this.stageSwitchTimerId = null;
      switchToResult();
    }, stageSwitchDelay);
  }

  resetExperience() {
    this.clearStageSwitch();
    this.state = createSdg07InitialState();
    this.renderScenario();
    this.setStage(SDG07_STAGE_INTRO);
    this.refs.transitionRange?.focus();
  }

  updateTransitionInput(transitionLevel) {
    if (this.refs.transitionRange) {
      this.refs.transitionRange.value = String(transitionLevel);
      this.refs.transitionRange.style.setProperty("--sdg07-slider-progress", `${transitionLevel}%`);
      this.refs.transitionRange.setAttribute("aria-label", `재생에너지 ${formatSdg07Percent(transitionLevel)}`);
    }

    if (this.refs.transitionLevelValue) {
      this.refs.transitionLevelValue.textContent = formatSdg07Percent(transitionLevel);
    }
  }

  updateMixBar(scenario) {
    if (this.refs.solarSegment) {
      this.refs.solarSegment.style.width = `${scenario.mix.solar}%`;
    }
    if (this.refs.windSegment) {
      this.refs.windSegment.style.width = `${scenario.mix.wind}%`;
    }
    if (this.refs.thermalSegment) {
      this.refs.thermalSegment.style.width = `${scenario.mix.thermal}%`;
    }
  }

  applyVisualState(scenario) {
    const root = this.refs.root;
    if (!root) return;

    const visual = scenario.visual;
    root.style.setProperty("--sdg07-sky-top", visual.skyTop);
    root.style.setProperty("--sdg07-sky-bottom", visual.skyBottom);
    root.style.setProperty("--sdg07-cloud-color", visual.cloudColor);
    root.style.setProperty("--sdg07-haze-opacity", String(visual.hazeOpacity));
    root.style.setProperty("--sdg07-smog-opacity", String(visual.smogOpacity));
    root.style.setProperty("--sdg07-smog-shift", visual.smogShift);
    root.style.setProperty("--sdg07-sun-opacity", String(visual.sunOpacity));
    root.style.setProperty("--sdg07-sun-scale", String(visual.sunScale));
    root.style.setProperty("--sdg07-sun-glow-opacity", String(visual.sunGlowOpacity));
    root.style.setProperty("--sdg07-skyline-brightness", String(visual.skylineBrightness));
    root.style.setProperty("--sdg07-skyline-saturation", String(visual.skylineSaturation));
    root.style.setProperty("--sdg07-window-opacity", String(visual.windowOpacity));
    root.style.setProperty("--sdg07-window-glow", String(visual.windowGlow));
    root.style.setProperty("--sdg07-solar-opacity", String(visual.solarOpacity));
    root.style.setProperty("--sdg07-solar-glow", String(visual.solarGlow));
    root.style.setProperty("--sdg07-turbine-duration", visual.turbineDuration);
    root.style.setProperty("--sdg07-turbine-opacity", String(visual.turbineOpacity));
    root.style.setProperty("--sdg07-turbine-scale", String(visual.turbineScale));
    root.style.setProperty("--sdg07-smoke-opacity", String(visual.smokeOpacity));
    root.style.setProperty("--sdg07-smoke-scale", String(visual.smokeScale));
    root.style.setProperty("--sdg07-smoke-lift", visual.smokeLift);
  }

  updateIntroCards(scenario) {
    if (this.refs.introCityStage) this.refs.introCityStage.setAttribute("aria-label", scenario.visualCaption);
  }

  updateResultCards(scenario) {
    if (this.refs.resultSolarValue) this.refs.resultSolarValue.textContent = formatSdg07Percent(scenario.mix.solar);
    if (this.refs.resultWindValue) this.refs.resultWindValue.textContent = formatSdg07Percent(scenario.mix.wind);
    if (this.refs.resultThermalValue) this.refs.resultThermalValue.textContent = formatSdg07Percent(scenario.mix.thermal);
    if (this.refs.renewableSummary) this.refs.renewableSummary.textContent = `재생에너지 ${scenario.renewableLabel}`;
    if (this.refs.dominantSource) {
      this.refs.dominantSource.textContent = scenario.dominantSource.label;
      this.refs.dominantSource.title = scenario.dominantSource.description;
    }
    if (this.refs.carbonBadge) this.refs.carbonBadge.textContent = `탄소 절감 ${scenario.carbon.label}`;
    if (this.refs.visualCaption) this.refs.visualCaption.textContent = scenario.visualCaption;
    if (this.refs.cityStage) this.refs.cityStage.setAttribute("aria-label", scenario.visualCaption);

    if (this.refs.airCard) this.refs.airCard.dataset.tone = scenario.airQuality.tone;
    if (this.refs.airLabel) this.refs.airLabel.textContent = scenario.airQuality.label;
    if (this.refs.airMeterFill) this.refs.airMeterFill.style.width = `${scenario.airQuality.score}%`;
    if (this.refs.airDescription) this.refs.airDescription.textContent = scenario.airQuality.description;
    if (this.refs.airScore) this.refs.airScore.textContent = scenario.airQuality.meterLabel;

    if (this.refs.carbonValue) this.refs.carbonValue.textContent = scenario.carbon.label;
    if (this.refs.carbonMeterFill) this.refs.carbonMeterFill.style.width = `${scenario.carbon.score}%`;
    if (this.refs.carbonDescription) this.refs.carbonDescription.textContent = scenario.carbon.description;
    if (this.refs.impactLine) {
      this.refs.impactLine.textContent = `재생에너지 ${scenario.renewableLabel}, 화력 ${scenario.thermalLabel} 구성입니다. ${scenario.dominantSource.description}`;
    }
    if (this.refs.actionLine) {
      this.refs.actionLine.textContent =
        scenario.renewable >= 70
          ? "현재 선택은 도시 공기질과 탄소 절감을 모두 강하게 개선하는 전환 시나리오입니다."
          : scenario.renewable >= 45
            ? "전환 효과는 보이지만 화력 의존을 더 낮추면 공기질 개선 폭이 커집니다."
            : "화력 비중이 높아 결과가 제한적입니다. 슬라이더를 올려 전환 수준을 비교해 보세요.";
    }
  }

  renderScenario() {
    const scenario = calculateSdg07Scenario(this.state.mix);
    this.state.mix = scenario.mix;
    this.state.transitionLevel = scenario.renewable;

    this.applyVisualState(scenario);
    this.updateTransitionInput(this.state.transitionLevel);
    this.updateMixBar(scenario);

    if (this.state.stage === SDG07_STAGE_INTRO) {
      this.updateIntroCards(scenario);
    } else {
      this.updateResultCards(scenario);
    }
  }

  async render() {
    if (!this.host) return;

    this.disposeRequested = false;
    this.state = createSdg07InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(false);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.setStage(this.state.stage);
    this.renderScenario();
  }

  destroy() {
    this.disposeRequested = true;
    this.clearStageSwitch();
    this.refs = {};
    this.state = createSdg07InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);

    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
