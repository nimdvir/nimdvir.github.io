import { dbFetch, parseUserAgent } from "../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound(slug) {
  return new Response(
    "<!doctype html><html><head><meta name=\"robots\" content=\"noindex\"><title>Link not found</title></head><body style=\"font-family:system-ui;padding:3rem\"><h1>Link not found</h1><p>No active short link exists for <code>/" +
      slug.replace(/[<>&\"']/g, "") +
      "</code>.</p><p><a href=\"https://www.nimdvir.com\">www.nimdvir.com</a></p></body></html>",
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

export async function GET(request, context) {
  const params = await context.params;
  const slug = String(params.slug || "").trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9_-]{0,47}$/.test(slug)) return notFound(slug);

  let links;
  try {
    links = await dbFetch(
      "/rest/v1/short_links?slug=eq." + encodeURIComponent(slug) + "&is_active=eq.true&select=id,destination_url&limit=1"
    );
  } catch {
    return new Response("Short-link service unavailable.", { status: 503 });
  }

  const link = links?.[0];
  if (!link) return notFound(slug);

  const ua = request.headers.get("user-agent") || "";
  const parsed = parseUserAgent(ua);

  try {
    await dbFetch("/rest/v1/short_link_clicks", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: {
        link_id: link.id,
        referrer: (request.headers.get("referer") || "").slice(0, 2000) || null,
        user_agent: ua.slice(0, 2000) || null,
        device_type: parsed.device,
        browser: parsed.browser,
        os: parsed.os,
        country: request.headers.get("x-vercel-ip-country") || null,
        region: request.headers.get("x-vercel-ip-country-region") || null,
        city: request.headers.get("x-vercel-ip-city") || null,
      },
    });
  } catch {
    // A logging failure should never stop the redirect.
  }

  try {
    const destination = new URL(link.destination_url);
    if (!["http:", "https:"].includes(destination.protocol)) return notFound(slug);
    return new Response(null, {
      status: 302,
      headers: {
        Location: destination.toString(),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return notFound(slug);
  }
}
