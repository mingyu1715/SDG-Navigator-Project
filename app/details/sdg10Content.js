import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG10_COUNT_ANIMATION_MS,
  SDG10_DEFAULT_TOP1_SHARE,
  SDG10_GROUPS,
  SDG10_MAX_TOP1_SHARE,
  SDG10_MIN_TOP1_SHARE,
  SDG10_SOURCE,
  SDG10_STAGE_IDEAL,
  SDG10_STAGE_REALITY,
  calculateSdg10IdealDistribution,
  clampSdg10Share,
  createSdg10InitialState,
  formatSdg10Delta,
  formatSdg10Percent,
  getSdg10ComparisonRows,
  getSdg10RealityDistribution,
  toSdg10CakeSegments
} from "./sdg10ContentModel.js";

const SDG10_REALITY_COPY = "상위 1%는 전 세계 순자산의 37.8%를 차지하고, 하위 50%는 2.0%만 나눠 갖습니다.";
const SDG10_IDEAL_COPY = "슬라이더로 당신이 생각하는 상위 1%의 적정 몫을 정해보세요.";

function renderSdg10Legend() {
  return SDG10_GROUPS.map((group) => {
    return `
      <div class="sdg10-legend-item">
        <span class="sdg10-legend-swatch" style="--sdg10-swatch:${escapeHtml(group.color)}"></span>
        <span class="sdg10-legend-label">${escapeHtml(group.label)}</span>
        <strong class="sdg10-legend-value" data-share-value="${escapeHtml(group.key)}">0.0%</strong>
      </div>
    `;
  }).join("");
}

function renderSdg10ComparisonRows() {
  return getSdg10ComparisonRows(calculateSdg10IdealDistribution(SDG10_DEFAULT_TOP1_SHARE))
    .map((row) => {
      return `
        <article class="sdg10-compare-row" data-compare-row="${escapeHtml(row.key)}">
          <p class="sdg10-compare-label">${escapeHtml(row.label)}</p>
          <div class="sdg10-compare-values">
            <span>
              <small>내 분배</small>
              <strong data-user-value="${escapeHtml(row.key)}">0.0%</strong>
            </span>
            <span>
              <small>현실</small>
              <strong data-reality-value="${escapeHtml(row.key)}">0.0%</strong>
            </span>
            <span>
              <small>차이</small>
              <strong data-delta-value="${escapeHtml(row.key)}">0.0%p</strong>
            </span>
          </div>
        </article>
      `;
    })
    .join("");
}

