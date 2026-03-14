const COUNTRIES = [
  { name: "Finland", nameKo: "핀란드", literacyRate: 99, region: "유럽" },
  { name: "South Korea", nameKo: "대한민국", literacyRate: 99, region: "아시아" },
  { name: "Japan", nameKo: "일본", literacyRate: 99, region: "아시아" },
  { name: "Brazil", nameKo: "브라질", literacyRate: 93, region: "남미" },
  { name: "India", nameKo: "인도", literacyRate: 74, region: "아시아" },
  { name: "Pakistan", nameKo: "파키스탄", literacyRate: 59, region: "아시아" },
  { name: "Afghanistan", nameKo: "아프가니스탄", literacyRate: 37, region: "아시아" },
  { name: "Niger", nameKo: "니제르", literacyRate: 19, region: "아프리카" },
  { name: "Chad", nameKo: "차드", literacyRate: 22, region: "아프리카" }
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
    this.refs = {};
    this.state = this.createInitialState();
  }

  createInitialState() {
    return {
      selectedCountry: COUNTRIES[4],
      currentSentenceIndex: 0,
      showKorean: true,
      hasStarted: false
    };
  }

  render() {
    if (!this.host) return;
    this.state = this.createInitialState();
    this.host.innerHTML = `
      <div class="sdg04-experience">
        <section class="sdg04-hero" data-role="hero">
          <p class="sdg04-lead">
            같은 정보, 다른 세상.<br />
            누군가에게는 기회가 되는 문장이,<br />
            누군가에게는 의미 없는 기호일 뿐입니다.
          </p>
          <p class="sdg04-hint">국가를 선택하여 시작하세요</p>
          <div class="sdg04-country-grid" data-role="heroCountries"></div>
        </section>

        <section class="sdg04-main hidden" data-role="main">
          <header class="sdg04-main-header">
            <button type="button" class="sdg04-lang-toggle" data-role="langToggle">English</button>
          </header>

          <section class="sdg04-card sdg04-country">
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
          </section>

          <section class="sdg04-card sdg04-context" data-role="contextMessage">-</section>

          <section class="sdg04-sentence-nav">
            <span class="sdg04-muted" data-role="sentenceCount">1 / 1</span>
            <div class="sdg04-nav-buttons">
              <button type="button" class="sdg04-nav-btn" data-role="prevSentence" aria-label="이전 문장">‹</button>
              <button type="button" class="sdg04-nav-btn" data-role="nextSentence" aria-label="다음 문장">›</button>
            </div>
          </section>

          <section class="sdg04-card">
            <div class="sdg04-badge-line">
              <span class="sdg04-category" data-role="categoryBadge">교육</span>
            </div>
            <p class="sdg04-distorted" data-role="distortedText">-</p>
            <p class="sdg04-impact hidden" data-role="impactText">-</p>
          </section>

          <section class="sdg04-card">
            <h4>다른 국가와 비교해보세요</h4>
            <div class="sdg04-country-grid" data-role="compareCountries"></div>
          </section>

          <section class="sdg04-stats">
            <article class="sdg04-card sdg04-stat"><strong>773M</strong><span>전 세계 문맹 성인 인구</span></article>
            <article class="sdg04-card sdg04-stat"><strong>2/3</strong><span>문맹 인구 중 여성 비율</span></article>
            <article class="sdg04-card sdg04-stat"><strong>250M</strong><span>기초 문해력 부족 아동</span></article>
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
      prevSentence: get("prevSentence"),
      nextSentence: get("nextSentence"),
      categoryBadge: get("categoryBadge"),
      distortedText: get("distortedText"),
      impactText: get("impactText")
    };
  }

  bindEvents() {
    if (this.refs.langToggle) {
      this.refs.langToggle.addEventListener("click", () => {
        this.state.showKorean = !this.state.showKorean;
        this.renderSentence();
      });
    }

    if (this.refs.prevSentence) {
      this.refs.prevSentence.addEventListener("click", () => {
        this.state.currentSentenceIndex = (this.state.currentSentenceIndex - 1 + SENTENCES.length) % SENTENCES.length;
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
    this.refs.hero.classList.toggle("hidden", this.state.hasStarted);
    this.refs.main.classList.toggle("hidden", !this.state.hasStarted);
  }

  renderAll() {
    this.renderCountryButtons(this.refs.heroCountries);
    this.renderCountryButtons(this.refs.compareCountries);
    this.updateVisibility();
    this.renderCountryInfo();
    this.renderSentence();
  }

  reset() {
    this.render();
  }

  destroy() {
    this.refs = {};
    if (this.host) this.host.innerHTML = "";
    this.state = this.createInitialState();
  }
}
