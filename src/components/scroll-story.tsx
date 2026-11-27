"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { genderLabel, orderMessage, perfumes, whatsappLink } from "@/data/site";
import type { BottleScene } from "@/lib/bottle-scene";
import { BOTTLES } from "@/data/bottles";
import { WhatsAppIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);


/*
  The scroll story. One pinned stage, five beats:
  0  the house            the first flacon turns in the light
  1  the spray            its cap lifts and a breath of mist leaves the atomiser
  2..5 the four perfumes  each flacon spins in, with its notes and price
  Timings are fractions of the section's scroll length.
*/
const BEATS = [
  { at: 0.0, until: 0.13 },
  { at: 0.15, until: 0.3 },
  { at: 0.34, until: 0.47 },
  { at: 0.51, until: 0.63 },
  { at: 0.67, until: 0.79 },
  { at: 0.83, until: 1.01 },
];
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

export function ScrollStory() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const beats = useRef<(HTMLDivElement | null)[]>([]);
  const engine = useRef<BottleScene | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = stage.current, sec = section.current;
    if (!host || !sec) return;
    let disposed = false;
    const wide = () => innerWidth >= 1024;
    const lite = matchMedia("(pointer: coarse)").matches || innerWidth < 768;

    // the beat text: fades and rises in, fades and lifts out
    const setBeats = (p: number) => {
      beats.current.forEach((el, i) => {
        if (!el) return;
        const b = BEATS[i];
        const inn = span(p, b.at - 0.035, b.at + 0.02);
        const out = i === BEATS.length - 1 ? 0 : span(p, b.until - 0.02, b.until + 0.02);
        const o = ease(inn) * (1 - ease(out));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0,${((1 - inn) * 40 - out * 40).toFixed(1)}px,0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });
    };

    const drive = (p: number) => {
      setBeats(p);
      const e = engine.current;
      if (!e) return;
      const s = e.state;
      // which flacon: 0 for the house and the spray, then one per perfume
      let morph = 0;
      for (let i = 1; i < perfumes.length; i++) morph += ease(span(p, BEATS[i + 2].at - 0.06, BEATS[i + 2].at + 0.01));
      s.morph = morph;
      s.capLift = ease(span(p, 0.15, 0.2)) * (1 - ease(span(p, 0.27, 0.32)));
      s.burst = span(p, 0.18, 0.29);
      s.spin = p * Math.PI * 2;
      s.zoom = 1 + ease(span(p, 0.13, 0.19)) * 0.35 * (1 - ease(span(p, 0.29, 0.34)));
      s.x = wide() ? -1.35 : 0;
      s.y = wide() ? 0 : -0.62;
      if (!wide()) s.zoom *= 0.84;
    };

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let st: ScrollTrigger | null = null;
    if (!reduce) {
      st = ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => drive(self.progress),
      });
    }
    drive(reduce ? 0.4 : 0);

    // load three.js only on the client, after the first paint
    const logo = new Image();
    logo.src = "/brand/logo.webp";
    const boot = async () => {
      try {
        const { BottleScene } = await import("@/lib/bottle-scene");
        if (disposed) return;
        await logo.decode().catch(() => {});
        const specs = perfumes.map((p) => BOTTLES[p.slug]);
        engine.current = new BottleScene(host, specs, logo.complete ? logo : null, lite);
        drive(st ? st.progress : 0.4);
      } catch {
        setFailed(true);
      }
    };
    boot();

    const onMove = (ev: PointerEvent) => engine.current?.setPointer(ev.clientX / innerWidth - 0.5, ev.clientY / innerHeight - 0.5);
    addEventListener("pointermove", onMove, { passive: true });
    const onResize = () => st && drive(st.progress);
    addEventListener("resize", onResize);

    return () => {
      disposed = true;
      st?.kill();
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  return (
    <section ref={section} className="relative h-[620svh] motion-reduce:h-auto" aria-label="مسك العدلي">
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative">
        {/* a warm pool of light behind the flacon */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(38% 48% at 30% 55%, rgba(214,160,86,.22), transparent 70%)" }}
        />
        <div ref={stage} className="absolute inset-0" aria-hidden="true" />
        {failed && (
          <p className="absolute inset-x-0 bottom-6 text-center text-sm text-champagne/50">تعذّر عرض القارورة ثلاثية الأبعاد على هذا الجهاز.</p>
        )}

        <div className="pointer-events-none absolute inset-0 mx-auto grid max-w-7xl px-5 sm:px-10">
          {/* 0. the house */}
          <div ref={(el) => { beats.current[0] = el; }} className="beat self-end pb-14 lg:w-[46%] lg:self-center lg:pb-0">
            <h1 className="font-display text-[clamp(2.8rem,6.4vw,6rem)] leading-[1.18]">
              حين يصبح العطر
              <br />
              <span className="text-gold">توقيعًا لا يُنسى</span>
            </h1>
            <p className="mt-6 max-w-[30ch] text-xl leading-9 text-champagne/75">أربعة عطور مستوردة من مسك العدلي. لكلٍّ منها حضور يسبقك.</p>
          </div>

          {/* 1. the spray */}
          <div ref={(el) => { beats.current[1] = el; }} className="beat self-end pb-14 lg:w-[42%] lg:self-center lg:pb-0">
            <p className="font-display text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[1.2]">
              رشّةٌ واحدة،
              <br />
              <span className="text-gold">ويتذكّرك الجميع.</span>
            </p>
            <p className="mt-6 max-w-[32ch] text-xl leading-9 text-champagne/75">تركيز عالٍ يدوم لساعات، ويترك أثرًا يُلاحَظ بعد أن تغادر.</p>
          </div>

          {/* 2..5 the perfumes */}
          {perfumes.map((p, i) => (
            <div key={p.slug} ref={(el) => { beats.current[i + 2] = el; }} className="beat self-end pb-12 lg:w-[44%] lg:self-center lg:pb-0">
              <p className="text-gold-soft">عطر {genderLabel[p.gender]}</p>
              <h2 className="name mt-2 pb-2 text-[clamp(3.6rem,8vw,8rem)] leading-[1.05]" dir="ltr" style={{ textAlign: "right" }}>
                {p.nameParts[0]}
                <em>{p.nameParts[1]}</em>
              </h2>
              <p className="mt-4 font-display text-3xl leading-snug">{p.short}</p>
              <p className="mt-3 text-champagne/80">{p.notes.join("، ")}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <p className="name text-5xl leading-[1.1] text-gold" dir="ltr">
                  {p.price.toLocaleString("en-US")}
                  <span className="ms-2 font-sans text-base text-champagne/60">جنيه، {p.size} مل</span>
                </p>
                <a href={whatsappLink(orderMessage(p, 1))} target="_blank" rel="noopener noreferrer" className="btn-gold px-6 py-3">
                  اطلب عبر واتساب
                  <WhatsAppIcon className="size-5" />
                </a>
                <Link href={`/perfume/${p.slug}`} className="link-line text-champagne/80">
                  تفاصيل العطر
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
