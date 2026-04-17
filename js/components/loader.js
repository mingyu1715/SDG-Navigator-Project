let loaderEl = null;

function createLoader() {
  const el = document.createElement("div");
  el.id = "appLoaderOverlay";
  el.className = "app-loader is-hidden";
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-label", "Loading");
  el.innerHTML = `
    <div class="app-loader-inner">
      <div class="app-loader-spinner" aria-hidden="true"></div>
      <p class="app-loader-text">Loading...</p>
    </div>
  `;
  document.body.appendChild(el);
  return el;
}

export function ensureLoader() {
  if (loaderEl && loaderEl.isConnected) return loaderEl;
  loaderEl = document.getElementById("appLoaderOverlay") || createLoader();
  return loaderEl;
}

export function showLoader() {
  const el = ensureLoader();
  el.classList.remove("is-hidden", "is-leaving");
  el.classList.add("is-active");
}

export function hideLoader() {
  const el = ensureLoader();
  el.classList.remove("is-active");
  el.classList.add("is-leaving");
  window.setTimeout(() => {
    el.classList.add("is-hidden");
    el.classList.remove("is-leaving");
  }, 360);
}

