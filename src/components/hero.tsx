import Link from "next/link";
import { getImageProps } from "next/image";
import { brand } from "@/data/site";

const alt = "عطور مسك العدلي الأربعة — Adrenaline و Velvet Kiss و Icon و Majestic — على منصات من الحجر والرمل تحت ضوء دافئ";

/**
 * Full-screen cinematic opening. Wide campaign photo on tablets and desktop, the portrait
 * four-bottle photo on phones (art direction via <picture>). Desktop adds pointer parallax.
 */
export function Hero() {
  const common = { alt, sizes: "(min-width: 1280px) 71vw, 100vw", quality: 82, priority: true } as const;
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/scenes/hero-four.webp", width: 1672, height: 940 });
  const {
    props: { srcSet: tall, ...img },
  } = getImageProps({ ...common, src: "/scenes/collection.webp", width: 1080, height: 1350 });

  return (
    <section className="relative isolate overflow-hidden bg-espresso" aria-labelledby="hero-title">
      <div className="relative xl:h-[100svh] xl:min-h-[720px]">
        {/* photograph */}
        <div className="hero-media relative overflow-hidden xl:absolute xl:inset-y-0 xl:left-0 xl:w-[71%]">
          <div data-depth="16" className="hero-depth relative aspect-[4/5] sm:aspect-[16/9] xl:aspect-auto xl:h-full">
            <picture>
              <source media="(min-width: 640px)" srcSet={wide} />
              <img {...img} srcSet={tall} alt={alt} className="absolute inset-0 h-full w-full scale-[1.03] object-cover sm:object-[53%_50%]" />
            </picture>
          </div>
          {/* light and shade */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_15%,rgba(255,214,150,0.12),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-espresso via-espresso/40 to-transparent xl:h-1/3" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[9%] bg-gradient-to-l from-espresso to-transparent xl:block" />
        </div>

        {/* words */}
        <div className="relative z-10 -mt-24 px-5 pb-16 sm:-mt-28 sm:px-10 xl:absolute xl:inset-y-0 xl:right-0 xl:mt-0 xl:flex xl:w-[31%] xl:items-center xl:pb-0 xl:ps-14 xl:pe-4 2xl:ps-20">
          <div data-depth="-6" className="hero-depth max-w-xl">
            <p className="kicker rise" style={{ animationDelay: "0.2s" }}>
              Misk Aladly
            </p>
            <h1 id="hero-title" className="mt-6 font-display text-[2.85rem] font-bold leading-[1.35] sm:text-7xl sm:leading-[1.3] xl:text-[3.5rem] 2xl:text-[4.6rem]">
              <span className="line-mask" style={{ "--i": 0 } as React.CSSProperties}>
                <span>حين يصبح العطر</span>
              </span>
              <span className="line-mask" style={{ "--i": 1 } as React.CSSProperties}>
                <span className="text-gold">توقيعًا لا يُنسى</span>
              </span>
            </h1>
            <div className="gold-line mt-7 w-40" style={{ transitionDelay: "0.9s" }} />
            <p className="rise mt-7 max-w-md text-xl leading-9 text-champagne/80" style={{ animationDelay: "0.85s" }}>
              {brand.intro}
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "1s" }}>
              <Link href="#collection" className="btn-primary magnetic">
                اكتشف المجموعة
              </Link>
              <Link href="#finder" className="btn-ghost magnetic">
                اعثر على عطرك
              </Link>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <a href="#collection" className="rise absolute bottom-8 left-[35.5%] z-10 hidden -translate-x-1/2 flex-col items-center gap-3 xl:flex" style={{ animationDelay: "1.4s" }} aria-label="انتقل إلى المجموعة">
          <span className="font-latin text-[10px] uppercase tracking-[0.5em] text-champagne/60">Scroll</span>
          <span className="scroll-cue" />
        </a>
      </div>
    </section>
  );
}
