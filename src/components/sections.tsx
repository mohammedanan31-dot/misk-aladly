import Image from "next/image";
import Link from "next/link";
import { contact, faqs, perfumes, points, reviews, shipping, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";
import { LoyaltyProgress } from "./loyalty-progress";
import { Words } from "./words";

/* ---------- Names rail ---------- */
export function NamesRail() {
  const words = [...perfumes.map((p) => p.name), "Misk Aladly"];
  return (
    <div className="names-rail relative overflow-hidden border-y border-gold/12 bg-espresso py-5" aria-hidden="true">
      <div className="marquee-track flex w-max items-center whitespace-nowrap font-latin text-[13px] uppercase tracking-[0.55em] text-gold-soft/70 sm:text-[15px]" dir="ltr">
        {Array.from({ length: 4 }).flatMap((_, k) =>
          words.map((n, i) => (
            <span key={`${k}-${i}`} className="flex items-center">
              <span className={n === "Misk Aladly" ? "text-gold" : ""}>{n}</span>
              <span className="mx-10 inline-block size-[5px] rotate-45 bg-gold/55 sm:mx-16" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

/* ---------- 04 · Immersive fragrance experience ---------- */
export function Experience() {
  return (
    <section id="experience" className="section-in relative overflow-hidden bg-night py-24 sm:py-32" aria-labelledby="exp-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="max-w-2xl">
          <p className="kicker reveal">The <b>Experience</b> · 03</p>
          <h2 id="exp-title" className="mt-6 font-display text-4xl font-bold leading-[1.45] sm:text-6xl">
            <Words text="رذاذٌ واحد" /> <Words text="يكفي ليتذكّرك الجميع" wordClass="text-gold" start={2} />
          </h2>
        </div>
      </div>
      <div className="tilt relative mx-auto mt-14 w-[94vw] max-w-[1360px] rounded-[2rem]" data-tilt="5">
      <div className="open-up relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-[rgba(255,90,60,0.3)] sm:aspect-[9/4]">
        <Image src="/scenes/panorama.webp" alt="قارورة Icon من مسك العدلي على مخمل خمري بين حروف MISK ALADLY الذهبية" fill sizes="100vw" className="parallax object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/30" />
      </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-5 sm:grid-cols-3 sm:px-10">
        {[
          { k: "ثبات يدوم", v: "تركيبات مستوردة بتركيز عالٍ، تدوم لساعات طويلة وتترك أثرًا يُلاحظ." },
          { k: "100 مل", v: "حجم سخي لكل عطر من عطور المجموعة." },
          { k: "جاهز للإهداء", v: "كل عطر يصلك في علبته الخمرية الفاخرة بشرائط ذهبية." },
        ].map((x, i) => (
          <div key={x.k} className="reveal reveal-3d glass tilt p-7" data-tilt="10" style={{ transitionDelay: `${i * 120}ms` }}>
            <p className="font-display text-2xl font-bold text-amber">{x.k}</p>
            <p className="mt-3 leading-8 text-champagne/70">{x.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 05 · Brand story ---------- */
const manifesto =
  "في مسك العدلي نؤمن أن العطر ليس رائحة فحسب، بل حضورٌ يسبقك إلى المكان، وذكرى تبقى بعد أن ترحل. أربع تركيبات مستوردة، اخترناها بعناية لتجد بينها توقيعك.";

export function Story() {
  return (
    <section id="story" className="section-in relative scroll-mt-16 overflow-hidden bg-burgundy py-24 sm:py-36" aria-labelledby="story-title">
      <Image src="/brand/logo.webp" alt="" aria-hidden="true" width={491} height={439} className="pointer-events-none absolute -left-24 top-10 w-[34rem] max-w-none opacity-[0.05] sm:-left-10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
        <div>
          <p className="kicker reveal">Our <b>Story</b> · 04</p>
          <h2 id="story-title" className="sr-only">حكايتنا</h2>
          <p className="mt-8 font-display text-[1.95rem] font-bold leading-[1.75] text-champagne sm:text-5xl sm:leading-[1.65]">
            {manifesto.split(" ").map((w, i) => (
              <span key={i} className="scrub-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <div className="gold-line mt-12" />
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { k: "الهوية", v: "عطرك توقيعك؛ حضورٌ يعرّف بك قبل أن تتكلم." },
              { k: "فن العطر", v: "تركيبات مستوردة، اخترناها بعناية لتدوم وتترك أثرًا." },
              { k: "التفرّد", v: "لكل عطر مزاجه وحكايته، ولكل شخص توقيعه." },
            ].map((x, i) => (
              <div key={x.k} className="group reveal reveal-3d glass tilt p-6" data-tilt="12" style={{ transitionDelay: `${i * 120}ms` }}>
                <p className="font-latin text-sm" dir="ltr" style={{ textAlign: "right" }}>
                  <span className="icon-tip font-extrabold text-coral">0{i + 1}</span>
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-amber">{x.k}</p>
                <p className="mt-2 leading-8 text-champagne/70">{x.v}</p>
              </div>
            ))}
          </div>
        </div>

        <figure className="reveal reveal-scale">
          <div className="frame tilt mask-reveal relative aspect-[4/5]" data-tilt="8">
            <Image src="/scenes/sunset-dome.webp" alt="قارورة مسك العدلي ونقش الطاووس عند الغروب" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-8 flex items-start gap-5">
            <Image src="/brand/logo.webp" alt="" aria-hidden="true" width={491} height={439} className="logo-3d h-16 w-auto shrink-0" />
            <p className="leading-8 text-champagne/75">
              <span className="block font-display text-xl font-bold text-coral">الطاووس</span>
              رمزنا للاعتزاز والرقيّ — يزيّن كل قارورة، ويحمل توقيع مسك العدلي.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 06 · Packaging & gifting ---------- */
export function Packaging() {
  return (
    <section className="section-light section-in relative overflow-hidden py-24 sm:py-36" aria-labelledby="pack-title">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="lg:order-2">
          <div className="grid grid-cols-[1.4fr_1fr] gap-4 sm:gap-6">
            <div className="mask-reveal frame tilt relative row-span-2 aspect-[3/4]" data-tilt="9">
              <Image src="/scenes/giftbag.webp" alt="كيس هدايا مسك العدلي الخمري بشرائط ذهبية وشعار الطاووس" fill sizes="(min-width:1024px) 32vw, 58vw" className="object-cover object-[40%_45%]" />
            </div>
            <div className="mask-reveal frame tilt relative aspect-square" data-tilt="14" style={{ transitionDelay: "120ms" }}>
              <Image src="/scenes/giftbag.webp" alt="" aria-hidden="true" fill sizes="(min-width:1024px) 20vw, 40vw" className="scale-[2.1] object-cover object-[30%_58%]" />
            </div>
            <div className="mask-reveal frame tilt relative aspect-square" data-tilt="14" style={{ transitionDelay: "240ms" }}>
              <Image src="/scenes/giftbag.webp" alt="" aria-hidden="true" fill sizes="(min-width:1024px) 20vw, 40vw" className="scale-[2.2] object-cover object-[22%_14%]" />
            </div>
          </div>
        </div>
        <div className="reveal reveal-right lg:order-1">
          <p className="kicker">The <b>Gift</b> · 05</p>
          <h2 id="pack-title" className="mt-6 font-display text-4xl font-bold leading-[1.45] sm:text-6xl">
            <Words text="الفخامة تبدأ" /> <Words text="قبل أول رشة" wordClass="text-gold" start={2} />
          </h2>
          <p className="mt-6 max-w-md text-xl leading-9 text-ink/75">كل عطر يصلك في علبته الخمرية الفاخرة بشرائط ذهبية — هدية تليق بمن تحب.</p>
          <ul className="mt-8 space-y-3 text-ink/80">
            {["علبة خمرية بشعار الطاووس الذهبي", "شرائط ذهبية جاهزة للإهداء", `توصيل لجميع المحافظات خلال ${shipping.days}`].map((t) => (
              <li key={t} className="group flex items-center gap-4">
                <span className="icon-3d inline-block size-[9px] rotate-45 border border-[#ff4a3d] bg-[#ff2a2f] shadow-[0_0_10px_#ff2a2f]" />
                {t}
              </li>
            ))}
          </ul>
          <Link href="#collection" className="btn-primary magnetic mt-10">
            اختر هديتك
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 07 · Loyalty ---------- */
export function Loyalty() {
  const steps = [
    { n: "01", t: "اشترِ عطرك", d: `تحصل على ${points.perBottle} نقطة مع كل عبوة.` },
    { n: "02", t: "اجمع النقاط", d: `تتراكم نقاطك مع كل طلب حتى تصل إلى ${points.redeem} نقطة.` },
    { n: "03", t: "استمتع بالمكافأة", d: `عند ${points.redeem} نقطة تحصل على خصم ${points.discount} جنيه على طلبك القادم.` },
  ];
  return (
    <section id="loyalty" className="section-in relative scroll-mt-16 overflow-hidden bg-espresso py-24 sm:py-36" aria-labelledby="loyalty-title">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-10 lg:grid-cols-2 lg:gap-24">
        <div className="reveal">
          <p className="kicker">Misk <b>Points</b> · 06</p>
          <h2 id="loyalty-title" className="mt-6 font-display text-4xl font-bold leading-[1.45] sm:text-6xl">
            <Words text="كل عبوة" /> <Words text="تحمل مكافأة" wordClass="text-gold" start={2} />
          </h2>
          <ol className="mt-10 space-y-0">
            {steps.map((s) => (
              <li key={s.n} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-gold/15 py-6 last:border-b">
                <span className="font-latin text-3xl font-extralight text-coral" dir="ltr">
                  <span className="icon-tip">{s.n}</span>
                </span>
                <div>
                  <p className="font-display text-2xl font-bold">{s.t}</p>
                  <p className="mt-1 leading-8 text-champagne/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* membership card */}
        <div className="reveal reveal-scale">
          <div className="float">
            <div
              className="tilt relative mx-auto aspect-[1.6/1] w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-[rgba(255,110,80,0.5)] bg-[linear-gradient(135deg,#b3141a_0%,#5a0707_45%,#220303_100%)] p-6 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] sm:p-9"
              data-tilt="16"
              data-tilt-scale="1.03"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_10%,rgba(255,190,140,0.25),transparent_70%)]" />
              <Image src="/brand/logo.webp" alt="" aria-hidden="true" width={491} height={439} className="pointer-events-none absolute -bottom-10 -left-8 w-56 opacity-10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} className="logo-3d h-12 w-auto sm:h-14" />
                  <span className="font-latin text-[10px] uppercase tracking-[0.45em] text-rose" dir="ltr">
                    <b className="font-bold text-white">Misk</b> <span className="font-light">Points</span>
                  </span>
                </div>
                <div>
                  <p className="font-latin text-5xl font-extrabold text-amber sm:text-6xl" dir="ltr" style={{ textAlign: "right" }}>
                    {points.perBottle}
                    <span className="ms-2 font-sans text-lg font-medium text-white">نقطة / عبوة</span>
                  </p>
                  <p className="mt-2 text-sm text-rose">
                    {points.redeem} نقطة = خصم <span className="font-bold text-amber">{points.discount} جنيه</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-lg">
            <LoyaltyProgress />
            <Link href="#collection" className="btn-ghost magnetic mt-6">
              ابدأ بجمع النقاط
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 08 · Reviews (hidden until real reviews are added in data/site.ts) ---------- */
export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section className="section-light py-24 sm:py-32" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-5xl px-5 sm:px-10">
        <p className="kicker">Testimonials</p>
        <h2 id="reviews-title" className="mt-6 font-display text-4xl font-bold sm:text-5xl">
          قالوا عن <span className="text-gold">مسك العدلي</span>
        </h2>
        <div className="showcase-track mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {reviews.map((r) => (
            <figure key={r.name + r.text} className="w-[85%] shrink-0 snap-start border-t border-ink/15 pt-8 sm:w-[46%]">
              <span className="font-latin text-6xl leading-none text-wine/40" aria-hidden="true">
                ”
              </span>
              <blockquote className="mt-2 font-display text-2xl leading-[1.7]">{r.text}</blockquote>
              <figcaption className="mt-6 text-ink/60">
                {r.name}
                {r.city ? ` · ${r.city}` : ""}
                {r.perfume ? ` · ${r.perfume}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 09 · FAQ ---------- */
export function Faq() {
  return (
    <section id="faq" className="section-light section-in scroll-mt-16 py-24 sm:py-32" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="reveal reveal-scale">
          <p className="kicker"><b>Questions</b> · 07</p>
          <h2 id="faq-title" className="mt-6 font-display text-4xl font-bold leading-[1.4] sm:text-5xl">
            <Words text="قبل أن" /> <Words text="تختار" wordClass="text-gold" start={2} />
          </h2>
          <p className="mt-5 max-w-sm leading-8 text-ink/65">لم تجد إجابتك؟ راسلنا على واتساب وسنرد عليك سريعًا.</p>
          <a href={whatsappLink("مرحبًا مسك العدلي، عندي سؤال 🌹")} target="_blank" rel="noopener noreferrer" className="btn-ghost magnetic mt-8">
            <WhatsAppIcon className="size-4" />
            <span dir="ltr">{contact.whatsappDisplay}</span>
          </a>
        </div>
        <div className="border-t border-ink/15">
          {faqs.map((f) => (
            <details key={f.q} className="reveal reveal-3d group border-b border-ink/15">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-6 font-display text-xl font-bold sm:text-2xl">
                {f.q}
                <span className="faq-plus icon-3d flex size-9 shrink-0 items-center justify-center rounded-full border border-[rgba(255,90,60,0.5)] font-sans text-xl text-coral">
                  +
                </span>
              </summary>
              <p className="pb-7 leading-8 text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 10 · Final call ---------- */
export function FinalCta() {
  return (
    <section id="contact" className="section-in relative isolate mx-auto my-10 w-[94vw] max-w-[1360px] overflow-hidden rounded-[2rem] border border-[rgba(255,90,60,0.35)] bg-burgundy py-28 text-center sm:py-36" aria-labelledby="final-title">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(197,164,109,0.22),transparent_70%)]" />
      <Image src="/brand/logo.webp" alt="" aria-hidden="true" width={491} height={439} className="reveal logo-3d mx-auto h-24 w-auto sm:h-28" />
      <div className="mx-auto mt-10 max-w-3xl px-5">
        <h2 id="final-title" className="font-display text-5xl font-bold leading-[1.4] sm:text-7xl">
          <Words text="اترك أثرًا" /> <Words text="لا يُنسى" wordClass="text-gold" start={2} />
        </h2>
        <p className="reveal mx-auto mt-6 max-w-md text-xl leading-9 text-champagne/75">محتار بين العطور؟ قلّنا ذوقك، ونرشّح لك الأنسب.</p>
        <div className="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={whatsappLink("مرحبًا مسك العدلي، أحتاج مساعدة في اختيار عطر 🌹")} target="_blank" rel="noopener noreferrer" className="btn-primary magnetic">
            <WhatsAppIcon className="size-5" />
            تواصل عبر واتساب
          </a>
          <Link href="#finder" className="btn-ghost magnetic">
            اعثر على عطرك
          </Link>
        </div>
      </div>
    </section>
  );
}
