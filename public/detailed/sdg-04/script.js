const GOAL_ID = 4;

const countries = [
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

const sentences = [
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

const state = {
  selectedCountry: null,
  currentSentenceIndex: 0,
  showKorean: true,
  hasStarted: false
};

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value;
}

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

function renderCountryButtons(targetId) {
  const host = byId(targetId);
  if (!host) return;
  host.innerHTML = "";

  countries.forEach((country, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "country-btn";
    btn.textContent = `${country.nameKo} ${country.literacyRate}%`;
    if (state.selectedCountry && state.selectedCountry.name === country.name) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      state.selectedCountry = country;
      if (!state.hasStarted) {
        state.hasStarted = true;
        byId("heroSection").classList.add("hidden");
        byId("experienceSection").classList.remove("hidden");
      }
      renderAll();
    });
    host.appendChild(btn);
  });
}

function renderSentence() {
  const sentence = sentences[state.currentSentenceIndex];
  const original = state.showKorean ? sentence.textKo : sentence.text;
  const distorted = distortText(original, state.selectedCountry.literacyRate);

  setText("categoryBadge", sentence.category);
  setText("sentenceCount", `${state.currentSentenceIndex + 1} / ${sentences.length}`);

  const distEl = byId("distortedText");
  if (distEl) {
    distEl.textContent = distorted.text;
    distEl.style.setProperty("--blur", `${distorted.blur}px`);
  }

  const impact = state.showKorean ? sentence.impactKo : sentence.impact;
  const impactEl = byId("impactText");
  if (impactEl) {
    impactEl.textContent = impact;
    impactEl.classList.toggle("hidden", state.selectedCountry.literacyRate >= 80);
  }
}

function renderCountryInfo() {
  const country = state.selectedCountry;
  setText("countryNameKo", country.nameKo);
  setText("countryMeta", `${country.name} · ${country.region}`);
  setText("literacyRate", `${country.literacyRate}%`);

  const fill = byId("literacyFill");
  if (fill) {
    fill.style.width = `${country.literacyRate}%`;
  }

  setText("contextMessage", contextForRate(country));
}

function renderAll() {
  if (!state.selectedCountry) return;
  renderCountryButtons("heroCountryGrid");
  renderCountryButtons("compareCountryGrid");
  renderCountryInfo();
  renderSentence();
}

async function loadGoal() {
  try {
    const res = await fetch(`/api/sdgs/${GOAL_ID}`);
    if (!res.ok) throw new Error(`Failed to load goal: ${res.status}`);
    const goal = await res.json();
    setText("goalTitle", `SDG ${String(goal.id).padStart(2, "0")}. ${goal.title}`);
    setText("goalSub", goal.subtitle || "양질의 교육을 보장하고 평생학습 기회를 증진합니다.");
    setText("goalDesc", goal.description || "교육 접근성과 학습 기회 격차를 줄이는 목표입니다.");
    setText("backendStatus", "API 연결 완료");
  } catch (error) {
    setText("backendStatus", `에러: ${error.message}`);
  }

  try {
    const visitRes = await fetch(`/api/sdgs/${GOAL_ID}/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "sdg04-legacy" })
    });
    if (visitRes.ok) {
      const visit = await visitRes.json();
      setText("visitMeta", `이 목표 상세 페이지 방문 수: ${visit.visits}`);
    }
  } catch {
    setText("visitMeta", "방문 집계 정보를 가져오지 못했습니다.");
  }
}

async function callSampleAction() {
  const status = byId("backendStatus");
  if (status) status.textContent = "샘플 액션 호출 중...";
  try {
    const res = await fetch(`/api/sdgs/${GOAL_ID}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "literacy-sim" })
    });
    if (!res.ok) throw new Error(`Action failed: ${res.status}`);
    const data = await res.json();
    if (status) status.textContent = `샘플 액션 성공: ${data.message}`;
  } catch (error) {
    if (status) status.textContent = `샘플 액션 실패: ${error.message}`;
  }
}

function bindEvents() {
  const langToggle = byId("langToggle");
  const prevBtn = byId("prevSentence");
  const nextBtn = byId("nextSentence");
  const simulateBtn = byId("simulateBtn");
  const backBtn = byId("backBtn");
  const fullscreenBtn = byId("fullscreenBtn");

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      state.showKorean = !state.showKorean;
      langToggle.textContent = state.showKorean ? "English" : "한국어";
      if (state.selectedCountry) renderSentence();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      state.currentSentenceIndex = (state.currentSentenceIndex - 1 + sentences.length) % sentences.length;
      if (state.selectedCountry) renderSentence();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      state.currentSentenceIndex = (state.currentSentenceIndex + 1) % sentences.length;
      if (state.selectedCountry) renderSentence();
    });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {
      void callSampleAction();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "sdg:back-main", goalId: GOAL_ID }, window.location.origin);
        return;
      }
      window.location.href = "/index.html";
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch {
        // ignore
      }
    });
  }
}

async function init() {
  bindEvents();
  renderCountryButtons("heroCountryGrid");
  renderCountryButtons("compareCountryGrid");
  state.selectedCountry = countries[4];
  await loadGoal();
}

void init();
