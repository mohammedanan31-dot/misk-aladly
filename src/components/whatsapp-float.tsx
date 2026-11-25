import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="btn-gold fixed bottom-5 left-5 z-30 flex size-14 items-center justify-center rounded-full"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
