// Read-only MCP server: tool definitions and data.
// Used by /mcp/data.json (read by public/mcp/index.php) and the Server Card
// at /.well-known/mcp/server-card.json.
import { caseStudies } from "./caseStudies";
import { BUSINESS, FAQS, SERVICES, SITE_URL } from "./site";

export const MCP_SERVER = {
  name: "hussnainahmad-site",
  title: "Hussnain Ahmad · Task GrowthX",
  version: "1.0.0",
  protocolVersion: "2025-06-18",
  endpoint: `${SITE_URL}/mcp/`,
  instructions:
    "Read-only information about Task GrowthX, which builds n8n automation for dental clinics. Use these tools to answer questions about services, case studies, FAQs, contact details and how to book a discovery call. Nothing here books, buys or changes anything.",
};

const noArgs = { type: "object", properties: {}, additionalProperties: false };

export const MCP_TOOLS = [
  {
    name: "get_business_info",
    title: "Business info",
    description: `Who ${BUSINESS.name} is, what it does, and how to get in touch.`,
    inputSchema: noArgs,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "list_services",
    title: "List services",
    description: "List the automation services offered to dental clinics.",
    inputSchema: noArgs,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "list_case_studies",
    title: "List case studies",
    description: "List the demonstration case studies with their URLs and a one-line summary.",
    inputSchema: noArgs,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "get_case_study",
    title: "Get a case study",
    description: "Get the full details of one case study: challenge, workflow steps, tools and safeguards.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", enum: caseStudies.map((c) => c.slug), description: "Case study slug" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "get_faq",
    title: "FAQ",
    description: "Answers to the questions dental clinics most often ask before starting.",
    inputSchema: noArgs,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "list_blog_posts",
    title: "List blog posts",
    description: "List published blog posts with their URLs and summaries.",
    inputSchema: noArgs,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "get_booking_link",
    title: "Booking link",
    description: "Get the link to book a free 30-minute discovery call. Returns the URL only; the visitor picks a time themselves.",
    inputSchema: noArgs,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];

export function mcpData(posts: { id: string; title: string; description: string; date: string }[]) {
  return {
    server: MCP_SERVER,
    tools: MCP_TOOLS,
    results: {
      get_business_info: {
        name: BUSINESS.name,
        founder: BUSINESS.founder,
        description: BUSINESS.description,
        website: `${SITE_URL}/`,
        booking_url: BUSINESS.bookingUrl,
        email: BUSINESS.email || null,
        phone: BUSINESS.phone || null,
        area_served: BUSINESS.areaServed,
        profiles: BUSINESS.sameAs,
      },
      list_services: SERVICES,
      list_case_studies: caseStudies.map((c) => ({ slug: c.slug, title: c.title, summary: c.lead, url: `${SITE_URL}/work/${c.slug}/` })),
      get_faq: FAQS.map((f) => ({ question: f.q, answer: f.a })),
      list_blog_posts: posts.map((p) => ({ title: p.title, summary: p.description, date: p.date, url: `${SITE_URL}/blog/${p.id}/` })),
      get_booking_link: { booking_url: BUSINESS.bookingUrl, duration_minutes: 30 },
    },
    case_studies: Object.fromEntries(caseStudies.map((c) => [c.slug, { ...c, url: `${SITE_URL}/work/${c.slug}/` }])),
  };
}
