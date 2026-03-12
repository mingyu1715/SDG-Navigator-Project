function createSdgService(goal) {
  let visits = 0;

  return {
    id: goal.id,
    getSummary() {
      const { id, title, subtitle, color } = goal;
      return { id, title, subtitle, color };
    },
    getDetail() {
      return goal;
    },
    markVisit() {
      visits += 1;
      return { goalId: goal.id, visits };
    },
    runAction(action) {
      return {
        goalId: goal.id,
        action,
        message: `${goal.title}에 대한 '${action}' 액션이 처리되었습니다.`
      };
    }
  };
}

module.exports = createSdgService;
