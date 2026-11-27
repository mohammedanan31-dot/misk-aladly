import Link from "next/link";
import { formatPrice, genderLabel, perfumes } from "@/data/site";
import { Stage } from "./stage";
import { OrderButton } from "./order-button";

/** The four perfumes side by side: bottle, name, notes, price, order. */
export function Collection() {
  return (
    <section id="collection" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-10">
        <div className="reveal flex flex-col items-start justify-between gap-6 border-b border-gold/15 pb-10 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">المجموعة</span>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.35] sm:text-7xl">
              أربعة عطور، <span className="text-gold">أربع شخصيات</span>
            </h2>
          </div>
          <p className="max-w-sm font-light leading-8 text-champagne/65">عطران رجاليان وعطران نسائيان، كلٌّ بحجم 100 مل. اختر ما يشبهك.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {perfumes.map((p, i) => (
            <article
              key={p.slug}
              id={p.slug}
              className="reveal group relative flex scroll-mt-28 flex-col overflow-hidden rounded-[1.25rem] border border-gold/15 bg-night/50 transition-colors duration-700 hover:border-gold/40"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Link href={`/perfume/${p.slug}`} aria-label={`${p.name} — التفاصيل`} className="relative block">
                <Stage perfume={p} priority={i < 2} className="aspect-[4/5] transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]" />
                <span className="absolute start-3 top-3 rounded-full border border-champagne/15 bg-night/50 px-3 py-1 text-[11px] text-gold-soft backdrop-blur-md sm:start-4 sm:top-4">
                  {genderLabel[p.gender]}
                </span>
                <span className="absolute left-3 top-3 font-latin text-xs tracking-[0.3em] text-champagne/45 sm:left-4 sm:top-4" dir="ltr">
                  0{i + 1}
                </span>
              </Link>

              <div className="flex flex-1 flex-col border-t border-gold/10 p-4 sm:p-6">
                <h3 className="font-latin text-[15px] uppercase leading-tight tracking-[0.06em] text-champagne sm:text-[1.6rem] sm:tracking-[0.12em]" dir="ltr" style={{ textAlign: "right" }}>
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-gold-soft/80 sm:text-sm">{p.mood}</p>
                <p className="mt-3 hidden text-sm font-light leading-7 text-champagne/65 sm:block">{p.short}</p>
                <p className="mt-3 text-xs leading-6 text-champagne/55 sm:text-[13px]">{p.notes.join(" · ")}</p>

                <div className="mt-auto pt-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="whitespace-nowrap font-latin text-lg text-gold sm:text-3xl">{formatPrice(p.price)}</p>
                    <p className="hidden text-[11px] text-champagne/45 sm:block">{p.size} مل</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 xl:flex-row">
                    <OrderButton perfume={p} label="اطلب" className="w-full justify-between text-sm xl:flex-1" />
                    <Link href={`/perfume/${p.slug}`} className="btn-glass rounded-full px-5 py-3 text-center text-sm">
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
