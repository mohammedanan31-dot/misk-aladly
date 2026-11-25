import Image from "next/image";
import Link from "next/link";
import { brand, contact, perfumes, whatsappLink } from "@/data/site";

export function Footer() {
  return (
    <footer className="stone relative border-t border-gold/20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} className="h-24 w-auto" />
          <p className="mt-6 max-w-sm leading-8 text-champagne/70">{brand.intro}</p>
        </div>
        <div>
          <h3 className="font-display text-xl text-gold">العطور</h3>
          <ul className="mt-4 space-y-2 text-champagne/70">
            {perfumes.map((p) => (
              <li key={p.slug}>
                <Link href={`/perfume/${p.slug}`} className="font-latin text-lg hover:text-gold-soft">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl text-gold">تواصل مع المتجر</h3>
          <ul className="mt-4 space-y-3 text-champagne/70">
            <li>
              <a href={whatsappLink("مرحبًا مسك العدلي 🌹")} target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">
                واتساب <span dir="ltr">{contact.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-gold-soft">
                {contact.email}
              </a>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-gold-soft">
                الشحن والأسئلة الشائعة
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="gold-rule mx-auto max-w-7xl" />
      <p className="py-6 text-center text-xs text-champagne/40">© {new Date().getFullYear()} مسك العدلي · MISK ALADLY. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
