import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG09_BUILD_ANIMATION_MS,
  SDG09_COUNT_ANIMATION_MS,
  SDG09_STAGE_BUILD,
  SDG09_STAGE_INTRO,
  SDG09_STAGE_RESULT,
  createSdg09InitialState,
  formatSdg09MetricValue,
  getSdg09Scenario,
  getSdg09Scenarios,
  isValidSdg09Choice
} from "./sdg09ContentModel.js";

const SDG09_DEFAULT_SUMMARY = "기반 시설을 선택하면 끊어진 산업 생태계가 어떻게 연결되는지 보여줍니다.";
const SDG09_DEFAULT_MESSAGE = "인프라의 연결은 곧 혁신의 시작입니다.";
const SDG09_DEFAULT_BRIDGE_LABEL = "WAITING FOR INFRASTRUCTURE";
const SDG09_RESOURCE_EMPTY_COPY = "선택한 인프라의 현실 자료가 여기에 표시됩니다.";

function renderSdg09ChoiceCards() {
  return getSdg09Scenarios()
    .map((scenario) => {
      return `
        <button type="button" class="sdg09-choice-card" data-choice="${escapeHtml(scenario.choice)}">
          <span class="sdg09-choice-index">${escapeHtml(scenario.shortTitle)}</span>
          <span class="sdg09-choice-title">${escapeHtml(scenario.title)}</span>
          <span class="sdg09-choice-meta">${escapeHtml(scenario.meta)}</span>
        </button>
      `;
    })
    .join("");
}

function renderSdg09MetricShell() {
  const fallbackMetrics = [
    { key: "jobs", label: "새 일자리", suffix: "명" },
    { key: "workers", label: "연결된 작업자", suffix: "명" },
    { key: "efficiency", label: "생산 효율", suffix: "%" },
    { key: "projects", label: "혁신 프로젝트", suffix: "건" }
  ];

  return fallbackMetrics
    .map((metric) => {
      return `
        <article class="sdg09-metric-card">
          <p class="sdg09-metric-label" data-metric-label="${escapeHtml(metric.key)}">${escapeHtml(metric.label)}</p>
          <strong class="sdg09-metric-value" data-metric-value="${escapeHtml(metric.key)}" data-suffix="${escapeHtml(metric.suffix)}">0${escapeHtml(metric.suffix)}</strong>
        </article>
      `;
    })
    .join("");
}

