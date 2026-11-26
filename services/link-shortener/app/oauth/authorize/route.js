// Approval page: Nim allows an AI chat to create and list short links by typing the admin passcode.
import { createCode, getClient, originOf, passcodeMatches, SCOPE } from "../../../lib/oauth";
import { PUBLIC_HOST } from "../../../lib/public-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = ["response_type", "client_id", "redirect_uri", "code_challenge", "code_challenge_method", "state", "scope", "resource"];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function page(body, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Connect a chat to short links</title>
<style>
:root{color-scheme:dark;--bg:#0d1017;--card:#161b25;--line:#2b3344;--text:#eef1f6;--muted:#a9b2c3;--accent:#775cff;--bad:#ff7a7a}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:28px;max-width:440px;width:100%;box-sizing:border-box}
h1{font-size:1.3rem;margin:0 0 8px}p{color:var(--muted);margin:0 0 14px}strong{color:var(--text)}
label{display:grid;gap:6px;margin:18px 0 6px;font-size:.92rem;color:var(--muted)}
input[type=password]{font:inherit;padding:11px 12px;border-radius:10px;border:1px solid var(--line);background:#0f131b;color:var(--text)}
.row{display:flex;gap:10px;margin-top:16px}button{font:inherit;padding:10px 16px;border-radius:10px;border:1px solid transparent;cursor:pointer}
.allow{background:var(--accent);color:#fff;flex:1}.deny{background:transparent;color:var(--text);border-color:var(--line)}
.error{color:var(--bad)}ul{color:var(--muted);padding-left:20px;margin:0 0 6px}
</style></head><body><div class="card">${body}</div></body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action *; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
    },
  });
}

const errorPage = (message, status = 400) => page(`<h1>Can't connect</h1><p class="error">${esc(message)}</p>`, status);

function redirectTo(redirectUri, params) {
  const url = new URL(redirectUri);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  return new Response(null, { status: 302, headers: { Location: url.toString(), "Cache-Control": "no-store" } });
}

async function check(values) {
  const client = await getClient(values.client_id).catch(() => null);
  if (!client) return { error: errorPage("This chat isn't registered. Start the connection again from the chat app.") };
  if (!client.redirect_uris.includes(values.redirect_uri)) return { error: errorPage("The return address doesn't match this chat's registration.") };
  if (values.response_type !== "code") return { client, redirect: { error: "unsupported_response_type" } };
  if (!values.code_challenge || values.code_challenge_method !== "S256") return { client, redirect: { error: "invalid_request", error_description: "PKCE S256 is required." } };
  return { client };
}

function form(values, client, message) {
  const hidden = FIELDS.map((f) => `<input type="hidden" name="${f}" value="${esc(values[f])}">`).join("");
  const host = new URL(values.redirect_uri).hostname;
  return page(`<h1>Connect ${esc(client.client_name || "an AI chat")}?</h1>
<p>It's asking from <strong>${esc(host)}</strong> to use your short links at ${PUBLIC_HOST}. It will be able to:</p>
<ul><li>create short links</li><li>list your short links</li></ul>
<p>It can't delete or pause links. You can disconnect it anytime in the admin page.</p>
<form method="post" action="/oauth/authorize">${hidden}
<label>Admin passcode<input type="password" name="passcode" autocomplete="current-password" autofocus required></label>
${message ? `<p class="error">${esc(message)}</p>` : ""}
<div class="row"><button class="allow" name="decision" value="allow">Allow</button><button class="deny" name="decision" value="deny" formnovalidate>Deny</button></div>
</form>`, message ? 401 : 200);
}

export async function GET(request) {
  const url = new URL(request.url);
  const values = Object.fromEntries(FIELDS.map((f) => [f, url.searchParams.get(f) || ""]));
  const result = await check(values);
  if (result.error) return result.error;
  if (result.redirect) return redirectTo(values.redirect_uri, { ...result.redirect, state: values.state });
  return form(values, result.client);
}

export async function POST(request) {
  const data = await request.formData();
  const values = Object.fromEntries(FIELDS.map((f) => [f, String(data.get(f) || "")]));
  const result = await check(values);
  if (result.error) return result.error;
  if (result.redirect) return redirectTo(values.redirect_uri, { ...result.redirect, state: values.state });

  const iss = originOf(request);
  if (data.get("decision") !== "allow") return redirectTo(values.redirect_uri, { error: "access_denied", state: values.state, iss });
  if (!passcodeMatches(data.get("passcode"))) return form(values, result.client, "That passcode is wrong.");

  const code = await createCode({
    clientId: result.client.client_id,
    redirectUri: values.redirect_uri,
    codeChallenge: values.code_challenge,
    scope: values.scope || SCOPE,
    resource: values.resource,
  });
  return redirectTo(values.redirect_uri, { code, state: values.state, iss });
}
