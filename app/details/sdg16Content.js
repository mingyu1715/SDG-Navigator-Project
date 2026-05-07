import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG16_MODEL_NOTE,
  SDG16_STAGE_INTRO,
  SDG16_STAGE_RESULT,
  calculateSdg16Scenario,
  createSdg16InitialState,
  renderSdg16LocationItems,
  renderSdg16SourceItems,
  resetSdg16Experience,
  runSdg16Experience,
  selectSdg16Location
} from "./sdg16ContentModel.js?v=20260507-conflict-facts";

let sdg16ThreeScriptPromise = null;
let sdg16ThreeLoadHandle = null;
let sdg16OwnsThreeGlobal = false;

function detachSdg16ThreeScript(script = sdg16ThreeLoadHandle?.script || null) {
  if (!script) return;
  script.onload = null;
  script.onerror = null;
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

function resetSdg16ThreeLoader() {
  sdg16ThreeScriptPromise = null;
  if (sdg16ThreeLoadHandle) {
    const { script, resolve } = sdg16ThreeLoadHandle;
    detachSdg16ThreeScript(script);
    sdg16ThreeLoadHandle = null;
    resolve(null);
  }

  if (sdg16OwnsThreeGlobal && window.THREE) {
    try {
      delete window.THREE;
    } catch {
      window.THREE = undefined;
    }
  }
  sdg16OwnsThreeGlobal = false;
}

function loadSdg16ThreeGlobal() {
  if (window.THREE) {
    return Promise.resolve(window.THREE);
  }

  if (sdg16ThreeScriptPromise) {
    return sdg16ThreeScriptPromise;
  }

  sdg16ThreeScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.dataset.sdg16ThreeScript = "true";
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.async = true;
    sdg16ThreeLoadHandle = { script, resolve };
    script.onload = () => {
      const three = window.THREE || null;
      sdg16OwnsThreeGlobal = Boolean(three);
      detachSdg16ThreeScript(script);
      sdg16ThreeLoadHandle = null;
      resolve(three);
    };
    script.onerror = () => {
      detachSdg16ThreeScript(script);
      sdg16ThreeLoadHandle = null;
      sdg16ThreeScriptPromise = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return sdg16ThreeScriptPromise;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class Sdg16DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg16";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg16InitialState();
    this.THREE = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.globeGroup = null;
    this.globe = null;
    this.markerGroup = null;
    this.stars = null;
    this.rafId = null;
    this.renderVersion = 0;
    this.disposeRequested = false;
    this.markerMeshes = [];
    this.markerHitTargets = [];
    this.raycaster = null;
    this.pointer = null;
    this.isPointerDown = false;
    this.isDraggingGlobe = false;
    this.autoRotate = true;
    this.pointerStart = { x: 0, y: 0 };
    this.lastPointer = { x: 0, y: 0 };
    this.lastPointerAt = 0;
    this.rotationVelocity = { x: 0, y: 0 };
    this.boundHandleClick = (event) => this.handleClick(event);
    this.boundHandleCanvasPointerDown = (event) => this.handleCanvasPointerDown(event);
    this.boundHandleCanvasPointerMove = (event) => this.handleCanvasPointerMove(event);
    this.boundHandleCanvasPointerUp = (event) => this.handleCanvasPointerUp(event);
    this.onResize = () => this.resizeScene();
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg16-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg16-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg16-exp" data-role="root" data-stage="${SDG16_STAGE_INTRO}">
        <div class="sdg16-scene" aria-label="지구본 위 분쟁 충격 시각화">
          <div class="sdg16-space-light" aria-hidden="true"></div>
          <div class="sdg16-star-field" aria-hidden="true"></div>
          <div class="sdg16-globe-wrap" aria-label="드래그 가능한 3D 지구본">
            <span class="sdg16-orbit is-outer"></span>
            <span class="sdg16-orbit is-inner"></span>
            <canvas class="sdg16-canvas" data-role="canvas"></canvas>
            <div class="sdg16-globe-fallback is-visible" data-role="globeFallback">3D 지구본을 불러오는 중입니다.</div>
          </div>
        </div>

        <header class="sdg16-hero" aria-labelledby="sdg16Title">
          <p class="sdg16-goal-label">SDG GOAL 16</p>
          <h3 id="sdg16Title" class="sdg16-title">The Silence of Conflict</h3>
          <p class="sdg16-subtitle">침묵의 총성</p>
          <p class="sdg16-lead">평화로운 일상 뒤편에서 지금도 흔들리는 세계의 현실을 지구본 위의 분쟁 지도로 확인합니다.</p>
        </header>

        <section class="sdg16-control-panel" aria-label="분쟁 지도 시작">
          <div class="sdg16-panel-head">
            <div>
              <p class="sdg16-kicker">Input</p>
              <h4>평화가 흔들리는 지역 보기</h4>
            </div>
          </div>
          <p class="sdg16-control-copy">공식 통계와 ACLED 분쟁 지수에 기반한 대표 분쟁 지역을 지구본에 표시합니다.</p>
          <button type="button" class="sdg16-primary-btn" data-action="runExperience">분쟁 지도 열기</button>
        </section>

        <section class="sdg16-result-panel" data-role="resultPanel" aria-label="분쟁과 폭력 통계 결과" aria-hidden="true">
          <div class="sdg16-result-head">
            <div>
              <p class="sdg16-kicker">Output</p>
              <h4 data-role="resultTitle">침묵 뒤의 통계</h4>
            </div>
            <button type="button" class="sdg16-reset-btn" data-action="reset">처음으로</button>
          </div>
          <p class="sdg16-result-copy" data-role="resultCopy"></p>
          <div class="sdg16-map-hint">지구본을 드래그해 회전하고, 붉은 마커를 누르면 지역별 세부 정보를 볼 수 있습니다.</div>
          <article class="sdg16-conflict-detail" data-role="conflictDetail">
            <div class="sdg16-conflict-detail-head">
              <span data-role="conflictSeverity">대표 분쟁 지역</span>
              <strong data-role="conflictName">-</strong>
            </div>
            <p data-role="conflictContext"></p>
            <small data-role="conflictCoords"></small>
          </article>
          <div class="sdg16-conflict-stat-grid" aria-label="선택 지역 실제 피해 수치">
            <article>
              <span>사상자</span>
              <strong data-role="statCasualty">-</strong>
            </article>
            <article>
              <span>피란·실향</span>
              <strong data-role="statDisplacement">-</strong>
            </article>
            <article>
              <span>피해·복구비</span>
              <strong data-role="statEconomic">-</strong>
            </article>
            <article>
              <span>기준/출처</span>
              <strong data-role="statBasis">-</strong>
            </article>
          </div>
          <p class="sdg16-stat-note" data-role="statNote"></p>
          <div class="sdg16-location-list" data-role="locationList" aria-label="지도 표시 분쟁 지역"></div>
          <div class="sdg16-metric-grid">
            <article>
              <span>분쟁 관련 사망</span>
              <strong data-role="conflictValue">-</strong>
              <small data-role="conflictBasis">2024년 공식 집계</small>
            </article>
            <article>
              <span>보호 대상 사망</span>
              <strong data-role="protectedValue">-</strong>
              <small>인권옹호자·언론인·노동조합원</small>
            </article>
            <article>
              <span>의도적 살인율</span>
              <strong data-role="homicideRate">-</strong>
              <small>2023년 공식 지표</small>
            </article>
            <article>
              <span>강제 이주 상태</span>
              <strong data-role="displacedValue">-</strong>
              <small>2024년 말 기준</small>
            </article>
          </div>
          <p class="sdg16-model-note">${escapeHtml(SDG16_MODEL_NOTE)}</p>
          <div class="sdg16-source-list" data-role="sourceList"></div>
        </section>
      </div>
    `;
  }

  cacheRefs() {
    const get = (role) => this.host.querySelector(`[data-role="${role}"]`);
    this.refs = {
      root: get("root"),
      canvas: get("canvas"),
      globeFallback: get("globeFallback"),
      resultPanel: get("resultPanel"),
      resultTitle: get("resultTitle"),
      resultCopy: get("resultCopy"),
      conflictValue: get("conflictValue"),
      conflictBasis: get("conflictBasis"),
      protectedValue: get("protectedValue"),
      homicideRate: get("homicideRate"),
      displacedValue: get("displacedValue"),
      locationList: get("locationList"),
      conflictDetail: get("conflictDetail"),
      conflictSeverity: get("conflictSeverity"),
      conflictName: get("conflictName"),
      conflictContext: get("conflictContext"),
      conflictCoords: get("conflictCoords"),
      statCasualty: get("statCasualty"),
      statDisplacement: get("statDisplacement"),
      statEconomic: get("statEconomic"),
      statBasis: get("statBasis"),
      statNote: get("statNote"),
      sourceList: get("sourceList")
    };
  }

  bindEvents() {
    this.host.addEventListener("click", this.boundHandleClick);
    this.refs.canvas?.addEventListener("pointerdown", this.boundHandleCanvasPointerDown);
    window.addEventListener("pointermove", this.boundHandleCanvasPointerMove);
    window.addEventListener("pointerup", this.boundHandleCanvasPointerUp);
    window.addEventListener("pointercancel", this.boundHandleCanvasPointerUp);
  }

  unbindEvents() {
    if (this.host) {
      this.host.removeEventListener("click", this.boundHandleClick);
    }
    this.refs.canvas?.removeEventListener("pointerdown", this.boundHandleCanvasPointerDown);
    window.removeEventListener("pointermove", this.boundHandleCanvasPointerMove);
    window.removeEventListener("pointerup", this.boundHandleCanvasPointerUp);
    window.removeEventListener("pointercancel", this.boundHandleCanvasPointerUp);
  }

  teardownRuntime() {
    this.disposeRequested = true;
    window.removeEventListener("resize", this.onResize);
    this.destroyScene();
    this.THREE = null;
    resetSdg16ThreeLoader();
  }

  async initThreeSceneAsync(renderVersion) {
    const three = await loadSdg16ThreeGlobal();
    if (this.disposeRequested || renderVersion !== this.renderVersion) return;

    if (!three) {
      this.showFallback("3D 지구본을 불러오지 못했습니다.");
      return;
    }

    this.THREE = three;
    this.initScene();
    this.resizeScene();
    this.animate();
    this.renderGlobeMarkers(calculateSdg16Scenario(this.state));
    window.addEventListener("resize", this.onResize);
  }

  showFallback(message) {
    if (!this.refs.globeFallback) return;
    this.refs.globeFallback.textContent = message;
    this.refs.globeFallback.classList.add("is-visible");
  }

  handleClick(event) {
    const locationTarget = event.target.closest("[data-location-key]");
    if (locationTarget && this.host?.contains(locationTarget)) {
      this.selectLocation(locationTarget.dataset.locationKey);
      return;
    }

    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !this.host?.contains(actionTarget)) return;

    const action = actionTarget.dataset.action;
    if (action === "runExperience") {
      this.state = runSdg16Experience(this.state);
      this.autoRotate = true;
      this.rotationVelocity = { x: 0, y: 0 };
      this.renderAll();
      return;
    }

    if (action === "reset") {
      this.state = resetSdg16Experience();
      this.autoRotate = true;
      this.rotationVelocity = { x: 0, y: 0 };
      this.renderAll();
    }
  }

  selectLocation(locationKey) {
    const result = calculateSdg16Scenario(this.state);
    if (result.stage !== SDG16_STAGE_RESULT) return;
    this.state = selectSdg16Location(this.state, locationKey);
    this.autoRotate = false;
    this.rotationVelocity = { x: 0, y: 0 };
    this.renderAll();
  }

  handleCanvasPointerDown(event) {
    const result = calculateSdg16Scenario(this.state);
    if (result.stage !== SDG16_STAGE_RESULT || !this.globeGroup) return;

    this.isPointerDown = true;
    this.isDraggingGlobe = false;
    this.autoRotate = false;
    this.pointerStart = { x: event.clientX, y: event.clientY };
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.lastPointerAt = performance.now();
    this.rotationVelocity = { x: 0, y: 0 };
    try {
      this.refs.canvas?.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is optional; dragging still works through window listeners.
    }
    event.preventDefault();
  }

  handleCanvasPointerMove(event) {
    if (!this.isPointerDown || !this.globeGroup) return;

    const now = performance.now();
    const dx = event.clientX - this.lastPointer.x;
    const dy = event.clientY - this.lastPointer.y;
    const distance = Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y);
    if (distance > 4) this.isDraggingGlobe = true;

    const deltaY = dx * 0.0035;
    const deltaX = dy * 0.0025;
    const frameScale = clamp(16 / Math.max(12, now - this.lastPointerAt), 0.42, 1.4);
    this.globeGroup.rotation.y += deltaY;
    this.globeGroup.rotation.x = clamp(this.globeGroup.rotation.x + deltaX, -0.58, 0.36);
    this.rotationVelocity = {
      x: clamp(deltaX * frameScale, -0.026, 0.026),
      y: clamp(deltaY * frameScale, -0.034, 0.034)
    };
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.lastPointerAt = now;
    event.preventDefault();
  }

  handleCanvasPointerUp(event) {
    if (!this.isPointerDown) return;

    const wasDragging = this.isDraggingGlobe;
    this.isPointerDown = false;
    this.isDraggingGlobe = false;
    try {
      this.refs.canvas?.releasePointerCapture?.(event.pointerId);
    } catch {
      // Some browsers throw when the pointer was released outside the canvas.
    }

    if (!wasDragging) {
      const locationKey = this.getMarkerKeyAt(event.clientX, event.clientY);
      if (locationKey) {
        this.selectLocation(locationKey);
        return;
      }
    }

    if (!wasDragging) {
      this.rotationVelocity = { x: 0, y: 0 };
    }
    this.autoRotate = false;
  }

  getMarkerKeyAt(clientX, clientY) {
    if (!this.raycaster || !this.pointer || !this.camera || !this.refs.canvas || !this.markerHitTargets.length) {
      return null;
    }

    const rect = this.refs.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1)
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(this.markerHitTargets, true);
    const worldPosition = new this.THREE.Vector3();
    const visibleHit = intersects.find((hit) => {
      const key = hit.object.userData?.locationKey || hit.object.parent?.userData?.locationKey;
      if (!key) return false;
      hit.object.getWorldPosition(worldPosition);
      return worldPosition.z > 0.12;
    });

    return visibleHit?.object.userData?.locationKey || visibleHit?.object.parent?.userData?.locationKey || null;
  }

  renderAll() {
    const result = calculateSdg16Scenario(this.state);

    if (this.refs.root) {
      this.refs.root.dataset.stage = result.stage;
      this.refs.root.style.setProperty("--sdg16-impact", result.impactLevel.toFixed(2));
    }

    this.renderGlobeMarkers(result);
    if (this.refs.resultPanel) {
      const visible = result.stage === SDG16_STAGE_RESULT;
      this.refs.resultPanel.setAttribute("aria-hidden", visible ? "false" : "true");
    }
    if (this.refs.resultTitle) this.refs.resultTitle.textContent = result.resultTitle;
    if (this.refs.resultCopy) this.refs.resultCopy.textContent = result.resultCopy;
    if (this.refs.conflictValue) this.refs.conflictValue.textContent = result.conflictExpectedLabel;
    if (this.refs.conflictBasis) this.refs.conflictBasis.textContent = result.conflictBasisLabel;
    if (this.refs.protectedValue) this.refs.protectedValue.textContent = result.protectedExpectedLabel;
    if (this.refs.homicideRate) this.refs.homicideRate.textContent = result.homicideRateLabel;
    if (this.refs.displacedValue) this.refs.displacedValue.textContent = result.displacedLabel;
    if (this.refs.locationList) {
      this.refs.locationList.innerHTML = renderSdg16LocationItems(result.visibleLocations, result.selectedLocationKey);
    }
    if (this.refs.conflictDetail) {
      this.refs.conflictDetail.hidden = !result.activeLocation;
    }
    if (this.refs.conflictSeverity) {
      const severityMap = {
        extreme: "극심",
        high: "고위험",
        turbulent: "불안정"
      };
      this.refs.conflictSeverity.textContent = severityMap[result.activeLocation?.severity] || "대표 지역";
    }
    if (this.refs.conflictName) {
      this.refs.conflictName.textContent = result.activeLocation?.label || "-";
    }
    if (this.refs.conflictContext) {
      this.refs.conflictContext.textContent = result.activeLocation?.context || "";
    }
    if (this.refs.conflictCoords) {
      this.refs.conflictCoords.textContent = result.activeLocation
        ? `${result.activeLocation.name} · ${result.activeLocation.detail} · ${result.activeLocation.lat.toFixed(2)}, ${result.activeLocation.lon.toFixed(2)}`
        : "";
    }
    if (this.refs.statCasualty) this.refs.statCasualty.textContent = result.activeLocationFacts?.casualty || "-";
    if (this.refs.statDisplacement) this.refs.statDisplacement.textContent = result.activeLocationFacts?.displacement || "-";
    if (this.refs.statEconomic) this.refs.statEconomic.textContent = result.activeLocationFacts?.economic || "-";
    if (this.refs.statBasis) this.refs.statBasis.textContent = result.activeLocationFacts?.basis || "-";
    if (this.refs.statNote) {
      this.refs.statNote.innerHTML = result.activeLocationFacts?.url
        ? `<a href="${escapeHtml(result.activeLocationFacts.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(result.activeLocation.label)} 피해 수치 출처 보기</a>`
        : "";
    }
    if (this.refs.sourceList) this.refs.sourceList.innerHTML = renderSdg16SourceItems(result.sourceItems);
  }

  render() {
    if (!this.host) return;
    this.unbindEvents();
    this.teardownRuntime();
    const renderVersion = ++this.renderVersion;
    this.disposeRequested = false;
    this.state = createSdg16InitialState();
    this.setThemeActive(true);
    this.setTitleSectorHidden(true);
    this.host.innerHTML = this.template();
    this.cacheRefs();
    this.bindEvents();
    this.renderAll();
    void this.initThreeSceneAsync(renderVersion);
  }

  initScene() {
    const { canvas } = this.refs;
    const THREE = this.THREE;
    if (!canvas || !THREE) return;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5.9);

    const ambientLight = new THREE.AmbientLight(0xdfe9ff, 1.05);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.42);
    directionalLight.position.set(5, 3.2, 6);
    const redRimLight = new THREE.PointLight(0xff4050, 1.2, 9);
    redRimLight.position.set(-3.8, -1.8, 3.6);
    this.scene.add(ambientLight, directionalLight, redRimLight);

    this.stars = this.createStarPoints();
    this.scene.add(this.stars);

    this.globeGroup = new THREE.Group();
    this.globeGroup.rotation.set(-0.12, -1.05, 0);
    this.scene.add(this.globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
    const earthBump = textureLoader.load("https://threejs.org/examples/textures/planets/earth_bump_2048.jpg");
    const earthSpecular = textureLoader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    this.globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.48, 96, 96),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        bumpMap: earthBump,
        bumpScale: 0.04,
        roughnessMap: earthSpecular,
        metalnessMap: earthSpecular,
        color: 0xffffff,
        metalness: 0.04,
        roughness: 0.9
      })
    );
    this.globeGroup.add(this.globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.53, 96, 96),
      new THREE.MeshBasicMaterial({
        color: 0x84b4ff,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
      })
    );
    this.globeGroup.add(atmosphere);

    this.markerGroup = new THREE.Group();
    this.globeGroup.add(this.markerGroup);

    if (this.refs.globeFallback) {
      this.refs.globeFallback.classList.remove("is-visible");
      this.refs.globeFallback.textContent = "";
    }
  }

  createStarPoints() {
    const THREE = this.THREE;
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.lerp(38, 70, Math.random());
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
      color: 0xdce9ff,
      size: 0.16,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    });
    return new THREE.Points(geometry, material);
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

  renderGlobeMarkers(result) {
    if (!this.THREE || !this.markerGroup) return;

    this.clearMarkerGroup();
    if (result.stage !== SDG16_STAGE_RESULT) return;

    const THREE = this.THREE;
    result.visibleLocations.forEach((location, index) => {
      const active = location.key === result.selectedLocationKey;
      const point = this.latLonToVector3(location.lat, location.lon, 1.535);
      const normal = point.clone().normalize();
      const markerColor = active ? 0xffd166 : 0xff4358;
      const glowColor = active ? 0xffe39b : 0xff6674;
      const markerWrap = new THREE.Group();
      markerWrap.position.copy(point);
      markerWrap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      markerWrap.userData = {
        delay: index * 80,
        pulse: index * 0.37,
        label: location.label,
        locationKey: location.key,
        active
      };

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(active ? 0.012 : 0.009, active ? 0.007 : 0.005, active ? 0.18 : 0.14, 14),
        new THREE.MeshBasicMaterial({
          color: markerColor,
          transparent: true,
          opacity: active ? 1 : 0.94,
          depthTest: true
        })
      );
      stem.position.y = active ? 0.09 : 0.07;
      stem.userData.locationKey = location.key;

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(active ? 0.07 : 0.052, 24, 24),
        new THREE.MeshBasicMaterial({
          color: markerColor,
          transparent: true,
          opacity: 0.98,
          depthTest: true
        })
      );
      head.position.y = active ? 0.19 : 0.15;
      head.userData.locationKey = location.key;

      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(active ? 0.026 : 0.019, 18, 18),
        new THREE.MeshBasicMaterial({
          color: 0xfff7df,
          transparent: true,
          opacity: active ? 0.95 : 0.78,
          depthTest: true
        })
      );
      inner.position.y = head.position.y + 0.004;
      inner.userData.locationKey = location.key;

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(active ? 0.082 : 0.062, active ? 0.13 : 0.096, 40),
        new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: active ? 0.86 : 0.5,
          side: THREE.DoubleSide,
          depthTest: true
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.012;
      ring.userData.locationKey = location.key;

      markerWrap.add(ring, stem, head, inner);
      this.markerGroup.add(markerWrap);
      this.markerMeshes.push(markerWrap);
      this.markerHitTargets.push(ring, stem, head, inner);
    });
  }

  clearMarkerGroup() {
    if (!this.markerGroup) return;
    while (this.markerGroup.children.length) {
      const child = this.markerGroup.children[0];
      this.markerGroup.remove(child);
      this.disposeObject3D(child);
    }
    this.markerMeshes = [];
    this.markerHitTargets = [];
  }

  animate() {
    if (this.disposeRequested) return;
    this.rafId = window.requestAnimationFrame(() => this.animate());

    if (!this.renderer || !this.scene || !this.camera || !this.globeGroup) return;

    const now = performance.now();
    const stage = this.refs.root?.dataset.stage || SDG16_STAGE_INTRO;
    const impact = Number(this.refs.root?.style.getPropertyValue("--sdg16-impact") || 0);
    const targetZ = stage === SDG16_STAGE_RESULT ? 5.2 : 5.9;
    const targetX = stage === SDG16_STAGE_RESULT ? 0.16 : 0;

    const shouldAutoRotate = stage === SDG16_STAGE_INTRO || (this.autoRotate && !this.isPointerDown);
    if (shouldAutoRotate) {
      this.globeGroup.rotation.y += stage === SDG16_STAGE_RESULT ? 0.001 : 0.0024;
    } else if (stage === SDG16_STAGE_RESULT && !this.isPointerDown) {
      this.globeGroup.rotation.y += this.rotationVelocity.y;
      this.globeGroup.rotation.x = clamp(this.globeGroup.rotation.x + this.rotationVelocity.x, -0.58, 0.36);
      this.rotationVelocity.x *= 0.92;
      this.rotationVelocity.y *= 0.92;
      if (Math.abs(this.rotationVelocity.x) < 0.00008) this.rotationVelocity.x = 0;
      if (Math.abs(this.rotationVelocity.y) < 0.00008) this.rotationVelocity.y = 0;
    }
    if (!this.isPointerDown && shouldAutoRotate) {
      this.globeGroup.rotation.x += (clamp(-0.16 - impact * 0.08, -0.28, -0.08) - this.globeGroup.rotation.x) * 0.04;
    }
    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;
    this.camera.lookAt(0, 0, 0);

    if (this.stars) {
      this.stars.rotation.y += 0.00035;
      this.stars.rotation.x = Math.sin(now * 0.00004) * 0.04;
    }

    this.markerMeshes.forEach((markerWrap) => {
      const elapsed = Math.max(0, now - (markerWrap.userData.delay || 0));
      const base = markerWrap.userData.active ? 1.12 : 1;
      const amplitude = markerWrap.userData.active ? 0.15 : 0.08;
      const pulse = base + Math.sin(elapsed * 0.006 + markerWrap.userData.pulse) * amplitude;
      markerWrap.scale.setScalar(pulse);
    });

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
    if (object3D.children?.length) {
      while (object3D.children.length) {
        const child = object3D.children[0];
        object3D.remove(child);
        this.disposeObject3D(child);
      }
    }

    if (object3D.geometry) object3D.geometry.dispose();
    if (Array.isArray(object3D.material)) {
      object3D.material.forEach((material) => material?.dispose());
    } else if (object3D.material) {
      object3D.material.dispose();
    }
  }

  destroyScene() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.scene) {
      this.disposeObject3D(this.scene);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.globeGroup = null;
    this.globe = null;
    this.markerGroup = null;
    this.stars = null;
    this.markerMeshes = [];
    this.markerHitTargets = [];
    this.raycaster = null;
    this.pointer = null;
  }

  destroy() {
    this.renderVersion += 1;
    this.unbindEvents();
    this.teardownRuntime();
    this.setThemeActive(false);
    this.setTitleSectorHidden(false);
    this.host = null;
    this.refs = {};
  }
}
