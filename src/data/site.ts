/**
 * كل محتوى الموقع هون: الأسماء والأسعار والوصف والتواصل.
 * All site content lives in this file.
 */

export const brand = {
  nameAr: "مسك العدلي",
  nameEn: "MISK ALADLY",
  tagline: "حين يصبح العطر توقيعًا لا يُنسى",
  intro: "أربعة عطور، ولكل عطر حضوره. اكتشف توقيعك مع مسك العدلي.",
};

export const contact = {
  /** بالصيغة الدولية بدون + */
  whatsapp: "201016325762",
  whatsappDisplay: "01016325762",
  email: "info@miskaladly.com",
};

export const shipping = {
  freeOver: 2000,
  days: "3–5 أيام عمل",
};

export const points = {
  perBottle: 50,
  redeem: 200,
  discount: 50,
};

export type Gender = "women" | "men";

export type Perfume = {
  slug: string;
  name: string;
  /** يُكتب جزء من الاسم بخط مائل ملوّن */
  nameParts: [string, string];
  gender: Gender;
  notes: string[];
  short: string;
  description: string;
  occasion: string;
  size: number;
  price: number;
  image: string;
  /** لون الضوء والأجواء خلف القارورة */
  light: string;
  glow: string;
};

export const perfumes: Perfume[] = [
  {
    slug: "velvet-kiss",
    name: "Velvet Kiss",
    nameParts: ["Velvet ", "Kiss"],
    gender: "women",
    notes: ["فانيلا", "عسل", "كراميل"],
    short: "حلاوةٌ دافئة تلتصق بالذاكرة.",
    description:
      "مزيج فاخر من الفانيلا مع رذاذ العسل ولمسات الكراميل، ليمنحك رائحة حلوة وجذابة تدوم طويلًا.",
    occasion: "لمن يفضّل الروائح الحلوة والجذابة",
    size: 100,
    price: 1200,
    image: "/perfumes/velvet-kiss.webp",
    light: "#E7B98A",
    glow: "#8F2948",
  },
  {
    slug: "adrenaline",
    name: "Adrenaline",
    nameParts: ["Adren", "aline"],
    gender: "women",
    notes: ["باودر ناعم", "مسك خالص"],
    short: "نظيف، ناعم، وأنيق في كل وقت.",
    description: "مزيج ناعم من الباودر مع المسك الخالص، برائحة نظيفة وأنيقة تناسب جميع الأوقات.",
    occasion: "لكل الأوقات، من الصباح إلى المساء",
    size: 100,
    price: 900,
    image: "/perfumes/adrenaline.webp",
    light: "#F2E4D0",
    glow: "#6E1734",
  },
  {
    slug: "majestic",
    name: "Majestic",
    nameParts: ["Maj", "estic"],
    gender: "men",
    notes: ["فانيلا", "عنبر", "لمسات عطرية حارة"],
    short: "حضورٌ دافئ يلفت الانتباه.",
    description: "تركيبة مستوردة تجمع بين نفحات الفانيلا والعنبر ولمسات عطرية حارة. ثبات وفوحان يلفتان الانتباه.",
    occasion: "للمساء والأجواء الباردة",
    size: 100,
    price: 1000,
    image: "/perfumes/majestic.webp",
    light: "#D9A35B",
    glow: "#5A1A12",
  },
  {
    slug: "icon",
    name: "Icon",
    nameParts: ["I", "con"],
    gender: "men",
    notes: ["حمضيات منعشة", "زهر البرتقال", "فانيلا خفيفة"],
    short: "انتعاشٌ كلاسيكي لا يغيب.",
    description:
      "تركيبة مستوردة بلمسات منعشة وأنيقة، تمتزج فيها الحمضيات المنعشة مع زهر البرتقال والفانيلا الخفيفة، لتمنحك رائحة مميزة وكلاسيكية تدوم لساعات طويلة.",
    occasion: "للاستخدام اليومي وجميع المناسبات",
    size: 100,
    price: 900,
    image: "/perfumes/icon.webp",
    light: "#F0C98E",
    glow: "#7A3A1E",
  },
];

export const faqs = [
  { q: "ما حجم العبوة وسعرها؟", a: "كل عطر بحجم 100 مل. الأسعار من 900 إلى 1,200 جنيه حسب العطر." },
  { q: "كيف أطلب؟", a: "اختر عطرك والكمية واضغط «اطلب عبر واتساب»، تصلنا رسالة بطلبك ونتواصل معك لتأكيد العنوان." },
  { q: "كم يستغرق الشحن؟", a: `الشحن لجميع المحافظات خلال ${shipping.days}.` },
  { q: "متى يكون الشحن مجانيًا؟", a: `الشحن مجاني للطلبات فوق ${shipping.freeOver.toLocaleString("en-US")} جنيه.` },
  {
    q: "كيف يعمل برنامج النقاط؟",
    a: `تحصل على ${points.perBottle} نقطة مع كل عبوة، وعند ${points.redeem} نقطة تحصل على خصم ${points.discount} جنيه على طلبك القادم.`,
  },
];

export const genderLabel: Record<Gender, string> = { women: "نسائي", men: "رجالي" };

export function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} جنيه`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(p: Perfume, qty: number) {
  return [
    "مرحبًا مسك العدلي 🌹",
    `أرغب بطلب: ${p.name} (${genderLabel[p.gender]})`,
    `الكمية: ${qty}`,
    `الحجم: ${p.size} مل`,
    `السعر: ${formatPrice(p.price * qty)}`,
  ].join("\n");
}

export function getPerfume(slug: string) {
  return perfumes.find((p) => p.slug === slug);
}
