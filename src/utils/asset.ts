import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Adds a content hash to a file in public/ so browsers fetch the new copy
// after each change instead of reusing a cached one.
export function asset(path: string): string {
  const file = join(process.cwd(), "public", path);
  try {
    const hash = createHash("sha256")
      .update(readFileSync(file))
      .digest("hex")
      .slice(0, 10);
    return `${path}?v=${hash}`;
  } catch {
    return path;
  }
}
