import { getCollection } from "astro:content";
import registry from "../data/tags.json";
import { verifiedResearch } from "../data/profile";
import { getPosts, getNews } from "./editorial";
import { getArticles, articleKindLabel } from "./articles";

export interface TagInfo {
  slug: string;
  label: string;
  group: string;
  description: string;
}

export interface TaggedEntry {
  title: string;
  url: string;
  summary: string;
  collection: string;
  kind: string;
  date: string;
  sortKey: string;
  tags: string[];
}

export function tagSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/\+/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const byLabel = new Map<string, TagInfo>();
const byAlias = new Map<string, TagInfo>();
for (const tag of registry.tags) {
  const info: TagInfo = {
    slug: tagSlug(tag.label),
    label: tag.label,
    group: tag.group,
    description: tag.description,
  };
  byLabel.set(tag.label.toLowerCase(), info);
  for (const alias of tag.aliases ?? [])
    byAlias.set(alias.toLowerCase(), info);
}

// Resolve a label as written in frontmatter to its canonical registry tag.
export function canonicalTag(label: string): TagInfo {
  const key = label.trim().toLowerCase();
  return (
    byLabel.get(key) ??
    byAlias.get(key) ?? {
      slug: tagSlug(label),
      label: label.trim(),
      group: "Other",
      description: "",
    }
  );
}

export function canonicalTags(labels: string[]): TagInfo[] {
  const seen = new Set<string>();
  const out: TagInfo[] = [];
  for (const label of labels) {
    const info = canonicalTag(label);
    if (seen.has(info.slug)) continue;
    seen.add(info.slug);
    out.push(info);
  }
  return out;
}

export const tagGroups = [...new Set(registry.tags.map((t) => t.group))];

// Every public page or listing entry that carries tags, across collections.
export async function collectTagged(): Promise<TaggedEntry[]> {
  const entries: TaggedEntry[] = [];
  for (const a of await getArticles()) {
    entries.push({
      title: a.data.title,
      url: `/articles/${a.slug}/`,
      summary: a.data.summary,
      collection: "Articles",
      kind: `${articleKindLabel(a.data.kind)} · ${a.data.source}`,
      date: a.data.date,
      sortKey: a.data.date,
      tags: a.data.tags,
    });
  }
  for (const post of await getPosts()) {
    entries.push({
      title: post.data.title,
      url: `/blog/${post.slug}/`,
      summary: post.data.summary,
      collection: "Blog",
      kind: post.data.category ? `Blog · ${post.data.category}` : "Blog",
      date: post.data.date,
      sortKey: post.data.date,
      tags: post.data.tags,
    });
  }
  for (const item of await getNews()) {
    const tags = (item.data as { tags?: string[] }).tags ?? [];
    if (!tags.length) continue;
    entries.push({
      title: item.data.title,
      url: item.data.inline ? `/news/#news-${item.slug}` : `/news/${item.slug}/`,
      summary: item.data.summary,
      collection: "News",
      kind: "News",
      date: item.data.date,
      sortKey: item.data.date,
      tags,
    });
  }
  for (const r of await getCollection("research")) {
    if (!verifiedResearch.includes(r.slug)) continue;
    entries.push({
      title: r.data.title,
      url: `/research/${r.slug}/`,
      summary: r.data.summary,
      collection: "Research",
      kind: r.data.category ? `Research · ${r.data.category}` : "Research",
      date: r.data.year,
      sortKey: `${r.data.year}-00-00`,
      tags: r.data.tags,
    });
  }
  for (const p of await getCollection("projects")) {
    entries.push({
      title: p.data.title,
      url: `/projects/${p.slug}/`,
      summary: p.data.summary,
      collection: "Projects",
      kind: `Project · ${p.data.category}`,
      date: p.data.year ?? "",
      sortKey: `${p.data.year ?? "0000"}-00-00`,
      tags: p.data.tags,
    });
  }
  for (const pub of await getCollection("publications")) {
    if (pub.data.draft || !pub.data.pageReady) continue;
    entries.push({
      title: pub.data.title,
      url: `/publications/${pub.slug}/`,
      summary: pub.data.summary ?? pub.data.venue,
      collection: "Publications",
      kind: `Publication · ${pub.data.venue}`,
      date: pub.data.year,
      sortKey: pub.data.publicationDate ?? `${pub.data.year}-00-00`,
      tags: pub.data.tags,
    });
  }
  return entries.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}

export interface TagArchive extends TagInfo {
  entries: TaggedEntry[];
}

// Tags that have at least one public entry, with their entries.
export async function tagArchives(): Promise<TagArchive[]> {
  const tagged = await collectTagged();
  const map = new Map<string, TagArchive>();
  for (const entry of tagged) {
    for (const info of canonicalTags(entry.tags)) {
      const archive = map.get(info.slug) ?? { ...info, entries: [] };
      archive.entries.push(entry);
      map.set(info.slug, archive);
    }
  }
  return [...map.values()].sort(
    (a, b) =>
      b.entries.length - a.entries.length || a.label.localeCompare(b.label),
  );
}
