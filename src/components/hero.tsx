"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { genderLabel, getPerfume, type Perfume } from "@/data/site";
import { Price } from "./price";
import { AddToBag } from "./bag";

/** Order of the selector pills, as in the approved design. */
const ORDER = ["adrenaline", "icon", "velvet-kiss", "majestic"] as const;
const ITEMS = ORDER.map((s) => getPerfume(s)!) as Perfume[];
const AUTO_MS = 7000;

/**
 * Product hero: a framed red stage with the selected bottle in the centre, its name large on the left,
 * details and add-to-bag on the right, and pills to switch perfume. Switches animate (bottle cross-fade with
 * blur and lift, name letter by letter, copy and price swap). It auto-advances until the visitor interacts.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const p = ITEMS[active];
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const pick = useCallback((i: number, byUser = true) => {
    setActive((i + ITEMS.length) % ITEMS.length);
    if (byUser) setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto || hover || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setTimeout(() => pick(active + 1, false), AUTO_MS);
    return () => clearTimeout(timer.current);
  }, [active, auto, hover, pick]);

  return (
    <section className="relative px-[3vw] pb-10 pt-4 sm:pt-6" aria-roledescription="carousel" aria-label="عطور مسك العدلي">
      <div className="hero-exit mx-auto w-full max-w-[1360px]">
      <div
        className="hero-card tilt lg:h-[min(92svh,920px)] lg:min-h-[640px]"
        data-tilt="3"
        data-tilt-scale="1"
        dir="ltr"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") pick(active + 1);
          if (e.key === "ArrowLeft") pick(active - 1);
        }}
      >
        {/* per-perfume light, cross-faded */}
        {ITEMS.map((x, i) => (
          <div
            key={x.slug}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-[1200ms]"
            style={{ opacity: i === active ? 1 : 0, background: `radial-gradient(40% 50% at 61% 60%, ${x.theme.glow}55, transparent 70%)` }}
          />
        ))}

        {/* room for the header that sits on the card */}
        <div className="h-20 sm:h-24" aria-hidden="true" />

        <div className="relative grid gap-4 px-5 pb-6 sm:px-10 lg:absolute lg:inset-0 lg:block lg:p-0">
          {/* ghost bottle, far left */}
          <div data-depth="-18" className="hero-depth pointer-events-none absolute left-[3%] top-[14%] hidden h-[66%] w-[26%] lg:block" aria-hidden="true">
            {ITEMS.map((x, i) => (
              <div key={x.slug} className="hero-ghost hero-shot absolute inset-0 opacity-0" data-state={i === active ? "in" : "out"} style={i === active ? { opacity: 0.16 } : undefined}>
                <Image src={x.scene} alt="" fill sizes="26vw" className="scale-[1.35] object-contain blur-[1.5px]" />
              </div>
            ))}
          </div>

          {/* the bottle on its stage */}
          <div className="order-2 lg:absolute lg:left-[61%] lg:top-[9%] lg:h-[73%] lg:w-auto lg:-translate-x-1/2" style={{ aspectRatio: "495 / 673" }}>
            <div data-depth="12" className="hero-depth relative mx-auto h-full w-[78%] max-w-[26rem] sm:w-[60%] lg:w-full lg:max-w-none" style={{ aspectRatio: "495 / 673" }}>
              <div className="bottle-sway absolute inset-0">
                {ITEMS.map((x, i) => (
                  <div key={x.slug} className="hero-scene hero-shot absolute inset-0" data-state={i === active ? "in" : "out"} aria-hidden={i !== active}>
                    <Image src={x.scene} alt={i === active ? `قارورة ${x.name} من مسك العدلي` : ""} fill priority={i === 0} sizes="(min-width:1024px) 36vw, 78vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* name + line */}
          <div data-depth="-6" className="hero-depth order-1 text-center lg:absolute lg:left-[8%] lg:top-[39%] lg:max-w-[44%] lg:text-left">
            <h1 key={p.slug} className="hero-title font-latin text-[11vw] uppercase leading-[0.95] tracking-[0.01em] text-white sm:text-7xl lg:text-[clamp(2.8rem,4.8vw,5.2rem)]" aria-live="polite">
              {/* heavy first half, hairline second half */}
              {p.nameParts.map((part, w) => {
                const offset = p.nameParts.slice(0, w).join("").length;
                return (
                  <span key={w} className={`inline-block whitespace-pre ${w === 0 ? "font-extrabold" : "font-extralight text-[#ffd2bd]"}`}>
                    {part.split("").map((c, k) => (
                      <span key={k} className="ch" style={{ "--i": offset + k } as React.CSSProperties}>
                        {c}
                      </span>
                    ))}
                  </span>
                );
              })}
            </h1>
            <div key={`t-${p.slug}`} className="fade-swap mt-5 flex items-start justify-center gap-5 lg:justify-start" style={{ animationDelay: "0.25s" }}>
              <span className="mt-3 hidden h-px w-20 shrink-0 bg-gradient-to-r from-white/30 to-[#ff5a3c] sm:block" />
              <div>
                <p className="font-latin text-lg font-light italic leading-snug text-white/95 sm:text-2xl lg:max-w-[17rem]">{p.en}</p>
                <p className="mt-2 text-base font-medium text-coral" dir="rtl">
                  {p.short}
                </p>
              </div>
            </div>
          </div>

          {/* details */}
          <div key={`d-${p.slug}`} className="fade-swap order-3 flex flex-wrap items-end justify-between gap-4 lg:absolute lg:right-[4%] lg:top-[43%] lg:block lg:w-[15.5rem]" style={{ animationDelay: "0.35s" }}>
            <div>
              <Link href={`/perfume/${p.slug}`} className="link-line font-latin text-sm font-light uppercase tracking-[0.35em] text-coral hover:text-white">
                Details
              </Link>
              <p className="mt-2">
                <Price value={p.price} className="text-4xl sm:text-[2.8rem]" />
              </p>
              <p className="mt-2 font-latin text-lg">
                <span className="font-semibold text-white">{p.size}</span> <span className="font-light text-rose">ml</span>
                <span className="mx-2 text-white/30">·</span>
                <span dir="rtl" className="text-rose">
                  {genderLabel[p.gender]}
                </span>
              </p>
            </div>
            <AddToBag slug={p.slug} label="Add to Cart +" className="mt-0 w-full sm:w-auto lg:mt-5 lg:w-full" />
          </div>

          {/* selector */}
          <div className="order-4 lg:absolute lg:bottom-[5%] lg:left-1/2 lg:w-[66%] lg:-translate-x-1/2">
            <div className="grid grid-cols-2 gap-3 rounded-[2.5rem] border border-[rgba(255,70,60,0.5)] p-3 sm:flex sm:items-center sm:justify-around sm:rounded-full sm:px-10 sm:py-5" role="tablist" aria-label="اختر العطر">
              {ITEMS.map((x, i) => (
                <button key={x.slug} type="button" role="tab" aria-selected={i === active} aria-label={`${x.name} — ${genderLabel[x.gender]}`} onClick={() => pick(i)} className="pill">
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
