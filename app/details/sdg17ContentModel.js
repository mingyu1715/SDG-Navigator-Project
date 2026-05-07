export const SDG17_STAGE_INTRO = "intro";
export const SDG17_STAGE_RESULT = "result";

export const SDG17_SOURCES = Object.freeze({
  unGoal17: Object.freeze({
    type: "official",
    name: "UN SDG Goal 17",
    year: "2026 access",
    detail: "Partnerships for the Goals target and context",
    url: "https://sdgs.un.org/goals/goal17"
  }),
  ituFacts2025: Object.freeze({
    type: "official",
    name: "ITU Facts and Figures 2025",
    year: "2025",
    detail: "Estimated global Internet users and offline population",
    url: "https://www.itu.int/en/mediacentre/Pages/PR-2025-11-17-Facts-and-Figures.aspx"
  }),
  oecdOda2025: Object.freeze({
    type: "official",
    name: "OECD preliminary ODA data",
    year: "2025",
    detail: "Official development assistance by DAC members and associates",
    url: "https://www.oecd.org/en/about/news/press-releases/2026/04/international-aid-fell-sharply-in-2025-says-oecd.html"
  }),
  unctadTrade2024: Object.freeze({
    type: "official",
    name: "UNCTAD Global Trade Update",
    year: "2024",
    detail: "Global trade in goods and services",
    url: "https://unctad.org/news/global-trade-hits-record-33-trillion-2024-driven-services-and-developing-economies"
  }),
  unMemberStates: Object.freeze({
    type: "official",
    name: "United Nations About Us",
    year: "2026 access",
    detail: "UN Member States count",
    url: "https://www.un.org/en/about-us/"
  })
});

export const SDG17_METRICS = Object.freeze([
  Object.freeze({
    key: "internet",
    label: "인터넷 이용자",
    value: "60억명",
    detail: "2025년 전 세계 인구의 약 3/4",
    sourceKey: "ituFacts2025"
  }),
  Object.freeze({
    key: "oda",
    label: "국제 개발원조",
    value: "$174.3B",
    detail: "2025년 DAC 회원·준회원 ODA 예비치",
    sourceKey: "oecdOda2025"
  }),
  Object.freeze({
    key: "trade",
    label: "글로벌 무역",
    value: "$33T",
    detail: "2024년 상품·서비스 무역 합계",
    sourceKey: "unctadTrade2024"
  }),
  Object.freeze({
    key: "states",
    label: "UN 회원국",
    value: "193개국",
    detail: "공통 문제를 논의하는 국제 협력 기반",
    sourceKey: "unMemberStates"
  })
]);

export const SDG17_MODEL_NOTE =
  "지구본의 노드와 연결선은 실제 기관 위치를 실시간 표시한 것이 아니라, 공식 전역 지표를 설명하기 위한 체험용 협력망 시각화입니다.";

export const SDG17_NETWORK_NODES = Object.freeze([
  Object.freeze({ key: "eastAsia", label: "East Asia Hub", lat: 39.9, lon: 116.4, scale: 1.08 }),
  Object.freeze({ key: "southAsia", label: "South Asia Hub", lat: 28.61, lon: 77.21, scale: 1.02 }),
  Object.freeze({ key: "seAsia", label: "Southeast Asia Hub", lat: 13.76, lon: 100.5, scale: 1.04 }),
  Object.freeze({ key: "eastAfrica", label: "East Africa Hub", lat: -1.29, lon: 36.82, scale: 1.02 }),
  Object.freeze({ key: "westAfrica", label: "West Africa Hub", lat: 9.08, lon: 7.49, scale: 0.98 }),
  Object.freeze({ key: "geneva", label: "Geneva", lat: 46.2, lon: 6.14, scale: 1.08 }),
  Object.freeze({ key: "brussels", label: "Brussels", lat: 50.85, lon: 4.35, scale: 1 }),
  Object.freeze({ key: "chicago", label: "North America Hub", lat: 41.88, lon: -87.63, scale: 1.08 }),
  Object.freeze({ key: "mexicoCity", label: "Mexico City", lat: 19.43, lon: -99.13, scale: 0.96 }),
  Object.freeze({ key: "bogota", label: "Bogota", lat: 4.71, lon: -74.07, scale: 0.94 }),
  Object.freeze({ key: "brasilia", label: "Brasilia", lat: -15.79, lon: -47.88, scale: 1 }),
  Object.freeze({ key: "canberra", label: "Canberra", lat: -35.28, lon: 149.13, scale: 0.98 })
]);

