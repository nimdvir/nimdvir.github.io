import { json, originOf, preflight, protectedResourceMetadata } from "../../../../lib/oauth";

export const dynamic = "force-dynamic";

export function GET(request) {
  return json(protectedResourceMetadata(originOf(request)));
}

export const OPTIONS = preflight;
