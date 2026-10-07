import { NextResponse } from "next/server";
import { dbFetch, isAdminRequest } from "../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESERVED = new Set(["admin", "api", "_next", "favicon.ico", "robots.txt"]);

function validateSlug(value) {
  const slug = String(value || "").trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{0,47}$/.test(slug)) {
    throw new Error("Slug must be 1-48 characters using lowercase letters, numbers, hyphens, or underscores.");
  }
  if (RESERVED.has(slug)) throw new Error("That slug is reserved.");
  return slug;
}

function validateUrl(value) {
  const url = new URL(String(value || "").trim());
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Destination must use http or https.");
  return url.toString();
}

async function getDashboard(secret) {
  const links = await dbFetch(
    "/rest/v1/short_links?select=id,slug,destination_url,title,is_active,click_count,last_clicked_at,created_at&order=created_at.desc",
    { adminSecret: secret }
  );
  const recentClicks = await dbFetch(
    "/rest/v1/short_link_clicks?select=id,link_id,clicked_at,referrer,device_type,browser,os,country,region,city&order=clicked_at.desc&limit=250",
    { adminSecret: secret }
  );

  return {
    links: links || [],
    recentClicks: recentClicks || [],
    summary: {
      links: (links || []).length,
      active: (links || []).filter((link) => link.is_active).length,
      totalClicks: (links || []).reduce((sum, link) => sum + Number(link.click_count || 0), 0),
      recentClicks: (recentClicks || []).length,
    },
  };
}

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = request.headers.get("x-admin-secret");
    return NextResponse.json(await getDashboard(secret));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = request.headers.get("x-admin-secret");
  try {
    const body = await request.json();
    const action = body.action || "create";

    if (action === "create") {
      const slug = validateSlug(body.slug);
      const destination_url = validateUrl(body.destination_url);
      const title = String(body.title || "").trim().slice(0, 160) || null;

      const created = await dbFetch("/rest/v1/short_links", {
        method: "POST",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        body: { slug, destination_url, title },
      });
      return NextResponse.json({ ok: true, link: created?.[0] || null });
    }

    if (action === "toggle") {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id < 1) throw new Error("Invalid link ID.");
      const updated = await dbFetch("/rest/v1/short_links?id=eq." + id, {
        method: "PATCH",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        body: { is_active: Boolean(body.is_active) },
      });
      return NextResponse.json({ ok: true, link: updated?.[0] || null });
    }

    if (action === "delete") {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id < 1) throw new Error("Invalid link ID.");
      await dbFetch("/rest/v1/short_links?id=eq." + id, {
        method: "DELETE",
        adminSecret: secret,
        headers: { Prefer: "return=minimal" },
      });
      return NextResponse.json({ ok: true });
    }

    throw new Error("Unknown action.");
  } catch (error) {
    const status = /duplicate key|unique constraint/i.test(error.message) ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
