async function handleSdgRoutes(req, res, url, deps) {
  const { sdgServices, sendJson, parseBody } = deps;
  const { pathname } = url;

  if (pathname === "/api/sdgs" && req.method === "GET") {
    sendJson(res, 200, sdgServices.getAllSummaries());
    return true;
  }

  const detailMatch = pathname.match(/^\/api\/sdgs\/(\d+)$/);
  if (detailMatch && req.method === "GET") {
    const goal = sdgServices.getById(detailMatch[1]);
    if (!goal) {
      sendJson(res, 404, { error: "Goal not found" });
      return true;
    }

    sendJson(res, 200, goal.getDetail());
    return true;
  }

  const visitMatch = pathname.match(/^\/api\/sdgs\/(\d+)\/visit$/);
  if (visitMatch && req.method === "POST") {
    const goal = sdgServices.getById(visitMatch[1]);
    if (!goal) {
      sendJson(res, 404, { error: "Goal not found" });
      return true;
    }

    sendJson(res, 200, goal.markVisit());
    return true;
  }

  const actionMatch = pathname.match(/^\/api\/sdgs\/(\d+)\/action$/);
  if (actionMatch && req.method === "POST") {
    const goal = sdgServices.getById(actionMatch[1]);
    if (!goal) {
      sendJson(res, 404, { error: "Goal not found" });
      return true;
    }

    const body = await parseBody(req);
    sendJson(res, 200, goal.runAction(body.action || "unknown"));
    return true;
  }

  return false;
}

module.exports = {
  handleSdgRoutes
};
