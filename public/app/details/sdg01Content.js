const LIFE_SCENARIOS = [
  {
    country: "에티오피아",
    region: "아디스아바바 외곽",
    flag: "ET",
    lat: 8.9806,
    lon: 38.7578,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 15,
    waterDistanceKm: 4,
    lifeExpectancy: 65,
    summary: "불안정한 비공식 노동 수입에 의존하는 가정에서 삶이 시작됩니다.",
    narrative: "물과 생계를 먼저 해결해야 해서 학업과 건강 관리가 뒤로 밀리는 날이 많습니다."
  },
  {
    country: "마다가스카르",
    region: "안드로이 남부 농촌",
    flag: "MG",
    lat: -24.6943,
    lon: 45.945,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 12,
    waterDistanceKm: 6,
    lifeExpectancy: 64,
    summary: "가뭄과 식량 불안이 반복되는 농촌 환경에서 태어납니다.",
    narrative: "작황이 나쁘면 교육과 의료는 가장 먼저 포기해야 하는 선택지가 됩니다."
  },
  {
    country: "시에라리온",
    region: "프리타운 외곽 정착촌",
    flag: "SL",
    lat: 8.4657,
    lon: -13.2317,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 19,
    waterDistanceKm: 3.5,
    lifeExpectancy: 61,
    summary: "도시 외곽 저소득 정착촌에서 출발선을 갖게 됩니다.",
    narrative: "폭우와 질병 위험이 반복되고, 안전한 인프라 접근은 늘 제한적입니다."
  },
  {
    country: "네팔",
    region: "카르날리 산악지대",
    flag: "NP",
    lat: 29.3863,
    lon: 81.3887,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 28,
    waterDistanceKm: 2.8,
    lifeExpectancy: 69,
    summary: "교통 인프라가 약한 산악 지역에서 삶이 시작됩니다.",
    narrative: "학교와 병원이 있어도 날씨와 길 상태가 접근성을 크게 좌우합니다."
  },
  {
    country: "니제르",
    region: "마라디 농촌 권역",
    flag: "NE",
    lat: 13.5,
    lon: 7.1017,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 11,
    waterDistanceKm: 5.2,
    lifeExpectancy: 62,
    summary: "깨끗한 물과 영양, 의료 접근이 모두 제한적인 환경입니다.",
    narrative: "재능보다 환경의 제약이 먼저 작동해 어린 시절의 선택지가 좁아집니다."
  },
  {
    country: "차드",
    region: "라크주 농촌 지역",
    flag: "TD",
    lat: 13.1482,
    lon: 14.7147,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 13,
    waterDistanceKm: 5.6,
    lifeExpectancy: 61,
    summary: "기후 충격과 불안정한 생계가 겹친 지역에서 태어납니다.",
    narrative: "식수와 의료가 동시에 부족한 날에는 하루의 우선순위가 생존에만 집중됩니다."
  },
  {
    country: "모잠비크",
    region: "잠베지아 북부",
    flag: "MZ",
    lat: -16.5639,
    lon: 36.6094,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 22,
    waterDistanceKm: 3.9,
    lifeExpectancy: 62,
    summary: "농촌 기반의 저소득 가구에서 삶이 시작됩니다.",
    narrative: "기초 보건과 교육 서비스가 멀리 떨어져 있어 이동 자체가 큰 비용이 됩니다."
  },
  {
    country: "예멘",
    region: "타이즈 외곽",
    flag: "YE",
    lat: 13.5795,
    lon: 44.0209,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 18,
    waterDistanceKm: 4.8,
    lifeExpectancy: 64,
    summary: "불안정한 기반시설 속에서 생계가 우선인 삶을 시작합니다.",
    narrative: "학교와 병원 접근이 흔들리면 가정의 선택지는 빠르게 줄어듭니다."
  },
  {
    country: "아이티",
    region: "포르토프랭스 외곽",
    flag: "HT",
    lat: 18.5944,
    lon: -72.3074,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 24,
    waterDistanceKm: 3.2,
    lifeExpectancy: 64,
    summary: "도시 외곽의 취약한 생활 인프라 안에서 출발합니다.",
    narrative: "재난과 경제 불안정이 반복되면 기본적인 생활비조차 예측하기 어려워집니다."
  },
  {
    country: "말라위",
    region: "은치시 농촌",
    flag: "MW",
    lat: -13.9506,
    lon: 33.7741,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 26,
    waterDistanceKm: 3.7,
    lifeExpectancy: 66,
    summary: "농업 의존도가 높은 저소득 지역에서 태어납니다.",
    narrative: "수확 시기와 물 접근성이 가계 소득과 학업 지속 여부를 크게 좌우합니다."
  },
  {
    country: "콩고민주공화국",
    region: "카사이 내륙",
    flag: "CD",
    lat: -6.1253,
    lon: 22.4826,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 17,
    waterDistanceKm: 4.6,
    lifeExpectancy: 60,
    summary: "기초 인프라가 취약한 내륙 지역에서 삶이 시작됩니다.",
    narrative: "안전한 식수와 의료 접근이 불안정하면 작은 질병도 큰 위기로 이어질 수 있습니다."
  },
  {
    country: "아프가니스탄",
    region: "바다흐샨 산악 지역",
    flag: "AF",
    lat: 36.7348,
    lon: 70.8119,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 16,
    waterDistanceKm: 4.1,
    lifeExpectancy: 63,
    summary: "원거리 이동이 일상인 산악 환경에서 태어납니다.",
    narrative: "안정적인 교육과 보건 서비스에 접근하려면 긴 이동과 높은 기회비용을 감수해야 합니다."
  },
  {
    country: "수단",
    region: "다르푸르 서부",
    flag: "SD",
    lat: 13.4885,
    lon: 24.8444,
    incomeTier: "소득 하위 10% 가구",
    educationChance: 14,
    waterDistanceKm: 5.1,
    lifeExpectancy: 62,
    summary: "자원 접근이 불안정한 지역에서 생존 중심의 하루를 시작합니다.",
    narrative: "식량과 물, 의료의 불확실성이 겹치면 미래 계획보다 당장의 안전이 우선됩니다."
  },
  {
    country: "파푸아뉴기니",
    region: "하일랜즈 내륙",
    flag: "PG",
    lat: -6.3149,
    lon: 143.9555,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 23,
    waterDistanceKm: 3.4,
    lifeExpectancy: 65,
    summary: "지리적 고립이 큰 내륙 지역에서 삶이 시작됩니다.",
    narrative: "도로와 공공서비스의 부족은 교육과 의료 접근 비용을 크게 높입니다."
  },
  {
    country: "라이베리아",
    region: "몽로비아 외곽",
    flag: "LR",
    lat: 6.2907,
    lon: -10.7605,
    incomeTier: "소득 하위 20% 가구",
    educationChance: 21,
    waterDistanceKm: 3.8,
    lifeExpectancy: 64,
    summary: "기초 생활 인프라가 부족한 도시 외곽에서 태어납니다.",
    narrative: "작은 경제 충격에도 가계가 흔들리기 쉬워 장기 계획이 어려워집니다."
  }
];

