import { orderMessage, whatsappLink, type Perfume } from "@/data/site";
import { WhatsAppIcon } from "./icons";

/** Gold pill with the WhatsApp mark nested in its own circle. */
export function OrderButton({ perfume, label = "اطلب عبر واتساب", className = "" }: { perfume: Perfume; label?: string; className?: string }) {
  return (
    <a
      href={whatsappLink(orderMessage(perfume, 1))}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-gold group inline-flex items-center gap-3 rounded-full py-2 pe-2 ps-6 font-bold ${className}`}
    >
      {label}
      <span className="btn-icon flex size-10 items-center justify-center rounded-full bg-espresso/15">
        <WhatsAppIcon className="size-5" />
      </span>
    </a>
  );
}
