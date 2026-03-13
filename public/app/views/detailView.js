import { getGoalById } from "../data/sdgs.js";
import { fetchGoalDetail } from "../services/sdgService.js";

export class DetailView {
  constructor(root, options = {}) {
    this.root = root;
    this.onBack = options.onBack || (() => {});

    this.backBtn = root.querySelector("#detailBackBtn");
    this.legacyHost = root.querySelector("#detailLegacyHost");
    this.legacyFrame = root.querySelector("#detailLegacyFrame");
    this.panelWrap = root.querySelector(".detail-wrap");
    this.goalLabel = root.querySelector("#detailGoalLabel");
    this.title = root.querySelector("#detailTitle");
    this.sub = root.querySelector("#detailSub");
    this.badge = root.querySelector("#detailGoalBadge");
    this.desc = root.querySelector("#detailDesc");
    this.features = root.querySelector("#detailFeatures");
    this.status = root.querySelector("#detailStatus");
  }

  mount() {
    this.backBtn.addEventListener("click", () => this.onBack());
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.type !== "sdg01:back-main") return;
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

  showLegacy01() {
    if (this.panelWrap) this.panelWrap.hidden = true;
    if (this.legacyHost) this.legacyHost.hidden = false;
    // Keep SPA back button visible so returning to main stays in-app (no reload).
    if (this.backBtn) this.backBtn.hidden = false;
    if (this.legacyFrame && this.legacyFrame.getAttribute("src") !== "/detailed/sdg-01/index.html") {
      this.legacyFrame.setAttribute("src", "/detailed/sdg-01/index.html");
    }
  }

  showGenericPanel() {
    if (this.legacyHost) this.legacyHost.hidden = true;
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.backBtn) this.backBtn.hidden = false;
  }

  setVisible(visible) {
    this.root.classList.toggle("active", visible);
    this.root.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  setAccent(color) {
    this.root.style.setProperty("--detail-accent", color || "#101827");
    if (this.badge) {
      this.badge.style.background = color || "#101827";
    }
  }

  renderDetail(goalId, detail) {
    this.showGenericPanel();
    this.goalLabel.textContent = `SDG GOAL ${String(goalId).padStart(2, "0")}`;
    this.title.textContent = detail.title || `SDG ${String(goalId).padStart(2, "0")}`;
    this.sub.textContent = detail.subtitle || "";
    if (this.badge) this.badge.textContent = String(goalId);
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
    if (Number(goalId) === 1) {
      this.showLegacy01();
      await this.waitLegacyFrameReady();
      return null;
    }

    this.showGenericPanel();
    const base = getGoalById(goalId);
    if (base) this.setAccent(base.color);
    const detail = await fetchGoalDetail(goalId);
    this.renderDetail(goalId, detail);
    this.status.textContent = "임시 상세(수정 가능)";
    return detail;
  }
}
