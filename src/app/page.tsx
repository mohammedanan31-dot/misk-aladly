import Image from "next/image";
import Link from "next/link";
import { contact, faqs, perfumes, points, shipping, whatsappLink } from "@/data/site";
import { Hero } from "@/components/hero";
import { Collection } from "@/components/collection";
import { RevealController } from "@/components/reveal";
import { WhatsAppIcon } from "@/components/icons";

const manifesto =
  "في مسك العدلي نؤمن أن العطر ليس رائحة فحسب، بل حضورٌ يسبقك إلى المكان، وذكرى تبقى بعد أن ترحل. أربع تركيبات مستوردة، اخترناها بعناية لتجد بينها توقيعك.";

export default function Home() {
  return (
    <main>
      <RevealController />
      <Hero />

      {/* ---------- Names rail ---------- */}
      <div className="names-rail relative overflow-hidden border-y border-gold/12 py-5 sm:py-6" aria-hidden="true">
        <div className="marquee-track flex w-max items-center whitespace-nowrap font-latin text-[13px] uppercase tracking-[0.55em] text-gold-soft/75 sm:text-[15px]" dir="ltr">
          {Array.from({ length: 4 }).flatMap((_, k) =>
            [...perfumes.map((p) => p.name), "Misk Aladly"].map((n, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className={n === "Misk Aladly" ? "text-gold" : ""}>{n}</span>
                <span className="mx-10 inline-block size-[5px] rotate-45 bg-gold/55 sm:mx-16" />
              </span>
            )),
          )}
        </div>
      </div>

      {/* ---------- Manifesto ---------- */}
      <section id="story" className="relative overflow-hidden py-28 sm:py-40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="eyebrow reveal">حكايتنا</span>
            <p className="mt-8 font-display text-3xl leading-[1.75] text-champagne sm:text-5xl sm:leading-[1.65]">
              {manifesto.split(" ").map((w, i) => (
                <span key={i} className="scrub-word">
                  {w}{" "}
                </span>
              ))}
            </p>
            <div className="reveal mt-12 flex items-center gap-5">
              <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} className="h-20 w-auto" />
              <div className="gold-rule h-px flex-1" />
            </div>
          </div>
          <div className="reveal bezel">
            <div className="bezel-core relative aspect-[4/5]">
              <Image src="/scenes/noir-gold.webp" alt="قارورة مسك العدلي الذهبية مع نقش الطاووس وشريطة ذهبية" fill sizes="(min-width:1024px) 40vw, 100vw" className="parallax scale-110 object-cover object-[70%_50%]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 to-transparent p-6">
                <p className="font-latin text-sm italic text-champagne/70" dir="ltr">
                  The peacock — our mark of pride and grace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Brand panorama ---------- */}
      <section className="relative px-3 sm:px-5" aria-label="مسك العدلي">
        <div className="reveal bezel">
          <div className="bezel-core relative aspect-[9/4]">
            <Image
              src="/scenes/panorama.webp"
              alt="قارورة مسك العدلي على مخمل خمري بين حروف MISK ALADLY الذهبية"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <Collection />

      {/* ---------- Golden hour lookbook ---------- */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-10">
          <div className="reveal flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">ساعة ذهبية</span>
              <h2 className="mt-6 font-display text-5xl leading-[1.4] sm:text-6xl">
                عطرٌ <span className="text-gold">يلتقط الضوء</span>
              </h2>
            </div>
            <p className="max-w-sm leading-8 text-champagne/60">زجاجٌ يلمع كالكهرمان، ونقش الطاووس يتوهّج مع آخر شعاع للشمس.</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {[
              { src: "/scenes/sunset-dome.webp", alt: "قارورة Velvet Kiss عند الغروب", name: "Velvet Kiss", slug: "velvet-kiss" },
              { src: "/scenes/sunset-arch.webp", alt: "قارورة Adrenaline تحت قوس عند الغروب", name: "Adrenaline", slug: "adrenaline" },
            ].map((im, i) => (
              <Link key={im.src} href={`/perfume/${im.slug}`} className={`reveal bezel group block ${i === 1 ? "sm:mt-20" : ""}`}>
                <div className="bezel-core relative aspect-[4/5]">
                  <Image src={im.src} alt={im.alt} fill sizes="(min-width:640px) 45vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/85 to-transparent p-6 pt-20">
                    <p className="font-latin text-3xl text-champagne" dir="ltr" style={{ textAlign: "right" }}>
                      {im.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- The touch (light band) ---------- */}
      <section className="relative isolate overflow-hidden bg-[#d9d6d2]">
        <div className="relative aspect-[5/4] sm:aspect-[2000/889]">
          <Image src="/scenes/hands.webp" alt="يدٌ تقدّم قارورة مسك العدلي ويدٌ تمتد إليها" fill sizes="100vw" className="object-cover object-[52%_50%] sm:object-center" />
        </div>
        <div className="sm:absolute sm:inset-y-0 sm:start-0 sm:w-[40%]">
          <div className="reveal flex h-full flex-col justify-end px-6 pb-12 pt-2 sm:px-12 sm:pb-[6%] sm:pt-0">
            <span className="text-xs tracking-[0.3em] text-[#7a1418]">ثبات يدوم</span>
            <h2 className="mt-4 font-display text-4xl leading-[1.45] text-[#2b0509] sm:text-5xl">
              رذاذٌ واحد
              <br />
              يكفي ليتذكّرك الجميع
            </h2>
            <p className="mt-4 max-w-sm leading-8 text-[#2b0509]/75">تركيبات مستوردة بتركيز عالٍ، تدوم لساعات طويلة وتترك أثرًا يُلاحظ.</p>
          </div>
        </div>
      </section>

      {/* ---------- Gifting, points, shipping (bento) ---------- */}
      <section id="points" className="py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-10">
          <div className="reveal max-w-2xl">
            <span className="eyebrow">نقاط مسك العدلي</span>
            <h2 className="mt-6 font-display text-5xl leading-[1.4] sm:text-6xl">
              كل عبوة <span className="text-gold">تحمل مكافأة</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-6 md:grid-rows-[auto_auto]">
            <div className="reveal bezel md:col-span-3 md:row-span-2">
              <div className="bezel-core relative h-full min-h-[28rem]">
                <Image src="/scenes/giftbag.webp" alt="كيس هدايا مسك العدلي الخمري بشرائط ذهبية" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-[40%_40%]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/70 to-transparent p-8 pt-24">
                  <p className="font-display text-3xl">جاهز للإهداء</p>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-champagne/70">كل عطر يصلك في علبته الخمرية الفاخرة بشرائط ذهبية — هدية تليق بمن تحب.</p>
                </div>
              </div>
            </div>

            <div className="reveal bezel md:col-span-3">
              <div className="bezel-core flex h-full flex-col justify-between gap-10 bg-burgundy/60 p-8">
                <div className="flex items-start justify-between">
                  <p className="text-champagne/70">مع كل عبوة</p>
                  <span className="eyebrow">١</span>
                </div>
                <p className="font-latin text-8xl leading-none text-gold">
                  {points.perBottle}
                  <span className="ms-3 font-sans text-2xl text-champagne">نقطة</span>
                </p>
              </div>
            </div>

            <div className="reveal bezel md:col-span-3">
              <div className="bezel-core flex h-full flex-col justify-between gap-10 bg-espresso p-8">
                <div className="flex items-start justify-between">
                  <p className="text-champagne/70">
                    عند {points.redeem} نقطة تحصل على
                  </p>
                  <span className="eyebrow">٢</span>
                </div>
                <p className="font-latin text-8xl leading-none text-gold">
                  {points.discount}
                  <span className="ms-3 font-sans text-2xl text-champagne">جنيه خصم</span>
                </p>
              </div>
            </div>

            <div className="reveal bezel md:col-span-2">
              <div className="bezel-core h-full bg-espresso/70 p-8">
                <p className="font-display text-3xl text-gold">{shipping.days}</p>
                <p className="mt-2 text-sm text-champagne/60">توصيل لجميع المحافظات</p>
              </div>
            </div>
            <div className="reveal bezel md:col-span-2">
              <div className="bezel-core h-full bg-espresso/70 p-8">
                <p className="font-display text-3xl text-gold">شحن مجاني</p>
                <p className="mt-2 text-sm text-champagne/60">للطلبات فوق {shipping.freeOver.toLocaleString("en-US")} جنيه</p>
              </div>
            </div>
            <div className="reveal bezel md:col-span-2">
              <div className="bezel-core h-full bg-espresso/70 p-8">
                <p className="font-display text-3xl text-gold">100 مل</p>
                <p className="mt-2 text-sm text-champagne/60">حجم سخي لكل عطر</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="pb-28 sm:pb-36">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="reveal">
            <span className="eyebrow">قبل أن تختار</span>
            <h2 className="mt-6 font-display text-5xl leading-[1.4]">أسئلة قد تهمّك</h2>
            <p className="mt-5 max-w-sm leading-8 text-champagne/60">لم تجد إجابتك؟ راسلنا على واتساب وسنرد عليك سريعًا.</p>
            <a
              href={whatsappLink("مرحبًا مسك العدلي، عندي سؤال 🌹")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass group mt-8 inline-flex items-center gap-3 rounded-full py-2 pe-2 ps-5"
            >
              <span dir="ltr">{contact.whatsappDisplay}</span>
              <span className="btn-icon flex size-9 items-center justify-center rounded-full bg-gold/15 text-gold-soft">
                <WhatsAppIcon className="size-4" />
              </span>
            </a>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="reveal group rounded-[1.75rem] border border-champagne/10 bg-champagne/[0.03] transition-colors duration-700 open:bg-espresso">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-7 py-6 text-lg">
                  {f.q}
                  <span className="faq-plus flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-xl text-gold transition-transform duration-700 ease-[var(--ease-silk)]">
                    +
                  </span>
                </summary>
                <p className="px-7 pb-7 leading-8 text-champagne/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final call ---------- */}
      <section id="contact" className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="grow-in relative isolate overflow-hidden rounded-[2rem] bg-burgundy px-6 py-24 text-center sm:py-32">
          <div className="hero-glow absolute inset-0 -z-10" aria-hidden="true" />
          <div className="reveal mx-auto max-w-2xl">
            <h2 className="font-display text-5xl leading-[1.4] sm:text-7xl">
              اختر <span className="text-gold">توقيعك</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md leading-8 text-champagne/75">محتار بين العطور؟ قلّنا ذوقك، ونرشّح لك الأنسب.</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappLink("مرحبًا مسك العدلي، أحتاج مساعدة في اختيار عطر 🌹")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold group inline-flex items-center gap-3 rounded-full py-2 pe-2 ps-7 text-lg font-bold"
              >
                تواصل عبر واتساب
                <span className="btn-icon flex size-11 items-center justify-center rounded-full bg-espresso/15">
                  <WhatsAppIcon className="size-5" />
                </span>
              </a>
              <a href={`mailto:${contact.email}`} className="btn-glass rounded-full px-7 py-4">
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
