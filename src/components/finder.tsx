"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { questions, recommend } from "@/data/finder";
import { formatPrice, genderLabel } from "@/data/site";
import { Words } from "./words";
import { AddToBag } from "./bag";

export function FragranceFinder() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step >= questions.length;
  const q = questions[step];
  const result = done ? recommend(answers) : null;

  return (
    <section id="finder" className="section-light section-in relative scroll-mt-20 overflow-hidden py-24 sm:py-32" aria-labelledby="finder-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="text-center">
          <p className="kicker">Fragrance Finder</p>
          <h2 id="finder-title" className="mt-5 font-display text-4xl font-bold leading-[1.4] sm:text-6xl">
            <Words text="اكتشف العطر" /> <Words text="الذي يشبهك" wordClass="text-gold" start={2} />
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink/65">خمسة أسئلة قصيرة، ونرشّح لك عطرك من مجموعة مسك العدلي.</p>
        </div>

        <div className="reveal reveal-scale glass mx-auto mt-14 max-w-3xl overflow-hidden">
          {/* progress */}
          <div className="flex items-center justify-between border-b border-[rgba(255,90,60,0.2)] px-6 py-4 text-sm sm:px-10">
            <span className="font-latin tracking-[0.3em] text-ink/50" dir="ltr">
              {String(Math.min(step + 1, questions.length)).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
            </span>
            <div className="mx-6 h-px flex-1 bg-ink/10">
              <div className="h-[2px] bg-[#ff2a2f] shadow-[0_0_10px_#ff2a2f] transition-[width] duration-700 ease-[var(--ease-silk)]" style={{ width: `${(step / questions.length) * 100}%` }} />
            </div>
            {step > 0 && !done ? (
              <button type="button" onClick={() => setAnswers((a) => a.slice(0, -1))} className="text-ink/60 hover:text-wine">
                رجوع
              </button>
            ) : (
              <span className="w-8" />
            )}
          </div>

          <div className="min-h-[24rem] px-6 py-10 sm:px-10 sm:py-12" aria-live="polite">
            {!done && q && (
              <div key={q.id} className="finder-step">
                <h3 className="font-display text-3xl font-bold leading-[1.5] sm:text-4xl">{q.title}</h3>
                <div className={`mt-8 grid gap-3 ${q.options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                  {q.options.map((o, i) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => setAnswers((a) => [...a, i])}
                      className="finder-option group"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <span className="block text-xl text-ink">{o.label}</span>
                      {o.hint && <span className="mt-1 block text-sm text-ink/55">{o.hint}</span>}
                      <span className="finder-line" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div key="result" className="finder-step grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr]">
                <div className="frame relative mx-auto aspect-[3/4] w-full max-w-[16rem]" style={{ background: `linear-gradient(180deg, ${result.perfume.theme.from}, ${result.perfume.theme.to})` }}>
                  <Image src={result.perfume.scene} alt={result.perfume.name} fill sizes="256px" className="object-cover" />
                </div>
                <div>
                  <p className="kicker">عطرك هو</p>
                  <h3 className="mt-3 font-latin text-4xl uppercase tracking-[0.1em] text-ink sm:text-5xl" dir="ltr" style={{ textAlign: "right" }}>
                    {result.perfume.name}
                  </h3>
                  <p className="mt-2 text-wine">
                    {result.perfume.tagline} · {genderLabel[result.perfume.gender]}
                  </p>
                  {result.reasons.length > 0 && (
                    <p className="mt-5 leading-8 text-ink/75">
                      لأنك اخترت: <span className="text-ink">{result.reasons.join("، ")}</span>. {result.perfume.description}
                    </p>
                  )}
                  {result.reasons.length === 0 && <p className="mt-5 leading-8 text-ink/75">{result.perfume.description}</p>}
                  <p className="mt-4 text-sm text-ink/60">النوتات: {result.perfume.notes.join(" · ")}</p>
                  <p className="mt-4 font-latin text-3xl text-wine">{formatPrice(result.perfume.price)}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <AddToBag slug={result.perfume.slug} />
                    <Link href={`/perfume/${result.perfume.slug}`} className="btn-ghost btn-ghost-dark">
                      اكتشف العطر
                    </Link>
                  </div>
                  <button type="button" onClick={() => setAnswers([])} className="mt-6 text-sm text-ink/55 underline underline-offset-4 hover:text-wine">
                    أعد الاختبار
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
