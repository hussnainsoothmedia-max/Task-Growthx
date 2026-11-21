import { getCollection } from "astro:content";

// Published posts, newest first
export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Rough reading time from the Markdown body
export const readingTime = (body = "") => Math.max(1, Math.round(body.split(/\s+/).length / 220));

// Bump when cover images change, so browsers and the CDN fetch the new files
export const IMG_VERSION = 2;
