import { NextResponse } from "next/server";
import { dbFetch, isAdminRequest } from "../../../lib/db";
import { cleanCreatedVia, validatePath, validateSlug, validateUrl } from "../../../lib/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LINK_FIELDS = "id,slug,destination_url,link_type,title,is_active,click_count,last_clicked_at,created_via,created_at";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Topic is optional free text (e.g. "BITM 330"). Empty means no topic.
function cleanTopic(value) {
  const topic = String(value || "").replace(/\s+/g, " ").trim();
  if (topic.length > 40) throw new Error("Topic must be 40 characters or fewer.");
  return topic || null;
}

function cleanTitle(value) {
  return String(value || "").trim().slice(0, 160) || null;
}

async function getLinks(secret) {
  const path = (fields) => "/rest/v1/short_links?select=" + fields + "&order=created_at.desc";
  try {
    return { links: await dbFetch(path(LINK_FIELDS + ",topic"), { adminSecret: secret }), topics: true };
  } catch (error) {
    // Until the topic column is added (supabase/schema.sql), keep the dashboard working without it.
    if (!/topic/.test(error.message)) throw error;
    return { links: await dbFetch(path(LINK_FIELDS), { adminSecret: secret }), topics: false };
  }
}

async function getDashboard(secret) {
  const { links = [], topics } = await getLinks(secret);
  const apps = await dbFetch(
    "/rest/v1/shortener_oauth_clients?select=client_id,client_name,redirect_host,created_at,last_used_at&order=created_at.desc",
    { adminSecret: secret }
  );
  const since = new Date(Date.now() - WEEK_MS).toISOString();
  const weekRows = await dbFetch(
    "/rest/v1/short_link_clicks?select=link_id&clicked_at=gte." + encodeURIComponent(since) + "&limit=20000",
    { adminSecret: secret }
  );
  const week = {};
  for (const row of weekRows || []) week[row.link_id] = (week[row.link_id] || 0) + 1;

  const list = (links || []).map((link) => ({ ...link, week_clicks: week[link.id] || 0 }));
  return {
    links: list,
    apps: apps || [],
    topicsEnabled: topics,
    summary: {
      links: list.length,
      active: list.filter((link) => link.is_active).length,
      totalClicks: list.reduce((sum, link) => sum + Number(link.click_count || 0), 0),
      weekClicks: (weekRows || []).length,
    },
  };
}

// Clicks for one link, newest first (shown when a link is opened on the admin page).
async function getLinkClicks(secret, id) {
  return dbFetch(
    "/rest/v1/short_link_clicks?select=id,clicked_at,referrer,device_type,browser,os,country,region,city" +
      "&link_id=eq." + id + "&order=clicked_at.desc&limit=200",
    { adminSecret: secret }
  );
}

function linkId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new Error("Invalid link ID.");
  return id;
}

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = request.headers.get("x-admin-secret");
    const link = new URL(request.url).searchParams.get("link");
    if (link) return NextResponse.json({ clicks: (await getLinkClicks(secret, linkId(link))) || [] });
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
      const title = cleanTitle(body.title);
      const created_via = cleanCreatedVia(body.created_via, "admin");
      const topic = cleanTopic(body.topic);

      const created = await dbFetch("/rest/v1/short_links", {
        method: "POST",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        // Send topic only when given, so creating still works before the column exists.
        body: { slug, destination_url, link_type, title, created_via, ...(topic ? { topic } : {}) },
      });
      return NextResponse.json({ ok: true, link: created?.[0] || null });
    }

    if (action === "update") {
      const id = linkId(body.id);
      const changes = {};
      if ("title" in body) changes.title = cleanTitle(body.title);
      if ("topic" in body) changes.topic = cleanTopic(body.topic);
      if (!Object.keys(changes).length) throw new Error("Nothing to update.");
      const updated = await dbFetch("/rest/v1/short_links?id=eq." + id, {
        method: "PATCH",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        body: changes,
      });
      return NextResponse.json({ ok: true, link: updated?.[0] || null });
    }

    if (action === "toggle") {
      const id = linkId(body.id);
      const updated = await dbFetch("/rest/v1/short_links?id=eq." + id, {
        method: "PATCH",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        body: { is_active: Boolean(body.is_active) },
      });
      return NextResponse.json({ ok: true, link: updated?.[0] || null });
    }

    if (action === "delete") {
      const id = linkId(body.id);
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
