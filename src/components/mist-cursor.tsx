"use client";

import { useEffect, useRef } from "react";

/**
 * The pointer leaves a trail of perfume mist: fine golden droplets thrown along
 * the direction of travel plus a few soft vapour puffs that bloom and fade.
 * A click (or tap) gives a little atomiser burst.
 */
type Drop = { x: number; y: number; vx: number; vy: number; r: number; life: number; age: number; puff: boolean; hue: number };

export function MistCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const drops: Drop[] = [];
    const MAX = 420;
    let last: { x: number; y: number; t: number } | null = null;
    let raf = 0;

    const spray = (x: number, y: number, dx: number, dy: number, amount: number, spread: number, speed: number) => {
      const ang = Math.atan2(dy, dx);
      for (let i = 0; i < amount && drops.length < MAX; i++) {
        const a = ang + (Math.random() - 0.5) * spread;
        const s = speed * (0.25 + Math.random() * 0.9);
        const puff = Math.random() < 0.12;
        drops.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - Math.random() * 0.15,
          r: puff ? 14 + Math.random() * 26 : 0.5 + Math.random() * 1.6,
          life: puff ? 1300 + Math.random() * 900 : 700 + Math.random() * 900,
          age: 0,
          puff,
          hue: Math.random(),
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (last) {
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1.5) {
          const v = Math.min(dist / Math.max(16, now - last.t), 3);
          const n = Math.min(10, Math.ceil(dist / 6));
          spray(e.clientX, e.clientY, dx, dy, n, 1.1, 0.6 + v * 1.2);
        }
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const onDown = (e: PointerEvent) => {
      // an atomiser press: a fan of mist upward and outward
      spray(e.clientX, e.clientY, 0.4, -1, 46, 1.6, 3.2);
    };
    const onLeave = () => (last = null);
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let prev = performance.now();
    function tick(now: number) {
      const dt = Math.min(48, now - prev);
      prev = now;
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.age += dt;
        if (d.age >= d.life) {
          drops.splice(i, 1);
          continue;
        }
        const k = dt / 16.67;
        d.vx *= Math.pow(0.955, k);
        d.vy = d.vy * Math.pow(0.955, k) - 0.004 * k; // mist rises softly
        d.x += d.vx * k;
        d.y += d.vy * k;
        const t = d.age / d.life;
        if (d.puff) {
          const r = d.r * (0.6 + t * 1.4);
          const a = 0.11 * Math.sin(Math.PI * Math.min(1, t * 1.2));
          const g = ctx!.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
          g.addColorStop(0, `rgba(246,228,186,${a})`);
          g.addColorStop(0.5, `rgba(214,170,98,${a * 0.5})`);
          g.addColorStop(1, "rgba(143,41,72,0)");
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          const a = (1 - t) * (0.55 + 0.45 * Math.sin(d.age * 0.02 + d.hue * 6));
          const r = d.r * (1 - t * 0.4);
          const g = ctx!.createRadialGradient(d.x, d.y, 0, d.x, d.y, r * 3.2);
          const c = d.hue > 0.5 ? "255,238,200" : "232,198,128";
          g.addColorStop(0, `rgba(${c},${a})`);
          g.addColorStop(0.35, `rgba(${c},${a * 0.45})`);
          g.addColorStop(1, `rgba(${c},0)`);
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, r * 3.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalCompositeOperation = "source-over";
      raf = drops.length ? requestAnimationFrame(tick) : 0;
      if (!raf) ctx!.clearRect(0, 0, w, h);
    }

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] h-full w-full" />;
}
