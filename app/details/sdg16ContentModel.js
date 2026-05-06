export const SDG16_STAGE_INTRO = "intro";
export const SDG16_STAGE_RESULT = "result";

const MINUTES_PER_DAY = 1440;
const DAYS_PER_YEAR = 365;

export const SDG16_SOURCES = Object.freeze({
  unGoal16: Object.freeze({
    type: "official",
    name: "UN SDG Goal 16",
    year: "2026 access",
    detail: "Peace, justice and strong institutions targets and indicator context",
    url: "https://sdgs.un.org/goals/goal16"
  }),
  unStatsGoal16Report2025: Object.freeze({
    type: "official",
    name: "UN SDG Report 2025: Goal 16",
    year: "2025",
    detail: "Conflict-related deaths, homicide rate, forced displacement, and killings of protected groups",
    url: "https://unstats.un.org/sdgs/report/2025/Goal-16/"
  }),
  unodcHomicide2023: Object.freeze({
    type: "official",
    name: "UNODC Global Study on Homicide 2023",
    year: "2023",
    detail: "Intentional homicide definition and global violence measurement context",
    url: "https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html"
  }),
  sdg16SilenceSimulation: Object.freeze({
    type: "simulation",
    name: "Silence of Conflict time conversion model",
    year: "2026",
    detail: "Moment counts and red points are annual SDG statistics converted into an educational time-based visualization",
    url: ""
  })
});

export const SDG16_MODEL_NOTE =
  "붉은 점은 실제 사건 위치가 아니며, 결과 수치는 실시간 집계가 아닙니다. 2024년 또는 2023년 공식 연간 지표를 사용자가 입력한 하루 시각까지 비례 환산한 체험용 추정입니다.";

export const SDG16_METRICS = Object.freeze({
  conflictDeaths2024: Object.freeze({
    value: 48384,
    label: "48,384명",
    definition: "2024년 conflict-related deaths",
    sourceKey: "unStatsGoal16Report2025"
  }),
  forciblyDisplaced2024: Object.freeze({
    value: 123200000,
    label: "1억 2,320만명",
    definition: "2024년 말 forcibly displaced people",
    sourceKey: "unStatsGoal16Report2025"
  }),
  protectedKillings2024: Object.freeze({
    value: 502,
    label: "502건",
    definition: "2024년 인권옹호자, 언론인, 노동조합원 사망 사례",
    sourceKey: "unStatsGoal16Report2025"
  }),
  journalistKillings2024: Object.freeze({
    value: 82,
    label: "82명",
    definition: "2024년 전 세계 언론인 사망",
    sourceKey: "unStatsGoal16Report2025"
  }),
  homicideRate2023: Object.freeze({
    value: 5.2,
    label: "5.2 / 100,000명",
    definition: "2023년 전 세계 intentional homicide rate",
    sourceKey: "unStatsGoal16Report2025"
  })
});

const SDG16_VISIBLE_SOURCE_KEYS = Object.freeze([
  "unGoal16",
  "unStatsGoal16Report2025",
  "unodcHomicide2023",
  "sdg16SilenceSimulation"
]);

export const SDG16_HOTSPOTS = Object.freeze([
  Object.freeze({ x: 18, y: 38, size: 11 }),
  Object.freeze({ x: 29, y: 45, size: 8 }),
  Object.freeze({ x: 41, y: 34, size: 10 }),
  Object.freeze({ x: 54, y: 42, size: 13 }),
  Object.freeze({ x: 67, y: 31, size: 9 }),
  Object.freeze({ x: 77, y: 49, size: 12 }),
  Object.freeze({ x: 36, y: 60, size: 9 }),
  Object.freeze({ x: 61, y: 61, size: 8 }),
  Object.freeze({ x: 22, y: 56, size: 7 }),
  Object.freeze({ x: 49, y: 52, size: 10 }),
  Object.freeze({ x: 71, y: 66, size: 9 }),
  Object.freeze({ x: 84, y: 38, size: 8 }),
  Object.freeze({ x: 15, y: 64, size: 9 }),
  Object.freeze({ x: 32, y: 30, size: 8 }),
  Object.freeze({ x: 45, y: 70, size: 11 }),
  Object.freeze({ x: 58, y: 27, size: 8 }),
  Object.freeze({ x: 73, y: 57, size: 10 }),
  Object.freeze({ x: 25, y: 72, size: 7 }),
  Object.freeze({ x: 52, y: 65, size: 9 }),
  Object.freeze({ x: 82, y: 61, size: 8 }),
  Object.freeze({ x: 19, y: 47, size: 6 }),
  Object.freeze({ x: 39, y: 42, size: 7 }),
  Object.freeze({ x: 64, y: 49, size: 11 }),
  Object.freeze({ x: 88, y: 53, size: 7 }),
  Object.freeze({ x: 28, y: 63, size: 10 }),
  Object.freeze({ x: 57, y: 73, size: 8 }),
  Object.freeze({ x: 69, y: 39, size: 9 }),
  Object.freeze({ x: 11, y: 52, size: 8 }),
  Object.freeze({ x: 47, y: 24, size: 7 }),
  Object.freeze({ x: 79, y: 71, size: 9 })
]);

function escapeSdg16Text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function padTimePart(value) {
  return String(value).padStart(2, "0");
}

function normalizeHourMinute(hours, minutes) {
  const safeHours = Math.max(0, Math.min(23, Number.isFinite(hours) ? Math.trunc(hours) : 0));
  const safeMinutes = Math.max(0, Math.min(59, Number.isFinite(minutes) ? Math.trunc(minutes) : 0));
  return {
    hours: safeHours,
    minutes: safeMinutes,
    timeValue: `${padTimePart(safeHours)}:${padTimePart(safeMinutes)}`,
    minutesSinceMidnight: safeHours * 60 + safeMinutes
  };
}

