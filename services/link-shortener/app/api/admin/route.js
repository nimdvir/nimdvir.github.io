import { NextResponse } from "next/server";
import { dbFetch, isAdminRequest } from "../../../lib/db";
import { cleanCreatedVia, validatePath, validateSlug, validateUrl } from "../../../lib/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LINK_FIELDS =
  "id,slug,destination_url,link_type,title,topic,position,archived_at,is_active,click_count,last_clicked_at,created_via,created_at";
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

async function getDashboard(secret) {
  const links = await dbFetch("/rest/v1/short_links?select=" + LINK_FIELDS + "&order=created_at.desc", { adminSecret: secret });
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
  const current = list.filter((link) => !link.archived_at);
  return {
    links: list,
    apps: apps || [],
    summary: {
      links: current.length,
      active: current.filter((link) => link.is_active).length,
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
        body: { slug, destination_url, link_type, title, created_via, topic },
      });
      return NextResponse.json({ ok: true, link: created?.[0] || null });
    }

    if (action === "update") {
      const id = linkId(body.id);
      const changes = {};
      if ("slug" in body) changes.slug = validateSlug(body.slug);
      if ("destination_url" in body) {
        changes.link_type = body.link_type === "path" ? "path" : "url";
        changes.destination_url = changes.link_type === "path" ? validatePath(body.destination_url) : validateUrl(body.destination_url);
      }
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

    // Archived links leave the main list but keep redirecting.
    if (action === "archive") {
      const id = linkId(body.id);
      const updated = await dbFetch("/rest/v1/short_links?id=eq." + id, {
        method: "PATCH",
        adminSecret: secret,
        headers: { Prefer: "return=representation" },
        body: { archived_at: body.archived ? new Date().toISOString() : null },
      });
      return NextResponse.json({ ok: true, link: updated?.[0] || null });
    }

    // Drag-and-drop order: [{ id, position }] for the links whose place changed.
    if (action === "reorder") {
      const order = Array.isArray(body.order) ? body.order : [];
      if (!order.length || order.length > 1000) throw new Error("Invalid order.");
      const rows = order.map((row) => ({ id: linkId(row.id), position: Number(row.position) }));
      if (rows.some((row) => !Number.isInteger(row.position) || row.position < 0)) throw new Error("Invalid position.");
      for (let i = 0; i < rows.length; i += 20) {
        await Promise.all(rows.slice(i, i + 20).map((row) =>
          dbFetch("/rest/v1/short_links?id=eq." + row.id, {
            method: "PATCH",
            adminSecret: secret,
            headers: { Prefer: "return=minimal" },
            body: { position: row.position },
          })
        ));
      }
      return NextResponse.json({ ok: true });
    }

    // Rename a topic (group) on every link that has it; an empty name removes the topic.
    if (action === "rename_topic") {
      const from = cleanTopic(body.from);
      if (!from) throw new Error("Choose a topic to rename.");
      const to = cleanTopic(body.to);
      await dbFetch("/rest/v1/short_links?topic=eq." + encodeURIComponent(from), {
        method: "PATCH",
        adminSecret: secret,
        headers: { Prefer: "return=minimal" },
        body: { topic: to },
      });
      return NextResponse.json({ ok: true });
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
