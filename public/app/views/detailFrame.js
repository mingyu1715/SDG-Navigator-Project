import { getGoalById } from "../data/sdgs.js";

function toGoalText(goalId) {
  return String(goalId).padStart(2, "0");
}

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

    if (this.backBtn) this.backBtn.hidden = isLegacy;
    if (this.pageMark) this.pageMark.hidden = isLegacy;
    if (this.header) this.header.hidden = isLegacy;
    if (this.actions) this.actions.hidden = isLegacy;
  }

  setGoalMeta(goalId, detail = null) {
    const id = Number(goalId);
    const goal = getGoalById(id);
    const goalText = toGoalText(id);

    const koreanTitle = detail?.subtitle || goal?.sub || detail?.title || goal?.title || `목표 ${goalText}`;
    const englishSubtitle = detail?.title || goal?.title || `SDG GOAL ${goalText}`;

    if (this.goalLabel) this.goalLabel.textContent = `SDG GOAL ${goalText}`;
    if (this.title) this.title.textContent = koreanTitle;
    if (this.sub) this.sub.textContent = englishSubtitle;
    if (this.badge) this.badge.textContent = String(id);
  }

  reset() {
    this.setMode("generic");
    if (this.goalLabel) this.goalLabel.textContent = "SDG GOAL";
    if (this.title) this.title.textContent = "불러오는 중...";
    if (this.sub) this.sub.textContent = "상세 정보를 준비 중입니다.";
    if (this.badge) this.badge.textContent = "-";
    this.setAccent("#101827");
  }
}
