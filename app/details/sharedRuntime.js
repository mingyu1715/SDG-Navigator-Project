export function toggleDetailViewClass(host, className, active) {
  const detailRoot = host?.closest("#detailView");
  if (!detailRoot) return;
  detailRoot.classList.toggle(className, Boolean(active));
}

export async function loadJsonData(url, fallback, isValid = (data) => Boolean(data)) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!isValid(data)) throw new Error("Invalid JSON");
    return data;
  } catch {
    return fallback;
  }
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function clearStepMotionTimers(timers, host, selector, activeClass = "in-view") {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.length = 0;
  if (!host) return;
  host.querySelectorAll(selector).forEach((step) => step.classList.remove(activeClass));
}

export function scheduleStepMotion(timers, host, selector, staggerMs, activeClass = "in-view") {
  clearStepMotionTimers(timers, host, selector, activeClass);
  if (!host) return;

  const steps = host.querySelectorAll(selector);
  if (!steps.length) return;

  steps.forEach((step, idx) => {
    const timer = window.setTimeout(() => {
      step.classList.add(activeClass);
    }, idx * staggerMs);
    timers.push(timer);
  });
}
