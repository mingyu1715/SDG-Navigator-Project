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

    if (this.backBtn) this.backBtn.hidden = isLegacy;
    if (this.pageMark) this.pageMark.hidden = isLegacy;
    if (this.header) this.header.hidden = isLegacy;
    if (this.actions) this.actions.hidden = isLegacy;
    this.root.classList.toggle("detail-mode-immersive", isImmersive);
  }

  setGoalMeta(goalId, detail = null) {
    const id = Number(goalId);
    const goal = getGoalById(id);
    const goalText = toGoalText(id);

    const koreanTitle = detail?.subtitle || goal?.sub || detail?.title || goal?.title || `목표 ${goalText}`;
    const englishSubtitle = detail?.title || goal?.title || `SDG GOAL ${goalText}`;
    const leadText = detail?.lead || detail?.description || "목표의 핵심 맥락을 확인해보세요.";
    const hintText = detail?.hint || "아래 콘텐츠에서 상세 정보를 확인하세요.";

    if (this.goalLabel) this.goalLabel.textContent = `SDG GOAL ${goalText}`;
    if (this.title) this.title.textContent = koreanTitle;
    if (this.sub) this.sub.textContent = englishSubtitle;
    if (this.lead) this.lead.textContent = leadText;
    if (this.hint) this.hint.textContent = hintText;
    if (this.badge) this.badge.textContent = String(id);
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
