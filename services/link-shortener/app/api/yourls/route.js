// YOURLS-compatible endpoint, so tools that speak the YOURLS API (such as the tmplat browser
// extension) can create short links here. Only `action=shorturl` is supported.
//
// Auth is YOURLS "advanced" mode: the client sends `timestamp` and `signature`, where
// signature = sha256(timestamp + YOURLS_SIGNATURE) (or md5 when `hash` is not given), so the
// token itself never travels. Signatures expire after 12 hours, like YOURLS.
import { createHash, timingSafeEqual } from "node:crypto";
import { resolveAndCreate } from "../../../lib/links";
import { originOf } from "../../../lib/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE_SECONDS = 12 * 3600;

function reply(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const fail = (code, message, status) => reply({ status: "fail", code, message, statusCode: status }, status);

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

function signatureValid(params) {
  const token = process.env.YOURLS_SIGNATURE || "";
  const timestamp = params.get("timestamp") || "";
  const signature = (params.get("signature") || "").toLowerCase();
  const hash = (params.get("hash") || "md5").toLowerCase();
  if (!token || !/^\d{1,12}$/.test(timestamp) || !signature) return false;
  if (!["md5", "sha1", "sha256", "sha512"].includes(hash)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_AGE_SECONDS) return false;
  const expected = createHash(hash).update(timestamp + token).digest("hex");
  return safeEqual(signature, expected);
}

// A readable name from the URL: the last path part, falling back to the site name.
function titleFromUrl(raw) {
  try {
    const url = new URL(raw);
    // Skip action words (".../edit") and opaque IDs (".../1aB2c3...") at the end of the path.
    const parts = url.pathname.split("/").filter(Boolean).map((p) => decodeURIComponent(p).replace(/\.[a-z0-9]{1,5}$/i, ""));
    const useful = parts.filter((p) => !/^(edit|view|preview|watch|index|home|default|d|u|\d+)$/i.test(p) && !/^[A-Za-z0-9_-]{20,}$/.test(p));
    const last = useful.pop() || "";
    const site = url.hostname.replace(/^www\./, "").split(".").slice(0, -1).join(" ");
    return { title: last.replace(/[-_+]+/g, " "), parent: site };
  } catch {
    return { title: "", parent: "" };
  }
}

async function handle(params, request) {
  if (!signatureValid(params)) return fail("error:auth", "Please log in", 403);
  if ((params.get("action") || "") !== "shorturl") return fail("error:action", "Only action=shorturl is supported", 400);

  const destination = params.get("url") || "";
  const { title, parent } = titleFromUrl(destination);
  let r;
  try {
    r = await resolveAndCreate({
      origin: originOf(request),
      destination,
      // Paths are not accepted here; only web links.
      type: "url",
      name: params.get("keyword") || "",
      // suggestSlug uses the title first, then the parent name if the title is generic.
      title: title || parent,
      createdVia: "tmplat",
    });
  } catch (error) {
    return fail("error:db", "Could not create the short link: " + error.message, 500);
  }

  // Like YOURLS with unique URLs: a destination that already has a short link gets that link back.
  if (r.status === "has-other") return reply({ status: "success", code: "", message: "Existing short link", shorturl: r.url, url: { url: destination } });
  if (r.status === "created" || r.status === "exists-same") {
    return reply({ status: "success", code: "", message: "Short link created", shorturl: r.url, url: { keyword: r.slug, url: destination } });
  }
  if (r.status === "taken") return fail("error:keyword", r.message, 400);
  return fail("error:url", r.message || "Invalid URL", 400);
}

export async function POST(request) {
  const type = request.headers.get("content-type") || "";
  const params = type.includes("application/json")
    ? new URLSearchParams(Object.entries(await request.json().catch(() => ({}))).map(([k, v]) => [k, String(v)]))
    : new URLSearchParams(await request.text());
  return handle(params, request);
}

export async function GET(request) {
  return handle(new URL(request.url).searchParams, request);
}
