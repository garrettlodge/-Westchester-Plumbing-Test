import type { SiteConfig, Industry } from "@/site.config";

/** Map our industry key to the most specific schema.org LocalBusiness subtype. */
const SCHEMA_TYPE: Record<Industry, string> = {
  plumber: "Plumber",
  contractor: "GeneralContractor",
  electrician: "Electrician",
  hvac: "HVACBusiness",
  roofer: "RoofingContractor",
  other: "LocalBusiness",
};

/**
 * Build the JSON-LD graph from site config:
 *   1. An industry-aware LocalBusiness (with rating, reviews, services, NAP).
 *   2. A separate FAQPage.
 * Returns an array so both can live in a single <script> tag.
 */
export function buildJsonLd(config: SiteConfig): Record<string, unknown>[] {
  const { business, contact, serviceArea, services, reviews, faq, social } =
    config;
  const url = `https://${business.domain}`;

  const localBusiness: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[business.industry],
    "@id": `${url}/#business`,
    name: business.name,
    description: business.description,
    url,
    image: `${url}/og.jpg`,
    telephone: contact.phoneTel,
    email: contact.email,
    priceRange: "$$",
    foundingDate: String(business.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.state,
      postalCode: contact.address.zip,
      addressCountry: "US",
    },
    areaServed: serviceArea.map((city) => ({ "@type": "City", name: city })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.rating,
      reviewCount: reviews.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.items.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.body,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${business.name} Services`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.blurb,
        },
      })),
    },
    sameAs: [social.google, social.facebook, social.instagram, social.yelp].filter(
      (u): u is string => Boolean(u)
    ),
  };

  const faqPage: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return [localBusiness, faqPage];
}
