import Image from "next/image";
import Link from "next/link";
import { contact, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

const nav = [
  { href: "/#collection", label: "المجموعة" },
  { href: "/#points", label: "برنامج النقاط" },
  { href: "/#faq", label: "الأسئلة" },
  { href: "/#contact", label: "تواصل معنا" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-0 h-28 bg-gradient-to-b from-night/90 via-night/50 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" aria-label="مسك العدلي — الرئيسية" className="shrink-0">
          <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} priority className="h-12 w-auto sm:h-14" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-champagne/80 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-gold-soft">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            aria-label={`واتساب ${contact.whatsappDisplay}`}
          >
            <WhatsAppIcon className="size-4" />
            <span className="hidden sm:inline">واتساب</span>
          </a>
          <details className="relative md:hidden">
            <summary className="btn-ghost flex size-9 cursor-pointer items-center justify-center rounded-full" aria-label="القائمة">
              <span className="flex flex-col gap-1">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </summary>
            <div className="absolute end-0 top-12 w-48 rounded-2xl border border-gold/25 bg-espresso/95 p-2 shadow-2xl backdrop-blur">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 text-sm hover:bg-burgundy/40">
                  {n.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
