export const SDG07_TOTAL_SHARE = 100;
export const SDG07_ENERGY_KEYS = Object.freeze(["solar", "wind", "thermal"]);
export const SDG07_STAGE_INTRO = "intro";
export const SDG07_STAGE_EXPERIENCE = "experience";
export const SDG07_DEFAULT_MIX = Object.freeze({
  solar: 32,
  wind: 28,
  thermal: 40
});
export const SDG07_DEFAULT_TRANSITION_LEVEL = SDG07_DEFAULT_MIX.solar + SDG07_DEFAULT_MIX.wind;

const RENEWABLE_KEYS = Object.freeze(["solar", "wind"]);
const DEFAULT_RENEWABLE_WEIGHTS = Object.freeze([SDG07_DEFAULT_MIX.solar, SDG07_DEFAULT_MIX.wind]);

const INTEGER_FORMATTER = new Intl.NumberFormat("ko-KR");
const ENERGY_LABELS = Object.freeze({
  solar: "태양광",
  wind: "풍력",
  thermal: "화력"
});
const AIR_QUALITY_LEVELS = Object.freeze([
  {
    minScore: 85,
    label: "매우 좋음",
    tone: "excellent",
    description: "재생에너지 비중이 높아 스모그가 거의 사라지고 도시 시야가 맑습니다."
  },
  {
    minScore: 65,
    label: "좋음",
    tone: "good",
    description: "화력 의존이 낮아지며 하늘 탁도와 탄소 부담이 안정적으로 줄어듭니다."
  },
  {
    minScore: 40,
    label: "보통",
    tone: "moderate",
    description: "전환은 진행 중이지만 화력 배출의 흔적이 여전히 도시 하늘에 남아 있습니다."
  },
  {
    minScore: 0,
    label: "나쁨",
    tone: "bad",
    description: "화력 비중이 높아 공기질과 시야 모두 빠르게 악화되는 상태입니다."
  }
]);

function parseNumericShare(value) {
  return clampSdg07Value(Math.round(Number(value) || 0), 0, SDG07_TOTAL_SHARE);
}

function parseHexChannel(value) {
  return Number.parseInt(value, 16);
}

function hexToRgb(hex) {
  const normalized = String(hex || "")
    .replace("#", "")
    .trim();

  if (normalized.length !== 6) {
    return [0, 0, 0];
  }

  return [
    parseHexChannel(normalized.slice(0, 2)),
    parseHexChannel(normalized.slice(2, 4)),
    parseHexChannel(normalized.slice(4, 6))
  ];
}

