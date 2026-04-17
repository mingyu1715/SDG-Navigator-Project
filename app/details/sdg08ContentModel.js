export const SDG08_STAGE_INTRO = "intro";
export const SDG08_STAGE_DECISION = "decision";
export const SDG08_STAGE_RESULT = "result";

export const SDG08_CHOICE_AUTOMATION = "automation";
export const SDG08_CHOICE_TRAINING = "training";

export const SDG08_RESULT_ANIMATION_MS = 1120;

const SDG08_RESULT_MAP = Object.freeze({
  [SDG08_CHOICE_AUTOMATION]: Object.freeze({
    choice: SDG08_CHOICE_AUTOMATION,
    choiceLabel: "AI 자동화 도입",
    growth: 86,
    jobQuality: 38,
    workforceScale: 0.78,
    summary: "AI 자동화를 선택하자 성장률은 빠르게 올랐지만, 일자리 질은 불안정해졌습니다.",
    message: "성장은 빨랐지만 고용의 안정성은 낮아졌습니다."
  }),
  [SDG08_CHOICE_TRAINING]: Object.freeze({
    choice: SDG08_CHOICE_TRAINING,
    choiceLabel: "인력 교육 투자",
    growth: 64,
    jobQuality: 82,
    workforceScale: 1.08,
    summary: "인력 교육 투자를 선택하자 성장은 완만하지만, 일자리 질은 꾸준히 개선됐습니다.",
    message: "속도는 느려도 더 안정적인 고용 기반이 만들어졌습니다."
  })
});

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
    running: false
  };
}

export function getSdg08Result(choice) {
  return SDG08_RESULT_MAP[choice] || SDG08_RESULT_MAP[SDG08_CHOICE_AUTOMATION];
}
