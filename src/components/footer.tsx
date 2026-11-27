import Image from "next/image";
import Link from "next/link";
import { contact, perfumes, whatsappLink } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative bg-ink text-champagne">
      <div className="ribbon" />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} className="h-28 w-auto" />
        </div>
        <nav className="lg:col-span-4" aria-label="العطور">
          <ul className="space-y-1">
            {perfumes.map((p) => (
              <li key={p.slug}>
                <Link href={`/perfume/${p.slug}`} className="name text-4xl leading-[1.25] transition-colors hover:text-gold-soft" dir="ltr">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 text-champagne/75 lg:col-span-3">
          <a href={whatsappLink("مرحبًا مسك العدلي")} target="_blank" rel="noopener noreferrer" className="block hover:text-gold-soft">
            واتساب <span dir="ltr">{contact.whatsappDisplay}</span>
          </a>
          <a href={`mailto:${contact.email}`} className="block hover:text-gold-soft">
            {contact.email}
          </a>
          <Link href="/#faq" className="block hover:text-gold-soft">
            الشحن والأسئلة
          </Link>
        </div>
      </div>
      <p className="mx-auto max-w-7xl px-5 pb-10 text-sm text-champagne/40 sm:px-10">© {new Date().getFullYear()} مسك العدلي</p>
    </footer>
  );
}
