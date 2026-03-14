const COUNTRIES = [
  { name: "Finland", nameKo: "핀란드", literacyRate: 99, region: "유럽" },
  { name: "South Korea", nameKo: "대한민국", literacyRate: 99, region: "아시아" },
  { name: "India", nameKo: "인도", literacyRate: 74, region: "아시아" },
  { name: "Niger", nameKo: "니제르", literacyRate: 19, region: "아프리카" }
];

const SENTENCES = [
  {
    category: "교육",
    text: "Scholarship applications are now open. Submit your documents by March 15th.",
    textKo: "장학금 신청이 시작되었습니다. 3월 15일까지 서류를 제출하세요.",
    impact: "Unable to read this means missing educational opportunities",
    impactKo: "이 문장을 읽지 못하면 교육의 기회를 놓치게 됩니다"
  },
  {
    category: "취업",
    text: "Job Fair: Over 50 companies hiring. Bring your resume this Saturday.",
    textKo: "채용 박람회: 50개 이상의 기업이 채용 중. 토요일에 이력서를 지참하세요.",
    impact: "Unable to read this means losing employment opportunities",
    impactKo: "이 문장을 읽지 못하면 취업의 기회를 놓치게 됩니다"
  },
  {
    category: "의료",
    text: "Take this medication twice daily with food. Seek help if symptoms persist.",
    textKo: "이 약은 하루 두 번 음식과 함께 복용하세요. 증상이 지속되면 도움을 요청하세요.",
    impact: "Unable to read this puts your health at risk",
    impactKo: "이 문장을 읽지 못하면 건강과 생명이 위험해집니다"
  },
  {
    category: "복지",
    text: "You may be eligible for housing assistance. Submit form 27-B before deadline.",
    textKo: "주거 지원을 받을 수 있습니다. 마감 전 27-B 양식을 제출하세요.",
    impact: "Unable to read this means losing essential support",
    impactKo: "이 문장을 읽지 못하면 필수 지원을 받을 수 없습니다"
  }
];

const SYMBOLS = ["#", "@", "%", "&", "*", "?", "!", "▓", "▒", "░", "◼"];

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function distortText(text, literacyRate) {
  const keep = Math.max(0, Math.min(1, literacyRate / 100));
  const out = Array.from(text).map((ch) => {
    if (ch.trim() === "") return ch;
    if (Math.random() < keep) return ch;
    return randomSymbol();
  }).join("");

  const intensity = 1 - keep;
  return {
    text: out,
    blur: (0.2 + intensity * 4.9).toFixed(2)
  };
}

function contextForRate(country) {
  const lost = 100 - country.literacyRate;
  if (country.literacyRate < 50) {
    return `${country.nameKo}의 ${lost}% 사람들에게 이 문장은 의미 없는 기호처럼 보일 수 있습니다.`;
  }
  if (country.literacyRate < 80) {
    return "문해율이 낮을수록 정보는 점점 흐려지고 행동 타이밍을 놓치게 됩니다.";
  }
  return "높은 문해율은 정보에 대한 빠르고 정확한 접근을 의미합니다.";
}

export class Sdg04DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg04";
    this.frameMode = "immersive";
    this.refs = {};
    this.state = this.createInitialState();
    this.hasEnteredMain = false;
    this.stepRevealTimers = [];
  }

  createInitialState() {
    const defaultCountry = COUNTRIES.find((country) => country.name === "India") || COUNTRIES[0];
    return {
      selectedCountry: defaultCountry,
      currentSentenceIndex: 0,
      showKorean: true,
      hasStarted: false
    };
  }

  setTitleSectorHidden(hidden) {
    const detailRoot = this.host?.closest("#detailView");
    if (!detailRoot) return;
    detailRoot.classList.toggle("sdg04-title-hidden", Boolean(hidden));
  }

  render() {
    if (!this.host) return;
    this.state = this.createInitialState();
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
    this.stepRevealTimers.forEach((timer) => window.clearTimeout(timer));
    this.stepRevealTimers = [];
    if (!this.host) return;
    this.host.querySelectorAll(".sdg04-step").forEach((step) => step.classList.remove("in-view"));
  }

  setupStepMotion() {
    if (!this.host) return;
    this.clearStepMotion();

    const steps = this.host.querySelectorAll(".sdg04-step");
    if (!steps.length) return;

    steps.forEach((step, idx) => {
      const timer = window.setTimeout(() => {
        step.classList.add("in-view");
      }, idx * 90);
      this.stepRevealTimers.push(timer);
    });
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
        this.state.currentSentenceIndex = (this.state.currentSentenceIndex + 1) % SENTENCES.length;
        this.renderSentence();
      });
    }
  }

  renderCountryButtons(hostEl) {
    if (!hostEl) return;
    hostEl.innerHTML = "";

    COUNTRIES.forEach((country) => {
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

    if (this.refs.countryNameKo) this.refs.countryNameKo.textContent = country.nameKo;
    if (this.refs.countryMeta) this.refs.countryMeta.textContent = `${country.name} · ${country.region}`;
    if (this.refs.literacyRate) this.refs.literacyRate.textContent = `${country.literacyRate}%`;
    if (this.refs.literacyFill) this.refs.literacyFill.style.width = `${country.literacyRate}%`;
    if (this.refs.contextMessage) this.refs.contextMessage.textContent = contextForRate(country);
  }

  renderSentence() {
    const country = this.state.selectedCountry;
    if (!country) return;

    const sentence = SENTENCES[this.state.currentSentenceIndex];
    const originalText = this.state.showKorean ? sentence.textKo : sentence.text;
    const distorted = distortText(originalText, country.literacyRate);
    const impact = this.state.showKorean ? sentence.impactKo : sentence.impact;

    if (this.refs.langToggle) {
      this.refs.langToggle.textContent = this.state.showKorean ? "English" : "한국어";
    }
    if (this.refs.categoryBadge) this.refs.categoryBadge.textContent = sentence.category;
    if (this.refs.sentenceCount) this.refs.sentenceCount.textContent = `${this.state.currentSentenceIndex + 1} / ${SENTENCES.length}`;

    if (this.refs.distortedText) {
      this.refs.distortedText.textContent = distorted.text;
      this.refs.distortedText.style.setProperty("--blur", `${distorted.blur}px`);
    }

    if (this.refs.impactText) {
      this.refs.impactText.textContent = impact;
      this.refs.impactText.classList.toggle("hidden", country.literacyRate >= 80);
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
    this.state = this.createInitialState();
    this.hasEnteredMain = false;
    this.setTitleSectorHidden(false);
  }
}
