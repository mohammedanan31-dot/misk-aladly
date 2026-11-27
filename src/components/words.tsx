import type { CSSProperties } from "react";
import { kashidaWord } from "@/lib/kashida";

/**
 * Splits text into words that rise in 3D, unblur and settle one after another when scrolled into view
 * (the `.split` class is picked up by the Motion observer). Long Arabic words get a kashida.
 * `start` continues the stagger across parts.
 */
export function Words({
  text,
  className = "",
  wordClass = "",
  start = 0,
  stretch = true,
}: {
  text: string;
  className?: string;
  wordClass?: string;
  start?: number;
  stretch?: boolean;
}) {
  const words = text.split(" ").filter(Boolean);
  return (
    <span className={`split ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className={`w ${wordClass}`} style={{ "--i": start + i } as CSSProperties}>
            {stretch ? kashidaWord(w) : w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
