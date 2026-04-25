export const SDG08_STAGE_INTRO = "intro";
export const SDG08_STAGE_DECISION = "decision";
export const SDG08_STAGE_RESULT = "result";

export const SDG08_CHOICE_AUTOMATION = "automation";
export const SDG08_CHOICE_TRAINING = "training";
export const SDG08_CHOICE_FLEX = "flex";
export const SDG08_CHOICE_GREEN = "green";
export const SDG08_CHOICE_WAGE = "wage";
export const SDG08_CHOICE_STARTUP = "startup";
export const SDG08_CHOICE_EXPORT = "export";
export const SDG08_CHOICE_SAFETY = "safety";

export const SDG08_RESULT_ANIMATION_MS = 1120;
export const SDG08_DECISION_PICK_SIZE = 4;

function freezeSdg08Policy(policy) {
  return Object.freeze({
    ...policy,
    details: Object.freeze({ ...policy.details }),
    resources: Object.freeze((policy.resources || []).map((item) => Object.freeze({ ...item })))
  });
}

const SDG08_SHARED_RESOURCES = Object.freeze([
  Object.freeze({
    source: "UN SDG",
    title: "Goal 8: Decent Work and Economic Growth",
    url: "https://sdgs.un.org/goals/goal8"
  }),
  Object.freeze({
    source: "ILO",
    title: "Decent Work",
    url: "https://www.ilo.org/topics/decent-work"
  }),
  Object.freeze({
    source: "OECD",
    title: "Employment Outlook",
    url: "https://www.oecd.org/en/publications/oecd-employment-outlook_19991266.html"
  })
]);

