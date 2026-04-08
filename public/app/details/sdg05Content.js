import {
  clearStepMotionTimers,
  escapeHtml,
  loadJsonData,
  scheduleStepMotion,
  toggleDetailViewClass
} from "./sharedRuntime.js";

const WORK_START_MINUTES = 9 * 60;
const WORK_END_MINUTES = 18 * 60;
const WORK_DAY_MINUTES = WORK_END_MINUTES - WORK_START_MINUTES;
const EXTRA_REVEAL_STAGGER_MS = 90;
const ANIMATION_DURATION_MS = 2500;
const ANIMATION_LOOPS = 6;

const DEFAULT_PAY_GAP_DATA = [
  {
    code: "KR",
    nameKo: "대한민국",
    nameEn: "South Korea",
    gapRate: 0.31,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  },
  {
    code: "JP",
    nameKo: "일본",
    nameEn: "Japan",
    gapRate: 0.23,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  },
  {
    code: "US",
    nameKo: "미국",
    nameEn: "United States",
    gapRate: 0.17,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  },
  {
    code: "DE",
    nameKo: "독일",
    nameEn: "Germany",
    gapRate: 0.18,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  },
  {
    code: "FR",
    nameKo: "프랑스",
    nameEn: "France",
    gapRate: 0.12,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  },
  {
    code: "SE",
    nameKo: "스웨덴",
    nameEn: "Sweden",
    gapRate: 0.08,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  },
  {
    code: "IN",
    nameKo: "인도",
    nameEn: "India",
    gapRate: 0.34,
    source: "교육용 샘플 데이터",
    sourceYear: 2025
  }
];

const RESOURCE_ITEMS = [
  {
    type: "UN WOMEN",
    title: "Equal Pay and Wage Transparency",
    description: "임금 투명성과 동일임금 정책 권고를 정리한 자료",
    url: "https://www.unwomen.org/en"
  },
  {
    type: "ILO",
    title: "Global Wage Report",
    description: "성별 임금 격차와 노동시장 구조를 다루는 국제 보고서",
    url: "https://www.ilo.org/global/research/global-reports/global-wage-report/lang--en/index.htm"
  },
  {
    type: "OECD",
    title: "Gender Wage Gap Indicator",
    description: "국가별 성별 임금격차 지표를 비교할 수 있는 데이터 페이지",
    url: "https://www.oecd.org/en/data/indicators/gender-wage-gap.html"
  }
];

