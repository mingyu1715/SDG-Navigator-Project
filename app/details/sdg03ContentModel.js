const EMERGENCY = {
  label: "급성 응급상황",
  severity: 3
};

export const SDG03_COUNTRIES = {
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

export const SDG03_COUNTRY_KEYS = Object.keys(SDG03_COUNTRIES);
export const SDG03_HIGH_ACCESS_KEYS = ["south_korea", "usa"];
export const SDG03_LOW_ACCESS_KEYS = ["india", "south_sudan"];
export const SDG03_HIGH_RESULT_HOLD_MS = 4500;
export const SDG03_MID_WARNING_HOLD_MS = 2000;

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

export function clampSdg03Value(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function randomSdg03From(keys) {
  const idx = Math.floor(Math.random() * keys.length);
  return keys[idx];
}

function calcSurvivalPercent(access) {
  const base = access * 16 - 20;
  return clampSdg03Value(Math.round(base), 8, 93);
}

function calcResponseMinutes(access, severity) {
  const minutes = 128 - access * 18 + severity * 7;
  return clampSdg03Value(Math.round(minutes), 18, 185);
}

function calcGoldenTimeRate(access, severity) {
  const rate = access * 18 - severity * 6 + 28;
  return clampSdg03Value(Math.round(rate), 8, 94);
}

function calcHeartRate(resultKey, access) {
  if (resultKey === "treatable") {
    return clampSdg03Value(Math.round(92 - access * 3), 70, 95);
  }
  if (resultKey === "delayed") {
    return clampSdg03Value(Math.round(106 + (3 - access) * 8), 96, 132);
  }
  return clampSdg03Value(Math.round(52 - (2 - access) * 8), 28, 58);
}

export function calculateSdg03Outcome(countryKey) {
  const country = SDG03_COUNTRIES[countryKey];
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

export function sdg03EcgSignal(mode, beatPhase, timeSec) {
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

export function countryFlowSentence(countryLabel, resultKey) {
  if (resultKey === "treatable") {
    return `${countryLabel}에서는 치료가 시작되었습니다.`;
  }
  if (resultKey === "delayed") {
    return `${countryLabel}에서는 치료가 지연되고 있습니다.`;
  }
  return `${countryLabel}에서는 치료가 시작되지 않습니다.`;
}

export function createSdg03InitialState() {
  return {
    hasStarted: false,
    phase: "idle",
    ecgMode: "stable",
    ecgBpm: 78,
    statusClass: "",
    history: []
  };
}
