import type { Metadata } from "next";
import { Aref_Ruqaa, Tajawal } from "next/font/google";
import "./globals.css";

const sans = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500"], variable: "--font-sans" });
const ruqaa = Aref_Ruqaa({ subsets: ["arabic"], weight: ["700"], variable: "--font-ruqaa" });

export const metadata: Metadata = {
  title: "مسك العدلي | MISK ALADLY",
  description: "مسك العدلي — عطور فاخرة. قريباً.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${sans.variable} ${ruqaa.variable}`}>
      <body>{children}</body>
    </html>
  );
}
