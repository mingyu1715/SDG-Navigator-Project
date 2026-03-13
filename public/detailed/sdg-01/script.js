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

const experienceEl = document.getElementById("experience");
const launchButton = document.getElementById("launchButton");
const rerollButton = document.getElementById("rerollButton");
const goalHero = document.querySelector(".goal-hero");
const resultPanel = document.getElementById("resultPanel");
const panelCloseButton = document.getElementById("panelCloseButton");
const statusChip = document.getElementById("statusChip");
const targetReadout = document.getElementById("targetReadout");
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const birthPlace = document.getElementById("birthPlace");
const regionNote = document.getElementById("regionNote");
const incomeTier = document.getElementById("incomeTier");
const incomeNote = document.getElementById("incomeNote");
const waterAccess = document.getElementById("waterAccess");
const waterNote = document.getElementById("waterNote");
const narrative = document.getElementById("narrative");
const canvas = document.getElementById("globeCanvas");
const COUNTRY_GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
const RETURN_RECT_SESSION_KEY = "sdgReturnCardRect";
const MAIN_HISTORY_URL = "/";
const ISO2_TO_ISO3 = {
  ET: "ETH",
  MG: "MDG",
  SL: "SLE",
  NP: "NPL",
  NE: "NER",
  TD: "TCD",
  MZ: "MOZ",
  YE: "YEM",
  HT: "HTI",
  MW: "MWI",
  CD: "COD",
  AF: "AFG",
  SD: "SDN",
  PG: "PNG",
  LR: "LBR"
};

let renderer;
let scene;
let camera;
let globeGroup;
let galaxyGroup;
let globe;
let marker;
let markerRing;
let countryOutlineGroup;
let currentScenario = null;
let spinVelocity = 0.0035;
let targetRotation = null;
let lockOnResult = false;
let lotteryStartedAt = 0;
let countryBordersReady = false;
let countryFeaturesByIso3 = new Map();
let pendingCountryIso2 = null;
let returningToMain = false;

initScene();
bindEvents();
animate();
initHistoryRouting();

function initScene() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.25);
  directionalLight.position.set(5, 3, 6);
  scene.add(ambientLight, directionalLight);
  createGalaxyBackdrop();

  globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
  const earthBump = textureLoader.load("https://threejs.org/examples/textures/planets/earth_bump_2048.jpg");
  const earthSpecular = textureLoader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");

  globe = new THREE.Mesh(
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
  globeGroup.add(globe);

  marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.024, 18, 18),
    new THREE.MeshBasicMaterial({ color: 0xff6f47 })
  );
  marker.visible = false;
  globe.add(marker);

  markerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.05, 0.07, 48),
    new THREE.MeshBasicMaterial({
      color: 0xff9f80,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    })
  );
  markerRing.visible = false;
  globe.add(markerRing);

  countryOutlineGroup = new THREE.Group();
  globe.add(countryOutlineGroup);

  loadCountryBorders();
  resizeScene();
  window.addEventListener("resize", resizeScene);
}

function bindEvents() {
  launchButton.addEventListener("click", () => startLottery("launch"));
  rerollButton.addEventListener("click", () => startLottery("reroll"));
  if (panelCloseButton) {
    panelCloseButton.addEventListener("click", () => {
      experienceEl.classList.remove("reveal");
    });
  }
  bindMainReturnLinks();
}

function bindMainReturnLinks() {
  const selectors = [
    "a[href='/index.html']",
    "a[href='/']",
    "a[href='index.html']",
    "a[href='./index.html']"
  ];
  const links = document.querySelectorAll(selectors.join(","));
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      void navigateToMainWithReverse();
    });
  });
}

function initHistoryRouting() {
  const expectedRoute = "/detailed/sdg-01/";
  if (window.location.pathname !== expectedRoute) {
    history.replaceState(history.state || {}, "", expectedRoute);
  }
}

