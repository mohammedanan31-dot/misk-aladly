"use client";

import { bagTotals, points } from "@/data/site";
import { useBag } from "./bag";

/** Points the current bag would earn, measured against the redemption threshold. */
export function LoyaltyProgress() {
  const { lines, ready } = useBag();
  const earned = ready ? bagTotals(lines).points : 0;
  const pct = Math.min(100, (earned / points.redeem) * 100);
  return (
    <div className="mt-8" aria-live="polite">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-champagne/60">حقيبتك الحالية</span>
        <span className="font-latin text-lg text-gold-soft" dir="ltr">
          {earned} / {points.redeem}
        </span>
      </div>
      <div className="mt-3 h-px w-full bg-champagne/15">
        <div className="h-[2px] -translate-y-[0.5px] bg-gradient-to-l from-gold-soft to-gold transition-[width] duration-1000 ease-[var(--ease-silk)]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-sm text-champagne/55">
        {earned === 0
          ? `أضف عطرًا إلى حقيبتك لتبدأ بجمع النقاط.`
          : earned >= points.redeem
            ? `هذا الطلب يكفي لخصم ${points.discount} جنيه على طلبك القادم.`
            : `${points.redeem - earned} نقطة تفصلك عن خصم ${points.discount} جنيه.`}
      </p>
    </div>
  );
}
