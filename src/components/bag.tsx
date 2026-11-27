"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  bagMessage,
  bagTotals,
  formatPrice,
  genderLabel,
  getPerfume,
  points,
  shipping,
  whatsappLink,
  type BagLine,
  type Customer,
} from "@/data/site";
import { Price } from "./price";
import { WhatsAppIcon } from "./icons";

type Bag = {
  lines: BagLine[];
  open: boolean;
  ready: boolean;
  setOpen: (o: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const BagContext = createContext<Bag | null>(null);
const KEY = "misk-bag-v1";
const CUSTOMER_KEY = "misk-customer-v1";
const MAX = 20;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be unavailable (private mode); the bag still works for this visit */
  }
}

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // hydrate after mount so server and client markup match
  useEffect(() => {
    const saved = read<BagLine[]>(KEY, []).filter((l) => getPerfume(l.slug) && l.qty > 0);
    setLines(saved);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) write(KEY, lines);
  }, [lines, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.slug === slug);
      if (hit) return ls.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX, l.qty + qty) } : l));
      return [...ls, { slug, qty: Math.min(MAX, qty) }];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.slug !== slug) : ls.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX, qty) } : l))));
  }, []);
  const remove = useCallback((slug: string) => setLines((ls) => ls.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => ({ lines, open, ready, setOpen, add, setQty, remove, clear }), [lines, open, ready, add, setQty, remove, clear]);
  return (
    <BagContext.Provider value={value}>
      {children}
      <BagDrawer />
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside <BagProvider>");
  return ctx;
}

/* ---------- Buttons ---------- */

export function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

export function BagButton({ className = "" }: { className?: string }) {
  const { lines, setOpen, ready } = useBag();
  const count = bagTotals(lines).count;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`icon-3d relative flex size-11 items-center justify-center text-champagne hover:text-white ${className}`}
      aria-label={`حقيبة التسوق${count ? `، ${count} عبوة` : ""}`}
    >
      <BagIcon className="size-6" />
      <span
        className={`absolute -top-0.5 end-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 font-latin text-[11px] leading-none text-espresso transition-transform duration-500 ${
          ready && count ? "scale-100" : "scale-0"
        }`}
        aria-hidden="true"
      >
        {count}
      </span>
    </button>
  );
}

export function AddToBag({ slug, qty = 1, className = "", label = "أضف إلى الحقيبة" }: { slug: string; qty?: number; className?: string; label?: string }) {
  const { add } = useBag();
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <button
      type="button"
      onClick={() => {
        add(slug, qty);
        setDone(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setDone(false), 1600);
      }}
      className={`btn-primary magnetic ${className}`}
    >
      <BagIcon className="size-[18px]" />
      <span aria-live="polite">{done ? "أُضيف إلى الحقيبة" : label}</span>
    </button>
  );
}

/* ---------- Drawer ---------- */

const emptyCustomer: Customer = { name: "", phone: "", city: "", address: "", note: "" };

