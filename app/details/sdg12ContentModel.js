export const SDG12_STAGE_INTRO = "intro";
export const SDG12_STAGE_RESULT = "result";

export const SDG12_SOURCES = Object.freeze({
  goal12: Object.freeze({
    type: "official",
    name: "UN SDG Goal 12",
    detail: "Responsible consumption and production target context",
    url: "https://sdgs.un.org/goals/goal12"
  }),
  noaaPlastic: Object.freeze({
    type: "official",
    name: "NOAA Marine Debris Program: Plastic",
    detail: "Plastic fragments into microplastics and may never fully go away",
    url: "https://marinedebris.noaa.gov/what-marine-debris/plastic"
  }),
  noaaDegrade: Object.freeze({
    type: "official",
    name: "NOAA Ocean Service: marine debris degradation",
    detail: "Debris degradation depends on material, size, thickness, and environmental conditions",
    url: "https://oceanservice.noaa.gov/facts/degrade.html"
  }),
  unepSingleUse: Object.freeze({
    type: "official",
    name: "UNEP Single-use plastics roadmap",
    detail: "Single-use plastic consumption and policy context",
    url: "https://www.unep.org/resources/report/single-use-plastics-roadmap-sustainability"
  }),
  scenarioModel: Object.freeze({
    type: "simulation",
    name: "Trash Ghost persistence model",
    detail: "Persistence years are educational estimates, not exact official decomposition dates",
    url: ""
  })
});

export const SDG12_MODEL_NOTE =
  "예상 연도는 물질별 대표 잔류 기간을 현재 연도에 더한 체험용 추정값입니다. 실제 분해 속도는 크기, 두께, 햇빛, 온도, 물리적 마모, 매립/해양 환경에 따라 달라집니다.";

export const SDG12_TIMELINE_STOPS = Object.freeze([2030, 2050, 2100, 2200, 2500]);

export const SDG12_ITEMS = Object.freeze([
  Object.freeze({
    key: "plasticCup",
    label: "플라스틱 컵",
    shortLabel: "컵",
    icon: "cup",
    persistenceYears: 450,
    warning: "한 번 마신 컵은 여러 세대의 풍경에 잔상처럼 남을 수 있습니다.",
    sourceDetail: "대표 플라스틱 용기 잔류 기간을 단순화한 체험용 추정값"
  }),
  Object.freeze({
    key: "plasticBag",
    label: "비닐봉지",
    shortLabel: "봉지",
    icon: "bag",
    persistenceYears: 20,
    warning: "가벼운 봉지는 빨리 사라지는 것처럼 보여도 바람과 물길을 따라 잘게 찢어집니다.",
    sourceDetail: "얇은 필름류의 낮은 쪽 잔류 기간을 적용한 체험용 추정값"
  }),
  Object.freeze({
    key: "petBottle",
    label: "PET 병",
    shortLabel: "병",
    icon: "bottle",
    persistenceYears: 450,
    warning: "투명한 병은 형태를 잃어도 미세한 조각으로 더 오래 남을 수 있습니다.",
    sourceDetail: "대표 플라스틱 병 잔류 기간을 단순화한 체험용 추정값"
  }),
  Object.freeze({
    key: "straw",
    label: "일회용 빨대",
    shortLabel: "빨대",
    icon: "straw",
    persistenceYears: 200,
    warning: "몇 분 쓰인 빨대가 한 사람의 생애보다 긴 시간을 따라올 수 있습니다.",
    sourceDetail: "작은 플라스틱 제품의 장기 잔류성을 강조한 체험용 추정값"
  }),
  Object.freeze({
    key: "foamBox",
    label: "스티로폼 용기",
    shortLabel: "용기",
    icon: "foam",
    persistenceYears: 500,
    warning: "가벼운 발포 플라스틱은 부서져도 작은 조각으로 남아 회수가 어렵습니다.",
    sourceDetail: "발포 플라스틱류의 장기 잔류성을 강조한 체험용 추정값"
  })
]);

function getItem(key) {
  return SDG12_ITEMS.find((item) => item.key === key) || SDG12_ITEMS[0];
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function formatYears(years) {
  if (years >= 100) return `약 ${years}년`;
  return `최소 약 ${years}년`;
}

export function createSdg12InitialState() {
  return {
    stage: SDG12_STAGE_INTRO,
    itemKey: SDG12_ITEMS[0].key
  };
}

export function selectSdg12Item(state, itemKey) {
  return {
    ...state,
    stage: SDG12_STAGE_RESULT,
    itemKey: getItem(itemKey).key
  };
}

export function resetSdg12Experience() {
  return createSdg12InitialState();
}

export function calculateSdg12Scenario(stateInput) {
  const state = stateInput || createSdg12InitialState();
  const item = getItem(state.itemKey);
  const currentYear = getCurrentYear();
  const endYear = currentYear + item.persistenceYears;
  const generationCount = Math.max(1, Math.round(item.persistenceYears / 30));
  const visibleStops = SDG12_TIMELINE_STOPS.map((year) => ({
    year,
    ghostStillHere: year <= endYear
  }));

  return {
    stage: state.stage,
    item,
    currentYear,
    endYear,
    generationCount,
    visibleStops,
    persistenceLabel: formatYears(item.persistenceYears),
    endYearLabel: `${endYear}년까지 남을 수 있음`,
    generationLabel: `약 ${generationCount}세대`,
    ghostStrength: Math.min(1, Math.max(0.28, item.persistenceYears / 500))
  };
}

export function renderSdg12ResourceItems() {
  return Object.values(SDG12_SOURCES).map((item) => {
    const content = `
      <span class="sdg12-resource-source">${item.type}</span>
      <span class="sdg12-resource-title">${item.name}</span>
    `;

    if (!item.url) {
      return `<span class="sdg12-resource-link is-static">${content}</span>`;
    }

    return `
      <a class="sdg12-resource-link" href="${item.url}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
