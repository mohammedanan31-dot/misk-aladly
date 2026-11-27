import Image from "next/image";
import Link from "next/link";
import { brand, perfumes, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

/** Opening screen: the four-bottle campaign photo beside the brand promise. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-16">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-10 lg:grid-cols-[1fr_1.02fr] lg:gap-20">
        {/* copy — first column (right in RTL) on desktop, below the photo on phones */}
        <div className="order-2 lg:order-1">
          <p className="rise font-latin text-[11px] uppercase tracking-[0.5em] text-gold-soft/75" dir="ltr" style={{ textAlign: "right" }}>
            Misk Aladly · Eau de Parfum
          </p>
          <h1 className="rise mt-7 font-display text-[2.9rem] font-bold leading-[1.45] sm:text-7xl sm:leading-[1.35]" style={{ animationDelay: "0.08s" }}>
            حين يصبح العطر
            <br />
            <span className="text-gold">توقيعًا لا يُنسى</span>
          </h1>
          <p className="rise mt-6 max-w-md text-lg font-light leading-9 text-champagne/75" style={{ animationDelay: "0.16s" }}>
            {brand.intro}
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.24s" }}>
            <Link href="#collection" className="btn-gold rounded-full px-8 py-4 font-semibold">
              اكتشف المجموعة
            </Link>
            <a
              href={whatsappLink("مرحبًا مسك العدلي، أرغب بالطلب 🌹")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass group inline-flex items-center gap-3 rounded-full py-2 pe-2 ps-6"
            >
              اطلب عبر واتساب
              <span className="btn-icon flex size-10 items-center justify-center rounded-full bg-gold/15 text-gold-soft">
                <WhatsAppIcon className="size-5" />
              </span>
            </a>
          </div>

          <ul className="rise mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/15 bg-gold/15 sm:grid-cols-4" style={{ animationDelay: "0.32s" }}>
            {perfumes.map((p) => (
              <li key={p.slug} className="bg-night/80">
                <Link href={`#${p.slug}`} className="block px-4 py-4 transition-colors duration-500 hover:bg-burgundy/40">
                  <span className="block font-latin text-[13px] uppercase tracking-[0.22em] text-champagne" dir="ltr" style={{ textAlign: "right" }}>
                    {p.name}
                  </span>
                  <span className="mt-1 block text-xs text-gold-soft/70">{p.mood.split(" · ")[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* the campaign photo */}
        <div className="order-1 lg:order-2">
          <div className="bezel curtain">
            <div className="bezel-core relative aspect-[4/5] lg:max-h-[78svh] lg:w-full">
              <Image
                src="/scenes/collection.webp"
                alt="عطور مسك العدلي الأربعة: Icon و Majestic و Adrenaline و Velvet Kiss على منصات خمرية"
                fill
                priority
                sizes="(min-width:1024px) 46vw, 100vw"
                className="zoom-out object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
