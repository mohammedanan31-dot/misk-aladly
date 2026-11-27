import type { Metadata, Viewport } from "next";
import { Amiri, Bodoni_Moda, IBM_Plex_Sans_Arabic } from "next/font/google";
import { brand } from "@/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { FluidBackground } from "@/components/fluid-bg";
import { MistCursor } from "@/components/mist-cursor";
import "./globals.css";

// Amiri: classic naskh for headlines; IBM Plex Sans Arabic: clean modern text; Bodoni Moda: couture serif for Latin names
const sans = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600"], variable: "--font-text" });
const display = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-headline" });
const latin = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-cormorant" });

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
  themeColor: "#160204",
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