export class Sdg10DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg10";
    this.frameMode = "generic";

    this.refs = {};
    this.state = createSdg10InitialState();
    this.userDistribution = this.state.distribution;
    this.countRafId = null;
    this.disposeRequested = false;
    this.reduceMotion = false;
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg10-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg10-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg10-exp" data-role="root" data-stage="${SDG10_STAGE_IDEAL}">
        <div class="sdg10-bg" aria-hidden="true">
          <span class="sdg10-bg-ring is-1"></span>
          <span class="sdg10-bg-ring is-2"></span>
          <span class="sdg10-bg-line is-1"></span>
          <span class="sdg10-bg-line is-2"></span>
        </div>

        <main class="sdg10-stage" aria-labelledby="sdg10Title">
          <section class="sdg10-hero">
            <p class="sdg10-goal-label">SDG GOAL 10</p>
            <h3 id="sdg10Title" class="sdg10-title">The Wealth Cake</h3>
            <p class="sdg10-subtitle">부의 케이크 나누기</p>
            <p class="sdg10-lead">공정하다고 생각한 분배와 현실의 자산 분포가 얼마나 다른지 직접 비교합니다.</p>
          </section>

          <section class="sdg10-cake-zone" aria-label="자산 분배 케이크 시각화">
            <div class="sdg10-cake-board">
              <div class="sdg10-cake-shadow" aria-hidden="true"></div>
              <div class="sdg10-cake" data-role="cake">
                <div class="sdg10-cake-side"></div>
                <div class="sdg10-cake-top">
                  <div class="sdg10-cake-shine"></div>
                  <span class="sdg10-cake-label is-top">상위 1%</span>
                  <span class="sdg10-cake-label is-bottom">하위 50%</span>
                </div>
              </div>
              <div class="sdg10-crumb-layer" aria-hidden="true">
                <span class="sdg10-crumb is-1"></span>
                <span class="sdg10-crumb is-2"></span>
                <span class="sdg10-crumb is-3"></span>
                <span class="sdg10-crumb is-4"></span>
                <span class="sdg10-crumb is-5"></span>
                <span class="sdg10-crumb is-6"></span>
              </div>
            </div>
            <div class="sdg10-legend" data-role="legend">
              ${renderSdg10Legend()}
            </div>
          </section>

          <section class="sdg10-control-panel" aria-label="공정한 분배 입력">
            <div class="sdg10-control">
              <div class="sdg10-panel-head">
                <p class="sdg10-kicker">Your Estimate</p>
                <strong class="sdg10-share-readout" data-role="shareReadout">${formatSdg10Percent(SDG10_DEFAULT_TOP1_SHARE)}</strong>
              </div>
              <label class="sdg10-slider-label" for="sdg10ShareRange">상위 1%의 몫</label>
              <input
                id="sdg10ShareRange"
                class="sdg10-range"
                data-role="shareRange"
                type="range"
                min="${SDG10_MIN_TOP1_SHARE}"
                max="${SDG10_MAX_TOP1_SHARE}"
                step="1"
                value="${SDG10_DEFAULT_TOP1_SHARE}"
                aria-label="상위 1%의 적정 자산 몫"
              />
              <div class="sdg10-range-meta" aria-hidden="true">
                <span>1%</span>
                <span>60%</span>
              </div>
              <p class="sdg10-state-copy" data-role="stateCopy">${SDG10_IDEAL_COPY}</p>
              <div class="sdg10-actions">
                <button type="button" class="sdg10-primary-btn" data-role="realityButton">현실 보기</button>
                <button type="button" class="sdg10-secondary-btn" data-role="resetButton">다시 나누기</button>
              </div>
            </div>
          </section>

          <section class="sdg10-compare" aria-label="내 분배와 현실 비교">
            <div class="sdg10-panel-head">
              <p class="sdg10-kicker">Comparison</p>
              <span class="sdg10-source-chip">2021 global wealth</span>
            </div>
            <div class="sdg10-compare-list" data-role="compareList">
              ${renderSdg10ComparisonRows()}
            </div>
            <p class="sdg10-source">
              Source:
              <a href="${escapeHtml(SDG10_SOURCE.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(SDG10_SOURCE.name)}</a>,
              ${escapeHtml(SDG10_SOURCE.detail)}
            </p>
          </section>
        </main>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);

    this.refs = {
      root: get("root"),
      cake: get("cake"),
      shareRange: get("shareRange"),
      shareReadout: get("shareReadout"),
      stateCopy: get("stateCopy"),
      realityButton: get("realityButton"),
      resetButton: get("resetButton")
    };

    this.refs.shareValues = Array.from(this.host.querySelectorAll("[data-share-value]"));
    this.refs.userValues = Array.from(this.host.querySelectorAll("[data-user-value]"));
    this.refs.realityValues = Array.from(this.host.querySelectorAll("[data-reality-value]"));
    this.refs.deltaValues = Array.from(this.host.querySelectorAll("[data-delta-value]"));
  }

  bindEvents() {
    if (this.refs.shareRange) {
      this.refs.shareRange.addEventListener("input", () => {
        this.updateIdealShare(this.refs.shareRange.value);
      });
    }

    if (this.refs.realityButton) {
      this.refs.realityButton.addEventListener("click", () => {
        this.showReality();
      });
    }

    if (this.refs.resetButton) {
      this.refs.resetButton.addEventListener("click", () => {
        this.resetExperience();
      });
    }
  }

  setStage(stage) {
    this.state.stage = stage;
    if (this.refs.root) {
      this.refs.root.dataset.stage = stage;
    }
  }

  setCakeDistribution(distribution) {
    if (!this.refs.root) return;
    const segments = toSdg10CakeSegments(distribution);

    segments.forEach((segment) => {
      this.refs.root.style.setProperty(`--sdg10-${segment.key}`, `${segment.value}%`);
      this.refs.root.style.setProperty(`--sdg10-${segment.key}-start`, `${segment.start}%`);
      this.refs.root.style.setProperty(`--sdg10-${segment.key}-end`, `${segment.end}%`);
    });

    this.refs.shareValues.forEach((node) => {
      const key = node.dataset.shareValue;
      node.textContent = formatSdg10Percent(distribution[key] || 0);
    });
  }

  updateComparison(userDistribution, visibleDistribution) {
    const realityDistribution = getSdg10RealityDistribution();
    const rows = getSdg10ComparisonRows(userDistribution, realityDistribution);
    const visibleMap = visibleDistribution || userDistribution;

    this.refs.userValues.forEach((node) => {
      const row = rows.find((item) => item.key === node.dataset.userValue);
      node.textContent = formatSdg10Percent(row?.userValue || 0);
    });

    this.refs.realityValues.forEach((node) => {
      const row = rows.find((item) => item.key === node.dataset.realityValue);
      const target = this.state.stage === SDG10_STAGE_REALITY ? row?.realityValue : visibleMap[row?.key] || 0;
      node.textContent = this.state.stage === SDG10_STAGE_REALITY
        ? formatSdg10Percent(target)
        : "대기";
    });

    this.refs.deltaValues.forEach((node) => {
      const row = rows.find((item) => item.key === node.dataset.deltaValue);
      if (this.state.stage !== SDG10_STAGE_REALITY) {
        node.textContent = "대기";
        return;
      }
      node.textContent = formatSdg10Delta((row?.realityValue || 0) - (row?.userValue || 0));
    });
  }

  updateRangeProgress(value) {
    if (!this.refs.shareRange) return;
    const min = Number(this.refs.shareRange.min) || SDG10_MIN_TOP1_SHARE;
    const max = Number(this.refs.shareRange.max) || SDG10_MAX_TOP1_SHARE;
    const progress = ((clampSdg10Share(value) - min) / (max - min)) * 100;
    this.refs.shareRange.style.setProperty("--sdg10-range-progress", `${progress}%`);
  }

  updateIdealShare(value) {
    const top1Share = clampSdg10Share(value);
    const distribution = calculateSdg10IdealDistribution(top1Share);
    this.userDistribution = distribution;
    this.state.top1Share = top1Share;
    this.state.distribution = distribution;
    this.setStage(SDG10_STAGE_IDEAL);
    this.setCakeDistribution(distribution);
    this.updateComparison(distribution, distribution);
    this.updateRangeProgress(top1Share);

    if (this.refs.shareReadout) {
      this.refs.shareReadout.textContent = formatSdg10Percent(top1Share);
    }
    if (this.refs.stateCopy) {
      this.refs.stateCopy.textContent = SDG10_IDEAL_COPY;
    }
  }

  showReality() {
    if (this.countRafId) {
      window.cancelAnimationFrame(this.countRafId);
      this.countRafId = null;
    }

    const realityDistribution = getSdg10RealityDistribution();
    this.setStage(SDG10_STAGE_REALITY);
    this.animateToDistribution(realityDistribution);
    this.updateComparison(this.userDistribution, realityDistribution);

    if (this.refs.stateCopy) {
      this.refs.stateCopy.textContent = SDG10_REALITY_COPY;
    }
  }

  animateToDistribution(targetDistribution) {
    const startDistribution = { ...this.state.distribution };
    const startedAt = performance.now();
    const duration = this.reduceMotion ? 80 : SDG10_COUNT_ANIMATION_MS;

    const tick = (now) => {
      if (this.disposeRequested) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextDistribution = {};

      SDG10_GROUPS.forEach((group) => {
        const start = Number(startDistribution[group.key]) || 0;
        const end = Number(targetDistribution[group.key]) || 0;
        nextDistribution[group.key] = start + ((end - start) * eased);
      });

      this.state.distribution = nextDistribution;
      this.setCakeDistribution(nextDistribution);

      if (progress < 1) {
        this.countRafId = window.requestAnimationFrame(tick);
        return;
      }

      this.countRafId = null;
      this.state.distribution = targetDistribution;
      this.setCakeDistribution(targetDistribution);
    };

    this.countRafId = window.requestAnimationFrame(tick);
  }

  resetExperience() {
    if (this.refs.shareRange) {
      this.refs.shareRange.value = String(SDG10_DEFAULT_TOP1_SHARE);
    }
    this.updateIdealShare(SDG10_DEFAULT_TOP1_SHARE);
  }

  render() {
    if (!this.host) return;

    this.disposeRequested = false;
    this.reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
    this.state = createSdg10InitialState();
    this.userDistribution = this.state.distribution;
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);

    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.updateIdealShare(SDG10_DEFAULT_TOP1_SHARE);
  }

  destroy() {
    this.disposeRequested = true;
    if (this.countRafId) {
      window.cancelAnimationFrame(this.countRafId);
      this.countRafId = null;
    }
    this.refs = {};
    this.state = createSdg10InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);

    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
