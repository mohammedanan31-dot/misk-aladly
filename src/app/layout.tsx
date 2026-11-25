import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Tajawal } from "next/font/google";
import { brand } from "@/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

const sans = Tajawal({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });
const display = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });
const latin = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

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
  themeColor: "#14070C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${sans.variable} ${display.variable} ${latin.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
