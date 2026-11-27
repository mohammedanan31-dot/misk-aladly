import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Montserrat } from "next/font/google";
import { brand } from "@/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { FluidBackground } from "@/components/fluid-bg";
import { MistCursor } from "@/components/mist-cursor";
import { BagProvider } from "@/components/bag";
import { Motion } from "@/components/motion";
import "./globals.css";

// Clean geometric pairing from the approved design: Montserrat for Latin, IBM Plex Sans Arabic for Arabic.
const sans = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-text", display: "swap" });
const latin = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://misk-aladly.vercel.app"),
  title: {
    default: `${brand.nameAr} | ${brand.nameEn}`,
    template: `%s | ${brand.nameAr}`,
  },
  description: brand.intro,
  twitter: { card: "summary_large_image" },
  openGraph: {
    title: `${brand.nameAr} | ${brand.nameEn}`,
    description: brand.intro,
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/scenes/hero-four.webp", width: 1672, height: 940, alt: "عطور مسك العدلي الأربعة" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1f0303",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${sans.variable} ${latin.variable}`}>
      <body>
        <BagProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[90] focus:bg-gold focus:px-4 focus:py-2 focus:text-espresso">
            تخطَّ إلى المحتوى
          </a>
          <FluidBackground />
          <MistCursor />
          <Motion />
          <Nav />
          <div id="main">{children}</div>
          <Footer />
          <WhatsAppFloat />
        </BagProvider>
      </body>
    </html>
  );
}
