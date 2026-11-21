import type { APIRoute } from "astro";
import { getPosts } from "../../data/blog";
import { mcpData } from "../../data/mcp";

// Data file read by public/mcp/index.php
export const GET: APIRoute = async () => {
  const posts = (await getPosts()).map((p) => ({
    id: p.id,
    title: p.data.title,
    description: p.data.description,
    date: p.data.date.toISOString().slice(0, 10),
  }));
  return new Response(JSON.stringify(mcpData(posts)), { headers: { "Content-Type": "application/json" } });
};
