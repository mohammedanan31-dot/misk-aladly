"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { orderMessage, points, whatsappLink, type Perfume } from "@/data/site";
import { WhatsAppIcon } from "./icons";
import { Price } from "./price";
import { AddToBag, Qty } from "./bag";

/** Quantity, add to bag, direct WhatsApp order — plus a sticky bar on phones while this panel is off screen. */
export function Purchase({ perfume }: { perfume: Perfume }) {
  const [qty, setQty] = useState(1);
  const [inView, setInView] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={ref} className="glass p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-coral">السعر · <span className="text-rose">{perfume.size} مل</span></p>
            <p className="mt-1"><Price value={perfume.price} className="text-4xl sm:text-5xl" /></p>
          </div>
          <Qty value={qty} onChange={(q) => setQty(Math.max(1, q))} label={perfume.name} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <AddToBag slug={perfume.slug} qty={qty} />
          <a href={whatsappLink(orderMessage(perfume, qty))} target="_blank" rel="noopener noreferrer" className="btn-ghost magnetic">
            <WhatsAppIcon className="size-5" />
            اطلب مباشرة
          </a>
        </div>
        <p className="mt-5 text-center text-sm text-champagne/55">
          تحصل على <span className="text-gold-soft">{points.perBottle * qty} نقطة</span> مع هذا الطلب · كل {points.redeem} نقطة = خصم {points.discount} جنيه
        </p>
      </div>

      {/* sticky purchase bar — phones only, only while the panel above is out of view.
          Portalled to <body> so animated (transformed) ancestors cannot trap it. */}
      {mounted &&
        createPortal(
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-burgundy/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-silk)] lg:hidden ${
          inView ? "translate-y-full" : "translate-y-0"
        }`}
        aria-hidden={inView}
        inert={inView}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-latin text-base uppercase tracking-[0.1em]" dir="ltr" style={{ textAlign: "right" }}>
              {perfume.name}
            </p>
            <Price value={perfume.price} className="text-lg" />
          </div>
          <AddToBag slug={perfume.slug} label="أضف للحقيبة" className="!min-h-12 !px-5" />
        </div>
      </div>,
          document.body,
        )}
    </>
  );
}