export class Sdg09DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg09";
    this.frameMode = "generic";

    this.refs = {};
    this.state = createSdg09InitialState();
    this.disposeRequested = false;
    this.reduceMotion = false;
    this.stageTimerId = null;
    this.countRafId = null;
    this.timeline = null;
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg09-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg09-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg09-exp" data-role="root" data-stage="${SDG09_STAGE_INTRO}" data-infra="none">
        <div class="sdg09-scene" aria-hidden="true">
          ${this.sceneSvg()}
          <div class="sdg09-flow-layer">
            <span class="sdg09-data-packet is-1"></span>
            <span class="sdg09-data-packet is-2"></span>
            <span class="sdg09-data-packet is-3"></span>
            <span class="sdg09-cargo-unit is-1"></span>
            <span class="sdg09-cargo-unit is-2"></span>
          </div>
        </div>

        <div class="sdg09-interface">
          <header class="sdg09-hero" aria-labelledby="sdg09Title">
            <p class="sdg09-goal-label">SDG GOAL 09</p>
            <h3 id="sdg09Title" class="sdg09-title">The Connection Bridge</h3>
            <p class="sdg09-subtitle">미래 연결 브릿지</p>
            <p class="sdg09-lead">끊어진 산업 생태계에 기술 인프라를 놓으면, 생산과 혁신이 같은 흐름으로 움직입니다.</p>
          </header>

          <section class="sdg09-control-panel" aria-label="설치할 산업 기반 시설">
            <div class="sdg09-control-head">
              <p class="sdg09-kicker">Infrastructure Choice</p>
              <p class="sdg09-control-copy">산업과 혁신을 연결할 기반 시설을 선택하세요.</p>
            </div>
            <div class="sdg09-choice-grid" data-role="choiceGrid">
              ${renderSdg09ChoiceCards()}
            </div>
          </section>

          <section class="sdg09-result-panel" data-role="resultPanel" aria-live="polite" aria-label="연결 결과">
            <div class="sdg09-result-head">
              <p class="sdg09-kicker">Connection Result</p>
              <span class="sdg09-result-pill" data-role="selectedLabel">대기 중</span>
            </div>
            <p class="sdg09-bridge-label" data-role="bridgeLabel">${SDG09_DEFAULT_BRIDGE_LABEL}</p>
            <p class="sdg09-result-summary" data-role="resultSummary">${SDG09_DEFAULT_SUMMARY}</p>
            <div class="sdg09-metric-grid">
              ${renderSdg09MetricShell()}
            </div>
            <p class="sdg09-result-message" data-role="resultMessage">${SDG09_DEFAULT_MESSAGE}</p>
            <div class="sdg09-result-actions">
              <button type="button" class="sdg09-secondary-btn" data-role="resetButton">다른 인프라 선택</button>
            </div>
            <div class="sdg09-resource-list" data-role="resourceList">
              <p class="sdg09-resource-empty">${SDG09_RESOURCE_EMPTY_COPY}</p>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  sceneSvg() {
    return `
      <svg class="sdg09-map" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="끊어진 산업 거점과 연결되는 혁신 회랑">
        <defs>
          <linearGradient id="sdg09Bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#101827" />
            <stop offset="48%" stop-color="#14202f" />
            <stop offset="100%" stop-color="#1b1822" />
          </linearGradient>
          <linearGradient id="sdg09LandLeft" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#293344" />
            <stop offset="100%" stop-color="#151c29" />
          </linearGradient>
          <linearGradient id="sdg09LandRight" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#202838" />
            <stop offset="100%" stop-color="#131923" />
          </linearGradient>
          <linearGradient id="sdg09BridgeGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="#ff8f4b" />
            <stop offset="48%" stop-color="#f6f0a6" />
            <stop offset="100%" stop-color="#68e6ff" />
          </linearGradient>
          <filter id="sdg09Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1200" height="720" fill="url(#sdg09Bg)" />
        <g class="sdg09-circuit-grid">
          <path d="M100 156 H356 M164 210 H314 M820 164 H1090 M856 224 H1032 M132 520 H382 M836 520 H1074" />
          <path d="M226 156 V108 M932 164 V116 M300 520 V574 M1016 520 V574" />
        </g>

        <path class="sdg09-canyon" d="M487 0 C533 116 506 211 553 330 C606 466 558 585 617 720 H1200 V720 H0 V720 H422 C454 590 421 474 470 336 C509 225 450 103 487 0 Z" />
        <path class="sdg09-canyon-edge is-left" d="M486 18 C528 143 492 230 543 344 C596 463 552 581 604 704" />
        <path class="sdg09-canyon-edge is-right" d="M646 8 C604 142 647 241 602 356 C555 478 604 589 562 708" />

        <g class="sdg09-region sdg09-region-left">
          <path class="sdg09-land" d="M0 495 C84 441 185 422 289 434 C382 445 429 473 500 437 L500 720 H0 Z" fill="url(#sdg09LandLeft)" />
          <g class="sdg09-factory-cluster">
            <rect class="sdg09-building is-data" x="126" y="305" width="102" height="150" rx="3" />
            <rect class="sdg09-building is-lab" x="248" y="278" width="126" height="178" rx="4" />
            <path class="sdg09-building is-plant" d="M382 456 V326 L426 350 L470 321 V456 Z" />
            <rect class="sdg09-stack" x="426" y="252" width="26" height="82" rx="2" />
            <rect class="sdg09-antenna" x="184" y="230" width="10" height="76" rx="2" />
            <path class="sdg09-antenna-wave is-1" d="M168 256 C151 240 151 220 168 204" />
            <path class="sdg09-antenna-wave is-2" d="M208 256 C225 240 225 220 208 204" />
            <g class="sdg09-window-grid">
              <rect x="148" y="332" width="16" height="9" />
              <rect x="174" y="332" width="16" height="9" />
              <rect x="200" y="332" width="16" height="9" />
              <rect x="270" y="318" width="18" height="10" />
              <rect x="300" y="318" width="18" height="10" />
              <rect x="330" y="318" width="18" height="10" />
              <rect x="270" y="356" width="18" height="10" />
              <rect x="300" y="356" width="18" height="10" />
              <rect x="330" y="356" width="18" height="10" />
            </g>
          </g>
        </g>

        <g class="sdg09-region sdg09-region-right">
          <path class="sdg09-land" d="M700 444 C789 418 873 429 948 466 C1043 512 1116 478 1200 431 V720 H700 Z" fill="url(#sdg09LandRight)" />
          <g class="sdg09-remote-cluster">
            <rect class="sdg09-building is-warehouse" x="756" y="376" width="152" height="92" rx="4" />
            <path class="sdg09-building is-dormant-plant" d="M936 468 V350 L982 374 L1028 350 V468 Z" />
            <rect class="sdg09-building is-small-lab" x="1054" y="326" width="76" height="142" rx="4" />
            <rect class="sdg09-dormant-stack" x="1002" y="290" width="22" height="64" rx="2" />
            <g class="sdg09-dark-window-grid">
              <rect x="784" y="407" width="18" height="10" />
              <rect x="816" y="407" width="18" height="10" />
              <rect x="848" y="407" width="18" height="10" />
              <rect x="1074" y="358" width="14" height="9" />
              <rect x="1100" y="358" width="14" height="9" />
              <rect x="1074" y="394" width="14" height="9" />
              <rect x="1100" y="394" width="14" height="9" />
            </g>
          </g>
        </g>

        <g class="sdg09-broken-signal">
          <path d="M260 382 C345 326 422 326 490 368" />
          <path d="M710 368 C786 330 855 335 928 386" />
          <circle cx="505" cy="373" r="4" />
          <circle cx="692" cy="373" r="4" />
        </g>

        <g class="sdg09-idle-logistics">
          <rect x="396" y="506" width="58" height="24" rx="3" />
          <rect x="438" y="490" width="24" height="40" rx="3" />
          <circle cx="410" cy="535" r="7" />
          <circle cx="448" cy="535" r="7" />
        </g>

        <g class="sdg09-bridge-assembly" filter="url(#sdg09Glow)">
          <path class="sdg09-bridge-shadow" d="M372 510 H828" pathLength="1" />
          <path class="sdg09-bridge-glow" data-role="bridgeGlow" d="M372 510 H828" pathLength="1" />
          <path class="sdg09-bridge-core" data-role="bridgeCore" d="M372 510 H828" pathLength="1" stroke="url(#sdg09BridgeGradient)" />
          <path class="sdg09-bridge-deck" data-role="bridgeDeck" d="M384 528 H816" pathLength="1" />
          <path class="sdg09-bridge-rib is-pylon" d="M500 408 V528" pathLength="1" />
          <path class="sdg09-bridge-rib is-pylon" d="M700 408 V528" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M500 412 L398 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M500 412 L452 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M500 412 L552 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M500 412 L606 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M700 412 L594 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M700 412 L648 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M700 412 L748 510" pathLength="1" />
          <path class="sdg09-bridge-rib is-cable" d="M700 412 L802 510" pathLength="1" />
        </g>

        <g class="sdg09-network-nodes">
          <circle data-node="left-hub" cx="194" cy="236" r="7" />
          <circle data-node="factory" cx="434" cy="334" r="6" />
          <circle data-node="bridge-a" cx="500" cy="408" r="6" />
          <circle data-node="bridge-b" cx="600" cy="510" r="7" />
          <circle data-node="bridge-c" cx="700" cy="408" r="6" />
          <circle data-node="warehouse" cx="838" cy="407" r="6" />
          <circle data-node="lab" cx="1094" cy="358" r="7" />
        </g>
      </svg>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);

    this.refs = {
      root: get("root"),
      choiceGrid: get("choiceGrid"),
      resultPanel: get("resultPanel"),
      selectedLabel: get("selectedLabel"),
      bridgeLabel: get("bridgeLabel"),
      resultSummary: get("resultSummary"),
      resultMessage: get("resultMessage"),
      resourceList: get("resourceList"),
      resetButton: get("resetButton"),
      bridgeGlow: get("bridgeGlow"),
      bridgeCore: get("bridgeCore"),
      bridgeDeck: get("bridgeDeck")
    };

    this.refs.choiceButtons = Array.from(this.host.querySelectorAll(".sdg09-choice-card"));
    this.refs.metricValues = Array.from(this.host.querySelectorAll("[data-metric-value]"));
    this.refs.metricLabels = Array.from(this.host.querySelectorAll("[data-metric-label]"));
    this.refs.bridgeRibs = Array.from(this.host.querySelectorAll(".sdg09-bridge-rib"));
    this.refs.nodes = Array.from(this.host.querySelectorAll(".sdg09-network-nodes circle"));
  }

  bindEvents() {
    if (this.refs.choiceGrid) {
      this.refs.choiceGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".sdg09-choice-card");
        if (!button || !this.refs.choiceGrid.contains(button) || button.disabled) return;
        const choice = button.dataset.choice;
        void this.selectInfrastructure(choice);
      });
    }

    if (this.refs.resetButton) {
      this.refs.resetButton.addEventListener("click", () => {
        this.resetExperience();
      });
    }
  }

  clearRuntime() {
    if (this.stageTimerId) {
      window.clearTimeout(this.stageTimerId);
      this.stageTimerId = null;
    }
    if (this.countRafId) {
      window.cancelAnimationFrame(this.countRafId);
      this.countRafId = null;
    }
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }

  setStage(stage) {
    this.state.stage = stage;
    if (this.refs.root) {
      this.refs.root.dataset.stage = stage;
    }
  }

  setChoiceButtonsDisabled(disabled) {
    this.refs.choiceButtons.forEach((button) => {
      button.disabled = Boolean(disabled);
    });
  }

  setSelectedChoice(choice) {
    this.refs.choiceButtons.forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.choice === choice);
    });
  }

  setScenarioTheme(scenario) {
    if (!this.refs.root || !scenario) return;
    this.refs.root.dataset.infra = scenario.choice;
    this.refs.root.style.setProperty("--sdg09-accent", scenario.accent);
    this.refs.root.style.setProperty("--sdg09-accent-soft", scenario.accentSoft);
  }

  renderResultCopy(scenario) {
    if (this.refs.selectedLabel) {
      this.refs.selectedLabel.textContent = scenario?.label || "대기 중";
    }
    if (this.refs.bridgeLabel) {
      this.refs.bridgeLabel.textContent = scenario?.bridgeLabel || SDG09_DEFAULT_BRIDGE_LABEL;
    }
    if (this.refs.resultSummary) {
      this.refs.resultSummary.textContent = scenario?.summary || SDG09_DEFAULT_SUMMARY;
    }
    if (this.refs.resultMessage) {
      this.refs.resultMessage.textContent = scenario?.message || SDG09_DEFAULT_MESSAGE;
    }
    this.renderMetricLabels(scenario);
    this.renderResources(scenario?.resources || []);
  }

  renderMetricLabels(scenario) {
    const metrics = scenario?.metrics || [];
    this.refs.metricLabels.forEach((labelNode) => {
      const key = labelNode.dataset.metricLabel;
      const metric = metrics.find((item) => item.key === key);
      if (metric) labelNode.textContent = metric.label;
    });
    this.refs.metricValues.forEach((valueNode) => {
      const key = valueNode.dataset.metricValue;
      const metric = metrics.find((item) => item.key === key);
      valueNode.dataset.target = String(metric?.value || 0);
      valueNode.dataset.suffix = metric?.suffix || "";
      valueNode.textContent = formatSdg09MetricValue(0, metric?.suffix || valueNode.dataset.suffix || "");
    });
  }

  renderResources(resources) {
    if (!this.refs.resourceList) return;
    this.refs.resourceList.innerHTML = "";
    const list = Array.isArray(resources) ? resources : [];

    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "sdg09-resource-empty";
      empty.textContent = SDG09_RESOURCE_EMPTY_COPY;
      this.refs.resourceList.appendChild(empty);
      return;
    }

    list.forEach((item) => {
      const link = document.createElement("a");
      link.className = "sdg09-resource-item";
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const source = document.createElement("span");
      source.className = "sdg09-resource-source";
      source.textContent = item.source || "Source";

      const title = document.createElement("span");
      title.className = "sdg09-resource-title";
      title.textContent = item.title || "자료 보기";

      link.append(source, title);
      this.refs.resourceList.appendChild(link);
    });
  }

  animateMetrics(scenario) {
    const metrics = scenario?.metrics || [];
    const startedAt = performance.now();
    const duration = this.reduceMotion ? 80 : SDG09_COUNT_ANIMATION_MS;

    const tick = (now) => {
      if (this.disposeRequested) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.refs.metricValues.forEach((valueNode) => {
        const metric = metrics.find((item) => item.key === valueNode.dataset.metricValue);
        const value = Math.round((metric?.value || 0) * eased);
        valueNode.textContent = formatSdg09MetricValue(value, metric?.suffix || "");
      });

      if (progress < 1) {
        this.countRafId = window.requestAnimationFrame(tick);
        return;
      }
      this.countRafId = null;
      this.state.running = false;
    };

    this.countRafId = window.requestAnimationFrame(tick);
  }

  resetBridgeAnimation() {
    const drawable = [
      this.refs.bridgeGlow,
      this.refs.bridgeCore,
      this.refs.bridgeDeck,
      ...this.refs.bridgeRibs
    ].filter(Boolean);

    drawable.forEach((node) => {
      node.style.strokeDashoffset = "1";
      node.style.opacity = "";
    });
    this.refs.nodes.forEach((node) => {
      node.style.opacity = "";
      node.style.transform = "";
    });
  }

  playBuildAnimation(scenario) {
    const gsap = window.gsap;
    const drawable = [
      this.refs.bridgeGlow,
      this.refs.bridgeCore,
      this.refs.bridgeDeck,
      ...this.refs.bridgeRibs
    ].filter(Boolean);

    this.resetBridgeAnimation();

    if (gsap && !this.reduceMotion) {
      this.timeline = gsap.timeline({
        onComplete: () => {
          if (this.disposeRequested) return;
          this.timeline = null;
          this.setStage(SDG09_STAGE_RESULT);
          this.animateMetrics(scenario);
        }
      });
      this.timeline
        .to(drawable, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.035,
          ease: "power2.out"
        })
        .to(this.refs.nodes, {
          opacity: 1,
          scale: 1,
          transformOrigin: "50% 50%",
          duration: 0.45,
          stagger: 0.055,
          ease: "back.out(1.7)"
        }, "-=0.36");
      return;
    }

    this.stageTimerId = window.setTimeout(() => {
      this.stageTimerId = null;
      if (this.disposeRequested) return;
      this.setStage(SDG09_STAGE_RESULT);
      this.animateMetrics(scenario);
    }, this.reduceMotion ? 80 : SDG09_BUILD_ANIMATION_MS);
  }

  async selectInfrastructure(choice) {
    if (this.state.running || !isValidSdg09Choice(choice)) return;
    const scenario = getSdg09Scenario(choice);
    if (!scenario) return;

    this.clearRuntime();
    this.state.running = true;
    this.state.selectedChoice = choice;
    this.setChoiceButtonsDisabled(true);
    this.setSelectedChoice(choice);
    this.setScenarioTheme(scenario);
    this.renderResultCopy(scenario);
    this.setStage(SDG09_STAGE_BUILD);
    this.playBuildAnimation(scenario);
  }

  resetExperience() {
    this.clearRuntime();
    this.state = createSdg09InitialState();
    this.setChoiceButtonsDisabled(false);
    this.setSelectedChoice("");
    if (this.refs.root) {
      this.refs.root.dataset.infra = "none";
      this.refs.root.style.removeProperty("--sdg09-accent");
      this.refs.root.style.removeProperty("--sdg09-accent-soft");
    }
    this.renderResultCopy(null);
    this.resetBridgeAnimation();
    this.setStage(SDG09_STAGE_INTRO);
  }

  async render() {
    if (!this.host) return;

    this.disposeRequested = false;
    this.clearRuntime();
    this.state = createSdg09InitialState();
    this.reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);

    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderResultCopy(null);
    this.resetBridgeAnimation();
    this.setStage(SDG09_STAGE_INTRO);
  }

  destroy() {
    this.disposeRequested = true;
    this.clearRuntime();
    this.refs = {};
    this.state = createSdg09InitialState();
    this.setTitleSectorHidden(false);
    this.setThemeActive(false);

    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
