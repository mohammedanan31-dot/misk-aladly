"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, genderLabel, perfumes } from "@/data/site";
import { OrderButton } from "./order-button";

/**
 * The collection on a slowly turning ring of glass plinths. Drag (or swipe) to
 * spin; it keeps its momentum and settles back into a gentle drift. The bottle
 * nearest the viewer is lit, named and orderable.
 */
const ITEMS = [...perfumes, ...perfumes]; // eight plinths, two of each signature
const STEP = 360 / ITEMS.length;

export function BottleCarousel() {
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [front, setFront] = useState(0);
  const [radius, setRadius] = useState(520);

  useEffect(() => {
    const fit = () => setRadius(innerWidth < 640 ? 230 : innerWidth < 1024 ? 420 : 540);
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0, vel = still ? 0 : -0.06, dragging = false, moved = 0, lastX = 0, lastT = 0, raf = 0, visible = true, lastFront = -1;
    const drift = still ? 0 : -0.06;

    const paint = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
      let best = 0, bestCos = -2;
      for (let i = 0; i < ITEMS.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const a = ((angle - i * STEP) * Math.PI) / 180;
        const c = Math.cos(a);
        if (c > bestCos) { bestCos = c; best = i; }
        const lit = Math.max(0, c);
        el.style.opacity = (0.18 + 0.82 * Math.pow((c + 1) / 2, 1.6)).toFixed(3);
        el.style.setProperty("--lit", lit.toFixed(3));
      }
      const f = best % perfumes.length;
      if (f !== lastFront) { lastFront = f; setFront(f); }
    };

    const tick = () => {
      raf = 0;
      if (!dragging) {
        vel += (drift - vel) * 0.02;
        angle += vel;
      }
      paint();
      if (visible) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastT = performance.now();
          };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      moved += Math.abs(dx);
      angle += dx * 0.25;
      vel = (dx * 0.25) / Math.max(1, (now - lastT) / 16.67);
      lastX = e.clientX;
      lastT = now;
    };
    const up = () => { dragging = false; };
    const host = ring.parentElement!;
    // a drag is not a click on the bottle under the pointer
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    host.addEventListener("click", click, true);
    host.addEventListener("pointerdown", down);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(host);
    paint();
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("click", click, true);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
  }, [radius]);

  const p = perfumes[front];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" aria-label="المجموعة">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-10">
        <span className="eyebrow reveal">المجموعة · Signature Collection</span>
        <h2 className="reveal mt-6 font-display text-5xl leading-[1.3] sm:text-8xl">
          أربعة عطور، <span className="text-gold">أربعة توقيعات</span>
        </h2>
      </div>

      {/* the ring */}
      <div className="relative mt-6 h-[30rem] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[36rem]" style={{ perspective: "1600px" }}>
        <div className="absolute inset-x-0 bottom-[10%] mx-auto h-24 w-[70%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(198,161,91,0.28),transparent)] blur-2xl" />
        <div ref={ringRef} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {ITEMS.map((q, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute -left-[5.5rem] -top-[13rem] w-44 sm:-left-[7rem] sm:-top-[15.5rem] sm:w-56"
              style={{ transform: `rotateY(${-i * STEP}deg) translateZ(${radius}px)`, transformStyle: "preserve-3d" }}
            >
              <Link href={`/perfume/${q.slug}`} draggable={false} className="block" aria-label={q.name}>
                <div
                  className="relative h-[24rem] overflow-hidden rounded-[2rem] border border-champagne/15 sm:h-[29rem]"
                  style={{
                    background:
                      "linear-gradient(170deg, rgba(242,228,208,calc(0.06 + var(--lit,0) * 0.1)), rgba(110,23,52,calc(0.25 + var(--lit,0) * 0.35)) 60%, rgba(18,3,4,0.6))",
                    boxShadow: "0 40px 80px -30px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.12)",
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-2/3"
                    style={{ background: "radial-gradient(60% 55% at 50% 0%, rgba(246,222,170,calc(var(--lit,0) * 0.45)), transparent 70%)" }}
                  />
                  <Image
                    src={q.image}
                    alt=""
                    width={420}
                    height={960}
                    draggable={false}
                    sizes="240px"
                    className="absolute inset-x-0 bottom-14 mx-auto h-[78%] w-auto drop-shadow-[0_24px_24px_rgba(0,0,0,0.6)]"
                  />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[1.25rem] border border-champagne/15 bg-night/55 px-4 py-2.5 backdrop-blur-md">
                    <span className="font-latin text-lg text-champagne" dir="ltr">{q.name}</span>
                    <span className="text-[11px] text-gold-soft">{genderLabel[q.gender]}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* the bottle in front */}
      <div className="mx-auto -mt-4 flex max-w-3xl flex-col items-center gap-5 px-5 text-center" aria-live="polite">
        <p className="text-xs tracking-[0.35em] text-champagne/45">اسحب لتدوير المجموعة</p>
        <h3 className="font-latin text-5xl leading-none sm:text-7xl" dir="ltr">
          {p.nameParts[0]}
          <em className="text-gold">{p.nameParts[1]}</em>
        </h3>
        <p className="text-lg text-champagne/70">
          {p.notes.join(" · ")} — <span className="text-gold-soft">{formatPrice(p.price)}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <OrderButton perfume={p} />
          <Link href={`/perfume/${p.slug}`} className="btn-glass rounded-full px-6 py-3.5 text-sm">
            اكتشف العطر
          </Link>
        </div>
      </div>
    </section>
  );
}
