import { getGoalById } from "../data/sdgs.js";
import { fetchGoalDetail } from "../services/sdgService.js";
import { DetailFrame } from "./detailFrame.js";
import {
  createCustomDetailRenderer,
  getDetailFrameMeta,
  hasCustomDetailRenderer
} from "../details/registry.js";

const MIN_DETAIL_OVERLAY_MS = 1200;

export class DetailView {
  constructor(root, options = {}) {
    this.root = root;
    this.onBack = options.onBack || (() => {});
    this.onFullscreen = options.onFullscreen || (() => {});

    this.frame = new DetailFrame(root, {
      onBack: this.onBack,
      onFullscreen: this.onFullscreen
    });

    this.panelWrap = root.querySelector(".detail-wrap");
    this.panel = root.querySelector("#detailPanel");
    this.genericContent = root.querySelector("#detailGenericContent");
    this.customContent = root.querySelector("#detailCustomContent");
    this.desc = root.querySelector("#detailDesc");
    this.features = root.querySelector("#detailFeatures");
    this.status = root.querySelector("#detailStatus");
    this.activeCustomRenderer = null;
    this.customRendererCache = new Map();
    this.loadVersion = 0;
    this.loadingOverlay = null;
    this.loadingToken = 0;
    this.loadingShownAt = 0;
  }

  mount() {
    this.frame.mount();
    this.ensureLoadingOverlay();
  }

  ensureLoadingOverlay() {
    if (this.loadingOverlay && this.loadingOverlay.isConnected) return this.loadingOverlay;
    const existing = this.root.querySelector(".detail-loading-overlay");
    if (existing) {
      this.loadingOverlay = existing;
      return existing;
    }

    const overlay = document.createElement("div");
    overlay.className = "detail-loading-overlay is-hidden";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-label", "상세 콘텐츠 로딩 중");
    overlay.innerHTML = `
      <div class="detail-loading-overlay-spinner" aria-hidden="true"></div>
      <p class="detail-loading-overlay-text">세부 정보를 불러오는 중...</p>
    `;
    this.root.appendChild(overlay);
    this.loadingOverlay = overlay;
    return overlay;
  }

  showLoadingOverlay() {
    const overlay = this.ensureLoadingOverlay();
    const token = ++this.loadingToken;
    this.loadingShownAt = performance.now();
    overlay.classList.remove("is-hidden");
    overlay.classList.add("is-active");
    return token;
  }

  async hideLoadingOverlay(token) {
    if (!this.loadingOverlay) return;
    if (token !== this.loadingToken) return;

    const elapsed = performance.now() - this.loadingShownAt;
    const remain = Math.max(0, MIN_DETAIL_OVERLAY_MS - elapsed);
    if (remain > 0) {
      await new Promise((resolve) => setTimeout(resolve, remain));
    }
    if (token !== this.loadingToken) return;

    this.loadingOverlay.classList.remove("is-active");
    this.loadingOverlay.classList.add("is-hidden");
  }

  hideLoadingOverlayNow() {
    if (!this.loadingOverlay) return;
    this.loadingToken += 1;
    this.loadingOverlay.classList.remove("is-active");
    this.loadingOverlay.classList.add("is-hidden");
  }

