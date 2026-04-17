import { toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG08_CHOICE_AUTOMATION,
  SDG08_CHOICE_TRAINING,
  SDG08_RESULT_ANIMATION_MS,
  SDG08_STAGE_DECISION,
  SDG08_STAGE_INTRO,
  SDG08_STAGE_RESULT,
  clampSdg08,
  createSdg08InitialState,
  easeOutSdg08Cubic,
  formatSdg08Percent,
  getSdg08Result
} from "./sdg08ContentModel.js";

export class Sdg08DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg08";
    this.frameMode = "generic";

    this.refs = {};
    this.state = createSdg08InitialState();
    this.disposeRequested = false;
    this.reduceMotion = false;
    this.runVersion = 0;
    this.rafId = null;
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg08-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg08-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg08-exp" data-role="root" data-stage="${SDG08_STAGE_INTRO}" data-outcome="neutral">
        <div class="sdg08-visual-layer" aria-hidden="true">
          <div class="sdg08-signal-stack">
            <span class="sdg08-signal is-growth"></span>
            <span class="sdg08-signal is-job"></span>
          </div>
          <div class="sdg08-skyline">
            <span class="sdg08-building is-1"></span>
            <span class="sdg08-building is-2"></span>
            <span class="sdg08-building is-3"></span>
            <span class="sdg08-building is-4"></span>
            <span class="sdg08-building is-5"></span>
            <span class="sdg08-building is-6"></span>
          </div>
        </div>

        <section class="sdg08-stage sdg08-stage-intro" data-role="introStage" data-active="true" aria-hidden="false">
          <div class="sdg08-panel sdg08-intro-box">
            <p class="sdg08-kicker">Scenario</p>
            <h3 class="sdg08-title">성장과 고용의 딜레마</h3>
            <p class="sdg08-problem">경제가 성장해도, 모두의 일자리가 좋아지는 것은 아닙니다.</p>
            <p class="sdg08-copy">당신의 선택이 경제와 일자리에 어떤 영향을 주는지 체험해보세요.</p>
            <button type="button" class="sdg08-primary-btn" data-role="startButton">체험 시작</button>
          </div>
        </section>

        <section class="sdg08-stage sdg08-stage-decision" data-role="decisionStage" data-active="false" aria-hidden="true">
          <div class="sdg08-panel sdg08-decision-box">
            <p class="sdg08-kicker">Decision</p>
            <div class="sdg08-choice-wrap" role="group" aria-label="정책 선택">
              <button type="button" class="sdg08-choice-btn" data-role="automationButton" data-choice="${SDG08_CHOICE_AUTOMATION}">AI 자동화 도입</button>
              <button type="button" class="sdg08-choice-btn" data-role="trainingButton" data-choice="${SDG08_CHOICE_TRAINING}">인력 교육 투자</button>
            </div>
            <p class="sdg08-choice-note">한 번만 선택할 수 있습니다.</p>
          </div>
        </section>

        <section class="sdg08-stage sdg08-stage-result" data-role="resultStage" data-active="false" aria-hidden="true">
          <div class="sdg08-panel sdg08-result-box" aria-live="polite">
            <div class="sdg08-result-head">
              <p class="sdg08-kicker">Result</p>
              <span class="sdg08-choice-pill" data-role="choiceLabel">-</span>
            </div>
            <p class="sdg08-result-summary" data-role="resultSummary">선택 결과가 여기에 표시됩니다.</p>

            <div class="sdg08-metric-grid">
              <article class="sdg08-metric-card">
                <p class="sdg08-metric-label">경제 성장률</p>
                <div class="sdg08-gauge" aria-hidden="true">
                  <span class="sdg08-gauge-fill is-growth" data-role="growthFill"></span>
                </div>
                <p class="sdg08-metric-value" data-role="growthValue">0%</p>
              </article>

              <article class="sdg08-metric-card">
                <p class="sdg08-metric-label">일자리 질</p>
                <div class="sdg08-gauge" aria-hidden="true">
                  <span class="sdg08-gauge-fill is-job" data-role="jobFill"></span>
                </div>
                <p class="sdg08-metric-value" data-role="jobValue">0%</p>
              </article>
            </div>

            <div class="sdg08-workforce" aria-hidden="true">
              <span class="sdg08-worker"></span>
              <span class="sdg08-worker"></span>
              <span class="sdg08-worker"></span>
              <span class="sdg08-worker"></span>
              <span class="sdg08-worker"></span>
              <span class="sdg08-worker"></span>
            </div>

            <p class="sdg08-result-message" data-role="resultMessage">결과 메시지가 여기에 표시됩니다.</p>
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
      decisionStage: get("decisionStage"),
      resultStage: get("resultStage"),
      startButton: get("startButton"),
      automationButton: get("automationButton"),
      trainingButton: get("trainingButton"),
      resultSummary: get("resultSummary"),
      choiceLabel: get("choiceLabel"),
      growthFill: get("growthFill"),
      growthValue: get("growthValue"),
      jobFill: get("jobFill"),
      jobValue: get("jobValue"),
      resultMessage: get("resultMessage")
    };
  }

  bindEvents() {
    if (this.refs.startButton) {
      this.refs.startButton.addEventListener("click", () => {
        this.showDecision();
      });
    }

    const handleChoice = (event) => {
      const choice = event.currentTarget?.dataset?.choice;
      if (!choice) return;
      void this.selectDecision(choice);
    };

    if (this.refs.automationButton) {
      this.refs.automationButton.addEventListener("click", handleChoice);
    }
    if (this.refs.trainingButton) {
      this.refs.trainingButton.addEventListener("click", handleChoice);
    }
  }

  teardownRuntime() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  setStage(stage) {
    this.state.stage = stage;
    if (this.refs.root) {
      this.refs.root.dataset.stage = stage;
    }

    const stageMap = [
      [SDG08_STAGE_INTRO, this.refs.introStage],
      [SDG08_STAGE_DECISION, this.refs.decisionStage],
      [SDG08_STAGE_RESULT, this.refs.resultStage]
    ];

    stageMap.forEach(([name, node]) => {
      if (!node) return;
      const active = stage === name;
      node.dataset.active = active ? "true" : "false";
      node.setAttribute("aria-hidden", active ? "false" : "true");
    });

    this.setTitleSectorHidden(stage !== SDG08_STAGE_INTRO);
  }

  setDecisionButtonsDisabled(disabled) {
    const nextDisabled = Boolean(disabled);
    if (this.refs.automationButton) this.refs.automationButton.disabled = nextDisabled;
    if (this.refs.trainingButton) this.refs.trainingButton.disabled = nextDisabled;
  }

  showDecision() {
    if (this.state.stage !== SDG08_STAGE_INTRO || this.state.running) return;
    this.setStage(SDG08_STAGE_DECISION);
  }

  renderResultCopy(result) {
    if (this.refs.resultSummary) {
      this.refs.resultSummary.textContent = result.summary;
    }
    if (this.refs.choiceLabel) {
      this.refs.choiceLabel.textContent = result.choiceLabel;
    }
    if (this.refs.resultMessage) {
      this.refs.resultMessage.textContent = result.message;
    }
    if (this.refs.root) {
      this.refs.root.dataset.outcome = result.choice;
    }
  }

  renderMetrics(growth, jobQuality, workforceScale) {
    const safeGrowth = clampSdg08(growth, 0, 100);
    const safeJob = clampSdg08(jobQuality, 0, 100);
    const safeWorkforce = clampSdg08(workforceScale, 0.7, 1.14);

    if (this.refs.growthFill) {
      this.refs.growthFill.style.width = `${safeGrowth}%`;
    }
    if (this.refs.jobFill) {
      this.refs.jobFill.style.width = `${safeJob}%`;
    }
    if (this.refs.growthValue) {
      this.refs.growthValue.textContent = formatSdg08Percent(safeGrowth);
    }
    if (this.refs.jobValue) {
      this.refs.jobValue.textContent = formatSdg08Percent(safeJob);
    }
    if (this.refs.root) {
      this.refs.root.style.setProperty("--sdg08-workforce-scale", safeWorkforce.toFixed(4));
      this.refs.root.style.setProperty("--sdg08-growth-ratio", (safeGrowth / 100).toFixed(4));
      this.refs.root.style.setProperty("--sdg08-job-ratio", (safeJob / 100).toFixed(4));
    }
  }

  animateResult(result, runId) {
    const duration = this.reduceMotion ? 120 : SDG08_RESULT_ANIMATION_MS;
    const startAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (this.disposeRequested || runId !== this.runVersion) {
          this.rafId = null;
          resolve(false);
          return;
        }

        const progress = clampSdg08((now - startAt) / duration, 0, 1);
        const eased = this.reduceMotion ? 1 : easeOutSdg08Cubic(progress);

        let growthCurve = eased;
        let jobCurve = eased;
        let workforceCurve = eased;
        let jobInstability = 0;

        if (!this.reduceMotion && result.choice === SDG08_CHOICE_AUTOMATION) {
          growthCurve = 1 - Math.pow(1 - progress, 4.6);
          jobCurve = 1 - Math.pow(1 - progress, 1.7);
          workforceCurve = 1 - Math.pow(1 - progress, 3.1);
          jobInstability = Math.sin(progress * 14) * (1 - progress) * 5.8;
        } else if (!this.reduceMotion && result.choice === SDG08_CHOICE_TRAINING) {
          growthCurve = 1 - Math.pow(1 - progress, 2.2);
          jobCurve = 1 - Math.pow(1 - progress, 3.8);
          workforceCurve = 1 - Math.pow(1 - progress, 2.9);
        }

        const growth = result.growth * growthCurve;
        const jobQuality = clampSdg08((result.jobQuality * jobCurve) + jobInstability, 0, 100);
        const workforceScale = 1 + ((result.workforceScale - 1) * workforceCurve);

        this.renderMetrics(growth, jobQuality, workforceScale);

        if (progress >= 1) {
          this.renderMetrics(result.growth, result.jobQuality, result.workforceScale);
          this.rafId = null;
          resolve(true);
          return;
        }

        this.rafId = window.requestAnimationFrame(tick);
      };

      this.rafId = window.requestAnimationFrame(tick);
    });
  }

  async selectDecision(choice) {
    if (this.state.running || this.state.decision) return;
    if (choice !== SDG08_CHOICE_AUTOMATION && choice !== SDG08_CHOICE_TRAINING) return;

    this.state.running = true;
    this.state.decision = choice;
    this.setDecisionButtonsDisabled(true);

    const result = getSdg08Result(choice);
    this.renderResultCopy(result);
    this.renderMetrics(0, 0, 1);
    this.setStage(SDG08_STAGE_RESULT);

    const runId = ++this.runVersion;
    const completed = await this.animateResult(result, runId);
    if (!completed || this.disposeRequested || runId !== this.runVersion) return;
    this.state.running = false;
  }

  async render() {
    if (!this.host) return;

    this.disposeRequested = false;
    this.teardownRuntime();
    this.state = createSdg08InitialState();
    this.reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
    this.setThemeActive(true);
    this.setTitleSectorHidden(false);

    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.setStage(SDG08_STAGE_INTRO);
    this.renderMetrics(0, 0, 1);
  }

  destroy() {
    this.disposeRequested = true;
    this.runVersion += 1;
    this.teardownRuntime();
    this.refs = {};
    this.state = createSdg08InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);

    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
