import { getCollection } from "astro:content";

// Use the owner's calendar date, including around UTC midnight.
export function todayInNewYork() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return ["year", "month", "day"]
    .map((type) => parts.find((p) => p.type === type)?.value)
    .join("-");
}
export function isPublished(entry: { data: { draft: boolean; date: string } }) {
  return entry.data.draft === false && entry.data.date <= todayInNewYork();
}
const newestFirst = (
  a: { data: { date: string }; slug: string },
  b: { data: { date: string }; slug: string },
) => b.data.date.localeCompare(a.data.date) || a.slug.localeCompare(b.slug);
export async function getPosts() {
  return (await getCollection("blog", isPublished)).sort(newestFirst);
}
export async function getNews() {
  return (await getCollection("news", isPublished)).sort(newestFirst);
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function readingMinutes(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
}
