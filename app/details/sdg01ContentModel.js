import { escapeHtml } from "./sharedRuntime.js";

export const SDG01_LIFE_SCENARIOS = [
  {
    country: "에티오피아",
    region: "아디스아바바 외곽",
    flag: "ET",
    lat: 8.9806,
    lon: 38.7578,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 15,
    waterDistanceKm: 4,
    lifeExpectancy: 65,
    summary: "불안정한 비공식 노동 수입에 의존하는 가정에서 삶이 시작됩니다.",
    narrative: "물과 생계를 먼저 해결해야 해서 학업과 건강 관리가 뒤로 밀리는 날이 많습니다."
  },
  {
    country: "마다가스카르",
    region: "안드로이 남부 농촌",
    flag: "MG",
    lat: -24.6943,
    lon: 45.945,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 12,
    waterDistanceKm: 6,
    lifeExpectancy: 64,
    summary: "가뭄과 식량 불안이 반복되는 농촌 환경에서 태어납니다.",
    narrative: "작황이 나쁘면 교육과 의료는 가장 먼저 포기해야 하는 선택지가 됩니다."
  },
  {
    country: "시에라리온",
    region: "프리타운 외곽 정착촌",
    flag: "SL",
    lat: 8.4657,
    lon: -13.2317,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 19,
    waterDistanceKm: 3.5,
    lifeExpectancy: 61,
    summary: "도시 외곽 저소득 정착촌에서 출발선을 갖게 됩니다.",
    narrative: "폭우와 질병 위험이 반복되고, 안전한 인프라 접근은 늘 제한적입니다."
  },
  {
    country: "네팔",
    region: "카르날리 산악지대",
    flag: "NP",
    lat: 29.3863,
    lon: 81.3887,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 28,
    waterDistanceKm: 2.8,
    lifeExpectancy: 69,
    summary: "교통 인프라가 약한 산악 지역에서 삶이 시작됩니다.",
    narrative: "학교와 병원이 있어도 날씨와 길 상태가 접근성을 크게 좌우합니다."
  },
  {
    country: "니제르",
    region: "마라디 농촌 권역",
    flag: "NE",
    lat: 13.5,
    lon: 7.1017,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 11,
    waterDistanceKm: 5.2,
    lifeExpectancy: 62,
    summary: "깨끗한 물과 영양, 의료 접근이 모두 제한적인 환경입니다.",
    narrative: "재능보다 환경의 제약이 먼저 작동해 어린 시절의 선택지가 좁아집니다."
  },
  {
    country: "차드",
    region: "라크주 농촌 지역",
    flag: "TD",
    lat: 13.1482,
    lon: 14.7147,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 13,
    waterDistanceKm: 5.6,
    lifeExpectancy: 61,
    summary: "기후 충격과 불안정한 생계가 겹친 지역에서 태어납니다.",
    narrative: "식수와 의료가 동시에 부족한 날에는 하루의 우선순위가 생존에만 집중됩니다."
  },
  {
    country: "모잠비크",
    region: "잠베지아 북부",
    flag: "MZ",
    lat: -16.5639,
    lon: 36.6094,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 22,
    waterDistanceKm: 3.9,
    lifeExpectancy: 62,
    summary: "농촌 기반의 저소득 가구에서 삶이 시작됩니다.",
    narrative: "기초 보건과 교육 서비스가 멀리 떨어져 있어 이동 자체가 큰 비용이 됩니다."
  },
  {
    country: "예멘",
    region: "타이즈 외곽",
    flag: "YE",
    lat: 13.5795,
    lon: 44.0209,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 18,
    waterDistanceKm: 4.8,
    lifeExpectancy: 64,
    summary: "불안정한 기반시설 속에서 생계가 우선인 삶을 시작합니다.",
    narrative: "학교와 병원 접근이 흔들리면 가정의 선택지는 빠르게 줄어듭니다."
  },
  {
    country: "아이티",
    region: "포르토프랭스 외곽",
    flag: "HT",
    lat: 18.5944,
    lon: -72.3074,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 24,
    waterDistanceKm: 3.2,
    lifeExpectancy: 64,
    summary: "도시 외곽의 취약한 생활 인프라 안에서 출발합니다.",
    narrative: "재난과 경제 불안정이 반복되면 기본적인 생활비조차 예측하기 어려워집니다."
  },
  {
    country: "말라위",
    region: "은치시 농촌",
    flag: "MW",
    lat: -13.9506,
    lon: 33.7741,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 26,
    waterDistanceKm: 3.7,
    lifeExpectancy: 66,
    summary: "농업 의존도가 높은 저소득 지역에서 태어납니다.",
    narrative: "수확 시기와 물 접근성이 가계 소득과 학업 지속 여부를 크게 좌우합니다."
  },
  {
    country: "콩고민주공화국",
    region: "카사이 내륙",
    flag: "CD",
    lat: -6.1253,
    lon: 22.4826,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 17,
    waterDistanceKm: 4.6,
    lifeExpectancy: 60,
    summary: "기초 인프라가 취약한 내륙 지역에서 삶이 시작됩니다.",
    narrative: "안전한 식수와 의료 접근이 불안정하면 작은 질병도 큰 위기로 이어질 수 있습니다."
  },
  {
    country: "아프가니스탄",
    region: "바다흐샨 산악 지역",
    flag: "AF",
    lat: 36.7348,
    lon: 70.8119,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 16,
    waterDistanceKm: 4.1,
    lifeExpectancy: 63,
    summary: "원거리 이동이 일상인 산악 환경에서 태어납니다.",
    narrative: "안정적인 교육과 보건 서비스에 접근하려면 긴 이동과 높은 기회비용을 감수해야 합니다."
  },
  {
    country: "수단",
    region: "다르푸르 서부",
    flag: "SD",
    lat: 13.4885,
    lon: 24.8444,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 14,
    waterDistanceKm: 5.1,
    lifeExpectancy: 62,
    summary: "자원 접근이 불안정한 지역에서 생존 중심의 하루를 시작합니다.",
    narrative: "식량과 물, 의료의 불확실성이 겹치면 미래 계획보다 당장의 안전이 우선됩니다."
  },
  {
    country: "파푸아뉴기니",
    region: "하일랜즈 내륙",
    flag: "PG",
    lat: -6.3149,
    lon: 143.9555,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 23,
    waterDistanceKm: 3.4,
    lifeExpectancy: 65,
    summary: "지리적 고립이 큰 내륙 지역에서 삶이 시작됩니다.",
    narrative: "도로와 공공서비스의 부족은 교육과 의료 접근 비용을 크게 높입니다."
  },
  {
    country: "라이베리아",
    region: "몽로비아 외곽",
    flag: "LR",
    lat: 6.2907,
    lon: -10.7605,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 21,
    waterDistanceKm: 3.8,
    lifeExpectancy: 64,
    summary: "기초 생활 인프라가 부족한 도시 외곽에서 태어납니다.",
    narrative: "작은 경제 충격에도 가계가 흔들리기 쉬워 장기 계획이 어려워집니다."
  }
];

