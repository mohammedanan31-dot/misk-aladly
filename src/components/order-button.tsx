import { orderMessage, whatsappLink, type Perfume } from "@/data/site";
import { WhatsAppIcon } from "./icons";

/** Gold pill with the WhatsApp mark nested in its own circle. */
export function OrderButton({ perfume, label = "اطلب عبر واتساب", className = "" }: { perfume: Perfume; label?: string; className?: string }) {
  return (
    <a
      href={whatsappLink(orderMessage(perfume, 1))}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-gold px-6 py-3 ${className}`}
    >
      {label}
      <WhatsAppIcon className="size-5" />
    </a>
  );
}
