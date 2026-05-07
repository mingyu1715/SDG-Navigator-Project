import { escapeHtml, toggleDetailViewClass } from "./sharedRuntime.js";
import {
  SDG17_MODEL_NOTE,
  SDG17_STAGE_INTRO,
  SDG17_STAGE_RESULT,
  calculateSdg17Scenario,
  createSdg17InitialState,
  renderSdg17MetricItems,
  renderSdg17SourceItems,
  resetSdg17Experience,
  runSdg17Experience
} from "./sdg17ContentModel.js?v=20260507-sdg17-routefix";

const SDG17_MARKER_RADIUS = 1.58;
const SDG17_LINE_RADIUS = 1.59;
const SDG17_TEXTURE_LON_OFFSET = 0;

function clampSdg17Unit(value) {
  return Math.min(1, Math.max(0, value));
}

function easeOutSdg17Cubic(value) {
  const clamped = clampSdg17Unit(value);
  return 1 - Math.pow(1 - clamped, 3);
}

let sdg17ThreeScriptPromise = null;
let sdg17ThreeLoadHandle = null;
let sdg17OwnsThreeGlobal = false;

function detachSdg17ThreeScript(script = sdg17ThreeLoadHandle?.script || null) {
  if (!script) return;
  script.onload = null;
  script.onerror = null;
  if (script.parentNode) script.parentNode.removeChild(script);
}

function resetSdg17ThreeLoader() {
  sdg17ThreeScriptPromise = null;
  if (sdg17ThreeLoadHandle) {
    const { script, resolve } = sdg17ThreeLoadHandle;
    detachSdg17ThreeScript(script);
    sdg17ThreeLoadHandle = null;
    resolve(null);
  }

  if (sdg17OwnsThreeGlobal && window.THREE) {
    try {
      delete window.THREE;
    } catch {
      window.THREE = undefined;
    }
  }
  sdg17OwnsThreeGlobal = false;
}

function loadSdg17ThreeGlobal() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (sdg17ThreeScriptPromise) return sdg17ThreeScriptPromise;

  sdg17ThreeScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.dataset.sdg17ThreeScript = "true";
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.async = true;
    sdg17ThreeLoadHandle = { script, resolve };
    script.onload = () => {
      const three = window.THREE || null;
      sdg17OwnsThreeGlobal = Boolean(three);
      detachSdg17ThreeScript(script);
      sdg17ThreeLoadHandle = null;
      resolve(three);
    };
    script.onerror = () => {
      detachSdg17ThreeScript(script);
      sdg17ThreeLoadHandle = null;
      sdg17ThreeScriptPromise = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return sdg17ThreeScriptPromise;
}

export class Sdg17DetailContent {
  constructor(host) {
    this.host = host;
    this.panelClass = "detail-card-sdg17";
    this.frameMode = "generic";
    this.refs = {};
    this.state = createSdg17InitialState();
    this.THREE = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.globeGroup = null;
    this.networkGroup = null;
    this.stars = null;
    this.rafId = null;
    this.renderVersion = 0;
    this.disposeRequested = false;
    this.nodeMeshes = [];
    this.linkLines = [];
    this.pulseMeshes = [];
    this.networkBurstStartedAt = 0;
    this.boundHandleClick = (event) => this.handleClick(event);
    this.onResize = () => this.resizeScene();
  }

  setThemeActive(active) {
    toggleDetailViewClass(this.host, "sdg17-theme", active);
  }

  setTitleSectorHidden(hidden) {
    toggleDetailViewClass(this.host, "sdg17-title-hidden", hidden);
  }

