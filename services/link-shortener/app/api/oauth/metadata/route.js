import { authServerMetadata, json, originOf, preflight } from "../../../../lib/oauth";

export const dynamic = "force-dynamic";

export function GET(request) {
  return json(authServerMetadata(originOf(request)));
}

export const OPTIONS = preflight;
