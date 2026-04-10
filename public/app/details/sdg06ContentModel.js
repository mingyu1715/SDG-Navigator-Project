import { escapeHtml } from "./sharedRuntime.js";

export const SDG06_DEFAULT_MINUTES = 7;
export const SDG06_MIN_MINUTES = 1;
export const SDG06_MAX_MINUTES = 20;
export const SDG06_LITERS_PER_MINUTE = 11;
export const SDG06_LITERS_PER_KM = 20;
export const SDG06_TRANSITION_DURATION_MS = 1500;
const SDG06_RESOURCE_ITEMS = Object.freeze([
  {
    type: "UN SDG",
    title: "Goal 6: Clean Water and Sanitation",
    description: "깨끗한 물과 위생 목표의 세부 타깃과 전반적인 과제를 확인할 수 있는 공식 페이지입니다.",
    url: "https://sdgs.un.org/goals/goal6"
  },
  {
    type: "WHO",
    title: "Drinking-water",
    description: "안전한 식수 접근이 건강에 미치는 영향과 핵심 지표를 정리한 자료입니다.",
    url: "https://www.who.int/news-room/fact-sheets/detail/drinking-water"
  },
  {
    type: "UNICEF",
    title: "Water, Sanitation and Hygiene",
    description: "가정과 아동의 물 접근성, 위생 문제, 현장 대응을 다루는 개요 자료입니다.",
    url: "https://www.unicef.org/wash"
  }
]);

const MIN_WEIGHT_KG = SDG06_MIN_MINUTES * SDG06_LITERS_PER_MINUTE;
const MAX_WEIGHT_KG = SDG06_MAX_MINUTES * SDG06_LITERS_PER_MINUTE;

const INTEGER_FORMATTER = new Intl.NumberFormat("ko-KR");
const DECIMAL_FORMATTER = new Intl.NumberFormat("ko-KR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

export function clampSdg06Value(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function easeOutSdg06Cubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutSdg06Quad(t) {
  return 1 - Math.pow(1 - t, 2);
}

export function normalizeSdg06Minutes(minutesInput) {
  const raw = Math.round(Number(minutesInput) || SDG06_DEFAULT_MINUTES);
  return clampSdg06Value(raw, SDG06_MIN_MINUTES, SDG06_MAX_MINUTES);
}

export function createSdg06InitialState() {
  return {
    minutes: SDG06_DEFAULT_MINUTES,
    stage: "input",
    running: false
  };
}

export function calculateSdg06Metrics(minutesInput) {
  const minutes = normalizeSdg06Minutes(minutesInput);
  const waterLiters = minutes * SDG06_LITERS_PER_MINUTE;
  const weightKg = waterLiters;
  const distanceKm = waterLiters / SDG06_LITERS_PER_KM;

  return {
    minutes,
    waterLiters,
    weightKg,
    distanceKm
  };
}

function formatSdg06Integer(value) {
  return INTEGER_FORMATTER.format(Math.round(Number(value) || 0));
}

function formatSdg06Decimal(value) {
  const rounded = Math.round((Number(value) || 0) * 10) / 10;
  return DECIMAL_FORMATTER.format(rounded);
}

export function formatSdg06Minutes(minutes) {
  return `${formatSdg06Integer(minutes)}분`;
}

export function formatSdg06Liters(liters) {
  return `${formatSdg06Integer(liters)}L`;
}

export function formatSdg06Weight(weightKg) {
  return `${formatSdg06Integer(weightKg)}kg`;
}

export function formatSdg06Distance(distanceKm) {
  return `${formatSdg06Decimal(distanceKm)}km`;
}

export function getSdg06ResultView(metricsInput) {
  const metrics = calculateSdg06Metrics(metricsInput?.minutes ?? metricsInput);

  return {
    message: `당신이 ${formatSdg06Minutes(metrics.minutes)} 동안 사용한 물은 누군가에게는 ${formatSdg06Weight(metrics.weightKg)}의 물통이며 ${formatSdg06Distance(metrics.distanceKm)}를 걸어야 얻을 수 있습니다.`,
    weightCaption: `${formatSdg06Weight(metrics.weightKg)}의 물이 아래로 내려앉습니다.`,
    distanceNote: "이동 거리는 20L 물통 1개를 1km 옮긴다고 가정한 체험용 환산 규칙입니다."
  };
}

export function getSdg06WeightMotion(metricsInput) {
  const metrics = calculateSdg06Metrics(metricsInput?.minutes ?? metricsInput);
  const ratio = clampSdg06Value(
    (metrics.weightKg - MIN_WEIGHT_KG) / (MAX_WEIGHT_KG - MIN_WEIGHT_KG),
    0,
    1
  );

  return {
    ratio,
    durationMs: Math.round(900 + ratio * 950),
    dropPx: 18 + ratio * 54,
    baseScale: 0.9 + ratio * 0.28,
    squash: 0.035 + ratio * 0.085,
    tiltDeg: 2.8 - ratio * 1.2,
    fillRatio: 0.26 + ratio * 0.58,
    shadowScaleX: 0.9 + ratio * 0.3,
    shadowScaleY: 0.68 - ratio * 0.14,
    shadowBlurPx: 20 + ratio * 16
  };
}

export function renderSdg06ResourceItems() {
  return SDG06_RESOURCE_ITEMS.map((resource) => `
      <article class="sdg06-resource-item">
        <p class="sdg06-resource-type">${escapeHtml(resource.type)}</p>
        <h4 class="sdg06-resource-title">${escapeHtml(resource.title)}</h4>
        <p class="sdg06-resource-desc">${escapeHtml(resource.description)}</p>
        <a class="sdg06-resource-open" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">열기</a>
      </article>
    `).join("");
}
