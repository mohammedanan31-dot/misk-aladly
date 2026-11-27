import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Lateef, Markazi_Text } from "next/font/google";
import { brand } from "@/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { FluidBackground } from "@/components/fluid-bg";
import { MistCursor } from "@/components/mist-cursor";
import "./globals.css";

// Free stand-ins close to the brand faces: Lateef ≈ Felfel (display), Markazi Text ≈ 29LT Zarid Serif (text)
const sans = Markazi_Text({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-text" });
const display = Lateef({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-headline" });
const latin = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-bodoni" });

export const metadata: Metadata = {
  metadataBase: new URL("https://misk-aladly.vercel.app"),
  title: {
    default: `${brand.nameAr} | ${brand.nameEn}`,
    template: `%s | ${brand.nameAr}`,
  },
  description: brand.intro,
  openGraph: {
    title: `${brand.nameAr} | ${brand.nameEn}`,
    description: brand.intro,
    locale: "ar_EG",
    type: "website",
    images: ["/brand/logo.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#4A0F24",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${sans.variable} ${display.variable} ${latin.variable}`}>
      <body>
        <FluidBackground />
        <MistCursor />
        <Nav />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