async function navigateToMainWithReverse() {
  if (returningToMain) return;
  returningToMain = true;

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "sdg:back-main", goalId: 1 }, window.location.origin);
    returningToMain = false;
    return;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!("animate" in experienceEl)) {
    window.location.href = "/index.html";
    return;
  }

  let targetLeft = (vw - Math.min(250, vw * 0.58)) / 2;
  let targetTop = (vh - Math.min(250, vw * 0.58) * (36 / 25)) / 2;
  let targetWidth = Math.min(250, vw * 0.58);
  let targetHeight = targetWidth * (36 / 25);
  try {
    const saved = JSON.parse(sessionStorage.getItem(RETURN_RECT_SESSION_KEY) || "null");
    if (saved && Number(saved.goalId) === 1) {
      targetLeft = saved.left * vw;
      targetTop = saved.top * vh;
      targetWidth = saved.width * vw;
      targetHeight = saved.height * vh;
    }
  } catch {
    // keep fallback target
  }

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  experienceEl.style.position = "relative";
  experienceEl.style.zIndex = "9999";
  experienceEl.style.willChange = "transform, clip-path, filter";

  const targetScale = Math.min(targetWidth / vw, targetHeight / vh);
  const targetCenterX = targetLeft + targetWidth / 2;
  const targetCenterY = targetTop + targetHeight / 2;
  const dx = targetCenterX - vw / 2;
  const dy = targetCenterY - vh / 2;
  const insetTop = Math.max(0, targetTop);
  const insetRight = Math.max(0, vw - (targetLeft + targetWidth));
  const insetBottom = Math.max(0, vh - (targetTop + targetHeight));
  const insetLeft = Math.max(0, targetLeft);

  const shrink = experienceEl.animate(
    [
      {
        transformOrigin: "50% 50%",
        transform: "translate3d(0, 0, 0) scale(1)",
        clipPath: "inset(0px 0px 0px 0px round 0px)",
        filter: "brightness(1)"
      },
      {
        transformOrigin: "50% 50%",
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${targetScale})`,
        clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 14px)`,
        filter: "brightness(0.96)"
      }
    ],
    { duration: 980, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
  );

  await shrink.finished.catch(() => null);
  window.location.href = "/index.html";
}

function startLottery(source = "launch") {
  if (source === "launch" && goalHero) {
    goalHero.classList.add("is-hidden");
  }

  launchButton.disabled = true;
  rerollButton.disabled = true;
  experienceEl.classList.remove("reveal");
  experienceEl.classList.add("spinning");

  currentScenario = pickScenario(currentScenario);
  targetRotation = getTargetRotation(currentScenario.lat, currentScenario.lon);
  lotteryStartedAt = performance.now();
  lockOnResult = false;
  spinVelocity = 0.28;
  marker.visible = false;
  markerRing.visible = false;
  clearCountryOutline();
  pendingCountryIso2 = null;

  statusChip.textContent = "회전 중";
  targetReadout.textContent = "새로운 출생지를 선택하고 있습니다.";

  window.clearTimeout(startLottery.midTimer);
  startLottery.midTimer = window.setTimeout(() => {
    statusChip.textContent = "도착 중";
  }, 1400);

  window.clearTimeout(startLottery.finishTimer);
  startLottery.finishTimer = window.setTimeout(() => {
    revealScenario(currentScenario);
  }, 3300);
}

