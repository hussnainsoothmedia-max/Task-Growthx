// Generates 1200x630 PNG cover images for the blog posts.
// Run: node scripts/make-blog-covers.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = "public/images/blog";
fs.mkdirSync(OUT, { recursive: true });

const C = {
  canvas: "#F0F7F6",
  white: "#FFFFFF",
  line: "#D0E0DD",
  ink: "#102321",
  muted: "#526663",
  soft: "#96A8A4",
  accent: "#00A99D",
  accentSoft: "#D6F0EC",
  dark: "#001112",
  darkLine: "#1C3735",
};
const F = "Inter, 'Segoe UI', Arial, sans-serif";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const t = (x, y, s, size = 22, fill = C.ink, weight = 500, anchor = "start") =>
  `<text x="${x}" y="${y}" font-family="${F}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const tick = (cx, cy, r = 16, fill = C.accent) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><path d="M${cx - r * 0.4} ${cy} l${r * 0.28} ${r * 0.3} l${r * 0.55} -${r * 0.6}" fill="none" stroke="#fff" stroke-width="${r * 0.22}" stroke-linecap="round" stroke-linejoin="round"/>`;
const shadow = `<filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0b3b36" flood-opacity="0.12"/></filter>`;

function frame(tag, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="${C.line}"/></pattern>
  ${shadow}
</defs>
<rect width="1200" height="630" fill="${C.canvas}"/>
<rect width="1200" height="630" fill="url(#dots)" opacity="0.7"/>
<circle cx="1080" cy="80" r="260" fill="${C.accent}" opacity="0.07"/>
<circle cx="120" cy="600" r="200" fill="${C.accent}" opacity="0.05"/>
<!-- brand -->
<g transform="translate(56 548)">
  <rect width="40" height="40" rx="9" fill="${C.ink}"/>
  <path d="M10 21 L17 28 L27 15" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M31.5 9 L30 19.7 L21.6 13.2 Z" fill="#14B8A6"/>
  ${t(54, 27, "Hussnain Ahmad", 20, C.ink, 600)}
</g>
<!-- tag -->
<g transform="translate(56 52)">
  <rect width="${tag.length * 11 + 36}" height="38" rx="19" fill="${C.white}" stroke="${C.line}"/>
  <circle cx="20" cy="19" r="5" fill="${C.accent}"/>
  ${t(34, 25, tag.toUpperCase(), 14, C.ink, 600)}
</g>
${body}
</svg>`;
}

const covers = {
  // 1. Appointment reminders
  "appointment-reminders-patients-answer": frame(
    "Reminders",
    `
<g filter="url(#sh)">
  <rect x="170" y="150" width="400" height="330" rx="24" fill="${C.white}"/>
</g>
${t(200, 200, "November", 24, C.ink, 700)}
${t(540, 200, "Tue 25", 18, C.muted, 500, "end")}
${["M", "T", "W", "T", "F", "S", "S"].map((d, i) => t(222 + i * 50, 245, d, 15, C.soft, 600, "middle")).join("")}
${Array.from({ length: 28 }, (_, i) => {
  const x = 222 + (i % 7) * 50, y = 285 + Math.floor(i / 7) * 46, n = i + 3;
  const hot = n === 25, warn = n === 23 || n === 24;
  return `${hot ? `<circle cx="${x}" cy="${y - 6}" r="19" fill="${C.accent}"/>` : warn ? `<circle cx="${x}" cy="${y - 6}" r="19" fill="${C.accentSoft}"/>` : ""}${t(x, y, String(n), 16, hot ? "#fff" : C.ink, hot ? 700 : 500, "middle")}`;
}).join("")}
<g transform="translate(300 500)"><rect width="76" height="30" rx="15" fill="${C.ink}"/>${t(38, 21, "T-48h", 14, "#fff", 600, "middle")}</g>
<g transform="translate(388 500)"><rect width="76" height="30" rx="15" fill="${C.ink}"/>${t(38, 21, "T-24h", 14, "#fff", 600, "middle")}</g>

<g filter="url(#sh)">
  <rect x="700" y="70" width="320" height="500" rx="44" fill="${C.ink}"/>
</g>
<rect x="714" y="84" width="292" height="472" rx="32" fill="${C.canvas}"/>
<rect x="820" y="98" width="80" height="8" rx="4" fill="${C.line}"/>
${t(740, 150, "Dental clinic", 16, C.ink, 700)}
${t(740, 172, "WhatsApp", 13, C.muted, 500)}
<rect x="736" y="196" width="248" height="112" rx="16" fill="${C.white}"/>
${t(754, 228, "Hi Sara, a reminder:", 16, C.ink, 500)}
${t(754, 254, "Cleaning, Tue 09:30", 16, C.ink, 700)}
${t(754, 280, "with Dr. Khan.", 16, C.ink, 500)}
<rect x="736" y="322" width="248" height="44" rx="12" fill="${C.accent}"/>${t(860, 350, "Confirm", 17, "#fff", 700, "middle")}
<rect x="736" y="374" width="248" height="44" rx="12" fill="${C.white}" stroke="${C.line}"/>${t(860, 402, "Reschedule", 17, C.ink, 600, "middle")}
<rect x="736" y="426" width="248" height="44" rx="12" fill="${C.white}" stroke="${C.line}"/>${t(860, 454, "Cancel", 17, C.ink, 600, "middle")}
<rect x="830" y="490" width="154" height="40" rx="14" fill="${C.accentSoft}"/>${t(907, 516, "Confirmed", 16, C.ink, 600, "middle")}
${tick(965, 510, 10)}
`
  ),

  // 2. Five front-desk tasks
  "front-desk-tasks-to-automate-first": frame(
    "Getting started",
    `
<g filter="url(#sh)"><rect x="330" y="110" width="560" height="410" rx="26" fill="${C.white}"/></g>
${t(370, 165, "Front desk, automated", 26, C.ink, 700)}
${t(850, 165, "5 / 5", 18, C.accent, 700, "end")}
${["Confirm appointments", "Collect booking requests", "Send new-patient forms", "Recall overdue patients", "Ask for reviews"]
  .map((label, i) => {
    const y = 215 + i * 60;
    return `<rect x="360" y="${y - 30}" width="500" height="50" rx="12" fill="${i % 2 ? C.white : C.canvas}"/>${tick(392, y - 5, 14)}${t(422, y + 1, label, 19, C.ink, 500)}<rect x="770" y="${y - 19}" width="74" height="28" rx="14" fill="${C.accentSoft}"/>${t(807, y + 1, "auto", 14, C.ink, 600, "middle")}`;
  })
  .join("")}
<g transform="translate(940 300)" filter="url(#sh)"><rect width="150" height="96" rx="20" fill="${C.ink}"/>${t(75, 46, "Hours", 16, C.soft, 500, "middle")}${t(75, 74, "back", 24, "#fff", 700, "middle")}</g>
`
  ),

  // 3. Why n8n
  "why-we-build-on-n8n": frame(
    "n8n",
    `
<g filter="url(#sh)"><rect x="120" y="120" width="960" height="390" rx="28" fill="${C.dark}"/></g>
<pattern id="dd" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="${C.darkLine}"/></pattern>
<rect x="120" y="120" width="960" height="390" rx="28" fill="url(#dd)"/>
<circle cx="156" cy="152" r="7" fill="#3a5553"/><circle cx="178" cy="152" r="7" fill="#3a5553"/><circle cx="200" cy="152" r="7" fill="#3a5553"/>
${t(224, 158, "Booking workflow", 16, "#9fb7b4", 600)}
<rect x="900" y="138" width="150" height="30" rx="15" fill="#0f3b37"/><circle cx="920" cy="153" r="5" fill="${C.accent}"/>${t(985, 159, "Active", 14, "#7fe0d6", 600, "middle")}
${(() => {
  const nodes = [
    { x: 180, label: "Trigger", sub: "webhook", g: "⇢" },
    { x: 360, label: "AI step", sub: "read request", g: "✦" },
    { x: 540, label: "Rules", sub: "if / switch", g: "⑂" },
    { x: 720, label: "Calendar", sub: "find slot", g: "▦" },
    { x: 900, label: "Booked", sub: "confirm", g: "✓" },
  ];
  const edges = nodes.slice(0, -1).map((n, i) => `<path d="M${n.x + 92} 320 L${nodes[i + 1].x} 320" stroke="${C.accent}" stroke-width="3"/><circle cx="${n.x + 92}" cy="320" r="5" fill="${C.accent}"/>`).join("");
  const boxes = nodes.map((n, i) => `<rect x="${n.x}" y="274" width="92" height="92" rx="16" fill="#0b2a2a" stroke="${i === 1 ? C.accent : "#2b4a48"}" stroke-width="2"/>${t(n.x + 46, 333, n.g, 34, i === 1 ? C.accent : "#e6f2f1", 600, "middle")}${t(n.x + 46, 400, n.label, 17, "#e6f2f1", 600, "middle")}${t(n.x + 46, 422, n.sub, 13, "#7d9a97", 500, "middle")}${tick(n.x + 86, 280, 11)}`).join("");
  return edges + boxes;
})()}
`
  ),

  // 4. Patient recalls
  "patient-recalls-without-phone-calls": frame(
    "Recalls",
    `
<g filter="url(#sh)"><circle cx="360" cy="330" r="170" fill="${C.white}"/></g>
<circle cx="360" cy="330" r="130" fill="none" stroke="${C.accentSoft}" stroke-width="26"/>
<path d="M360 200 A130 130 0 1 1 238 374" fill="none" stroke="${C.accent}" stroke-width="26" stroke-linecap="round"/>
<path d="M216 352 L238 390 L268 360 Z" fill="${C.accent}"/>
${t(360, 330, "6", 76, C.ink, 800, "middle")}
${t(360, 368, "months", 20, C.muted, 600, "middle")}

<g filter="url(#sh)"><rect x="620" y="150" width="440" height="330" rx="26" fill="${C.white}"/></g>
<circle cx="666" cy="200" r="22" fill="${C.accentSoft}"/>${t(666, 207, "A", 18, C.ink, 700, "middle")}
${t(700, 198, "Ali Raza", 18, C.ink, 700)}
${t(700, 220, "Last visit: May", 14, C.muted, 500)}
<rect x="650" y="246" width="380" height="120" rx="16" fill="${C.canvas}"/>
${t(672, 280, "Hi Ali, you and Sana are", 18, C.ink, 500)}
${t(672, 306, "due for your check-ups.", 18, C.ink, 500)}
${t(672, 340, "Book both in one go:", 18, C.ink, 700)}
<rect x="650" y="384" width="380" height="54" rx="14" fill="${C.accent}"/>${t(840, 418, "Pick a time  →", 19, "#fff", 700, "middle")}
`
  ),

  // 5. AI on WhatsApp
  "ai-on-clinic-whatsapp": frame(
    "AI & safety",
    `
<g filter="url(#sh)"><rect x="300" y="96" width="600" height="440" rx="28" fill="${C.white}"/></g>
<rect x="300" y="96" width="600" height="64" rx="28" fill="${C.ink}"/><rect x="300" y="132" width="600" height="28" fill="${C.ink}"/>
${t(336, 136, "Clinic WhatsApp", 18, "#fff", 700)}
<rect x="740" y="114" width="136" height="28" rx="14" fill="#16413d"/>${t(808, 133, "AI + team", 13, "#7fe0d6", 600, "middle")}

<rect x="330" y="182" width="300" height="46" rx="14" fill="${C.canvas}"/>${t(348, 211, "What time do you open?", 17, C.ink, 500)}
<rect x="540" y="240" width="330" height="46" rx="14" fill="${C.accent}"/>${t(558, 269, "Mon–Sat, 9:00 to 18:00.", 17, "#fff", 600)}
<g transform="translate(846 228)"><rect width="34" height="20" rx="10" fill="${C.ink}"/>${t(17, 14, "AI", 11, "#fff", 700, "middle")}</g>

<rect x="330" y="306" width="360" height="46" rx="14" fill="${C.canvas}"/>${t(348, 335, "My tooth is swollen and hurts.", 17, C.ink, 500)}

<line x1="330" y1="384" x2="490" y2="384" stroke="${C.line}" stroke-width="2"/>
<line x1="710" y1="384" x2="870" y2="384" stroke="${C.line}" stroke-width="2"/>
<rect x="490" y="368" width="220" height="32" rx="16" fill="#FFF4E5" stroke="#F2C27B"/>${t(600, 390, "Passed to the team", 14, "#8a5a12", 700, "middle")}

<rect x="470" y="418" width="400" height="72" rx="14" fill="${C.ink}"/>
${t(488, 447, "Sorry to hear that. We have a", 17, "#fff", 500)}
${t(488, 473, "same-day slot at 14:00 for you.", 17, "#fff", 500)}
<g transform="translate(846 406)"><rect width="46" height="20" rx="10" fill="${C.accent}"/>${t(23, 14, "Staff", 11, "#fff", 700, "middle")}</g>

<g transform="translate(150 260)" filter="url(#sh)">
  <path d="M60 0 L116 22 V70 C116 108 92 130 60 144 C28 130 4 108 4 70 V22 Z" fill="${C.white}"/>
  <path d="M60 18 L100 34 V70 C100 98 83 114 60 125 C37 114 20 98 20 70 V34 Z" fill="${C.accentSoft}"/>
  ${tick(60, 72, 20)}
</g>
`
  ),
};

for (const [slug, svg] of Object.entries(covers)) {
  const file = path.join(OUT, `${slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  console.log("wrote", file, Math.round(fs.statSync(file).size / 1024) + "KB");
}
