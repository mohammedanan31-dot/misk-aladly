import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, genderLabel, getPerfume, perfumes, points, shipping } from "@/data/site";
import { BOTTLES } from "@/data/bottles";
import { BottleViewer } from "@/components/bottle-viewer";
import { OrderPanel } from "@/components/order-panel";
import { RevealController } from "@/components/reveal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPerfume((await params).slug);
  if (!p) return {};
  return { title: `${p.name}، عطر ${genderLabel[p.gender]}`, description: p.description, openGraph: { images: [p.image] } };
}

export default async function PerfumePage({ params }: Props) {
  const perfume = getPerfume((await params).slug);
  if (!perfume) notFound();
  const i = perfumes.indexOf(perfume);
  const next = perfumes[(i + 1) % perfumes.length];
  const others = perfumes.filter((p) => p !== perfume);

  return (
    <main>
      <RevealController />
      <section className="relative grid lg:min-h-[100svh] lg:grid-cols-12">
        {/* the flacon in 3D, held in place while the details scroll */}
        <div className="relative h-[70svh] lg:sticky lg:top-0 lg:col-span-7 lg:h-[100svh]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(45% 50% at 50% 55%, ${perfume.glow}aa, transparent 72%)` }}
          />
          <BottleViewer spec={BOTTLES[perfume.slug]} fallback={perfume.image} />
          <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-sm text-champagne/45">اسحب لتدوير القارورة</p>
        </div>

        <div className="px-5 pb-20 pt-6 sm:px-10 lg:col-span-5 lg:px-14 lg:pb-24 lg:pt-36">
          <nav className="rise text-sm text-champagne/55" aria-label="مسار الصفحة">
            <Link href="/" className="hover:text-gold-soft">الرئيسية</Link>
            <span className="mx-2">/</span>
            <Link href="/#collection" className="hover:text-gold-soft">العطور</Link>
          </nav>
          <p className="rise mt-10 text-gold-soft" style={{ animationDelay: "0.08s" }}>
            عطر {genderLabel[perfume.gender]}، {perfume.size} مل
          </p>
          <h1 className="name rise mt-3 pb-2 text-[clamp(4.5rem,9vw,8.5rem)] leading-[1.05]" dir="ltr" style={{ animationDelay: "0.16s", textAlign: "right" }}>
            {perfume.nameParts[0]}
            <em>{perfume.nameParts[1]}</em>
          </h1>
          <p className="rise mt-8 font-display text-3xl leading-snug" style={{ animationDelay: "0.24s" }}>{perfume.short}</p>
          <p className="rise mt-5 max-w-[42ch] leading-8 text-champagne/75" style={{ animationDelay: "0.3s" }}>{perfume.description}</p>

          <dl className="rise mt-10 space-y-4 border-t border-gold/40 pt-8" style={{ animationDelay: "0.36s" }}>
            <div className="flex gap-6"><dt className="w-28 shrink-0 text-champagne/55">النوتات</dt><dd>{perfume.notes.join("، ")}</dd></div>
            <div className="flex gap-6"><dt className="w-28 shrink-0 text-champagne/55">يناسب</dt><dd>{perfume.occasion}</dd></div>
            <div className="flex gap-6"><dt className="w-28 shrink-0 text-champagne/55">مع كل عبوة</dt><dd>{points.perBottle} نقطة في رصيدك</dd></div>
          </dl>

          <div className="rise mt-10 border-t border-gold/40 pt-8" style={{ animationDelay: "0.42s" }}>
            <p className="name mb-6 text-6xl leading-[1.1] text-gold" dir="ltr" style={{ textAlign: "right" }}>
              {perfume.price.toLocaleString("en-US")}
              <span className="ms-2 font-sans text-lg text-champagne/60">جنيه</span>
            </p>
            <OrderPanel perfume={perfume} />
            <p className="mt-5 text-sm text-champagne/55">
              التوصيل خلال {shipping.days}، والشحن مجاني فوق {shipping.freeOver.toLocaleString("en-US")} جنيه.
            </p>
          </div>

          <Link href={`/perfume/${next.slug}`} className="group mt-16 flex items-baseline justify-between border-t border-champagne/20 pt-6">
            <span className="text-champagne/55">العطر التالي</span>
            <span className="name text-4xl leading-[1.1] transition-colors group-hover:text-gold-soft" dir="ltr">{next.name}</span>
          </Link>
        </div>
      </section>

      <section className="bg-ink/40 px-5 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="reveal font-display text-[clamp(2.2rem,4vw,3.4rem)]">بقية المجموعة</h2>
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-10">
            {others.map((o) => (
              <Link key={o.slug} href={`/perfume/${o.slug}`} className="reveal group block">
                <div className="foil-plate">
                  <Image src={o.image} alt="" width={420} height={960} sizes="25vw" className="foil-bottle absolute inset-x-0 bottom-[6%] mx-auto h-[82%] w-auto" />
                </div>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="name text-2xl leading-[1.1] sm:text-3xl" dir="ltr">{o.name}</span>
                  <span className="text-sm text-champagne/60">{formatPrice(o.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