let threeScriptPromise = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function damp(current, target, factor) {
  return current + (target - current) * factor;
}

function formatWaterAccess(distanceKm) {
  const oneWayMin = Math.round(distanceKm * 12);
  const roundTripMin = oneWayMin * 2;
  const hour = Math.floor(roundTripMin / 60);
  const minute = roundTripMin % 60;
  const timeText = hour > 0 ? `${hour}시간 ${minute}분` : `${minute}분`;
  return `하루 ${distanceKm}km (도보 왕복 약 ${timeText})`;
}

function estimateDailyBudgetKrw(scenario) {
  const tierMatch = scenario.incomeTier.match(/(\d+)%/);
  const tierPercent = tierMatch ? Number(tierMatch[1]) : 20;
  const tierBase = tierPercent <= 10 ? 3700 : 4900;
  const waterPenalty = Math.round(scenario.waterDistanceKm * 180);
  const educationPenalty = Math.max(0, Math.round((30 - scenario.educationChance) * 35));
  const lifePenalty = Math.max(0, Math.round((68 - scenario.lifeExpectancy) * 70));
  const roughBudget = tierBase - waterPenalty - educationPenalty - lifePenalty;
  const boundedBudget = clamp(roughBudget, 1800, 6200);
  return Math.round(boundedBudget / 100) * 100;
}

function estimateMealCoverage(dailyBudgetKrw) {
  if (dailyBudgetKrw < 2600) return 1;
  if (dailyBudgetKrw < 4200) return 2;
  return 3;
}

