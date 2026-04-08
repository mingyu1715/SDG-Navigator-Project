const DEFAULT_DETAIL_FEATURES = Object.freeze(["초안 포인트를 입력하세요."]);

export const FRONTEND_SDG_SURFACE_SOURCES = Object.freeze({
  cardMeta: Object.freeze({
    source: "public/app/data/sdgs.json | FALLBACK_SDG_DATA",
    fields: Object.freeze(["id", "color", "title", "sub", "detailed", "titleSize"])
  }),
  editableDetailDraft: Object.freeze({
    source: "public/app/data/detailDraftOverrides.json + public/app/data/sdgs.js",
    fields: Object.freeze(["id", "title", "subtitle", "description", "features"])
  }),
  goalDetailFallback: Object.freeze({
    source: "public/app/data/sdgs.js",
    fields: Object.freeze(["id", "title", "subtitle", "description", "features"])
  })
});

export function toCardMeta(goal) {
  return {
    id: goal.id,
    color: goal.color,
    title: goal.title,
    sub: goal.sub,
    detailed: goal.detailed,
    ...("titleSize" in goal ? { titleSize: goal.titleSize } : {})
  };
}

export function toEditableDetailDraft(goal, override = {}) {
  return {
    id: goal.id,
    title: goal.title,
    subtitle: goal.sub,
    description: override.description || goal.detailed,
    features: Array.isArray(override.features) && override.features.length
      ? [...override.features]
      : DEFAULT_DETAIL_FEATURES.slice()
  };
}

export function toGoalDetailFallback(goalId, goal) {
  return {
    id: goalId,
    title: goal ? goal.title : `SDG ${String(goalId).padStart(2, "0")}`,
    subtitle: goal ? goal.sub : "",
    description: goal ? goal.detailed : "상세 정보가 없습니다.",
    features: DEFAULT_DETAIL_FEATURES.slice()
  };
}
