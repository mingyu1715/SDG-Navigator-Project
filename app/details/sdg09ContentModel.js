export const SDG09_STAGE_INTRO = "intro";
export const SDG09_STAGE_BUILD = "build";
export const SDG09_STAGE_RESULT = "result";

export const SDG09_INFRA_5G = "industrial-5g";
export const SDG09_INFRA_SMART_FACTORY = "smart-factory";
export const SDG09_INFRA_TESTBED = "innovation-testbed";

export const SDG09_BUILD_ANIMATION_MS = 1550;
export const SDG09_COUNT_ANIMATION_MS = 1050;

function freezeSdg09Scenario(scenario) {
  return Object.freeze({
    ...scenario,
    metrics: Object.freeze(scenario.metrics.map((metric) => Object.freeze({ ...metric }))),
    resources: Object.freeze(scenario.resources.map((resource) => Object.freeze({ ...resource })))
  });
}

const SDG09_SHARED_RESOURCES = Object.freeze([
  Object.freeze({
    source: "UN SDG",
    title: "Goal 9: Industry, Innovation and Infrastructure",
    url: "https://sdgs.un.org/goals/goal9"
  }),
  Object.freeze({
    source: "UNIDO",
    title: "Inclusive and Sustainable Industrial Development",
    url: "https://www.unido.org/"
  }),
  Object.freeze({
    source: "ITU",
    title: "Digital infrastructure and connectivity",
    url: "https://www.itu.int/"
  })
]);

const SDG09_SCENARIOS = Object.freeze([
  freezeSdg09Scenario({
    choice: SDG09_INFRA_5G,
    title: "산업용 5G 망",
    shortTitle: "5G",
    meta: "실시간 제어와 데이터 연결",
    label: "Industrial 5G",
    accent: "#5ee3ff",
    accentSoft: "#8ff0ff",
    tone: "network",
    summary: "끊어진 생산 거점이 실시간 데이터망에 연결되며 원격 제어와 품질 관리가 동시에 작동합니다.",
    message: "신호가 닿으면 기술은 이동하고, 산업 생태계는 같은 속도로 반응하기 시작합니다.",
    bridgeLabel: "CONNECTED INDUSTRIAL NETWORK",
    metrics: [
      { key: "jobs", label: "새 일자리", value: 12800, suffix: "명" },
      { key: "workers", label: "연결된 작업자", value: 420000, suffix: "명" },
      { key: "efficiency", label: "공정 응답성", value: 42, suffix: "%" },
      { key: "projects", label: "원격 운영 거점", value: 76, suffix: "곳" }
    ],
    resources: SDG09_SHARED_RESOURCES
  }),
  freezeSdg09Scenario({
    choice: SDG09_INFRA_SMART_FACTORY,
    title: "스마트 제조 라인",
    shortTitle: "Factory",
    meta: "생산성, 품질, 숙련 일자리",
    label: "Smart Manufacturing",
    accent: "#ffb454",
    accentSoft: "#ffd36d",
    tone: "manufacturing",
    summary: "수작업으로 멈춰 있던 설비가 센서와 자동화 라인으로 이어지며 생산 흐름이 안정됩니다.",
    message: "연결된 설비는 더 빠르게 만들고, 더 정확하게 고치며, 더 오래 일할 수 있는 기반이 됩니다.",
    bridgeLabel: "SMART PRODUCTION CORRIDOR",
    metrics: [
      { key: "jobs", label: "새 일자리", value: 9600, suffix: "명" },
      { key: "workers", label: "연결된 기업", value: 1380, suffix: "개" },
      { key: "efficiency", label: "생산 효율", value: 37, suffix: "%" },
      { key: "projects", label: "품질 추적 라인", value: 112, suffix: "개" }
    ],
    resources: SDG09_SHARED_RESOURCES
  }),
  freezeSdg09Scenario({
    choice: SDG09_INFRA_TESTBED,
    title: "혁신 테스트베드",
    shortTitle: "R&D",
    meta: "시제품, 연구소, 중소기업 실험",
    label: "Innovation Testbed",
    accent: "#9cf06f",
    accentSoft: "#c2ff8a",
    tone: "research",
    summary: "아이디어가 멈춰 있던 지역에 실험 장비와 검증 네트워크가 생기며 시제품이 시장과 만납니다.",
    message: "실험할 수 있는 기반은 실패 비용을 낮추고, 더 많은 혁신을 실제 산업으로 옮깁니다.",
    bridgeLabel: "OPEN INNOVATION TESTBED",
    metrics: [
      { key: "jobs", label: "새 일자리", value: 7200, suffix: "명" },
      { key: "workers", label: "참여 기업/팀", value: 860, suffix: "팀" },
      { key: "efficiency", label: "개발 기간 단축", value: 31, suffix: "%" },
      { key: "projects", label: "시제품 프로젝트", value: 148, suffix: "건" }
    ],
    resources: SDG09_SHARED_RESOURCES
  })
]);

const SDG09_SCENARIO_MAP = Object.freeze(
  SDG09_SCENARIOS.reduce((acc, scenario) => {
    acc[scenario.choice] = scenario;
    return acc;
  }, {})
);

export function createSdg09InitialState() {
  return {
    stage: SDG09_STAGE_INTRO,
    selectedChoice: null,
    running: false
  };
}

export function getSdg09Scenarios() {
  return SDG09_SCENARIOS.slice();
}

export function getSdg09Scenario(choice) {
  return SDG09_SCENARIO_MAP[choice] || null;
}

export function isValidSdg09Choice(choice) {
  return Boolean(SDG09_SCENARIO_MAP[choice]);
}

export function formatSdg09MetricValue(value, suffix = "") {
  const numericValue = Math.round(Number(value) || 0);
  return `${numericValue.toLocaleString("ko-KR")}${suffix}`;
}
