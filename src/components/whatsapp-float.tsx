"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

/** Floating WhatsApp button; waits until the hero has scrolled away so it never covers its price. */
export function WhatsAppFloat() {
  const onProduct = usePathname()?.startsWith("/perfume/");
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(scrollY > innerHeight * 0.8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className={`btn-primary icon-3d fixed bottom-5 left-5 z-30 !min-h-0 size-14 !rounded-full !p-0 transition-[opacity,transform] duration-500 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      } ${onProduct ? "hidden lg:inline-flex" : ""}`}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
