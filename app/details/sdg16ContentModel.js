export const SDG16_STAGE_INTRO = "intro";
export const SDG16_STAGE_RESULT = "result";

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
  acledConflictIndex2025: Object.freeze({
    type: "authority",
    name: "ACLED Weekly Conflict Index",
    year: "2026 access",
    detail: "Conflict severity ranking, weekly conflict intensity, and global conflict hotspot context",
    url: "https://acleddata.com/platform/weekly-conflict-index"
  }),
  sdg16SilenceSimulation: Object.freeze({
    type: "simulation",
    name: "Silence of Conflict map model",
    year: "2026",
    detail: "Conflict markers are representative educational map points, not live event markers",
    url: ""
  })
});

export const SDG16_MODEL_NOTE =
  "붉은 마커는 ACLED Conflict Index와 Weekly Conflict Index에서 반복적으로 언급되는 대표 분쟁 지역의 위도/경도입니다. 실시간 개별 사건 위치가 아니며, 지역별 수치는 출처와 기준 시점이 서로 다릅니다. 전역 통계는 2024년 또는 2023년 공식 연간 지표를 그대로 보여줍니다.";

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
  "acledConflictIndex2025",
  "unodcHomicide2023",
  "sdg16SilenceSimulation"
]);

export const SDG16_CONFLICT_LOCATIONS = Object.freeze([
  Object.freeze({
    key: "palestine",
    name: "Palestine / Gaza",
    label: "가자 지구",
    lat: 31.5,
    lon: 34.47,
    severity: "extreme",
    size: 14,
    context: "민간인 피해와 기반시설 붕괴가 집중적으로 보고되는 고강도 분쟁 지역입니다.",
    detail: "대표 좌표는 가자 지구 중심부를 가리키며, 실제 사건은 지역 안팎에서 계속 변동합니다."
  }),
  Object.freeze({
    key: "ukraine",
    name: "Ukraine",
    label: "우크라이나 동부",
    lat: 48.0,
    lon: 37.8,
    severity: "extreme",
    size: 14,
    context: "장기화된 전면전과 포격, 미사일 공격으로 민간 지역 위험이 지속됩니다.",
    detail: "대표 좌표는 동부 전선권을 가리키며, 전선과 공격 지역은 계속 이동합니다."
  }),
  Object.freeze({
    key: "sudan",
    name: "Sudan",
    label: "수단",
    lat: 15.5,
    lon: 32.6,
    severity: "extreme",
    size: 14,
    context: "내전과 도시 전투, 대규모 피란이 겹치며 인도주의 위기가 심화된 지역입니다.",
    detail: "대표 좌표는 하르툼 일대를 가리키며, 분쟁 영향은 수단 전역으로 확산되어 있습니다."
  }),
  Object.freeze({
    key: "myanmar",
    name: "Myanmar",
    label: "미얀마",
    lat: 21.9,
    lon: 96.1,
    severity: "extreme",
    size: 13,
    context: "군부와 반군 세력 간 충돌, 공습, 강제 이주가 이어지는 분쟁 지역입니다.",
    detail: "대표 좌표는 중부권을 가리키며, 실제 충돌은 여러 주와 국경 지대에 분산됩니다."
  }),
  Object.freeze({
    key: "syria",
    name: "Syria",
    label: "시리아",
    lat: 35.0,
    lon: 38.5,
    severity: "extreme",
    size: 12,
    context: "장기 내전의 잔존 충돌과 외부 개입, 취약한 제도 상황이 이어집니다.",
    detail: "대표 좌표는 시리아 중부를 가리키며, 위험은 북서부와 동부 등으로 나뉩니다."
  }),
  Object.freeze({
    key: "mexico",
    name: "Mexico",
    label: "멕시코",
    lat: 23.6,
    lon: -102.5,
    severity: "extreme",
    size: 12,
    context: "조직범죄 폭력과 지역 치안 불안이 높은 수준으로 지속되는 지역입니다.",
    detail: "대표 좌표는 멕시코 중앙부이며, 폭력 양상은 주별로 크게 다릅니다."
  }),
  Object.freeze({
    key: "nigeria",
    name: "Nigeria",
    label: "나이지리아 북동부",
    lat: 11.8,
    lon: 13.1,
    severity: "high",
    size: 11,
    context: "무장단체 활동과 지역사회 공격, 피란 문제가 결합된 고위험 지역입니다.",
    detail: "대표 좌표는 보르노 주 권역을 가리킵니다."
  }),
  Object.freeze({
    key: "ecuador",
    name: "Ecuador",
    label: "에콰도르",
    lat: -2.17,
    lon: -79.9,
    severity: "high",
    size: 11,
    context: "범죄조직 폭력과 국가 치안 위기가 빠르게 악화된 지역입니다.",
    detail: "대표 좌표는 과야킬 일대를 가리킵니다."
  }),
  Object.freeze({
    key: "haiti",
    name: "Haiti",
    label: "아이티",
    lat: 18.54,
    lon: -72.34,
    severity: "high",
    size: 11,
    context: "무장조직 폭력과 통치 공백, 민간인 피해가 겹친 위기 지역입니다.",
    detail: "대표 좌표는 포르토프랭스 일대를 가리킵니다."
  }),
  Object.freeze({
    key: "pakistan",
    name: "Pakistan",
    label: "파키스탄 서부",
    lat: 28.5,
    lon: 65.0,
    severity: "high",
    size: 10,
    context: "국경 지대와 서부 지역에서 무장 충돌과 공격 위험이 지속됩니다.",
    detail: "대표 좌표는 발루치스탄 권역을 가리킵니다."
  }),
  Object.freeze({
    key: "drc",
    name: "DR Congo",
    label: "콩고민주공화국 동부",
    lat: -1.66,
    lon: 29.22,
    severity: "high",
    size: 10,
    context: "동부 지역의 무장단체 충돌과 민간인 피해, 자원 갈등이 이어집니다.",
    detail: "대표 좌표는 북키부 고마 권역을 가리킵니다."
  }),
  Object.freeze({
    key: "burkinaFaso",
    name: "Burkina Faso",
    label: "부르키나파소",
    lat: 13.2,
    lon: -1.56,
    severity: "high",
    size: 10,
    context: "사헬 지역 무장 충돌과 민간인 대상 폭력이 높은 수준으로 지속됩니다.",
    detail: "대표 좌표는 부르키나파소 중앙부입니다."
  }),
  Object.freeze({
    key: "yemen",
    name: "Yemen",
    label: "예멘",
    lat: 15.55,
    lon: 48.5,
    severity: "high",
    size: 10,
    context: "장기 분쟁 이후에도 지역 충돌과 인도주의 위기가 계속되는 지역입니다.",
    detail: "대표 좌표는 예멘 내륙권을 가리킵니다."
  }),
  Object.freeze({
    key: "somalia",
    name: "Somalia",
    label: "소말리아",
    lat: 2.04,
    lon: 45.34,
    severity: "high",
    size: 9,
    context: "무장단체 공격과 취약한 국가 통제, 반복되는 인도주의 위기가 이어집니다.",
    detail: "대표 좌표는 모가디슈 권역입니다."
  }),
  Object.freeze({
    key: "lebanon",
    name: "Lebanon border area",
    label: "레바논 남부",
    lat: 33.1,
    lon: 35.5,
    severity: "turbulent",
    size: 9,
    context: "국경 지역 충돌과 공습 위험이 커진 불안정 지역입니다.",
    detail: "대표 좌표는 레바논 남부 국경권을 가리킵니다."
  }),
  Object.freeze({
    key: "colombia",
    name: "Colombia",
    label: "콜롬비아",
    lat: 4.57,
    lon: -74.3,
    severity: "turbulent",
    size: 9,
    context: "무장조직, 마약경제, 지역 통제권 갈등이 이어지는 지역입니다.",
    detail: "대표 좌표는 콜롬비아 중앙부입니다."
  }),
  Object.freeze({
    key: "brazil",
    name: "Brazil",
    label: "브라질",
    lat: -10.8,
    lon: -53.1,
    severity: "turbulent",
    size: 9,
    context: "조직범죄 폭력과 지역 갈등이 넓은 지역에 분산되어 나타납니다.",
    detail: "대표 좌표는 브라질 내륙권입니다."
  }),
  Object.freeze({
    key: "afghanistan",
    name: "Afghanistan",
    label: "아프가니스탄",
    lat: 34.5,
    lon: 69.2,
    severity: "turbulent",
    size: 8,
    context: "정치적 억압, 테러 공격, 지역별 충돌 위험이 남아 있는 지역입니다.",
    detail: "대표 좌표는 카불 권역입니다."
  })
]);

