// Token endpoint: authorization code (with PKCE) and refresh token grants.
import { getClient, issueTokens, json, pkceS256, preflight, refreshTokens, sha256hex, takeCode } from "../../../lib/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error, description, status = 400) => json({ error, error_description: description }, status, { Pragma: "no-cache" });

async function readParams(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return new Map(Object.entries(await request.json()).map(([k, v]) => [k, String(v)]));
  return new Map(new URLSearchParams(await request.text()));
}

export async function POST(request) {
  let params;
  try {
    params = await readParams(request);
  } catch {
    return fail("invalid_request", "Unreadable body.");
  }

  // Client authentication: HTTP Basic, or client_id (+ client_secret) in the body.
  let clientId = params.get("client_id") || "";
  let clientSecret = params.get("client_secret") || "";
  const basic = (request.headers.get("authorization") || "").match(/^Basic\s+(.+)$/i);
  if (basic) {
    const [id, secret] = Buffer.from(basic[1], "base64").toString("utf8").split(":");
    clientId = decodeURIComponent(id || "");
    clientSecret = decodeURIComponent(secret || "");
  }
  const client = await getClient(clientId).catch(() => null);
  if (!client) return fail("invalid_client", "Unknown client.", 401);
  if (client.client_secret_hash && sha256hex(clientSecret) !== client.client_secret_hash) {
    return fail("invalid_client", "Wrong client secret.", 401);
  }

  try {
    const grant = params.get("grant_type");
    if (grant === "authorization_code") {
      const code = await takeCode(params.get("code") || "");
      if (!code || code.client_id !== client.client_id) return fail("invalid_grant", "Unknown or used code.");
      if (new Date(code.expires_at) < new Date()) return fail("invalid_grant", "Code expired.");
      if (params.has("redirect_uri") && code.redirect_uri !== params.get("redirect_uri")) return fail("invalid_grant", "redirect_uri does not match.");
      if (pkceS256(params.get("code_verifier") || "") !== code.code_challenge) return fail("invalid_grant", "PKCE check failed.");
      return json(await issueTokens({ clientId: client.client_id, scope: code.scope, resource: code.resource }), 200, { Pragma: "no-cache" });
    }
    if (grant === "refresh_token") {
      const tokens = await refreshTokens({ clientId: client.client_id, refreshToken: params.get("refresh_token") || "" });
      if (!tokens) return fail("invalid_grant", "Unknown or expired refresh token.");
      return json(tokens, 200, { Pragma: "no-cache" });
    }
    return fail("unsupported_grant_type", "Use authorization_code or refresh_token.");
  } catch {
    return fail("server_error", "Try again.", 500);
  }
}

export const OPTIONS = preflight;
