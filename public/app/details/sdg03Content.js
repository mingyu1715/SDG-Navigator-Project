import { clearStepMotionTimers, scheduleStepMotion, toggleDetailViewClass } from "./sharedRuntime.js";

const EMERGENCY = {
  label: "급성 응급상황",
  severity: 3
};

const COUNTRIES = {
  south_korea: {
    label: "대한민국",
    access: 5
  },
  usa: {
    label: "미국",
    access: 4
  },
  brazil: {
    label: "브라질",
    access: 3
  },
  india: {
    label: "인도",
    access: 2
  },
  south_sudan: {
    label: "남수단",
    access: 1
  }
};

const COUNTRY_KEYS = Object.keys(COUNTRIES);
const HIGH_ACCESS_KEYS = ["south_korea", "usa"];
const LOW_ACCESS_KEYS = ["india", "south_sudan"];
const HIGH_RESULT_HOLD_MS = 4500;
const MID_WARNING_HOLD_MS = 2000;

const RESULT_META = {
  treatable: {
    key: "treatable",
    label: "치료 가능",
    ecgMode: "stable",
    statusClass: "is-success",
    accessLabel: "높음",
    detail: "골든타임 내 처치가 시작되었습니다."
  },
  delayed: {
    key: "delayed",
    label: "치료 지연",
    ecgMode: "unstable",
    statusClass: "is-delay",
    accessLabel: "낮음",
    detail: "초기 처치가 늦어지고 있습니다."
  },
  near_impossible: {
    key: "near_impossible",
    label: "치료 불가에 가까움",
    ecgMode: "near-flatline",
    statusClass: "is-critical",
    accessLabel: "매우 낮음",
    detail: "이 환경에서는 치료가 시작되지 않습니다."
  }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomFrom(keys) {
  const idx = Math.floor(Math.random() * keys.length);
  return keys[idx];
}

function calcSurvivalPercent(access) {
  const base = access * 16 - 20;
  return clamp(Math.round(base), 8, 93);
}

function calcResponseMinutes(access, severity) {
  const minutes = 128 - access * 18 + severity * 7;
  return clamp(Math.round(minutes), 18, 185);
}

function calcGoldenTimeRate(access, severity) {
  const rate = access * 18 - severity * 6 + 28;
  return clamp(Math.round(rate), 8, 94);
}

function calcHeartRate(resultKey, access) {
  if (resultKey === "treatable") {
    return clamp(Math.round(92 - access * 3), 70, 95);
  }
  if (resultKey === "delayed") {
    return clamp(Math.round(106 + (3 - access) * 8), 96, 132);
  }
  return clamp(Math.round(52 - (2 - access) * 8), 28, 58);
}

function calculateOutcome(countryKey) {
  const country = COUNTRIES[countryKey];
  const access = country?.access ?? 3;
  const survival = calcSurvivalPercent(access);
  const riskIndex = access - EMERGENCY.severity;

  let result = RESULT_META.delayed;
  if (riskIndex >= 1) {
    result = RESULT_META.treatable;
  } else if (riskIndex < 0) {
    result = RESULT_META.near_impossible;
  }

  const responseMinutes = calcResponseMinutes(access, EMERGENCY.severity);
  const goldenRate = calcGoldenTimeRate(access, EMERGENCY.severity);
  const bpm = calcHeartRate(result.key, access);

  return {
    country,
    result,
    survival,
    access,
    responseMinutes,
    goldenRate,
    bpm
  };
}

function gaussianPulse(phase, center, width, amp) {
  const dist = (phase - center) / width;
  return amp * Math.exp(-0.5 * dist * dist);
}

function pqrstWave(phase, gain = 1) {
  return (
    gaussianPulse(phase, 0.19, 0.025, 0.11 * gain) +
    gaussianPulse(phase, 0.38, 0.010, -0.19 * gain) +
    gaussianPulse(phase, 0.405, 0.006, 1.30 * gain) +
    gaussianPulse(phase, 0.435, 0.012, -0.38 * gain) +
    gaussianPulse(phase, 0.69, 0.055, 0.28 * gain)
  );
}

function ecgSignal(mode, beatPhase, timeSec) {
  if (mode === "stable") {
    return pqrstWave(beatPhase, 1) + Math.sin(timeSec * 1.7) * 0.018;
  }

  if (mode === "unstable") {
    const warpedPhase = (beatPhase * (1 + Math.sin(timeSec * 3.4) * 0.18)) % 1;
    const gain = 0.76 + Math.sin(timeSec * 4.9) * 0.34 + Math.sin(timeSec * 9.2) * 0.12;
    const tremor = Math.sin(timeSec * 21) * 0.06 + Math.sin(timeSec * 33) * 0.03;
    return pqrstWave(warpedPhase, gain) + tremor;
  }

  if (mode === "near-flatline") {
    return 0;
  }

  return pqrstWave(beatPhase, 1.08) + Math.sin(timeSec * 14.2) * 0.04;
}

function tone(freq, durationMs, type = "sine", gain = 0.06) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  if (!tone.ctx) {
    tone.ctx = new Ctx();
  }
  const ctx = tone.ctx;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.value = gain;
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationMs / 1000);
}