const RELATED_RESOURCES = [
  {
    type: "VIDEO",
    title: "UNDP Channel: Poverty Stories",
    description: "빈곤이 일상에 미치는 영향을 다룬 현장 영상 모음",
    url: "https://www.youtube.com/@UNDP/videos"
  },
  {
    type: "ARTICLE",
    title: "UN SDG 1: No Poverty",
    description: "전 세계 빈곤 현황과 핵심 과제를 정리한 아티클",
    url: "https://www.un.org/sustainabledevelopment/poverty/"
  },
  {
    type: "REPORT",
    title: "World Bank: Poverty and Shared Prosperity",
    description: "최신 빈곤 지표와 국가별 추세를 다루는 보고서",
    url: "https://www.worldbank.org/en/publication/poverty-and-shared-prosperity"
  }
];

function clampSdg01Value(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatWaterAccess(distanceKm) {
  const oneWayMin = Math.round(distanceKm * 12);
  const roundTripMin = oneWayMin * 2;
  const hour = Math.floor(roundTripMin / 60);
  const minute = roundTripMin % 60;
  const timeText = hour > 0 ? `${hour}시간 ${minute}분` : `${minute}분`;
  return `하루 ${distanceKm}km (도보 왕복 약 ${timeText})`;
}

function estimateDailyBudgetKrw(scenario) {
  const tierMatch = scenario.incomeTier.match(/(\d+)%/);
  const tierPercent = tierMatch ? Number(tierMatch[1]) : 20;
  const tierBase = tierPercent <= 10 ? 3700 : 4900;
  const waterPenalty = Math.round(scenario.waterDistanceKm * 180);
  const educationPenalty = Math.max(0, Math.round((30 - scenario.educationChance) * 35));
  const lifePenalty = Math.max(0, Math.round((68 - scenario.lifeExpectancy) * 70));
  const roughBudget = tierBase - waterPenalty - educationPenalty - lifePenalty;
  const boundedBudget = clampSdg01Value(roughBudget, 1800, 6200);
  return Math.round(boundedBudget / 100) * 100;
}

function estimateMealCoverage(dailyBudgetKrw) {
  if (dailyBudgetKrw < 2600) return 1;
  if (dailyBudgetKrw < 4200) return 2;
  return 3;
}

export function pickSdg01Scenario(previousScenario) {
  if (SDG01_LIFE_SCENARIOS.length <= 1) return SDG01_LIFE_SCENARIOS[0];
  let next = SDG01_LIFE_SCENARIOS[Math.floor(Math.random() * SDG01_LIFE_SCENARIOS.length)];
  while (previousScenario && next.country === previousScenario.country && next.region === previousScenario.region) {
    next = SDG01_LIFE_SCENARIOS[Math.floor(Math.random() * SDG01_LIFE_SCENARIOS.length)];
  }
  return next;
}

export function getSdg01ScenarioView(scenario) {
  const dailyBudgetKrw = estimateDailyBudgetKrw(scenario);
  const mealCoverage = estimateMealCoverage(dailyBudgetKrw);

  return {
    targetReadout: `${scenario.country} ${scenario.region}에서 삶이 시작됩니다.`,
    resultTitle: `${scenario.country}에서 삶이 시작됩니다`,
    resultSummary: scenario.summary,
    birthPlace: `${scenario.flag} ${scenario.country}, ${scenario.region}`,
    regionNote: "무작위로 선택된 출생 지역",
    incomeTier: `약 ${dailyBudgetKrw.toLocaleString("ko-KR")}원/일`,
    incomeNote: `하루 세 끼 중 약 ${mealCoverage}끼 정도만 안정적으로 가능`,
    waterAccess: formatWaterAccess(scenario.waterDistanceKm),
    waterNote: "식수를 위해 이동에 쓰는 하루 시간",
    narrative: scenario.narrative
  };
}

export function renderSdg01ResourceItems() {
  return RELATED_RESOURCES.map((resource) => `
      <article class="sdg01-resource-item">
        <p class="sdg01-resource-type">${escapeHtml(resource.type)}</p>
        <h4 class="sdg01-resource-title">${escapeHtml(resource.title)}</h4>
        <p class="sdg01-resource-desc">${escapeHtml(resource.description)}</p>
        <a class="sdg01-resource-link" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">열기</a>
      </article>
    `).join("");
}
