import Image from "next/image";
import { ViewTransition } from "react";
import type { Perfume } from "@/data/site";

/**
 * A generated still-life scene with the real bottle standing on its pedestal.
 * The bottle carries a shared view-transition name so it travels between pages.
 */
export function Stage({
  perfume,
  className = "",
  priority,
  sizes = "(min-width: 1024px) 45vw, 100vw",
  parallax = false,
  float = false,
  morph = true,
}: {
  perfume: Perfume;
  className?: string;
  priority?: boolean;
  sizes?: string;
  parallax?: boolean;
  float?: boolean;
  morph?: boolean;
}) {
  const { stage } = perfume;
  const bottle = (
    <Image
      src={perfume.image}
      alt={perfume.name}
      width={420}
      height={960}
      priority={priority}
      sizes="(min-width: 1024px) 20vw, 45vw"
      className={`stage-bottle ${float ? "float" : ""}`}
      style={{ left: `${stage.x}%`, bottom: `${100 - stage.top - 1}%`, height: `${stage.h}%` }}
    />
  );

  return (
    <div className={`stage ${className}`}>
      <Image
        src={perfume.scene}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className={`stage-bg ${parallax ? "parallax" : ""}`}
      />
      <span
        className="stage-shadow"
        style={{ left: `${stage.x}%`, top: `${stage.top}%`, width: `${stage.h * 0.55}%`, height: "3.5%" }}
        aria-hidden="true"
      />
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
