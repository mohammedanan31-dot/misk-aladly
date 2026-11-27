import type { BottleSpec } from "@/lib/bottle-scene";

/** How each flacon is built in 3D: shape, perfume colour, metal and cap. */
export const BOTTLES: Record<string, BottleSpec> = {
  "velvet-kiss": { slug: "velvet-kiss", shape: "round", liquid: "#e9bf55", metal: "gold" },
  adrenaline: { slug: "adrenaline", shape: "square", liquid: "#e3a21f", metal: "gold", capTop: "#0d0a0a" },
  majestic: { slug: "majestic", shape: "square", liquid: "#d9922f", metal: "silver", capTop: "#efe2cc" },
  icon: { slug: "icon", shape: "round", liquid: "#e8792a", metal: "silver" },
};