function loadThreeGlobal() {
  if (window.THREE) {
    return Promise.resolve(window.THREE);
  }

  if (threeScriptPromise) {
    return threeScriptPromise;
  }

  threeScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.async = true;
    script.onload = () => resolve(window.THREE || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return threeScriptPromise;
}

export class Sdg01DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg01";
    this.refs = {};
    this.THREE = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.globeGroup = null;
    this.galaxyGroup = null;
    this.globe = null;
    this.marker = null;
    this.markerRing = null;
    this.currentScenario = null;
    this.targetRotation = null;
    this.spinVelocity = 0.0035;
    this.lockOnResult = false;
    this.lotteryStartedAt = 0;
    this.rafId = null;
    this.midTimer = null;
    this.finishTimer = null;
    this.disposeRequested = false;
    this.onResize = () => this.resizeScene();
  }

  render() {
    if (!this.host) return;
    this.disposeRequested = false;
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    void this.initThreeSceneAsync();
  }

  async initThreeSceneAsync() {
    const three = await loadThreeGlobal();
    if (this.disposeRequested) return;

    if (!three) {
      this.showFallback();
      return;
    }

    this.THREE = three;
    this.initScene();
    this.animate();
    this.resizeScene();
    window.addEventListener("resize", this.onResize);
  }

  template() {
    return `
      <div class="sdg01-exp" data-role="root">
        <header class="sdg01-hero">
          <p class="sdg01-kicker">SDG 01 EXPERIENCE</p>
          <p class="sdg01-main-title">생존의 로또</p>
          <p class="sdg01-subtitle">No Poverty</p>
        </header>

        <main class="sdg01-stage">
          <section class="sdg01-globe-panel">
            <div class="sdg01-globe-frame">
              <canvas class="sdg01-canvas" data-role="canvas"></canvas>
              <div class="sdg01-globe-overlay">
                <div class="sdg01-status-chip" data-role="statusChip">생존의 로또</div>
                <div class="sdg01-target-readout" data-role="targetReadout">
                  버튼을 누르면 지구 반대편의 삶이 시작됩니다.
                </div>
              </div>
            </div>
            <div class="sdg01-cta-wrap">
              <button class="sdg01-launch-button" data-role="launchButton" type="button">나의 새로운 삶 시작하기</button>
            </div>
          </section>

          <aside class="sdg01-result-panel" data-role="resultPanel" aria-live="polite">
            <div class="sdg01-panel-shell">
              <div class="sdg01-panel-top">
                <div>
                  <span class="sdg01-panel-kicker">📍 선택 지역</span>
                  <h3 data-role="resultTitle">아직 결과가 선택되지 않았습니다</h3>
                </div>
                <button class="sdg01-panel-close" data-role="panelCloseButton" type="button" aria-label="상세 패널 닫기">×</button>
              </div>

              <p class="sdg01-panel-summary" data-role="resultSummary">핵심 생존 지표만 간단히 보여줍니다.</p>

              <div class="sdg01-fact-list">
                <article class="sdg01-fact-item">
                  <span class="sdg01-fact-label">태어난 곳</span>
                  <strong class="sdg01-fact-value" data-role="birthPlace">-</strong>
                  <span class="sdg01-fact-note" data-role="regionNote">무작위로 선택된 출생 지역입니다.</span>
                </article>

                <article class="sdg01-fact-item">
                  <span class="sdg01-fact-label">하루 생계 가능 금액</span>
                  <strong class="sdg01-fact-value" data-role="incomeTier">-</strong>
                  <span class="sdg01-fact-note" data-role="incomeNote">하루 세 끼 기준 식사 가능 수준</span>
                </article>

                <article class="sdg01-fact-item">
                  <span class="sdg01-fact-label">물 접근성</span>
                  <strong class="sdg01-fact-value" data-role="waterAccess">-</strong>
                  <span class="sdg01-fact-note" data-role="waterNote">식수를 얻기 위해 매일 써야 하는 시간</span>
                </article>
              </div>

              <article class="sdg01-reality-block">
                <span class="sdg01-fact-label">오늘의 현실</span>
                <p class="sdg01-reality-text" data-role="narrative">결과를 선택하면 이곳에 현실 설명이 표시됩니다.</p>
              </article>

              <div class="sdg01-panel-actions">
                <button class="sdg01-secondary-button" data-role="rerollButton" type="button">다른 삶 다시 보기</button>
              </div>
            </div>
          </aside>
        </main>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      canvas: get("canvas"),
      launchButton: get("launchButton"),
      rerollButton: get("rerollButton"),
      panelCloseButton: get("panelCloseButton"),
      resultPanel: get("resultPanel"),
      statusChip: get("statusChip"),
      targetReadout: get("targetReadout"),
      resultTitle: get("resultTitle"),
      resultSummary: get("resultSummary"),
      birthPlace: get("birthPlace"),
      regionNote: get("regionNote"),
      incomeTier: get("incomeTier"),
      incomeNote: get("incomeNote"),
      waterAccess: get("waterAccess"),
      waterNote: get("waterNote"),
      narrative: get("narrative")
    };
  }

  bindEvents() {
    if (this.refs.launchButton) {
      this.refs.launchButton.addEventListener("click", () => this.startLottery("launch"));
    }
    if (this.refs.rerollButton) {
      this.refs.rerollButton.addEventListener("click", () => this.startLottery("reroll"));
    }
    if (this.refs.panelCloseButton) {
      this.refs.panelCloseButton.addEventListener("click", () => {
        this.refs.root?.classList.remove("reveal");
      });
    }
  }

  showFallback() {
    this.host.innerHTML = `
      <div class="sdg01-fallback">
        3D 시뮬레이션을 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.
      </div>
    `;
  }

  initScene() {
    const { canvas } = this.refs;
    const THREE = this.THREE;
    if (!canvas || !THREE) return;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5.8);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.25);
    directionalLight.position.set(5, 3, 6);
    this.scene.add(ambientLight, directionalLight);

    this.createGalaxyBackdrop();

    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
    const earthBump = textureLoader.load("https://threejs.org/examples/textures/planets/earth_bump_2048.jpg");
    const earthSpecular = textureLoader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");

    this.globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 96, 96),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        bumpMap: earthBump,
        bumpScale: 0.045,
        roughnessMap: earthSpecular,
        metalnessMap: earthSpecular,
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.92
      })
    );
    this.globeGroup.add(this.globe);

    this.marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0xff6f47 })
    );
    this.marker.visible = false;
    this.globe.add(this.marker);

    this.markerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.07, 48),
      new THREE.MeshBasicMaterial({
        color: 0xff9f80,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      })
    );
    this.markerRing.visible = false;
    this.globe.add(this.markerRing);
  }

  createGalaxyBackdrop() {
    const THREE = this.THREE;
    if (!THREE || !this.scene) return;

    this.galaxyGroup = new THREE.Group();
    this.scene.add(this.galaxyGroup);

    const deepStars = this.createStarPoints({
      count: 1800,
      minRadius: 42,
      maxRadius: 80,
      color: 0xaec6ef,
      size: 0.13,
      opacity: 0.68
    });
    this.galaxyGroup.add(deepStars);

    const brightStars = this.createStarPoints({
      count: 700,
      minRadius: 38,
      maxRadius: 70,
      color: 0xe8f2ff,
      size: 0.2,
      opacity: 0.92
    });
    this.galaxyGroup.add(brightStars);
  }

  createStarPoints(config) {
    const THREE = this.THREE;
    const positions = new Float32Array(config.count * 3);
    for (let i = 0; i < config.count; i += 1) {
      const radius = THREE.MathUtils.lerp(config.minRadius, config.maxRadius, Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);
      positions[i * 3] = radius * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * sinPhi * Math.sin(theta);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: config.color,
      size: config.size,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false
    });
    return new THREE.Points(geometry, material);
  }

  pickScenario(previousScenario) {
    if (LIFE_SCENARIOS.length <= 1) return LIFE_SCENARIOS[0];
    let next = LIFE_SCENARIOS[Math.floor(Math.random() * LIFE_SCENARIOS.length)];
    while (previousScenario && next.country === previousScenario.country && next.region === previousScenario.region) {
      next = LIFE_SCENARIOS[Math.floor(Math.random() * LIFE_SCENARIOS.length)];
    }
    return next;
  }

  latLonToVector3(lat, lon, radius) {
    const THREE = this.THREE;
    const latRad = THREE.MathUtils.degToRad(lat);
    const lonRad = THREE.MathUtils.degToRad(lon);
    return new THREE.Vector3(
      radius * Math.cos(latRad) * Math.cos(lonRad),
      radius * Math.sin(latRad),
      -radius * Math.cos(latRad) * Math.sin(lonRad)
    );
  }

  getTargetRotation(lat, lon) {
    const THREE = this.THREE;
    const surfacePoint = this.latLonToVector3(lat, lon, 1).normalize();
    const frontDirection = new THREE.Vector3(0, 0, 1);
    const q = new THREE.Quaternion().setFromUnitVectors(surfacePoint, frontDirection);
    const euler = new THREE.Euler().setFromQuaternion(q, "YXZ");
    return { x: euler.x, y: euler.y };
  }

  startLottery(source = "launch") {
    if (!this.refs.root) return;

    this.refs.launchButton.disabled = true;
    this.refs.rerollButton.disabled = true;
    this.refs.root.classList.remove("reveal");
    this.refs.root.classList.add("spinning");

    this.currentScenario = this.pickScenario(this.currentScenario);
    this.targetRotation = this.getTargetRotation(this.currentScenario.lat, this.currentScenario.lon);
    this.lotteryStartedAt = performance.now();
    this.lockOnResult = false;
    this.spinVelocity = 0.28;
    if (this.marker) this.marker.visible = false;
    if (this.markerRing) this.markerRing.visible = false;

    this.refs.statusChip.textContent = source === "reroll" ? "다시 추첨 중" : "회전 중";
    this.refs.targetReadout.textContent = "새로운 출생지를 선택하고 있습니다.";

    window.clearTimeout(this.midTimer);
    this.midTimer = window.setTimeout(() => {
      if (this.refs.statusChip) this.refs.statusChip.textContent = "도착 중";
    }, 1400);

    window.clearTimeout(this.finishTimer);
    this.finishTimer = window.setTimeout(() => {
      if (this.currentScenario) {
        this.revealScenario(this.currentScenario);
      }
    }, 3300);
  }

  revealScenario(scenario) {
    if (!this.refs.root) return;

    this.refs.root.classList.remove("spinning");
    this.refs.root.classList.add("reveal");
    this.lockOnResult = true;
    this.spinVelocity = 0;

    this.refs.statusChip.textContent = "결과";
    this.refs.targetReadout.textContent = `${scenario.country} ${scenario.region}에서 삶이 시작됩니다.`;
    this.refs.resultTitle.textContent = `${scenario.country}에서 삶이 시작됩니다`;
    this.refs.resultSummary.textContent = scenario.summary;
    this.refs.birthPlace.textContent = `${scenario.flag} ${scenario.country}, ${scenario.region}`;
    this.refs.regionNote.textContent = "무작위로 선택된 출생 지역";

    const dailyBudgetKrw = estimateDailyBudgetKrw(scenario);
    const mealCoverage = estimateMealCoverage(dailyBudgetKrw);
    this.refs.incomeTier.textContent = `약 ${dailyBudgetKrw.toLocaleString("ko-KR")}원/일`;
    this.refs.incomeNote.textContent = `하루 세 끼 중 약 ${mealCoverage}끼 정도만 안정적으로 가능`;
    this.refs.waterAccess.textContent = formatWaterAccess(scenario.waterDistanceKm);
    this.refs.waterNote.textContent = "식수를 위해 이동에 쓰는 하루 시간";
    this.refs.narrative.textContent = scenario.narrative;

    if (this.marker) this.marker.visible = true;
    if (this.markerRing) this.markerRing.visible = true;

    this.refs.launchButton.disabled = false;
    this.refs.rerollButton.disabled = false;
  }

  animate() {
    if (this.disposeRequested) return;
    this.rafId = window.requestAnimationFrame(() => this.animate());

    if (!this.renderer || !this.scene || !this.camera || !this.globeGroup) return;

    const now = performance.now();
    const isSpinning = this.refs.root?.classList.contains("spinning");
    const isReveal = this.refs.root?.classList.contains("reveal");
    const rawProgress = isSpinning && this.lotteryStartedAt ? clamp((now - this.lotteryStartedAt) / 3300, 0, 1) : 0;
    const diveProgress = easeInOutCubic(clamp((rawProgress - 0.12) / 0.88, 0, 1));
    const galaxySpin = isSpinning ? 0.0015 : 0.00045;

    if (this.galaxyGroup) {
      this.galaxyGroup.rotation.y += galaxySpin;
      this.galaxyGroup.rotation.z += galaxySpin * 0.35;
      this.galaxyGroup.rotation.x = Math.sin(now * 0.00006) * 0.08;
    }

    if (!this.lockOnResult) {
      if (this.spinVelocity > 0.006) {
        this.spinVelocity *= 0.972;
      } else {
        this.spinVelocity = 0.0035;
      }
      this.globeGroup.rotation.y += this.spinVelocity;
    } else if (this.targetRotation) {
      this.globeGroup.rotation.x = this.targetRotation.x;
      this.globeGroup.rotation.y = this.targetRotation.y;
    }

    if (this.targetRotation) {
      if (!this.lockOnResult) {
        const alignFactor = 0.05 + diveProgress * 0.06;
        this.globeGroup.rotation.y = damp(this.globeGroup.rotation.y, this.targetRotation.y, alignFactor);
        this.globeGroup.rotation.x = damp(this.globeGroup.rotation.x, this.targetRotation.x, alignFactor);
      }
    } else {
      this.globeGroup.rotation.x = damp(this.globeGroup.rotation.x, -0.16, 0.04);
    }

    let cameraTargetZ = 5.8;
    let cameraTargetFov = 42;
    let cameraTargetX = 0;
    let cameraTargetY = 0;

    if (isSpinning) {
      cameraTargetZ = lerp(6.1, 3.6, diveProgress);
      cameraTargetFov = lerp(48, 36, diveProgress);
      if (this.targetRotation) {
        cameraTargetX = lerp(0, clamp(-this.targetRotation.y * 0.22, -0.34, 0.34), diveProgress);
        cameraTargetY = lerp(0, clamp(this.targetRotation.x * 0.18, -0.24, 0.24), diveProgress);
      }
    } else if (isReveal) {
      cameraTargetZ = 3.95;
      cameraTargetFov = 36;
    }

    if (isReveal) {
      this.camera.position.set(cameraTargetX, cameraTargetY, cameraTargetZ);
      this.camera.fov = cameraTargetFov;
    } else {
      this.camera.position.x = damp(this.camera.position.x, cameraTargetX, 0.08);
      this.camera.position.y = damp(this.camera.position.y, cameraTargetY, 0.08);
      this.camera.position.z = damp(this.camera.position.z, cameraTargetZ, 0.07);
      this.camera.fov = damp(this.camera.fov, cameraTargetFov, 0.07);
    }
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    if (this.currentScenario && this.marker && this.markerRing) {
      const point = this.latLonToVector3(this.currentScenario.lat, this.currentScenario.lon, 1.41);
      this.marker.position.copy(point);
      this.marker.lookAt(0, 0, 0);

      const ringPoint = this.latLonToVector3(this.currentScenario.lat, this.currentScenario.lon, 1.44);
      this.markerRing.position.copy(ringPoint);
      this.markerRing.lookAt(0, 0, 0);
      this.markerRing.scale.setScalar(1 + Math.sin(Date.now() * 0.008) * 0.07);
    }

    this.renderer.render(this.scene, this.camera);
  }

  resizeScene() {
    if (!this.renderer || !this.camera || !this.refs.canvas) return;
    const frame = this.refs.canvas.getBoundingClientRect();
    const width = Math.max(280, Math.floor(frame.width));
    const height = Math.max(280, Math.floor(frame.height));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  disposeObject3D(object3D) {
    if (!object3D) return;
    if (object3D.children && object3D.children.length) {
      while (object3D.children.length) {
        const child = object3D.children[0];
        object3D.remove(child);
        this.disposeObject3D(child);
      }
    }

    if (object3D.geometry) {
      object3D.geometry.dispose();
    }
    if (Array.isArray(object3D.material)) {
      object3D.material.forEach((mat) => mat && mat.dispose());
    } else if (object3D.material) {
      object3D.material.dispose();
    }
  }

  destroyScene() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.clearTimeout(this.midTimer);
    window.clearTimeout(this.finishTimer);
    this.midTimer = null;
    this.finishTimer = null;

    if (this.scene) {
      this.disposeObject3D(this.scene);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }

    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.globeGroup = null;
    this.galaxyGroup = null;
    this.globe = null;
    this.marker = null;
    this.markerRing = null;
  }

  reset() {
    void this.render();
  }

  destroy() {
    this.disposeRequested = true;
    window.removeEventListener("resize", this.onResize);
    this.destroyScene();
    this.refs = {};
    if (this.host) {
      this.host.innerHTML = "";
    }
  }
}
