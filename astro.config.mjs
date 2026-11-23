// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Mark paragraphs that are nothing but bold text (interview questions) so the
// CSS can style them without catching a sentence that bolds one name.
function markQaPrompts() {
  /** @param {any} node */
  const visit = (node) => {
    if (node.type === "element" && node.tagName === "p") {
      const kids = node.children.filter(
        (/** @type {any} */ c) => !(c.type === "text" && !c.value.trim()),
      );
      if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "strong") {
        const cls = node.properties.className || [];
        node.properties.className = [...cls, "qa-prompt"];
      }
    }
    (node.children || []).forEach(visit);
  };
  return (/** @type {any} */ tree) => visit(tree);
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
    rehypePlugins: [markQaPrompts],
  },
  devToolbar: {
    enabled: false,
  },
});
