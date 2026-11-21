// Business details used by the JSON-LD structured data, llms.txt, the Markdown
// version of the homepage, the Contact page and the footer.
// Fill in EMAIL, PHONE and SAME_AS: empty values are simply left out.
import { CAL_URL } from "../config";

export const SITE_URL = "https://hussnainahmad.com";

export const BUSINESS = {
  name: "Task GrowthX",
  founder: "Hussnain Ahmad",
  jobTitle: "AI automation engineer",
  description:
    "AI automation for dental clinics: online booking, appointment reminders, patient recalls and front-desk workflows, built on n8n.",
  logo: `${SITE_URL}/favicon.svg`,
  photo: `${SITE_URL}/images/hussnain.png`,
  bookingUrl: CAL_URL,
  // Public contact details. Leave "" to hide.
  email: "", // e.g. "hello@hussnainahmad.com"
  phone: "", // international format, e.g. "+923001234567"
  areaServed: "Worldwide",
  // Full URLs of your public profiles (LinkedIn, Instagram, YouTube, GitHub, Upwork...)
  sameAs: [] as string[],
};

export const SERVICES = [
  {
    name: "Online booking & scheduling automation",
    description:
      "Patients book from your website, Google profile or WhatsApp, and the appointment lands in your schedule without a phone call.",
  },
  {
    name: "Reminders & no-show prevention",
    description:
      "SMS and WhatsApp reminders patients confirm in one tap, with cancelled slots offered to the waitlist.",
  },
  {
    name: "Patient recall & reactivation",
    description:
      "Weekly personal messages to patients due for a check-up, with a booking link and a review request after the visit.",
  },
  {
    name: "AI front-desk assistant",
    description:
      "Answers common questions about hours, prices and directions, and passes anything clinical to your team.",
  },
];

// Same questions and answers as the FAQ section (src/components/Faq.astro).
// Keep them in sync: structured data must match what visitors see.
export const FAQS = [
  {
    q: "Does it work with our practice management software?",
    a: "Usually, yes. Many systems have an API or can sync through a calendar. If yours can't connect directly, we'll explain the options on the first call and you decide.",
  },
  {
    q: "Is patient data kept safe?",
    a: "Patient data stays in the systems you already use, and each workflow only gets access to what it needs. We work within your privacy and data protection rules, and go through this in detail before any build.",
  },
  {
    q: "Will the AI give patients medical advice?",
    a: "No. The AI handles booking, admin and common questions about hours, prices and directions. Anything clinical is passed to your team.",
  },
  {
    q: "Do patients need to download an app?",
    a: "No. Messages arrive by SMS, WhatsApp or email, and booking happens on your website or inside the chat.",
  },
  {
    q: "How is a project priced?",
    a: "After the discovery call we send a fixed scope and price for the first workflow. Ongoing support is a separate monthly plan, only if you want it.",
  },
];

// Every page, for the sitemap and llms.txt
export const PAGES = [
  { path: "/", title: "Home", summary: "AI automation for dental clinics: services, process, selected work and FAQ." },
  { path: "/blog/", title: "Blog", summary: "Practical guides on automating a dental clinic front desk with n8n." },
  { path: "/about/", title: "About", summary: "Who builds the workflows and how the work is done." },
  { path: "/contact/", title: "Contact", summary: "How to reach us and book a discovery call." },
  { path: "/privacy/", title: "Privacy policy", summary: "What data this site collects and how it is used." },
  { path: "/terms/", title: "Terms of service", summary: "Terms for using this site and working together." },
];
