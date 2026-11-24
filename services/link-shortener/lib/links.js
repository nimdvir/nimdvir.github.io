// Link rules shared by the admin API and the AI connector (/mcp).
// The name rules mirror agent-hub/tools/copy-drive-link/short-link.ps1.
import { randomInt } from "node:crypto";
import { dbFetch } from "./db";

export const SLUG_RULE = /^[a-z0-9][a-z0-9_-]{0,47}$/;
export const RESERVED = new Set(["admin", "api", "mcp", "oauth", "_next", "favicon.ico", "robots.txt"]);
const CREATED_VIA = /^[a-z0-9-]{1,40}$/;

const FILLER = new Set(["the", "a", "an", "of", "and", "or", "for", "to", "in", "on", "at", "with", "by", "from",
  "copy", "final", "draft", "new", "old", "fall", "spring", "summer", "winter", "version"]);
const GENERIC = new Set(["readme", "index", "untitled", "document", "doc", "docs", "scan", "image", "img", "photo",
  "picture", "file", "notes", "main", "default", "test", "temp", "tmp", "export", "output", "screenshot"]);
const ADJECTIVES = ["sleepy", "brave", "fuzzy", "jolly", "tiny", "sunny", "lucky", "zesty", "witty", "bouncy",
  "cozy", "sneaky", "chill", "peppy", "dizzy", "grumpy", "humble", "snappy"];
const ANIMALS = ["otter", "panda", "llama", "koala", "gecko", "walrus", "puffin", "badger", "moose", "falcon",
  "yak", "lemur", "wombat", "narwhal", "alpaca", "ferret", "heron", "bison"];

export function validateSlug(value) {
  const slug = String(value || "").trim().toLowerCase();
  if (!SLUG_RULE.test(slug)) {
    throw new Error("Slug must be 1-48 characters using lowercase letters, numbers, hyphens, or underscores.");
  }
  if (RESERVED.has(slug)) throw new Error("That slug is reserved.");
  return slug;
}

export function validateUrl(value) {
  const url = new URL(String(value || "").trim());
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Destination must use http or https.");
  return url.toString();
}

// A local Windows path such as G:\My Drive\notes.md (surrounding quotes are dropped).
export function validatePath(value) {
  const path = String(value || "").trim().replace(/^"(.*)"$/, "$1").trim();
  if (!/^[A-Za-z]:[\\/]/.test(path)) throw new Error("Path must start with a drive letter, like G:\\.");
  if (path.length > 1000 || /[\u0000-\u001f]/.test(path)) throw new Error("That path is too long or has control characters.");
  return path;
}

export function cleanCreatedVia(value, fallback) {
  const v = String(value || "").trim().toLowerCase();
  return CREATED_VIA.test(v) ? v : fallback;
}

// Words from a file or folder name: dates, versions, long numbers and filler dropped.
function words(name) {
  let n = String(name || "").toLowerCase();
  n = n.replace(/\d{4}[-_. ]?\d{1,2}[-_. ]?\d{1,2}/g, " ");
  n = n.replace(/\d{1,2}[-_.]\d{1,2}[-_.]\d{2,4}/g, " ");
  n = n.replace(/'/g, "");
  n = n.replace(/[^a-z0-9]+/g, " ");
  return n.trim().split(/\s+/).filter((w) => w && !FILLER.has(w) && !/^v\d+$/.test(w) && !/^\d{4,}$/.test(w));
}

function stem(name) {
  const leaf = String(name || "").split(/[\\/]/).filter(Boolean).pop() || "";
  return leaf.replace(/\.[A-Za-z0-9]{1,6}$/, "");
}

// Suggest a free slug from a title or file name; generic names use the parent folder, then a funny pair.
export function suggestSlug(title, taken, parentName = "") {
  const isTaken = (s) => taken.has(s) || RESERVED.has(s);
  let w = words(stem(title));
  if (!w.some((x) => !GENERIC.has(x))) {
    const pw = words(parentName);
    w = pw.some((x) => !GENERIC.has(x)) ? pw : [];
  }
  w = w.slice(0, 3);
  if (w.length) {
    while (w.length > 1 && w.join("-").length > 24) w = w.slice(0, -1);
    let candidate = w.join("-");
    if (candidate.length > 24) candidate = candidate.slice(0, 24).replace(/[-_]+$/, "");
    if (!isTaken(candidate)) return candidate;
    for (let i = 2; i <= 9; i++) if (!isTaken(`${candidate}-${i}`)) return `${candidate}-${i}`;
  }
  for (let i = 0; i < 50; i++) {
    const funny = `${ADJECTIVES[randomInt(ADJECTIVES.length)]}-${ANIMALS[randomInt(ANIMALS.length)]}`;
    if (!isTaken(funny)) return funny;
  }
  return `link-${randomInt(1000, 10000)}`;
}

const adminSecret = () => process.env.SHORTENER_ADMIN_SECRET;

export async function fetchAllLinks() {
  return (
    (await dbFetch(
      "/rest/v1/short_links?select=id,slug,destination_url,link_type,title,is_active,click_count,created_via,created_at&order=created_at.desc",
      { adminSecret: adminSecret() }
    )) || []
  );
}

// Same decision as the right-click tool: the chosen name wins, nothing is reused silently.
export async function resolveAndCreate({ origin, destination, type, name, title, alsoCreate, createdVia }) {
  const raw = String(destination || "").trim();
  const linkType = type === "path" || (!type && /^[A-Za-z]:[\\/]/.test(raw)) ? "path" : "url";
  let dest;
  try {
    dest = linkType === "path" ? validatePath(raw) : validateUrl(raw);
  } catch (error) {
    return { status: "invalid", message: error.message };
  }

  const links = await fetchAllLinks();
  const sameDest = (l) => (l.link_type || "url") === linkType && (linkType === "path" ? l.destination_url.toLowerCase() === dest.toLowerCase() : l.destination_url === dest);
  const short = (slug) => `${origin}/${slug}`;

  let slug;
  if (name) {
    try {
      slug = validateSlug(name);
    } catch (error) {
      return { status: "invalid", message: error.message };
    }
    const existing = links.find((l) => l.slug === slug);
    if (existing) {
      if (sameDest(existing)) return { status: "exists-same", url: short(slug), slug };
      return { status: "taken", slug, message: `${short(slug)} is already used for another link.` };
    }
  } else {
    const parent = linkType === "path" ? dest.split(/[\\/]/).slice(-2, -1)[0] || "" : "";
    slug = suggestSlug(title || (linkType === "path" ? dest : ""), new Set(links.map((l) => l.slug)), parent);
  }

  const others = links.filter(sameDest).map((l) => l.slug);
  if (others.length && !alsoCreate) {
    return { status: "has-other", slug, existing: others.map(short), url: short(others[0]) };
  }

  const created = await dbFetch("/rest/v1/short_links", {
    method: "POST",
    adminSecret: adminSecret(),
    headers: { Prefer: "return=representation" },
    body: {
      slug,
      destination_url: dest,
      link_type: linkType,
      title: String(title || "").trim().slice(0, 160) || null,
      created_via: createdVia || null,
    },
  }).catch((error) => {
    if (/duplicate key|unique constraint/i.test(error.message)) return null;
    throw error;
  });
  if (!created) return { status: "taken", slug, message: `${short(slug)} is already used for another link.` };
  return { status: "created", url: short(slug), slug, destination: dest, type: linkType };
}
