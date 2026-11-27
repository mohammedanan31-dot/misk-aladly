"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string };

/** Product gallery: large image with hover zoom on desktop, thumbnails, and a full-screen viewer. */
export function Gallery({ shots, name }: { shots: Shot[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [viewer, setViewer] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shot = shots[i];

  useEffect(() => {
    if (!viewer) return;
    document.documentElement.classList.add("bag-open");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(false);
      if (e.key === "ArrowLeft") setI((n) => (n + 1) % shots.length);
      if (e.key === "ArrowRight") setI((n) => (n - 1 + shots.length) % shots.length);
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("bag-open");
    };
  }, [viewer, shots.length]);

  return (
    <div>
      <button
        type="button"
        className="frame group relative block aspect-[4/5] w-full cursor-zoom-in bg-burgundy"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
        onClick={() => setViewer(true)}
        aria-label={`تكبير صورة ${name}`}
      >
        {shots.map((s, k) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            priority={k === 0}
            sizes="(min-width:1024px) 50vw, 100vw"
            className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-silk)] ${k === i ? "opacity-100" : "opacity-0"}`}
            style={k === i && zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        ))}
        <span className="pointer-events-none absolute bottom-4 start-4 bg-night/60 px-3 py-1.5 text-sm text-champagne/85 backdrop-blur-md">
          اضغط للتكبير
        </span>
      </button>

      {shots.length > 1 && (
        <div className="mt-6 flex gap-3" role="tablist" aria-label="صور العطر">
          {shots.map((s, k) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`الصورة ${k + 1}`}
              onClick={() => setI(k)}
              className={`relative aspect-square w-20 overflow-hidden border transition-colors duration-500 sm:w-24 ${k === i ? "border-gold" : "border-gold/15 opacity-60 hover:opacity-100"}`}
            >
              <Image src={s.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {viewer && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`صور ${name}`} data-lenis-prevent onClick={() => setViewer(false)}>
          <div className="relative h-[86svh] w-[92vw] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={shot.src} alt={shot.alt} fill sizes="92vw" className="object-contain" />
          </div>
          <button ref={closeRef} type="button" onClick={() => setViewer(false)} className="absolute end-5 top-5 flex size-12 items-center justify-center border border-champagne/25 text-2xl text-champagne" aria-label="إغلاق">
            ×
          </button>
          {shots.length > 1 && (
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setI((n) => (n - 1 + shots.length) % shots.length)} className="flex size-12 items-center justify-center border border-champagne/25 text-champagne" aria-label="الصورة السابقة">
                →
              </button>
              <span className="font-latin text-sm tracking-[0.3em] text-champagne/70" dir="ltr">
                {i + 1} / {shots.length}
              </span>
              <button type="button" onClick={() => setI((n) => (n + 1) % shots.length)} className="flex size-12 items-center justify-center border border-champagne/25 text-champagne" aria-label="الصورة التالية">
                ←
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
