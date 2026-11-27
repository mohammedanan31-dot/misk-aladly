"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { perfumes, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";
import { BagButton } from "./bag";

const links = [
  { href: "/#collection", label: "المجموعة" },
  { href: "/#finder", label: "اعثر على عطرك" },
  { href: "/#story", label: "حكايتنا" },
  { href: "/#loyalty", label: "النقاط" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const filled = solid || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-silk)] ${
          filled ? "border-b border-gold/15 bg-burgundy/92 backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-espresso/70 to-transparent"
        }`}
      >
        <nav className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 transition-[height] duration-700 sm:px-10 ${solid ? "h-16" : "h-20"}`} aria-label="الرئيسية">
          {/* start (right in RTL): menu on phones, links on desktop */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              className="relative flex size-11 items-center justify-center lg:hidden"
            >
              <span className={`absolute h-px w-6 bg-champagne transition-transform duration-700 ease-[var(--ease-silk)] ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-6 bg-champagne transition-transform duration-700 ease-[var(--ease-silk)] ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
            <ul className="hidden items-center gap-8 text-[1.05rem] lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-line text-champagne/85 transition-colors duration-500 hover:text-gold-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* centre: the peacock */}
          <Link href="/" aria-label="مسك العدلي — الرئيسية" className="justify-self-center">
            <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} priority className={`w-auto transition-[height] duration-700 ${solid ? "h-11" : "h-14"}`} />
          </Link>

          {/* end (left in RTL): order + bag */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <a
              href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line hidden items-center gap-2 text-champagne/85 transition-colors hover:text-gold-soft md:inline-flex"
            >
              <WhatsAppIcon className="size-4" />
              تواصل معنا
            </a>
            <BagButton />
          </div>
        </nav>
      </header>

      {/* Full-screen menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-burgundy transition-[opacity,clip-path] duration-[900ms] ease-[var(--ease-out-expo)] lg:hidden ${
          open ? "menu-open opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(197,164,109,0.16),transparent_70%)]" />
        <div className="relative flex h-full flex-col px-8 pb-10 pt-28">
          <ul className="space-y-1">
            {links.map((l, i) => (
              <li key={l.href} className="menu-link" style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-2 font-display text-[2.6rem] font-bold leading-[1.5] text-champagne">
                  <span className="font-latin text-sm text-gold/70" dir="ltr">
                    0{i + 1}
                  </span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-link mt-8 border-t border-gold/20 pt-6" style={{ transitionDelay: open ? "440ms" : "0ms" }}>
            <p className="kicker">The Collection</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {perfumes.map((p) => (
                <Link key={p.slug} href={`/perfume/${p.slug}`} onClick={() => setOpen(false)} className="font-latin text-lg uppercase tracking-[0.12em] text-gold-soft" dir="ltr" style={{ textAlign: "right" }}>
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
          <a
            href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link btn-primary mt-auto w-full"
            style={{ transitionDelay: open ? "520ms" : "0ms" }}
          >
            <WhatsAppIcon className="size-5" />
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </>
  );
}
