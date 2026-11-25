import Image from "next/image";
import { brand, contact, faqs, perfumes, points, shipping, whatsappLink } from "@/data/site";
import { Niche } from "@/components/niche";
import { GoldDust } from "@/components/gold-dust";
import { RevealController } from "@/components/reveal";
import { Ornament, WhatsAppIcon } from "@/components/icons";

const strip = [
  "100 مل لكل عطر",
  `شحن مجاني للطلبات فوق ${shipping.freeOver.toLocaleString("en-US")} جنيه`,
  `التوصيل خلال ${shipping.days}`,
  `${points.perBottle} نقطة مع كل عبوة`,
  "شحن لجميع المحافظات",
];

export default function Home() {
  return (
    <main>
      <RevealController />

      {/* ---------- The gallery: four lit alcoves ---------- */}
      <section id="collection" className="stone relative overflow-hidden pt-28 sm:pt-32">
        <GoldDust />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <div className="rise-in mx-auto max-w-2xl text-center">
            <p className="font-latin text-[10px] tracking-[0.3em] text-gold/80 sm:text-xs sm:tracking-[0.5em]" dir="ltr">
              MISK ALADLY · THE SIGNATURE COLLECTION
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.5] text-champagne sm:text-6xl sm:leading-[1.4]">
              أربعة عطور، <span className="text-gold">أربعة توقيعات</span>
            </h1>
            <p className="mt-4 text-champagne/65 sm:text-lg">عطران رجاليان وعطران نسائيان. اضغط على أي عطر لتكتشفه.</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:mt-16 lg:grid-cols-4 lg:gap-x-10">
            {perfumes.map((p, i) => (
              <Niche key={p.slug} perfume={p} index={i} priority={i < 2} />
            ))}
          </div>
        </div>
        <div className="floor relative mt-10 h-20" />
      </section>

      {/* ---------- Info strip ---------- */}
      <div className="overflow-hidden border-y border-gold/20 bg-burgundy/40 py-4" aria-label="معلومات الشحن">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-sm text-champagne/80">
          {[...strip, ...strip, ...strip, ...strip].map((s, i) => (
            <span key={i} className="flex items-center gap-10">
              {s}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Brand statement ---------- */}
      <section className="relative overflow-hidden bg-night py-28 sm:py-36">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(143,41,72,0.55), transparent)" }}
        />
        <div className="reveal relative mx-auto max-w-3xl px-4 text-center">
          <Image src="/brand/logo.webp" alt="" width={491} height={439} className="mx-auto h-40 w-auto opacity-95 sm:h-52" />
          <Ornament className="mx-auto mt-10 w-32 text-gold" />
          <h2 className="mt-8 font-display text-3xl leading-[1.6] text-champagne sm:text-5xl sm:leading-[1.5]">{brand.tagline}</h2>
          <p className="mx-auto mt-6 max-w-xl leading-8 text-champagne/65 sm:text-lg">
            في مسك العدلي نؤمن أن العطر ليس مجرد رائحة، بل حضورٌ يسبقك وذكرى تبقى بعدك. اخترنا أربع تركيبات بعناية، لكل منها شخصيتها، لتجد بينها
            توقيعك الخاص.
          </p>
        </div>
      </section>

      {/* ---------- Points program ---------- */}
      <section id="points" className="stone relative overflow-hidden py-24 sm:py-32">
        <GoldDust density={0.00004} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <div className="reveal grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm tracking-[0.3em] text-gold/80">نقاط مسك العدلي</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.5] sm:text-5xl">
                كل عبوة <span className="text-gold">تحمل مكافأة</span>
              </h2>
              <p className="mt-5 max-w-md leading-8 text-champagne/65">
                اجمع {points.perBottle} نقطة مع كل عبوة تشتريها. عند الوصول إلى {points.redeem} نقطة، تحصل على خصم {points.discount} جنيه على طلبك
                القادم.
              </p>
              <ol className="mt-8 space-y-4">
                {["اطلب أي عطر من المجموعة", `تُضاف ${points.perBottle} نقطة لرصيدك مع كل عبوة`, `استبدل ${points.redeem} نقطة بخصم ${points.discount} جنيه`].map(
                  (t, i) => (
                    <li key={t} className="flex items-center gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/50 font-latin text-lg text-gold">
                        {i + 1}
                      </span>
                      <span className="text-champagne/80">{t}</span>
                    </li>
                  ),
                )}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-[2rem] border border-gold/25 bg-espresso/70 p-6 text-center shadow-2xl backdrop-blur sm:p-10">
                <p className="font-latin text-6xl text-gold sm:text-7xl">{points.perBottle}</p>
                <p className="mt-3 text-sm text-champagne/70">نقطة مع كل عبوة</p>
              </div>
              <div className="rounded-[2rem] border border-gold/25 bg-burgundy/50 p-6 text-center shadow-2xl backdrop-blur sm:p-10">
                <p className="font-latin text-6xl text-gold sm:text-7xl">{points.redeem}</p>
                <p className="mt-3 text-sm text-champagne/70">نقطة = خصم {points.discount} جنيه</p>
              </div>
              <div className="col-span-2 rounded-[2rem] border border-gold/25 bg-espresso/70 p-6 text-center backdrop-blur">
                <p className="text-champagne/80">
                  مثال: اشترِ <span className="text-gold-soft">4 عبوات</span> واحصل على خصم <span className="text-gold-soft">{points.discount} جنيه</span> على
                  طلبك التالي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Promises ---------- */}
      <section className="bg-night py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {[
            { t: "100 مل", d: "حجم واحد سخي لكل عطر" },
            { t: "ثبات يدوم", d: "تركيبات مستوردة تدوم لساعات طويلة" },
            { t: shipping.days, d: "شحن لجميع المحافظات" },
            { t: `فوق ${shipping.freeOver.toLocaleString("en-US")} جنيه`, d: "الشحن مجاني" },
          ].map((f) => (
            <div key={f.t} className="reveal rounded-3xl border border-gold/15 bg-espresso/60 p-8 text-center">
              <p className="font-display text-2xl text-gold">{f.t}</p>
              <p className="mt-2 text-sm text-champagne/60">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="bg-night pb-24 pt-8 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <div className="reveal text-center">
            <p className="text-sm tracking-[0.3em] text-gold/80">قبل أن تختار</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">أسئلة قد تهمّك</h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="reveal group rounded-2xl border border-gold/20 bg-espresso/60 open:bg-espresso">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-lg">
                  {f.q}
                  <span className="faq-plus text-2xl text-gold transition-transform duration-300">+</span>
                </summary>
                <p className="px-6 pb-6 leading-8 text-champagne/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="relative overflow-hidden bg-burgundy py-24 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(80% 120% at 50% 120%, rgba(198,161,91,0.25), transparent 60%)" }}
        />
        <div className="reveal relative mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-4xl leading-[1.5] sm:text-5xl">
            تحتاج مساعدة في <span className="text-gold">الاختيار؟</span>
          </h2>
          <p className="mt-5 leading-8 text-champagne/75">اسألنا عن النوتات والعطور والشحن، وسنساعدك تختار العطر الأقرب لذوقك.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappLink("مرحبًا مسك العدلي، أحتاج مساعدة في اختيار عطر 🌹")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex items-center gap-3 rounded-full px-8 py-4 font-bold"
            >
              <WhatsAppIcon className="size-5" />
              تواصل عبر واتساب
            </a>
            <a href={`mailto:${contact.email}`} className="btn-ghost rounded-full px-8 py-4">
              {contact.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
