// WebMCP: exposes read-only tools to AI agents running in the visitor's browser.
// Only runs in browsers that support navigator.modelContext; does nothing elsewhere.
import { caseStudies } from "../data/caseStudies";
import { BUSINESS, FAQS, SERVICES, SITE_URL } from "../data/site";

const mc = typeof navigator !== "undefined" ? navigator.modelContext : undefined;

const text = (value) => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
});

const tools = [
  {
    name: "get_business_info",
    description: `Who ${BUSINESS.name} is, what it does, and how to get in touch.`,
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () =>
      text({
        name: BUSINESS.name,
        founder: BUSINESS.founder,
        description: BUSINESS.description,
        website: SITE_URL,
        booking_url: BUSINESS.bookingUrl,
        email: BUSINESS.email || undefined,
        phone: BUSINESS.phone || undefined,
        profiles: BUSINESS.sameAs,
      }),
  },
  {
    name: "list_services",
    description: "List the automation services offered to dental clinics.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => text(SERVICES),
  },
  {
    name: "list_case_studies",
    description: "List the demonstration case studies with their URLs and a one-line summary.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () =>
      text(caseStudies.map((c) => ({ slug: c.slug, title: c.title, summary: c.lead, url: `${SITE_URL}/work/${c.slug}/` }))),
  },
  {
    name: "get_case_study",
    description: "Get the full details of one case study: challenge, workflow steps, tools and safeguards.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", enum: caseStudies.map((c) => c.slug), description: "Case study slug" } },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ slug }) => {
      const c = caseStudies.find((x) => x.slug === slug);
      return text(c ? { ...c, url: `${SITE_URL}/work/${c.slug}/` } : `No case study with slug "${slug}".`);
    },
  },
  {
    name: "get_faq",
    description: "Answers to the questions dental clinics most often ask before starting.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => text(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
  },
  {
    name: "get_booking_link",
    description:
      "Get the link to book a free 30-minute discovery call. Returns the URL only; the visitor chooses a time themselves.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => text({ booking_url: BUSINESS.bookingUrl, duration_minutes: 30 }),
  },
];

if (mc) {
  try {
    if (typeof mc.registerTool === "function") {
      tools.forEach((t) => mc.registerTool(t));
    } else if (typeof mc.provideContext === "function") {
      mc.provideContext({ tools });
    }
  } catch (err) {
    console.warn("WebMCP registration failed", err);
  }
}
