import Image from "next/image";
import { ViewTransition, type CSSProperties } from "react";
import type { Perfume } from "@/data/site";

/**
 * The real bottle under a soft spotlight, standing on a glossy crimson floor with its reflection.
 * Pure CSS lighting tinted by each perfume's colours — no generated scenery.
 * The bottle carries a shared view-transition name so it travels between pages.
 */
export function Stage({
  perfume,
  className = "",
  priority,
  float = false,
  morph = true,
}: {
  perfume: Perfume;
  className?: string;
  priority?: boolean;
  float?: boolean;
  morph?: boolean;
}) {
  const bottle = (
    <Image
      src={perfume.image}
      alt={perfume.name}
      width={420}
      height={960}
      priority={priority}
      sizes="(min-width: 1024px) 14vw, 30vw"
      className={`stage-bottle ${float ? "float" : ""}`}
    />
  );

  return (
    <div className={`stage ${className}`} style={{ "--glow": perfume.glow, "--light": perfume.light } as CSSProperties}>
      <span className="stage-beam" aria-hidden="true" />
      <span className="stage-floor" aria-hidden="true" />
      <Image src={perfume.image} alt="" aria-hidden="true" width={420} height={960} sizes="(min-width: 1024px) 14vw, 30vw" className="stage-reflection" />
      {morph ? (
        <ViewTransition name={`bottle-${perfume.slug}`} share="bottle-morph" default="none">
          {bottle}
        </ViewTransition>
      ) : (
        bottle
      )}
    </div>
  );
}
