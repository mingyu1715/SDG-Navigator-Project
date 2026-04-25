import { toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG08_DECISION_PICK_SIZE,
  SDG08_RESULT_ANIMATION_MS,
  SDG08_STAGE_DECISION,
  SDG08_STAGE_INTRO,
  SDG08_STAGE_RESULT,
  clampSdg08,
  createSdg08InitialState,
  easeOutSdg08Cubic,
  formatSdg08Percent,
  getSdg08RandomDecisionOptions,
  getSdg08Result,
  isValidSdg08Choice,
  toSdg08DecisionKey
} from "./sdg08ContentModel.js";

const SDG08_DEFAULT_SUMMARY = "정책을 선택하면 성장의 속도와 고용의 안정이 어떻게 달라지는지 보여줍니다.";
const SDG08_DEFAULT_MESSAGE = "각 선택은 성장과 고용에 서로 다른 비용을 남깁니다.";
const SDG08_DEFAULT_STABILITY_STATE = "고용 안정도";
const SDG08_DEFAULT_STABILITY_COPY = "선택에 따라 고용의 안정감이 어떻게 달라지는지 확인해보세요.";
const SDG08_DEFAULT_DETAIL = "-";
const SDG08_EMPTY_RESOURCE_COPY = "정책을 선택하면 관련 자료가 표시됩니다.";

