"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Horizontal swipe track for phones and tablets (scroll-snap, native momentum, no hijacking),
 * with previous/next buttons and dots. From `lg` up the same slides stack as editorial chapters.
 */
export function ShowcaseTrack({ names, children }: { names: string[]; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(slides.indexOf(e.target as HTMLElement));
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const track = ref.current;
    const slide = track?.children[Math.max(0, Math.min(names.length - 1, i))] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={ref}
        className="showcase-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:gap-6 sm:px-10 lg:block lg:snap-none lg:overflow-visible lg:p-0"
        aria-roledescription="carousel"
        aria-label="مجموعة العطور"
      >
        {children}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 px-5 sm:px-10 lg:hidden">
        <div className="flex items-center gap-2" role="tablist" aria-label="اختر العطر">
          {names.map((n, i) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={n}
              onClick={() => go(i)}
              className="flex h-11 items-center px-0.5"
            >
              <span className={`block h-px transition-all duration-500 ${active === i ? "w-8 bg-gold" : "w-4 bg-champagne/30"}`} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="me-2 hidden whitespace-nowrap font-latin min-[400px]:inline text-sm tracking-[0.3em] text-champagne/60" dir="ltr">
            {String(active + 1).padStart(2, "0")} / {String(names.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => go(active - 1)} disabled={active === 0} className="flex size-11 items-center justify-center border border-champagne/20 text-champagne disabled:opacity-30" aria-label="العطر السابق">
            →
          </button>
          <button type="button" onClick={() => go(active + 1)} disabled={active === names.length - 1} className="flex size-11 items-center justify-center border border-champagne/20 text-champagne disabled:opacity-30" aria-label="العطر التالي">
            ←
          </button>
        </div>
      </div>
    </div>
  );
}
