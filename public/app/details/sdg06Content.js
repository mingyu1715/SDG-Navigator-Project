import { toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG06_DEFAULT_MINUTES,
  SDG06_TRANSITION_DURATION_MS,
  calculateSdg06Metrics,
  clampSdg06Value,
  createSdg06InitialState,
  easeOutSdg06Cubic,
  easeOutSdg06Quad,
  formatSdg06Distance,
  formatSdg06Liters,
  formatSdg06Minutes,
  formatSdg06Weight,
  getSdg06ResultView,
  getSdg06WeightMotion,
  normalizeSdg06Minutes,
  renderSdg06ResourceItems
} from "./sdg06ContentModel.js";

export class Sdg06DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg06";
    this.frameMode = "generic";

    this.refs = {};
    this.state = createSdg06InitialState();
    this.disposeRequested = false;
    this.renderVersion = 0;
    this.runVersion = 0;
    this.transitionRafId = null;
    this.resultRafId = null;
    this.reduceMotion = false;
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg06-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg06-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg06-exp" data-role="root" data-stage="input">
        <section class="sdg06-stage sdg06-stage-input" data-role="inputStage">
          <div class="sdg06-input-shell">
            <section class="sdg06-input-card" aria-labelledby="sdg06MinutesLabel">
              <p class="sdg06-kicker">Shower Time</p>
              <p class="sdg06-input-copy">샤워 시간을 정하고 바로 체험을 시작하세요.</p>
              <p class="sdg06-input-meta">
                <span class="sdg06-input-meta-value" data-role="minutesPreview">${SDG06_DEFAULT_MINUTES}분</span>
                <span class="sdg06-input-meta-dot" aria-hidden="true"></span>
                <span class="sdg06-input-meta-value" data-role="litersPreview">${SDG06_DEFAULT_MINUTES * 11}L</span>
              </p>

              <label id="sdg06MinutesLabel" class="sdg06-slider-label" for="sdg06MinutesRange">샤워 시간</label>
              <input
                id="sdg06MinutesRange"
                class="sdg06-range"
                data-role="minutesRange"
                type="range"
                min="1"
                max="20"
                step="1"
                value="${SDG06_DEFAULT_MINUTES}"
              />

              <button type="button" class="sdg06-primary-btn" data-role="startButton">물의 무게 느껴보기</button>
            </section>
          </div>
        </section>

        <section class="sdg06-stage sdg06-stage-transition" data-role="transitionStage" hidden aria-hidden="true">
          <div class="sdg06-transition-card">
            <div class="sdg06-ripple-stack" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="sdg06-transition-droplet" aria-hidden="true"></div>
            <p class="sdg06-kicker">Transition</p>
            <h3 class="sdg06-stage-title">물을 무게와 거리로 바꾸는 중</h3>
            <p class="sdg06-transition-value" data-role="transitionValue">0L</p>
            <p class="sdg06-stage-copy">익숙한 물 사용량을 누군가의 노동으로 환산하는 순간입니다.</p>
          </div>
        </section>

        <section class="sdg06-stage sdg06-stage-result" data-role="resultStage" hidden aria-hidden="true">
          <div class="sdg06-result-stack">
            <div class="sdg06-result-shell">
              <section class="sdg06-weight-stage" aria-label="물통 무게 시각화">
                <div class="sdg06-weight-ground" aria-hidden="true"></div>
                <div class="sdg06-weight-shadow" data-role="weightShadow" aria-hidden="true"></div>
                <div class="sdg06-container-wrap" data-role="containerWrap" aria-hidden="true">
                  <div class="sdg06-container">
                    <span class="sdg06-container-handle"></span>
                    <span class="sdg06-container-cap"></span>
                    <span class="sdg06-container-water" data-role="containerWater"></span>
                    <span class="sdg06-container-highlight"></span>
                  </div>
                </div>
                <p class="sdg06-weight-caption" data-role="weightCaption">0kg의 물이 아래로 내려앉습니다.</p>
              </section>

              <section class="sdg06-result-card" aria-live="polite">
                <p class="sdg06-kicker">Result</p>
                <p class="sdg06-result-message" data-role="resultMessage">-</p>

                <div class="sdg06-metric-grid">
                  <article class="sdg06-metric-card">
                    <p class="sdg06-metric-label">총 물 사용량</p>
                    <p class="sdg06-metric-value" data-role="resultLiters">0L</p>
                  </article>
                  <article class="sdg06-metric-card">
                    <p class="sdg06-metric-label">물의 무게</p>
                    <p class="sdg06-metric-value" data-role="resultWeight">0kg</p>
                  </article>
                  <article class="sdg06-metric-card">
                    <p class="sdg06-metric-label">필요 이동 거리</p>
                    <p class="sdg06-metric-value" data-role="resultDistance">0km</p>
                  </article>
                </div>

                <p class="sdg06-result-note" data-role="resultNote">-</p>
                <button type="button" class="sdg06-secondary-btn" data-role="resetButton">다시 입력하기</button>
              </section>
            </div>

            <section class="sdg06-detail-panel" aria-label="세부 정보">
              <article class="sdg06-info-card">
                <p class="sdg06-info-overline">관련 자료</p>
                <h3 class="sdg06-info-title">현실 데이터 더 보기</h3>
                <div class="sdg06-resource-list">
                  ${renderSdg06ResourceItems()}
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
      inputStage: get("inputStage"),
      transitionStage: get("transitionStage"),
      resultStage: get("resultStage"),
      minutesRange: get("minutesRange"),
      minutesPreview: get("minutesPreview"),
      litersPreview: get("litersPreview"),
      startButton: get("startButton"),
      transitionValue: get("transitionValue"),
      resultMessage: get("resultMessage"),
      resultLiters: get("resultLiters"),
      resultWeight: get("resultWeight"),
      resultDistance: get("resultDistance"),
      resultNote: get("resultNote"),
      resetButton: get("resetButton"),
      weightCaption: get("weightCaption"),
      containerWrap: get("containerWrap"),
      containerWater: get("containerWater"),
      weightShadow: get("weightShadow")
    };
  }

  bindEvents() {
    if (this.refs.minutesRange) {
      this.refs.minutesRange.addEventListener("input", () => {
        this.updateMinutes(this.refs.minutesRange.value);
      });
    }

    if (this.refs.startButton) {
      this.refs.startButton.addEventListener("click", () => {
        void this.startExperience();
      });
    }

    if (this.refs.resetButton) {
      this.refs.resetButton.addEventListener("click", () => {
        this.resetExperience();
      });
    }
  }

  teardownRuntime() {
    if (this.transitionRafId) {
      window.cancelAnimationFrame(this.transitionRafId);
      this.transitionRafId = null;
    }
    if (this.resultRafId) {
      window.cancelAnimationFrame(this.resultRafId);
      this.resultRafId = null;
    }
  }

  setStage(stage) {
    this.state.stage = stage;
    if (this.refs.root) {
      this.refs.root.dataset.stage = stage;
    }

    const stageMap = [
      ["input", this.refs.inputStage],
      ["transition", this.refs.transitionStage],
      ["result", this.refs.resultStage]
    ];

    stageMap.forEach(([name, node]) => {
      if (!node) return;
      const active = name === stage;
      node.hidden = !active;
      node.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  setActionState() {
    const disabled = this.state.running;

    if (this.refs.minutesRange) {
      this.refs.minutesRange.disabled = disabled;
    }
    if (this.refs.startButton) {
      this.refs.startButton.disabled = disabled;
    }
    if (this.refs.resetButton) {
      this.refs.resetButton.disabled = disabled;
    }
  }

  updateRangeProgress(minutes) {
    if (!this.refs.minutesRange) return;

    const min = Number(this.refs.minutesRange.min) || 1;
    const max = Number(this.refs.minutesRange.max) || 20;
    const ratio = clampSdg06Value((minutes - min) / (max - min), 0, 1);
    this.refs.minutesRange.style.setProperty("--sdg06-range-progress", `${ratio * 100}%`);
  }

  updateMinutes(minutesInput) {
    this.state.minutes = normalizeSdg06Minutes(minutesInput);
    if (this.refs.minutesRange) {
      this.refs.minutesRange.value = String(this.state.minutes);
    }
    this.renderInputPreview();
  }

  renderInputPreview() {
    const metrics = calculateSdg06Metrics(this.state.minutes);

    if (this.refs.minutesPreview) {
      this.refs.minutesPreview.textContent = formatSdg06Minutes(metrics.minutes);
    }
    if (this.refs.litersPreview) {
      this.refs.litersPreview.textContent = formatSdg06Liters(metrics.waterLiters);
    }

    this.updateRangeProgress(metrics.minutes);
  }

  resetVisualState() {
    if (!this.refs.root) return;

    this.refs.root.style.setProperty("--sdg06-transition-progress", "0");
    this.refs.root.style.setProperty("--sdg06-container-drop", "-18px");
    this.refs.root.style.setProperty("--sdg06-container-scale-x", "0.88");
    this.refs.root.style.setProperty("--sdg06-container-scale-y", "0.88");
    this.refs.root.style.setProperty("--sdg06-container-tilt", "0deg");
    this.refs.root.style.setProperty("--sdg06-shadow-scale-x", "0.9");
    this.refs.root.style.setProperty("--sdg06-shadow-scale-y", "0.72");
    this.refs.root.style.setProperty("--sdg06-shadow-opacity", "0.12");
    this.refs.root.style.setProperty("--sdg06-shadow-blur", "22px");
    this.refs.root.style.setProperty("--sdg06-water-fill", "0.18");
  }

  applyTransitionProgress(progress) {
    if (!this.refs.root) return;
    this.refs.root.style.setProperty("--sdg06-transition-progress", progress.toFixed(4));
  }

  applyResultFrame(progress, motion) {
    if (!this.refs.root) return;

    const settle = easeOutSdg06Cubic(progress);
    const fill = 0.18 + (motion.fillRatio - 0.18) * easeOutSdg06Quad(progress);
    const sway = Math.sin(progress * Math.PI) * motion.tiltDeg;
    const drop = -18 + (motion.dropPx + 18) * settle;
    const liveSquash = motion.squash * settle;
    const scaleX = motion.baseScale + liveSquash * 0.82;
    const scaleY = motion.baseScale - liveSquash;
    const shadowScaleX = 0.9 + (motion.shadowScaleX - 0.9) * settle;
    const shadowScaleY = 0.72 + (motion.shadowScaleY - 0.72) * settle;
    const shadowOpacity = 0.14 + motion.ratio * 0.18 + progress * 0.06;

    this.refs.root.style.setProperty("--sdg06-container-drop", `${drop.toFixed(2)}px`);
    this.refs.root.style.setProperty("--sdg06-container-scale-x", scaleX.toFixed(4));
    this.refs.root.style.setProperty("--sdg06-container-scale-y", scaleY.toFixed(4));
    this.refs.root.style.setProperty("--sdg06-container-tilt", `${sway.toFixed(2)}deg`);
    this.refs.root.style.setProperty("--sdg06-shadow-scale-x", shadowScaleX.toFixed(4));
    this.refs.root.style.setProperty("--sdg06-shadow-scale-y", shadowScaleY.toFixed(4));
    this.refs.root.style.setProperty("--sdg06-shadow-opacity", shadowOpacity.toFixed(4));
    this.refs.root.style.setProperty("--sdg06-shadow-blur", `${motion.shadowBlurPx.toFixed(2)}px`);
    this.refs.root.style.setProperty("--sdg06-water-fill", fill.toFixed(4));
  }

  prepareTransition() {
    if (this.refs.transitionValue) {
      this.refs.transitionValue.textContent = "0L";
    }
    this.applyTransitionProgress(0);
  }

  prepareResult(metrics) {
    const resultView = getSdg06ResultView(metrics);

    if (this.refs.resultMessage) {
      this.refs.resultMessage.textContent = resultView.message;
    }
    if (this.refs.resultNote) {
      this.refs.resultNote.textContent = resultView.distanceNote;
    }
    if (this.refs.weightCaption) {
      this.refs.weightCaption.textContent = resultView.weightCaption;
    }
    if (this.refs.resultLiters) {
      this.refs.resultLiters.textContent = "0L";
    }
    if (this.refs.resultWeight) {
      this.refs.resultWeight.textContent = "0kg";
    }
    if (this.refs.resultDistance) {
      this.refs.resultDistance.textContent = "0km";
    }

    this.resetVisualState();
  }

  animateTransition(metrics, runId) {
    const duration = this.reduceMotion ? 180 : SDG06_TRANSITION_DURATION_MS;
    const startAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (this.disposeRequested || runId !== this.runVersion) {
          this.transitionRafId = null;
          resolve(false);
          return;
        }

        const progress = clampSdg06Value((now - startAt) / duration, 0, 1);
        const eased = this.reduceMotion ? 1 : easeOutSdg06Cubic(progress);

        if (this.refs.transitionValue) {
          this.refs.transitionValue.textContent = formatSdg06Liters(metrics.waterLiters * eased);
        }
        this.applyTransitionProgress(eased);

        if (progress >= 1) {
          this.transitionRafId = null;
          resolve(true);
          return;
        }

        this.transitionRafId = window.requestAnimationFrame(tick);
      };

      this.transitionRafId = window.requestAnimationFrame(tick);
    });
  }

  animateResult(metrics, runId) {
    const motion = getSdg06WeightMotion(metrics);
    const duration = this.reduceMotion ? 180 : motion.durationMs;
    const startAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (this.disposeRequested || runId !== this.runVersion) {
          this.resultRafId = null;
          resolve(false);
          return;
        }

        const progress = clampSdg06Value((now - startAt) / duration, 0, 1);
        const eased = this.reduceMotion ? 1 : easeOutSdg06Cubic(progress);

        if (this.refs.resultLiters) {
          this.refs.resultLiters.textContent = formatSdg06Liters(metrics.waterLiters * eased);
        }
        if (this.refs.resultWeight) {
          this.refs.resultWeight.textContent = formatSdg06Weight(metrics.weightKg * eased);
        }
        if (this.refs.resultDistance) {
          this.refs.resultDistance.textContent = formatSdg06Distance(metrics.distanceKm * eased);
        }

        this.applyResultFrame(progress, motion);

        if (progress >= 1) {
          this.resultRafId = null;
          if (this.refs.resultLiters) {
            this.refs.resultLiters.textContent = formatSdg06Liters(metrics.waterLiters);
          }
          if (this.refs.resultWeight) {
            this.refs.resultWeight.textContent = formatSdg06Weight(metrics.weightKg);
          }
          if (this.refs.resultDistance) {
            this.refs.resultDistance.textContent = formatSdg06Distance(metrics.distanceKm);
          }
          this.applyResultFrame(1, motion);
          resolve(true);
          return;
        }

        this.resultRafId = window.requestAnimationFrame(tick);
      };

      this.resultRafId = window.requestAnimationFrame(tick);
    });
  }

  async startExperience() {
    if (this.state.running) return;

    const runId = ++this.runVersion;
    const metrics = calculateSdg06Metrics(this.state.minutes);

    this.state.running = true;
    this.setActionState();
    this.prepareTransition();
    this.prepareResult(metrics);
    this.setTitleSectorHidden(true);
    this.setStage("transition");

    const transitionCompleted = await this.animateTransition(metrics, runId);
    if (!transitionCompleted || this.disposeRequested || runId !== this.runVersion) return;

    this.setStage("result");
    const resultCompleted = await this.animateResult(metrics, runId);
    if (!resultCompleted || this.disposeRequested || runId !== this.runVersion) return;

    this.state.running = false;
    this.setActionState();
  }

  resetExperience() {
    this.runVersion += 1;
    this.teardownRuntime();
    this.state.running = false;
    this.setActionState();
    this.setTitleSectorHidden(false);
    this.setStage("input");
    this.renderInputPreview();
    this.prepareTransition();
    this.resetVisualState();
  }

  async render() {
    if (!this.host) return;

    this.teardownRuntime();
    const renderVersion = ++this.renderVersion;
    this.disposeRequested = false;
    this.setThemeActive(true);
    this.reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
    this.state = createSdg06InitialState();
    this.setTitleSectorHidden(false);

    if (this.disposeRequested || renderVersion !== this.renderVersion) return;

    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.updateMinutes(this.state.minutes);
    this.prepareResult(calculateSdg06Metrics(this.state.minutes));
    this.resetExperience();
  }

  destroy() {
    this.disposeRequested = true;
    this.runVersion += 1;
    this.renderVersion += 1;
    this.teardownRuntime();
    this.refs = {};
    this.state = createSdg06InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);

    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
