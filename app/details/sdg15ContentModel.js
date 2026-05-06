export const SDG15_STAGE_INTRO = "intro";
export const SDG15_STAGE_CHAIN = "chain";
export const SDG15_STAGE_RESULT = "result";
export const SDG15_CHAIN_DURATION_MS = 3000;

export const SDG15_SOURCES = Object.freeze({
  unGoal15: Object.freeze({
    type: "official",
    name: "UN SDG Goal 15",
    year: "2026 access",
    detail: "Life on Land targets for forests, biodiversity, ecosystems, and threatened species",
    url: "https://sdgs.un.org/goals/goal15"
  }),
  iucnRedList: Object.freeze({
    type: "official",
    name: "IUCN Red List",
    year: "2026 access",
    detail: "Threatened species categories and species-level conservation status reference",
    url: "https://www.iucnredlist.org/"
  }),
  wwfPalmOilSpecies: Object.freeze({
    type: "authority",
    name: "WWF: species threatened by unsustainable palm oil",
    year: "2026 access",
    detail: "Palm oil expansion context for orangutans, tigers, elephants, and tropical forest species",
    url: "https://www.worldwildlife.org/stories/endangered-species-threatened-by-unsustainable-palm-oil-production"
  }),
  wwfCerrado: Object.freeze({
    type: "authority",
    name: "WWF: Cerrado",
    year: "2026 access",
    detail: "Cerrado habitat conversion context linked to agriculture and wildlife pressure",
    url: "https://www.worldwildlife.org/places/cerrado"
  }),
  wwfSoy: Object.freeze({
    type: "authority",
    name: "WWF: soy production",
    year: "2026 access",
    detail: "Soy expansion and ecosystem conversion context used for cattle-feed linkage",
    url: "https://wwf.panda.org/discover/our_focus/food_practice/sustainable_production/soy/"
  }),
  wwfIllegalLogging: Object.freeze({
    type: "authority",
    name: "WWF: stopping illegal logging",
    year: "2026 access",
    detail: "Illegal logging, timber demand, and forest degradation context",
    url: "https://www.worldwildlife.org/our-work/forests/deforestation-and-forest-degradation/stopping-illegal-logging/"
  }),
  wwfAsianElephant: Object.freeze({
    type: "authority",
    name: "WWF: Asian elephant",
    year: "2026 access",
    detail: "Habitat loss and fragmentation context for Asian elephants",
    url: "https://www.worldwildlife.org/species/asian-elephant"
  }),
  wwfRedPanda: Object.freeze({
    type: "authority",
    name: "WWF: red panda",
    year: "2026 access",
    detail: "Forest habitat pressure context for red pandas",
    url: "https://www.worldwildlife.org/species/red-panda"
  }),
  sdg15DominoSimulation: Object.freeze({
    type: "simulation",
    name: "Extinction Domino scenario model",
    year: "2026",
    detail: "Domino steps and pressure scores are educational interaction values, not official biodiversity metrics",
    url: ""
  })
});

export const SDG15_MODEL_NOTE =
  "도미노 단계, 서식지 압박 점수, 연결 손실 수치는 체험용 시뮬레이션입니다. 종의 보전상태와 서식지 위협 설명은 UN SDG 15, IUCN Red List, WWF 자료를 기준으로 구성했습니다.";

