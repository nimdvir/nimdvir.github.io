// The one public address for short links. Every new link is reported as
// https://dr.nimdvir.com/<name>, even when the request came in through an alias
// (d.nimdvir.com, n.nimdvir.com or a *.vercel.app URL). All aliases keep redirecting.
// OAuth fields (issuer, resource, endpoints) do NOT use this: they follow the request
// host (originOf in lib/oauth.js), so connectors set up on any alias keep validating.
export const PUBLIC_ORIGIN = "https://dr.nimdvir.com";
export const PUBLIC_HOST = new URL(PUBLIC_ORIGIN).host;

export const shortUrl = (slug) => `${PUBLIC_ORIGIN}/${slug}`;

// Default copy format: "Title - https://dr.nimdvir.com/name" (just the URL when there is no title).
export const titledLine = (title, url) => {
  const t = String(title || "").replace(/\s+/g, " ").trim();
  return t ? `${t} - ${url}` : url;
};
