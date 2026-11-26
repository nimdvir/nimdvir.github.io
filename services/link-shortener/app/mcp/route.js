// MCP connector for AI chats: create and list short links (no delete, no pause).
// Stateless Streamable HTTP: each request gets a fresh server; the bearer token is checked first.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { fetchAllLinks, resolveAndCreate } from "../../lib/links";
import { authenticate, CORS, originOf, preflight } from "../../lib/oauth";
import { PUBLIC_HOST, PUBLIC_ORIGIN, shortUrl, titledLine } from "../../lib/public-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INSTRUCTIONS = `Creates short links at ${PUBLIC_HOST} for Nim Dvir. Every new link is ${PUBLIC_ORIGIN}/<name>; older links on d.nimdvir.com and n.nimdvir.com keep working.
- Use create_short_link when Nim asks to shorten a link, a file or a path.
- Google Drive file: first get its link (https://drive.google.com/...) from the Google Drive connector, and pass the file name as title.
- A Windows path (G:\\...) becomes a link that shows the path as plain text.
- Always pass a title (the page or file name).
- Name: if Nim gave one, pass it exactly; if it's taken, ask Nim for another. Otherwise pass a short, clear, descriptive name you choose (2-3 words, e.g. "bitm330-syllabus"; try another if it's taken), or leave name out and the server suggests one from the title.
- Names are 1-48 lowercase letters, numbers, hyphens or underscores. If the destination already has a short link, ask before creating a second one.
- Reply with one line: Title - ${PUBLIC_ORIGIN}/<name> (the first line of the tool result). If Nim asks for only the link, reply with just the URL.
- This connector can't delete or pause links. For that, send Nim to ${PUBLIC_ORIGIN}/admin.`;

const text = (value, isError = false) => ({ content: [{ type: "text", text: value }], ...(isError ? { isError: true } : {}) });

function buildServer(auth) {
  const server = new McpServer({ name: "nimdvir-short-links", version: "1.0.0" }, { instructions: INSTRUCTIONS });

  server.registerTool(
    "create_short_link",
    {
      title: "Create short link",
      description:
        `Create a short link at ${PUBLIC_HOST}. Destination is a web link (https://...) or a Windows path (G:\\...). Leave name out to get a suggested name. The first line of the result is "Title - ${PUBLIC_ORIGIN}/<name>".`,
      inputSchema: {
        destination: z.string().min(1).max(2000).describe("Web link, or a Windows path like G:\\My Drive\\notes.md. For a Google Drive file, its drive.google.com link."),
        name: z.string().max(48).optional().describe(`The short name after ${PUBLIC_HOST}/: Nim's choice, or a short descriptive name you choose. Leave out to get a suggestion.`),
        title: z.string().max(160).optional().describe("File or page name. Used to suggest the name and shown in the admin page."),
        type: z.enum(["url", "path"]).optional().describe("Usually leave out: detected from the destination."),
        also_create: z.boolean().optional().describe("Only after Nim agrees: create this name even though the destination already has a short link."),
      },
      annotations: { title: "Create short link", readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ destination, name, title, type, also_create }) => {
      const r = await resolveAndCreate({
        destination,
        type,
        name,
        title,
        alsoCreate: Boolean(also_create),
        createdVia: auth.platform,
      });
      switch (r.status) {
        case "created":
          return text(`${titledLine(title, r.url)}\n${r.type === "path" ? "Shows the path" : "Opens"}: ${r.destination}\nURL only: ${r.url}`);
        case "exists-same":
          return text(`${titledLine(title, r.url)}\nThat link already points there. Use it.\nURL only: ${r.url}`);
        case "has-other":
          return text(
            `This destination already has ${r.existing.join(", ")}. Ask Nim: use that link, or also create ${shortUrl(r.slug)}? ` +
              `To create it, call again with name "${r.slug}" and also_create: true.`
          );
        case "taken":
          return text(`${r.message} Ask Nim for another name, or leave name out to get a free suggestion.`, true);
        default:
          return text(r.message || "Couldn't create the link.", true);
      }
    }
  );

  server.registerTool(
    "list_short_links",
    {
      title: "List short links",
      description: "List Nim's short links, newest first. Optionally filter by text in the name, title or destination.",
      inputSchema: {
        search: z.string().max(200).optional().describe("Text to look for."),
        limit: z.number().int().min(1).max(100).optional().describe("How many to return (default 25)."),
      },
      annotations: { title: "List short links", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ search, limit }) => {
      const q = String(search || "").toLowerCase();
      const links = (await fetchAllLinks())
        .filter((l) => !q || [l.slug, l.title, l.destination_url].some((v) => String(v || "").toLowerCase().includes(q)))
        .slice(0, limit || 25);
      if (!links.length) return text(q ? `No short links match "${search}".` : "No short links yet.");
      const lines = links.map(
        (l) =>
          `${shortUrl(l.slug)} -> ${l.destination_url}` +
          ` (${l.link_type === "path" ? "path" : "link"}${l.is_active ? "" : ", paused"}, ${l.click_count || 0} clicks` +
          `${l.title ? `, "${l.title}"` : ""}, ${String(l.created_at).slice(0, 10)})`
      );
      return text(lines.join("\n"));
    }
  );

  return server;
}

async function handle(request) {
  const origin = originOf(request);
  const auth = await authenticate(request).catch(() => null);
  if (!auth) {
    const hadToken = /^Bearer\s/i.test(request.headers.get("authorization") || "");
    return new Response(JSON.stringify({ error: hadToken ? "invalid_token" : "unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate":
          `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp"` + (hadToken ? ', error="invalid_token"' : ""),
        ...CORS,
      },
    });
  }

  const server = buildServer(auth);
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
export const OPTIONS = preflight;
