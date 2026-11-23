import { timingSafeEqual } from "node:crypto";

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error("Missing environment variable: " + name);
  return value;
}

export function isAdminRequest(request) {
  const given = request.headers.get("x-admin-secret") || "";
  const expected = process.env.SHORTENER_ADMIN_SECRET || "";
  if (!given || !expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function dbFetch(path, options = {}) {
  const url = env("SUPABASE_URL") + path;
  const headers = {
    apikey: env("SUPABASE_PUBLISHABLE_KEY"),
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (options.adminSecret) {
    headers["x-shortener-admin"] = options.adminSecret;
  }
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error("Supabase request failed (" + response.status + "): " + detail.slice(0, 500));
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function parseUserAgent(ua = "") {
  const value = ua.toLowerCase();
  let device = "desktop";
  if (/ipad|tablet|kindle/.test(value)) device = "tablet";
  else if (/mobi|iphone|android/.test(value)) device = "mobile";

  let browser = "other";
  if (value.includes("edg/")) browser = "Edge";
  else if (value.includes("chrome/") || value.includes("crios/")) browser = "Chrome";
  else if (value.includes("firefox/") || value.includes("fxios/")) browser = "Firefox";
  else if (value.includes("safari/")) browser = "Safari";

  let os = "other";
  if (value.includes("windows")) os = "Windows";
  else if (value.includes("iphone") || value.includes("ipad") || value.includes("ios")) os = "iOS";
  else if (value.includes("android")) os = "Android";
  else if (value.includes("mac os") || value.includes("macintosh")) os = "macOS";
  else if (value.includes("linux")) os = "Linux";

  return { device, browser, os };
}
