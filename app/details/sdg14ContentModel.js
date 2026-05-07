export const SDG14_STAGE_INTRO = "intro";
export const SDG14_STAGE_ACTIVE = "active";
export const SDG14_STAGE_CRITICAL = "critical";
export const SDG14_MAX_PLASTIC = 12;

export const SDG14_SOURCES = Object.freeze({
  goal14: Object.freeze({
    type: "official",
    name: "UN SDG Goal 14",
    detail: "Life below water targets and marine pollution indicator context",
    url: "https://sdgs.un.org/goals/goal14"
  }),
  noaaIngestion: Object.freeze({
    type: "official",
    name: "NOAA Marine Debris Program: Ingestion",
    detail: "Marine species can mistake debris for food and suffer blocked or damaged digestive systems",
    url: "https://marinedebris.noaa.gov/why-marine-debris-problem/ingestion"
  }),
  iucnPlastic: Object.freeze({
    type: "official",
    name: "IUCN Marine Plastic Pollution",
    detail: "Marine plastic pollution causes ingestion, entanglement, and ecosystem impacts",
    url: "https://www.iucn.org/resources/issues-brief/marine-plastic-pollution"
  }),
  unepAssessment: Object.freeze({
    type: "official",
    name: "UNEP marine litter and plastic pollution assessment",
    detail: "Global assessment of marine litter and plastic pollution impacts",
    url: "https://www.unep.org/resources/pollution-solution-global-assessment-marine-litter-and-plastic-pollution"
  }),
  scenarioModel: Object.freeze({
    type: "simulation",
    name: "Ocean's Stomach click model",
    detail: "Health index and microplastic load are educational interaction scores, not veterinary measurements",
    url: ""
  })
});

export const SDG14_MODEL_NOTE =
  "건강 지수와 미세 플라스틱 축적량은 클릭 횟수를 기반으로 한 체험용 지표입니다. 실제 영향은 플라스틱의 크기, 형태, 독성 첨가물, 생물종, 섭취량, 배출 가능성, 먹이사슬 노출에 따라 달라집니다.";

const SDG14_VISIBLE_RESOURCE_KEYS = Object.freeze([
  "goal14",
  "noaaIngestion",
  "iucnPlastic",
  "unepAssessment"
]);

export const SDG14_SPECIES = Object.freeze([
  Object.freeze({
    key: "turtle",
    name: "바다거북",
    label: "Sea turtle",
    threshold: 1,
    risk: "비닐과 얇은 조각을 먹이로 착각해 위장에 남길 수 있습니다."
  }),
  Object.freeze({
    key: "seabird",
    name: "바닷새",
    label: "Seabird",
    threshold: 4,
    risk: "작은 파편을 반복적으로 삼키면 포만감과 영양 부족이 함께 올 수 있습니다."
  }),
  Object.freeze({
    key: "whale",
    name: "고래",
    label: "Whale",
    threshold: 7,
    risk: "먹이와 함께 미세 플라스틱과 큰 파편에 노출될 수 있습니다."
  })
]);

export const SDG14_FRAGMENT_LIBRARY = Object.freeze([
  Object.freeze({ x: 47, y: 46, size: 15, rotate: -18, tone: "pink", shape: "tri" }),
  Object.freeze({ x: 55, y: 51, size: 12, rotate: 31, tone: "cyan", shape: "chip" }),
  Object.freeze({ x: 44, y: 56, size: 10, rotate: 7, tone: "yellow", shape: "sliver" }),
  Object.freeze({ x: 60, y: 44, size: 13, rotate: 56, tone: "blue", shape: "tri" }),
  Object.freeze({ x: 51, y: 60, size: 16, rotate: -42, tone: "orange", shape: "chip" }),
  Object.freeze({ x: 39, y: 50, size: 11, rotate: 70, tone: "green", shape: "sliver" }),
  Object.freeze({ x: 58, y: 58, size: 9, rotate: -10, tone: "pink", shape: "chip" }),
  Object.freeze({ x: 48, y: 39, size: 12, rotate: 23, tone: "cyan", shape: "tri" }),
  Object.freeze({ x: 42, y: 62, size: 13, rotate: -64, tone: "yellow", shape: "chip" }),
  Object.freeze({ x: 63, y: 52, size: 11, rotate: 15, tone: "orange", shape: "sliver" }),
  Object.freeze({ x: 53, y: 43, size: 10, rotate: -77, tone: "blue", shape: "chip" }),
  Object.freeze({ x: 46, y: 65, size: 14, rotate: 42, tone: "green", shape: "tri" })
]);

