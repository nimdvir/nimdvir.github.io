"""Validate registered Hebrew archive packages without fetching publisher pages.

Install requirements.txt first. Live completeness checks belong in source-record.json;
this check validates the saved files, citation, metadata and Markdown/HTML agreement.
"""
import csv
import json
import re
from html.parser import HTMLParser
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parents[2]


class Reader(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.parts, self.tags, self.hidden = [], [], 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
        if tag in {"script", "style"}:
            self.hidden += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.hidden -= 1

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)

    @property
    def text(self):
        return " ".join(self.parts)


def compact(value):
    return re.sub(r"\s+", "", value).replace("\u200f", "").replace("\u200e", "")


def main():
    rows = list(csv.DictReader((ROOT / "data-source/writing/articles.csv").open(encoding="utf-8-sig")))
    errors, checked = [], set()
    for row in rows:
        if not row["Hebrew Markdown Path"]:
            continue
        path = ROOT / row["Hebrew Markdown Path"]
        if path in checked:
            canonical = json.loads((path.parent / "source-record.json").read_text(encoding="utf-8"))["articleId"]
            if row.get("Duplicate Of") != canonical:
                errors.append(f"{row['ID']}: shared package requires Duplicate Of={canonical}")
            continue  # confirmed duplicate rows share a single canonical package
        checked.add(path)
        try:
            md = path.read_text(encoding="utf-8")
            _, frontmatter, body = md.split("---", 2)
            meta = yaml.safe_load(frontmatter)
            record = json.loads((path.parent / "source-record.json").read_text(encoding="utf-8"))
            htmlpath = ROOT / row["Clean HTML Path"]
            htmlsource = htmlpath.read_text(encoding="utf-8")
            reader = Reader(htmlsource)
            assert meta["articleId"] == record["articleId"] == row["ID"], "canonical ID mismatch"
            for field in ("title", "author", "byline", "publisher", "sourceUrl", "publishedDate", "language", "extractedOn", "status", "imageStorage"):
                assert meta.get(field), f"missing frontmatter {field}"
            assert meta["language"] == "he", "wrong source language"
            assert any(tag == "html" and attrs.get("lang") == "he" and attrs.get("dir") == "rtl" for tag, attrs in reader.tags), "missing Hebrew RTL root"
            assert any(tag == "meta" and attrs.get("charset", "").lower() == "utf-8" for tag, attrs in reader.tags), "missing UTF-8 declaration"
            assert not any(tag == "script" or (tag == "link" and attrs.get("rel") == "stylesheet") for tag, attrs in reader.tags), "external runtime or stylesheet"
            assert htmlsource.count("<h1") == 1, "expected one HTML headline"
            assert "article.he.html" in body and "article.he.md" in htmlsource, "missing reciprocal archive links"
            assert "מקור, גיבוי וציטוט" in body, "missing archival divider/heading"
            assert "```text" in body, "citation is not copyable plain text"
            citation = record.get("apaCitation")
            if not citation:
                citation = re.search(r"```text\s*\n(.*?)\n```", body, re.S).group(1)
            assert compact(citation) in compact(body), "citation differs from source record"
            assert compact(citation) in compact(reader.text), "HTML citation differs"
            assert meta["sourceUrl"] in body and meta["sourceUrl"] in htmlsource, "missing original link"
            story = body.split("\n---\n")[0]
            # Long Markdown paragraphs must also exist verbatim in the HTML reader.
            # Header/byline wrappers may differ; whitespace only is normalized.
            for paragraph in story.split("\n\n"):
                if paragraph.startswith(("#", "<!--", "![")):
                    continue
                text = Reader(markdown.markdown(paragraph)).text
                text = text.replace("[תמונה במקור; ממתינה לרישיון שימוש]", "").strip()
                if len(text) > 90:
                    assert compact(text) in compact(reader.text), f"Markdown paragraph absent from HTML: {text[:55]}"
            boundaries = record.get("completeness", {})
            for key in ("firstTextBlock", "lastTextBlock"):
                if boundaries.get(key):
                    text = Reader(markdown.markdown(boundaries[key])).text
                    assert compact(text) in compact(Reader(markdown.markdown(story)).text), f"missing recorded {key}"
        except (AssertionError, ValueError, KeyError, AttributeError, OSError, yaml.YAMLError) as exc:
            errors.append(f"{row['ID']}: {exc}")
    for error in errors:
        print("error:", error)
    registered = sum(bool(row["Hebrew Markdown Path"]) for row in rows)
    print(f"{len(checked)} unique Hebrew packages checked, {registered} inventory records covered, {len(errors)} problem(s).")
    raise SystemExit(bool(errors))


if __name__ == "__main__":
    main()