export const SDG17_NETWORK_LINKS = Object.freeze([
  Object.freeze(["eastAsia", "southAsia"]),
  Object.freeze(["eastAsia", "seAsia"]),
  Object.freeze(["southAsia", "seAsia"]),
  Object.freeze(["seAsia", "eastAfrica"]),
  Object.freeze(["eastAfrica", "westAfrica"]),
  Object.freeze(["westAfrica", "geneva"]),
  Object.freeze(["eastAfrica", "geneva"]),
  Object.freeze(["geneva", "brussels"]),
  Object.freeze(["geneva", "chicago"]),
  Object.freeze(["chicago", "mexicoCity"]),
  Object.freeze(["mexicoCity", "bogota"]),
  Object.freeze(["bogota", "brasilia"]),
  Object.freeze(["brasilia", "westAfrica"]),
  Object.freeze(["canberra", "seAsia"]),
  Object.freeze(["canberra", "eastAsia"])
]);

const SDG17_VISIBLE_SOURCE_KEYS = Object.freeze([
  "unGoal17",
  "ituFacts2025",
  "oecdOda2025",
  "unctadTrade2024",
  "unMemberStates"
]);

function escapeSdg17Text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

export function createSdg17InitialState() {
  return {
    stage: SDG17_STAGE_INTRO
  };
}

export function runSdg17Experience(stateInput) {
  const state = stateInput || createSdg17InitialState();
  return {
    ...state,
    stage: SDG17_STAGE_RESULT
  };
}

export function resetSdg17Experience() {
  return createSdg17InitialState();
}

export function calculateSdg17Scenario(stateInput) {
  const state = stateInput || createSdg17InitialState();
  const active = state.stage === SDG17_STAGE_RESULT;

  return {
    stage: state.stage,
    active,
    connectionCount: active ? SDG17_NETWORK_LINKS.length : 0,
    nodeCount: active ? SDG17_NETWORK_NODES.length : 0,
    metrics: SDG17_METRICS,
    nodes: active ? SDG17_NETWORK_NODES : [],
    links: active ? SDG17_NETWORK_LINKS : [],
    resultTitle: "세계는 이미 연결되어 있습니다",
    resultCopy: "연결은 단순한 선이 아니라 자금, 정보, 무역, 제도가 함께 움직이는 통로입니다.",
    finalMessage: "혼자서는 불가능하지만, 연결되면 해결할 수 있습니다.",
    sourceItems: SDG17_VISIBLE_SOURCE_KEYS.map((sourceKey) => SDG17_SOURCES[sourceKey]).filter(Boolean)
  };
}

export function renderSdg17MetricItems(metrics) {
  return metrics.map((metric) => `
    <article class="sdg17-metric-card">
      <span>${escapeSdg17Text(metric.label)}</span>
      <strong>${escapeSdg17Text(metric.value)}</strong>
      <small>${escapeSdg17Text(metric.detail)}</small>
    </article>
  `).join("");
}

export function renderSdg17SourceItems(sourceItems) {
  return sourceItems.map((item) => {
    const content = `
      <span class="sdg17-source-type">${escapeSdg17Text(item.type)}</span>
      <span class="sdg17-source-name">${escapeSdg17Text(item.name)}</span>
    `;

    return `
      <a class="sdg17-source-link" href="${escapeSdg17Text(item.url)}" target="_blank" rel="noopener noreferrer">
        ${content}
      </a>
    `;
  }).join("");
}
