// JSON-LD structured data (schema.org). The base graph describes the business,
// its founder and the website; pages add their own nodes on top.
import { BUSINESS, FAQS, SERVICES, SITE_URL } from "./site";
import type { CaseStudy } from "./caseStudies";

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const compact = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== "" && v != null && !(Array.isArray(v) && v.length === 0))
  );

export function baseGraph() {
  const a = BUSINESS.address;
  const address = a.city || a.street
    ? compact({
        "@type": "PostalAddress",
        streetAddress: a.street,
        addressLocality: a.city,
        addressRegion: a.region,
        postalCode: a.postalCode,
        addressCountry: a.country,
      })
    : undefined;
  const contactPoint = compact({
    "@type": "ContactPoint",
    contactType: "sales",
    url: BUSINESS.bookingUrl,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    availableLanguage: ["English", "Urdu"],
  });

  return [
    compact({
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORG_ID,
      name: BUSINESS.name,
      url: `${SITE_URL}/`,
      logo: BUSINESS.logo,
      image: BUSINESS.photo,
      description: BUSINESS.description,
      founder: { "@id": PERSON_ID },
      email: BUSINESS.email,
      telephone: BUSINESS.phone,
      address,
      areaServed: BUSINESS.areaServed,
      sameAs: BUSINESS.sameAs,
      contactPoint,
      knowsAbout: ["n8n", "Workflow automation", "AI agents", "Dental practice management", "Appointment scheduling"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Dental clinic automation services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": ORG_ID } },
        })),
      },
    }),
    compact({
      "@type": "Person",
      "@id": PERSON_ID,
      name: BUSINESS.founder,
      jobTitle: BUSINESS.jobTitle,
      image: BUSINESS.photo,
      url: `${SITE_URL}/about/`,
      worksFor: { "@id": ORG_ID },
      sameAs: BUSINESS.sameAs,
    }),
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: BUSINESS.name,
      description: BUSINESS.description,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
  ];
}

export function webPage(url: string, name: string, description: string, type = "WebPage") {
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function faqPage(url: string) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function caseStudyArticle(cs: CaseStudy, url: string) {
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: cs.title,
    description: cs.lead,
    image: `${SITE_URL}${cs.image}`,
    url,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    about: cs.tools.map((t) => ({ "@type": "Thing", name: t })),
    genre: "Case study (demonstration build)",
  };
}
