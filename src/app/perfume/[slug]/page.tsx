import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { formatPrice, genderLabel, getPerfume, perfumes, shipping } from "@/data/site";
import { GoldDust } from "@/components/gold-dust";
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
    openGraph: { images: [p.image] },
  };
}

export default async function PerfumePage({ params }: Props) {
  const perfume = getPerfume((await params).slug);
  if (!perfume) notFound();

  const i = perfumes.indexOf(perfume);
  const others = [...perfumes.slice(i + 1), ...perfumes.slice(0, i)];
  const style = { "--light": perfume.light, "--glow": perfume.glow } as CSSProperties;

  return (
    <main className="stone relative min-h-dvh overflow-hidden" style={style}>
      {/* atmosphere tinted by this perfume */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(60% 60% at 30% 45%, color-mix(in srgb, ${perfume.glow} 55%, transparent), transparent 70%)` }}
      />
      <GoldDust />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-24 sm:px-8 lg:min-h-dvh lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-28">
        {/* Text (right side in RTL) */}
        <div className="order-2 lg:order-1">
          <nav className="rise-in text-xs text-champagne/50" aria-label="مسار الصفحة">
            <Link href="/" className="hover:text-gold-soft">
              الرئيسية
            </Link>
            <span className="mx-2">/</span>
            <Link href="/#collection" className="hover:text-gold-soft">
              المجموعة
            </Link>
            <span className="mx-2">/</span>
            <span className="text-champagne/80">{perfume.name}</span>
          </nav>

          <p className="rise-in mt-8 text-sm tracking-[0.3em] text-gold/80" style={{ animationDelay: "0.1s" }}>
            مسك العدلي · عطر {genderLabel[perfume.gender]}
          </p>
          <h1
            className="rise-in mt-3 font-latin text-6xl leading-none text-champagne sm:text-8xl"
            dir="ltr"
            style={{ animationDelay: "0.18s", textAlign: "right" }}
          >
            {perfume.nameParts[0]}
            <em className="text-gold">{perfume.nameParts[1]}</em>
          </h1>
          <p className="rise-in mt-5 font-display text-2xl text-gold-soft" style={{ animationDelay: "0.26s" }}>
            {perfume.short}
          </p>
          <p className="rise-in mt-5 max-w-lg leading-8 text-champagne/75" style={{ animationDelay: "0.32s" }}>
            {perfume.description}
          </p>

          <dl className="rise-in mt-8 grid max-w-lg grid-cols-[auto_1fr] gap-x-6 gap-y-4 border-y border-gold/20 py-6 text-sm" style={{ animationDelay: "0.4s" }}>
            <dt className="text-champagne/50">النوتات</dt>
            <dd className="flex flex-wrap gap-2">
              {perfume.notes.map((n) => (
                <span key={n} className="rounded-full border border-gold/30 px-3 py-1 text-champagne/90">
                  {n}
                </span>
              ))}
            </dd>
            <dt className="text-champagne/50">مناسب لـ</dt>
            <dd className="text-champagne/90">{perfume.occasion}</dd>
            <dt className="text-champagne/50">الحجم</dt>
            <dd className="text-champagne/90">{perfume.size} مل</dd>
            <dt className="text-champagne/50">السعر</dt>
            <dd className="text-2xl text-gold">{formatPrice(perfume.price)}</dd>
          </dl>

          <div className="rise-in mt-8 max-w-lg" style={{ animationDelay: "0.48s" }}>
            <OrderPanel perfume={perfume} />
            <p className="mt-4 text-center text-xs text-champagne/45">
              الشحن خلال {shipping.days} · مجاني فوق {shipping.freeOver.toLocaleString("en-US")} جنيه
            </p>
          </div>
        </div>

        {/* The alcove, close up */}
        <div className="order-1 lg:order-2">
          <div className="niche mx-auto aspect-[5/8] w-full max-w-[20rem] sm:max-w-sm lg:max-w-md">
            <span className="niche-lamp" />
            <span className="niche-plinth" />
            <ViewTransition name={`bottle-${perfume.slug}`} share="bottle-morph" default="none">
              <Image
                src={perfume.image}
                alt={perfume.name}
                width={420}
                height={960}
                priority
                sizes="(min-width: 1024px) 30vw, 70vw"
                className="absolute inset-x-0 bottom-[8%] mx-auto h-[80%] w-auto drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)]"
              />
            </ViewTransition>
          </div>
        </div>
      </div>

      {/* Other perfumes */}
      <section className="relative border-t border-gold/15 bg-night/60 py-16 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <h2 className="font-display text-3xl">قد يعجبك أيضًا</h2>
          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/perfume/${o.slug}`}
                className="niche-link group block"
                style={{ "--light": o.light, "--glow": o.glow } as CSSProperties}
              >
                <div className="niche aspect-[4/5] w-full">
                  <span className="niche-lamp" />
                  <ViewTransition name={`bottle-${o.slug}`} share="bottle-morph" default="none">
                    <Image
                      src={o.image}
                      alt={o.name}
                      width={420}
                      height={960}
                      sizes="25vw"
                      className="niche-bottle absolute inset-x-0 bottom-[6%] mx-auto h-[82%] w-auto"
                    />
                  </ViewTransition>
                </div>
                <p className="mt-3 text-center font-latin text-xl sm:text-2xl">{o.name}</p>
                <p className="text-center text-xs text-champagne/55 sm:text-sm">
                  {genderLabel[o.gender]} · {formatPrice(o.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
