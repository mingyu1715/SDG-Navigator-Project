import { escapeHtml, loadJsonData } from "./sharedRuntime.js";

const DEFAULT_INGREDIENTS = [
  {
    id: "spoiled-apple",
    key: "apple",
    name: "사과",
    count: 2,
    emoji: "🍎"
  },
  {
    id: "opened-milk",
    key: "milk",
    name: "우유",
    count: 1,
    emoji: "🥛"
  },
  {
    id: "stale-bread",
    key: "bread",
    name: "빵",
    count: 1,
    emoji: "🍞"
  },
  {
    id: "leftover-meat",
    key: "meat",
    name: "고기",
    count: 1,
    emoji: "🥩"
  }
];

const DEFAULT_IMPACT_RULES = {
  waterPerUnitL: {
    apple: 70,
    milk: 255,
    bread: 40,
    meat: 1540
  },
  priceKrw: {
    apple: 1500,
    milk: 2800,
    bread: 3200,
    meat: 4800
  },
  avgUnitWeightKg: {
    apple: 0.18,
    milk: 1.0,
    bread: 0.45,
    meat: 0.28
  },
  mealCostKrw: 600,
  co2eKgPerKgWaste: 2.5,
  methaneMultiplier: 25,
  drinkPerPersonLPerDay: 2
};

const DEFAULT_COPY = {
  headline: "잊혀진 냉장고의 복수",
  introLead: "당신이 버리는 음식, 지구는 기억합니다",
  introCue: "냉장고를 클릭하세요",
  openButton: "냉장고 열기",
  selectTitle: "오늘 버릴 음식을 선택하세요",
  selectLead: "냉장고 속 유통기한이 지난 음식들",
  selectCtaReady: "버리기",
  selectCtaIdle: "음식을 선택하세요",
  selectedCountTemplate: "{count}개 선택됨",
  reportTitle: "당신이 버린 것들",
  reportMessage: "전 세계에서 생산되는 음식의 1/3이 버려집니다. 작은 변화가 지구를 지킵니다.",
  retryButton: "다시 해보기",
  resourcesTitle: "관련 자료",
  resourcesLead: "체험 수치를 실제 데이터와 연결해 보세요.",
  resources: [
    {
      type: "DATA",
      title: "Water Footprint Network",
      description: "식재료별 물 사용량을 확인할 수 있는 데이터베이스",
      url: "https://www.waterfootprint.org/"
    },
    {
      type: "REPORT",
      title: "UNEP Food Waste Index",
      description: "전 세계 음식물 폐기량과 환경 영향 보고서",
      url: "https://www.unep.org/resources/report/unep-food-waste-index-report-2024"
    },
    {
      type: "ARTICLE",
      title: "WFP Hunger Explained",
      description: "기아 문제와 식량 접근성의 구조적 원인",
      url: "https://www.wfp.org/hunger"
    }
  ]
};

const [ingredientsData, impactRulesData, copyData] = await Promise.all([
  loadJsonData("/app/data/sdg02/ingredients.json", DEFAULT_INGREDIENTS),
  loadJsonData("/app/data/sdg02/impactRules.json", DEFAULT_IMPACT_RULES),
  loadJsonData("/app/data/sdg02/copy.json", DEFAULT_COPY)
]);

export const SDG02_INGREDIENTS = Array.isArray(ingredientsData) && ingredientsData.length
  ? ingredientsData
  : DEFAULT_INGREDIENTS;

export const SDG02_IMPACT_RULES = {
  ...DEFAULT_IMPACT_RULES,
  ...(impactRulesData || {})
};

export const SDG02_COPY = {
  ...DEFAULT_COPY,
  ...(copyData || {})
};

