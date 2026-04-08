import { clearStepMotionTimers, scheduleStepMotion, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG04_COUNTRIES,
  createSdg04InitialState,
  getNextSdg04SentenceIndex,
  getSdg04CountryInfoView,
  getSdg04SentenceView,
  renderSdg04ResourceItems
} from "./sdg04ContentModel.js";

export class Sdg04DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg04";
    this.frameMode = "immersive";
    this.refs = {};
    this.state = createSdg04InitialState();
    this.hasEnteredMain = false;
    this.stepRevealTimers = [];
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg04-title-hidden", hidden);
  }

  render() {
    if (!this.host) return;
    this.state = createSdg04InitialState();
    this.setTitleSectorHidden(true);
    this.hasEnteredMain = false;
    this.host.innerHTML = `
      <div class="sdg04-experience">
        <section class="sdg04-hero" data-role="hero">
          <p class="sdg04-goal-label">SDG GOAL 04</p>
          <h2 class="sdg04-title">문맹의 시선</h2>
          <p class="sdg04-subtitle">The Lens of Illiteracy</p>
          <p class="sdg04-lead">
            같은 정보, 다른 세상.<br />
            누군가에게는 기회가 되는 문장이,<br />
            누군가에게는 의미 없는 기호일 뿐입니다.
          </p>
          <p class="sdg04-hint">국가를 선택하여 시작하세요</p>
          <p class="sdg04-hero-hint">국가를 선택하면 같은 문장이 다르게 읽히는 현실을 체험할 수 있습니다.</p>
          <div class="sdg04-country-grid" data-role="heroCountries"></div>
        </section>

        <section class="sdg04-main" data-role="main" aria-hidden="true">
          <header class="sdg04-main-header sdg04-step">
            <p class="sdg04-focus-copy">읽히지 않는 문장이 만드는 현실의 간극</p>
            <div class="sdg04-head-actions">
              <button type="button" class="sdg04-lang-toggle" data-role="langToggle">English</button>
            </div>
          </header>

          <section class="sdg04-spotlight sdg04-step">
            <p class="sdg04-overline">선택된 국가</p>
            <h3 data-role="countryNameKo">-</h3>
            <p class="sdg04-muted" data-role="countryMeta">-</p>
            <div class="sdg04-meter">
              <div class="sdg04-meter-row">
                <span>문해율</span>
                <strong data-role="literacyRate">0%</strong>
              </div>
              <div class="sdg04-meter-track">
                <div class="sdg04-meter-fill" data-role="literacyFill"></div>
              </div>
            </div>
            <p class="sdg04-context-line" data-role="contextMessage">-</p>
          </section>

          <section class="sdg04-message sdg04-step">
            <div class="sdg04-message-head">
              <p class="sdg04-overline">현재 문장</p>
              <button type="button" class="sdg04-next-btn" data-role="nextSentence">다른 문장</button>
            </div>
            <p class="sdg04-category" data-role="categoryBadge">교육</p>
            <p class="sdg04-distorted" data-role="distortedText">-</p>
            <p class="sdg04-impact hidden" data-role="impactText">-</p>
            <p class="sdg04-muted sdg04-sentence-index" data-role="sentenceCount">1 / 1</p>
          </section>

          <section class="sdg04-switch sdg04-step">
            <p class="sdg04-overline">국가 전환</p>
            <div class="sdg04-country-grid sdg04-country-grid-compact" data-role="compareCountries"></div>
          </section>

          <section class="sdg04-resources sdg04-step">
            <p class="sdg04-overline">현실 자료</p>
            <h3 class="sdg04-resources-title">관련 자료</h3>
            <p class="sdg04-resources-copy">
              체험 아래에서 실제 기사, 영상, 보고서를 통해 교육 격차의 현실을 함께 확인해보세요.
            </p>
            <div class="sdg04-resource-list">
              ${renderSdg04ResourceItems()}
            </div>
          </section>
        </section>
      </div>
    `;

    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      hero: get("hero"),
      main: get("main"),
      heroCountries: get("heroCountries"),
      compareCountries: get("compareCountries"),
      langToggle: get("langToggle"),
      countryNameKo: get("countryNameKo"),
      countryMeta: get("countryMeta"),
      literacyRate: get("literacyRate"),
      literacyFill: get("literacyFill"),
      contextMessage: get("contextMessage"),
      sentenceCount: get("sentenceCount"),
      nextSentence: get("nextSentence"),
      categoryBadge: get("categoryBadge"),
      distortedText: get("distortedText"),
      impactText: get("impactText")
    };
  }

  clearStepMotion() {
    clearStepMotionTimers(this.stepRevealTimers, this.host, ".sdg04-step");
  }

  setupStepMotion() {
    scheduleStepMotion(this.stepRevealTimers, this.host, ".sdg04-step", 90);
  }

  bindEvents() {
    if (this.refs.langToggle) {
      this.refs.langToggle.addEventListener("click", () => {
        this.state.showKorean = !this.state.showKorean;
        this.renderSentence();
      });
    }

    if (this.refs.nextSentence) {
      this.refs.nextSentence.addEventListener("click", () => {
        this.state.currentSentenceIndex = getNextSdg04SentenceIndex(this.state.currentSentenceIndex);
        this.renderSentence();
      });
    }
  }

  renderCountryButtons(hostEl) {
    if (!hostEl) return;
    hostEl.innerHTML = "";

    SDG04_COUNTRIES.forEach((country) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sdg04-country-btn";
      button.textContent = `${country.nameKo} ${country.literacyRate}%`;
      if (this.state.selectedCountry && this.state.selectedCountry.name === country.name) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        this.state.selectedCountry = country;
        this.state.hasStarted = true;
        this.setTitleSectorHidden(true);
        this.renderAll();
      });

      hostEl.appendChild(button);
    });
  }

  renderCountryInfo() {
    const country = this.state.selectedCountry;
    if (!country) return;
    const countryView = getSdg04CountryInfoView(country);

    if (this.refs.countryNameKo) this.refs.countryNameKo.textContent = countryView.nameKo;
    if (this.refs.countryMeta) this.refs.countryMeta.textContent = countryView.meta;
    if (this.refs.literacyRate) this.refs.literacyRate.textContent = countryView.literacyRate;
    if (this.refs.literacyFill) this.refs.literacyFill.style.width = countryView.literacyFillWidth;
    if (this.refs.contextMessage) this.refs.contextMessage.textContent = countryView.contextMessage;
  }

  renderSentence() {
    const country = this.state.selectedCountry;
    if (!country) return;
    const sentenceView = getSdg04SentenceView(this.state, country);

    if (this.refs.langToggle) {
      this.refs.langToggle.textContent = sentenceView.toggleLabel;
    }
    if (this.refs.categoryBadge) this.refs.categoryBadge.textContent = sentenceView.category;
    if (this.refs.sentenceCount) this.refs.sentenceCount.textContent = sentenceView.sentenceCount;

    if (this.refs.distortedText) {
      this.refs.distortedText.textContent = sentenceView.distortedText;
      this.refs.distortedText.style.setProperty("--blur", sentenceView.blur);
    }

    if (this.refs.impactText) {
      this.refs.impactText.textContent = sentenceView.impact;
      this.refs.impactText.classList.toggle("hidden", sentenceView.hideImpact);
    }
  }

  updateVisibility() {
    if (!this.refs.hero || !this.refs.main) return;
    const started = Boolean(this.state.hasStarted);
    const root = this.host?.querySelector(".sdg04-experience");
    if (root) root.classList.toggle("is-started", started);
    this.refs.main.setAttribute("aria-hidden", started ? "false" : "true");

    if (!started) {
      this.hasEnteredMain = false;
      this.clearStepMotion();
      return;
    }

    if (!this.hasEnteredMain) {
      this.hasEnteredMain = true;
      this.setupStepMotion();
      return;
    }
  }

  renderAll() {
    this.renderCountryButtons(this.refs.heroCountries);
    this.renderCountryButtons(this.refs.compareCountries);
    this.updateVisibility();
    this.renderCountryInfo();
    this.renderSentence();
  }

  reset() {
    this.setTitleSectorHidden(false);
    this.clearStepMotion();
    this.hasEnteredMain = false;
    this.render();
  }

  destroy() {
    this.clearStepMotion();
    this.refs = {};
    if (this.host) this.host.innerHTML = "";
    this.state = createSdg04InitialState();
    this.hasEnteredMain = false;
    this.setTitleSectorHidden(false);
  }
}
