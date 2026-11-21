// One entry per project in "Selected work". The home page cards and the
// /work/<slug> case study pages are both built from this file.
//
// Workflow images live in public/images/work/. To use a real n8n screenshot,
// drop it in that folder (e.g. enquiry-to-booking.png) and change `image` below.

export interface CaseStep {
  title: string;
  text: string;
  node: string; // n8n node / tool used in this step
}

export interface CaseStudy {
  slug: string;
  title: string;
  clinic: string;
  image: string;
  imageAlt: string;
  challenge: string;
  solution: string;
  // Case study page
  lead: string;
  channels: string;
  buildTime: string;
  tools: string[];
  problem: string[];
  painPoints: string[];
  steps: CaseStep[];
  before: string[];
  after: string[];
  safeguards: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "enquiry-to-booking",
    title: "Website enquiry to booked appointment",
    clinic: "General dentistry",
    image: "/images/work/enquiry-to-booking.svg",
    imageAlt:
      "n8n workflow: website, WhatsApp and Google webhooks feed an AI step that reads the request, then the calendar offers open slots and the booking is written to the practice software.",
    challenge:
      "Enquiries arrive through the website, WhatsApp, Google and the phone. Receptionists retype each one into the schedule and reply by hand.",
    solution:
      "One intake workflow collects every channel, an AI step reads the request, and patients choose an open slot themselves.",
    lead: "A single intake workflow that turns enquiries from every channel into a confirmed appointment, without anyone retyping a message.",
    channels: "Website, WhatsApp, Google Business",
    buildTime: "2–3 weeks",
    tools: ["n8n", "OpenAI", "WhatsApp Business API", "Google Business Messages", "Google Calendar", "Practice software API"],
    problem: [
      "A typical general practice gets booking requests from four places: the website form, WhatsApp, Google Business messages and the phone. Each lands in a different inbox, and reception copies the details into the schedule by hand.",
      "Requests that come in after hours wait until the next morning. By then some patients have already booked somewhere else, and urgent cases (pain, swelling) sit in the same queue as routine check-ups.",
    ],
    painPoints: [
      "Four inboxes to check, all day",
      "Every request retyped into the schedule",
      "After-hours enquiries wait until morning",
      "Urgent cases look the same as routine ones",
    ],
    steps: [
      { title: "Capture", node: "Webhook × 3", text: "The website form, WhatsApp Business and Google Business messages all post to one n8n webhook, so every request enters the same pipeline in the same format." },
      { title: "Understand", node: "OpenAI", text: "An AI step reads the message and pulls out the treatment, preferred days and times, and urgency. Mentions of pain, swelling or bleeding are flagged for staff straight away." },
      { title: "Route", node: "Switch", text: "Urgent requests go to reception with a same-day slot held. Routine requests continue to self-booking." },
      { title: "Offer", node: "Google Calendar", text: "The calendar returns the next open slots that match the treatment length, and the patient picks one from a short reply on the channel they used." },
      { title: "Confirm", node: "Practice software", text: "The booking is written to the practice software, the patient gets a confirmation, and a reminder is scheduled for the day before." },
    ],
    before: [
      "Reception checks four inboxes and retypes each request",
      "After-hours enquiries wait until the next working day",
      "Urgent cases found only when someone reads the message",
    ],
    after: [
      "Every channel lands in one workflow, already structured",
      "Patients book open slots any time, from the chat they started",
      "Pain or swelling is flagged to staff the moment it arrives",
    ],
    safeguards: [
      "The AI never gives clinical advice; anything clinical goes to staff",
      "Urgent requests always reach a person before a slot is confirmed",
      "Every step is logged, so reception can see what happened to each request",
    ],
  },
  {
    slug: "reminders-refill-slots",
    title: "Reminders that refill cancelled slots",
    clinic: "Multi-chair clinic",
    image: "/images/work/reminders-refill-slots.svg",
    imageAlt:
      "n8n workflow: a schedule trigger finds appointments 48 and 24 hours out, sends SMS or WhatsApp reminders, waits for the reply, and offers cancelled slots to the waitlist.",
    challenge:
      "Missed appointments leave chairs empty, and staff spend mornings calling patients to confirm.",
    solution:
      "Patients confirm or reschedule in one tap, and any freed slot is offered to waitlist patients automatically.",
    lead: "Automatic reminders that patients answer in one tap, with every cancelled slot offered straight to the waitlist.",
    channels: "SMS, WhatsApp",
    buildTime: "1–2 weeks",
    tools: ["n8n", "Twilio SMS", "WhatsApp Business API", "Practice software API", "Google Sheets (waitlist)"],
    problem: [
      "In a multi-chair clinic, a single no-show leaves an expensive chair and a clinician idle. Staff try to prevent this by phoning patients the day before, which can take most of a morning.",
      "When someone does cancel, the slot usually stays empty. There is a waitlist, but nobody has time to work through it while the phone keeps ringing.",
    ],
    painPoints: [
      "Mornings spent on confirmation calls",
      "No-shows leave chairs and clinicians idle",
      "Cancelled slots rarely get refilled",
      "The waitlist exists but is never used",
    ],
    steps: [
      { title: "Find", node: "Schedule trigger", text: "Every hour the workflow pulls appointments that are 48 and 24 hours away from the practice software." },
      { title: "Remind", node: "Twilio / WhatsApp", text: "Each patient gets a short SMS or WhatsApp message with three options: confirm, reschedule or cancel." },
      { title: "Respond", node: "Webhook + Switch", text: "The reply updates the appointment status. Reschedule requests get a list of open slots to choose from." },
      { title: "Refill", node: "Loop + Wait", text: "A cancelled slot is offered to waitlist patients in order. The first to accept gets it, and the others are told it has gone." },
      { title: "Report", node: "Email", text: "Reception gets a morning summary: who confirmed, who hasn't answered, and which gaps are still open." },
    ],
    before: [
      "Staff phone every patient the day before",
      "A cancellation means an empty chair",
      "The waitlist sits in a spreadsheet nobody opens",
    ],
    after: [
      "Patients confirm, reschedule or cancel in one tap",
      "Freed slots go to the waitlist within minutes",
      "Reception starts the day with one short summary",
    ],
    safeguards: [
      "Patients who don't reply are listed for a personal call, not dropped",
      "Waitlist offers expire, so a slot is never double-booked",
      "Messages follow each patient's contact preference and opt-out",
    ],
  },
  {
    slug: "recalls-and-reviews",
    title: "Recalls and reviews on autopilot",
    clinic: "Family dental practice",
    image: "/images/work/recalls-and-reviews.svg",
    imageAlt:
      "n8n workflow: a weekly trigger finds patients due for a check-up, an AI step personalizes each recall message with a booking link, and a review request goes out after the visit.",
    challenge:
      "The recall list grows every month, and nobody has time to contact overdue patients or ask happy ones for a review.",
    solution:
      "Each week the workflow finds patients who are due, sends a personal message with a booking link, and asks for a review after the visit.",
    lead: "A weekly workflow that brings overdue patients back with a personal message, then asks happy patients for a review.",
    channels: "SMS, WhatsApp, Email",
    buildTime: "1–2 weeks",
    tools: ["n8n", "OpenAI", "Practice software API", "WhatsApp Business API", "Email", "Google Business Profile"],
    problem: [
      "Family practices rely on regular check-ups and cleanings, but the recall list only grows. Generic reminder letters get ignored, and personal follow-up takes time nobody has.",
      "Happy patients rarely leave a review unless they're asked at the right moment, so the practice's Google rating doesn't reflect the care it gives.",
    ],
    painPoints: [
      "Overdue patients quietly drift away",
      "Generic recall letters get ignored",
      "No time for personal follow-up",
      "Few reviews despite happy patients",
    ],
    steps: [
      { title: "Find", node: "Schedule trigger", text: "Every Monday the workflow pulls patients due for a check-up or cleaning, and those overdue by more than a month." },
      { title: "Write", node: "OpenAI", text: "AI writes a short, personal message using the patient's first name, last treatment and family members due at the same time." },
      { title: "Book", node: "WhatsApp / Email", text: "The message includes a link to open slots, so patients book without calling. Non-responders get one gentle follow-up a week later." },
      { title: "Review", node: "Wait + Webhook", text: "After the visit, a short message asks how it went. Happy patients get a link to leave a Google review." },
      { title: "Escalate", node: "IF + Email", text: "Any negative feedback goes to the practice manager privately first, so it can be handled personally." },
    ],
    before: [
      "Recall letters go out in batches, if at all",
      "Overdue patients are noticed only when they call",
      "Reviews depend on patients remembering to leave one",
    ],
    after: [
      "Every due patient gets a personal message each week",
      "Patients book from the message, without calling",
      "Happy patients are asked for a review at the right moment",
    ],
    safeguards: [
      "Messages respect opt-outs and each patient's preferred channel",
      "AI drafts follow a template the practice approves",
      "Negative feedback is never pushed toward a public review",
    ],
  },
];
