// Dynamic client registration (RFC 7591) for the AI chats.
import { json, preflight, redirectAllowed, registerClient } from "../../../lib/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const METHODS = new Set(["none", "client_secret_post", "client_secret_basic"]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_client_metadata", error_description: "Send JSON." }, 400);
  }
  const redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris.map(String) : [];
  if (!redirectUris.length || redirectUris.length > 10) {
    return json({ error: "invalid_redirect_uri", error_description: "Give 1 to 10 redirect_uris." }, 400);
  }
  const bad = redirectUris.find((uri) => !redirectAllowed(uri));
  if (bad) {
    return json({ error: "invalid_redirect_uri", error_description: `Redirect not allowed: ${bad}` }, 400);
  }
  const authMethod = METHODS.has(body.token_endpoint_auth_method) ? body.token_endpoint_auth_method : "none";
  const clientName = String(body.client_name || "AI chat").slice(0, 80);

  try {
    const { clientId, clientSecret } = await registerClient({ clientName, redirectUris, authMethod });
    return json(
      {
        client_id: clientId,
        client_id_issued_at: Math.floor(Date.now() / 1000),
        ...(clientSecret ? { client_secret: clientSecret, client_secret_expires_at: 0 } : {}),
        client_name: clientName,
        redirect_uris: redirectUris,
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: authMethod,
      },
      201
    );
  } catch {
    return json({ error: "server_error" }, 500);
  }
}

export const OPTIONS = preflight;