const SDG08_POLICY_ENTRIES = Object.freeze([
  freezeSdg08Policy({
    choice: SDG08_CHOICE_AUTOMATION,
    title: "AI 자동화 도입",
    meta: "생산성 가속",
    choiceLabel: "AI 자동화 도입",
    growth: 86,
    jobQuality: 38,
    workforceScale: 0.78,
    summary: "생산성은 빠르게 높아졌지만, 전환을 따라가지 못한 노동자는 더 불안정해졌습니다.",
    message: "성장의 속도는 빨랐지만, 전환 비용은 더 크게 남았습니다.",
    stabilityState: "전환 격차 확대",
    stabilityCopy: "일부 직무는 빠르게 줄고, 적응이 늦은 노동자일수록 불안정이 커집니다.",
    animation: "aggressive",
    details: {
      policySummary: "기업 자동화 보급으로 생산 효율을 빠르게 끌어올리는 전략입니다.",
      shortTerm: "생산성 지표는 빠르게 상승하지만 중간숙련 직무 축소가 동반됩니다.",
      longTerm: "전환 교육이 부족하면 고용 양극화와 임금 격차가 커질 수 있습니다.",
      stability: "성과 압박이 높아 고용 안정성은 낮은 편입니다.",
      vulnerableImpact: "전환 지원이 약한 청년·중장년 노동자에게 충격이 집중됩니다.",
      risk: "재교육 투자 없이 자동화만 확장하면 실업 리스크가 커집니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_TRAINING,
    title: "인력 교육 투자",
    meta: "전환 적응",
    choiceLabel: "인력 교육 투자",
    growth: 64,
    jobQuality: 82,
    workforceScale: 1.08,
    summary: "성장은 더디지만, 더 많은 사람이 변화에 적응하며 안정적인 고용으로 연결됩니다.",
    message: "속도는 느려도, 전환 충격을 흡수하는 기반이 강해집니다.",
    stabilityState: "적응 기반 확대",
    stabilityCopy: "재교육을 받은 인력이 늘수록 고용의 연속성과 전환 가능성이 좋아집니다.",
    animation: "resilient",
    details: {
      policySummary: "기존 노동자의 재교육과 직무 전환을 우선하는 전략입니다.",
      shortTerm: "예산 부담으로 성장 속도는 다소 낮아질 수 있습니다.",
      longTerm: "숙련도 향상으로 생산성·임금·고용 안정성이 함께 개선됩니다.",
      stability: "정규 고용 유지율이 높아 전반적인 고용 안정성이 올라갑니다.",
      vulnerableImpact: "전환교육 접근성을 높이면 취약계층의 재취업 가능성이 커집니다.",
      risk: "산업 수요와 교육 내용이 어긋나면 투자 효율이 낮아질 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_FLEX,
    title: "유연고용 확대",
    meta: "조정 비용 절감",
    choiceLabel: "유연고용 확대",
    growth: 76,
    jobQuality: 46,
    workforceScale: 0.88,
    summary: "기업 조정은 쉬워졌지만, 고용의 예측 가능성은 더 낮아졌습니다.",
    message: "비용 대응은 빨라지지만 노동자의 계획 가능성은 약해집니다.",
    stabilityState: "예측 가능성 하락",
    stabilityCopy: "계약 지속성보다 유연성이 우선되면서 고용의 흔들림이 커집니다.",
    animation: "volatile",
    details: {
      policySummary: "계약·파견 비중을 높여 인건비와 조정 비용을 줄이는 전략입니다.",
      shortTerm: "기업 고용 조정이 쉬워져 단기 성장과 수익성은 개선됩니다.",
      longTerm: "경력 단절과 소득 변동성이 커지면서 노동시장 불안정이 누적됩니다.",
      stability: "고용 지속성이 낮아져 중장기 커리어 형성이 어려워집니다.",
      vulnerableImpact: "사회안전망이 약한 계층은 생활 불안이 더 크게 나타납니다.",
      risk: "저임금·불안정 고용이 고착되면 내수와 생산성까지 약해질 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_GREEN,
    title: "녹색산업 전환 투자",
    meta: "전환 균형",
    choiceLabel: "녹색산업 전환 투자",
    growth: 69,
    jobQuality: 88,
    workforceScale: 1.12,
    summary: "전환 비용은 크지만, 새로운 산업에서 안정적인 일자리 기반이 커집니다.",
    message: "초기 부담은 있지만 장기적으로는 성장과 고용의 균형이 좋아집니다.",
    stabilityState: "지속가능 기반 강화",
    stabilityCopy: "신산업 적응이 진행될수록 장기 고용과 일자리 질이 함께 개선됩니다.",
    animation: "inclusive",
    details: {
      policySummary: "재생에너지·순환경제 분야 중심으로 산업 구조를 전환하는 전략입니다.",
      shortTerm: "초기 전환 비용이 커 성장률은 다소 완만하게 나타납니다.",
      longTerm: "신산업 고용이 늘고 기술 내재화로 지속가능한 성장 기반이 강화됩니다.",
      stability: "신규 일자리의 질과 장기 고용 유지율이 함께 개선됩니다.",
      vulnerableImpact: "지역 전환 프로그램을 병행하면 취약계층의 참여 기회가 확대됩니다.",
      risk: "전환 속도 조정 실패 시 기존 산업 일자리 공백이 일시적으로 커질 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_WAGE,
    title: "최저임금·보호 강화",
    meta: "소득 방어",
    choiceLabel: "최저임금·보호 강화",
    growth: 61,
    jobQuality: 79,
    workforceScale: 1.04,
    summary: "비용 압박은 생기지만, 저임금 노동자의 고용 안전망은 더 두터워집니다.",
    message: "성장 속도는 낮아져도 일의 버팀목은 강해집니다.",
    stabilityState: "소득 안전망 강화",
    stabilityCopy: "임금 하한과 보호 기준이 높아질수록 생활 안정성이 커집니다.",
    animation: "resilient",
    details: {
      policySummary: "임금 하한선과 노동 보호 기준을 강화하는 정책입니다.",
      shortTerm: "저임금 부문 비용 부담이 증가해 조정 압력이 발생할 수 있습니다.",
      longTerm: "소득 안정이 내수 기반을 강화하고 노동 이탈을 줄입니다.",
      stability: "고용의 예측 가능성이 높아져 생활 안정성이 개선됩니다.",
      vulnerableImpact: "저임금·비정형 노동자의 기본 소득 안전망이 강화됩니다.",
      risk: "영세 사업장 지원 없이 시행하면 고용 축소 반응이 발생할 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_STARTUP,
    title: "창업·중소기업 지원",
    meta: "진입 기회 확대",
    choiceLabel: "창업·중소기업 지원",
    growth: 73,
    jobQuality: 63,
    workforceScale: 1.03,
    summary: "일자리는 늘었지만, 기업마다 고용의 질 차이가 크게 벌어졌습니다.",
    message: "양적 확대는 가능하지만 질 관리가 함께 따라와야 합니다.",
    stabilityState: "기회 확대, 편차 유지",
    stabilityCopy: "진입 기회는 늘지만 기업 체력에 따라 안정도의 차이가 남습니다.",
    animation: "volatile",
    details: {
      policySummary: "신생 기업과 중소기업의 고용 확대를 유도하는 전략입니다.",
      shortTerm: "신규 채용과 지역 일자리 창출 효과가 빠르게 나타납니다.",
      longTerm: "생존율이 낮은 기업 비중이 높으면 고용 질 편차가 커질 수 있습니다.",
      stability: "기업 성숙도에 따라 고용 안정성 차이가 크게 발생합니다.",
      vulnerableImpact: "지역 청년층의 진입 기회는 늘지만 초기 소득 불안이 남습니다.",
      risk: "성과 중심 보조금 구조는 단기 고용 후 이탈을 유도할 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_EXPORT,
    title: "수출산업 집중 지원",
    meta: "성장 집중",
    choiceLabel: "수출산업 집중 지원",
    growth: 84,
    jobQuality: 52,
    workforceScale: 0.91,
    summary: "성장 지표는 개선됐지만, 산업 간 고용 격차와 외부 충격 민감도는 커졌습니다.",
    message: "고성장은 가능하지만 고용 안정은 특정 산업에 치우치게 됩니다.",
    stabilityState: "산업 격차 확대",
    stabilityCopy: "핵심 산업 밖 노동자는 성장 혜택을 체감하기 어렵습니다.",
    animation: "aggressive",
    details: {
      policySummary: "수출 주력 업종에 자본과 인센티브를 집중하는 전략입니다.",
      shortTerm: "성장률과 생산지표가 빠르게 개선되는 효과가 큽니다.",
      longTerm: "대외 경기 변동에 취약해 고용 안정성이 흔들릴 수 있습니다.",
      stability: "핵심 산업 외 부문의 고용 기반이 약해지는 경향이 있습니다.",
      vulnerableImpact: "내수 서비스 중심 취약 노동자의 소득 회복이 지연될 수 있습니다.",
      risk: "외부 충격 시 고용 조정이 급격하게 발생할 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  }),
  freezeSdg08Policy({
    choice: SDG08_CHOICE_SAFETY,
    title: "노동안전·권리 집행",
    meta: "현장 안정",
    choiceLabel: "노동안전·권리 집행",
    growth: 62,
    jobQuality: 86,
    workforceScale: 1.1,
    summary: "성장은 완만하지만, 위험과 이직이 줄며 더 오래 일할 수 있는 기반이 만들어집니다.",
    message: "느린 성장 대신 지속 가능한 노동환경이 강화됩니다.",
    stabilityState: "현장 안정성 개선",
    stabilityCopy: "사고와 이직이 줄수록 일자리는 더 오래 유지됩니다.",
    animation: "inclusive",
    details: {
      policySummary: "산업안전, 근로시간, 권리보호 집행을 강화하는 정책입니다.",
      shortTerm: "준수 비용으로 단기 성장 속도는 다소 낮아질 수 있습니다.",
      longTerm: "안전한 작업환경이 생산성 손실과 이직률을 줄입니다.",
      stability: "장기 근속과 숙련 축적이 용이해 고용 질이 꾸준히 개선됩니다.",
      vulnerableImpact: "위험 직무·비정규 노동자의 건강권 보호 효과가 큽니다.",
      risk: "감독·집행 역량이 낮으면 현장 체감 개선이 제한될 수 있습니다."
    },
    resources: SDG08_SHARED_RESOURCES
  })
]);

const SDG08_RESULT_MAP = Object.freeze(
  SDG08_POLICY_ENTRIES.reduce((acc, entry) => {
    acc[entry.choice] = entry;
    return acc;
  }, {})
);

const SDG08_DECISION_OPTIONS = Object.freeze(
  SDG08_POLICY_ENTRIES.map((entry) => Object.freeze({
    choice: entry.choice,
    title: entry.title,
    meta: entry.meta
  }))
);

export function clampSdg08(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function easeOutSdg08Cubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function formatSdg08Percent(value) {
  return `${Math.round(Number(value) || 0)}%`;
}

export function createSdg08InitialState() {
  return {
    stage: SDG08_STAGE_INTRO,
    decision: null,
    running: false,
    decisionOptions: []
  };
}

export function getSdg08Result(choice) {
  return SDG08_RESULT_MAP[choice] || null;
}

export function getSdg08DecisionOptions() {
  return SDG08_DECISION_OPTIONS.slice();
}

function pickSdg08RandomOptions(source, pickSize) {
  const pool = source.slice();
  for (let idx = pool.length - 1; idx > 0; idx -= 1) {
    const swapIdx = Math.floor(Math.random() * (idx + 1));
    [pool[idx], pool[swapIdx]] = [pool[swapIdx], pool[idx]];
  }
  return pool.slice(0, pickSize);
}

export function toSdg08DecisionKey(choicesInput) {
  const normalized = (Array.isArray(choicesInput) ? choicesInput : [])
    .map((entry) => (typeof entry === "string" ? entry : entry?.choice))
    .filter(Boolean)
    .sort();
  return normalized.join("|");
}

export function getSdg08RandomDecisionOptions(previousChoiceKey = "") {
  if (SDG08_DECISION_OPTIONS.length <= SDG08_DECISION_PICK_SIZE) {
    return SDG08_DECISION_OPTIONS.slice();
  }

  const maxAttempts = 8;
  let picked = [];

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    picked = pickSdg08RandomOptions(SDG08_DECISION_OPTIONS, SDG08_DECISION_PICK_SIZE);
    if (!previousChoiceKey || toSdg08DecisionKey(picked) !== previousChoiceKey) {
      return picked;
    }
  }

  return picked.length
    ? picked
    : SDG08_DECISION_OPTIONS.slice(0, SDG08_DECISION_PICK_SIZE);
}

export function isValidSdg08Choice(choice) {
  return Boolean(SDG08_RESULT_MAP[choice]);
}
