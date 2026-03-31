import { getGoalById } from "../data/sdgs.js";
import { fetchGoalDetail } from "../services/sdgService.js";
import { DetailFrame } from "./detailFrame.js";
import { createCustomDetailRenderers, getDetailFrameMeta } from "../details/registry.js";

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
    this.customRenderers = createCustomDetailRenderers(this.customContent);
  }

  mount() {
    this.frame.mount();
  }

  showGenericPanel() {
    this.frame.setMode("generic");
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.panel) {
      this.panel.classList.remove("detail-card-custom");
      this.panel.classList.remove("detail-card-sdg01");
      this.panel.classList.remove("detail-card-sdg02");
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
    // Reset detail state when returning to main so next entry starts fresh.
    this.destroyActiveCustomRenderer();
    this.showGenericPanel();
    this.frame.reset();
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

  async renderCustomDetail(goalId, baseGoal) {
    const renderer = this.customRenderers.get(goalId);
    if (!renderer) return false;
    this.destroyActiveCustomRenderer();
    this.showCustomPanel(renderer);
    this.frame.setGoalMeta(goalId, getDetailFrameMeta(goalId, baseGoal));
    await Promise.resolve(renderer.render());
    return true;
  }

  async load(goalId) {
    const id = Number(goalId);
    const base = getGoalById(id);
    this.setAccent(base?.color || "#101827");

    if (await this.renderCustomDetail(id, base)) {
      return { custom: true };
    }

    this.showGenericPanel();
    const detail = await fetchGoalDetail(id);
    this.renderDetail(id, detail);
    this.status.textContent = "임시 상세(수정 가능)";
    return detail;
  }
}