export const SDG15_SCENARIOS = Object.freeze({
  palmSnack: Object.freeze({
    key: "palmSnack",
    product: "팜유가 든 과자",
    shortLabel: "Palm snack",
    title: "열대우림을 밀어낸 한 봉지",
    region: "보르네오와 수마트라 열대우림",
    habitat: "열대우림 서식지",
    habitatDetail: "팜유 플랜테이션 확장은 숲을 단절시키고 나무 위에서 살아가는 종의 이동로와 둥지를 줄입니다.",
    pressureScore: 91,
    connectionLoss: 5,
    finalMessage: "당신의 과자 한 봉지가 오랑우탄의 집을 무너뜨렸습니다.",
    accent: "#f59e0b",
    sources: Object.freeze(["unGoal15", "iucnRedList", "wwfPalmOilSpecies", "sdg15DominoSimulation"]),
    chain: Object.freeze([
      Object.freeze({ type: "tree", label: "Forest", name: "열대우림", detail: "숲이 농장으로 바뀜" }),
      Object.freeze({ type: "insect", label: "Insects", name: "곤충", detail: "꽃가루와 먹이망 약화" }),
      Object.freeze({ type: "bird", label: "Birds", name: "새", detail: "둥지와 먹이 감소" }),
      Object.freeze({ type: "mammal", label: "Primates", name: "영장류", detail: "나무 위 이동로 단절" }),
      Object.freeze({ type: "predator", label: "Predator", name: "포식자", detail: "사냥권과 은신처 축소" }),
      Object.freeze({ type: "soil", label: "Forest floor", name: "숲 바닥", detail: "비어 가는 생태계" })
    ]),
    species: Object.freeze([
      Object.freeze({
        name: "보르네오오랑우탄",
        latin: "Pongo pygmaeus",
        status: "Critically Endangered",
        statusKo: "위급",
        threat: "저지대 열대우림 전환과 서식지 단절에 크게 노출됩니다."
      }),
      Object.freeze({
        name: "수마트라오랑우탄",
        latin: "Pongo abelii",
        status: "Critically Endangered",
        statusKo: "위급",
        threat: "숲이 조각나면 개체군이 고립되고 번식 가능성이 떨어집니다."
      }),
      Object.freeze({
        name: "수마트라호랑이",
        latin: "Panthera tigris sondaica",
        status: "Critically Endangered",
        statusKo: "위급",
        threat: "숲 감소와 먹잇감 감소가 동시에 압박합니다."
      })
    ])
  }),
  beefOveruse: Object.freeze({
    key: "beefOveruse",
    product: "과도한 소고기 소비",
    shortLabel: "Beef demand",
    title: "목초지와 사료가 밀어낸 사바나",
    region: "아마존 주변부와 브라질 세라도",
    habitat: "열대 사바나와 숲 가장자리",
    habitatDetail: "목초지와 사료 작물 수요는 숲과 초지를 농업 경관으로 바꾸며 넓은 이동권을 가진 종을 압박합니다.",
    pressureScore: 86,
    connectionLoss: 4,
    finalMessage: "식탁의 과잉 수요가 재규어의 사냥길을 끊었습니다.",
    accent: "#ef4444",
    sources: Object.freeze(["unGoal15", "iucnRedList", "wwfCerrado", "wwfSoy", "sdg15DominoSimulation"]),
    chain: Object.freeze([
      Object.freeze({ type: "tree", label: "Canopy", name: "숲 가장자리", detail: "목초지로 전환" }),
      Object.freeze({ type: "grass", label: "Grassland", name: "초지", detail: "단일 경관 확대" }),
      Object.freeze({ type: "insect", label: "Pollinators", name: "수분 곤충", detail: "식물 재생 약화" }),
      Object.freeze({ type: "bird", label: "Birds", name: "초원성 조류", detail: "둥지와 은신처 감소" }),
      Object.freeze({ type: "mammal", label: "Prey", name: "먹잇감", detail: "이동 경로 단절" }),
      Object.freeze({ type: "predator", label: "Jaguar", name: "재규어", detail: "사냥권 축소" })
    ]),
    species: Object.freeze([
      Object.freeze({
        name: "재규어",
        latin: "Panthera onca",
        status: "Near Threatened",
        statusKo: "준위협",
        threat: "큰 서식권과 연결된 숲길이 필요한 포식자입니다."
      }),
      Object.freeze({
        name: "큰개미핥기",
        latin: "Myrmecophaga tridactyla",
        status: "Vulnerable",
        statusKo: "취약",
        threat: "초지와 숲 경계가 파편화되면 먹이 활동지가 줄어듭니다."
      }),
      Object.freeze({
        name: "히아신스마코앵무",
        latin: "Anodorhynchus hyacinthinus",
        status: "Vulnerable",
        statusKo: "취약",
        threat: "큰 나무와 둥지 공간이 줄어들면 번식지가 제한됩니다."
      })
    ])
  }),
  disposableWood: Object.freeze({
    key: "disposableWood",
    product: "비인증 목재 제품",
    shortLabel: "Disposable wood",
    title: "한 번 쓰고 버린 숲",
    region: "동남아와 히말라야 주변 산림",
    habitat: "연속된 산림과 대나무 숲",
    habitatDetail: "비인증 목재와 불법 벌목은 숲을 조각내고 나무, 동굴, 대나무층을 이용하는 종의 생활권을 줄입니다.",
    pressureScore: 82,
    connectionLoss: 4,
    finalMessage: "일회용 목재가 숲의 연결고리를 잘라냈습니다.",
    accent: "#22c55e",
    sources: Object.freeze(["unGoal15", "iucnRedList", "wwfIllegalLogging", "wwfAsianElephant", "wwfRedPanda", "sdg15DominoSimulation"]),
    chain: Object.freeze([
      Object.freeze({ type: "tree", label: "Timber", name: "큰 나무", detail: "벌목으로 사라짐" }),
      Object.freeze({ type: "soil", label: "Soil", name: "토양", detail: "그늘과 수분 감소" }),
      Object.freeze({ type: "insect", label: "Insects", name: "곤충", detail: "분해자와 먹이 감소" }),
      Object.freeze({ type: "bird", label: "Hornbill", name: "큰새", detail: "둥지 나무 부족" }),
      Object.freeze({ type: "mammal", label: "Mammals", name: "포유류", detail: "숲길 단절" }),
      Object.freeze({ type: "predator", label: "Forest chain", name: "상위 먹이망", detail: "회복력 약화" })
    ]),
    species: Object.freeze([
      Object.freeze({
        name: "아시아코끼리",
        latin: "Elephas maximus",
        status: "Endangered",
        statusKo: "위기",
        threat: "넓은 숲길이 끊기면 이동과 먹이 활동이 제한됩니다."
      }),
      Object.freeze({
        name: "레서판다",
        latin: "Ailurus fulgens",
        status: "Endangered",
        statusKo: "위기",
        threat: "산림과 대나무층이 줄면 먹이와 은신처가 함께 줄어듭니다."
      }),
      Object.freeze({
        name: "큰코뿔새",
        latin: "Buceros bicornis",
        status: "Vulnerable",
        statusKo: "취약",
        threat: "큰 고목의 구멍을 둥지로 쓰기 때문에 벌목에 민감합니다."
      })
    ])
  })
});

