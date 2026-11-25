// Builds /llms.txt and /llms-full.txt: plain Markdown guides to this site for
// AI assistants and AI search (https://llmstxt.org). Everything comes from the
// same content collections the pages use, so the guides stay current.
import { getCollection } from "astro:content";
import { getPosts } from "./editorial";
import { getArticles, articleKindLabel } from "./articles";
import { getPublications } from "./publications";
import { verifiedResearch, socialLinks } from "../data/profile";
import cvSource from "../data/cv-public.md?raw";

const SITE = "https://nimdvir.com";
const link = (path: string) => new URL(path, SITE).href;
const clean = (text = "") => text.replace(/\s+/g, " ").trim();
const item = (title: string, path: string, note?: string) =>
  `- [${clean(title)}](${link(path)})${note ? `: ${clean(note)}` : ""}`;
// Content bodies, minus HTML and image lines, for the full guide.
const plainBody = (body: string) =>
  body
    .replace(/<[^>]+>/g, "")
    .replace(/^\[?!\[.*$/gm, "")
    .replace(/^(#{1,3}) /gm, (_, h) => `${"#".repeat(h.length + 2)} `)
    .replace(/\]\((\/[^)\s]*)\)/g, (_, path) => `](${link(path)})`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

async function load() {
  const research = (await getCollection("research"))
    .filter((e) => verifiedResearch.includes(e.slug))
    .sort((a, b) => (a.data.sortOrder ?? 99) - (b.data.sortOrder ?? 99));
  const projects = (await getCollection("projects")).sort(
    (a, b) => (a.data.sortOrder ?? 99) - (b.data.sortOrder ?? 99),
  );
  const publications = (await getPublications()).filter((p) => p.data.pageReady);
  const posts = await getPosts();
  const articles = (await getArticles()).sort((a, b) =>
    b.data.date.localeCompare(a.data.date),
  );
  return { research, projects, publications, posts, articles };
}

const header = `# Nim Dvir

> Nim Dvir (Nimrod Dvir, Ph.D.) is a Lecturer in Information Systems and Business Analytics at the Massry School of Business, University at Albany, SUNY. He studies how people read, interpret and use information, with a focus on language, information engagement and decision-making. He teaches information systems, databases, business analytics and programming. Before academia he worked as a journalist and editor in Israel and New York, and in digital product development and UX research.

Key facts:

- Name: Nim Dvir. Also written Nimrod Dvir, or Nimrod (Nim) Dvir, Ph.D.
- Position: Lecturer, Department of Information Systems and Business Analytics, Massry School of Business, University at Albany, SUNY (since August 2025; Visiting Assistant Professor there 2021 to 2025).
- Education: Ph.D. in Computer and Information Science, University at Albany (2022), dissertation "Sticky Words: A Computational Linguistics Approach"; M.B.A., Baruch College, CUNY; B.A., New York University; B.A., Open University of Israel.
- Research areas: information engagement, computational linguistics and NLP, human-computer interaction, UX research, AI in teaching and learning, and language in mental health treatment courts.
- Teaching: BITM 330 (Improving Business Performance with Information Technologies), BITM 522 (Managing Information Technology), ISBA 434 (Business Analytics Practicum), INF 401/501 (Case Studies in Digital Citizenship), Python programming. Directs UAlbany's Undergraduate Certificate in Business Analytics.
- Languages: English and Hebrew.
- The journalism on this site is English translation of articles first published in Hebrew; each page links the original.`;

const mainPages = [
  item("Home", "/", "Overview, current work and recent posts"),
  item("CV", "/cv/", "Complete curriculum vitae: appointments, education, publications, teaching, awards, service and media"),
  item("Research and projects", "/research/", "Current research, publications, working papers, talks, and UX and design projects"),
  item("Teaching", "/teaching/", "Courses, courseware, student projects and the business analytics certificate"),
  item("Undergraduate Business Analytics Certificate", "/business-analytics-certificate/", "Requirements and FAQ for UAlbany's certificate, which Nim directs"),
  item("Media", "/media/", "Journalism, interviews and television appearances, translated from Hebrew"),
  item("Blog", "/blog/", "Posts on teaching, research and the occasional poster with his name on it"),
  item("Topics", "/tags/", "Every page on the site grouped by topic"),
  item("Contact", "/contact/", "How to reach Nim"),
];

const profiles = socialLinks
  .filter((l) => l.href.startsWith("https://") && !l.href.startsWith(SITE))
  .map((l) => `- [${l.label}](${l.href})`);

export async function llmsTxt() {
  const { research, projects, publications, posts, articles } = await load();
  return [
    header,
    "## Main pages",
    mainPages.join("\n"),
    "## Research",
    research.map((r) => item(r.data.title, `/research/${r.slug}/`, r.data.summary)).join("\n"),
    "## Publications",
    publications
      .map((p) => item(p.data.title, `/publications/${p.slug}/`, `${p.data.authors.join(", ")} (${p.data.year}). ${p.data.venue}.`))
      .join("\n"),
    "## Design and UX projects",
    projects.map((p) => item(p.data.title, `/projects/${p.slug}/`, p.data.summary)).join("\n"),
    "## Blog",
    posts.map((p) => item(p.data.title, `/blog/${p.slug}/`, `${p.data.date}. ${p.data.summary}`)).join("\n"),
    "## Journalism (selected, translated from Hebrew)",
    articles
      .slice(0, 25)
      .map((a) => item(a.data.title, `/articles/${a.slug}/`, `${articleKindLabel(a.data.kind)}, ${a.data.source}, ${a.data.date.slice(0, 4)}`))
      .join("\n"),
    `All ${articles.length} articles are listed on the [Media page](${link("/media/")}) and in [llms-full.txt](${link("/llms-full.txt")}).`,
    "## Profiles elsewhere",
    profiles.join("\n"),
    "## Optional",
    [
      item("llms-full.txt", "/llms-full.txt", "The full CV and every research, project, blog and article summary in one file"),
      item("Sitemap", "/sitemap.xml"),
      item("RSS feed", "/rss.xml"),
    ].join("\n"),
    "",
  ].join("\n\n");
}

export async function llmsFullTxt() {
  const { research, projects, publications, posts, articles } = await load();
  const cv = cvSource.slice(cvSource.indexOf("## Academic Appointments"));
  const section = (title: string, body: string) => `## ${title}\n\n${body}`;
  const entry = (title: string, path: string, meta: string[], body: string) =>
    [`### ${clean(title)}`, `URL: ${link(path)}`, ...meta.filter(Boolean), "", plainBody(body)].join("\n");
  return [
    header,
    section("Main pages", mainPages.join("\n")),
    section("Profiles elsewhere", profiles.join("\n")),
    section(
      "Research",
      research
        .map((r) => entry(r.data.title, `/research/${r.slug}/`, [r.data.status ? `Status: ${r.data.status}` : "", `Summary: ${clean(r.data.summary)}`], r.body))
        .join("\n\n"),
    ),
    section(
      "Publications",
      publications
        .map((p) =>
          entry(
            p.data.title,
            `/publications/${p.slug}/`,
            [
              `Authors: ${p.data.authors.join(", ")}`,
              `Year: ${p.data.year}`,
              `Venue: ${p.data.venue}`,
              p.data.doi ? `DOI: ${p.data.doi}` : "",
            ],
            p.data.abstract ?? p.data.summary,
          ),
        )
        .join("\n\n"),
    ),
    section(
      "Design and UX projects",
      projects
        .map((p) => entry(p.data.title, `/projects/${p.slug}/`, [`Summary: ${clean(p.data.summary)}`], p.body))
        .join("\n\n"),
    ),
    section(
      "Blog posts",
      posts
        .map((p) => entry(p.data.title, `/blog/${p.slug}/`, [`Date: ${p.data.date}`, `Summary: ${clean(p.data.summary)}`], p.body))
        .join("\n\n"),
    ),
    section(
      "Journalism (English translations of Hebrew articles)",
      articles
        .map((a) =>
          [
            `### ${clean(a.data.title)}`,
            `URL: ${link(`/articles/${a.slug}/`)}`,
            `Type: ${articleKindLabel(a.data.kind)}. Published in ${a.data.source}, ${a.data.date}.`,
            `Original: ${a.data.sourceUrl}`,
            "",
            clean(a.data.summary),
          ].join("\n"),
        )
        .join("\n\n"),
    ),
    section("Curriculum vitae", cv.replace(/^## /gm, "### ").trim()),
    "",
  ].join("\n\n");
}
