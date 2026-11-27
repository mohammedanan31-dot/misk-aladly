"use client";

import { useEffect, useRef } from "react";

/**
 * Perfume-mist cursor. A fine gold ring follows the pointer; moving it throws a
 * trail of golden droplets and soft vapour that bloom and drift upward. A click
 * (or tap) is an atomiser press: a bright fan of mist.
 * Sprites are pre-rendered once, so each frame is only cheap drawImage calls.
 */
type Drop = { x: number; y: number; vx: number; vy: number; r: number; life: number; age: number; kind: 0 | 1 | 2 };

function sprite(size: number, stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function MistCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current, ring = ringRef.current;
    if (!canvas || !ring) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = matchMedia("(pointer: fine)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPRITES = [
      sprite(64, [[0, "rgba(255,244,214,1)"], [0.22, "rgba(246,218,152,.75)"], [0.5, "rgba(214,170,98,.22)"], [1, "rgba(214,170,98,0)"]]),
      sprite(64, [[0, "rgba(255,255,240,1)"], [0.2, "rgba(255,236,196,.7)"], [0.55, "rgba(232,198,128,.18)"], [1, "rgba(232,198,128,0)"]]),
      sprite(256, [[0, "rgba(250,230,190,.55)"], [0.35, "rgba(220,178,108,.28)"], [0.7, "rgba(100,29,53,.12)"], [1, "rgba(100,29,53,0)"]]),
    ];

    let w = 0, h = 0;
    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      canvas.width = w; // 1x is enough for soft mist
      canvas.height = h;
    };
    resize();
    addEventListener("resize", resize);

    const drops: Drop[] = [];
    const MAX = 320;
    let last: { x: number; y: number; t: number } | null = null;
    let raf = 0;
    const ringPos = { x: -100, y: -100 }, ringTarget = { x: -100, y: -100 };
    let ringScale = 1;

    const spray = (x: number, y: number, dx: number, dy: number, amount: number, spread: number, speed: number, puffChance: number) => {
      const ang = Math.atan2(dy, dx);
      for (let i = 0; i < amount && drops.length < MAX; i++) {
        const a = ang + (Math.random() - 0.5) * spread;
        const s = speed * (0.3 + Math.random() * 0.9);
        const puff = Math.random() < puffChance;
        drops.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - Math.random() * 0.2,
          r: puff ? 30 + Math.random() * 46 : 2.5 + Math.random() * 5.5,
          life: puff ? 1500 + Math.random() * 1100 : 800 + Math.random() * 1000,
          age: 0,
          kind: puff ? 2 : Math.random() < 0.5 ? 0 : 1,
        });
      }
      kick();
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      ringTarget.x = e.clientX;
      ringTarget.y = e.clientY;
      if (last) {
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 2) {
          const v = Math.min(dist / Math.max(16, now - last.t), 3);
          spray(e.clientX, e.clientY, dx, dy, Math.min(9, Math.ceil(dist / 7)), 1.2, 0.7 + v * 1.3, 0.16);
        }
      } else {
        ringPos.x = e.clientX;
        ringPos.y = e.clientY;
      }
      last = { x: e.clientX, y: e.clientY, t: now };
      ring.style.opacity = fine ? "1" : "0";
    };
    const onDown = (e: PointerEvent) => {
      ringScale = 0.7;
      spray(e.clientX, e.clientY, 0.35, -1, 60, 1.5, 3.6, 0.2);
    };
    const onLeave = () => {
      last = null;
      ring.style.opacity = "0";
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let prev = performance.now();
    function kick() {
      if (!raf) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }
    function tick(now: number) {
      const dt = Math.min(48, now - prev);
      prev = now;
      const k = dt / 16.67;

      // ring follows with a little lag; a press pinches it like a spray nozzle
      ringPos.x += (ringTarget.x - ringPos.x) * Math.min(1, 0.22 * k);
      ringPos.y += (ringTarget.y - ringPos.y) * Math.min(1, 0.22 * k);
      ringScale += (1 - ringScale) * Math.min(1, 0.12 * k);
      ring!.style.transform = `translate3d(${ringPos.x - 18}px,${ringPos.y - 18}px,0) scale(${ringScale.toFixed(3)})`;

      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.age += dt;
        if (d.age >= d.life) {
          drops[i] = drops[drops.length - 1];
          drops.pop();
          continue;
        }
        d.vx *= Math.pow(0.95, k);
        d.vy = d.vy * Math.pow(0.95, k) - 0.006 * k; // mist rises softly
        d.x += d.vx * k;
        d.y += d.vy * k;
        const t = d.age / d.life;
        if (d.kind === 2) {
          const r = d.r * (0.5 + t * 1.6);
          ctx!.globalAlpha = 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.15));
          ctx!.drawImage(SPRITES[2], d.x - r, d.y - r, r * 2, r * 2);
        } else {
          const r = d.r * (1 - t * 0.35);
          ctx!.globalAlpha = (1 - t) * (0.7 + 0.3 * Math.sin(d.age * 0.025 + d.r));
          ctx!.drawImage(SPRITES[d.kind], d.x - r, d.y - r, r * 2, r * 2);
        }
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
      const settling = Math.abs(ringTarget.x - ringPos.x) + Math.abs(ringTarget.y - ringPos.y) > 0.5 || Math.abs(1 - ringScale) > 0.01;
      raf = drops.length || settling ? requestAnimationFrame(tick) : 0;
    }
    const onAnyMove = () => kick();
    addEventListener("pointermove", onAnyMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointermove", onAnyMove);
      removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] h-full w-full" />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[46] size-9 rounded-full border border-gold-soft/70 opacity-0 shadow-[0_0_18px_rgba(197,164,109,0.45),inset_0_0_10px_rgba(197,164,109,0.25)] transition-opacity duration-500"
      />
    </>
  );
}
