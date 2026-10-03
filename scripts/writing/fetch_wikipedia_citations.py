"""Fetch Hebrew Wikipedia citations of Nimrod Dvir's articles.

Reads the Wikipedia page links listed in Media/Interviews/MyWriting.xlsx
(sheets wiki, wikipedia, wiki-2), downloads each page's wikitext through the
MediaWiki API, and keeps every citation that names Dvir. The result is cached
in data-source/writing/wikipedia-citations.json so build_inventory.py can run
offline. Pages already in the cache are skipped unless --refresh is given.

Usage: python scripts/writing/fetch_wikipedia_citations.py [--refresh]
"""
import argparse
import datetime as dt
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "Media" / "Interviews" / "MyWriting.xlsx"
CACHE = ROOT / "data-source" / "writing" / "wikipedia-citations.json"
API = "https://he.wikipedia.org/w/api.php"
USER_AGENT = "nimdvir-writing-inventory/1.0 (personal archive; https://nimdvir.com)"
SHEETS = ["wiki", "wikipedia", "wiki-2"]
AUTHOR_MARK = "דביר"


def page_title(url):
    """Return the decoded page title of a he.wikipedia.org/wiki/ link, or None."""
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc != "he.wikipedia.org" or not parsed.path.startswith("/wiki/"):
        return None
    return urllib.parse.unquote(parsed.path[len("/wiki/"):]).replace("_", " ")


def listed_pages():
    wb = openpyxl.load_workbook(SOURCE)
    pages = {}
    for sheet in SHEETS:
        for row in wb[sheet].iter_rows():
            for cell in row:
                if cell.hyperlink and cell.hyperlink.target:
                    title = page_title(cell.hyperlink.target)
                    if title:
                        pages.setdefault(title, []).append(f"{SOURCE.name}!{sheet}!{cell.coordinate}")
    return pages


def api(params):
    """Call the MediaWiki API, waiting and retrying when rate limited."""
    data = urllib.parse.urlencode({**params, "format": "json", "formatversion": 2}).encode()
    for attempt in range(5):
        request = urllib.request.Request(API, data=data, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(15 * (attempt + 1))


def fetch_wikitext(title):
    data = api({"action": "parse", "page": title, "prop": "wikitext", "redirects": 1})
    if "error" in data:
        return None, data["error"].get("code", "error")
    return data["parse"]["wikitext"], data["parse"]["title"]


def templates(text):
    """Yield top-level {{...}} templates, handling nested braces."""
    depth, start = 0, None
    i = 0
    while i < len(text) - 1:
        pair = text[i:i + 2]
        if pair == "{{":
            if depth == 0:
                start = i
            depth += 1
            i += 2
            continue
        if pair == "}}" and depth:
            depth -= 1
            i += 2
            if depth == 0:
                yield text[start:i]
            continue
        i += 1


def split_params(template):
    """Split a template body on top-level pipes."""
    body = template[2:-2]
    parts, depth, current = [], 0, ""
    i = 0
    while i < len(body):
        two = body[i:i + 2]
        if two in ("{{", "[["):
            depth += 1
            current += two
            i += 2
            continue
        if two in ("}}", "]]") and depth:
            depth -= 1
            current += two
            i += 2
            continue
        if body[i] == "|" and depth == 0:
            parts.append(current)
            current = ""
        else:
            current += body[i]
        i += 1
    parts.append(current)
    return [p.strip() for p in parts]


def is_dvir_template(params):
    if len(params) > 1 and AUTHOR_MARK in params[1]:
        return True
    return any(re.match(r"(author|מחבר|הכותב|כותב)\s*=.*" + AUTHOR_MARK, p) for p in params)


def dvir_templates(text):
    """Citation templates that name Dvir as author, including ones nested in footnotes."""
    for template in templates(text):
        params = split_params(template)
        inner = template[2:-2]
        if "{{" in inner:
            nested = list(dvir_templates(inner))
            if nested:
                yield from nested
                continue
        if is_dvir_template(params):
            yield template, params


def expanded_link(template):
    """Let Wikipedia render the template and return the first external link and its label."""
    data = api({"action": "expandtemplates", "text": template, "prop": "wikitext"})
    rendered = data.get("expandtemplates", {}).get("wikitext", "")
    match = re.search(r"\[(https?://\S+)\s+([^\]]*)\]", rendered)
    return (match.group(1), match.group(2).strip()) if match else (None, None)


def dvir_citations(text):
    found = []
    for template, params in dvir_templates(text):
        url, label = expanded_link(template)
        found.append({"kind": "template", "name": params[0].strip(), "params": params[1:],
                      "url": url, "label": label, "raw": template})
        time.sleep(0.5)
    # Plain external links on a line that names Dvir, e.g. "* [http://... title], נמרוד דביר"
    for line in text.splitlines():
        if AUTHOR_MARK not in line or "{{" in line:
            continue
        for url, label in re.findall(r"\[(https?://\S+)\s+([^\]]*)\]", line):
            found.append({"kind": "link", "url": url, "label": label.strip(), "raw": line.strip()})
    return found


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--refresh", action="store_true", help="re-fetch pages already cached")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {"pages": {}}
    pages = listed_pages()
    fetched = 0
    for title in sorted(pages):
        entry = cache["pages"].get(title)
        if entry and not args.refresh:
            entry["listed_in"] = pages[title]
            continue
        try:
            text, resolved = fetch_wikitext(title)
        except Exception as error:  # network problems are recorded, not fatal
            cache["pages"][title] = {"listed_in": pages[title], "error": str(error)}
            print(f"error  {title}: {error}")
            continue
        if text is None:
            cache["pages"][title] = {"listed_in": pages[title], "error": resolved}
            print(f"missing {title}: {resolved}")
        else:
            cache["pages"][title] = {
                "listed_in": pages[title],
                "resolved_title": resolved,
                "fetched": dt.date.today().isoformat(),
                "citations": dvir_citations(text),
            }
            print(f"ok     {title}: {len(cache['pages'][title]['citations'])} citation(s)")
        fetched += 1
        time.sleep(0.5)

    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    total = sum(len(p.get("citations", [])) for p in cache["pages"].values())
    print(f"{len(pages)} pages listed, {fetched} fetched, {total} Dvir citations cached in {CACHE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
