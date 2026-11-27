import Image from "next/image";
import Link from "next/link";
import { formatPrice, genderLabel, perfumes } from "@/data/site";
import { AddToBag } from "./bag";
import { Words } from "./words";
import { ShowcaseTrack } from "./showcase-track";

/**
 * The collection as four cinematic chapters. Desktop: alternating full-width editorial spreads,
 * each lit in the perfume's own atmosphere. Phones/tablets: a swipeable track of the same chapters.
 */
export function Collection() {
  return (
    <section id="collection" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="collection-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="kicker">The Collection · 01</p>
            <h2 id="collection-title" className="mt-6 font-display text-5xl font-bold leading-[1.35] sm:text-7xl">
              <Words text="أربعة عطور،" /> <Words text="أربع شخصيات" wordClass="text-gold" start={2} />
            </h2>
          </div>
          <p className="reveal max-w-sm text-lg leading-8 text-champagne/70">عطران رجاليان وعطران نسائيان، كلٌّ بحجم 100 مل. لكل عطر مزاجه وحكايته.</p>
        </div>
        <div className="gold-line mt-10" />
      </div>

      <div className="mt-12 lg:mt-20">
        <ShowcaseTrack names={perfumes.map((p) => p.name)}>
          {perfumes.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={p.slug}
                id={p.slug}
                data-ink={p.theme.ink}
                aria-label={`${p.name} — ${genderLabel[p.gender]}`}
                className="chapter section-in relative w-[86vw] max-w-[26rem] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-[rgba(255,90,60,0.3)] sm:w-[60vw] lg:mx-auto lg:mb-8 lg:w-[94vw] lg:max-w-[1360px] lg:scroll-mt-20 lg:rounded-[2rem]"
                style={{ background: `radial-gradient(55% 60% at ${flip ? "28%" : "72%"} 45%, ${p.theme.glow}55, transparent 70%), linear-gradient(160deg, ${p.theme.from}, ${p.theme.to})` }}
              >
                <div className="mx-auto grid max-w-7xl items-center lg:min-h-[80svh] lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-24">
                  {/* photograph */}
                  <Link href={`/perfume/${p.slug}`} className={`chapter-photo group block ${flip ? "lg:order-2" : ""}`} aria-label={`اكتشف ${p.name}`}>
                    <div className="mask-reveal relative aspect-[4/5] overflow-hidden lg:rounded-[1.5rem]">
                      <Image src={p.photo} alt={`${p.name} — مسك العدلي`} fill sizes="(min-width:1024px) 42vw, (min-width:640px) 60vw, 86vw" className="object-cover" />
                      <span className="absolute start-4 top-4 bg-night/55 px-3 py-1 text-sm text-champagne backdrop-blur-md">{genderLabel[p.gender]}</span>
                    </div>
                  </Link>

                  {/* words */}
                  <div className={`p-6 sm:p-8 lg:p-0 ${flip ? "lg:order-1" : ""}`}>
                    <div className={`reveal ${flip ? "reveal-left" : "reveal-right"}`}>
                      <p className="flex items-center gap-4 font-latin text-sm tracking-[0.4em] text-[var(--accent)]" dir="ltr" style={{ justifyContent: "flex-end" }}>
                        <span>0{i + 1} / 04</span>
                      </p>
                      <h3 className="mt-4 font-latin text-[2.15rem] uppercase leading-none tracking-[0.04em] min-[400px]:text-[2.5rem] sm:text-6xl lg:text-[clamp(3rem,4.6vw,4.8rem)] lg:tracking-[0.04em]" dir="ltr" style={{ textAlign: "right" }}>
                        {p.nameParts[0]}
                        <em className="font-normal italic text-[var(--accent)]">{p.nameParts[1]}</em>
                      </h3>
                      <p className="mt-5 font-display text-2xl font-bold text-[var(--accent)] sm:text-3xl">{p.tagline}</p>
                      <div className="my-6 h-px w-24 bg-[var(--accent)] opacity-50" />
                      <p className="text-lg leading-8 opacity-85 lg:max-w-md lg:text-xl lg:leading-9">{p.description}</p>

                      <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[var(--line)] py-5 text-base">
                        <div>
                          <dt className="text-sm opacity-60">الشخصية</dt>
                          <dd className="mt-1">{p.mood}</dd>
                        </div>
                        <div>
                          <dt className="text-sm opacity-60">النوتات</dt>
                          <dd className="mt-1">{p.notes.join(" · ")}</dd>
                        </div>
                      </dl>

                      <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                        <p>
                          <span className="block text-sm opacity-60">{p.size} مل</span>
                          <span className="font-latin text-3xl sm:text-4xl">{formatPrice(p.price)}</span>
                        </p>
                      </div>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <AddToBag slug={p.slug} className="sm:flex-1 lg:flex-none" />
                        <Link href={`/perfume/${p.slug}`} className="btn-ghost magnetic sm:flex-1 lg:flex-none">
                          اكتشف العطر
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </ShowcaseTrack>
      </div>
    </section>
  );
}
