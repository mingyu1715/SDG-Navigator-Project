import { getGoalById } from "../data/sdgs.js";
import { fetchGoalDetail } from "../services/sdgService.js";
import { DetailFrame } from "./detailFrame.js";
import {
  createCustomDetailRenderer,
  getDetailExperienceFlow,
  getDetailFrameMeta,
  getSdgSourcesForGoal,
  hasCustomDetailRenderer
} from "../details/registry.js?v=20260526-phase5";

const MIN_DETAIL_OVERLAY_MS = 1200;
const DETAIL_PANEL_VARIANT_CLASSES = [
  "detail-card-custom",
  "detail-card-sdg01",
  "detail-card-sdg02",
  "detail-card-sdg03",
  "detail-card-sdg04",
  "detail-card-sdg05",
  "detail-card-sdg06",
  "detail-card-sdg07",
  "detail-card-sdg08",
  "detail-card-sdg09",
  "detail-card-sdg10"
];
const DETAIL_ROOT_VARIANT_CLASSES = [
  "sdg01-title-hidden",
  "sdg02-title-hidden",
  "sdg02-theme",
  "sdg03-title-hidden",
  "sdg04-title-hidden",
  "sdg05-title-hidden",
  "sdg05-theme",
  "sdg06-title-hidden",
  "sdg06-theme",
  "sdg07-title-hidden",
  "sdg07-theme",
  "sdg08-title-hidden",
  "sdg08-theme",
  "sdg09-title-hidden",
  "sdg09-theme",
  "sdg10-title-hidden",
  "sdg10-theme"
];
const DETAIL_GLOBAL_ORPHAN_SELECTORS = [
  ".sdg02-rx-throw-ghost",
  'script[data-sdg01-three-script="true"]'
];
const CONCEPT_LABEL_TEXT = "이 SDG는 무엇인가";
const EXPERIENCE_FLOW_LABEL_TEXT = "체험 흐름";
const SOURCE_PANEL_TITLE = "출처와 수치 성격";
const SOURCE_PANEL_NOTE = "체험용 항목은 실제 통계값이 아니라 교육용 모델 또는 시각화입니다.";
const SOURCE_TYPE_LABELS = Object.freeze({
  official: "공식 자료",
  derived: "환산/참고",
  simulation: "체험용"
});
const EXPERIENCE_FLOW_ANCHOR_SELECTORS = new Map([
  [1, '[data-role="targetReadout"]'],
  [2, ".sdg02-rx-intro-lead"],
  [3, ".sdg03-hero-lead"],
  [4, ".sdg04-lead"],
  [5, '[data-role="countryHint"]'],
  [6, ".sdg06-input-copy"],
  [7, ".sdg07-master-meta"],
  [8, ".sdg08-copy"]
]);

function hasKoreanText(text) {
  return /[가-힣]/.test(String(text || ""));
}

function toGoalClassPrefix(goalId) {
  return `sdg${String(Number(goalId)).padStart(2, "0")}`;
}

function findCustomLead(customContent, goalId) {
  const prefix = toGoalClassPrefix(goalId);
  return customContent?.querySelector(`.${prefix}-lead, .${prefix}-hero-lead, .${prefix}-rx-intro-lead`) || null;
}

function findExperienceFlowAnchor(customContent, goalId) {
  const id = Number(goalId);
  const anchorSelector = EXPERIENCE_FLOW_ANCHOR_SELECTORS.get(id);
  if (anchorSelector) {
    return customContent?.querySelector(anchorSelector) || null;
  }
  return findCustomLead(customContent, id);
}

function createSourceTypeLabel(type) {
  return SOURCE_TYPE_LABELS[type] || "자료";
}

