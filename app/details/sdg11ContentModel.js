export const SDG11_STAGE_INTRO = "intro";
export const SDG11_STAGE_PLANNER = "planner";

export const SDG11_SOURCES = Object.freeze({
  goal11: Object.freeze({
    type: "official",
    name: "UN SDG Goal 11",
    detail: "Sustainable cities and communities targets, including inclusive transport, resilient planning, and public space",
    url: "https://sdgs.un.org/goals/goal11"
  }),
  airQuality: Object.freeze({
    type: "official",
    name: "WHO global air quality guidelines",
    detail: "PM2.5 guideline context used to explain air-quality improvement",
    url: "https://www.who.int/publications/i/item/9789240034228"
  }),
  urbanAccess: Object.freeze({
    type: "official",
    name: "UN-Habitat World Cities Report 2024",
    detail: "Cities and Climate Action context for resilient and low-emission urban design",
    url: "https://unhabitat.org/sites/default/files/2024/11/wcr2024_-_full_report.pdf"
  }),
  scenarioModel: Object.freeze({
    type: "simulation",
    name: "City Planner simulation",
    detail: "Happiness and PM2.5 values are educational scenario outputs, not official city statistics",
    url: ""
  })
});

export const SDG11_MODEL_NOTE =
  "행복지수와 PM2.5는 공식 통계가 아니라 UN SDG 11, WHO 대기질 기준, UN-Habitat 도시 기후 행동 맥락을 참고한 체험용 시뮬레이션입니다.";

export const SDG11_CONTROLS = Object.freeze([
  Object.freeze({
    key: "parks",
    label: "공원 면적",
    shortLabel: "공원",
    unit: "%",
    min: 5,
    max: 45,
    step: 1,
    defaultValue: 12,
    copy: "회색 블록을 녹지와 산책 동선으로 바꿉니다."
  }),
  Object.freeze({
    key: "transit",
    label: "대중교통 노선",
    shortLabel: "교통",
    unit: "%",
    min: 0,
    max: 70,
    step: 1,
    defaultValue: 16,
    copy: "버스 노선과 정류장 접근성을 늘려 차량 의존을 낮춥니다."
  }),
  Object.freeze({
    key: "recycling",
    label: "재활용 센터",
    shortLabel: "순환",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    defaultValue: 10,
    copy: "생활 폐기물 회수 거점을 배치해 도시 순환성을 높입니다."
  })
]);

export const SDG11_INTENSITY = Object.freeze({
  min: 20,
  max: 100,
  step: 5,
  defaultValue: 55
});

export const SDG11_STRATEGIES = Object.freeze([
  Object.freeze({
    key: "balanced",
    label: "균형 도시",
    title: "녹지·교통·순환을 같이 올리기",
    copy: "세 요소를 고르게 보강해 안정적으로 도시 체감 지표를 끌어올립니다.",
    resultCopy: "균형 전략은 한 요소만 크게 밀지 않고 공원, 교통, 순환 거점을 함께 늘리는 방식입니다.",
    target: Object.freeze({ parks: 30, transit: 34, recycling: 28 })
  }),
  Object.freeze({
    key: "green",
    label: "녹지 우선",
    title: "회색 블록을 공원으로 전환",
    copy: "공원 면적을 크게 늘려 시민 체감 행복과 열·먼지 부담을 먼저 낮춥니다.",
    resultCopy: "녹지 우선 전략은 공원을 빠르게 늘려 도시의 회색 밀도를 낮추는 데 집중합니다.",
    target: Object.freeze({ parks: 44, transit: 24, recycling: 20 })
  }),
  Object.freeze({
    key: "mobility",
    label: "교통 우선",
    title: "대중교통 축을 먼저 연결",
    copy: "노선과 정류장 접근성을 높여 이동 선택지를 늘리고 차량 의존을 낮춥니다.",
    resultCopy: "교통 우선 전략은 대중교통 축을 촘촘하게 만들어 이동성과 대기질을 동시에 개선합니다.",
    target: Object.freeze({ parks: 22, transit: 64, recycling: 18 })
  }),
  Object.freeze({
    key: "circular",
    label: "순환 우선",
    title: "재활용 거점을 촘촘히 배치",
    copy: "생활 폐기물 회수 거점을 늘려 도시 운영의 순환성을 강화합니다.",
    resultCopy: "순환 우선 전략은 재활용 센터를 늘려 생활권 안에서 자원 회수가 쉽게 일어나도록 만듭니다.",
    target: Object.freeze({ parks: 22, transit: 26, recycling: 54 })
  })
]);