function revealScenario(scenario) {
  experienceEl.classList.remove("spinning");
  experienceEl.classList.add("reveal");

  lockOnResult = true;
  spinVelocity = 0;

  statusChip.textContent = "결과";
  targetReadout.textContent = `${scenario.country} ${scenario.region}에서 삶이 시작됩니다.`;

  resultTitle.textContent = `${scenario.country}에서 삶이 시작됩니다`;
  resultSummary.textContent = scenario.summary;
  birthPlace.textContent = `${scenario.flag} ${scenario.country}, ${scenario.region}`;
  regionNote.textContent = "무작위로 선택된 출생 지역";
  const dailyBudgetKrw = estimateDailyBudgetKrw(scenario);
  const mealCoverage = estimateMealCoverage(dailyBudgetKrw);
  incomeTier.textContent = `약 ${dailyBudgetKrw.toLocaleString("ko-KR")}원/일`;
  incomeNote.textContent = `하루 세 끼 중 약 ${mealCoverage}끼 정도만 안정적으로 가능`;
  waterAccess.textContent = formatWaterAccess(scenario.waterDistanceKm);
  waterNote.textContent = "식수를 위해 이동에 쓰는 하루 시간";
  narrative.textContent = scenario.narrative;
  resultSummary.textContent = scenario.summary;

  marker.visible = true;
  markerRing.visible = true;
  pendingCountryIso2 = scenario.flag;
  renderCountryOutlineForCountryCode(scenario.flag);

  launchButton.disabled = false;
  rerollButton.disabled = false;
}

function animate() {
  window.requestAnimationFrame(animate);
  const now = performance.now();
  const isSpinning = experienceEl.classList.contains("spinning");
  const isReveal = experienceEl.classList.contains("reveal");
  const rawProgress = isSpinning && lotteryStartedAt ? clamp((now - lotteryStartedAt) / 3300, 0, 1) : 0;
  const diveProgress = easeInOutCubic(clamp((rawProgress - 0.12) / 0.88, 0, 1));
  const galaxySpin = isSpinning ? 0.0015 : 0.00045;
  if (galaxyGroup) {
    galaxyGroup.rotation.y += galaxySpin;
    galaxyGroup.rotation.z += galaxySpin * 0.35;
    galaxyGroup.rotation.x = Math.sin(now * 0.00006) * 0.08;
  }

  if (!lockOnResult) {
    if (spinVelocity > 0.006) {
      spinVelocity *= 0.972;
    } else {
      spinVelocity = 0.0035;
    }
    globeGroup.rotation.y += spinVelocity;
  } else if (targetRotation) {
    globeGroup.rotation.x = targetRotation.x;
    globeGroup.rotation.y = targetRotation.y;
  }

  if (targetRotation) {
    if (!lockOnResult) {
      const alignFactor = 0.05 + diveProgress * 0.06;
      globeGroup.rotation.y = damp(globeGroup.rotation.y, targetRotation.y, alignFactor);
      globeGroup.rotation.x = damp(globeGroup.rotation.x, targetRotation.x, alignFactor);
    }
  } else {
    globeGroup.rotation.x = damp(globeGroup.rotation.x, -0.16, 0.04);
  }

  let cameraTargetZ = 5.8;
  let cameraTargetFov = 42;
  let cameraTargetX = 0;
  let cameraTargetY = 0;

  if (isSpinning) {
    cameraTargetZ = lerp(6.1, 3.6, diveProgress);
    cameraTargetFov = lerp(48, 36, diveProgress);
    if (targetRotation) {
      cameraTargetX = lerp(0, clamp(-targetRotation.y * 0.22, -0.34, 0.34), diveProgress);
      cameraTargetY = lerp(0, clamp(targetRotation.x * 0.18, -0.24, 0.24), diveProgress);
    }
  } else if (isReveal) {
    cameraTargetX = 0;
    cameraTargetY = 0;
    cameraTargetZ = 3.95;
    cameraTargetFov = 36;
  }

  if (isReveal) {
    camera.position.set(cameraTargetX, cameraTargetY, cameraTargetZ);
    camera.fov = cameraTargetFov;
  } else {
    camera.position.x = damp(camera.position.x, cameraTargetX, 0.08);
    camera.position.y = damp(camera.position.y, cameraTargetY, 0.08);
    camera.position.z = damp(camera.position.z, cameraTargetZ, 0.07);
    camera.fov = damp(camera.fov, cameraTargetFov, 0.07);
  }
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  if (currentScenario) {
    const point = latLonToVector3(currentScenario.lat, currentScenario.lon, 1.41);
    marker.position.copy(point);
    marker.lookAt(new THREE.Vector3(0, 0, 0));

    const ringPoint = latLonToVector3(currentScenario.lat, currentScenario.lon, 1.44);
    markerRing.position.copy(ringPoint);
    markerRing.lookAt(new THREE.Vector3(0, 0, 0));
    markerRing.scale.setScalar(1 + Math.sin(Date.now() * 0.008) * 0.07);

  }

  renderer.render(scene, camera);
}

