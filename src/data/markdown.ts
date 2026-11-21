// Plain-text versions of the site for AI agents: /llms.txt and /index.md
import { caseStudies } from "./caseStudies";
import { BUSINESS, FAQS, PAGES, SERVICES, SITE_URL } from "./site";

const contactLines = () =>
  [
    `- Book a discovery call: ${BUSINESS.bookingUrl}`,
    BUSINESS.email && `- Email: ${BUSINESS.email}`,
    BUSINESS.phone && `- Phone: ${BUSINESS.phone}`,
    ...BUSINESS.sameAs.map((u) => `- Profile: ${u}`),
  ]
    .filter(Boolean)
    .join("\n");

export function llmsTxt(posts: { id: string; title: string; description: string }[] = []): string {
  return `# ${BUSINESS.name}

> ${BUSINESS.description} Run by ${BUSINESS.founder}.

We build n8n workflows that take repetitive admin off a dental clinic's front desk. Anything clinical or payment-related always goes to clinic staff.

## Pages

${PAGES.map((p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.summary}`).join("\n")}
- [Homepage as Markdown](${SITE_URL}/index.md): the full homepage in plain Markdown

## Services

${SERVICES.map((s) => `- ${s.name}: ${s.description}`).join("\n")}

## Case studies (demonstration builds)

${caseStudies.map((c) => `- [${c.title}](${SITE_URL}/work/${c.slug}/): ${c.lead}`).join("\n")}

${posts.length ? `## Blog\n\n${posts.map((b) => `- [${b.title}](${SITE_URL}/blog/${b.id}/): ${b.description}`).join("\n")}\n\n` : ""}## Contact

${contactLines()}
`;
}

export function homeMarkdown(): string {
  return `# ${BUSINESS.name}: AI automation for dental clinics

AI systems that keep dental chairs full. We automate patient booking, reminders, recalls and follow-ups, so your front desk can focus on the patients in the room.

- Built on n8n and open APIs. Your clinic owns the workflows.
- Works with your practice software: we connect your schedule, phones and messages instead of replacing them.
- Your team stays in control: anything clinical or payment-related goes to a person.
- Tested before patients see it, with error handling and alerts in every build.

## Services

${SERVICES.map((s) => `### ${s.name}\n\n${s.description}`).join("\n\n")}

## Selected work (demonstration builds, not client results)

${caseStudies
  .map(
    (c) =>
      `### [${c.title}](${SITE_URL}/work/${c.slug}/)\n\n${c.clinic}.\n\n- Challenge: ${c.challenge}\n- Solution: ${c.solution}`
  )
  .join("\n\n")}

## Process

1. Discover: understand your clinic, your patient journey and where the front desk loses time. You get a map of your booking and patient workflows.
2. Strategize: choose the automations that matter most and design how they connect to your systems. You get a prioritized plan and fixed scope.
3. Build: develop, connect and test the workflows with your team before patients see them. You get tested workflows and staff handover.
4. Optimize: watch how it runs, adjust messages and timing, and add the next workflow when you are ready. You get monitoring, alerts and regular reviews.

## About

${BUSINESS.founder} builds AI automation for dental clinics that want a calmer front desk and a fuller schedule. Every workflow stays simple enough for the clinic team to understand, and support continues after launch.

## FAQ

${FAQS.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Contact

${contactLines()}
`;
}
