const listeners = new Set();

function normalizePath(pathname) {
  if (!pathname || pathname === "/index.html") return "/";
  return pathname;
}

export function parseRoute(pathname = window.location.pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return { name: "main", path };

  const detailMatch = path.match(/^\/detailed\/sdg-(\d{2})\/?$/);
  if (detailMatch) {
    return { name: "detail", goalId: Number(detailMatch[1]), path: `/detailed/sdg-${detailMatch[1]}/` };
  }

  const legacyDetailMatch = path.match(/^\/detailed\/sdg-(\d{2})\/index\.html$/);
  if (legacyDetailMatch) {
    return { name: "detail", goalId: Number(legacyDetailMatch[1]), path: `/detailed/sdg-${legacyDetailMatch[1]}/` };
  }

  return { name: "main", path: "/" };
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitRoute(route) {
  listeners.forEach((listener) => listener(route));
}

export function startRouter() {
  window.addEventListener("popstate", () => {
    emitRoute(parseRoute(window.location.pathname));
  });
}

export function navigate(path, options = {}) {
  const { replace = false, emit = true, state = {} } = options;
  const method = replace ? "replaceState" : "pushState";
  history[method](state, "", path);
  if (emit) {
    emitRoute(parseRoute(path));
  }
}
