// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nimdvir.com",
  base: "/",
  redirects: {
    "/about/": "/cv/",
    "/interviews/jamie-foxx/": "/articles/jamie-foxx/",
    "/interviews/jim-carrey/": "/articles/jim-carrey/",
    "/interviews/julia-louis-dreyfus/": "/articles/julia-louis-dreyfus/",
    "/interviews/lady-gaga/": "/articles/lady-gaga/",
    "/interviews/rupaul/": "/articles/rupaul/",
    "/interviews/michael-fassbender/": "/articles/michael-fassbender/",
  },
  integrations: [
    sitemap({
      filter: (page) => page !== "https://nimdvir.com/design/",
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
