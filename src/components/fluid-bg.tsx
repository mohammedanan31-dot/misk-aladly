"use client";

import { useEffect, useRef } from "react";

/**
 * Fluid background: molten crimson folds with ember light and drifting glossy
 * reflections. The pointer leans on the flow and leaves a warm light.
 * CSS gradient fallback without WebGL.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
uniform vec3 uBase; uniform vec3 uWine; uniform vec3 uGold; uniform vec3 uEmber;
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, v=0.; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.02+vec2(17.1,9.2); a*=.5; } return v; }
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);
  float d=length(p-m);
  vec2 q=p*.62-(p-m)*exp(-d*d*1.6)*.22;
  q.y+=uScroll*.18;
  float t=uTime*.035;
  // molten crimson: domain-warped folds that keep moving
  vec2 w=vec2(fbm(q+vec2(0.,t)), fbm(q+vec2(5.2,-t*1.3)));
  vec2 r=vec2(fbm(q+1.9*w+vec2(1.7,9.2)+t*.7), fbm(q+1.9*w+vec2(8.3,2.8)-t*.5));
  float f=fbm(q+2.*r);
  vec3 col=mix(uBase*.6,uBase,smoothstep(.15,.65,f));
  col=mix(col,uWine,smoothstep(.32,.8,f+.4*r.x-.12)*.95);
  // ember light pooling in the folds, like light on lacquered silk
  col=mix(col,uEmber,smoothstep(.55,.95,r.y*1.3+f*.3-.2)*.3);
  // glossy reflections: soft vertical shafts that shimmer and drift
  float shaft=fbm(vec2(p.x*4.2+r.x*1.4+t*.8, p.y*.35-t*1.6));
  float glint=smoothstep(.58,.9,shaft)*(.55+.45*sin(t*7.+p.x*9.));
  col+=mix(uEmber,uGold,.6)*glint*.16*smoothstep(-.6,.2,-p.y+.1);
  col+=uGold*exp(-d*d*3.)*.1+uEmber*exp(-d*d*6.)*.12;
  col*=1.-dot(uv-.5,uv-.5)*.75;
  gl_FragColor=vec4(col,1.);
}`;

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

export function FluidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.dataset.fallback = "true";
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.dataset.fallback = "true";
      return;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse"), uScroll = U("uScroll");
    gl.uniform3fv(U("uBase"), rgb("#2a0404"));
    gl.uniform3fv(U("uWine"), rgb("#7a0a0c"));
    gl.uniform3fv(U("uGold"), rgb("#F0A65A"));
    gl.uniform3fv(U("uEmber"), rgb("#c2361f"));

    // the noise is soft and the canvas is upscaled, so a third of CSS resolution is plenty
    const resize = () => {
      const s = 0.34;
      canvas.width = Math.max(2, Math.round(innerWidth * s));
      canvas.height = Math.max(2, Math.round(innerHeight * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    addEventListener("resize", resize);

    const target = { x: 0.68, y: 0.55 }, mouse = { x: 0.68, y: 0.55 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / innerWidth;
      target.y = 1 - e.clientY / innerHeight;
    };
    addEventListener("pointermove", onMove, { passive: true });

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0, lastDraw = 0;
    const frame = (now: number) => {
      raf = document.hidden ? 0 : requestAnimationFrame(frame);
      if (now - lastDraw < 33) return; // ~30 fps is plenty for a slow fluid
      lastDraw = now;
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 40 : (now - t0) / 1000 + 40);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, scrollY / Math.max(innerHeight, 1));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fluid-bg pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
