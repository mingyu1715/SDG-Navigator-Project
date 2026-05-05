export const SDG13_STAGE_INTRO = "intro";
export const SDG13_STAGE_RESULT = "result";

export const SDG13_SOURCES = Object.freeze({
  goal13: Object.freeze({
    type: "official",
    name: "UN SDG Goal 13",
    detail: "Climate action target context",
    url: "https://sdgs.un.org/goals/goal13"
  }),
  ipccAr6SeaLevel: Object.freeze({
    type: "official",
    name: "IPCC AR6 WGI Chapter 9",
    detail: "Global mean sea-level rise by warming level, Table 9.10",
    url: "https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9"
  }),
  climateCentralFuture: Object.freeze({
    type: "derived",
    name: "Climate Central: Picturing Our Future",
    detail: "Long-term coastal exposure comparison at 1.5°C and 3°C warming",
    url: "https://www.climatecentral.org/report/picturing-our-future"
  }),
  nasaProjectionTool: Object.freeze({
    type: "official",
    name: "NASA Sea Level Projection Tool",
    detail: "IPCC AR6 sea-level projection tool and local projection context",
    url: "https://sealevel.nasa.gov/ipcc-ar6-sea-level-projection-tool"
  }),
  scenarioModel: Object.freeze({
    type: "simulation",
    name: "Rising Line scenario model",
    detail: "Water height and location lists are educational visualizations, not parcel-level flood maps",
    url: ""
  })
});

export const SDG13_MODEL_NOTE =
  "수면 높이는 체험용 시각화입니다. 2100년 해수면 범위는 IPCC AR6의 온난화 수준별 전지구 평균 해수면 상승 표를 참고했고, 도시/랜드마크 목록은 Climate Central의 장기 해안 노출 비교를 교육용 예시로 재구성했습니다. 실제 침수 위험은 지역 지반침하, 방재 시설, 조위, 폭풍해일, 배수 체계에 따라 달라집니다.";

const SDG13_VISIBLE_RESOURCE_KEYS = Object.freeze([
  "goal13",
  "ipccAr6SeaLevel",
  "climateCentralFuture",
  "nasaProjectionTool"
]);

export const SDG13_SCENARIOS = Object.freeze([
  Object.freeze({
    key: "oneFive",
    label: "1.5°C",
    shortLabel: "1.5",
    tone: "warning",
    waterLevel: 34,
    riskScore: 42,
    seaLevelRange: "0.34-0.59 m",
    seaLevelBasis: "IPCC AR6 Chapter 9, 1.5°C warming level, 2100",
    headline: "낮은 한계선도 안전선은 아닙니다",
    summary: "상승폭을 1.5°C 근처로 제한해도 저지대 해안과 삼각주는 이미 반복 침수와 장기 해수면 상승 압력을 받습니다.",
    lineCopy: "경고 수위",
    resultCopy: "도시는 완전히 잠기지 않아도 항만, 해안도로, 저지대 주거지가 먼저 기능을 잃습니다.",
    locations: Object.freeze([
      Object.freeze({
        city: "Miami Beach",
        place: "저지대 해안 주거지",
        region: "United States",
        risk: "만조·폭풍해일 노출"
      }),
      Object.freeze({
        city: "Venice",
        place: "라군과 산마르코 주변",
        region: "Italy",
        risk: "반복 침수 위험"
      }),
      Object.freeze({
        city: "Dhaka Delta",
        place: "갠지스-브라마푸트라 저지대",
        region: "Bangladesh",
        risk: "삼각주 침수 압력"
      }),
      Object.freeze({
        city: "Jakarta",
        place: "북부 해안 지대",
        region: "Indonesia",
        risk: "해수면 상승·지반침하 복합 위험"
      })
    ])
  }),
  Object.freeze({
    key: "three",
    label: "3°C",
    shortLabel: "3",
    tone: "danger",
    waterLevel: 58,
    riskScore: 86,
    seaLevelRange: "0.50-0.81 m",
    seaLevelBasis: "IPCC AR6 Chapter 9, 3.0°C warming level, 2100",
    headline: "3°C의 선은 도시의 절반을 지웁니다",
    summary: "3°C 경로에서는 장기 해안 노출 규모가 크게 커지고, 주요 도시의 항만·상업지·역사 지구가 동시에 위험권에 들어갑니다.",
    lineCopy: "침수 한계선",
    resultCopy: "높아진 바다는 해안선을 조금 밀어내는 문제가 아니라 도시 기능의 위치를 다시 정하게 만드는 압력입니다.",
    locations: Object.freeze([
      Object.freeze({
        city: "Bangkok",
        place: "차오프라야강 하구와 도심 저지대",
        region: "Thailand",
        risk: "광범위한 도시 침수 위험"
      }),
      Object.freeze({
        city: "Shanghai",
        place: "황푸강·양쯔강 삼각주",
        region: "China",
        risk: "경제 거점 저지대 노출"
      }),
      Object.freeze({
        city: "Alexandria",
        place: "지중해 해안 역사 지구",
        region: "Egypt",
        risk: "해안 침식과 침수 위험"
      }),
      Object.freeze({
        city: "New York",
        place: "Lower Manhattan",
        region: "United States",
        risk: "해안 인프라·금융 지구 노출"
      }),
      Object.freeze({
        city: "Mumbai",
        place: "Back Bay와 저지대 교통축",
        region: "India",
        risk: "고밀도 도시 기능 노출"
      })
    ])
  })
]);

