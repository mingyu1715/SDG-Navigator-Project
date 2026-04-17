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

const RELATED_RESOURCES = [
  {
    type: "VIDEO",
    title: "UNESCO Education Playlist",
    description: "교육을 받지 못한 아동의 현실을 다룬 영상 모음",
    url: "https://www.youtube.com/@UNESCO/videos"
  },
  {
    type: "ARTICLE",
    title: "UNICEF: Education",
    description: "문해율 격차와 교육 접근성 문제를 설명한 기사",
    url: "https://www.unicef.org/education"
  },
  {
    type: "REPORT",
    title: "UNESCO UIS Literacy Data",
    description: "UNESCO 기반 문해율 통계를 확인할 수 있는 보고서 페이지",
    url: "https://uis.unesco.org/en/topic/literacy"
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
    blur: `${(0.2 + intensity * 4.9).toFixed(2)}px`
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

export const SDG04_COUNTRIES = COUNTRIES;

export function createSdg04InitialState() {
  const defaultCountry = COUNTRIES.find((country) => country.name === "India") || COUNTRIES[0];
  return {
    selectedCountry: defaultCountry,
    currentSentenceIndex: 0,
    showKorean: true,
    hasStarted: false
  };
}

export function getNextSdg04SentenceIndex(currentIndex) {
  return (currentIndex + 1) % SENTENCES.length;
}

export function renderSdg04ResourceItems() {
  return RELATED_RESOURCES.map((resource) => `
      <article class="sdg04-resource-item">
        <p class="sdg04-resource-type">${resource.type}</p>
        <h4 class="sdg04-resource-title">${resource.title}</h4>
        <p class="sdg04-resource-desc">${resource.description}</p>
        <a class="sdg04-resource-open" href="${resource.url}" target="_blank" rel="noopener noreferrer">열기</a>
      </article>
    `).join("");
}

export function getSdg04CountryInfoView(country) {
  return {
    nameKo: country.nameKo,
    meta: `${country.name} · ${country.region}`,
    literacyRate: `${country.literacyRate}%`,
    literacyFillWidth: `${country.literacyRate}%`,
    contextMessage: contextForRate(country)
  };
}

export function getSdg04SentenceView(state, country) {
  const sentence = SENTENCES[state.currentSentenceIndex];
  const originalText = state.showKorean ? sentence.textKo : sentence.text;
  const distorted = distortText(originalText, country.literacyRate);

  return {
    toggleLabel: state.showKorean ? "English" : "한국어",
    category: sentence.category,
    sentenceCount: `${state.currentSentenceIndex + 1} / ${SENTENCES.length}`,
    distortedText: distorted.text,
    blur: distorted.blur,
    impact: state.showKorean ? sentence.impactKo : sentence.impact,
    hideImpact: country.literacyRate >= 80
  };
}