export class Sdg08DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg08";
    this.frameMode = "generic";

    this.refs = {};
    this.state = createSdg08InitialState();
    this.previousDecisionKey = "";
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
            <p class="sdg08-problem">생산성이 오를수록, 모두의 일이 더 나아질까요?</p>
            <p class="sdg08-copy">같은 성장도 어떤 방식을 택하느냐에 따라 고용의 안정은 다르게 움직입니다.</p>
            <button type="button" class="sdg08-primary-btn" data-role="startButton">체험 시작</button>
          </div>
        </section>

        <section class="sdg08-stage sdg08-stage-decision" data-role="decisionStage" data-active="false" aria-hidden="true">
          <div class="sdg08-panel sdg08-decision-box">
            <p class="sdg08-kicker">Decision</p>
            <div class="sdg08-choice-wrap" data-role="choiceWrap" role="group" aria-label="정책 선택"></div>
            <p class="sdg08-choice-note" data-role="choiceNote">${SDG08_DECISION_PICK_SIZE}개의 정책이 랜덤으로 제시됩니다.</p>
          </div>
        </section>

        <section class="sdg08-stage sdg08-stage-result" data-role="resultStage" data-active="false" aria-hidden="true">
          <div class="sdg08-panel sdg08-result-box" aria-live="polite">
            <div class="sdg08-result-head">
              <p class="sdg08-kicker">Result</p>
              <span class="sdg08-choice-pill" data-role="choiceLabel">-</span>
            </div>
            <p class="sdg08-result-summary" data-role="resultSummary">${SDG08_DEFAULT_SUMMARY}</p>

            <div class="sdg08-metric-grid">
              <article class="sdg08-metric-card">
                <p class="sdg08-metric-label">경제 성장률</p>
                <div class="sdg08-gauge" aria-hidden="true">
                  <span class="sdg08-gauge-fill is-growth" data-role="growthFill"></span>
                </div>
                <p class="sdg08-metric-value" data-role="growthValue">0%</p>
              </article>

              <article class="sdg08-metric-card is-job">
                <div class="sdg08-stability-head">
                  <p class="sdg08-metric-label">고용 안정도</p>
                  <span class="sdg08-stability-state" data-role="stabilityState">${SDG08_DEFAULT_STABILITY_STATE}</span>
                </div>
                <div class="sdg08-workforce" aria-hidden="true">
                  <span class="sdg08-worker"></span>
                  <span class="sdg08-worker"></span>
                  <span class="sdg08-worker"></span>
                  <span class="sdg08-worker"></span>
                  <span class="sdg08-worker"></span>
                  <span class="sdg08-worker"></span>
                </div>
                <div class="sdg08-stability-rail" aria-hidden="true">
                  <span class="sdg08-stability-fill" data-role="jobFill"></span>
                </div>
                <p class="sdg08-metric-value is-job" data-role="jobValue">0%</p>
                <p class="sdg08-stability-copy" data-role="stabilityCopy">${SDG08_DEFAULT_STABILITY_COPY}</p>
              </article>
            </div>

            <p class="sdg08-result-message" data-role="resultMessage">${SDG08_DEFAULT_MESSAGE}</p>

            <div class="sdg08-result-actions">
              <button type="button" class="sdg08-secondary-btn" data-role="retryButton">다른 정책 조합 보기</button>
            </div>

            <section class="sdg08-info-grid" aria-label="추가 정보">
              <article class="sdg08-info-card">
                <p class="sdg08-info-overline">추가 정보</p>
                <h4 class="sdg08-info-title">정책 영향 요약</h4>
                <div class="sdg08-detail-list">
                  <div class="sdg08-detail-row">
                    <p class="sdg08-detail-label">정책 요약</p>
                    <p class="sdg08-detail-value" data-role="detailPolicySummary">${SDG08_DEFAULT_DETAIL}</p>
                  </div>
                  <div class="sdg08-detail-row">
                    <p class="sdg08-detail-label">고용 안정성</p>
                    <p class="sdg08-detail-value" data-role="detailStability">${SDG08_DEFAULT_DETAIL}</p>
                  </div>
                  <div class="sdg08-detail-row">
                    <p class="sdg08-detail-label">핵심 리스크</p>
                    <p class="sdg08-detail-value" data-role="detailRisk">${SDG08_DEFAULT_DETAIL}</p>
                  </div>
                </div>
              </article>

              <article class="sdg08-info-card">
                <p class="sdg08-info-overline">관련 자료</p>
                <h4 class="sdg08-info-title">현실 데이터 더 보기</h4>
                <div class="sdg08-resource-list" data-role="resourceList">
                  <p class="sdg08-resource-empty">${SDG08_EMPTY_RESOURCE_COPY}</p>
                </div>
              </article>
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
      introStage: get("introStage"),
      decisionStage: get("decisionStage"),
      resultStage: get("resultStage"),
      startButton: get("startButton"),
      choiceWrap: get("choiceWrap"),
      choiceNote: get("choiceNote"),
      resultSummary: get("resultSummary"),
      choiceLabel: get("choiceLabel"),
      growthFill: get("growthFill"),
      growthValue: get("growthValue"),
      stabilityState: get("stabilityState"),
      jobFill: get("jobFill"),
      jobValue: get("jobValue"),
      stabilityCopy: get("stabilityCopy"),
      resultMessage: get("resultMessage"),
      retryButton: get("retryButton"),
      detailPolicySummary: get("detailPolicySummary"),
      detailStability: get("detailStability"),
      detailRisk: get("detailRisk"),
      resourceList: get("resourceList")
    };

    this.refs.decisionButtons = [];
  }

  bindEvents() {
    if (this.refs.startButton) {
      this.refs.startButton.addEventListener("click", () => {
        this.showDecision();
      });
    }

    if (this.refs.choiceWrap) {
      this.refs.choiceWrap.addEventListener("click", (event) => {
        const button = event.target.closest(".sdg08-choice-btn");
        if (!button || button.disabled || !this.refs.choiceWrap.contains(button)) return;
        const choice = button.dataset.choice;
        if (!choice) return;
        void this.selectDecision(choice);
      });
    }

    if (this.refs.retryButton) {
      this.refs.retryButton.addEventListener("click", () => {
        this.restartDecisionRound();
      });
    }
  }

  teardownRuntime() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  prepareDecisionOptions() {
    this.state.decisionOptions = getSdg08RandomDecisionOptions(this.previousDecisionKey);
    this.previousDecisionKey = toSdg08DecisionKey(this.state.decisionOptions);
  }

  renderDecisionOptions() {
    if (!this.refs.choiceWrap) return;
    const options = Array.isArray(this.state.decisionOptions) ? this.state.decisionOptions : [];

    this.refs.choiceWrap.innerHTML = options
      .map((option) => {
        return `
          <button type="button" class="sdg08-choice-btn" data-choice="${option.choice}">
            <span class="sdg08-choice-title">${option.title}</span>
            <span class="sdg08-choice-meta">${option.meta}</span>
          </button>
        `;
      })
      .join("");

    this.refs.decisionButtons = Array.from(this.refs.choiceWrap.querySelectorAll(".sdg08-choice-btn"));

    if (this.refs.choiceNote) {
      this.refs.choiceNote.textContent = `매번 ${options.length}개의 정책이 랜덤으로 제시됩니다.`;
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

    this.setTitleSectorHidden(true);
  }

  setDecisionButtonsDisabled(disabled) {
    const nextDisabled = Boolean(disabled);
    (this.refs.decisionButtons || []).forEach((button) => {
      button.disabled = nextDisabled;
    });
  }

  showDecision() {
    if (this.state.stage !== SDG08_STAGE_INTRO || this.state.running) return;
    this.prepareDecisionOptions();
    this.renderDecisionOptions();
    this.setDecisionButtonsDisabled(false);
    this.setStage(SDG08_STAGE_DECISION);
  }

  renderResultCopy(result) {
    if (this.refs.resultSummary) {
      this.refs.resultSummary.textContent = result?.summary || SDG08_DEFAULT_SUMMARY;
    }
    if (this.refs.choiceLabel) {
      this.refs.choiceLabel.textContent = result?.choiceLabel || "-";
    }
    if (this.refs.resultMessage) {
      this.refs.resultMessage.textContent = result?.message || SDG08_DEFAULT_MESSAGE;
    }
    if (this.refs.stabilityState) {
      this.refs.stabilityState.textContent = result?.stabilityState || SDG08_DEFAULT_STABILITY_STATE;
    }
    if (this.refs.stabilityCopy) {
      this.refs.stabilityCopy.textContent = result?.stabilityCopy || SDG08_DEFAULT_STABILITY_COPY;
    }
    if (this.refs.root) {
      this.refs.root.dataset.outcome = result?.choice || "neutral";
    }

    this.renderResultDetails(result);
    this.renderResources(result?.resources || []);
  }

  renderResultDetails(result) {
    const details = result?.details || {};

    if (this.refs.detailPolicySummary) {
      this.refs.detailPolicySummary.textContent = details.policySummary || SDG08_DEFAULT_DETAIL;
    }
    if (this.refs.detailStability) {
      this.refs.detailStability.textContent = details.stability || SDG08_DEFAULT_DETAIL;
    }
    if (this.refs.detailRisk) {
      this.refs.detailRisk.textContent = details.risk || SDG08_DEFAULT_DETAIL;
    }
  }

  renderResources(resources) {
    if (!this.refs.resourceList) return;

    this.refs.resourceList.innerHTML = "";
    const list = Array.isArray(resources) ? resources : [];

    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "sdg08-resource-empty";
      empty.textContent = SDG08_EMPTY_RESOURCE_COPY;
      this.refs.resourceList.appendChild(empty);
      return;
    }

    list.forEach((item) => {
      const link = document.createElement("a");
      link.className = "sdg08-resource-item";
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const source = document.createElement("span");
      source.className = "sdg08-resource-source";
      source.textContent = item.source || "Source";

      const title = document.createElement("span");
      title.className = "sdg08-resource-title";
      title.textContent = item.title || SDG08_DEFAULT_DETAIL;

      link.append(source, title);
      this.refs.resourceList.appendChild(link);
    });
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

        if (!this.reduceMotion && result.animation === "aggressive") {
          growthCurve = 1 - Math.pow(1 - progress, 4.6);
          jobCurve = 1 - Math.pow(1 - progress, 1.7);
          workforceCurve = 1 - Math.pow(1 - progress, 3.1);
          jobInstability = Math.sin(progress * 14) * (1 - progress) * 5.8;
        } else if (!this.reduceMotion && result.animation === "resilient") {
          growthCurve = 1 - Math.pow(1 - progress, 2.2);
          jobCurve = 1 - Math.pow(1 - progress, 3.8);
          workforceCurve = 1 - Math.pow(1 - progress, 2.9);
        } else if (!this.reduceMotion && result.animation === "volatile") {
          growthCurve = 1 - Math.pow(1 - progress, 3.1);
          jobCurve = 1 - Math.pow(1 - progress, 1.9);
          workforceCurve = 1 - Math.pow(1 - progress, 2.4);
          jobInstability = Math.sin(progress * 12.5) * (1 - progress) * 7.4;
        } else if (!this.reduceMotion && result.animation === "inclusive") {
          growthCurve = 1 - Math.pow(1 - progress, 2.6);
          jobCurve = 1 - Math.pow(1 - progress, 4.1);
          workforceCurve = 1 - Math.pow(1 - progress, 3.4);
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

  restartDecisionRound() {
    if (this.state.running) return;

    this.runVersion += 1;
    this.teardownRuntime();
    this.state.running = false;
    this.state.decision = null;

    this.prepareDecisionOptions();
    this.renderDecisionOptions();
    this.setDecisionButtonsDisabled(false);
    this.renderMetrics(0, 0, 1);
    this.renderResultCopy(null);
    this.setStage(SDG08_STAGE_DECISION);
  }

  async selectDecision(choice) {
    if (this.state.running || this.state.decision) return;
    if (!isValidSdg08Choice(choice)) return;

    this.state.running = true;
    this.state.decision = choice;
    this.setDecisionButtonsDisabled(true);

    const result = getSdg08Result(choice);
    if (!result) {
      this.state.running = false;
      this.state.decision = null;
      this.setDecisionButtonsDisabled(false);
      return;
    }

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
    this.prepareDecisionOptions();
    this.reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);

    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderDecisionOptions();
    this.renderResultCopy(null);
    this.setStage(SDG08_STAGE_INTRO);
    this.renderMetrics(0, 0, 1);
  }

  destroy() {
    this.disposeRequested = true;
    this.runVersion += 1;
    this.teardownRuntime();
    this.refs = {};
    this.state = createSdg08InitialState();
    this.previousDecisionKey = "";
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);

    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