tone.ctx = null;

function disposeToneContext() {
  const ctx = tone.ctx;
  tone.ctx = null;
  if (!ctx || typeof ctx.close !== "function") return;
  void ctx.close().catch(() => null);
}

function countryFlowSentence(countryLabel, resultKey) {
  if (resultKey === "treatable") {
    return `${countryLabel}에서는 치료가 시작되었습니다.`;
  }
  if (resultKey === "delayed") {
    return `${countryLabel}에서는 치료가 지연되고 있습니다.`;
  }
  return `${countryLabel}에서는 치료가 시작되지 않습니다.`;
}

export class Sdg03DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg03";
    this.frameMode = "immersive";
    this.refs = {};
    this.disposeRequested = false;
    this.state = this.createInitialState();
    this.ecgRafId = null;
    this.ecgTick = 0;
    this.ecgTrace = [];
    this.ecgWriteIndex = 0;
    this.ecgSampleTime = 0;
    this.slotInterval = null;
    this.slotResolver = null;
    this.autoStartTimer = null;
    this.hasEnteredMain = false;
    this.stepRevealTimers = [];
    this.delayTimers = new Set();
    this.sequenceVersion = 0;

    this.boundEnter = () => this.enterExperience();
    this.boundAction = () => this.startComparison();
  }

  createInitialState() {
    return {
      hasStarted: false,
      phase: "idle",
      ecgMode: "stable",
      ecgBpm: 78,
      statusClass: "",
      history: []
    };
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg03-title-hidden", hidden);
  }

  clearSlotInterval() {
    if (this.slotInterval) {
      window.clearInterval(this.slotInterval);
      this.slotInterval = null;
    }
    if (this.slotResolver) {
      const resolve = this.slotResolver;
      this.slotResolver = null;
      resolve(randomFrom(COUNTRY_KEYS));
    }
  }

  wait(ms) {
    return new Promise((resolve) => {
      const entry = {
        id: null,
        resolve
      };

      entry.id = window.setTimeout(() => {
        this.delayTimers.delete(entry);
        resolve();
      }, ms);

      this.delayTimers.add(entry);
    });
  }

  clearDelayTimers() {
    this.delayTimers.forEach((entry) => {
      window.clearTimeout(entry.id);
      entry.resolve();
    });
    this.delayTimers.clear();
  }

  render() {
    if (!this.host) return;
    this.teardownRuntime();
    this.disposeRequested = false;
    this.state = this.createInitialState();
    this.ecgTrace = [];
    this.ecgWriteIndex = 0;
    this.ecgSampleTime = 0;
    this.setTitleSectorHidden(true);

    this.host.innerHTML = `
      <div class="sdg03-monitor is-idle" data-role="root">
        <section class="sdg03-hero" data-role="hero">
          <div class="sdg03-hero-monitor" aria-hidden="true">
            <div class="sdg03-hero-grid"></div>
            <svg class="sdg03-hero-ecg" viewBox="0 0 1200 240" preserveAspectRatio="none">
              <path d="M0 146 L70 146 L98 146 L126 146 L156 146 L184 84 L208 200 L236 146 L320 146 L360 146 L392 146 L424 146 L454 94 L478 194 L506 146 L590 146 L650 146 L680 146 L708 146 L738 86 L762 204 L790 146 L878 146 L930 146 L960 146 L992 146 L1022 92 L1048 198 L1076 146 L1200 146" />
            </svg>
            <svg class="sdg03-hero-ecg sdg03-hero-ecg-soft" viewBox="0 0 1200 240" preserveAspectRatio="none">
              <path d="M0 146 L70 146 L98 146 L126 146 L156 146 L184 84 L208 200 L236 146 L320 146 L360 146 L392 146 L424 146 L454 94 L478 194 L506 146 L590 146 L650 146 L680 146 L708 146 L738 86 L762 204 L790 146 L878 146 L930 146 L960 146 L992 146 L1022 92 L1048 198 L1076 146 L1200 146" />
            </svg>
            <div class="sdg03-hero-scan"></div>
            <div class="sdg03-hero-blur"></div>
          </div>
          <p class="sdg03-goal-label">SDG GOAL 03</p>
          <h2 class="sdg03-title">골든타임의 경계</h2>
          <p class="sdg03-subtitle">High Access vs Low Access</p>
          <p class="sdg03-hero-lead">
            같은 응급상황이라도 의료 접근 조건이 다르면<br />
            생존 결과는 극적으로 갈립니다.
          </p>
          <button type="button" class="sdg03-enter-btn" data-role="enterBtn">비교 체험 시작</button>
        </section>

        <section class="sdg03-main" data-role="main" aria-hidden="true">
          <section class="sdg03-ecg-panel sdg03-step">
            <canvas class="sdg03-ecg-canvas" data-role="ecgCanvas" aria-label="ECG 모니터 애니메이션"></canvas>
            <div class="sdg03-grid-overlay" aria-hidden="true"></div>
            <p class="sdg03-alert" data-role="alertText">비교를 시작하면 상태가 바뀝니다.</p>
          </section>

          <section class="sdg03-state sdg03-step">
            <p class="sdg03-phase-label" data-role="phaseLabel">대기 상태</p>
            <h3 class="sdg03-status-word" data-role="statusWord">--</h3>
            <p class="sdg03-country-result" data-role="countryResult">국가와 결과가 한 흐름으로 표시됩니다.</p>
            <p class="sdg03-status-note" data-role="statusNote">지금은 대기 중입니다.</p>
            <div class="sdg03-mini-metrics">
              <div class="sdg03-mini-item">
                <p>생존 가능성</p>
                <strong data-role="survivalValue">-</strong>
              </div>
              <div class="sdg03-mini-item">
                <p>의료 접근성</p>
                <strong data-role="accessValue">-</strong>
              </div>
              <div class="sdg03-mini-item">
                <p>골든타임 처치율</p>
                <strong data-role="goldenRateValue">-</strong>
              </div>
              <div class="sdg03-mini-item">
                <p>처치 시작</p>
                <strong data-role="responseValue">-</strong>
              </div>
            </div>
            <p class="sdg03-metric-basis" data-role="metricBasis">
              기준: 교육용 더미 모델(의료 접근성 1~5, 응급 중증도 3). 처치 시작은 증상 발생 후 응급 처치 개시까지의 예상 시간입니다.
            </p>
            <button type="button" class="sdg03-action-btn" data-role="actionBtn">비교 재생</button>
          </section>

          <section class="sdg03-resources sdg03-step" aria-label="추가 자료">
            <p class="sdg03-resources-overline">추가 자료</p>
            <h4 class="sdg03-resources-title">의료 접근성 격차 더 보기</h4>
            <div class="sdg03-resource-list">
              <article class="sdg03-resource-item">
                <p class="sdg03-resource-type">WHO</p>
                <h5 class="sdg03-resource-title">Emergency Care</h5>
                <p class="sdg03-resource-desc">응급의료 체계와 접근성 개선 방향</p>
                <a class="sdg03-resource-open" href="https://www.who.int/health-topics/emergency-care" target="_blank" rel="noopener noreferrer">자료 보기</a>
              </article>
              <article class="sdg03-resource-item">
                <p class="sdg03-resource-type">World Bank</p>
                <h5 class="sdg03-resource-title">Universal Health Coverage</h5>
                <p class="sdg03-resource-desc">국가별 보편적 의료보장 과제와 지표</p>
                <a class="sdg03-resource-open" href="https://www.worldbank.org/en/topic/universalhealthcoverage" target="_blank" rel="noopener noreferrer">자료 보기</a>
              </article>
              <article class="sdg03-resource-item">
                <p class="sdg03-resource-type">UN SDG</p>
                <h5 class="sdg03-resource-title">Goal 3</h5>
                <p class="sdg03-resource-desc">건강과 웰빙 목표의 핵심 타깃과 현황</p>
                <a class="sdg03-resource-open" href="https://sdgs.un.org/goals/goal3" target="_blank" rel="noopener noreferrer">자료 보기</a>
              </article>
            </div>
          </section>
        </section>
      </div>
    `;

    this.cacheRefs();
    this.bindEvents();
    this.applyStateClass("idle");
    this.renderIdleState();
    this.updateVisibility();
    this.startEcg();
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      hero: get("hero"),
      main: get("main"),
      enterBtn: get("enterBtn"),
      ecgCanvas: get("ecgCanvas"),
      alertText: get("alertText"),
      phaseLabel: get("phaseLabel"),
      statusWord: get("statusWord"),
      countryResult: get("countryResult"),
      statusNote: get("statusNote"),
      survivalValue: get("survivalValue"),
      accessValue: get("accessValue"),
      goldenRateValue: get("goldenRateValue"),
      responseValue: get("responseValue"),
      metricBasis: get("metricBasis"),
      actionBtn: get("actionBtn")
    };
  }

  bindEvents() {
    if (this.refs.enterBtn) {
      this.refs.enterBtn.addEventListener("click", this.boundEnter);
    }
    if (this.refs.actionBtn) {
      this.refs.actionBtn.addEventListener("click", this.boundAction);
    }
  }

  clearStepMotion() {
    clearStepMotionTimers(this.stepRevealTimers, this.host, ".sdg03-step");
  }

  setupStepMotion() {
    scheduleStepMotion(this.stepRevealTimers, this.host, ".sdg03-step", 110);
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
      this.clearStepMotion();
      return;
    }

    if (!this.hasEnteredMain) {
      this.hasEnteredMain = true;
      this.setupStepMotion();
    }
  }

  setAlert(text) {
    if (this.refs.alertText) this.refs.alertText.textContent = text;
  }

  setEcgMode(mode, bpm = null) {
    if (this.state.ecgMode !== mode) {
      this.state.ecgMode = mode;
      this.ecgTrace = [];
      this.ecgWriteIndex = 0;
    } else {
      this.state.ecgMode = mode;
    }
    if (typeof bpm === "number" && Number.isFinite(bpm)) {
      this.state.ecgBpm = clamp(Math.round(bpm), 26, 170);
    }
  }

  applyStateClass(phase, statusClass = "") {
    this.state.phase = phase;
    this.state.statusClass = statusClass;

    const root = this.refs.root;
    if (!root) return;

    root.classList.remove(
      "is-idle",
      "is-emergency",
      "is-slot",
      "is-transition",
      "is-result",
      "is-summary",
      "is-success",
      "is-delay",
      "is-critical"
    );
    root.classList.add(`is-${phase}`);
    if (statusClass) root.classList.add(statusClass);
  }

  renderIdleState() {
    if (this.refs.phaseLabel) this.refs.phaseLabel.textContent = "대기 상태";
    if (this.refs.statusWord) this.refs.statusWord.textContent = "--";
    if (this.refs.countryResult) this.refs.countryResult.textContent = "비교를 시작하면 같은 응급상황이 두 환경에서 재생됩니다.";
    if (this.refs.statusNote) this.refs.statusNote.textContent = "대기 중";
    if (this.refs.survivalValue) this.refs.survivalValue.textContent = "-";
    if (this.refs.accessValue) this.refs.accessValue.textContent = "-";
    if (this.refs.goldenRateValue) this.refs.goldenRateValue.textContent = "-";
    if (this.refs.responseValue) this.refs.responseValue.textContent = "-";
    if (this.refs.actionBtn) {
      this.refs.actionBtn.disabled = false;
      this.refs.actionBtn.textContent = "비교 재생";
    }
    this.applyStateClass("idle");
    this.setEcgMode("stable", 78);
    this.setAlert("비교를 시작하면 상태가 바뀝니다.");
  }

  enterExperience() {
    if (this.state.hasStarted) return;
    if (this.refs.enterBtn) this.refs.enterBtn.disabled = true;
    this.state.hasStarted = true;
    this.updateVisibility();
    tone(640, 120, "triangle", 0.05);

    if (this.autoStartTimer) {
      window.clearTimeout(this.autoStartTimer);
      this.autoStartTimer = null;
    }
    this.autoStartTimer = window.setTimeout(() => {
      this.autoStartTimer = null;
      if (this.disposeRequested || !this.state.hasStarted) return;
      void this.startComparison();
    }, 360);
  }

  applyOutcome(payload, contextText) {
    const sentence = countryFlowSentence(payload.country.label, payload.result.key);

    this.applyStateClass("result", payload.result.statusClass);
    this.setEcgMode(payload.result.ecgMode, payload.bpm);

    if (this.refs.phaseLabel) this.refs.phaseLabel.textContent = contextText;
    if (this.refs.statusWord) this.refs.statusWord.textContent = payload.result.label;
    if (this.refs.countryResult) this.refs.countryResult.textContent = sentence;
    if (this.refs.statusNote) this.refs.statusNote.textContent = payload.result.detail;
    if (this.refs.survivalValue) this.refs.survivalValue.textContent = `${payload.survival}%`;
    if (this.refs.accessValue) this.refs.accessValue.textContent = `${payload.result.accessLabel} (${payload.access}/5)`;
    if (this.refs.goldenRateValue) this.refs.goldenRateValue.textContent = `${payload.goldenRate}%`;
    if (this.refs.responseValue) this.refs.responseValue.textContent = `${payload.responseMinutes}분`;
  }

  async spinCountrySlot(targetKeys) {
    return new Promise((resolve) => {
      const totalDuration = 1700;
      const stepMs = 70;
      const startAt = performance.now();

      this.clearSlotInterval();
      this.slotResolver = resolve;

      this.slotInterval = window.setInterval(() => {
        const elapsed = performance.now() - startAt;
        const rollingKey = randomFrom(COUNTRY_KEYS);
        const rollingCountry = COUNTRIES[rollingKey];

        if (this.refs.countryResult) {
          this.refs.countryResult.textContent = `${rollingCountry.label}에서 결과를 분석 중입니다...`;
        }

        if (elapsed >= totalDuration) {
          window.clearInterval(this.slotInterval);
          this.slotInterval = null;
          const finalKey = randomFrom(targetKeys);
          if (this.slotResolver) {
            const done = this.slotResolver;
            this.slotResolver = null;
            done(finalKey);
          }
        }
      }, stepMs);
    });
  }

  async playTier(tier) {
    const isHigh = tier === "high";
    const targetKeys = isHigh ? HIGH_ACCESS_KEYS : LOW_ACCESS_KEYS;
    const label = isHigh ? "접근 높은 국가" : "접근 낮은 국가";

    this.applyStateClass("slot");
    this.setEcgMode("unstable", isHigh ? 116 : 128);
    this.setAlert(`${label} 결정 중`);
    if (this.refs.phaseLabel) this.refs.phaseLabel.textContent = `${label} 분석`;
    if (this.refs.statusWord) this.refs.statusWord.textContent = "판정 중";

    const countryKey = await this.spinCountrySlot(targetKeys);
    if (this.disposeRequested) return null;

    const payload = calculateOutcome(countryKey);
    this.applyOutcome(payload, isHigh ? "1차 결과" : "2차 결과");
    this.setAlert(isHigh ? "첫 번째 결과가 반영되었습니다." : "두 번째 결과가 반영되었습니다.");

    tone(isHigh ? 520 : 270, isHigh ? 170 : 320, isHigh ? "triangle" : "sawtooth", 0.06);
    return payload;
  }

  async startComparison() {
    if (!this.state.hasStarted) return;
    if (!this.refs.actionBtn || this.refs.actionBtn.disabled) return;

    const runId = ++this.sequenceVersion;
    this.state.history = [];

    this.refs.actionBtn.disabled = true;
    this.refs.actionBtn.textContent = "진행 중...";
    if (this.refs.survivalValue) this.refs.survivalValue.textContent = "-";
    if (this.refs.accessValue) this.refs.accessValue.textContent = "-";
    if (this.refs.goldenRateValue) this.refs.goldenRateValue.textContent = "-";
    if (this.refs.responseValue) this.refs.responseValue.textContent = "-";

    this.applyStateClass("emergency");
    this.setEcgMode("unstable", 126);
    this.setAlert("응급 상황 진입");
    if (this.refs.phaseLabel) this.refs.phaseLabel.textContent = "응급 상황";
    if (this.refs.statusWord) this.refs.statusWord.textContent = "위험 감지";
    if (this.refs.countryResult) this.refs.countryResult.textContent = "동일 응급상황을 두 환경에 적용합니다.";
    if (this.refs.statusNote) this.refs.statusNote.textContent = "상태 전환 중";

    tone(760, 170, "triangle", 0.06);
    await this.wait(820);
    if (this.disposeRequested || runId !== this.sequenceVersion) return;

    const highPayload = await this.playTier("high");
    if (this.disposeRequested || runId !== this.sequenceVersion) return;
    if (highPayload) this.state.history.push(highPayload);

    await this.wait(HIGH_RESULT_HOLD_MS);
    if (this.disposeRequested || runId !== this.sequenceVersion) return;

    this.applyStateClass("transition");
    this.setEcgMode("unstable", 121);
    this.setAlert("환경 전환 중");
    if (this.refs.phaseLabel) this.refs.phaseLabel.textContent = "환경 전환";
    if (this.refs.statusWord) this.refs.statusWord.textContent = "조건 변화";
    if (this.refs.countryResult) this.refs.countryResult.textContent = "같은 환자를 더 낮은 접근 환경으로 이동합니다.";

    await this.wait(MID_WARNING_HOLD_MS);
    if (this.disposeRequested || runId !== this.sequenceVersion) return;

    const lowPayload = await this.playTier("low");
    if (this.disposeRequested || runId !== this.sequenceVersion) return;
    if (lowPayload) this.state.history.push(lowPayload);

    await this.wait(640);
    if (this.disposeRequested || runId !== this.sequenceVersion) return;

    const [high, low] = this.state.history;
    const gap = high && low ? Math.max(0, high.survival - low.survival) : null;
    const accessGap = high && low ? Math.max(0, high.access - low.access) : null;
    const summaryFlow = high && low
      ? `${high.country.label}에서는 치료가 시작됐지만 ${low.country.label}에서는 ${low.result.key === "near_impossible" ? "치료가 시작되지 않습니다." : "치료가 지연됩니다."}`
      : "같은 상황도 환경에 따라 결과가 달라집니다.";

    this.applyStateClass("summary", low?.result?.statusClass || "");
    this.setEcgMode(low?.result?.ecgMode || "near-flatline", low?.bpm || 42);
    this.setAlert("비교 완료");
    if (this.refs.phaseLabel) this.refs.phaseLabel.textContent = "비교 완료";
    if (this.refs.countryResult) this.refs.countryResult.textContent = summaryFlow;
    if (this.refs.statusNote) {
      this.refs.statusNote.textContent = gap == null
        ? "동일 상황에서 접근 조건 차이가 결과를 바꿉니다."
        : `생존 가능성 ${gap}%p · 의료 접근성 ${accessGap}단계 격차`;
    }

    this.refs.actionBtn.disabled = false;
    this.refs.actionBtn.textContent = "다시 시도";
  }

  startEcg() {
    const canvas = this.refs.ecgCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (this.disposeRequested) return;
      this.ecgRafId = window.requestAnimationFrame(draw);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width < 2 || height < 2) return;
      const targetWidth = Math.floor(width * dpr);
      const targetHeight = Math.floor(height * dpr);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const yBase = height * 0.56;
      const mode = this.state.ecgMode;
      const bpm = clamp(this.state.ecgBpm || 80, 26, 170);
      const phase = this.state.phase;

      let strokeColor = "#66ff9f";
      let glow = "rgba(102, 255, 159, 0.56)";
      if (phase === "emergency" || phase === "slot" || phase === "transition" || mode === "unstable") {
        strokeColor = "#ffd95f";
        glow = "rgba(255, 217, 95, 0.54)";
      }
      if (mode === "near-flatline") {
        strokeColor = "#ff6f6f";
        glow = "rgba(255, 111, 111, 0.42)";
      }

      if (this.ecgTrace.length !== width) {
        this.ecgTrace = new Array(width).fill(null);
        this.ecgWriteIndex = 0;
      }

      const pointsPerFrame = mode === "near-flatline"
        ? 2
        : Math.max(2, Math.round(2.3 + bpm / 62));
      const beatDuration = 60 / bpm;
      const amplitudePx = mode === "unstable" ? 58 : 52;
      const sampleDt = 1 / 170;

      for (let i = 0; i < pointsPerFrame; i += 1) {
        const beatPhase = (this.ecgSampleTime % beatDuration) / beatDuration;
        let signal = ecgSignal(mode, beatPhase, this.ecgSampleTime);
        if (mode === "unstable") {
          const weakA = Math.max(0, Math.sin(this.ecgSampleTime * 6.7) - 0.82) * 2.4;
          const weakB = Math.max(0, -Math.sin(this.ecgSampleTime * 11.4 + 0.8) - 0.86) * 2.2;
          const attenuation = clamp(1 - weakA - weakB, 0.22, 1);
          signal *= attenuation;
        }
        const y = mode === "near-flatline" ? yBase : yBase - signal * amplitudePx;
        this.ecgTrace[this.ecgWriteIndex] = y;

        this.ecgWriteIndex += 1;
        if (this.ecgWriteIndex >= width) {
          this.ecgWriteIndex = 0;
          this.ecgTrace.fill(null);
        }
        this.ecgSampleTime += sampleDt;
      }

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = strokeColor;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      let hasActivePath = false;

      for (let x = 0; x < width; x += 1) {
        const y = this.ecgTrace[x];
        if (typeof y !== "number") {
          hasActivePath = false;
          continue;
        }

        if (!hasActivePath) {
          ctx.moveTo(x, y);
          hasActivePath = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      const headX = Math.max(0, this.ecgWriteIndex - 1);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(headX, 0, 2, height);

      if (phase === "emergency" || phase === "slot" || phase === "transition") {
        this.ecgTick += 1;
        const flicker = (Math.sin(this.ecgTick * 0.08) + 1) / 2;
        ctx.fillStyle = `rgba(255,255,255,${0.04 + flicker * 0.08})`;
        ctx.fillRect(0, 0, width, height);
      }
    };

    draw();
  }

  teardownRuntime() {
    this.clearSlotInterval();
    if (this.autoStartTimer) {
      window.clearTimeout(this.autoStartTimer);
      this.autoStartTimer = null;
    }
    this.clearDelayTimers();
    this.clearStepMotion();
    if (this.ecgRafId) {
      window.cancelAnimationFrame(this.ecgRafId);
      this.ecgRafId = null;
    }
    disposeToneContext();
  }

  destroy() {
    this.disposeRequested = true;
    this.sequenceVersion += 1;
    this.teardownRuntime();
    this.hasEnteredMain = false;
    this.refs = {};
    if (this.host) this.host.innerHTML = "";
    this.state = this.createInitialState();
    this.setTitleSectorHidden(false);
  }
}