export function formatSdg16CurrentTime(dateInput = new Date()) {
  const date = dateInput instanceof Date && !Number.isNaN(dateInput.getTime()) ? dateInput : new Date();
  return normalizeHourMinute(date.getHours(), date.getMinutes()).timeValue;
}

function parseSdg16Time(value, fallbackValue = formatSdg16CurrentTime()) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    const fallbackMatch = String(fallbackValue || "00:00").match(/^(\d{1,2}):(\d{2})$/);
    if (!fallbackMatch) return normalizeHourMinute(0, 0);
    return normalizeHourMinute(Number(fallbackMatch[1]), Number(fallbackMatch[2]));
  }

  return normalizeHourMinute(Number(match[1]), Number(match[2]));
}

function formatSdg16Count(value) {
  if (!Number.isFinite(value)) return "-";
  if (value < 1) return value.toFixed(2);
  if (value < 10) return value.toFixed(1);
  return Math.round(value).toLocaleString("ko-KR");
}

function formatSdg16Percent(value) {
  return `${Math.round(value * 100)}%`;
}

function annualToMoment(value, dayShare) {
  return (value / DAYS_PER_YEAR) * dayShare;
}

export function createSdg16InitialState() {
  return {
    stage: SDG16_STAGE_INTRO,
    timeValue: formatSdg16CurrentTime()
  };
}

export function setSdg16Time(stateInput, timeValue) {
  const state = stateInput || createSdg16InitialState();
  return {
    ...state,
    timeValue: parseSdg16Time(timeValue, state.timeValue).timeValue
  };
}

export function runSdg16Experience(stateInput, timeValue) {
  const state = setSdg16Time(stateInput, timeValue);
  return {
    ...state,
    stage: SDG16_STAGE_RESULT
  };
}

export function resetSdg16Experience() {
  return createSdg16InitialState();
}

export function calculateSdg16Scenario(stateInput) {
  const state = stateInput || createSdg16InitialState();
  const parsed = parseSdg16Time(state.timeValue);
  const minutesSinceMidnight = parsed.minutesSinceMidnight;
  const dayShare = minutesSinceMidnight / MINUTES_PER_DAY;
  const conflictExpected = annualToMoment(SDG16_METRICS.conflictDeaths2024.value, dayShare);
  const protectedExpected = annualToMoment(SDG16_METRICS.protectedKillings2024.value, dayShare);
  const journalistExpected = annualToMoment(SDG16_METRICS.journalistKillings2024.value, dayShare);
  const conflictPerHour = SDG16_METRICS.conflictDeaths2024.value / DAYS_PER_YEAR / 24;
  const conflictIntervalMinutes = Math.round(60 / conflictPerHour);
  const hotspotCount = state.stage === SDG16_STAGE_RESULT
    ? Math.max(8, Math.min(SDG16_HOTSPOTS.length, Math.round(8 + dayShare * 22)))
    : 0;
  const visibleHotspots = SDG16_HOTSPOTS.slice(0, hotspotCount).map((hotspot, index) => ({
    ...hotspot,
    index,
    delay: `${Math.min(index * 0.075, 1.6).toFixed(2)}s`
  }));
  const impactLevel = state.stage === SDG16_STAGE_RESULT
    ? Math.min(0.96, Math.max(0.26, 0.24 + dayShare * 0.76))
    : 0;

  return {
    stage: state.stage,
    timeValue: parsed.timeValue,
    timeLabel: `${parsed.hours}시 ${padTimePart(parsed.minutes)}분`,
    minutesSinceMidnight,
    dayShare,
    dayProgressLabel: formatSdg16Percent(dayShare),
    impactLevel,
    hotspotCount,
    visibleHotspots,
    conflictExpected,
    conflictExpectedLabel: `약 ${formatSdg16Count(conflictExpected)}명`,
    protectedExpectedLabel: `약 ${formatSdg16Count(protectedExpected)}건`,
    journalistExpectedLabel: `약 ${formatSdg16Count(journalistExpected)}명`,
    conflictIntervalLabel: `${conflictIntervalMinutes}분마다 1명꼴`,
    homicideRateLabel: SDG16_METRICS.homicideRate2023.label,
    displacedLabel: SDG16_METRICS.forciblyDisplaced2024.label,
    resultCopy: "우리가 평화롭다고 느낀 이 분에도, 누군가의 일상은 멈췄습니다.",
    sourceItems: SDG16_VISIBLE_SOURCE_KEYS.map((sourceKey) => SDG16_SOURCES[sourceKey]).filter(Boolean)
  };
}

export function renderSdg16Hotspots(hotspots) {
  return hotspots.map((hotspot) => `
    <span
      class="sdg16-hotspot"
      style="--x:${hotspot.x}%; --y:${hotspot.y}%; --size:${hotspot.size}px; --delay:${hotspot.delay};"
    ></span>
  `).join("");
}

export function renderSdg16SourceItems(sourceItems) {
  return sourceItems.map((item) => {
    const content = `
      <span class="sdg16-source-type">${escapeSdg16Text(item.type)}</span>
      <span class="sdg16-source-name">${escapeSdg16Text(item.name)}</span>
    `;

    if (!item.url) {
      return `<span class="sdg16-source-link is-static">${content}</span>`;
    }

    return `
      <a class="sdg16-source-link" href="${escapeSdg16Text(item.url)}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
