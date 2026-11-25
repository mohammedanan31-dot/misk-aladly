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
        <nav className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-champagne/10 bg-night/55 py-2 pe-2 ps-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:ps-6">
          <Link href="/" aria-label="مسك العدلي — الرئيسية" className="shrink-0" onClick={() => setOpen(false)}>
            <Image src="/brand/logo.webp" alt="مسك العدلي" width={491} height={439} priority className="h-10 w-auto sm:h-11" />
          </Link>

          <div className="hidden items-center gap-1 text-sm md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-champagne/75 transition-colors duration-500 ease-[var(--ease-silk)] hover:bg-champagne/5 hover:text-gold-soft"
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
              className="btn-gold group hidden items-center gap-2 rounded-full py-1.5 pe-1.5 ps-4 text-sm font-bold sm:flex"
            >
              اطلب الآن
              <span className="btn-icon flex size-8 items-center justify-center rounded-full bg-espresso/15">
                <WhatsAppIcon className="size-4" />
              </span>
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
        className={`fixed inset-0 z-40 bg-night/85 backdrop-blur-3xl transition-opacity duration-700 ease-[var(--ease-silk)] md:hidden ${
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
                className="rounded-full border border-gold/30 px-4 py-2 font-latin text-lg text-gold-soft"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <a
            href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link btn-gold mt-10 flex items-center justify-center gap-3 rounded-full py-4 font-bold"
            style={{ transitionDelay: open ? "500ms" : "0ms" }}
          >
            <WhatsAppIcon className="size-5" />
            اطلب عبر واتساب
          </a>
        </div>
      </div>
    </>
  );
}
