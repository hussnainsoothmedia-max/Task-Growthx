import type { APIRoute } from "astro";
import { homeMarkdown } from "../data/markdown";

// Served at /index.md, and at / for requests with "Accept: text/markdown"
// (see public/.htaccess).
export const GET: APIRoute = () =>
  new Response(homeMarkdown(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
