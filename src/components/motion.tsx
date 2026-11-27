"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One motion layer for the whole site:
 *  - Lenis smooth scrolling (desktop pointers only, never with reduced motion)
 *  - `.reveal`, `.mask-reveal`, `.gold-line` get `.is-visible` as they enter the viewport
 *  - `[data-depth]` layers drift against the pointer (hero parallax)
 *  - `.magnetic` buttons lean toward the pointer
 *  - `.tilt` panels rotate in 3D under the pointer, with a glare that follows it
 */
export function Motion() {
  const pathname = usePathname();

  // smooth scroll + pointer effects: once
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce) return;

    let raf = 0;
    let stop = false;
    let lenis: { raf: (t: number) => void; stop: () => void; start: () => void; destroy: () => void } | null = null;
    let mo: MutationObserver | null = null;
    if (fine) {
      import("lenis").then(({ default: Lenis }) => {
        if (stop) return;
        const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: { offset: -70 } });
        lenis = l;
        const loop = (t: number) => {
          l.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        // pause page scrolling while the bag drawer is open
        mo = new MutationObserver(() => (document.documentElement.classList.contains("bag-open") ? l.stop() : l.start()));
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      });
    }

    if (!fine) return () => void (stop = true);

    let px = 0, py = 0, pending = false;
    let magnet: HTMLElement | null = null;
    let tilted: HTMLElement | null = null;
    const untilt = (el: HTMLElement | null) => {
      if (!el) return;
      el.classList.remove("is-tilting");
      el.style.transform = "";
    };
    const apply = () => {
      pending = false;
      const x = px / innerWidth - 0.5, y = py / innerHeight - 0.5;
      document.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const d = Number(el.dataset.depth) || 0;
        el.style.transform = `translate3d(${(-x * d).toFixed(2)}px, ${(-y * d).toFixed(2)}px, 0)`;
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!pending) {
        pending = true;
        requestAnimationFrame(apply);
      }
      const t = (e.target as Element | null)?.closest?.<HTMLElement>(".tilt") ?? null;
      if (tilted && tilted !== t) untilt(tilted);
      tilted = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
        const max = Number(t.dataset.tilt) || 7;
        t.classList.add("is-tilting");
        t.style.transform = `perspective(1100px) rotateX(${((0.5 - v) * max).toFixed(2)}deg) rotateY(${((u - 0.5) * max).toFixed(2)}deg) scale(${t.dataset.tiltScale || "1.015"})`;
        t.style.setProperty("--gx", `${(u * 100).toFixed(1)}%`);
        t.style.setProperty("--gy", `${(v * 100).toFixed(1)}%`);
      }
      const m = (e.target as Element | null)?.closest?.<HTMLElement>(".magnetic") ?? null;
      if (magnet && magnet !== m) magnet.style.transform = "";
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        m.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const onLeave = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
      untilt(tilted);
      tilted = null;
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      mo?.disconnect();
      lenis?.destroy();
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // scroll reveals: re-scan on every route
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const scan = () => document.querySelectorAll(".reveal:not(.is-visible), .mask-reveal:not(.is-visible), .gold-line:not(.is-visible), .split:not(.is-visible)").forEach((el) => io.observe(el));
    scan();
    const t = setTimeout(scan, 400); // content that streams in after the first paint
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