  showGenericPanel() {
    this.frame.setMode("generic");
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.panel) {
      this.panel.classList.remove("detail-card-custom");
      this.panel.classList.remove("detail-card-sdg01");
      this.panel.classList.remove("detail-card-sdg02");
      this.panel.classList.remove("detail-card-sdg03");
      this.panel.classList.remove("detail-card-sdg04");
    }
    if (this.genericContent) this.genericContent.hidden = false;
    if (this.customContent) this.customContent.hidden = true;
  }

  showCustomPanel(renderer) {
    this.frame.setMode(renderer?.frameMode || "generic");
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.panel) {
      this.panel.classList.add("detail-card-custom");
      this.panel.classList.remove("detail-card-sdg01");
      this.panel.classList.remove("detail-card-sdg02");
      this.panel.classList.remove("detail-card-sdg03");
      this.panel.classList.remove("detail-card-sdg04");
      if (renderer && renderer.panelClass) {
        this.panel.classList.add(renderer.panelClass);
      }
    }
    if (this.genericContent) this.genericContent.hidden = true;
    if (this.customContent) this.customContent.hidden = false;
    this.activeCustomRenderer = renderer;
  }

  setVisible(visible) {
    this.root.classList.toggle("active", visible);
    this.root.setAttribute("aria-hidden", visible ? "false" : "true");
    if (visible) {
      this.root.scrollTop = 0;
    }
  }

  setAccent(color) {
    this.frame.setAccent(color || "#101827");
  }

  reset() {
    this.loadVersion += 1;
    // Reset detail state when returning to main so next entry starts fresh.
    this.destroyActiveCustomRenderer();
    this.hideLoadingOverlayNow();
    this.showGenericPanel();
    this.frame.reset();
    this.root.removeAttribute("aria-busy");
    this.root.scrollTop = 0;
    if (this.desc) this.desc.textContent = "";
    if (this.features) this.features.innerHTML = "";
    if (this.status) this.status.textContent = "대기 중";
  }

  renderDetail(goalId, detail) {
    this.showGenericPanel();
    this.frame.setGoalMeta(goalId, detail);
    this.desc.textContent = detail.description || "설명 정보가 없습니다.";
    this.features.innerHTML = "";

    const featureList = Array.isArray(detail.features) && detail.features.length
      ? detail.features
      : ["세부 포인트 정보가 없습니다."];

    featureList.forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      this.features.appendChild(li);
    });

    this.status.textContent = "표시 완료";
  }

  destroyActiveCustomRenderer() {
    if (!this.activeCustomRenderer) return;
    if (typeof this.activeCustomRenderer.destroy === "function") {
      this.activeCustomRenderer.destroy();
    }
    this.activeCustomRenderer = null;
  }

  showCustomLoading(goalId, baseGoal) {
    this.frame.setMode("immersive");
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.panel) {
      this.panel.classList.add("detail-card-custom");
      this.panel.classList.remove("detail-card-sdg01");
      this.panel.classList.remove("detail-card-sdg02");
      this.panel.classList.remove("detail-card-sdg03");
      this.panel.classList.remove("detail-card-sdg04");
    }
    if (this.genericContent) this.genericContent.hidden = true;
    if (this.customContent) {
      this.customContent.hidden = false;
      this.customContent.innerHTML = `
        <div class="detail-custom-loading" role="status" aria-live="polite" aria-label="상세 콘텐츠 로딩 중">
          <div class="detail-custom-loading-spinner" aria-hidden="true"></div>
          <p class="detail-custom-loading-text">체험 콘텐츠를 준비하고 있습니다...</p>
        </div>
      `;
    }
    this.frame.setGoalMeta(goalId, getDetailFrameMeta(goalId, baseGoal));
  }

  async getCustomRenderer(goalId) {
    const id = Number(goalId);
    if (this.customRendererCache.has(id)) {
      return this.customRendererCache.get(id);
    }

    const renderer = await createCustomDetailRenderer(id, this.customContent);
    if (!renderer) return null;
    this.customRendererCache.set(id, renderer);
    return renderer;
  }

  async renderCustomDetail(goalId, baseGoal, loadVersion) {
    if (!hasCustomDetailRenderer(goalId)) return false;

    this.destroyActiveCustomRenderer();
    this.showCustomLoading(goalId, baseGoal);

    const renderer = await this.getCustomRenderer(goalId);
    if (!renderer) return false;
    if (loadVersion !== this.loadVersion) return true;

    this.destroyActiveCustomRenderer();
    this.showCustomPanel(renderer);
    this.frame.setGoalMeta(goalId, getDetailFrameMeta(goalId, baseGoal));
    await Promise.resolve(renderer.render());
    if (loadVersion !== this.loadVersion) return true;
    return true;
  }

  async load(goalId) {
    const loadVersion = ++this.loadVersion;
    const loadingToken = this.showLoadingOverlay();
    const id = Number(goalId);
    const base = getGoalById(id);
    this.setAccent(base?.color || "#101827");
    this.root.setAttribute("aria-busy", "true");

    try {
      if (await this.renderCustomDetail(id, base, loadVersion)) {
        return { custom: true };
      }

      this.showGenericPanel();
      const detail = await fetchGoalDetail(id);
      if (loadVersion !== this.loadVersion) {
        return { cancelled: true };
      }
      this.renderDetail(id, detail);
      this.status.textContent = "임시 상세(수정 가능)";
      return detail;
    } finally {
      await this.hideLoadingOverlay(loadingToken);
      if (loadVersion === this.loadVersion) {
        this.root.setAttribute("aria-busy", "false");
      }
    }
  }
}
