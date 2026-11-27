"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { perfumes, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

const links = [
  { href: "/#collection", label: "المجموعة" },
  { href: "/#story", label: "حكايتنا" },
  { href: "/#points", label: "برنامج النقاط" },
  { href: "/#faq", label: "الأسئلة" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-4 sm:pt-6">
        <nav className="flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-gold/30 bg-ink/90 py-2 pe-2 ps-4 shadow-[0_20px_50px_-30px_rgba(20,4,10,0.9)] sm:ps-6">
          <Link href="/" aria-label="مسك العدلي، الرئيسية" className="shrink-0" onClick={() => setOpen(false)}>
            <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} priority className="h-10 w-auto sm:h-11" />
          </Link>

          <div className="hidden items-center gap-1 text-sm md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-base text-champagne/80 transition-colors duration-500 hover:text-gold-soft"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold hidden px-5 py-2.5 text-sm sm:inline-flex"
            >
              تواصل عبر واتساب
              <WhatsAppIcon className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              className="relative flex size-11 items-center justify-center rounded-full border border-champagne/15 bg-champagne/5 md:hidden"
            >
              <span
                className={`absolute h-px w-5 bg-champagne transition-transform duration-700 ease-[var(--ease-silk)] ${open ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                className={`absolute h-px w-5 bg-champagne transition-transform duration-700 ease-[var(--ease-silk)] ${open ? "-rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink transition-opacity duration-700 ease-[var(--ease-silk)] md:hidden ${
          open ? "menu-open opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-8 pt-20">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="menu-link font-display text-5xl leading-[1.6] text-champagne"
              style={{ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="menu-link mt-8 flex flex-wrap gap-2" style={{ transitionDelay: open ? "420ms" : "0ms" }}>
            {perfumes.map((p) => (
              <Link
                key={p.slug}
                href={`/perfume/${p.slug}`}
                onClick={() => setOpen(false)}
                className="name rounded-full border border-gold/40 px-4 py-2 text-xl text-gold-soft"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <a
            href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link btn-gold mt-10 justify-center py-4"
            style={{ transitionDelay: open ? "500ms" : "0ms" }}
          >
            تواصل عبر واتساب
            <WhatsAppIcon className="size-5" />
          </a>
        </div>
      </div>
    </>
  );
}