function escapeSdg14Text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function clampPlasticCount(count) {
  const value = Number(count);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(SDG14_MAX_PLASTIC, Math.round(value)));
}

function getStage(count) {
  if (count >= SDG14_MAX_PLASTIC) return SDG14_STAGE_CRITICAL;
  if (count > 0) return SDG14_STAGE_ACTIVE;
  return SDG14_STAGE_INTRO;
}

function formatLoad(loadScore) {
  if (loadScore <= 0) return "0 units";
  return `${loadScore} simulated units`;
}

export function createSdg14InitialState() {
  return {
    plasticCount: 0
  };
}

export function addSdg14Plastic(stateInput) {
  const state = stateInput || createSdg14InitialState();
  return {
    ...state,
    plasticCount: clampPlasticCount(state.plasticCount + 1)
  };
}

export function resetSdg14Experience() {
  return createSdg14InitialState();
}

export function calculateSdg14Scenario(stateInput) {
  const state = stateInput || createSdg14InitialState();
  const plasticCount = clampPlasticCount(state.plasticCount);
  const loadRatio = plasticCount / SDG14_MAX_PLASTIC;
  const healthIndex = Math.max(0, Math.round(100 - loadRatio * 100));
  const microplasticLoad = plasticCount * 9;
  const activeSpecies = SDG14_SPECIES.map((species) => ({
    ...species,
    active: plasticCount >= species.threshold,
    health: Math.max(0, healthIndex - Math.max(0, species.threshold - 1) * 2)
  }));
  const visibleFragments = SDG14_FRAGMENT_LIBRARY.slice(0, plasticCount).map((fragment, index) => ({
    ...fragment,
    index,
    delay: `${Math.min(index * 0.025, 0.22).toFixed(2)}s`
  }));

  return {
    stage: getStage(plasticCount),
    plasticCount,
    healthIndex,
    healthLabel: `${healthIndex}/100`,
    microplasticLoad,
    microplasticLabel: formatLoad(microplasticLoad),
    loadRatio,
    activeSpecies,
    visibleFragments,
    swimDuration: `${(5.6 + loadRatio * 6.2).toFixed(1)}s`,
    murkLevel: (0.08 + loadRatio * 0.62).toFixed(2),
    weightLabel: plasticCount >= SDG14_MAX_PLASTIC
      ? "평생의 무게"
      : plasticCount > 0
        ? "몸 안에 남는 편리함"
        : "아직 맑은 위장"
  };
}

export function renderSdg14Fragments(fragments) {
  return fragments.map((fragment) => `
    <span
      class="sdg14-fragment is-${escapeSdg14Text(fragment.tone)} is-${escapeSdg14Text(fragment.shape)}"
      style="--x:${fragment.x}%; --y:${fragment.y}%; --size:${fragment.size}px; --rotate:${fragment.rotate}deg; --delay:${fragment.delay};"
    ></span>
  `).join("");
}

export function renderSdg14SpeciesItems(speciesList) {
  return speciesList.map((species) => `
    <article class="sdg14-species-item ${species.active ? "is-active" : ""}">
      <span>${escapeSdg14Text(species.label)}</span>
      <strong>${escapeSdg14Text(species.name)}</strong>
      <small>${escapeSdg14Text(species.risk)}</small>
    </article>
  `).join("");
}

export function renderSdg14ResourceItems() {
  return SDG14_VISIBLE_RESOURCE_KEYS.map((key) => SDG14_SOURCES[key]).filter(Boolean).map((item) => {
    const content = `
      <span class="sdg14-resource-source">${escapeSdg14Text(item.type)}</span>
      <span class="sdg14-resource-title">${escapeSdg14Text(item.name)}</span>
    `;

    if (!item.url) {
      return `<span class="sdg14-resource-link is-static">${content}</span>`;
    }

    return `
      <a class="sdg14-resource-link" href="${escapeSdg14Text(item.url)}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
