import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { formatPrice, genderLabel, type Perfume } from "@/data/site";

/** One perfume standing in a lit stone alcove. Links to its page; the bottle morphs across. */
export function Niche({ perfume, priority, index }: { perfume: Perfume; priority?: boolean; index: number }) {
  const style = { "--light": perfume.light, "--glow": perfume.glow, animationDelay: `${0.15 + index * 0.12}s` } as CSSProperties;

  return (
    <Link
      href={`/perfume/${perfume.slug}`}
      className="niche-link rise-in group relative block outline-none"
      style={style}
      aria-label={`${perfume.name} — ${genderLabel[perfume.gender]} — ${formatPrice(perfume.price)}`}
    >
      <div className="niche aspect-[5/8] w-full">
        <span className="niche-lamp" />
        <span className="niche-plinth" />
        <ViewTransition name={`bottle-${perfume.slug}`} share="bottle-morph" default="none">
          <Image
            src={perfume.image}
            alt={perfume.name}
            width={420}
            height={960}
            priority={priority}
            sizes="(min-width: 1024px) 18vw, 40vw"
            className="niche-bottle absolute inset-x-0 bottom-[8%] mx-auto h-[78%] w-auto"
          />
        </ViewTransition>
      </div>

      {/* reflection on the glossy floor */}
      <div className="pointer-events-none relative h-16 overflow-hidden sm:h-24" aria-hidden="true">
        <Image src={perfume.image} alt="" width={420} height={960} sizes="20vw" className="reflection mx-auto h-[320%] w-auto" />
      </div>

      <div className="mt-1 text-center">
        <p className="text-[11px] tracking-[0.3em] text-gold/80">{genderLabel[perfume.gender]}</p>
        <p className="mt-1 font-latin text-2xl text-champagne sm:text-3xl" dir="ltr">
          {perfume.nameParts[0]}
          <em className="text-gold">{perfume.nameParts[1]}</em>
        </p>
        <p className="mt-1 text-sm text-champagne/60 transition-colors group-hover:text-gold-soft">{formatPrice(perfume.price)}</p>
      </div>
    </Link>
  );
}
