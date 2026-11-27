"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat() {
  const onProduct = usePathname()?.startsWith("/perfume/");
  return (
    <a
      href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className={`btn-primary magnetic fixed bottom-5 left-5 z-30 !min-h-0 size-14 !rounded-full !p-0 ${onProduct ? "hidden lg:inline-flex" : ""}`}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
