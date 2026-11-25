"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { genderLabel, perfumes } from "@/data/site";
import { GoldDust } from "./gold-dust";

/**
 * Opening scene: a gilded stage on burgundy velvet. The four bottles take the
 * pedestal in turn; the scene leans gently toward the pointer.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % perfumes.length), 4200);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const p = perfumes[active];

  return (
    <section ref={ref} className="relative isolate min-h-[100dvh] overflow-hidden bg-night" aria-label="مسك العدلي">
      {/* the stage: a 16:9 box that always covers the viewport, so the pedestal stays put */}
      <div
        className="absolute left-1/2 top-1/2 aspect-video w-[max(100vw,177.78dvh)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-silk)]"
          style={{ transform: "translate3d(calc(var(--mx,0) * -18px), calc(var(--my,0) * -12px), 0) scale(1.04)" }}
        >
          <Image src="/scenes/hero-stage.webp" alt="" fill priority sizes="100vw" className="zoom-out object-cover" />
          {/* bottles on the pedestal (its top sits at 70% of the scene) */}
          <span className="stage-shadow" style={{ left: "50%", top: "70.5%", width: "9%", height: "2.5%" }} />
          <div className="absolute bottom-[29.5%] left-1/2 h-[33%] w-[20%] -translate-x-1/2 sm:h-[46%]">
            {perfumes.map((q, i) => (
              <Image
                key={q.slug}
                src={q.image}
                alt=""
                width={420}
                height={960}
                priority={i === 0}
                sizes="25vw"
                className={`absolute inset-x-0 bottom-0 mx-auto h-full w-auto drop-shadow-[0_40px_30px_rgba(0,0,0,0.7)] transition-[opacity,transform,filter] duration-[1400ms] ease-[var(--ease-silk)] ${
                  i === active ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-6 scale-95 opacity-0 blur-sm"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-night/85 via-transparent via-45% to-night sm:from-night/75 sm:via-40%" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_65%,transparent,rgba(20,7,12,0.7))]" />
      <GoldDust density={0.00006} />

      {/* type */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-between px-5 pb-8 pt-32 sm:px-10 sm:pb-10 sm:pt-36">
        <div className="flex items-start justify-between gap-6">
          <div className="rise" style={{ animationDelay: "0.4s" }}>
            <span className="eyebrow">دار عطور · مسك العدلي</span>
            <h1 className="mt-6 max-w-xl font-display text-[2.75rem] leading-[1.35] text-champagne sm:text-7xl sm:leading-[1.3]">
              حين يصبح العطر
              <br />
              <span className="text-gold">توقيعًا لا يُنسى</span>
            </h1>
          </div>
          <p
            className="rise hidden max-w-[14rem] pt-4 text-left font-latin text-sm italic leading-6 text-champagne/55 lg:block"
            dir="ltr"
            style={{ animationDelay: "0.7s" }}
          >
            Four signatures, composed for those who leave a trace.
          </p>
        </div>

        <div className="rise flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" style={{ animationDelay: "0.9s" }}>
          <div className="flex items-end gap-5">
            <div>
              <p className="text-xs tracking-[0.25em] text-gold/80">
                {String(active + 1).padStart(2, "0")} / 0{perfumes.length} · عطر {genderLabel[p.gender]}
              </p>
              <Link
                href={`/perfume/${p.slug}`}
                className="mt-1 block font-latin text-5xl leading-none text-champagne transition-colors hover:text-gold-soft sm:text-6xl"
                dir="ltr"
              >
                {p.nameParts[0]}
                <em className="text-gold">{p.nameParts[1]}</em>
              </Link>
              <p className="mt-2 text-sm text-champagne/60">{p.notes.join(" · ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {perfumes.map((q, i) => (
              <button
                key={q.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={q.name}
                aria-current={i === active}
                className="group flex h-10 items-center"
              >
                <span
                  className={`block h-px transition-all duration-700 ease-[var(--ease-silk)] ${
                    i === active ? "w-14 bg-gold" : "w-6 bg-champagne/30 group-hover:bg-champagne/70"
                  }`}
                />
              </button>
            ))}
            <Link href="/#collection" className="btn-glass ms-3 rounded-full px-5 py-2.5 text-sm">
              اكتشف المجموعة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