export function formatSdg02Number(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

export function formatSdg02Decimal(value, digits = 1) {
  const fixed = Number(value || 0).toFixed(digits);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

export function toSdg02Count(item) {
  const count = Number(item?.count);
  return Number.isFinite(count) && count > 0 ? count : 1;
}

export function createSdg02InitialState() {
  return {
    stage: "intro",
    selectedIds: new Set(),
    transitionLock: false,
    impact: null,
    draggingId: null,
    dropCommitted: false
  };
}

export function getSdg02IngredientById(id) {
  return SDG02_INGREDIENTS.find((item) => item.id === id) || null;
}

export function calculateSdg02ItemImpact(item) {
  if (!item) return null;
  const count = toSdg02Count(item);
  const water = (Number(SDG02_IMPACT_RULES.waterPerUnitL?.[item.key]) || 0) * count;
  const price = (Number(SDG02_IMPACT_RULES.priceKrw?.[item.key]) || 0) * count;
  const weight = (Number(SDG02_IMPACT_RULES.avgUnitWeightKg?.[item.key]) || 0) * count;
  const carbon = weight * (Number(SDG02_IMPACT_RULES.co2eKgPerKgWaste) || 0);
  return { water, price, carbon };
}

export function getSdg02ActionFeedback(item, impact) {
  const name = item?.name || item?.key || "식재료";
  return `${name} 버림 · 물 +${formatSdg02Number(Math.round(impact.water))}L · 탄소 +${formatSdg02Decimal(impact.carbon, 1)}kgCO2 · 비용 +${formatSdg02Number(Math.round(impact.price))}원`;
}

export function getSdg02SelectedCountLabel(count) {
  return count > 0
    ? `버린 음식 ${formatSdg02Number(count)}개`
    : "버린 음식 없음";
}

export function getSdg02ConfirmButtonLabel(count) {
  return count > 0
    ? `버린 결과 확인하기 (${formatSdg02Number(count)}개)`
    : "먼저 음식을 버려주세요";
}

export function getSdg02SelectedItems(selectedIds) {
  return SDG02_INGREDIENTS.filter((item) => selectedIds.has(item.id));
}

export function calculateSdg02Impact(items) {
  const waterPerUnitL = SDG02_IMPACT_RULES.waterPerUnitL || {};
  const priceKrw = SDG02_IMPACT_RULES.priceKrw || {};
  const avgUnitWeightKg = SDG02_IMPACT_RULES.avgUnitWeightKg || {};
  const mealCost = Number(SDG02_IMPACT_RULES.mealCostKrw) || 600;
  const carbonPerKg = Number(SDG02_IMPACT_RULES.co2eKgPerKgWaste) || 0;
  const drinkPerDay = Number(SDG02_IMPACT_RULES.drinkPerPersonLPerDay) || 2;

  let totalWater = 0;
  let totalPrice = 0;
  let totalWeight = 0;

  items.forEach((item) => {
    const count = toSdg02Count(item);
    totalWater += (Number(waterPerUnitL[item.key]) || 0) * count;
    totalPrice += (Number(priceKrw[item.key]) || 0) * count;
    totalWeight += (Number(avgUnitWeightKg[item.key]) || 0) * count;
  });

  const totalCarbon = totalWeight * carbonPerKg;
  return {
    totalWater,
    totalPrice,
    totalCarbon,
    waterDays: Math.floor(totalWater / drinkPerDay),
    mealsLost: Math.floor(totalPrice / mealCost),
    carKm: Math.round(totalCarbon * 4)
  };
}

export function getSdg02ReportDescriptions(impact) {
  return {
    water: `${formatSdg02Number(impact.waterDays)}일치 식수`,
    carbon: `자동차 ${formatSdg02Number(impact.carKm)}km 주행`,
    price: `기아 아동 ${formatSdg02Number(impact.mealsLost)}끼 식사`
  };
}

export function renderSdg02ReportEmojis(selectedItems) {
  return selectedItems.map((item) => `<span>${escapeHtml(item.emoji || "")}</span>`).join("");
}

export function renderSdg02FoodGrid() {
  return SDG02_INGREDIENTS.map((item) => `
      <button type="button" class="sdg02-rx-food-item" data-role="foodItem" data-id="${escapeHtml(item.id)}" draggable="true">
        <span class="sdg02-rx-food-emoji">${escapeHtml(item.emoji || "")}</span>
        <span class="sdg02-rx-food-name">${escapeHtml(item.name || item.key || "식재료")}</span>
        <span class="sdg02-rx-food-status">${escapeHtml(item.status || "임박")}</span>
      </button>
    `).join("");
}

function renderSdg02ResourceItems(resources) {
  return resources.map((resource, index) => {
    const type = escapeHtml(resource.type || "자료");
    const title = escapeHtml(resource.title || "자료 제목");
    const description = escapeHtml(resource.description || "자료 설명");
    const url = escapeHtml(resource.url || "#");
    const delay = index * 90;

    return `
        <article class="sdg02-rx-resource-item" style="--rx-delay:${delay}ms">
          <p class="sdg02-rx-resource-type">${type}</p>
          <h5 class="sdg02-rx-resource-title">${title}</h5>
          <p class="sdg02-rx-resource-desc">${description}</p>
          <a class="sdg02-rx-resource-open" href="${url}" target="_blank" rel="noopener noreferrer">열기</a>
        </article>
      `;
  }).join("");
}

export function renderSdg02ResourcesSection() {
  const resources = Array.isArray(SDG02_COPY.resources)
    ? SDG02_COPY.resources.filter((item) => item && item.url)
    : [];

  if (!resources.length) return "";

  return `
      <section class="sdg02-rx-resources">
        <p class="sdg02-rx-resources-overline">현실 자료</p>
        <h4 class="sdg02-rx-resources-title">${escapeHtml(SDG02_COPY.resourcesTitle || "관련 자료")}</h4>
        <p class="sdg02-rx-resources-copy">${escapeHtml(SDG02_COPY.resourcesLead || "체험 수치를 실제 데이터와 연결해 보세요.")}</p>
        <div class="sdg02-rx-resource-list">
          ${renderSdg02ResourceItems(resources)}
        </div>
      </section>
    `;
}
