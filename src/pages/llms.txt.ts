import type { APIRoute } from "astro";
import { llmsTxt } from "../data/markdown";
import { getPosts } from "../data/blog";

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).map((p) => ({ id: p.id, title: p.data.title, description: p.data.description }));
  return new Response(llmsTxt(posts), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