function resizeScene() {
  const frame = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(frame.width));
  const height = Math.max(320, Math.floor(frame.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function pickScenario(previousScenario) {
  if (LIFE_SCENARIOS.length === 1) {
    return LIFE_SCENARIOS[0];
  }

  let next = LIFE_SCENARIOS[Math.floor(Math.random() * LIFE_SCENARIOS.length)];
  while (previousScenario && next.country === previousScenario.country && next.region === previousScenario.region) {
    next = LIFE_SCENARIOS[Math.floor(Math.random() * LIFE_SCENARIOS.length)];
  }
  return next;
}

function getTargetRotation(lat, lon) {
  const surfacePoint = latLonToVector3(lat, lon, 1).normalize();
  const frontDirection = new THREE.Vector3(0, 0, 1);
  const q = new THREE.Quaternion().setFromUnitVectors(surfacePoint, frontDirection);
  const euler = new THREE.Euler().setFromQuaternion(q, "YXZ");
  return { x: euler.x, y: euler.y };
}

function latLonToVector3(lat, lon, radius) {
  const latRad = THREE.MathUtils.degToRad(lat);
  const lonRad = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.cos(latRad) * Math.cos(lonRad),
    radius * Math.sin(latRad),
    -radius * Math.cos(latRad) * Math.sin(lonRad)
  );
}

function damp(current, target, factor) {
  return current + (target - current) * factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
  if (dailyBudgetKrw < 2600) {
    return 1;
  }
  if (dailyBudgetKrw < 4200) {
    return 2;
  }
  return 3;
}

function createGalaxyBackdrop() {
  galaxyGroup = new THREE.Group();
  scene.add(galaxyGroup);

  const deepStars = createStarPoints({
    count: 2800,
    minRadius: 42,
    maxRadius: 80,
    color: 0xaec6ef,
    size: 0.13,
    opacity: 0.68
  });
  galaxyGroup.add(deepStars);

  const brightStars = createStarPoints({
    count: 900,
    minRadius: 38,
    maxRadius: 70,
    color: 0xe8f2ff,
    size: 0.2,
    opacity: 0.92
  });
  galaxyGroup.add(brightStars);

  const milkyBand = createMilkyWayBand({
    count: 2200,
    radius: 60,
    color: 0xb9d0ff,
    size: 0.18,
    opacity: 0.32
  });
  milkyBand.rotation.x = THREE.MathUtils.degToRad(62);
  milkyBand.rotation.y = THREE.MathUtils.degToRad(18);
  galaxyGroup.add(milkyBand);
}

function createStarPoints(config) {
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

function createMilkyWayBand(config) {
  const positions = new Float32Array(config.count * 3);
  for (let i = 0; i < config.count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const spread = (Math.random() - 0.5) * 7.5;
    const radius = config.radius + (Math.random() - 0.5) * 8;
    const y = spread;
    positions[i * 3] = radius * Math.cos(theta);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = radius * Math.sin(theta);
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

async function loadCountryBorders() {
  try {
    const res = await fetch(COUNTRY_GEOJSON_URL);
    if (!res.ok) {
      throw new Error(`geojson load failed: ${res.status}`);
    }

    const geojson = await res.json();
    const features = Array.isArray(geojson.features) ? geojson.features : [];
    countryFeaturesByIso3 = new Map();

    for (const feature of features) {
      const iso3 = getFeatureIso3(feature);
      if (iso3) {
        countryFeaturesByIso3.set(iso3, feature);
      }
    }

    countryBordersReady = true;
    if (pendingCountryIso2) {
      renderCountryOutlineForCountryCode(pendingCountryIso2);
    }
  } catch (error) {
    console.warn("Failed to load country borders:", error);
  }
}

function getFeatureIso3(feature) {
  const props = feature && feature.properties ? feature.properties : {};
  const candidates = [
    props.ISO_A3,
    props.iso_a3,
    props["ISO3166-1-Alpha-3"],
    feature && feature.id
  ];

  for (const raw of candidates) {
    if (typeof raw === "string" && raw.length === 3) {
      return raw.toUpperCase();
    }
  }
  return null;
}

function renderCountryOutlineForCountryCode(iso2) {
  if (!countryBordersReady || !iso2) {
    return;
  }

  const iso3 = ISO2_TO_ISO3[String(iso2).toUpperCase()];
  if (!iso3) {
    clearCountryOutline();
    return;
  }

  const feature = countryFeaturesByIso3.get(iso3);
  if (!feature || !feature.geometry) {
    clearCountryOutline();
    return;
  }

  clearCountryOutline();
  const geometry = feature.geometry;
  if (geometry.type === "Polygon") {
    addPolygonOutline(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    for (const polygonCoords of geometry.coordinates) {
      addPolygonOutline(polygonCoords);
    }
  }
}

function addPolygonOutline(rings) {
  if (!Array.isArray(rings)) {
    return;
  }

  for (const ring of rings) {
    const line = buildOutlineLine(ring);
    if (line) {
      countryOutlineGroup.add(line);
    }
  }
}

function buildOutlineLine(ring) {
  if (!Array.isArray(ring) || ring.length < 2) {
    return null;
  }

  const layers = [
    { radius: 1.364, color: 0xff8f63, opacity: 0.5 },
    { radius: 1.368, color: 0xfff07a, opacity: 0.98 },
    { radius: 1.372, color: 0xfff7bf, opacity: 0.55 }
  ];

  const layerPoints = layers.map((layer) => buildRingPoints(ring, layer.radius));
  if (!layerPoints[1] || layerPoints[1].length < 2) {
    return null;
  }

  const group = new THREE.Group();
  for (let i = 0; i < layers.length; i += 1) {
    const points = layerPoints[i];
    if (!points || points.length < 2) {
      continue;
    }
    const material = new THREE.LineBasicMaterial({
      color: layers[i].color,
      transparent: true,
      opacity: layers[i].opacity
    });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    line.renderOrder = 5 + i;
    group.add(line);
  }
  return group.children.length ? group : null;
}

function buildRingPoints(ring, radius) {
  const points = [];
  for (const coord of ring) {
    if (!Array.isArray(coord) || coord.length < 2) {
      continue;
    }
    const lon = Number(coord[0]);
    const lat = Number(coord[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      points.push(latLonToVector3(lat, lon, radius));
    }
  }
  return points;
}

function clearCountryOutline() {
  if (!countryOutlineGroup) {
    return;
  }

  while (countryOutlineGroup.children.length) {
    const child = countryOutlineGroup.children[0];
    countryOutlineGroup.remove(child);
    disposeObject3D(child);
  }
}

function disposeObject3D(object3D) {
  if (!object3D) {
    return;
  }

  if (object3D.children && object3D.children.length) {
    while (object3D.children.length) {
      const child = object3D.children[0];
      object3D.remove(child);
      disposeObject3D(child);
    }
  }

  if (object3D.geometry) {
    object3D.geometry.dispose();
  }
  if (Array.isArray(object3D.material)) {
    for (const mat of object3D.material) {
      if (mat) {
        mat.dispose();
      }
    }
  } else if (object3D.material) {
    object3D.material.dispose();
  }
}
