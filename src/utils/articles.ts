import { getCollection, type CollectionEntry } from "astro:content";
import { todayInNewYork } from "./editorial";

export type Article = CollectionEntry<"articles">;

const kindLabels: Record<string, string> = {
  interview: "Interview",
  column: "Column",
  feature: "Feature",
  review: "Review",
  coverage: "Coverage",
};

const kindPlurals: Record<string, string> = {
  interview: "Interviews",
  column: "Columns",
  feature: "Features",
  review: "Reviews",
  coverage: "Coverage",
};

export function articleKindLabel(kind: string) {
  return kindLabels[kind] ?? kind;
}

// Portfolio sections on /articles/, in display order.
export const articleGroupOrder = [
  "international-interview",
  "israeli-interview",
  "feature",
  "review",
  "column",
  "about-me",
] as const;
export type ArticleGroup = (typeof articleGroupOrder)[number];

const groupLabels: Record<ArticleGroup, string> = {
  "international-interview": "Celebrity interviews",
  "israeli-interview": "Israeli interviews",
  feature: "Features and set visits",
  review: "Reviews",
  column: "Columns",
  "about-me": "Written about me",
};

export function articleGroupLabel(group: ArticleGroup) {
  return groupLabels[group];
}

const groupByKind: Record<string, ArticleGroup> = {
  interview: "international-interview",
  column: "column",
  feature: "feature",
  review: "review",
  coverage: "about-me",
};

export function articleGroup(article: Article): ArticleGroup {
  return article.data.group ?? groupByKind[article.data.kind] ?? "feature";
}

export function isPersonPiece(article: Article) {
  const g = articleGroup(article);
  return g === "international-interview" || g === "israeli-interview";
}

// A face-centred portrait crop of the article's Cloudinary image.
export function articlePortrait(url: string | undefined, width = 600) {
  if (!url || !url.includes("/image/upload/")) return url;
  const height = Math.round((width * 4) / 3);
  return url.replace(
    /\/image\/upload\/(?:[^/]+\/)?(v\d+\/)/,
    `/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face,z_0.8/$1`,
  );
}

export function articleKindPlural(kind: string) {
  return kindPlurals[kind] ?? kind;
}

export function isPublishedArticle(entry: Article) {
  return entry.data.draft === false && entry.data.date <= todayInNewYork();
}

const newestFirst = (a: Article, b: Article) =>
  b.data.date.localeCompare(a.data.date) || a.slug.localeCompare(b.slug);

export async function getArticles() {
  return (await getCollection("articles", isPublishedArticle)).sort(
    newestFirst,
  );
}

export function articleDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function articleYear(date: string) {
  return date.slice(0, 4);
}

// Author line as the archive prints it, without the dateline.
export function articleByline(article: Article) {
  if (article.data.authors.length > 1) return article.data.authors.join(" and ");
  return article.data.author;
}

// Articles sharing the most tags with the current one, newest first on ties.
export function relatedArticles(current: Article, all: Article[], limit = 3) {
  const mine = new Set(current.data.tags.map((t) => t.toLowerCase()));
  return all
    .filter((a) => a.slug !== current.slug)
    .map((a) => ({
      article: a,
      score:
        a.data.tags.filter((t) => mine.has(t.toLowerCase())).length +
        (a.data.kind === current.data.kind ? 0.5 : 0) +
        (a.data.source === current.data.source ? 0.25 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.article.data.date.localeCompare(a.article.data.date),
    )
    .slice(0, limit)
    .map((r) => r.article);
}

// Two or three letters for the typographic cover when no licensed photo exists.
export function articleMonogram(article: Article) {
  const name = article.data.interviewee || article.data.subjects[0] || article.data.title;
  const words = name.replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]).join("");
  return (letters || article.data.title.slice(0, 2)).toUpperCase();
}