export const SDG15_DEFAULT_SCENARIO_KEY = "palmSnack";

function escapeSdg15Text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

export function createSdg15InitialState() {
  return {
    stage: SDG15_STAGE_INTRO,
    scenarioKey: SDG15_DEFAULT_SCENARIO_KEY
  };
}

export function getSdg15Scenario(scenarioKey) {
  return SDG15_SCENARIOS[scenarioKey] || SDG15_SCENARIOS[SDG15_DEFAULT_SCENARIO_KEY];
}

export function selectSdg15Scenario(stateInput, scenarioKey) {
  const scenario = getSdg15Scenario(scenarioKey);
  return {
    ...(stateInput || createSdg15InitialState()),
    stage: SDG15_STAGE_CHAIN,
    scenarioKey: scenario.key
  };
}

export function revealSdg15Result(stateInput) {
  const state = stateInput || createSdg15InitialState();
  return {
    ...state,
    stage: SDG15_STAGE_RESULT
  };
}

export function resetSdg15Experience() {
  return createSdg15InitialState();
}

export function calculateSdg15ViewModel(stateInput) {
  const state = stateInput || createSdg15InitialState();
  const scenario = getSdg15Scenario(state.scenarioKey);
  const stage = state.stage || SDG15_STAGE_INTRO;
  const fallenCount = stage === SDG15_STAGE_INTRO
    ? 0
    : stage === SDG15_STAGE_CHAIN
      ? scenario.chain.length - 1
      : scenario.chain.length;

  return {
    stage,
    scenario,
    chain: scenario.chain,
    species: scenario.species,
    fallenCount,
    progressLabel: stage === SDG15_STAGE_INTRO
      ? "도미노 대기 중"
      : `${fallenCount}/${scenario.chain.length} 연결 붕괴`,
    sourceItems: scenario.sources.map((sourceKey) => SDG15_SOURCES[sourceKey]).filter(Boolean)
  };
}

export function renderSdg15ScenarioButtons(selectedKey) {
  return Object.values(SDG15_SCENARIOS).map((scenario) => `
    <button
      type="button"
      class="sdg15-choice-btn"
      data-action="selectScenario"
      data-scenario="${escapeSdg15Text(scenario.key)}"
      aria-pressed="${scenario.key === selectedKey ? "true" : "false"}"
      style="--scenario-accent: ${escapeSdg15Text(scenario.accent)};"
    >
      <span>${escapeSdg15Text(scenario.shortLabel)}</span>
      <strong>${escapeSdg15Text(scenario.product)}</strong>
    </button>
  `).join("");
}

export function renderSdg15DominoChain(chain) {
  return chain.map((step, index) => `
    <article
      class="sdg15-domino-card is-${escapeSdg15Text(step.type)}"
      data-step-index="${index}"
      style="--step-index: ${index};"
    >
      <span class="sdg15-domino-symbol" aria-hidden="true"></span>
      <span class="sdg15-domino-label">${escapeSdg15Text(step.label)}</span>
      <strong>${escapeSdg15Text(step.name)}</strong>
      <small>${escapeSdg15Text(step.detail)}</small>
      <i class="sdg15-domino-shadow" aria-hidden="true"></i>
    </article>
  `).join("");
}

export function renderSdg15SpeciesItems(species) {
  return species.map((item) => `
    <article class="sdg15-species-item">
      <div>
        <strong>${escapeSdg15Text(item.name)}</strong>
        <span>${escapeSdg15Text(item.latin)}</span>
      </div>
      <p>${escapeSdg15Text(item.threat)}</p>
      <em>${escapeSdg15Text(item.statusKo)} · ${escapeSdg15Text(item.status)}</em>
    </article>
  `).join("");
}

export function renderSdg15SourceItems(sourceItems) {
  return sourceItems.map((item) => {
    const content = `
      <span class="sdg15-source-type">${escapeSdg15Text(item.type)}</span>
      <span class="sdg15-source-name">${escapeSdg15Text(item.name)}</span>
    `;

    if (!item.url) {
      return `<span class="sdg15-source-link is-static">${content}</span>`;
    }

    return `
      <a class="sdg15-source-link" href="${escapeSdg15Text(item.url)}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
