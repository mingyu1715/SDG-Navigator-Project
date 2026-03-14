const listeners = new Set();
const MAIN_PATH = "/";
const DETAIL_ROUTE_RE = /^\/detailed\/sdg-(\d{2})(?:\/|\/index\.html)?$/;

function normalizePath(inputPath) {
  if (!inputPath) return MAIN_PATH;

  let path = String(inputPath);
  try {
    if (/^https?:\/\//.test(path)) {
      path = new URL(path).pathname;
    }
  } catch {
    // ignore malformed absolute URL inputs
  }

  path = path.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  path = path.replace(/\/{2,}/g, "/");

  if (path === "/index.html") {
    return MAIN_PATH;
  }

  return path;
}

export function parseRoute(pathname = window.location.pathname) {
  const path = normalizePath(pathname);
  if (path === MAIN_PATH) return { name: "main", path: MAIN_PATH };

  const detailMatch = path.match(DETAIL_ROUTE_RE);
  if (detailMatch) {
    const goalIdText = detailMatch[1];
    return { name: "detail", goalId: Number(goalIdText), path: `/detailed/sdg-${goalIdText}/` };
  }

  return { name: "main", path: MAIN_PATH, redirectedFrom: path };
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitRoute(route) {
  listeners.forEach((listener) => listener(route));
}

export function startRouter() {
  const onPopState = () => {
    emitRoute(parseRoute(window.location.pathname));
  };

  window.addEventListener("popstate", onPopState);
  return () => {
    window.removeEventListener("popstate", onPopState);
  };
}

export function navigate(path, options = {}) {
  const { replace = false, emit = true, state = {} } = options;
  const route = parseRoute(path);
  const canonicalPath = route.path;
  const currentPath = normalizePath(window.location.pathname);
  const method = replace || currentPath === canonicalPath ? "replaceState" : "pushState";

  history[method](state, "", canonicalPath);
  if (emit) {
    emitRoute(route);
  }

  return route;
}
