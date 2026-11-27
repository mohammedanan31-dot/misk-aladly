import type { Metadata, Viewport } from "next";
import { Amiri, Bodoni_Moda, Markazi_Text } from "next/font/google";
import { brand } from "@/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { FluidBackground } from "@/components/fluid-bg";
import { MistCursor } from "@/components/mist-cursor";
import { BagProvider } from "@/components/bag";
import { Motion } from "@/components/motion";
import "./globals.css";

/*
 * Brand faces: Felfel Bold (Arabic headlines) and 29LT Zarid Serif (Arabic text) are commercial fonts
 * that are not in this repository. The CSS stacks in globals.css name them first, so they are used
 * wherever they are installed; everyone else gets the closest free faces below.
 * To ship them to all visitors, add the licensed .woff2 files to src/fonts/ and load them with next/font/local.
 */
const sans = Markazi_Text({ subsets: ["arabic", "latin"], weight: ["400", "500", "600"], variable: "--font-text", display: "swap" });
const display = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-headline", display: "swap" });
const latin = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });

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
  themeColor: "#240911",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${sans.variable} ${display.variable} ${latin.variable}`}>
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
