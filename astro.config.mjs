// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Interview questions are paragraphs that are entirely bold. Give them the
// `qa-prompt` class (so the CSS can style them without catching a sentence
// that bolds one name) and an anchor, and list them for the article side
// navigation as remarkPluginFrontmatter.questions.
function markQaPrompts() {
  /** @param {any} node @returns {string} */
  const text = (node) => node.value ?? (node.children || []).map(text).join("");
  return (/** @type {any} */ tree, /** @type {any} */ file) => {
    const questions = [];
    for (const node of tree.children) {
      if (node.type !== "paragraph") continue;
      const kids = node.children.filter(
        (/** @type {any} */ c) => !(c.type === "text" && !c.value.trim()),
      );
      if (kids.length !== 1 || kids[0].type !== "strong") continue;
      const id = `q-${questions.length + 1}`;
      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, id, className: ["qa-prompt"] },
      };
      questions.push({ id, text: text(kids[0]).trim() });
    }
    if (file.data.astro?.frontmatter) file.data.astro.frontmatter.questions = questions;
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://nimdvir.com",
  base: "/",
  redirects: {
    "/about/": "/cv/",
    "/articles/": "/media/",
    "/news/": "/blog/",
    "/interviews/jamie-foxx/": "/articles/jamie-foxx/",
    "/interviews/jim-carrey/": "/articles/jim-carrey/",
    "/interviews/julia-louis-dreyfus/": "/articles/julia-louis-dreyfus/",
    "/interviews/lady-gaga/": "/articles/lady-gaga/",
    "/interviews/rupaul/": "/articles/rupaul/",
    "/interviews/michael-fassbender/": "/articles/michael-fassbender/",
  },
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith("/design/"),
      // Static page in public/, so the sitemap needs it listed explicitly.
      customPages: ["https://nimdvir.com/business-analytics-certificate/"],
    }),
  ],
  markdown: {
    remarkPlugins: [markQaPrompts],
  },
  devToolbar: {
    enabled: false,
  },
});
