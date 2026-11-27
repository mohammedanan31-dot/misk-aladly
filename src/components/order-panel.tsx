"use client";

import { useState } from "react";
import { formatPrice, orderMessage, points, whatsappLink, type Perfume } from "@/data/site";
import { WhatsAppIcon } from "./icons";

export function OrderPanel({ perfume }: { perfume: Perfume }) {
  const [qty, setQty] = useState(1);
  const total = perfume.price * qty;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-champagne/60">الكمية</span>
        <div className="flex items-center rounded-full border border-gold/35">
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="flex size-10 items-center justify-center text-lg text-gold-soft hover:text-champagne"
            aria-label="زيادة الكمية"
          >
            +
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex size-10 items-center justify-center text-lg text-gold-soft hover:text-champagne disabled:opacity-30"
            disabled={qty === 1}
            aria-label="إنقاص الكمية"
          >
            −
          </button>
        </div>
        <span className="ms-auto text-sm text-champagne/60">
          المجموع <span className="ms-1 text-lg text-gold-soft">{formatPrice(total)}</span>
        </span>
      </div>

      <a
        href={whatsappLink(orderMessage(perfume, qty))}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold w-full justify-center px-8 py-4 text-lg"
      >
        اطلب عبر واتساب
        <WhatsAppIcon className="size-5" />
      </a>

      <p className="text-center text-xs text-champagne/50">
        تحصل على <span className="text-gold-soft">{points.perBottle * qty} نقطة</span> مع هذا الطلب
      </p>
    </div>
  );
}
