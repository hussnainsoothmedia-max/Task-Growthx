import type { APIRoute } from "astro";
import { caseStudies } from "../data/caseStudies";
import { PAGES, SITE_URL } from "../data/site";
import { getPosts } from "../data/blog";

// Pages and case studies use the build date (the site is rebuilt when content
// changes); blog posts use their own published/updated date.
export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const posts = await getPosts();
  const entries = [
    ...PAGES.map((p) => ({ path: p.path, lastmod: today })),
    ...caseStudies.map((c) => ({ path: `/work/${c.slug}/`, lastmod: today })),
    ...posts.map((p) => ({
      path: `/blog/${p.id}/`,
      lastmod: (p.data.updated ?? p.data.date).toISOString().slice(0, 10),
    })),
  ];
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${e.path === "/" ? "1.0" : "0.7"}</priority>\n  </url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
