import { getGoalById } from "../data/sdgs.js";
import { toDetailFrameViewModel } from "../data/sdgViewAdapters.js";

export class DetailFrame {
  constructor(root, options = {}) {
    this.root = root;
    this.onBack = options.onBack || (() => {});
    this.onFullscreen = options.onFullscreen || (() => {});

    this.backBtn = root.querySelector("#detailBackBtn");
    this.pageMark = root.querySelector(".detail-page-mark");
    this.header = root.querySelector("#detailFrameHeader");
    this.actions = root.querySelector(".detail-actions");
    this.fullscreenBtn = root.querySelector("#detailFullscreenBtn");
    this.goalLabel = root.querySelector("#detailGoalLabel");
    this.title = root.querySelector("#detailTitle");
    this.sub = root.querySelector("#detailSub");
    this.lead = root.querySelector("#detailLead");
    this.hint = root.querySelector("#detailHint");
    this.badge = root.querySelector("#detailGoalBadge");
    this.mode = "generic";
  }

  mount() {
    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.onBack());
    }
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener("click", () => this.onFullscreen());
    }
  }

  setAccent(color) {
    const accent = color || "#101827";
    this.root.style.setProperty("--detail-accent", accent);
    if (this.badge) {
      this.badge.style.background = accent;
    }
  }

  setMode(mode = "generic") {
    this.mode = mode;
    const isLegacy = mode === "legacy";
    const isImmersive = mode === "immersive";

    // Keep global navigation controls visible across all detail modes.
    if (this.backBtn) this.backBtn.hidden = false;
    if (this.pageMark) this.pageMark.hidden = false;
    if (this.actions) this.actions.hidden = false;
    if (this.header) this.header.hidden = isLegacy;
    this.root.classList.toggle("detail-mode-immersive", isImmersive);
  }

  setGoalMeta(goalId, detail = null) {
    const id = Number(goalId);
    const goal = getGoalById(id);
    const frameView = toDetailFrameViewModel(id, goal, detail);

    if (this.goalLabel) this.goalLabel.textContent = frameView.goalLabel;
    if (this.title) this.title.textContent = frameView.title;
    if (this.sub) this.sub.textContent = frameView.subtitle;
    if (this.lead) this.lead.textContent = frameView.lead;
    if (this.hint) this.hint.textContent = frameView.hint;
    if (this.badge) this.badge.textContent = frameView.badge;
  }

  reset() {
    this.setMode("generic");
    if (this.goalLabel) this.goalLabel.textContent = "SDG GOAL";
    if (this.title) this.title.textContent = "불러오는 중...";
    if (this.sub) this.sub.textContent = "상세 정보를 준비 중입니다.";
    if (this.lead) this.lead.textContent = "핵심 배경과 맥락을 불러오는 중입니다.";
    if (this.hint) this.hint.textContent = "잠시만 기다려 주세요";
    if (this.badge) this.badge.textContent = "-";
    this.setAccent("#101827");
  }
}
