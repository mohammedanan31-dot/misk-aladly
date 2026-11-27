import { Hero } from "@/components/hero";
import { Collection } from "@/components/collection";
import { FragranceFinder } from "@/components/finder";
import { Experience, Faq, FinalCta, Loyalty, NamesRail, Packaging, Reviews, Story } from "@/components/sections";
import { brand, contact, perfumes } from "@/data/site";

const SITE = "https://misk-aladly.vercel.app";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: `${brand.nameAr} — ${brand.nameEn}`,
        url: SITE,
        logo: `${SITE}/brand/logo.webp`,
        email: contact.email,
        contactPoint: { "@type": "ContactPoint", telephone: `+${contact.whatsapp}`, contactType: "customer service", availableLanguage: "Arabic" },
      },
      {
        "@type": "ItemList",
        name: "مجموعة مسك العدلي",
        itemListElement: perfumes.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/perfume/${p.slug}`, name: p.name })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <NamesRail />
      <Collection />
      <FragranceFinder />
      <Experience />
      <Story />
      <Packaging />
      <Loyalty />
      <Reviews />
      <Faq />
      <FinalCta />
    </main>
  );
}