  template() {
    return `
      <div class="sdg17-exp" data-role="root" data-stage="${SDG17_STAGE_INTRO}">
        <div class="sdg17-scene" aria-label="지구본 위 글로벌 연결망 시각화">
          <div class="sdg17-aurora" aria-hidden="true"></div>
          <canvas class="sdg17-canvas" data-role="canvas"></canvas>
          <div class="sdg17-globe-fallback is-visible" data-role="globeFallback">3D 연결망을 불러오는 중입니다.</div>
        </div>

        <header class="sdg17-hero" aria-labelledby="sdg17Title">
          <p class="sdg17-goal-label">SDG GOAL 17</p>
          <h3 id="sdg17Title" class="sdg17-title">The Power of Link</h3>
          <p class="sdg17-subtitle">글로벌 네트워크</p>
          <p class="sdg17-lead">문제는 세계 곳곳에서 발생하지만, 해결은 연결된 협력망에서 시작됩니다.</p>
        </header>

        <section class="sdg17-control-panel" aria-label="글로벌 연결 시작">
          <div class="sdg17-panel-head">
            <div>
              <p class="sdg17-kicker">Input</p>
              <h4>세계의 연결망 보기</h4>
            </div>
          </div>
          <button type="button" class="sdg17-primary-btn" data-action="runExperience">연결 시작</button>
        </section>

        <section class="sdg17-result-panel" data-role="resultPanel" aria-label="글로벌 협력 지표" aria-hidden="true">
          <div class="sdg17-result-head">
            <div>
              <p class="sdg17-kicker">Output</p>
              <h4 data-role="resultTitle">세계는 이미 연결되어 있습니다</h4>
            </div>
            <button type="button" class="sdg17-reset-btn" data-action="reset">처음으로</button>
          </div>
          <p class="sdg17-result-copy" data-role="resultCopy"></p>
          <div class="sdg17-network-counts">
            <span><strong data-role="nodeCount">0</strong>개 거점</span>
            <span><strong data-role="connectionCount">0</strong>개 연결</span>
          </div>
          <div class="sdg17-metric-grid" data-role="metricGrid"></div>
          <p class="sdg17-final-message" data-role="finalMessage"></p>
          <p class="sdg17-model-note">${escapeHtml(SDG17_MODEL_NOTE)}</p>
          <div class="sdg17-source-list" data-role="sourceList"></div>
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
      nodeCount: get("nodeCount"),
      connectionCount: get("connectionCount"),
      metricGrid: get("metricGrid"),
      finalMessage: get("finalMessage"),
      sourceList: get("sourceList")
    };
  }

  bindEvents() {
    this.host.addEventListener("click", this.boundHandleClick);
  }

  unbindEvents() {
    if (this.host) this.host.removeEventListener("click", this.boundHandleClick);
  }

  handleClick(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !this.host?.contains(actionTarget)) return;

    const action = actionTarget.dataset.action;
    if (action === "runExperience") {
      this.state = runSdg17Experience(this.state);
      this.renderAll();
      return;
    }

    if (action === "reset") {
      this.state = resetSdg17Experience();
      this.renderAll();
    }
  }

  teardownRuntime() {
    this.disposeRequested = true;
    window.removeEventListener("resize", this.onResize);
    this.destroyScene();
    this.THREE = null;
    resetSdg17ThreeLoader();
  }

  async initThreeSceneAsync(renderVersion) {
    const three = await loadSdg17ThreeGlobal();
    if (this.disposeRequested || renderVersion !== this.renderVersion) return;

    if (!three) {
      this.showFallback("3D 연결망을 불러오지 못했습니다.");
      return;
    }

    this.THREE = three;
    this.initScene();
    this.resizeScene();
    this.animate();
    this.renderNetwork(calculateSdg17Scenario(this.state));
    window.addEventListener("resize", this.onResize);
  }

  showFallback(message) {
    if (!this.refs.globeFallback) return;
    this.refs.globeFallback.textContent = message;
    this.refs.globeFallback.classList.add("is-visible");
  }

  renderAll() {
    const result = calculateSdg17Scenario(this.state);

    if (this.refs.root) {
      this.refs.root.dataset.stage = result.stage;
      this.refs.root.style.setProperty("--sdg17-active", result.active ? "1" : "0");
    }

    this.renderNetwork(result);
    if (this.refs.resultPanel) {
      this.refs.resultPanel.setAttribute("aria-hidden", result.stage === SDG17_STAGE_RESULT ? "false" : "true");
    }
    if (this.refs.resultTitle) this.refs.resultTitle.textContent = result.resultTitle;
    if (this.refs.resultCopy) this.refs.resultCopy.textContent = result.resultCopy;
    if (this.refs.nodeCount) this.refs.nodeCount.textContent = String(result.nodeCount);
    if (this.refs.connectionCount) this.refs.connectionCount.textContent = String(result.connectionCount);
    if (this.refs.metricGrid) this.refs.metricGrid.innerHTML = renderSdg17MetricItems(result.metrics);
    if (this.refs.finalMessage) this.refs.finalMessage.textContent = result.finalMessage;
    if (this.refs.sourceList) this.refs.sourceList.innerHTML = renderSdg17SourceItems(result.sourceItems);
  }

  render() {
    if (!this.host) return;
    this.unbindEvents();
    this.teardownRuntime();
    const renderVersion = ++this.renderVersion;
    this.disposeRequested = false;
    this.state = createSdg17InitialState();
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

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    this.camera.position.set(0, 0.1, 5.4);

    const ambientLight = new THREE.AmbientLight(0xe8fff8, 1.08);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.26);
    keyLight.position.set(4.8, 3.4, 5.2);
    const linkLight = new THREE.PointLight(0x4ee7bd, 1.4, 8);
    linkLight.position.set(-3.2, 1.6, 3.4);
    this.scene.add(ambientLight, keyLight, linkLight);

    this.stars = this.createStarPoints();
    this.scene.add(this.stars);

    this.globeGroup = new THREE.Group();
    this.globeGroup.rotation.set(-0.12, -0.92, 0);
    this.globeGroup.scale.setScalar(0.92);
    this.scene.add(this.globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
    const earthBump = textureLoader.load("https://threejs.org/examples/textures/planets/earth_bump_2048.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.52, 96, 96),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        bumpMap: earthBump,
        bumpScale: 0.03,
        color: 0xf9fffb,
        metalness: 0.03,
        roughness: 0.86
      })
    );
    this.globeGroup.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.57, 96, 96),
      new THREE.MeshBasicMaterial({
        color: 0x7fffd4,
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
      })
    );
    this.globeGroup.add(atmosphere);

    this.networkGroup = new THREE.Group();
    this.globeGroup.add(this.networkGroup);

    if (this.refs.globeFallback) {
      this.refs.globeFallback.classList.remove("is-visible");
      this.refs.globeFallback.textContent = "";
    }
  }

  createStarPoints() {
    const THREE = this.THREE;
    const count = 820;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.lerp(30, 64, Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);
      positions[i * 3] = radius * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * sinPhi * Math.sin(theta);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0xdff7ff,
        size: 0.14,
        transparent: true,
        opacity: 0.72,
        depthWrite: false
      })
    );
  }

  latLonToVector3(lat, lon, radius) {
    const THREE = this.THREE;
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180 + SDG17_TEXTURE_LON_OFFSET);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  createArcGeometry(from, to, height = 0.12) {
    const THREE = this.THREE;
    const start = from.clone().normalize();
    const end = to.clone().normalize();
    const angle = Math.max(0.0001, start.angleTo(end));
    const sinAngle = Math.sin(angle);
    const points = [];
    const segments = 72;

    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const direction = sinAngle < 0.0001
        ? start.clone()
        : start.clone()
          .multiplyScalar(Math.sin((1 - t) * angle) / sinAngle)
          .add(end.clone().multiplyScalar(Math.sin(t * angle) / sinAngle))
          .normalize();
      const lift = Math.sin(Math.PI * t) * (height + Math.min(0.18, angle * 0.04));
      points.push(direction.multiplyScalar(SDG17_LINE_RADIUS + lift));
    }

    return {
      geometry: new THREE.BufferGeometry().setFromPoints(points),
      points
    };
  }

  renderNetwork(result) {
    if (!this.THREE || !this.networkGroup) return;

    this.clearNetwork();
    if (result.stage !== SDG17_STAGE_RESULT) return;

    const THREE = this.THREE;
    const nodeMap = new Map(result.nodes.map((node) => [node.key, node]));
    const positionMap = new Map();
    const startedAt = performance.now();
    this.networkBurstStartedAt = startedAt;

    result.nodes.forEach((node, index) => {
      const point = this.latLonToVector3(node.lat, node.lon, SDG17_MARKER_RADIUS);
      positionMap.set(node.key, point);
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.035 * node.scale, 20, 20),
        new THREE.MeshBasicMaterial({
          color: index % 3 === 0 ? 0xffd166 : index % 3 === 1 ? 0x58f2c2 : 0x7cc7ff,
          transparent: true,
          opacity: 0.96,
          depthTest: true
        })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.074 * node.scale, 24, 24),
        new THREE.MeshBasicMaterial({
          color: index % 3 === 0 ? 0xffd166 : index % 3 === 1 ? 0x58f2c2 : 0x7cc7ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: true
        })
      );
      marker.position.copy(point);
      marker.scale.setScalar(0.01);
      marker.add(halo);
      marker.userData = {
        delay: startedAt + 120 + index * 62,
        pulse: index * 0.42,
        baseScale: 1
      };
      this.networkGroup.add(marker);
      this.nodeMeshes.push(marker);
    });

    result.links.forEach(([fromKey, toKey], index) => {
      const from = positionMap.get(fromKey);
      const to = positionMap.get(toKey);
      if (!from || !to || !nodeMap.has(fromKey) || !nodeMap.has(toKey)) return;

      const { geometry, points } = this.createArcGeometry(from, to, index % 2 ? 0.1 : 0.14);
      geometry.setDrawRange(0, 0);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: index % 3 === 0 ? 0x58f2c2 : index % 3 === 1 ? 0xffd166 : 0x8fc8ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: true
        })
      );
      line.userData = {
        delay: startedAt + 260 + index * 74,
        pointCount: geometry.getAttribute("position").count
      };
      this.networkGroup.add(line);
      this.linkLines.push(line);

      const pulseCount = index % 3 === 0 ? 3 : 2;
      for (let pulseIndex = 0; pulseIndex < pulseCount; pulseIndex += 1) {
        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.018 + pulseIndex * 0.003, 14, 14),
          new THREE.MeshBasicMaterial({
            color: index % 3 === 0 ? 0xb7ffe9 : index % 3 === 1 ? 0xffe3a3 : 0xb8dbff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true
          })
        );
        pulse.position.copy(points[0]);
        pulse.userData = {
          delay: startedAt + 620 + index * 82 + pulseIndex * 180,
          duration: 1180 + (index % 4) * 150,
          points,
          phase: pulseIndex / pulseCount
        };
        this.networkGroup.add(pulse);
        this.pulseMeshes.push(pulse);
      }
    });
  }

  clearNetwork() {
    if (!this.networkGroup) return;
    while (this.networkGroup.children.length) {
      const child = this.networkGroup.children[0];
      this.networkGroup.remove(child);
      this.disposeObject3D(child);
    }
    this.nodeMeshes = [];
    this.linkLines = [];
    this.pulseMeshes = [];
  }

  animate() {
    if (this.disposeRequested) return;
    this.rafId = window.requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera || !this.globeGroup) return;

    const now = performance.now();
    const stage = this.refs.root?.dataset.stage || SDG17_STAGE_INTRO;
    const burstAge = Math.max(0, now - this.networkBurstStartedAt);
    const burstTurn = stage === SDG17_STAGE_RESULT && burstAge < 1900
      ? (1 - burstAge / 1900) * 0.007
      : 0;
    const targetScale = stage === SDG17_STAGE_RESULT ? 1.06 : 0.92;
    this.globeGroup.rotation.y += (stage === SDG17_STAGE_RESULT ? 0.0014 : 0.0021) + burstTurn;
    this.globeGroup.rotation.x += ((stage === SDG17_STAGE_RESULT ? -0.16 : -0.08) - this.globeGroup.rotation.x) * 0.04;
    this.globeGroup.scale.setScalar(this.globeGroup.scale.x + (targetScale - this.globeGroup.scale.x) * 0.045);

    if (this.stars) {
      this.stars.rotation.y += 0.0004;
      this.stars.rotation.x = Math.sin(now * 0.00005) * 0.035;
    }

    this.nodeMeshes.forEach((node) => {
      const elapsed = Math.max(0, now - node.userData.delay);
      const reveal = easeOutSdg17Cubic(elapsed / 520);
      const pulse = 1 + Math.sin(elapsed * 0.007 + node.userData.pulse) * 0.2;
      node.scale.setScalar(Math.max(0.01, reveal * pulse * node.userData.baseScale));
      if (node.material) node.material.opacity = reveal * 0.98;
      const halo = node.children?.[0];
      if (halo?.material) {
        halo.material.opacity = reveal * (0.11 + Math.max(0, Math.sin(elapsed * 0.005)) * 0.2);
      }
    });

    this.linkLines.forEach((line) => {
      const elapsed = Math.max(0, now - line.userData.delay);
      const progress = easeOutSdg17Cubic(elapsed / 760);
      line.geometry.setDrawRange(0, Math.max(2, Math.floor(line.userData.pointCount * progress)));
      line.material.opacity = progress * (0.58 + Math.max(0, Math.sin(elapsed * 0.005)) * 0.24);
    });

    this.pulseMeshes.forEach((pulse) => {
      const elapsed = now - pulse.userData.delay;
      if (elapsed < 0) {
        pulse.material.opacity = 0;
        return;
      }

      const points = pulse.userData.points;
      const duration = pulse.userData.duration;
      const travel = ((elapsed % duration) / duration + pulse.userData.phase) % 1;
      const pointIndex = Math.min(points.length - 1, Math.floor(travel * (points.length - 1)));
      const glow = Math.sin(travel * Math.PI);
      pulse.position.copy(points[pointIndex]);
      pulse.scale.setScalar(0.72 + glow * 1.7);
      pulse.material.opacity = Math.min(1, elapsed / 320) * (0.18 + glow * 0.72);
    });

    this.camera.lookAt(0, 0, 0);
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
    if (this.scene) this.disposeObject3D(this.scene);
    if (this.renderer) this.renderer.dispose();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.globeGroup = null;
    this.networkGroup = null;
    this.stars = null;
    this.nodeMeshes = [];
    this.linkLines = [];
    this.pulseMeshes = [];
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