function createSourceSummary(sources) {
  const counts = sources.reduce((summary, source) => {
    const type = source?.type || "";
    summary[type] = (summary[type] || 0) + 1;
    return summary;
  }, {});

  return ["official", "derived", "simulation"]
    .filter((type) => counts[type])
    .map((type) => `${createSourceTypeLabel(type)} ${counts[type]}개`)
    .join(" · ");
}

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

  clearPanelVariantClasses() {
    if (!this.panel) return;
    this.panel.classList.remove(...DETAIL_PANEL_VARIANT_CLASSES);
  }

  clearRootVariantClasses() {
    this.root.classList.remove(...DETAIL_ROOT_VARIANT_CLASSES);
  }

  removeGlobalOrphans() {
    DETAIL_GLOBAL_ORPHAN_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        node.parentNode?.removeChild(node);
      });
    });
  }

  cleanupRendererEnvironment() {
    this.clearPanelVariantClasses();
    this.clearRootVariantClasses();
    this.removeGlobalOrphans();
  }

  showGenericPanel() {
    this.frame.setMode("generic");
    if (this.panelWrap) this.panelWrap.hidden = false;
    this.cleanupRendererEnvironment();
    if (this.genericContent) this.genericContent.hidden = false;
    if (this.customContent) this.customContent.hidden = true;
  }

  showCustomPanel(renderer) {
    this.frame.setMode(renderer?.frameMode || "generic");
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.panel) {
      this.clearPanelVariantClasses();
      this.panel.classList.add("detail-card-custom");
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
    this.root.style.visibility = visible ? "visible" : "hidden";
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
    const renderer = this.activeCustomRenderer;
    this.activeCustomRenderer = null;
    try {
      if (typeof renderer.destroy === "function") {
        renderer.destroy();
      }
    } finally {
      this.cleanupRendererEnvironment();
    }
  }

  showCustomLoading(goalId, baseGoal) {
    this.frame.setMode("immersive");
    if (this.panelWrap) this.panelWrap.hidden = false;
    if (this.panel) {
      this.clearPanelVariantClasses();
      this.panel.classList.add("detail-card-custom");
    }
    this.clearRootVariantClasses();
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
    return createCustomDetailRenderer(id, this.customContent);
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
    this.enhanceCustomReadability(goalId);
    this.appendSourceTrustPanel(goalId);
    return true;
  }

  enhanceCustomReadability(goalId) {
    const id = String(Number(goalId)).padStart(2, "0");
    const title = this.customContent?.querySelector(`.sdg${id}-title`);
    const subtitle = this.customContent?.querySelector(`.sdg${id}-subtitle`);
    const lead = findCustomLead(this.customContent, goalId);

    if (title && subtitle) {
      const titleText = title.textContent.trim();
      const subtitleText = subtitle.textContent.trim();
      if (!hasKoreanText(titleText) && hasKoreanText(subtitleText)) {
        title.textContent = subtitleText;
        subtitle.textContent = titleText;
      }
    }

    if (lead && !lead.previousElementSibling?.classList.contains("detail-concept-label")) {
      const conceptLabel = document.createElement("p");
      conceptLabel.className = "detail-concept-label";
      conceptLabel.textContent = CONCEPT_LABEL_TEXT;
      lead.parentNode?.insertBefore(conceptLabel, lead);
    }

    const flowText = getDetailExperienceFlow(goalId);
    const flowAnchor = findExperienceFlowAnchor(this.customContent, goalId);
    if (!flowText || !flowAnchor || this.customContent?.querySelector(".detail-experience-flow")) return;

    const flow = document.createElement("p");
    const label = document.createElement("strong");
    flow.className = "detail-experience-flow";
    label.textContent = EXPERIENCE_FLOW_LABEL_TEXT;
    flow.append(label, document.createTextNode(` ${flowText}`));
    flowAnchor.insertAdjacentElement("afterend", flow);
  }

  appendSourceTrustPanel(goalId) {
    if (!this.customContent || this.customContent.querySelector(".detail-source-panel")) return;

    const sources = getSdgSourcesForGoal(goalId);
    if (!sources.length) return;

    const panel = document.createElement("section");
    panel.className = "detail-source-panel";
    panel.setAttribute("aria-label", "자료 기준과 출처");

    const overline = document.createElement("p");
    overline.className = "detail-source-overline";
    overline.textContent = "자료 기준";

    const title = document.createElement("h3");
    title.className = "detail-source-title";
    title.textContent = SOURCE_PANEL_TITLE;

    const summary = document.createElement("p");
    summary.className = "detail-source-summary";
    summary.textContent = createSourceSummary(sources);

    const hasSimulation = sources.some((source) => source.type === "simulation");
    const note = document.createElement("p");
    note.className = "detail-source-note";
    note.textContent = hasSimulation
      ? SOURCE_PANEL_NOTE
      : "아래 자료를 기준으로 상세 콘텐츠의 맥락을 구성했습니다.";

    const list = document.createElement("div");
    list.className = "detail-source-list";

    sources.forEach((source) => {
      const item = document.createElement(source.url ? "a" : "article");
      item.className = "detail-source-item";
      if (source.url) {
        item.href = source.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      }

      const type = document.createElement("span");
      type.className = `detail-source-type is-${source.type || "unknown"}`;
      type.textContent = createSourceTypeLabel(source.type);

      const name = document.createElement("strong");
      name.className = "detail-source-name";
      name.textContent = source.name || "자료";

      const detail = document.createElement("span");
      detail.className = "detail-source-detail";
      detail.textContent = source.detail || "세부 설명 없음";

      item.append(type, name, detail);
      list.appendChild(item);
    });

    panel.append(overline, title, summary, note, list);
    this.customContent.appendChild(panel);
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
