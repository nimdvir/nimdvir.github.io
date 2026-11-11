// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nimdvir.com",
  base: "/",
  redirects: { "/about/": "/cv/" },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/design"),
      // Static page in public/, so the sitemap needs it listed explicitly.
      customPages: ["https://nimdvir.com/business-analytics-certificate/"],
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
