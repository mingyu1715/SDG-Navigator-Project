import {
  clearStepMotionTimers,
  scheduleStepMotion,
  toggleDetailViewClass
} from "./sharedRuntime.js";
import {
  SDG05_ANIMATION_DURATION_MS,
  SDG05_ANIMATION_LOOPS,
  SDG05_EXTRA_REVEAL_STAGGER_MS,
  SDG05_WORK_START_MINUTES,
  calculateSdg05PayClock,
  clampSdg05Value,
  createSdg05InitialState,
  easeOutSdg05Cubic,
  getSdg05ClockFaceView,
  getSdg05CountrySelectionView,
  getSdg05FallbackCountries,
  getSdg05PayGapData,
  getSdg05ResultView,
  renderSdg05ResourceItems
} from "./sdg05ContentModel.js";

export class Sdg05DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg05";
    this.frameMode = "immersive";

    this.refs = {};
    this.countries = [];
    this.state = createSdg05InitialState();
    this.disposeRequested = false;
    this.animationRafId = null;
    this.mainStepTimers = [];
    this.extraStepTimers = [];
    this.hasEnteredMain = false;
    this.renderVersion = 0;
    this.runVersion = 0;
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg05-title-hidden", hidden);
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg05-theme", active);
  }

  clearMainStepMotion() {
    clearStepMotionTimers(this.mainStepTimers, this.host, ".sdg05-main-step");
  }

  clearExtraStepMotion() {
    clearStepMotionTimers(this.extraStepTimers, this.host, ".sdg05-extra-step");
  }

  setupMainStepMotion() {
    scheduleStepMotion(this.mainStepTimers, this.host, ".sdg05-main-step", 110);
  }

  updateVisibility() {
    const root = this.refs.root;
    const main = this.refs.main;
    if (!root || !main) return;

    const started = Boolean(this.state.hasStarted);
    root.classList.toggle("is-started", started);
    main.setAttribute("aria-hidden", started ? "false" : "true");

    if (!started) {
      this.hasEnteredMain = false;
      this.clearMainStepMotion();
      return;
    }

    if (!this.hasEnteredMain) {
      this.hasEnteredMain = true;
      this.setupMainStepMotion();
    }
  }

  teardownRuntime() {
    if (this.animationRafId) {
      window.cancelAnimationFrame(this.animationRafId);
      this.animationRafId = null;
    }
    this.clearMainStepMotion();
    this.clearExtraStepMotion();
  }

  getSelectedCountry() {
    return this.countries.find((country) => country.code === this.state.selectedCode) || this.countries[0] || null;
  }

  template() {
    return `
      <div class="sdg05-exp" data-role="root">
        <section class="sdg05-hero" data-role="hero">
          <header class="sdg05-control-panel">
            <p class="sdg05-control-kicker">국가 선택</p>
            <div class="sdg05-control-row">
              <label class="sdg05-control-label" for="sdg05CountrySelect">국가</label>
              <select id="sdg05CountrySelect" class="sdg05-country-select" data-role="countrySelect"></select>
              <button type="button" class="sdg05-action-btn" data-role="startButton">시계 시작</button>
            </div>
            <p class="sdg05-country-hint" data-role="countryHint">-</p>
          </header>

          <section class="sdg05-clock-stage sdg05-clock-stage-hero" aria-label="임금 시계 미리보기">
            <div class="sdg05-clock-face" data-role="clockFace">
              <div class="sdg05-hand sdg05-hour-hand" data-role="hourHand"></div>
              <div class="sdg05-hand sdg05-minute-hand" data-role="minuteHand"></div>
              <span class="sdg05-center-dot"></span>
            </div>
            <p class="sdg05-clock-readout" data-role="clockReadout">09:00</p>
          </section>

          <section class="sdg05-result sdg05-main-step sdg05-result-hero" data-role="resultBlock" aria-live="polite">
            <p class="sdg05-result-main" data-role="resultMain">국가를 선택하고 시계를 시작하세요.</p>
            <p class="sdg05-result-meta" data-role="resultMeta">시작 전에는 타이틀이 시계 위에 표시됩니다.</p>
            <p class="sdg05-result-guide">아래로 내려 추가 정보를 확인하세요.</p>
          </section>
        </section>

        <section class="sdg05-main" data-role="main" aria-hidden="true">
          <header class="sdg05-main-head sdg05-main-step">
            <div>
              <p class="sdg05-main-kicker">선택 국가</p>
              <h3 class="sdg05-main-country" data-role="mainCountryLabel">-</h3>
            </div>
            <button type="button" class="sdg05-action-btn sdg05-reset-btn" data-role="resetButton">다시 보기</button>
          </header>

          <section class="sdg05-extra" data-role="extraPanel" hidden aria-hidden="true">
          <article class="sdg05-info-card sdg05-extra-step">
            <p class="sdg05-info-overline">선택 국가 지표</p>
            <h3 class="sdg05-info-title">현재 선택 국가</h3>
            <p class="sdg05-info-body" data-role="countryLine">-</p>
            <p class="sdg05-info-sub" data-role="countrySource">-</p>
          </article>

          <article class="sdg05-info-card sdg05-extra-step">
            <p class="sdg05-info-overline">관련 자료</p>
            <h3 class="sdg05-info-title">현실 데이터 더 보기</h3>
            <div class="sdg05-resource-list">
              ${renderSdg05ResourceItems()}
            </div>
          </article>
          </section>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      hero: get("hero"),
      main: get("main"),
      countrySelect: get("countrySelect"),
      startButton: get("startButton"),
      resetButton: get("resetButton"),
      countryHint: get("countryHint"),
      mainCountryLabel: get("mainCountryLabel"),
      hourHand: get("hourHand"),
      minuteHand: get("minuteHand"),
      clockReadout: get("clockReadout"),
      resultMain: get("resultMain"),
      resultMeta: get("resultMeta"),
      countryLine: get("countryLine"),
      countrySource: get("countrySource"),
      extraPanel: get("extraPanel")
    };
  }

  populateCountrySelect() {
    if (!this.refs.countrySelect) return;
    this.refs.countrySelect.innerHTML = "";
    this.countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.code;
      option.textContent = `${country.nameKo} (${country.nameEn})`;
      this.refs.countrySelect.appendChild(option);
    });

    if (!this.state.selectedCode && this.countries.length) {
      this.state.selectedCode = this.countries[0].code;
    }
    this.refs.countrySelect.value = this.state.selectedCode;
  }

  bindEvents() {
    if (this.refs.countrySelect) {
      this.refs.countrySelect.addEventListener("change", () => {
        this.state.selectedCode = this.refs.countrySelect.value;
        this.updateCountryHint();
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

  setActionState() {
    const running = this.state.running;
    const started = this.state.hasStarted;

    if (this.refs.countrySelect) {
      this.refs.countrySelect.disabled = running || started;
    }
    if (this.refs.startButton) {
      this.refs.startButton.disabled = running || started;
    }
    if (this.refs.resetButton) {
      this.refs.resetButton.disabled = running;
    }
  }

  updateCountryHint() {
    const country = this.getSelectedCountry();
    const countryView = getSdg05CountrySelectionView(country);
    if (this.refs.countryHint) {
      this.refs.countryHint.textContent = countryView.hint;
    }
    if (this.refs.mainCountryLabel) {
      this.refs.mainCountryLabel.textContent = countryView.mainLabel;
    }
  }

  applyClockTime(minutes) {
    const clockView = getSdg05ClockFaceView(minutes);

    if (this.refs.hourHand) {
      this.refs.hourHand.style.transform = `translate(-50%, -100%) rotate(${clockView.hourDeg}deg)`;
    }
    if (this.refs.minuteHand) {
      this.refs.minuteHand.style.transform = `translate(-50%, -100%) rotate(${clockView.minuteDeg}deg)`;
    }
    if (this.refs.clockReadout) {
      this.refs.clockReadout.textContent = clockView.readout;
    }
  }

  hideExtraPanel() {
    const panel = this.refs.extraPanel;
    if (!panel) return;
    this.clearExtraStepMotion();
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
  }

  showExtraPanel() {
    const panel = this.refs.extraPanel;
    if (!panel) return;

    this.clearExtraStepMotion();
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    scheduleStepMotion(this.extraStepTimers, panel, ".sdg05-extra-step", SDG05_EXTRA_REVEAL_STAGGER_MS);
  }

  renderResult(country, result) {
    const resultView = getSdg05ResultView(country, result);

    if (this.refs.resultMain) {
      this.refs.resultMain.textContent = resultView.resultMain;
    }
    if (this.refs.resultMeta) {
      this.refs.resultMeta.textContent = resultView.resultMeta;
    }
    if (this.refs.countryLine) {
      this.refs.countryLine.textContent = resultView.countryLine;
    }
    if (this.refs.countrySource) {
      this.refs.countrySource.textContent = resultView.countrySource;
    }
  }

  animateClockTo(targetMinutes, runId) {
    const startVirtual = SDG05_WORK_START_MINUTES;
    const endVirtual = targetMinutes + SDG05_ANIMATION_LOOPS * 720;
    const startAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (this.disposeRequested || runId !== this.runVersion) {
          this.animationRafId = null;
          resolve();
          return;
        }

        const elapsed = now - startAt;
        const progress = clampSdg05Value(elapsed / SDG05_ANIMATION_DURATION_MS, 0, 1);
        const eased = easeOutSdg05Cubic(progress);
        const virtualMinutes = startVirtual + (endVirtual - startVirtual) * eased;
        this.applyClockTime(virtualMinutes);

        if (progress >= 1) {
          this.animationRafId = null;
          this.applyClockTime(targetMinutes);
          resolve();
          return;
        }

        this.animationRafId = window.requestAnimationFrame(tick);
      };

      this.animationRafId = window.requestAnimationFrame(tick);
    });
  }

  async startExperience() {
    if (this.state.running || this.state.hasResult) return;

    const country = this.getSelectedCountry();
    if (!country) return;

    const runId = ++this.runVersion;
    const result = calculateSdg05PayClock(country.gapRate);

    this.state.hasStarted = true;
    this.state.running = true;
    this.state.hasResult = false;
    this.setActionState();
    this.hideExtraPanel();
    this.setTitleSectorHidden(true);
    this.updateVisibility();

    if (this.refs.root) {
      this.refs.root.classList.remove("is-alert");
      this.refs.root.classList.remove("is-result");
    }
    if (this.refs.resultMain) {
      this.refs.resultMain.textContent = "시계가 임금 격차를 계산 중입니다...";
    }
    if (this.refs.resultMeta) {
      this.refs.resultMeta.textContent = "남성과 동일 시급 기준으로 무급 시작 시각을 계산합니다.";
    }

    this.applyClockTime(SDG05_WORK_START_MINUTES);
    await this.animateClockTo(result.unpaidStartMinutes, runId);
    if (this.disposeRequested || runId !== this.runVersion) return;

    this.state.running = false;
    this.state.hasResult = true;
    this.setActionState();
    this.renderResult(country, result);
    this.showExtraPanel();

    if (this.refs.root) {
      this.refs.root.classList.add("is-alert");
      this.refs.root.classList.add("is-result");
    }
  }

  resetExperience() {
    this.runVersion += 1;
    this.state.hasStarted = false;
    this.state.running = false;
    this.state.hasResult = false;
    this.hideExtraPanel();
    this.setTitleSectorHidden(false);
    this.updateVisibility();
    this.setActionState();

    if (this.refs.root) {
      this.refs.root.classList.remove("is-alert");
      this.refs.root.classList.remove("is-result");
    }

    this.applyClockTime(SDG05_WORK_START_MINUTES);
    this.updateCountryHint();

    if (this.refs.resultMain) {
      this.refs.resultMain.textContent = "국가를 선택하고 시계를 시작하세요.";
    }
    if (this.refs.resultMeta) {
      this.refs.resultMeta.textContent = "시작 전에는 타이틀이 시계 위에 표시됩니다.";
    }
  }

  async render() {
    if (!this.host) return;
    this.teardownRuntime();
    const renderVersion = ++this.renderVersion;
    this.disposeRequested = false;
    this.hasEnteredMain = false;
    this.setThemeActive(true);
    this.state = createSdg05InitialState();
    this.countries = await getSdg05PayGapData();
    if (this.disposeRequested || renderVersion !== this.renderVersion) return;

    if (!this.countries.length) {
      this.countries = getSdg05FallbackCountries();
    }
    this.state.selectedCode = this.countries[0]?.code || "";

    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.populateCountrySelect();
    this.bindEvents();
    this.resetExperience();
  }

  destroy() {
    this.disposeRequested = true;
    this.renderVersion += 1;
    this.teardownRuntime();
    this.refs = {};
    this.state = createSdg05InitialState();
    this.hasEnteredMain = false;
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);
    if (this.host) this.host.innerHTML = "";
  }
}
