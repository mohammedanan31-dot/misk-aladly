"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BottleScene, BottleSpec } from "@/lib/bottle-scene";

/** One flacon in 3D for the product page. Drag to turn it; it settles back into a slow turn. */
export function BottleViewer({ spec, fallback }: { spec: BottleSpec; fallback: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let engine: BottleScene | null = null, disposed = false;
    let drag = false, lastX = 0, spin = 0, vel = 0, raf = 0;
    const lite = matchMedia("(pointer: coarse)").matches || innerWidth < 768;
    const logo = new window.Image();
    logo.src = "/brand/logo.webp";

    (async () => {
      try {
        const { BottleScene } = await import("@/lib/bottle-scene");
        await logo.decode().catch(() => {});
        if (disposed) return;
        engine = new BottleScene(el, [spec], logo, lite);
        engine.state.zoom = 1.08;
        engine.state.y = -0.05;
        setReady(true);
        const tick = () => {
          if (!drag) vel *= 0.94;
          spin += vel;
          if (engine) engine.state.spin = spin;
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        /* keep the photo */
      }
    })();

    const down = (e: PointerEvent) => { drag = true; lastX = e.clientX; };
    const move = (e: PointerEvent) => {
      engine?.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
      if (!drag) return;
      vel = (e.clientX - lastX) * 0.012;
      lastX = e.clientX;
    };
    const up = () => { drag = false; };
    el.addEventListener("pointerdown", down);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerup", up);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      engine?.dispose();
    };
  }, [spec]);

  return (
    <div className="relative h-full w-full cursor-grab touch-pan-y active:cursor-grabbing">
      {!ready && (
        <Image src={fallback} alt="" width={420} height={960} priority className="absolute inset-x-0 bottom-[10%] mx-auto h-[70%] w-auto opacity-90" />
      )}
      <div ref={host} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
