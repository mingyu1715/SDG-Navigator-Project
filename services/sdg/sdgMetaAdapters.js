const BACKEND_SDG_SURFACE_SOURCES = Object.freeze({
  summary: Object.freeze({
    source: "services/sdg/sdg*Service.js",
    fields: Object.freeze(["id", "title", "subtitle", "color"])
  }),
  detail: Object.freeze({
    source: "services/sdg/sdg*Service.js",
    fields: Object.freeze(["id", "title", "subtitle", "color", "description", "features"])
  }),
  visit: Object.freeze({
    source: "services/sdg/createSdgService.js",
    fields: Object.freeze(["goalId", "visits"])
  }),
  action: Object.freeze({
    source: "services/sdg/createSdgService.js",
    fields: Object.freeze(["goalId", "action", "message"])
  })
});

function toSdgSummary(goal) {
  const { id, title, subtitle, color } = goal;
  return { id, title, subtitle, color };
}

function toSdgDetail(goal) {
  return {
    ...goal,
    features: Array.isArray(goal.features) ? [...goal.features] : goal.features
  };
}

function toSdgVisit(goalId, visits) {
  return { goalId, visits };
}

function toSdgActionResult(goal, action) {
  return {
    goalId: goal.id,
    action,
    message: `${goal.title}에 대한 '${action}' 액션이 처리되었습니다.`
  };
}

module.exports = {
  BACKEND_SDG_SURFACE_SOURCES,
  toSdgSummary,
  toSdgDetail,
  toSdgVisit,
  toSdgActionResult
};