function BagDrawer() {
  const { lines, open, setOpen, setQty, remove } = useBag();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const panel = useRef<HTMLDivElement>(null);
  const t = bagTotals(lines);

  useEffect(() => setCustomer({ ...emptyCustomer, ...read<Partial<Customer>>(CUSTOMER_KEY, {}) }), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("bag-open");
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,[tabindex="0"]');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("bag-open");
      prev?.focus?.();
    };
  }, [open, setOpen]);

  const field = (k: keyof Customer) => ({
    value: customer[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...customer, [k]: e.target.value };
      setCustomer(next);
      write(CUSTOMER_KEY, next);
    },
  });
  const remaining = Math.max(0, shipping.freeOver - t.subtotal);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-espresso/70 backdrop-blur-sm transition-opacity duration-700 ease-[var(--ease-silk)] ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="حقيبة التسوق"
        tabIndex={-1}
        data-lenis-prevent
        inert={!open}
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-gold/20 bg-espresso shadow-[0_0_80px_rgba(0,0,0,0.6)] outline-none transition-transform duration-700 ease-[var(--ease-silk)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
          <div>
            <p className="font-latin text-[11px] uppercase tracking-[0.4em] text-coral"><b className="font-bold text-white">Your</b> <span className="font-light">Bag</span></p>
            <h2 className="mt-1 font-display text-2xl font-bold">حقيبة التسوق</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="flex size-11 items-center justify-center border border-champagne/15 text-xl text-champagne/80 transition-colors hover:border-gold/50 hover:text-gold-soft" aria-label="إغلاق الحقيبة">
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <BagIcon className="size-12 text-gold/60" />
            <p className="font-display text-2xl">حقيبتك فارغة</p>
            <p className="text-champagne/60">اختر عطرك من المجموعة وأضفه هنا، ثم أتمم الطلب عبر واتساب.</p>
            <Link href="/#collection" onClick={() => setOpen(false)} className="btn-ghost">
              تصفّح المجموعة
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-6">
              <ul className="divide-y divide-gold/10">
                {lines.map((l) => {
                  const p = getPerfume(l.slug)!;
                  return (
                    <li key={l.slug} className="flex gap-4 py-5">
                      <Link href={`/perfume/${p.slug}`} onClick={() => setOpen(false)} className="relative h-28 w-20 shrink-0 overflow-hidden bg-burgundy/40">
                        <Image src={p.scene} alt={p.name} fill sizes="80px" className="object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-latin text-lg font-bold uppercase tracking-[0.08em]" dir="ltr" style={{ textAlign: "right" }}>
                              {p.name}
                            </p>
                            <p className="text-sm text-rose">
                              {genderLabel[p.gender]} · {p.size} مل
                            </p>
                          </div>
                          <button type="button" onClick={() => remove(p.slug)} className="text-xs text-champagne/50 underline-offset-4 hover:text-gold-soft hover:underline">
                            إزالة
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <Qty value={l.qty} onChange={(q) => setQty(p.slug, q)} label={p.name} />
                          <Price value={p.price * l.qty} className="text-lg" />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <fieldset className="mt-2 space-y-3 border-t border-gold/15 pb-6 pt-6">
                <legend className="mb-3 text-sm text-champagne/70">بيانات التوصيل (اختياري — تُرسل مع الطلب)</legend>
                <div className="grid grid-cols-2 gap-3">
                  <input className="field" placeholder="الاسم" autoComplete="name" {...field("name")} aria-label="الاسم" />
                  <input className="field" placeholder="رقم الهاتف" inputMode="tel" autoComplete="tel" {...field("phone")} aria-label="رقم الهاتف" />
                </div>
                <input className="field" placeholder="المحافظة" autoComplete="address-level1" {...field("city")} aria-label="المحافظة" />
                <input className="field" placeholder="العنوان بالتفصيل" autoComplete="street-address" {...field("address")} aria-label="العنوان" />
                <textarea className="field min-h-20 resize-none" placeholder="ملاحظات (مثلاً: تغليف هدية)" {...field("note")} aria-label="ملاحظات" />
              </fieldset>
            </div>

            <footer className="border-t border-gold/15 bg-night/60 px-6 pb-6 pt-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-champagne/60">المجموع ({t.count} عبوة)</dt>
                  <dd><Price value={t.subtotal} className="text-2xl" /></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-champagne/60">نقاط مسك العدلي</dt>
                  <dd className="font-bold text-coral">+{t.points} نقطة</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-champagne/60">الشحن</dt>
                  <dd className="text-end text-champagne/85">
                    {t.freeShipping ? "مجاني لهذا الطلب" : `يُحدد عند التأكيد · ${shipping.days}`}
                  </dd>
                </div>
              </dl>
              {!t.freeShipping && (
                <div className="mt-4">
                  <div className="h-px w-full bg-gold/15">
                    <div className="h-px bg-gold transition-[width] duration-700" style={{ width: `${Math.min(100, (t.subtotal / shipping.freeOver) * 100)}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-champagne/55">أضف {formatPrice(remaining)} لتحصل على شحن مجاني.</p>
                </div>
              )}
              <a
                href={whatsappLink(bagMessage(lines, customer))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 w-full justify-center"
              >
                <WhatsAppIcon className="size-5" />
                أتمم الطلب عبر واتساب
              </a>
              <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full py-2 text-sm text-champagne/60 hover:text-gold-soft">
                متابعة التسوق
              </button>
              <p className="mt-1 text-center text-[11px] text-champagne/40">
                كل {points.redeem} نقطة = خصم {points.discount} جنيه على طلبك القادم
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export function Qty({ value, onChange, label, tone = "light" }: { value: number; onChange: (q: number) => void; label: string; tone?: "light" | "dark" }) {
  const c = tone === "dark" ? "border-espresso/25 text-espresso" : "border-gold/30 text-champagne";
  return (
    <div className={`inline-flex items-center border ${c}`} role="group" aria-label={`كمية ${label}`}>
      <button type="button" onClick={() => onChange(Math.min(MAX, value + 1))} disabled={value >= MAX} className="flex size-9 items-center justify-center text-lg hover:text-gold disabled:opacity-30" aria-label="زيادة الكمية">
        +
      </button>
      <span className="w-8 text-center font-latin tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(value - 1)} className="flex size-9 items-center justify-center text-lg hover:text-gold" aria-label={value === 1 ? "إزالة" : "إنقاص الكمية"}>
        −
      </button>
    </div>
  );
}