const CITY_CELL_COUNT = 64;
const BASELINE_VALUES = Object.freeze({
  parks: 8,
  transit: 10,
  recycling: 6
});

const PARK_SEQUENCE = Object.freeze([
  9, 10, 17, 18, 13, 14, 21, 22, 37, 38, 45, 46, 42, 43, 50, 51,
  26, 27, 28, 34, 35, 36, 53, 54, 55, 4, 5, 12, 59
]);

const RECYCLE_SEQUENCE = Object.freeze([6, 30, 47, 24, 57, 2, 40]);

const TRANSIT_LINES = Object.freeze([
  Object.freeze([48, 49, 50, 51, 52, 53, 54, 55]),
  Object.freeze([3, 11, 19, 27, 35, 43, 51, 59]),
  Object.freeze([16, 17, 18, 19, 20, 21, 22, 23]),
  Object.freeze([6, 14, 22, 30, 38, 46, 54, 62])
]);

const CIVIC_CELLS = Object.freeze([0, 7, 56, 63, 33]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getControl(key) {
  return SDG11_CONTROLS.find((control) => control.key === key) || SDG11_CONTROLS[0];
}

function getStrategy(key) {
  return SDG11_STRATEGIES.find((strategy) => strategy.key === key) || SDG11_STRATEGIES[0];
}

function normalizeValue(key, value) {
  const control = getControl(key);
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return control.defaultValue;
  return clamp(Math.round(numeric), control.min, control.max);
}

function normalizeIntensity(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return SDG11_INTENSITY.defaultValue;
  return clamp(Math.round(numeric / SDG11_INTENSITY.step) * SDG11_INTENSITY.step, SDG11_INTENSITY.min, SDG11_INTENSITY.max);
}

function normalizeSettings(values = {}) {
  return SDG11_CONTROLS.reduce((acc, control) => ({
    ...acc,
    [control.key]: normalizeValue(control.key, values[control.key] ?? control.defaultValue)
  }), {});
}

function getStrategySettings(strategy, intensity) {
  const ratio = normalizeIntensity(intensity) / 100;
  return normalizeSettings(SDG11_CONTROLS.reduce((acc, control) => ({
    ...acc,
    [control.key]: BASELINE_VALUES[control.key] + ((strategy.target[control.key] - BASELINE_VALUES[control.key]) * ratio)
  }), {}));
}

function calculateMetrics(settings) {
  const balanceBonus = settings.parks >= 24 && settings.transit >= 28 && settings.recycling >= 20 ? 6 : 0;
  const carRelief = settings.transit * 0.18 + settings.parks * 0.08;
  const wasteRelief = settings.recycling * 0.13;

  const happiness = clamp(Math.round(
    43 +
    settings.parks * 0.58 +
    settings.transit * 0.34 +
    settings.recycling * 0.24 +
    balanceBonus
  ), 0, 100);

  const pm25 = clamp(Number((
    38 -
    settings.parks * 0.34 -
    carRelief -
    wasteRelief
  ).toFixed(1)), 5, 45);

  return { happiness, pm25 };
}

function getTransitCells(transitValue) {
  const lineCount = clamp(Math.ceil(transitValue / 18), 0, TRANSIT_LINES.length);
  return new Set(TRANSIT_LINES.slice(0, lineCount).flat());
}

function createCityCells(settings, stage) {
  const activeSettings = stage === SDG11_STAGE_INTRO ? BASELINE_VALUES : settings;
  const parkCount = clamp(Math.round((activeSettings.parks / 100) * CITY_CELL_COUNT), 0, PARK_SEQUENCE.length);
  const recycleCount = clamp(Math.round(activeSettings.recycling / 9), 0, RECYCLE_SEQUENCE.length);
  const parkCells = new Set(PARK_SEQUENCE.slice(0, parkCount));
  const recycleCells = new Set(RECYCLE_SEQUENCE.slice(0, recycleCount));
  const transitCells = getTransitCells(activeSettings.transit);
  const walkerCells = new Set(PARK_SEQUENCE.slice(0, activeSettings.parks >= 18 ? 6 : activeSettings.parks >= 12 ? 3 : 0));

  return Array.from({ length: CITY_CELL_COUNT }, (_, index) => ({
    index,
    isPark: parkCells.has(index),
    isTransit: transitCells.has(index),
    isRecycle: recycleCells.has(index),
    isCivic: CIVIC_CELLS.includes(index),
    hasWalker: stage === SDG11_STAGE_PLANNER && walkerCells.has(index)
  }));
}

function getTone(metrics) {
  if (metrics.happiness >= 76 && metrics.pm25 <= 18) return "good";
  if (metrics.happiness >= 62 && metrics.pm25 <= 27) return "mid";
  return "bad";
}

function getStatusLabel(tone) {
  if (tone === "good") return "살기 좋은 도시";
  if (tone === "mid") return "개선 진행 중";
  return "회색 도시 경고";
}

function getSummary(settings, metrics, tone) {
  if (tone === "good") {
    return `녹지 ${settings.parks}%와 교통 ${settings.transit}%가 맞물리며 시민 이동과 대기질이 함께 개선되었습니다.`;
  }
  if (tone === "mid") {
    return `도시가 조금씩 살아나고 있습니다. 공원, 교통, 재활용 중 낮은 항목을 보강하면 체감 변화가 커집니다.`;
  }
  return `아직 회색 블록이 많아 행복지수는 ${metrics.happiness}에 머물고 PM2.5 부담도 높게 남아 있습니다.`;
}

function getPlannerMessage(strategy, intensity) {
  if (intensity < 45) {
    return `${strategy.label} 방향은 잡혔지만 투입 강도가 낮아 지도 변화가 아직 제한적입니다.`;
  }
  if (intensity >= 85) {
    return `${strategy.resultCopy} 현재는 강한 전환 시나리오로 계산됩니다.`;
  }
  return strategy.resultCopy;
}

export function createSdg11InitialState() {
  return {
    stage: SDG11_STAGE_INTRO,
    strategyKey: "balanced",
    intensity: SDG11_INTENSITY.defaultValue
  };
}

export function startSdg11Experience(state) {
  return {
    ...state,
    stage: SDG11_STAGE_PLANNER
  };
}

export function selectSdg11Strategy(state, strategyKey) {
  const strategy = getStrategy(strategyKey);
  return {
    ...state,
    stage: SDG11_STAGE_PLANNER,
    strategyKey: strategy.key
  };
}

export function updateSdg11Intensity(state, value) {
  return {
    ...state,
    stage: SDG11_STAGE_PLANNER,
    intensity: normalizeIntensity(value)
  };
}

export function resetSdg11Planner(state) {
  return {
    ...state,
    stage: SDG11_STAGE_PLANNER,
    strategyKey: "balanced",
    intensity: SDG11_INTENSITY.defaultValue
  };
}

export function calculateSdg11Scenario(stateInput) {
  const state = stateInput || createSdg11InitialState();
  const strategy = getStrategy(state.strategyKey);
  const intensity = normalizeIntensity(state.intensity);
  const settings = getStrategySettings(strategy, intensity);
  const metrics = calculateMetrics(settings);
  const baselineMetrics = calculateMetrics(BASELINE_VALUES);
  const tone = getTone(metrics);
  const smogLevel = clamp((metrics.pm25 - 5) / 40, 0.08, 0.72);

  return {
    stage: state.stage,
    strategy,
    intensity,
    settings,
    metrics,
    baselineMetrics,
    deltas: {
      happiness: metrics.happiness - baselineMetrics.happiness,
      pm25: Number((metrics.pm25 - baselineMetrics.pm25).toFixed(1))
    },
    tone,
    statusLabel: getStatusLabel(tone),
    summary: getSummary(settings, metrics, tone),
    plannerMessage: getPlannerMessage(strategy, intensity),
    smogLevel,
    cells: createCityCells(settings, state.stage)
  };
}

export function formatSdg11Delta(value, unit = "") {
  const numeric = Number(value) || 0;
  if (numeric === 0) return `0${unit}`;
  return `${numeric > 0 ? "+" : ""}${numeric}${unit}`;
}

export function formatSdg11AirDelta(value) {
  const numeric = Number(value) || 0;
  if (numeric === 0) return "초기와 동일";
  return `초기 대비 ${Math.abs(numeric)} ug/m3 ${numeric < 0 ? "감소" : "증가"}`;
}

export function renderSdg11ResourceItems() {
  return Object.values(SDG11_SOURCES).map((item) => {
    const content = `
      <span class="sdg11-resource-source">${item.type}</span>
      <span class="sdg11-resource-title">${item.name}</span>
    `;

    if (!item.url) {
      return `<span class="sdg11-resource-link is-static">${content}</span>`;
    }

    return `
      <a class="sdg11-resource-link" href="${item.url}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
