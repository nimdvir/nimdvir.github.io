import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, getNews } from "../utils/editorial";

export async function GET(context: APIContext) {
  const [posts, news] = await Promise.all([getPosts(), getNews()]);
  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: new Date(`${post.data.date}T12:00:00Z`),
      link: new URL(`/blog/${post.slug}/`, context.site).href,
    })),
    ...news.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: new Date(`${entry.data.date}T12:00:00Z`),
      link: new URL(
        entry.data.inline
          ? `/news/#news-${entry.slug}`
          : `/news/${entry.slug}/`,
        context.site,
      ).href,
    })),
  ].sort(
    (a, b) =>
      b.pubDate.getTime() - a.pubDate.getTime() || a.link.localeCompare(b.link),
  );
  return rss({
    title: "Nim Dvir: blog and news",
    description: "Posts and updates on research, teaching, and projects.",
    site: context.site!,
    items,
    trailingSlash: true,
    customData: "<language>en-us</language>",
  });
}