export const SDG16_DEFAULT_LOCATION_KEY = SDG16_CONFLICT_LOCATIONS[0].key;

const SDG16_LOCATION_FACTS = Object.freeze({
  palestine: Object.freeze({
    casualty: "사망 42,718명 · 부상 100,282명",
    displacement: "인구 75% 이상 피란 경험",
    economic: "직접피해 약 $30B · 복구필요 $53B",
    basis: "OCHA 2024.10 / WB-UN-EU IRDNA 2025",
    url: "https://www.worldbank.org/en/news/press-release/2025/02/18/new-report-assesses-damages-losses-and-needs-in-gaza-and-the-west-bank"
  }),
  ukraine: Object.freeze({
    casualty: "민간인 사망 12,654명 · 부상 29,392명",
    displacement: "주택 피해 250만 가구 이상",
    economic: "직접피해 $176B · 복구필요 $524B",
    basis: "OHCHR 2024.12 / World Bank RDNA4 2025",
    url: "https://www.worldbank.org/en/news/press-release/2025/02/25/updated-ukraine-recovery-and-reconstruction-needs-assessment-released"
  }),
  sudan: Object.freeze({
    casualty: "2025 상반기 민간인 사망 3,384명",
    displacement: "피란민 1,200만명 이상",
    economic: "GDP 2023년 -20%, 2024년 -15%",
    basis: "UN / World Bank Sudan Economic Update",
    url: "https://www.worldbank.org/en/country/sudan/publication/sudan-economic-update"
  }),
  myanmar: Object.freeze({
    casualty: "군부 쿠데타 이후 민간인 사망 6,000명 이상",
    displacement: "국내 실향민 350만명 이상",
    economic: "인도지원 필요액 약 $1B 규모",
    basis: "UN OHCHR / OCHA Myanmar 2025",
    url: "https://www.unocha.org/myanmar"
  }),
  syria: Object.freeze({
    casualty: "전쟁 사망 400,000-470,000명 추정",
    displacement: "인구 절반 이상 강제이주 경험",
    economic: "GDP 누적손실 $226B 추정",
    basis: "World Bank Syria Economic and Social Impact",
    url: "https://www.worldbank.org/en/country/syria/publication/the-toll-of-war-the-economic-and-social-consequences-of-the-conflict-in-syria"
  }),
  mexico: Object.freeze({
    casualty: "2023년 살인 피해자 30,523명",
    displacement: "조직범죄 영향 지역별 강제이주 보고",
    economic: "폭력 경제영향 약 4.9조 페소",
    basis: "Mexico Peace Index 2024",
    url: "https://www.economicsandpeace.org/reports/"
  }),
  nigeria: Object.freeze({
    casualty: "북동부 분쟁 사망 20,000명 이상",
    displacement: "강제이주 220만명 이상",
    economic: "복구필요 약 $6.7B",
    basis: "World Bank RPBA North-East Nigeria",
    url: "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/383661481983375025/north-east-nigeria-recovery-and-peace-building-assessment"
  }),
  ecuador: Object.freeze({
    casualty: "2023년 살인 8,008건",
    displacement: "치안 위기 지역별 이동 보고",
    economic: "공개 비교 피해액 없음",
    basis: "Ecuador official homicide reporting / HRW 2025",
    url: "https://www.hrw.org/world-report/2025/country-chapters/ecuador"
  }),
  haiti: Object.freeze({
    casualty: "2024년 사망 5,626명 · 부상 2,213명",
    displacement: "국내 실향민 100만명 이상",
    economic: "인도지원 필요액 $900M+",
    basis: "UN OHCHR / OCHA Haiti 2025",
    url: "https://www.ohchr.org/en/press-releases/2025/01/haiti-un-human-rights-chief-warns-worsening-human-rights-crisis"
  }),
  pakistan: Object.freeze({
    casualty: "2024년 테러 사망 852명 · 부상 1,092명",
    displacement: "서부 접경 지역 반복 피란",
    economic: "공개 비교 피해액 없음",
    basis: "Pakistan Security Report 2024",
    url: "https://www.pakpips.com/"
  }),
  drc: Object.freeze({
    casualty: "동부 위기 사망 843명 · 부상 6,027명",
    displacement: "국내 실향민 약 670만명",
    economic: "보건 대응 요청 $52M",
    basis: "WHO / OCHA DRC 2025",
    url: "https://www.who.int/emergencies/disease-outbreak-news/item/2025-DON559"
  }),
  burkinaFaso: Object.freeze({
    casualty: "민간인 피해와 공격 지속 보고",
    displacement: "국내 실향민 약 200만명",
    economic: "공개 비교 피해액 없음",
    basis: "OCHA Burkina Faso 2025",
    url: "https://www.unocha.org/burkina-faso"
  }),
  yemen: Object.freeze({
    casualty: "전쟁 관련 사망 377,000명 추정",
    displacement: "국내 실향민 450만명 이상",
    economic: "개발손실 수십 년 규모",
    basis: "UNDP Yemen Impact of War",
    url: "https://www.undp.org/publications/assessing-impact-war-yemen-pathways-recovery"
  }),
  somalia: Object.freeze({
    casualty: "충돌·공격 사상자 지속 보고",
    displacement: "국내 실향민 약 390만명",
    economic: "2025 인도지원 요구 $1.43B",
    basis: "OCHA Somalia HNRP 2025",
    url: "https://www.unocha.org/somalia"
  }),
  lebanon: Object.freeze({
    casualty: "사망 3,002명 · 부상 13,492명",
    displacement: "수십만명 피란",
    economic: "피해·손실 $14B · 복구필요 $11B",
    basis: "Lebanon RDNA 2025 / Health Ministry",
    url: "https://www.worldbank.org/en/country/lebanon/publication/lebanon-interim-damage-and-loss-assessment"
  }),
  colombia: Object.freeze({
    casualty: "공식 피해자 등록 900만명 이상",
    displacement: "강제이주 피해자 800만명 이상",
    economic: "공개 비교 피해액 없음",
    basis: "Colombia Victims Unit",
    url: "https://www.unidadvictimas.gov.co/"
  }),
  brazil: Object.freeze({
    casualty: "연간 살인 46,000명 이상",
    displacement: "조직폭력 영향 지역별 이동",
    economic: "공개 비교 피해액 없음",
    basis: "IPEA Atlas da Violencia",
    url: "https://www.ipea.gov.br/atlasviolencia/"
  }),
  afghanistan: Object.freeze({
    casualty: "폭발물·공격 민간인 사상 지속 보고",
    displacement: "인도지원 필요 2,370만명",
    economic: "공개 비교 피해액 없음",
    basis: "UNAMA / OCHA Afghanistan 2025",
    url: "https://www.unocha.org/afghanistan"
  })
});

