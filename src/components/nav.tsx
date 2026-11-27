"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { perfumes, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";
import { BagButton } from "./bag";

/** Header from the approved design: spaced wordmark, glowing tabs, round menu button. */
const tabs = [
  { href: "/#story", id: "story", label: "About", ar: "حكايتنا" },
  { href: "/#collection", id: "collection", label: "Shop", ar: "المجموعة" },
  { href: "/#finder", id: "finder", label: "Product", ar: "اعثر على عطرك" },
  { href: "/#contact", id: "contact", label: "Contact", ar: "تواصل معنا" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [current, setCurrent] = useState("story");
  const pathname = usePathname();
  const home = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setSolid(scrollY > 30);
      if (!home) return setCurrent("collection");
      let cur = "story";
      for (const t of tabs) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.45) cur = t.id;
      }
      if (scrollY < innerHeight * 0.5) cur = "story";
      setCurrent(cur);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const docked = !solid && home && !open; // sits on the hero card

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-700 ease-[var(--ease-silk)] ${
          docked ? "border-b border-transparent px-[3vw] pt-4 sm:pt-6" : "border-b border-[rgba(255,70,60,0.25)] bg-[#1f0303]/85 px-[3vw] backdrop-blur-xl"
        }`}
      >
        <nav dir="ltr" className={`mx-auto flex w-full max-w-[1360px] items-center justify-between gap-4 px-5 transition-[height] duration-700 sm:px-10 lg:px-[4%] ${docked ? "h-20 sm:h-24" : "h-16"}`} aria-label="الرئيسية">
          <Link href="/" aria-label="مسك العدلي — الرئيسية" className="font-latin text-sm font-medium tracking-[0.42em] text-white sm:text-lg sm:tracking-[0.5em]">
            MISK ALADLY
          </Link>

          <ul className="hidden items-center gap-6 lg:flex">
            {tabs.map((t) => (
              <li key={t.id}>
                <Link href={t.href} className="nav-tab" aria-current={current === t.id ? "true" : undefined} title={t.ar}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <BagButton className="rounded-full border border-white/70" />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              className="relative flex size-11 items-center justify-center rounded-full border border-white/70 transition-colors hover:border-[#ff3b35] sm:size-12"
            >
              <span className={`absolute h-[1.5px] w-4 bg-white transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-[1.5px] w-4 bg-white transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        className={`fixed inset-0 z-40 bg-[#1f0303] transition-[opacity,clip-path] duration-[900ms] ease-[var(--ease-out-expo)] ${
          open ? "menu-open opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_75%_25%,rgba(255,60,30,0.25),transparent_70%),radial-gradient(40%_40%_at_15%_85%,rgba(227,20,28,0.2),transparent_70%)]" />
        <div className="relative mx-auto flex h-full max-w-[1360px] flex-col px-8 pb-10 pt-28 sm:px-16 lg:flex-row lg:items-center lg:gap-24">
          <ul className="space-y-1">
            {tabs.map((t, i) => (
              <li key={t.id} className="menu-link" style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}>
                <Link href={t.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-4 py-2 text-[2.6rem] font-bold leading-[1.45] text-white sm:text-6xl">
                  <span className="font-latin text-sm text-[#ff5a4a]" dir="ltr">
                    0{i + 1}
                  </span>
                  <span className="transition-colors group-hover:text-[#ff6a55]">{t.ar}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 lg:mt-0">
            <div className="menu-link border-t border-[rgba(255,70,60,0.3)] pt-6" style={{ transitionDelay: open ? "440ms" : "0ms" }}>
              <p className="kicker">The Collection</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {perfumes.map((p) => (
                  <Link key={p.slug} href={`/perfume/${p.slug}`} onClick={() => setOpen(false)} className="pill">
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
            <a
              href={whatsappLink("مرحبًا مسك العدلي، عندي استفسار 🌹")}
              target="_blank"
              rel="noopener noreferrer"
              className="menu-link btn-primary mt-8 w-full"
              style={{ transitionDelay: open ? "520ms" : "0ms" }}
            >
              <WhatsAppIcon className="size-5" />
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
