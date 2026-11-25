import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, genderLabel, getPerfume, perfumes, points, shipping } from "@/data/site";
import { Stage } from "@/components/stage";
import { OrderPanel } from "@/components/order-panel";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPerfume((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — عطر ${genderLabel[p.gender]}`,
    description: p.description,
    openGraph: { images: [p.scene] },
  };
}

export default async function PerfumePage({ params }: Props) {
  const perfume = getPerfume((await params).slug);
  if (!perfume) notFound();

  const i = perfumes.indexOf(perfume);
  const next = perfumes[(i + 1) % perfumes.length];
  const others = perfumes.filter((p) => p !== perfume);

  return (
    <main className="relative bg-night">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[120dvh] opacity-60 blur-3xl"
        style={{ background: `radial-gradient(50% 50% at 70% 40%, ${perfume.glow}, transparent 70%)` }}
      />

      <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-28 sm:px-10 sm:pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* the scene, sticky on desktop */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="bezel curtain">
            <div className="bezel-core">
              <Stage perfume={perfume} priority float className="aspect-[56/75]" sizes="(min-width:1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>

        {/* details */}
        <div className="lg:py-10">
          <nav className="rise text-xs text-champagne/45" aria-label="مسار الصفحة">
            <Link href="/" className="hover:text-gold-soft">
              الرئيسية
            </Link>
            <span className="mx-2">/</span>
            <Link href="/#collection" className="hover:text-gold-soft">
              المجموعة
            </Link>
            <span className="mx-2">/</span>
            <span className="text-champagne/75">{perfume.name}</span>
          </nav>

          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.1s" }}>
            <span className="eyebrow">عطر {genderLabel[perfume.gender]}</span>
            <span className="text-sm text-gold/80">{perfume.mood}</span>
          </div>

          <h1
            className="rise mt-6 font-latin text-7xl leading-[0.95] text-champagne sm:text-9xl"
            dir="ltr"
            style={{ animationDelay: "0.18s", textAlign: "right" }}
          >
            {perfume.nameParts[0]}
            <em className="text-gold">{perfume.nameParts[1]}</em>
          </h1>
          <p className="rise mt-6 font-display text-3xl text-gold-soft" style={{ animationDelay: "0.26s" }}>
            {perfume.short}
          </p>
          <p className="rise mt-5 max-w-lg text-lg leading-9 text-champagne/75" style={{ animationDelay: "0.32s" }}>
            {perfume.description}
          </p>

          {/* notes as a pyramid of chips */}
          <div className="rise mt-10" style={{ animationDelay: "0.4s" }}>
            <p className="text-xs tracking-[0.25em] text-champagne/45">النوتات العطرية</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {perfume.notes.map((n, k) => (
                <span
                  key={n}
                  className="rounded-full border border-gold/25 bg-gold/[0.06] px-5 py-2 text-champagne"
                  style={{ fontSize: `${1.15 - k * 0.07}rem` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <dl className="rise mt-10 grid grid-cols-3 gap-3" style={{ animationDelay: "0.46s" }}>
            {[
              { k: "الحجم", v: `${perfume.size} مل` },
              { k: "مناسب لـ", v: perfume.occasion },
              { k: "النقاط", v: `${points.perBottle} نقطة` },
            ].map((d) => (
              <div key={d.k} className="rounded-[1.5rem] border border-champagne/10 bg-champagne/[0.03] p-4">
                <dt className="text-xs text-champagne/45">{d.k}</dt>
                <dd className="mt-2 text-sm leading-6 text-champagne/90">{d.v}</dd>
              </div>
            ))}
          </dl>

          <div className="rise bezel mt-10" style={{ animationDelay: "0.54s" }}>
            <div className="bezel-core bg-espresso/80 p-6 sm:p-8">
              <div className="mb-6 flex items-end justify-between">
                <p className="text-sm text-champagne/55">السعر</p>
                <p className="font-latin text-5xl text-gold">{formatPrice(perfume.price)}</p>
              </div>
              <OrderPanel perfume={perfume} />
              <p className="mt-4 text-center text-xs text-champagne/45">
                الشحن خلال {shipping.days} · مجاني فوق {shipping.freeOver.toLocaleString("en-US")} جنيه
              </p>
            </div>
          </div>

          <Link
            href={`/perfume/${next.slug}`}
            className="group mt-12 flex items-center justify-between rounded-full border border-champagne/10 py-3 pe-3 ps-6 transition-colors duration-700 hover:border-gold/40"
          >
            <span className="text-sm text-champagne/55">العطر التالي</span>
            <span className="flex items-center gap-4">
              <span className="font-latin text-2xl" dir="ltr">
                {next.name}
              </span>
              <span className="btn-icon flex size-10 items-center justify-center rounded-full bg-gold/15 text-gold">←</span>
            </span>
          </Link>
        </div>
      </section>

      {/* the rest of the collection */}
      <section className="relative border-t border-gold/10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-10">
          <h2 className="reveal font-display text-4xl">اكتشف بقية المجموعة</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/perfume/${o.slug}`} className="bezel group block">
                <div className="bezel-core">
                  <Stage
                    perfume={o}
                    parallax={false}
                    className="aspect-[56/75] transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
                    sizes="(min-width:640px) 33vw, 100vw"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-4">
                  <p className="font-latin text-3xl" dir="ltr">
                    {o.name}
                  </p>
                  <p className="text-sm text-champagne/55">
                    {genderLabel[o.gender]} · {formatPrice(o.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
