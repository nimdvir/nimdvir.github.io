import type { APIRoute } from "astro";

// Search engines and AI assistants are all welcome. The AI crawlers are named
// so the permission is explicit for each, not only implied by the wildcard.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "CCBot",
];

export const GET: APIRoute = ({ site }) => {
  const lines = [
    "# nimdvir.com: Nim Dvir's research, teaching, journalism and writing.",
    `# A plain-text guide for AI assistants: ${new URL("llms.txt", site)}`,
    "",
    "User-agent: *",
    "Allow: /",
    "",
    ...aiCrawlers.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
    `Sitemap: ${new URL("sitemap.xml", site)}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
