import { getGoalById } from "../data/sdgs.js";
import { fetchGoalDetail } from "../services/sdgService.js";
import { DetailFrame } from "./detailFrame.js";

const LEGACY_GOAL_IDS = new Set([1, 4]);

export class DetailView {
  constructor(root, options = {}) {
    this.root = root;
    this.onBack = options.onBack || (() => {});
    this.onFullscreen = options.onFullscreen || (() => {});

    this.frame = new DetailFrame(root, {
      onBack: this.onBack,
      onFullscreen: this.onFullscreen
    });

    this.legacyHost = root.querySelector("#detailLegacyHost");
    this.legacyFrame = root.querySelector("#detailLegacyFrame");
    this.panelWrap = root.querySelector(".detail-wrap");
    this.desc = root.querySelector("#detailDesc");
    this.features = root.querySelector("#detailFeatures");
    this.status = root.querySelector("#detailStatus");
  }

  mount() {
    this.frame.mount();
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data) return;
      if (!["sdg01:back-main", "sdg04:back-main", "sdg:back-main"].includes(event.data.type)) return;
      this.onBack();
    });
  }

  async waitLegacyFrameReady(timeoutMs = 2600) {
    if (!this.legacyFrame) return;
    await new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        this.legacyFrame.removeEventListener("load", onLoad);
        this.legacyFrame.removeEventListener("error", onError);
        clearTimeout(timer);
        resolve();
      };
      const onLoad = () => finish();
      const onError = () => finish();
      const timer = setTimeout(finish, timeoutMs);

      this.legacyFrame.addEventListener("load", onLoad, { once: true });
      this.legacyFrame.addEventListener("error", onError, { once: true });

      try {
        if (this.legacyFrame.contentDocument?.readyState === "complete") {
          finish();
        }
      } catch {
        // ignore
      }
    });
  }

  showLegacyGoal(goalId) {
    this.frame.setMode("legacy");
    this.frame.setGoalMeta(goalId);
    if (this.panelWrap) this.panelWrap.hidden = true;
    if (this.legacyHost) this.legacyHost.hidden = false;
    const legacySrc = `/detailed/sdg-${String(goalId).padStart(2, "0")}/index.html`;
    if (this.legacyFrame && this.legacyFrame.getAttribute("src") !== legacySrc) {
      this.legacyFrame.setAttribute("src", legacySrc);
    }
  }

  showGenericPanel() {
    this.frame.setMode("generic");
    if (this.legacyHost) this.legacyHost.hidden = true;
    if (this.panelWrap) this.panelWrap.hidden = false;
  }

  setVisible(visible) {
    this.root.classList.toggle("active", visible);
    this.root.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  setAccent(color) {
    this.frame.setAccent(color || "#101827");
  }

  reset() {
    // Reset detail state when returning to main so next entry starts fresh.
    this.showGenericPanel();
    this.frame.reset();
    if (this.desc) this.desc.textContent = "";
    if (this.features) this.features.innerHTML = "";
    if (this.status) this.status.textContent = "대기 중";

    if (this.legacyFrame) {
      this.legacyFrame.removeAttribute("src");
    }
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

  async load(goalId) {
    const id = Number(goalId);
    const base = getGoalById(id);
    this.setAccent(base?.color || "#101827");

    if (LEGACY_GOAL_IDS.has(id)) {
      this.showLegacyGoal(id);
      await this.waitLegacyFrameReady();
      return null;
    }

    this.showGenericPanel();
    const detail = await fetchGoalDetail(id);
    this.renderDetail(id, detail);
    this.status.textContent = "임시 상세(수정 가능)";
    return detail;
  }
}
