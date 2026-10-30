"""Download the licensed source images for article pages.

Usage: python scripts/writing/fetch_article_images.py [W001 W002 ...]

Reads data-source/writing/article-image-sources.json and saves each record
with status "found" to images/articles/<W###-slug>.<ext>, skipping files that are
already present. Then run `npm run cloudinary:upload` (needs CLOUDINARY_URL
in .env) to host them and update src/data/cloudinary-images.json, and
`python scripts/writing/build_article_pages.py` to put them on the pages.

Wikimedia asks for an identifying User-Agent and answers 429 with a
Retry-After header when a client is too eager; this script honors both.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "data-source" / "writing" / "article-image-sources.json"
OUT = ROOT / "images" / "articles"
UA = "nimdvir-site-archive/1.0 (https://nimdvir.com; contact via site)"


def main() -> int:
    only = set(sys.argv[1:])
    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    failures = 0
    for wid, rec in sources.items():
        if not wid.startswith("W") or rec.get("status") != "found":
            continue
        if only and wid not in only:
            continue
        url = rec["originalUrl"]
        ext = url.rsplit(".", 1)[-1].lower()
        ext = {"jpeg": "jpg"}.get(ext, ext)
        target = OUT / f"{rec['slug']}.{ext}"
        if target.exists() and target.stat().st_size > 20_000:
            print(f"{wid}: present")
            continue
        for attempt in range(4):
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            try:
                with urllib.request.urlopen(req, timeout=120) as resp:
                    target.write_bytes(resp.read())
                print(f"{wid}: saved {target.relative_to(ROOT)}")
                time.sleep(2)
                break
            except urllib.error.HTTPError as err:
                if err.code == 429:
                    wait = int(err.headers.get("Retry-After", "60"))
                    print(f"{wid}: rate limited, waiting {wait}s")
                    time.sleep(min(wait, 900))
                    continue
                print(f"{wid}: HTTP {err.code}")
                failures += 1
                break
            except Exception as err:  # noqa: BLE001
                print(f"{wid}: {err}")
                failures += 1
                break
        else:
            print(f"{wid}: gave up after repeated rate limiting")
            failures += 1
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
