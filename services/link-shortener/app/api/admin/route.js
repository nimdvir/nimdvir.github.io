import { NextResponse } from "next/server";
import { dbFetch, isAdminRequest } from "../../../lib/db";
import { cleanCreatedVia, validatePath, validateSlug, validateUrl } from "../../../lib/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getDashboard(secret) {
  const links = await dbFetch(
    "/rest/v1/short_links?select=id,slug,destination_url,link_type,title,is_active,click_count,last_clicked_at,created_via,created_at&order=created_at.desc",
    { adminSecret: secret }
  );
  const apps = await dbFetch(
    "/rest/v1/shortener_oauth_clients?select=client_id,client_name,redirect_host,created_at,last_used_at&order=created_at.desc",
    { adminSecret: secret }
  );
  const recentClicks = await dbFetch(
    "/rest/v1/short_link_clicks?select=id,link_id,clicked_at,referrer,device_type,browser,os,country,region,city&order=clicked_at.desc&limit=250",
    { adminSecret: secret }
  );

  return {
    links: links || [],
    apps: apps || [],
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
      const link_type = body.link_type === "path" ? "path" : "url";
      const destination_url = link_type === "path" ? validatePath(body.destination_url) : validateUrl(body.destination_url);
      const title = String(body.title || "").trim().slice(0, 160) || null;
      const created_via = cleanCreatedVia(body.created_via, "admin");

      const created = await dbFetch("/rest/v1/short_links", {
        method: "POST",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        body: { slug, destination_url, link_type, title, created_via },
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

    // Disconnect an AI chat: deleting its client also deletes its codes and tokens.
    if (action === "revoke_app") {
      const clientId = String(body.client_id || "");
      if (!/^[A-Za-z0-9_-]{8,80}$/.test(clientId)) throw new Error("Invalid app ID.");
      await dbFetch("/rest/v1/shortener_oauth_clients?client_id=eq." + encodeURIComponent(clientId), {
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
