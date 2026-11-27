/**
 * The four Misk Aladly flacons, modelled in code and lit like a studio shot.
 *
 * Round flacons (Velvet Kiss, Icon): lathe-turned glass, a crystal "mountain"
 * in the base, an engraved ball cap. Square flacons (Adrenaline, Majestic):
 * rounded glass block, flared gold neck and a lacquered square cap.
 * Scroll drives `state`; the render loop eases toward it.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type BottleSpec = {
  slug: string;
  shape: "round" | "square";
  liquid: string;
  metal: "gold" | "silver";
  capTop?: string; // square caps
};

export type SceneState = {
  morph: number; // which bottle (0..n-1), fractional while changing
  capLift: number; // 0..1
  burst: number; // 0..1 mist from the atomiser
  spin: number; // radians, idle turn added by scroll
  x: number; // horizontal placement in world units
  zoom: number; // 1 = default framing
  y: number; // look-at offset: negative lifts the flacon up the frame
};

const GOLD = new THREE.Color("#d8b56a");
const SILVER = new THREE.Color("#dfe3e8");

function engravingTexture(logo: HTMLImageElement | null) {
  // filigree for the ball caps: the peacock mark tiled with soft swirls
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#ffffff";
  g.lineCap = "round";
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 8 + Math.random() * 34;
    g.lineWidth = 2 + Math.random() * 5;
    g.globalAlpha = 0.35 + Math.random() * 0.5;
    g.beginPath();
    g.arc(x, y, r, Math.random() * 6, Math.random() * 6 + 3.5);
    g.stroke();
  }
  if (logo) {
    g.globalAlpha = 0.9;
    g.globalCompositeOperation = "lighter";
    for (let k = 0; k < 4; k++) g.drawImage(logo, (k % 2) * 256 + 18, Math.floor(k / 2) * 256 + 30, 220, 196);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  return t;
}

function crystalBase(radius: number, height: number, mat: THREE.Material) {
  const geo = new THREE.IcosahedronGeometry(1, 3);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 0.82 + 0.28 * Math.sin(v.x * 7.1 + v.z * 3.3) * Math.cos(v.y * 5.7 - v.x * 2.1);
    v.multiplyScalar(n);
    if (v.y < 0) v.y *= 0.05;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(radius, height, radius);
  return m;
}

export class BottleScene {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  bottles: THREE.Group[] = [];
  caps: THREE.Object3D[] = [];
  state: SceneState = { morph: 0, capLift: 0, burst: 0, spin: 0, x: 0, zoom: 1, y: 0 };
  private cur: SceneState = { morph: 0, capLift: 0, burst: 0, spin: 0, x: 0, zoom: 1, y: 0 };
  private pointer = new THREE.Vector2();
  private pointerEased = new THREE.Vector2();
  private motes!: THREE.Points;
  private mist!: THREE.Points;
  private mistSeeds!: Float32Array;
  private raf = 0;
  private visible = true;
  private t0 = performance.now();
  private host: HTMLElement;
  private lite: boolean;
  private ro: ResizeObserver;
  private io: IntersectionObserver;

  constructor(host: HTMLElement, specs: BottleSpec[], logo: HTMLImageElement | null, lite: boolean) {
    this.host = host;
    this.lite = lite;
    this.renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: false, powerPreference: "high-performance" });
    this.renderer.setClearColor("#3a0b1c");
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.camera.position.set(0, 1.05, 8.2);
    this.camera.lookAt(0, 0.95, 0);

    // studio light: a warm key from above, a wine rim from behind, a soft fill
    const key = new THREE.DirectionalLight("#ffe6b8", 2.6);
    key.position.set(-3, 5, 4);
    const rim = new THREE.PointLight("#c0305a", 12, 12);
    rim.position.set(2.5, 2.2, -2.5);
    const rim2 = new THREE.PointLight("#e8b866", 18, 12);
    rim2.position.set(-2.8, 0.6, -2);
    this.scene.add(key, rim, rim2, new THREE.AmbientLight("#3a0f1d", 0.6));

    const engraving = engravingTexture(logo);
    const logoTex = logo ? new THREE.Texture(logo) : null;
    if (logoTex) {
      logoTex.needsUpdate = true;
      logoTex.colorSpace = THREE.SRGBColorSpace;
      logoTex.anisotropy = 8;
    }

    specs.forEach((s) => {
      const g = s.shape === "round" ? this.roundBottle(s, engraving, logoTex) : this.squareBottle(s, logoTex);
      g.visible = false;
      this.bottles.push(g);
      this.scene.add(g);
    });

    this.makeBackdrop();
    this.makeParticles();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.loop();
    });
    this.io.observe(host);
    this.resize();
    this.loop();
  }

  /* ---------- materials ---------- */
  private glass(tint = "#ffffff") {
    // clear, highly reflective glass: a thin film that catches the studio light
    return new THREE.MeshPhysicalMaterial({
      color: tint,
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.2,
      envMapIntensity: 2.2,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      specularIntensity: 1,
      depthWrite: false,
    });
  }
  private liquid(color: string) {
    // perfume lit from behind: a bright golden core, deeper amber at the edges,
    // a soft glow rising toward the shoulder and a bright meniscus line
    const c = new THREE.Color(color);
    const core = c.clone().lerp(new THREE.Color("#fff0b8"), 0.12);
    const edge = c.clone().multiplyScalar(0.34);
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uCore: { value: core }, uEdge: { value: edge }, uTop: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.);
          vP = position;
          vN = normalize(normalMatrix * normal);
          vec4 mv = viewMatrix * wp;
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        uniform vec3 uCore; uniform vec3 uEdge;
        void main(){
          float f = 1. - abs(dot(normalize(vN), normalize(vV)));
          vec3 col = mix(uCore, uEdge, pow(f, 1.4));
          col *= .82 + .32 * smoothstep(.2, 1.3, vP.y);
          // a faint caustic band and the meniscus glint
          col += uCore * .18 * smoothstep(.0,.04, abs(sin(vP.y*9. + vP.x*3.))) * (1.-f);
          col += vec3(1.,.95,.8) * .35 * pow(1. - f, 8.);
          gl_FragColor = vec4(col, .96);
          #include <colorspace_fragment>
        }`,
    });
  }
  private metal(kind: "gold" | "silver", bump?: THREE.Texture) {
    return new THREE.MeshPhysicalMaterial({
      color: kind === "gold" ? GOLD : SILVER,
      metalness: 1,
      roughness: kind === "gold" ? 0.26 : 0.2,
      envMapIntensity: 1.5,
      clearcoat: 0.6,
      ...(bump ? { bumpMap: bump, bumpScale: 2.4 } : {}),
    });
  }
  private label(logoTex: THREE.Texture | null, metal: "gold" | "silver") {
    return new THREE.MeshPhysicalMaterial({
      color: metal === "gold" ? "#f0cf86" : "#f4efe6",
      metalness: 0.9,
      roughness: 0.3,
      map: logoTex,
      alphaMap: logoTex,
      transparent: true,
      envMapIntensity: 1.6,
      depthWrite: false,
    });
  }

  /* ---------- flacons ---------- */
  private nozzle(y: number, mat: THREE.Material) {
    const n = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 48), mat);
    ring.position.y = y + 0.06;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 24), mat);
    stem.position.y = y + 0.19;
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 32), mat);
    head.position.y = y + 0.32;
    n.add(ring, stem, head);
    return n;
  }

  private roundBottle(s: BottleSpec, engraving: THREE.Texture, logoTex: THREE.Texture | null) {
    const g = new THREE.Group();
    const R = 0.66;
    const prof: THREE.Vector2[] = [];
    prof.push(new THREE.Vector2(0.001, 0));
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * (Math.PI / 2);
      prof.push(new THREE.Vector2(R - 0.07 + Math.sin(a) * 0.07, 0.07 - Math.cos(a) * 0.07));
    }
    prof.push(new THREE.Vector2(R, 1.18));
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2);
      prof.push(new THREE.Vector2(0.24 + (R - 0.24) * Math.cos(a), 1.18 + 0.27 * Math.sin(a)));
    }
    prof.push(new THREE.Vector2(0.22, 1.5));
    prof.push(new THREE.Vector2(0.001, 1.5));
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), this.glass());
    g.add(body);

    // the thick crystal "mountain" inside the base
    const base = crystalBase(0.5, 0.34, this.glass("#fffaf0"));
    base.position.y = 0.04;
    g.add(base);

    // perfume, filling from above the base
    const lp: THREE.Vector2[] = [new THREE.Vector2(0.001, 0.34)];
    lp.push(new THREE.Vector2(R - 0.06, 0.34), new THREE.Vector2(R - 0.06, 1.14));
    for (let i = 1; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2);
      lp.push(new THREE.Vector2(0.2 + (R - 0.26) * Math.cos(a), 1.14 + 0.22 * Math.sin(a)));
    }
    lp.push(new THREE.Vector2(0.001, 1.36));
    const liquid = new THREE.Mesh(new THREE.LatheGeometry(lp, 96), this.liquid(s.liquid));
    g.add(liquid);

    // the peacock, engraved on the front
    const lbl = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.006, R + 0.006, 0.78, 64, 1, true, -0.62, 1.24), this.label(logoTex, s.metal));
    lbl.position.y = 0.78;
    g.add(lbl);

    const metal = this.metal(s.metal);
    g.add(this.nozzle(1.5, metal));

    // engraved ball cap with its collar
    const cap = new THREE.Group();
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.35, 0.16, 64), metal);
    collar.position.y = 1.58;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.44, 96, 64), this.metal(s.metal, engraving));
    ball.position.y = 1.98;
    cap.add(collar, ball);
    g.add(cap);
    this.caps.push(cap);
    return g;
  }

  private squareBottle(s: BottleSpec, logoTex: THREE.Texture | null) {
    const g = new THREE.Group();
    const W = 1.0, H = 1.5, D = 0.62;
    const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.09), this.glass());
    body.position.y = H / 2;
    g.add(body);
    // heavy clear base, then perfume
    const liquid = new THREE.Mesh(new RoundedBoxGeometry(W - 0.14, H - 0.5, D - 0.14, 4, 0.05), this.liquid(s.liquid));
    liquid.position.y = 0.28 + (H - 0.5) / 2;
    g.add(liquid);

    const lbl = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.7), this.label(logoTex, s.metal));
    lbl.position.set(0, 0.86, D / 2 + 0.004);
    g.add(lbl);

    const metal = this.metal("gold");
    g.add(this.nozzle(H, metal));

    const cap = new THREE.Group();
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 48), this.metal(s.metal));
    neck.position.y = H + 0.09;
    const flare = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.2, 0.32, 4, 1, false, Math.PI / 4), metal);
    flare.position.y = H + 0.34;
    const top = new THREE.Mesh(
      new RoundedBoxGeometry(0.68, 0.2, 0.68, 4, 0.05),
      new THREE.MeshPhysicalMaterial({ color: s.capTop ?? "#111", roughness: 0.18, clearcoat: 1, envMapIntensity: 1.2 }),
    );
    top.position.y = H + 0.6;
    cap.add(neck, flare, top);
    g.add(cap);
    this.caps.push(cap);
    return g;
  }

  /* ---------- backdrop: slow perfume smoke in wine and gold ---------- */
  private backdrop!: THREE.ShaderMaterial;
  private makeBackdrop() {
    this.backdrop = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uBase: { value: new THREE.Color("#4a0f24") },
        uWine: { value: new THREE.Color("#8f2948") },
        uGold: { value: new THREE.Color("#c6a15b") },
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",
      fragmentShader: `
        precision highp float;
        varying vec2 vUv; uniform float uTime; uniform vec2 uMouse;
        uniform vec3 uBase; uniform vec3 uWine; uniform vec3 uGold;
        float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
        float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
        float fbm(vec2 p){ float a=.5, v=0.; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return v; }
        void main(){
          vec2 p = (vUv - .5) * vec2(2.4, 1.2);
          float t = uTime * .035;
          p += uMouse * .08;
          // smoke rises: domain-warp with an upward drift
          vec2 q = vec2(fbm(p*1.3 + vec2(0., -t*2.)), fbm(p*1.3 + vec2(5.2, -t*2.6)));
          vec2 r = vec2(fbm(p*1.6 + 2.2*q + vec2(1.7, 9.2) - vec2(0., t*3.)), fbm(p*1.6 + 2.2*q + vec2(8.3, 2.8)));
          float f = fbm(p*1.4 + 2.*r);
          vec3 col = mix(uBase*.75, uBase*1.15, smoothstep(.15,.7,f));
          col = mix(col, uWine, smoothstep(.35,.85,f + .3*r.x - .1) * .9);
          // thin gold veils, like light caught in perfume vapour
          float veil = smoothstep(.55,.95, r.y*1.2 + f*.4 - .15);
          col = mix(col, uGold, veil * .45);
          // a warm pool where the flacon stands
          col += uGold * .16 * exp(-dot(p - vec2(-.45,-.1), p - vec2(-.45,-.1)) * 3.);
          col *= 1. - dot(vUv-.5, vUv-.5) * .7;
          gl_FragColor = vec4(col, 1.);
        }`,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(34, 16), this.backdrop);
    plane.position.set(0, 1, -6);
    this.scene.add(plane);
  }

  /* ---------- particles: drifting gold, and the mist from the atomiser ---------- */
  private makeParticles() {
    const sprite = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,240,205,1)");
      gr.addColorStop(0.3, "rgba(240,205,140,.6)");
      gr.addColorStop(1, "rgba(200,150,80,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const N = this.lite ? 380 : 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = Math.random() * 5 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.motes = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.05, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 }),
    );
    this.scene.add(this.motes);

    const M = this.lite ? 260 : 600;
    this.mistSeeds = new Float32Array(M * 4);
    for (let i = 0; i < M; i++) {
      const a = (Math.random() - 0.5) * 0.9; // cone toward the right
      this.mistSeeds[i * 4] = Math.cos(a) * (0.6 + Math.random());
      this.mistSeeds[i * 4 + 1] = Math.sin(a) * (0.6 + Math.random()) + 0.25;
      this.mistSeeds[i * 4 + 2] = (Math.random() - 0.5) * 0.8;
      this.mistSeeds[i * 4 + 3] = Math.random();
    }
    const mg = new THREE.BufferGeometry();
    mg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(M * 3), 3));
    this.mist = new THREE.Points(
      mg,
      new THREE.PointsMaterial({ size: 0.07, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }),
    );
    this.scene.add(this.mist);
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  private resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    if (this.raf || !this.visible) return;
    this.raf = requestAnimationFrame((now) => {
      this.raf = 0;
      this.frame(now);
      this.loop();
    });
  };

  private frame(now: number) {
    const t = (now - this.t0) / 1000;
    const k = 0.085;
    const c = this.cur, s = this.state;
    (Object.keys(s) as (keyof SceneState)[]).forEach((key) => (c[key] += (s[key] - c[key]) * k));
    this.pointerEased.lerp(this.pointer, 0.05);
    this.backdrop.uniforms.uTime.value = t;
    (this.backdrop.uniforms.uMouse.value as THREE.Vector2).copy(this.pointerEased);

    const n = this.bottles.length;
    for (let i = 0; i < n; i++) {
      const b = this.bottles[i];
      const d = c.morph - i;
      const ad = Math.abs(d);
      const sc = Math.max(0, 1 - ad * 1.9);
      const e = sc * sc * (3 - 2 * sc);
      b.visible = e > 0.01;
      if (!b.visible) continue;
      b.scale.setScalar(0.4 + 0.6 * e);
      b.position.set(c.x - d * 2.2, -0.15 + (1 - e) * -0.4, 0);
      b.rotation.y = c.spin + t * 0.25 + d * Math.PI * 1.4 + this.pointerEased.x * 0.35;
      b.rotation.x = this.pointerEased.y * 0.08;
      b.rotation.z = Math.sin(t * 0.6 + i) * 0.015;
      // the cap lifts and tilts away on the active flacon
      const cap = this.caps[i];
      const lift = i === Math.round(c.morph) ? c.capLift : 0;
      cap.position.y = lift * 0.7;
      cap.position.x = lift * 0.38;
      cap.rotation.z = -lift * 0.32;
    }

    // drifting motes
    const mp = this.motes.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < mp.count; i++) {
      let y = mp.getY(i) + 0.0025 + (i % 7) * 0.0004;
      if (y > 4.2) y = -1;
      mp.setY(i, y);
      mp.setX(i, mp.getX(i) + Math.sin(t * 0.3 + i) * 0.0012 + this.pointerEased.x * 0.0015);
    }
    mp.needsUpdate = true;

    // the atomiser's breath, scrubbed by scroll
    const mm = this.mist.material as THREE.PointsMaterial;
    const burst = c.burst;
    mm.opacity = Math.sin(Math.min(1, burst) * Math.PI) * 0.95;
    if (mm.opacity > 0.01) {
      const active = this.bottles[Math.round(c.morph)] ?? this.bottles[0];
      const top = active.position.clone().add(new THREE.Vector3(0.12, 1.86 * active.scale.y - 0.15, 0.1));
      const arr = this.mist.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < arr.count; i++) {
        const sx = this.mistSeeds[i * 4], sy = this.mistSeeds[i * 4 + 1], sz = this.mistSeeds[i * 4 + 2], r = this.mistSeeds[i * 4 + 3];
        const tt = Math.max(0, burst * 1.3 - r * 0.3);
        const spread = tt * (1.6 + r);
        arr.setXYZ(i, top.x + sx * spread, top.y + sy * spread + tt * tt * 0.5, top.z + sz * spread);
      }
      arr.needsUpdate = true;
    }

    const cam = this.camera;
    cam.position.z = 8.2 / c.zoom;
    cam.position.y = 1.05 + (c.zoom - 1) * 0.6 + c.y;
    cam.lookAt(c.x * 0.15, 0.95 + (c.zoom - 1) * 0.5 + c.y, 0);
    this.renderer.render(this.scene, cam);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