let payGapDataPromise = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function toPercent(value) {
  return Math.round((Number(value) || 0) * 1000) / 10;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function normalizeDayMinutes(minutes) {
  const day = 24 * 60;
  const value = Number(minutes) || 0;
  return ((Math.round(value) % day) + day) % day;
}

function formatClockTime(minutes) {
  const normalized = normalizeDayMinutes(minutes);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
}

function formatKoreanTime(minutes) {
  const normalized = normalizeDayMinutes(minutes);
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${period} ${hour12}시 ${pad2(minute)}분`;
}

function calculatePayClock(gapRateInput) {
  const gapRate = clamp(Number(gapRateInput) || 0, 0, 1);
  const unpaidMinutes = Math.round(WORK_DAY_MINUTES * gapRate);
  const unpaidStartMinutes = clamp(
    WORK_END_MINUTES - unpaidMinutes,
    WORK_START_MINUTES,
    WORK_END_MINUTES
  );

  return {
    gapRate,
    unpaidMinutes,
    unpaidStartMinutes
  };
}

function normalizeCountryData(rawList) {
  if (!Array.isArray(rawList) || !rawList.length) return DEFAULT_PAY_GAP_DATA;
  const normalized = rawList
    .map((item) => {
      const code = String(item?.code || "").trim().toUpperCase();
      const nameKo = String(item?.nameKo || "").trim();
      const nameEn = String(item?.nameEn || "").trim();
      const source = String(item?.source || "교육용 샘플 데이터").trim();
      const sourceYear = Number(item?.sourceYear) || 2025;
      const gapRate = clamp(Number(item?.gapRate) || 0, 0, 1);

      if (!code || !nameKo || !nameEn) return null;
      return {
        code,
        nameKo,
        nameEn,
        gapRate,
        source,
        sourceYear
      };
    })
    .filter(Boolean);

  return normalized.length ? normalized : DEFAULT_PAY_GAP_DATA;
}

function getPayGapData() {
  if (!payGapDataPromise) {
    payGapDataPromise = loadJsonData(
      "/app/data/sdg05/payGapByCountry.json",
      DEFAULT_PAY_GAP_DATA,
      (data) => Array.isArray(data) && data.length > 0
    )
      .then((data) => normalizeCountryData(data))
      .catch(() => DEFAULT_PAY_GAP_DATA);
  }
  return payGapDataPromise;
}

export class Sdg05DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg05";
    this.frameMode = "immersive";

    this.refs = {};
    this.countries = [];
    this.state = this.createInitialState();
    this.disposeRequested = false;
    this.animationRafId = null;
    this.mainStepTimers = [];
    this.extraStepTimers = [];
    this.hasEnteredMain = false;
    this.renderVersion = 0;
    this.runVersion = 0;
  }

  createInitialState() {
    return {
      selectedCode: "",
      hasStarted: false,
      running: false,
      hasResult: false
    };
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
              ${this.renderResourceItems()}
            </div>
          </article>
          </section>
        </section>
      </div>
    `;
  }

  renderResourceItems() {
    return RESOURCE_ITEMS.map((resource) => `
      <article class="sdg05-resource-item">
        <p class="sdg05-resource-type">${escapeHtml(resource.type)}</p>
        <h4 class="sdg05-resource-title">${escapeHtml(resource.title)}</h4>
        <p class="sdg05-resource-desc">${escapeHtml(resource.description)}</p>
        <a class="sdg05-resource-open" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">열기</a>
      </article>
    `).join("");
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
    if (!country) {
      if (this.refs.countryHint) this.refs.countryHint.textContent = "국가 데이터를 불러오지 못했습니다.";
      if (this.refs.mainCountryLabel) this.refs.mainCountryLabel.textContent = "-";
      return;
    }
    if (this.refs.countryHint) {
      this.refs.countryHint.textContent = `${country.nameKo} 임금 격차 ${toPercent(country.gapRate)}%`;
    }
    if (this.refs.mainCountryLabel) {
      this.refs.mainCountryLabel.textContent = `${country.nameKo} · 임금 격차 ${toPercent(country.gapRate)}%`;
    }
  }

  applyClockTime(minutes) {
    const normalized = normalizeDayMinutes(minutes);
    const minute = normalized % 60;
    const hoursOnDial = (normalized % 720) / 60;
    const hourDeg = hoursOnDial * 30;
    const minuteDeg = minute * 6;

    if (this.refs.hourHand) {
      this.refs.hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    }
    if (this.refs.minuteHand) {
      this.refs.minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    }
    if (this.refs.clockReadout) {
      this.refs.clockReadout.textContent = formatClockTime(normalized);
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
    scheduleStepMotion(this.extraStepTimers, panel, ".sdg05-extra-step", EXTRA_REVEAL_STAGGER_MS);
  }

  renderResult(country, result) {
    const gapPercent = toPercent(result.gapRate);
    const unpaidStartLabel = formatKoreanTime(result.unpaidStartMinutes);
    const unpaidStartClock = formatClockTime(result.unpaidStartMinutes);

    if (this.refs.resultMain) {
      this.refs.resultMain.textContent = `당신은 오늘 ${unpaidStartLabel}부터 무급으로 일하고 있습니다.`;
    }
    if (this.refs.resultMeta) {
      this.refs.resultMeta.textContent = `무급 노동 시간 ${result.unpaidMinutes}분 · ${unpaidStartClock} ~ 18:00`;
    }
    if (this.refs.countryLine) {
      this.refs.countryLine.textContent = `${country.nameKo} (${country.nameEn}) 임금 격차 ${gapPercent}%`;
    }
    if (this.refs.countrySource) {
      this.refs.countrySource.textContent = `기준: ${country.sourceYear} · ${country.source}`;
    }
  }

  animateClockTo(targetMinutes, runId) {
    const startVirtual = WORK_START_MINUTES;
    const endVirtual = targetMinutes + ANIMATION_LOOPS * 720;
    const startAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (this.disposeRequested || runId !== this.runVersion) {
          this.animationRafId = null;
          resolve();
          return;
        }

        const elapsed = now - startAt;
        const progress = clamp(elapsed / ANIMATION_DURATION_MS, 0, 1);
        const eased = easeOutCubic(progress);
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
    const result = calculatePayClock(country.gapRate);

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

    this.applyClockTime(WORK_START_MINUTES);
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

    this.applyClockTime(WORK_START_MINUTES);
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
    this.state = this.createInitialState();
    this.countries = await getPayGapData();
    if (this.disposeRequested || renderVersion !== this.renderVersion) return;

    if (!this.countries.length) {
      this.countries = DEFAULT_PAY_GAP_DATA;
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
    this.state = this.createInitialState();
    this.hasEnteredMain = false;
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);
    if (this.host) this.host.innerHTML = "";
  }
}
