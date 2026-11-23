import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../utils/editorial";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const items = posts
    .map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: new Date(`${post.data.date}T12:00:00Z`),
      link: new URL(`/blog/${post.slug}/`, context.site).href,
    }))
    .sort(
      (a, b) =>
        b.pubDate.getTime() - a.pubDate.getTime() || a.link.localeCompare(b.link),
    );
  return rss({
    title: "Nim Dvir: blog",
    description: "Posts on research, teaching, and projects.",
    site: context.site!,
    items,
    trailingSlash: true,
    customData: "<language>en-us</language>",
  });
}
