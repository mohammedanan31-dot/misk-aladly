import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand, formatPrice, genderLabel, getPerfume, perfumes, shipping } from "@/data/site";
import { Gallery } from "@/components/gallery";
import { Purchase } from "@/components/purchase";
import { AddToBag } from "@/components/bag";

type Props = { params: Promise<{ slug: string }> };
const SITE = "https://misk-aladly.vercel.app";

export function generateStaticParams() {
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPerfume((await params).slug);
  if (!p) return {};
  const title = `${p.name} — عطر ${genderLabel[p.gender]}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: `/perfume/${p.slug}` },
    openGraph: { title: `${title} | ${brand.nameAr}`, description: p.description, images: [{ url: p.photo, alt: p.name }], type: "website", locale: "ar_EG" },
  };
}

export default async function PerfumePage({ params }: Props) {
  const perfume = getPerfume((await params).slug);
  if (!perfume) notFound();

  const i = perfumes.indexOf(perfume);
  const next = perfumes[(i + 1) % perfumes.length];
  const others = perfumes.filter((p) => p !== perfume);
  const shots = [
    { src: perfume.gallery[0], alt: `قارورة ${perfume.name} من مسك العدلي` },
    { src: perfume.photo, alt: `${perfume.name} — صورة من حملة مسك العدلي` },
    ...perfume.gallery.slice(1).map((src) => ({ src, alt: `${perfume.name} — مسك العدلي` })),
  ];
  const dark = perfume.theme.ink === "dark";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: perfume.name,
    description: perfume.description,
    image: shots.map((s) => `${SITE}${s.src}`),
    brand: { "@type": "Brand", name: brand.nameEn },
    category: `عطر ${genderLabel[perfume.gender]}`,
    size: `${perfume.size} ml`,
    offers: {
      "@type": "Offer",
      price: perfume.price,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      url: `${SITE}/perfume/${perfume.slug}`,
    },
  };

  return (
    <main className="relative pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[110svh] opacity-50" style={{ background: `radial-gradient(45% 45% at 70% 35%, ${perfume.glow}, transparent 70%)` }} />

      {/* ---------- product ---------- */}
      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-28 sm:px-10 sm:pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="curtain min-w-0 lg:sticky lg:top-24 lg:self-start">
          <Gallery shots={shots} name={perfume.name} />
        </div>

        <div className="min-w-0 lg:py-6">
          <nav className="rise text-sm text-champagne/50" aria-label="مسار الصفحة">
            <Link href="/" className="link-line hover:text-gold-soft">الرئيسية</Link>
            <span className="mx-2">/</span>
            <Link href="/#collection" className="link-line hover:text-gold-soft">المجموعة</Link>
            <span className="mx-2">/</span>
            <span className="text-champagne/80">{perfume.name}</span>
          </nav>

          <p className="kicker rise mt-10" style={{ animationDelay: "0.08s" }}>
            {String(i + 1).padStart(2, "0")} · {genderLabel[perfume.gender] === "نسائي" ? "For Her" : "For Him"}
          </p>
          <h1 className="mt-5 font-latin text-[2.6rem] uppercase leading-[0.95] tracking-[0.04em] text-champagne min-[400px]:text-5xl sm:text-7xl xl:text-8xl" dir="ltr" style={{ textAlign: "right" }}>
            <span className="line-mask" style={{ "--i": 0 } as React.CSSProperties}>
              <span>
                {perfume.nameParts[0]}
                <em className="font-normal italic text-gold">{perfume.nameParts[1]}</em>
              </span>
            </span>
          </h1>
          <p className="rise mt-6 font-display text-3xl font-bold text-gold-soft" style={{ animationDelay: "0.3s" }}>
            {perfume.tagline}
          </p>
          <p className="rise mt-3 text-xl text-champagne/85" style={{ animationDelay: "0.36s" }}>
            {perfume.short}
          </p>
          <p className="rise mt-5 max-w-lg text-lg leading-9 text-champagne/70" style={{ animationDelay: "0.42s" }}>
            {perfume.description}
          </p>

          {/* notes */}
          <div className="rise mt-10" style={{ animationDelay: "0.5s" }}>
            {perfume.pyramid ? (
              <div className="space-y-4">
                {(
                  [
                    ["المقدمة العطرية", "Top Notes", perfume.pyramid.top],
                    ["قلب العطر", "Heart Notes", perfume.pyramid.heart],
                    ["القاعدة العطرية", "Base Notes", perfume.pyramid.base],
                  ] as const
                ).map(([ar, en, list], k) => (
                  <div key={en} className="border-t border-gold/15 pt-4" style={{ paddingInlineStart: `${k * 1.5}rem` }}>
                    <p className="text-sm text-champagne/50">
                      {ar} · <span className="font-latin">{en}</span>
                    </p>
                    <p className="mt-1 text-xl">{list.join(" · ")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-sm text-champagne/50">النوتات العطرية</p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {perfume.notes.map((n) => (
                    <li key={n} className="flex items-center gap-3 border border-gold/25 px-5 py-2.5 text-lg">
                      <span className="inline-block size-[6px] rotate-45 bg-gold" />
                      {n}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <dl className="rise mt-10 grid grid-cols-2 border-y border-gold/15" style={{ animationDelay: "0.56s" }}>
            <div className="border-e border-gold/15 py-5 pe-4">
              <dt className="text-sm text-champagne/50">الشخصية</dt>
              <dd className="mt-1">{perfume.mood}</dd>
            </div>
            <div className="py-5 ps-4">
              <dt className="text-sm text-champagne/50">مناسب لـ</dt>
              <dd className="mt-1">{perfume.occasion}</dd>
            </div>
          </dl>

          <div className="rise mt-10" style={{ animationDelay: "0.62s" }}>
            <Purchase perfume={perfume} />
            <p className="mt-4 text-center text-sm text-champagne/45">
              الشحن خلال {shipping.days} · مجاني فوق {shipping.freeOver.toLocaleString("en-US")} جنيه
            </p>
          </div>
        </div>
      </section>

      {/* ---------- story ---------- */}
      <section className="relative overflow-hidden" data-ink={perfume.theme.ink} aria-label={`حكاية ${perfume.name}`} style={{ background: `linear-gradient(160deg, ${perfume.theme.from}, ${perfume.theme.to})` }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-32">
          <div className="mask-reveal relative aspect-[4/5] overflow-hidden lg:order-2">
            <Image src={perfume.photo} alt={`${perfume.name} — مسك العدلي`} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className={`reveal ${dark ? "text-ink" : "text-champagne"}`}>
            <p className="kicker" style={dark ? { color: "var(--color-wine)" } : undefined}>
              The Story
            </p>
            <p className="mt-8 font-display text-4xl font-bold leading-[1.5] sm:text-6xl">{perfume.short}</p>
            <p className={`mt-8 max-w-md text-xl leading-9 ${dark ? "text-ink/75" : "text-champagne/75"}`}>{perfume.description}</p>
            <p className={`mt-6 ${dark ? "text-wine" : "text-gold-soft"}`}>{perfume.mood}</p>
          </div>
        </div>
      </section>

      {/* ---------- next & related ---------- */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-10">
          <Link href={`/perfume/${next.slug}`} className="group flex items-center justify-between border-y border-gold/15 py-8">
            <span className="text-champagne/55">العطر التالي</span>
            <span className="flex items-center gap-6">
              <span className="font-latin text-3xl uppercase tracking-[0.08em] transition-colors duration-500 group-hover:text-gold-soft sm:text-5xl" dir="ltr">
                {next.name}
              </span>
              <span className="flex size-12 items-center justify-center border border-gold/30 text-gold transition-transform duration-500 group-hover:-translate-x-2">←</span>
            </span>
          </Link>

          <h2 className="reveal mt-20 font-display text-4xl font-bold">قد يعجبك أيضًا</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <article key={o.slug} className="reveal group">
                <Link href={`/perfume/${o.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={o.gallery[0]} alt={o.name} fill sizes="(min-width:640px) 30vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="font-latin text-2xl uppercase tracking-[0.08em]" dir="ltr">
                      {o.name}
                    </p>
                    <p className="text-champagne/60">{formatPrice(o.price)}</p>
                  </div>
                  <p className="mt-1 text-gold-soft/80">{o.tagline}</p>
                </Link>
                <AddToBag slug={o.slug} className="mt-4 w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
