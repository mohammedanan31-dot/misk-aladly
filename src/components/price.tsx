/** Prices in their own warm-gold colour: bold figures, the currency small and quiet beside them. */
export function Price({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`price ${className}`} dir="rtl">
      <span className="price-num">{value.toLocaleString("en-US")}</span> <span className="price-cur">جنيه</span>
    </span>
  );
}
