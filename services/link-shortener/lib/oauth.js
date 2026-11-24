// OAuth 2.1 sign-in for AI chats (Claude, ChatGPT, Gemini) that connect to /mcp.
// Nim approves each chat once with the admin passcode; the chat gets its own revocable token.
// Codes and tokens are stored only as SHA-256 hashes.
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { dbFetch } from "./db";

export const ACCESS_TTL_SECONDS = 30 * 24 * 3600;
export const REFRESH_TTL_SECONDS = 365 * 24 * 3600;
export const CODE_TTL_SECONDS = 10 * 60;
export const SCOPE = "links";

const admin = () => ({ adminSecret: process.env.SHORTENER_ADMIN_SECRET });

export const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");
export const sha256hex = (value) => createHash("sha256").update(String(value)).digest("hex");
export const pkceS256 = (verifier) => createHash("sha256").update(String(verifier)).digest("base64url");

export function originOf(request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = (request.headers.get("x-forwarded-proto") || "https").split(",")[0].trim();
  return `${proto}://${host}`;
}

export function passcodeMatches(given) {
  const expected = process.env.SHORTENER_ADMIN_SECRET || "";
  const a = Buffer.from(String(given || ""));
  const b = Buffer.from(expected);
  return Boolean(expected) && a.length === b.length && timingSafeEqual(a, b);
}

// Codes may only be sent back to the AI platforms (or a local test client).
export function redirectAllowed(uri) {
  let url;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.hash) return false;
  const host = url.hostname.toLowerCase();
  if (url.protocol === "http:") return host === "localhost" || host === "127.0.0.1";
  if (url.protocol !== "https:") return false;
  const under = (domain) => host === domain || host.endsWith("." + domain);
  return ["claude.ai", "claude.com", "anthropic.com", "chatgpt.com", "openai.com", "google.com"].some(under);
}

export function platformOf(host) {
  const h = String(host || "").toLowerCase();
  if (/(^|\.)(claude\.ai|claude\.com|anthropic\.com)$/.test(h)) return "claude";
  if (/(^|\.)(chatgpt\.com|openai\.com)$/.test(h)) return "chatgpt";
  if (/(^|\.)google\.com$/.test(h)) return "gemini";
  if (h === "localhost" || h === "127.0.0.1") return "test";
  return "ai";
}

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
  "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id, Mcp-Protocol-Version",
};

export function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS, ...extra },
  });
}

export const preflight = () => new Response(null, { status: 204, headers: CORS });

