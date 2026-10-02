/**
 * AI-First Semantic SEO & Machine-Discoverable Schema.org Graph Generator
 * 
 * Provides structured JSON-LD schemas for LLM crawlers, semantic search engines,
 * and AI agent discovery without cloud service dependencies.
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Zealand Labs",
    "alternateName": "Zealand Erhvervsakademi Labs",
    "url": "https://labs.zealand.dk",
    "logo": "https://labs.zealand.dk/images/landing/hero-badge.png",
    "description": "Fysiske og digitale fabrikationslaboratorier for studerende og undervisere på Zealand Erhvervsakademi i Køge.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Køge",
      "postalCode": "4600",
      "addressCountry": "DK"
    },
    "department": [
      {
        "@type": "EducationalOrganization",
        "name": "Makerspace Køge",
        "description": "Fysisk prototyping værksted med 3D-printere, laserskæring, direct-to-garment tekstilprint og loddestationer."
      },
      {
        "@type": "EducationalOrganization",
        "name": "Medialab Køge",
        "description": "Digitalt medieudlån og AV-laboratorium med 4K cinema-kameraer, studiebelysning, trådløs podcast-lyd og XR spatial computing."
      }
    ],
    "knowsAbout": [
      "Rapid Prototyping",
      "FDM 3D Printing",
      "Laser Cutting",
      "Direct-to-Garment Printing",
      "Cinema 4K Video Production",
      "Wireless Audio Recording",
      "Hardware Loan Systems"
    ]
  };
}

export function generateCatalogueSchema(items: Array<{
  id?: string;
  slug: string;
  title: string;
  category: string;
  labs?: string[];
  campuses?: string[];
  difficulty?: string;
  estimatedTime?: string;
  description?: string;
  prerequisites?: {
    materials?: string;
    estimatedTime?: string;
    difficulty?: string;
  };
}>) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map((item) => ({
      "@type": "CreativeWork",
      "@id": `https://labs.zealand.dk/craft/${item.slug}`,
      "name": item.title,
      "genre": item.category,
      "locationCreated": {
        "@type": "Place",
        "name": (item.labs || []).map((l) => `${String(l).toUpperCase()} - Køge Campus`).join(", ")
      },
      "timeRequired": item.estimatedTime || item.prerequisites?.estimatedTime || "PT1H",
      "educationalLevel": item.difficulty || item.prerequisites?.difficulty || "Begynder",
      "description": item.description || `Digital fabrikationsprototype (${item.category}) fremstillet i Zealand Labs Køge.`
    }))
  };
}