function interpolateHexColor(from, to, ratioInput) {
  const ratio = clampSdg07Value(Number(ratioInput) || 0, 0, 1);
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const channels = start.map((value, index) => {
    return Math.round(value + (end[index] - value) * ratio);
  });

  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

function roundToFixedNumber(value, digits = 3) {
  return Number.parseFloat((Number(value) || 0).toFixed(digits));
}

function sumShares(mix) {
  return SDG07_ENERGY_KEYS.reduce((sum, key) => sum + (Number(mix?.[key]) || 0), 0);
}

function allocateIntegerShares(keys, weightsInput, total) {
  const safeTotal = Math.max(0, Math.round(Number(total) || 0));
  const rawWeights = keys.map((_, index) => Math.max(0, Number(weightsInput[index]) || 0));
  const weightSum = rawWeights.reduce((sum, value) => sum + value, 0);
  const weights = weightSum > 0 ? rawWeights : keys.map(() => 1);
  const safeWeightSum = weights.reduce((sum, value) => sum + value, 0);

  const entries = keys.map((key, index) => {
    const raw = safeTotal * (weights[index] / safeWeightSum);
    const base = Math.floor(raw);

    return {
      key,
      index,
      base,
      fraction: raw - base,
      weight: weights[index]
    };
  });

  let remaining = safeTotal - entries.reduce((sum, entry) => sum + entry.base, 0);

  entries
    .slice()
    .sort((a, b) => {
      if (b.fraction !== a.fraction) return b.fraction - a.fraction;
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.index - b.index;
    })
    .forEach((entry) => {
      if (remaining <= 0) return;
      entry.base += 1;
      remaining -= 1;
    });

  return Object.fromEntries(
    entries
      .sort((a, b) => a.index - b.index)
      .map((entry) => [entry.key, entry.base])
  );
}

function getDominantSourceView(mix) {
  const entries = SDG07_ENERGY_KEYS
    .map((key) => ({
      key,
      value: mix[key]
    }))
    .sort((a, b) => b.value - a.value);
  const [first, second] = entries;

  if (!first) {
    return {
      label: "균형 혼합",
      description: "세 전원이 균형을 이루고 있습니다."
    };
  }

  if (first.key === "thermal") {
    return {
      label: "화력 중심",
      description: "배출원이 도시 표정을 주도하는 구성입니다."
    };
  }

  if (first.value - (second?.value || 0) <= 4) {
    return {
      label: "재생 균형",
      description: "태양광과 풍력이 균형 있게 도시를 바꾸고 있습니다."
    };
  }

  return {
    label: `${getSdg07EnergyLabel(first.key)} 중심`,
    description:
      first.key === "solar"
        ? "광량과 도시 채광이 빠르게 살아나는 구성입니다."
        : "터빈 회전과 공기 흐름 변화가 두드러지는 구성입니다."
  };
}

function getAirQualityView(score) {
  return AIR_QUALITY_LEVELS.find((item) => score >= item.minScore) || AIR_QUALITY_LEVELS[AIR_QUALITY_LEVELS.length - 1];
}

function createVisualCaption(mix, airQuality, dominantSource) {
  const renewable = mix.solar + mix.wind;
  const transitionLead =
    renewable >= 75
      ? "도시 하늘이 크게 맑아지고 스모그가 대부분 걷힌 상태입니다."
      : renewable >= 55
        ? "재생에너지가 늘면서 하늘 탁도와 배출 흔적이 동시에 줄고 있습니다."
        : renewable >= 35
          ? "전환이 시작됐지만 화력의 잔향이 아직 도시 표면에 남아 있습니다."
          : "화력 의존이 높아 회색 탁도와 정체된 공기 흐름이 먼저 읽히는 상태입니다.";

  const sourceLead =
    dominantSource.label === "태양광 중심"
      ? "태양광 비중이 높아 햇살과 패널 반사가 먼저 살아납니다."
      : dominantSource.label === "풍력 중심"
        ? "풍력 비중이 높아 터빈 회전과 공기 흐름 변화가 더 선명합니다."
        : dominantSource.label === "화력 중심"
          ? "배출 굴뚝과 스모그가 장면의 중심으로 남아 있습니다."
          : "태양광과 풍력이 균형을 이루며 도시 밝기가 안정적으로 회복됩니다.";

  return `${transitionLead} ${sourceLead} 현재 공기질은 ${airQuality.label} 단계입니다.`;
}

export function clampSdg07Value(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatSdg07Percent(value) {
  return `${INTEGER_FORMATTER.format(Math.round(Number(value) || 0))}%`;
}

export function getSdg07EnergyLabel(key) {
  return ENERGY_LABELS[key] || key;
}

export function normalizeSdg07TransitionLevel(value) {
  return clampSdg07Value(Math.round(Number(value) || 0), 0, SDG07_TOTAL_SHARE);
}

export function createSdg07MixFromTransitionLevel(levelInput) {
  const renewable = normalizeSdg07TransitionLevel(levelInput);
  const thermal = SDG07_TOTAL_SHARE - renewable;
  const renewableMix = allocateIntegerShares(RENEWABLE_KEYS, DEFAULT_RENEWABLE_WEIGHTS, renewable);

  return {
    solar: renewableMix.solar,
    wind: renewableMix.wind,
    thermal
  };
}

export function createSdg07InitialState() {
  return {
    stage: SDG07_STAGE_INTRO,
    hasStarted: false,
    transitionLevel: SDG07_DEFAULT_TRANSITION_LEVEL,
    mix: createSdg07MixFromTransitionLevel(SDG07_DEFAULT_TRANSITION_LEVEL),
    transition: null
  };
}

export function normalizeSdg07Mix(mixInput) {
  const weights = SDG07_ENERGY_KEYS.map((key) => parseNumericShare(mixInput?.[key]));
  const total = weights.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return { ...SDG07_DEFAULT_MIX };
  }

  return allocateIntegerShares(SDG07_ENERGY_KEYS, weights, SDG07_TOTAL_SHARE);
}

export function redistributeSdg07Mix(mixInput, changedKey, nextValue) {
  const baseMix = normalizeSdg07Mix(mixInput);
  if (!SDG07_ENERGY_KEYS.includes(changedKey)) {
    return baseMix;
  }

  const targetValue = parseNumericShare(nextValue);
  const otherKeys = SDG07_ENERGY_KEYS.filter((key) => key !== changedKey);
  const remaining = SDG07_TOTAL_SHARE - targetValue;
  const otherWeights = otherKeys.map((key) => baseMix[key]);
  const redistributed = allocateIntegerShares(otherKeys, otherWeights, remaining);

  return {
    ...redistributed,
    [changedKey]: targetValue
  };
}

export function calculateSdg07Scenario(mixInput) {
  const mix = normalizeSdg07Mix(mixInput);
  const renewable = mix.solar + mix.wind;
  const fossil = mix.thermal;
  const cleanRatio = renewable / SDG07_TOTAL_SHARE;
  const solarRatio = mix.solar / SDG07_TOTAL_SHARE;
  const windRatio = mix.wind / SDG07_TOTAL_SHARE;
  const thermalRatio = fossil / SDG07_TOTAL_SHARE;

  const airQualityScore = Math.round(
    clampSdg07Value((renewable * 0.78) + (mix.wind * 0.22), 0, SDG07_TOTAL_SHARE)
  );
  const carbonSavings = Math.round(clampSdg07Value(renewable, 0, SDG07_TOTAL_SHARE));
  const airQuality = getAirQualityView(airQualityScore);
  const dominantSource = getDominantSourceView(mix);
  const visualCaption = createVisualCaption(mix, airQuality, dominantSource);

  return {
    mix,
    renewable,
    fossil,
    total: sumShares(mix),
    renewableLabel: formatSdg07Percent(renewable),
    thermalLabel: formatSdg07Percent(fossil),
    dominantSource,
    airQuality: {
      ...airQuality,
      score: airQualityScore,
      meterLabel: `${airQualityScore} / 100`
    },
    carbon: {
      score: carbonSavings,
      label: formatSdg07Percent(carbonSavings),
      description:
        carbonSavings >= 70
          ? "화력 100% 도시 대비 탄소 부담이 크게 낮아진 상태입니다."
          : carbonSavings >= 45
            ? "전환 효과가 보이기 시작하지만 추가 재생에너지 확대 여지가 남아 있습니다."
            : "화력 비중이 높아 탄소 절감 효과가 아직 제한적입니다."
    },
    visualCaption,
    visual: {
      skyTop: interpolateHexColor("#8d9198", "#61c8ff", cleanRatio * 0.82 + solarRatio * 0.18),
      skyBottom: interpolateHexColor("#e2cfb5", "#dff6ff", cleanRatio * 0.7 + solarRatio * 0.3),
      cloudColor: interpolateHexColor("#a0a5ad", "#ffffff", cleanRatio),
      hazeOpacity: roundToFixedNumber(0.16 + (thermalRatio * 0.44), 3),
      smogOpacity: roundToFixedNumber(0.1 + (thermalRatio * 0.68), 3),
      smogShift: `${roundToFixedNumber(thermalRatio * 18, 2)}px`,
      sunOpacity: roundToFixedNumber(0.24 + (solarRatio * 0.76), 3),
      sunScale: roundToFixedNumber(0.88 + (solarRatio * 0.34), 3),
      sunGlowOpacity: roundToFixedNumber(0.18 + (solarRatio * 0.64), 3),
      skylineBrightness: roundToFixedNumber(0.66 + (cleanRatio * 0.44), 3),
      skylineSaturation: roundToFixedNumber(0.74 + (cleanRatio * 0.4), 3),
      windowOpacity: roundToFixedNumber(0.16 + (cleanRatio * 0.64) + (solarRatio * 0.12), 3),
      windowGlow: roundToFixedNumber(0.16 + (solarRatio * 0.64), 3),
      solarOpacity: roundToFixedNumber(0.34 + (solarRatio * 0.66), 3),
      solarGlow: roundToFixedNumber(0.2 + (solarRatio * 0.56), 3),
      turbineDuration: `${roundToFixedNumber(8.4 - (windRatio * 5.8), 2)}s`,
      turbineOpacity: roundToFixedNumber(0.26 + (windRatio * 0.74), 3),
      turbineScale: roundToFixedNumber(0.9 + (windRatio * 0.2), 3),
      smokeOpacity: roundToFixedNumber(0.1 + (thermalRatio * 0.9), 3),
      smokeScale: roundToFixedNumber(0.78 + (thermalRatio * 0.52), 3),
      smokeLift: `${roundToFixedNumber(6 + (thermalRatio * 16), 2)}px`
    }
  };
}
