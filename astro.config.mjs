// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nimdvir.com",
  base: "/",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/design") && !page.includes("/404-preview"),
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
