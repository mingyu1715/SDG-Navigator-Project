const {
  toSdgSummary,
  toSdgDetail,
  toSdgVisit,
  toSdgActionResult
} = require("./sdgMetaAdapters");

function createSdgService(goal) {
  let visits = 0;

  return {
    id: goal.id,
    getSummary() {
      return toSdgSummary(goal);
    },
    getDetail() {
      return toSdgDetail(goal);
    },
    markVisit() {
      visits += 1;
      return toSdgVisit(goal.id, visits);
    },
    runAction(action) {
      return toSdgActionResult(goal, action);
    }
  };
}

module.exports = createSdgService;
