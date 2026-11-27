import Image from "next/image";
import { contact, faqs, points, shipping, whatsappLink } from "@/data/site";
import { ScrollStory } from "@/components/scroll-story";
import { FoilCards } from "@/components/foil-cards";
import { RevealController } from "@/components/reveal";
import { WhatsAppIcon } from "@/components/icons";

export default function Home() {
  return (
    <main>
      <RevealController />
      <ScrollStory />

      {/* ---------- The name, in the light ---------- */}
      <section aria-label="مسك العدلي" className="relative">
        <figure className="reveal-img relative aspect-[2.25/1] min-h-[22rem] w-full overflow-hidden">
          <Image
            src="/scenes/panorama.webp"
            alt="قارورة Icon بين كلمتي MISK و ALADLY على مخمل أحمر"
            fill
            sizes="100vw"
            className="drift object-cover"
          />
        </figure>
      </section>

      <FoilCards />

      {/* ---------- Golden hour: an off-grid lookbook ---------- */}
      <section className="px-5 pb-28 sm:px-10 sm:pb-40" aria-label="من عدسة مسك العدلي">
        <div className="mx-auto grid max-w-7xl grid-cols-12 items-start gap-4 sm:gap-6">
          <figure className="reveal-img relative col-span-12 aspect-[4/5] overflow-hidden sm:col-span-6 lg:col-span-5">
            <Image src="/scenes/sunset-dome.webp" alt="Velvet Kiss أمام شمس الغروب" fill sizes="(min-width:1024px) 40vw, 100vw" className="drift object-cover" />
          </figure>
          <div className="col-span-12 sm:col-span-6 lg:col-span-7 lg:ps-10">
            <p className="reveal max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.2] sm:mt-24">
              عطرٌ يليق <span className="text-gold">بساعة الغروب</span>، وبكل ما بعدها.
            </p>
            <div className="mt-12 grid grid-cols-5 gap-4 sm:gap-6">
              <figure className="reveal-img relative col-span-3 aspect-[4/5] overflow-hidden">
                <Image src="/scenes/sunset-arch.webp" alt="Adrenaline تحت أقواس ذهبية" fill sizes="(min-width:1024px) 25vw, 60vw" className="object-cover" />
              </figure>
              <figure className="reveal-img relative col-span-2 mt-20 aspect-[3/4] overflow-hidden">
                <Image src="/scenes/noir-gold.webp" alt="Velvet Kiss على أسود وذهب" fill sizes="(min-width:1024px) 16vw, 40vw" className="object-cover" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The box ---------- */}
      <section className="relative overflow-hidden bg-ink/40" aria-label="التغليف والشحن">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2">
          <figure className="reveal-img relative min-h-[34rem] lg:min-h-[48rem]">
            <Image src="/scenes/giftbag.webp" alt="حقيبة مسك العدلي الخمرية بشرائطها الذهبية" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </figure>
          <div className="reveal flex flex-col justify-center px-5 py-20 sm:px-10 lg:px-20">
            <h2 className="font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.25]">
              يصلك في علبته،
              <br />
              <span className="text-gold">جاهزًا للإهداء.</span>
            </h2>
            <p className="mt-6 max-w-[36ch] leading-8 text-champagne/75">حقيبة خمرية بشريطتين من الساتان الذهبي. افتحها لنفسك، أو قدّمها كما هي.</p>
            <dl className="mt-12 grid max-w-md grid-cols-[auto_1fr] gap-x-10 gap-y-5 border-t border-gold/40 pt-8">
              <dt className="text-champagne/55">التوصيل</dt>
              <dd>{shipping.days} لكل المحافظات</dd>
              <dt className="text-champagne/55">الشحن</dt>
              <dd>مجاني للطلبات فوق {shipping.freeOver.toLocaleString("en-US")} جنيه</dd>
              <dt className="text-champagne/55">الحجم</dt>
              <dd>100 مل لكل عطر</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Points: the gold ribbon ---------- */}
      <section id="points" className="bg-gold text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-10 sm:py-24 lg:grid-cols-12 lg:items-end">
          <h2 className="reveal font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.2] lg:col-span-5">نقاط مسك العدلي</h2>
          <div className="reveal lg:col-span-7">
            <p className="text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.6]">
              كل عبوة تشتريها تضيف <strong className="font-bold">{points.perBottle} نقطة</strong> إلى رصيدك. عند{" "}
              <strong className="font-bold">{points.redeem} نقطة</strong> تحصل على خصم <strong className="font-bold">{points.discount} جنيه</strong> على طلبك التالي.
            </p>
            <p className="mt-4 text-ink/70">أربع عبوات تكفي للخصم. نحسب رصيدك ونذكّرك به عند كل طلب على واتساب.</p>
          </div>
        </div>
      </section>

      {/* ---------- Questions ---------- */}
      <section id="faq" className="px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <h2 className="font-display text-[clamp(2.4rem,4.4vw,3.8rem)] leading-[1.25]">قبل أن تطلب</h2>
            <p className="mt-5 max-w-[28ch] leading-8 text-champagne/70">
              سؤالك ليس هنا؟ راسلنا على{" "}
              <a href={whatsappLink("مرحبًا مسك العدلي، عندي سؤال")} target="_blank" rel="noopener noreferrer" className="link-line text-gold-soft" dir="ltr">
                {contact.whatsappDisplay}
              </a>
            </p>
          </div>
          <div className="border-t border-champagne/20 lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="reveal group border-b border-champagne/20">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-7 text-xl transition-colors hover:text-gold-soft">
                  {f.q}
                  <span className="faq-plus text-2xl text-gold transition-transform duration-700 ease-[var(--ease-silk)]">+</span>
                </summary>
                <div className="faq-row">
                  <p className="overflow-hidden leading-8 text-champagne/70 group-open:pb-7">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Last word ---------- */}
      <section id="contact" className="relative isolate overflow-hidden">
        <Image src="/scenes/hands.webp" alt="يد تقدّم قارورة Majestic ويد تمتد إليها" fill sizes="100vw" className="drift -z-10 object-cover object-[30%_50%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/95 via-ink/60 to-transparent" />
        <div className="mx-auto max-w-7xl px-5 py-36 sm:px-10 sm:py-48">
          <h2 className="reveal max-w-[12ch] font-display text-[clamp(3rem,6.6vw,6.2rem)] leading-[1.15]">
            هديةٌ تُقدَّم،
            <br />
            <span className="text-gold">وأثرٌ يبقى.</span>
          </h2>
          <div className="reveal mt-12 flex flex-wrap items-center gap-6">
            <a href={whatsappLink("مرحبًا مسك العدلي، أحتاج مساعدة في اختيار عطر")} target="_blank" rel="noopener noreferrer" className="btn-gold px-7 py-4 text-lg">
              تواصل عبر واتساب
              <WhatsAppIcon className="size-5" />
            </a>
            <a href={`mailto:${contact.email}`} className="link-line text-champagne/80">
              {contact.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
