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
  mood: string;
  /** شعار العطر من حملة مسك العدلي */
  tagline: string;
  /** الصورة الرئيسية للعطر (تصوير حقيقي) */
  photo: string;
  /** صور إضافية للمعرض في صفحة العطر */
  gallery: string[];
  /** أجواء العرض: ألوان الخلفية والإضاءة */
  theme: { from: string; to: string; glow: string; ink: "light" | "dark" };
  /**
   * الهرم العطري — يُعرض فقط عند توفر معلومات مؤكدة من المورّد.
   * النوتات الحالية غير مقسّمة إلى مقدمة/قلب/قاعدة، لذلك تُترك فارغة.
   */
  pyramid?: { top: string[]; heart: string[]; base: string[] };
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
    mood: "حلو · دافئ · جذّاب",
    light: "#E7B98A",
    glow: "#641d35",
    tagline: "دفء يلامس الحواس",
    photo: "/scenes/noir-gold.webp",
    gallery: ["/perfumes/photo-velvet-kiss.webp", "/scenes/sunset-dome.webp"],
    theme: { from: "#390E20", to: "#641D35", glow: "#8F2948", ink: "light" },
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
    mood: "ناعم · نظيف · أنيق",
    light: "#f3e5cc",
    glow: "#390e20",
    tagline: "طاقة جذّابة",
    photo: "/scenes/sunset-arch.webp",
    gallery: ["/perfumes/photo-adrenaline.webp"],
    theme: { from: "#FAF5ED", to: "#F3E5CC", glow: "#D4B17B", ink: "dark" },
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
    mood: "فخم · دافئ · غامض",
    light: "#D9A35B",
    glow: "#5A1A12",
    tagline: "فخامة ملكية",
    photo: "/scenes/hands.webp",
    gallery: ["/perfumes/photo-majestic.webp"],
    theme: { from: "#240911", to: "#390E20", glow: "#B8742F", ink: "light" },
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
    mood: "منعش · مشرق · كلاسيكي",
    light: "#F0C98E",
    glow: "#7A3A1E",
    tagline: "قوة الحضور",
    photo: "/scenes/icon-velvet.webp",
    gallery: ["/perfumes/photo-icon.webp"],
    theme: { from: "#2A1209", to: "#4A2614", glow: "#C5A46D", ink: "light" },
  },
];

/** آراء العملاء — تُعرض فقط عند إضافة آراء حقيقية موثّقة هنا. */
export type Review = { name: string; text: string; perfume?: string; city?: string };
export const reviews: Review[] = [];

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

/* ---------- Shopping bag ---------- */

export type BagLine = { slug: string; qty: number };
export type Customer = { name: string; phone: string; city: string; address: string; note: string };

export function bagTotals(lines: BagLine[]) {
  let count = 0;
  let subtotal = 0;
  for (const l of lines) {
    const p = getPerfume(l.slug);
    if (!p) continue;
    count += l.qty;
    subtotal += p.price * l.qty;
  }
  return { count, subtotal, points: count * points.perBottle, freeShipping: subtotal >= shipping.freeOver };
}

/** A structured WhatsApp order: items, quantities, unit and line prices, total, points, delivery details. */
export function bagMessage(lines: BagLine[], c: Customer) {
  const t = bagTotals(lines);
  const items = lines
    .map((l) => ({ l, p: getPerfume(l.slug) }))
    .filter((x): x is { l: BagLine; p: Perfume } => Boolean(x.p))
    .map(({ l, p }, i) => `${i + 1}. ${p.name} (${genderLabel[p.gender]}، ${p.size} مل)\n   ${l.qty} × ${formatPrice(p.price)} = ${formatPrice(p.price * l.qty)}`);
  const who = [
    c.name && `الاسم: ${c.name}`,
    c.phone && `الهاتف: ${c.phone}`,
    c.city && `المحافظة: ${c.city}`,
    c.address && `العنوان: ${c.address}`,
    c.note && `ملاحظات: ${c.note}`,
  ].filter(Boolean);
  const summary = [
    `عدد العبوات: ${t.count}`,
    `الإجمالي: ${formatPrice(t.subtotal)}`,
    t.freeShipping ? `الشحن: مجاني (الطلب فوق ${formatPrice(shipping.freeOver)})` : null,
    `نقاط مسك العدلي المستحقة: ${t.points} نقطة`,
  ].filter(Boolean);
  const blocks = [["مرحبًا مسك العدلي 🌹", "أرغب بإتمام هذا الطلب:"], items, summary, who.length ? ["بيانات التوصيل:", ...who] : []];
  return blocks
    .filter((b) => b.length)
    .map((b) => b.join("\n"))
    .join("\n\n");
}