const DEFAULT_SCENARIO_KEY = SDG13_SCENARIOS[0].key;

function escapeSdg13Text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function getScenario(key) {
  return SDG13_SCENARIOS.find((scenario) => scenario.key === key) || SDG13_SCENARIOS[0];
}

export function createSdg13InitialState() {
  return {
    stage: SDG13_STAGE_INTRO,
    scenarioKey: DEFAULT_SCENARIO_KEY
  };
}

export function selectSdg13Scenario(state, scenarioKey) {
  return {
    ...state,
    stage: SDG13_STAGE_RESULT,
    scenarioKey: getScenario(scenarioKey).key
  };
}

export function resetSdg13Experience() {
  return createSdg13InitialState();
}

export function calculateSdg13Scenario(stateInput) {
  const state = stateInput || createSdg13InitialState();
  const scenario = getScenario(state.scenarioKey);
  const isIntro = state.stage === SDG13_STAGE_INTRO;
  const waterLevel = isIntro ? 18 : scenario.waterLevel;
  const visibleLocations = isIntro ? [] : scenario.locations;

  return {
    stage: state.stage,
    scenario,
    waterLevel,
    visibleLocations,
    lineLabel: isIntro ? "현재 해안선" : scenario.lineCopy,
    riskLabel: `${scenario.riskScore}/100`,
    seaLevelLabel: `${scenario.seaLevelRange} by 2100`
  };
}

export function renderSdg13ScenarioButtons() {
  return SDG13_SCENARIOS.map((scenario) => `
    <button type="button" class="sdg13-scenario-btn" data-scenario-key="${escapeSdg13Text(scenario.key)}">
      <span>${escapeSdg13Text(scenario.label)}</span>
      <strong>${escapeSdg13Text(scenario.headline)}</strong>
      <small>${escapeSdg13Text(scenario.seaLevelBasis)}</small>
    </button>
  `).join("");
}

export function renderSdg13LocationItems(locations) {
  return locations.map((location) => `
    <article class="sdg13-location-item">
      <span>${escapeSdg13Text(location.region)}</span>
      <strong>${escapeSdg13Text(location.city)}</strong>
      <small>${escapeSdg13Text(location.place)} · ${escapeSdg13Text(location.risk)}</small>
    </article>
  `).join("");
}

export function renderSdg13ResourceItems() {
  return SDG13_VISIBLE_RESOURCE_KEYS.map((key) => SDG13_SOURCES[key]).filter(Boolean).map((item) => {
    const content = `
      <span class="sdg13-resource-source">${escapeSdg13Text(item.type)}</span>
      <span class="sdg13-resource-title">${escapeSdg13Text(item.name)}</span>
    `;

    if (!item.url) {
      return `<span class="sdg13-resource-link is-static">${content}</span>`;
    }

    return `
      <a class="sdg13-resource-link" href="${escapeSdg13Text(item.url)}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
