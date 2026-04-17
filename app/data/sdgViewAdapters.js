export function toGoalText(goalId) {
  return String(goalId).padStart(2, "0");
}

export function toMainCardViewModel(goal) {
  return {
    id: goal.id,
    color: goal.color,
    title: goal.title,
    subtitle: goal.sub,
    description: goal.detailed,
    ...("titleSize" in goal ? { titleSize: goal.titleSize } : {})
  };
}

export function toDetailFrameViewModel(goalId, goal, detail = null) {
  const goalText = toGoalText(goalId);

  return {
    goalLabel: `SDG GOAL ${goalText}`,
    title: detail?.subtitle || goal?.sub || detail?.title || goal?.title || `목표 ${goalText}`,
    subtitle: detail?.title || goal?.title || `SDG GOAL ${goalText}`,
    lead: detail?.lead || detail?.description || "목표의 핵심 맥락을 확인해보세요.",
    hint: detail?.hint || "아래 콘텐츠에서 상세 정보를 확인하세요.",
    badge: String(Number(goalId))
  };
}

export function toDefaultDetailFrameMeta(goalId, goal) {
  return {
    title: goal?.title || `SDG ${toGoalText(goalId)}`,
    subtitle: goal?.sub || ""
  };
}
