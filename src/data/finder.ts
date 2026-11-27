/**
 * Fragrance finder. Every option maps only to facts already in the product data
 * (notes, occasion, mood, description) — nothing here invents a characteristic.
 */
import { perfumes } from "./site";

type Slug = (typeof perfumes)[number]["slug"];
export type Option = { label: string; hint?: string; score: Partial<Record<Slug, number>> };
export type Question = { id: string; title: string; options: Option[] };

export const questions: Question[] = [
  {
    id: "category",
    title: "لمن تبحث عن العطر؟",
    options: [
      { label: "عطر نسائي", score: { "velvet-kiss": 4, adrenaline: 4 } },
      { label: "عطر رجالي", score: { majestic: 4, icon: 4 } },
      { label: "لا يهم", hint: "أريد ما يشبهني", score: {} },
    ],
  },
  {
    id: "profile",
    title: "أي رائحة تجذبك أكثر؟",
    options: [
      { label: "حلوة ودافئة", hint: "فانيلا، عسل، كراميل", score: { "velvet-kiss": 3, majestic: 1 } },
      { label: "ناعمة ونظيفة", hint: "باودر، مسك خالص", score: { adrenaline: 3 } },
      { label: "منعشة ومشرقة", hint: "حمضيات، زهر البرتقال", score: { icon: 3 } },
      { label: "دافئة وحارّة", hint: "عنبر، لمسات عطرية حارة", score: { majestic: 3 } },
    ],
  },
  {
    id: "occasion",
    title: "متى ستضعه غالبًا؟",
    options: [
      { label: "كل يوم وفي كل الأوقات", score: { adrenaline: 2, icon: 2 } },
      { label: "في المساء والأجواء الباردة", score: { majestic: 2 } },
      { label: "حين أريد حضورًا جذّابًا", score: { "velvet-kiss": 2, majestic: 1 } },
    ],
  },
  {
    id: "intensity",
    title: "كيف تحب حضور عطرك؟",
    options: [
      { label: "ناعم وأنيق", hint: "يرافقك بهدوء", score: { adrenaline: 2, icon: 1 } },
      { label: "واضح ويدوم طويلًا", score: { "velvet-kiss": 2, icon: 1 } },
      { label: "قوي يلفت الانتباه", hint: "ثبات وفوحان", score: { majestic: 2 } },
    ],
  },
  {
    id: "personality",
    title: "أي كلمة تصف شخصيتك؟",
    options: [
      { label: "جذّاب", score: { "velvet-kiss": 2 } },
      { label: "أنيق", score: { adrenaline: 2 } },
      { label: "غامض", score: { majestic: 2 } },
      { label: "كلاسيكي", score: { icon: 2 } },
    ],
  },
];

/** Highest total wins; ties go to the perfume listed first. Returns the winner and the answers that pointed to it. */
export function recommend(answers: number[]) {
  const totals = new Map<string, number>(perfumes.map((p) => [p.slug, 0]));
  answers.forEach((a, i) => {
    const o = questions[i]?.options[a];
    if (!o) return;
    for (const [slug, n] of Object.entries(o.score)) totals.set(slug, (totals.get(slug) ?? 0) + (n ?? 0));
  });
  const winner = perfumes.reduce((best, p) => ((totals.get(p.slug) ?? 0) > (totals.get(best.slug) ?? 0) ? p : best), perfumes[0]);
  const reasons = answers
    .map((a, i) => questions[i]?.options[a])
    .filter((o): o is Option => Boolean(o && (o.score as Record<string, number>)[winner.slug]))
    .map((o) => o.label);
  return { perfume: winner, reasons };
}
