import type { CSSProperties } from "react";

/**
 * Splits text into words that rise, unblur and settle one after another when scrolled into view
 * (the `.split` class is picked up by the Motion observer). `start` continues the stagger across parts.
 */
export function Words({ text, className = "", wordClass = "", start = 0 }: { text: string; className?: string; wordClass?: string; start?: number }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <span className={`split ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className={`w ${wordClass}`} style={{ "--i": start + i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
