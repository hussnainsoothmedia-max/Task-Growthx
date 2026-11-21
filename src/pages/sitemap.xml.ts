import type { APIRoute } from "astro";
import { caseStudies } from "../data/caseStudies";
import { PAGES, SITE_URL } from "../data/site";

// lastmod is the build date: the site is rebuilt whenever its content changes.
export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const paths = [...PAGES.map((p) => p.path), ...caseStudies.map((c) => `/work/${c.slug}/`)];
  const urls = paths
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p === "/" ? "1.0" : "0.7"}</priority>\n  </url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