export function authServerMetadata(origin) {
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    registration_endpoint: `${origin}/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    scopes_supported: [SCOPE],
  };
}

export function protectedResourceMetadata(origin) {
  return {
    resource: `${origin}/mcp`,
    authorization_servers: [origin],
    scopes_supported: [SCOPE],
    bearer_methods_supported: ["header"],
    resource_name: "Nim Dvir short links",
  };
}

export async function getClient(clientId) {
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(String(clientId || ""))) return null;
  const rows = await dbFetch(
    "/rest/v1/shortener_oauth_clients?client_id=eq." + encodeURIComponent(clientId) +
      "&select=client_id,client_secret_hash,client_name,redirect_uris,redirect_host,token_endpoint_auth_method&limit=1",
    admin()
  );
  return rows?.[0] || null;
}

export async function touchClient(clientId) {
  await dbFetch("/rest/v1/shortener_oauth_clients?client_id=eq." + encodeURIComponent(clientId), {
    ...admin(),
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: { last_used_at: new Date().toISOString() },
  }).catch(() => {});
}

export async function registerClient({ clientName, redirectUris, authMethod }) {
  const clientId = "c_" + randomToken(18);
  const clientSecret = authMethod === "none" ? null : randomToken(32);
  await dbFetch("/rest/v1/shortener_oauth_clients", {
    ...admin(),
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: {
      client_id: clientId,
      client_secret_hash: clientSecret ? sha256hex(clientSecret) : null,
      client_name: clientName,
      redirect_uris: redirectUris,
      redirect_host: new URL(redirectUris[0]).hostname,
      token_endpoint_auth_method: authMethod,
    },
  });
  // Housekeeping: drop registrations that never finished signing in within a day.
  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  dbFetch("/rest/v1/shortener_oauth_clients?last_used_at=is.null&created_at=lt." + encodeURIComponent(dayAgo), {
    ...admin(),
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }).catch(() => {});
  return { clientId, clientSecret };
}

export async function createCode({ clientId, redirectUri, codeChallenge, scope, resource }) {
  const code = randomToken(32);
  await dbFetch("/rest/v1/shortener_oauth_codes", {
    ...admin(),
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: {
      code_hash: sha256hex(code),
      client_id: clientId,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      scope: scope || SCOPE,
      resource: resource || null,
      expires_at: new Date(Date.now() + CODE_TTL_SECONDS * 1000).toISOString(),
    },
  });
  return code;
}

// One-time: the code is deleted as it is read.
export async function takeCode(code) {
  const rows = await dbFetch("/rest/v1/shortener_oauth_codes?code_hash=eq." + sha256hex(code), {
    ...admin(),
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  return rows?.[0] || null;
}

function tokenPair() {
  const accessToken = randomToken(32);
  const refreshToken = randomToken(32);
  const now = Date.now();
  return {
    accessToken,
    refreshToken,
    row: {
      access_hash: sha256hex(accessToken),
      refresh_hash: sha256hex(refreshToken),
      access_expires_at: new Date(now + ACCESS_TTL_SECONDS * 1000).toISOString(),
      refresh_expires_at: new Date(now + REFRESH_TTL_SECONDS * 1000).toISOString(),
    },
  };
}

const tokenResponse = (pair, scope) => ({
  access_token: pair.accessToken,
  token_type: "Bearer",
  expires_in: ACCESS_TTL_SECONDS,
  refresh_token: pair.refreshToken,
  scope: scope || SCOPE,
});

export async function issueTokens({ clientId, scope, resource }) {
  const pair = tokenPair();
  await dbFetch("/rest/v1/shortener_oauth_tokens", {
    ...admin(),
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: { client_id: clientId, scope: scope || SCOPE, resource: resource || null, ...pair.row },
  });
  await touchClient(clientId);
  return tokenResponse(pair, scope);
}

// Refresh tokens rotate: the old pair stops working.
export async function refreshTokens({ clientId, refreshToken }) {
  const rows = await dbFetch(
    "/rest/v1/shortener_oauth_tokens?refresh_hash=eq." + sha256hex(refreshToken) +
      "&client_id=eq." + encodeURIComponent(clientId) + "&select=id,scope,refresh_expires_at&limit=1",
    admin()
  );
  const row = rows?.[0];
  if (!row || new Date(row.refresh_expires_at) < new Date()) return null;
  const pair = tokenPair();
  await dbFetch("/rest/v1/shortener_oauth_tokens?id=eq." + row.id, {
    ...admin(),
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: pair.row,
  });
  await touchClient(clientId);
  return tokenResponse(pair, row.scope);
}

// Returns { clientId, clientName, platform } for a valid bearer token, or null.
export async function authenticate(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+([A-Za-z0-9_-]{20,200})$/);
  if (!match) return null;
  const rows = await dbFetch(
    "/rest/v1/shortener_oauth_tokens?access_hash=eq." + sha256hex(match[1]) +
      "&select=client_id,access_expires_at,shortener_oauth_clients(client_name,redirect_host)&limit=1",
    admin()
  );
  const row = rows?.[0];
  if (!row || new Date(row.access_expires_at) < new Date()) return null;
  touchClient(row.client_id);
  const client = row.shortener_oauth_clients || {};
  return { clientId: row.client_id, clientName: client.client_name, platform: platformOf(client.redirect_host) };
}