export function getSdg16Location(locationKey) {
  return SDG16_CONFLICT_LOCATIONS.find((location) => location.key === locationKey)
    || SDG16_CONFLICT_LOCATIONS[0];
}

function escapeSdg16Text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

export function createSdg16InitialState() {
  return {
    stage: SDG16_STAGE_INTRO,
    selectedLocationKey: SDG16_DEFAULT_LOCATION_KEY
  };
}

export function runSdg16Experience(stateInput) {
  const state = stateInput || createSdg16InitialState();
  return {
    ...state,
    stage: SDG16_STAGE_RESULT,
    selectedLocationKey: state.selectedLocationKey || SDG16_DEFAULT_LOCATION_KEY
  };
}

export function resetSdg16Experience() {
  return createSdg16InitialState();
}

export function selectSdg16Location(stateInput, locationKey) {
  const state = stateInput || createSdg16InitialState();
  const location = getSdg16Location(locationKey);
  return {
    ...state,
    selectedLocationKey: location.key
  };
}

export function calculateSdg16Scenario(stateInput) {
  const state = stateInput || createSdg16InitialState();
  const locationCount = state.stage === SDG16_STAGE_RESULT
    ? SDG16_CONFLICT_LOCATIONS.length
    : 0;
  const visibleLocations = SDG16_CONFLICT_LOCATIONS.slice(0, locationCount).map((location, index) => ({
    ...location,
    index
  }));
  const activeLocation = state.stage === SDG16_STAGE_RESULT
    ? visibleLocations.find((location) => location.key === state.selectedLocationKey) || visibleLocations[0] || null
    : null;
  const impactLevel = state.stage === SDG16_STAGE_RESULT
    ? 0.82
    : 0;
  const activeLocationFacts = activeLocation ? SDG16_LOCATION_FACTS[activeLocation.key] || null : null;

  return {
    stage: state.stage,
    impactLevel,
    locationCount,
    visibleLocations,
    selectedLocationKey: activeLocation?.key || state.selectedLocationKey || SDG16_DEFAULT_LOCATION_KEY,
    activeLocation,
    activeLocationFacts,
    conflictExpectedLabel: SDG16_METRICS.conflictDeaths2024.label,
    conflictBasisLabel: "2024년 분쟁 관련 사망 공식 집계",
    protectedExpectedLabel: SDG16_METRICS.protectedKillings2024.label,
    homicideRateLabel: SDG16_METRICS.homicideRate2023.label,
    displacedLabel: SDG16_METRICS.forciblyDisplaced2024.label,
    resultTitle: "세계 분쟁 지도",
    resultCopy: "지구본의 붉은 마커는 실제 좌표를 가진 대표 분쟁 지역입니다. 지도 위의 점 하나는 한 도시나 국경선이 아니라, 평화가 흔들리는 생활권 전체를 뜻합니다.",
    sourceItems: SDG16_VISIBLE_SOURCE_KEYS.map((sourceKey) => SDG16_SOURCES[sourceKey]).filter(Boolean)
  };
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

export function renderSdg16LocationItems(locations, activeKey) {
  return locations.slice(0, 10).map((location) => `
    <button type="button" class="sdg16-location-chip is-${escapeSdg16Text(location.severity)}${location.key === activeKey ? " is-active" : ""}" data-location-key="${escapeSdg16Text(location.key)}" aria-pressed="${location.key === activeKey ? "true" : "false"}">
      ${escapeSdg16Text(location.label)}
    </button>
  `).join("");
}
