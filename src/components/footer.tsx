import Image from "next/image";
import Link from "next/link";
import { contact, perfumes, points, shipping, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-night">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} className="logo-3d h-24 w-auto" />
          <p className="mt-6 max-w-xs leading-8 text-champagne/65">أربعة عطور، ولكل عطر حضوره. اكتشف توقيعك مع مسك العدلي.</p>
        </div>

        <nav aria-label="روابط الموقع">
          <h3 className="kicker"><b>Explore</b></h3>
          <ul className="mt-5 space-y-3 text-champagne/75">
            <li><Link href="/#collection" className="link-line hover:text-gold-soft">المجموعة</Link></li>
            <li><Link href="/#finder" className="link-line hover:text-gold-soft">اعثر على عطرك</Link></li>
            <li><Link href="/#story" className="link-line hover:text-gold-soft">حكايتنا</Link></li>
            <li><Link href="/#loyalty" className="link-line hover:text-gold-soft">برنامج النقاط</Link></li>
            <li><Link href="/#faq" className="link-line hover:text-gold-soft">الأسئلة الشائعة</Link></li>
          </ul>
        </nav>

        <nav aria-label="العطور">
          <h3 className="kicker"><b>Perfumes</b></h3>
          <ul className="mt-5 space-y-3">
            {perfumes.map((p) => (
              <li key={p.slug}>
                <Link href={`/perfume/${p.slug}`} className="link-line font-latin text-lg font-semibold uppercase tracking-[0.1em] text-champagne/80 hover:text-white" dir="ltr">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="kicker"><b>Contact</b></h3>
          <ul className="mt-5 space-y-3 text-champagne/75">
            <li>
              <a href={whatsappLink("مرحبًا مسك العدلي 🌹")} target="_blank" rel="noopener noreferrer" className="group link-line inline-flex items-center gap-2 hover:text-white">
                <span className="icon-3d inline-flex size-8 items-center justify-center rounded-full border border-[rgba(255,90,60,0.5)] text-coral"><WhatsAppIcon className="size-4" /></span> واتساب <span dir="ltr">{contact.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="link-line hover:text-gold-soft">
                {contact.email}
              </a>
            </li>
          </ul>
          <h3 className="kicker mt-8"><b>Policies</b></h3>
          <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 text-champagne/60">
            <li>الشحن لجميع المحافظات خلال {shipping.days}</li>
            <li>شحن مجاني للطلبات فوق {shipping.freeOver.toLocaleString("en-US")} جنيه</li>
            <li>
              {points.perBottle} نقطة مع كل عبوة · {points.redeem} نقطة = خصم {points.discount} جنيه
            </li>
          </ul>
        </div>
      </div>
      <div className="gold-rule mx-auto max-w-7xl" />
      <p className="px-5 py-6 text-center text-sm text-champagne/40">© {new Date().getFullYear()} مسك العدلي · MISK ALADLY. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
