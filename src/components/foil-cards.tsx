"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatPrice, genderLabel, perfumes } from "@/data/site";

/**
 * The four flacons on gold-foil plates. Bring the pointer close and the foil
 * wakes up: the peacock engraving catches a pearlescent sweep of light that
 * follows the hand, and the plate tilts a few degrees toward it.
 * (Approach-to-reveal foil after the vgpu "Holographic Card" example, in CSS.)
 */
function FoilCard({ i }: { i: number }) {
  const p = perfumes[i];
  const ref = useRef<HTMLAnchorElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--rx", `${((0.5 - y) * 9).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * 11).toFixed(2)}deg`);
      el.style.setProperty("--near", "1");
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--near", "0");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      ref={ref}
      href={`/perfume/${p.slug}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="foil-card reveal group block"
      style={{ transitionDelay: `${i * 90}ms` }}
      aria-label={`${p.name}، ${genderLabel[p.gender]}، ${formatPrice(p.price)}`}
    >
      <div className="foil-plate">
        <div className="foil-engraving" aria-hidden="true" />
        <div className="foil-sheen" aria-hidden="true" />
        <Image
          src={p.image}
          alt=""
          width={420}
          height={960}
          sizes="(min-width:1024px) 22vw, 45vw"
          className="foil-bottle absolute inset-x-0 bottom-[6%] mx-auto h-[82%] w-auto"
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <span className="name text-3xl leading-[1.1] sm:text-4xl" dir="ltr">
          {p.name}
        </span>
        <span className="text-sm text-champagne/60">{genderLabel[p.gender]}</span>
      </div>
      <p className="mt-1 text-champagne/75">
        {p.notes.join("، ")}. <span className="text-gold-soft">{formatPrice(p.price)}</span>
      </p>
    </Link>
  );
}

export function FoilCards() {
  return (
    <section id="collection" className="px-5 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <h2 className="reveal max-w-[14ch] font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[1.2]">
          اختر قارورتك، <span className="text-gold">واقترب منها.</span>
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {perfumes.map((p, i) => (
            <FoilCard key={p.slug} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
