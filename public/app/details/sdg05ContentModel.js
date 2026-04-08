import { escapeHtml, loadJsonData } from "./sharedRuntime.js";

export const SDG05_WORK_START_MINUTES = 9 * 60;
export const SDG05_WORK_END_MINUTES = 18 * 60;
export const SDG05_WORK_DAY_MINUTES = SDG05_WORK_END_MINUTES - SDG05_WORK_START_MINUTES;
export const SDG05_EXTRA_REVEAL_STAGGER_MS = 90;
export const SDG05_ANIMATION_DURATION_MS = 2500;
export const SDG05_ANIMATION_LOOPS = 6;

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

export function clampSdg05Value(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function easeOutSdg05Cubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function toSdg05Percent(value) {
  return Math.round((Number(value) || 0) * 1000) / 10;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

export function normalizeSdg05DayMinutes(minutes) {
  const day = 24 * 60;
  const value = Number(minutes) || 0;
  return ((Math.round(value) % day) + day) % day;
}

export function formatSdg05ClockTime(minutes) {
  const normalized = normalizeSdg05DayMinutes(minutes);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function formatSdg05KoreanTime(minutes) {
  const normalized = normalizeSdg05DayMinutes(minutes);
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${period} ${hour12}시 ${pad2(minute)}분`;
}

export function calculateSdg05PayClock(gapRateInput) {
  const gapRate = clampSdg05Value(Number(gapRateInput) || 0, 0, 1);
  const unpaidMinutes = Math.round(SDG05_WORK_DAY_MINUTES * gapRate);
  const unpaidStartMinutes = clampSdg05Value(
    SDG05_WORK_END_MINUTES - unpaidMinutes,
    SDG05_WORK_START_MINUTES,
    SDG05_WORK_END_MINUTES
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
      const gapRate = clampSdg05Value(Number(item?.gapRate) || 0, 0, 1);

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

export function getSdg05PayGapData() {
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

export function createSdg05InitialState() {
  return {
    selectedCode: "",
    hasStarted: false,
    running: false,
    hasResult: false
  };
}

export function renderSdg05ResourceItems() {
  return RESOURCE_ITEMS.map((resource) => `
      <article class="sdg05-resource-item">
        <p class="sdg05-resource-type">${escapeHtml(resource.type)}</p>
        <h4 class="sdg05-resource-title">${escapeHtml(resource.title)}</h4>
        <p class="sdg05-resource-desc">${escapeHtml(resource.description)}</p>
        <a class="sdg05-resource-open" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">열기</a>
      </article>
    `).join("");
}

export function getSdg05CountrySelectionView(country) {
  if (!country) {
    return {
      hint: "국가 데이터를 불러오지 못했습니다.",
      mainLabel: "-"
    };
  }

  const gapPercent = toSdg05Percent(country.gapRate);
  return {
    hint: `${country.nameKo} 임금 격차 ${gapPercent}%`,
    mainLabel: `${country.nameKo} · 임금 격차 ${gapPercent}%`
  };
}

export function getSdg05ClockFaceView(minutes) {
  const normalized = normalizeSdg05DayMinutes(minutes);
  const minute = normalized % 60;
  const hoursOnDial = (normalized % 720) / 60;

  return {
    hourDeg: hoursOnDial * 30,
    minuteDeg: minute * 6,
    readout: formatSdg05ClockTime(normalized)
  };
}

export function getSdg05ResultView(country, result) {
  const gapPercent = toSdg05Percent(result.gapRate);
  const unpaidStartLabel = formatSdg05KoreanTime(result.unpaidStartMinutes);
  const unpaidStartClock = formatSdg05ClockTime(result.unpaidStartMinutes);

  return {
    resultMain: `당신은 오늘 ${unpaidStartLabel}부터 무급으로 일하고 있습니다.`,
    resultMeta: `무급 노동 시간 ${result.unpaidMinutes}분 · ${unpaidStartClock} ~ 18:00`,
    countryLine: `${country.nameKo} (${country.nameEn}) 임금 격차 ${gapPercent}%`,
    countrySource: `기준: ${country.sourceYear} · ${country.source}`
  };
}

export function getSdg05FallbackCountries() {
  return DEFAULT_PAY_GAP_DATA;
}
