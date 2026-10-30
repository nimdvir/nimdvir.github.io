"""Build website article pages from the reviewed English translation drafts.

Usage: python scripts/writing/build_article_pages.py [--draft]

Reads data-source/writing/translations/W###-slug/article.en.md, the article
inventory, and data-source/writing/article-images.json, then writes one
src/content/articles/<slug>.md per package. The translation packages stay the
editorial source of truth; this script only derives the page files, so it
can be rerun after a draft or an image record changes.

Page bodies drop the archival furniture that the page template renders from
frontmatter (subtitle line, translation note, citation footer) and the
captions of publisher photographs that are not reproduced on the site.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
TRANSLATIONS = ROOT / "data-source" / "writing" / "translations"
INVENTORY = ROOT / "data-source" / "writing" / "articles.csv"
IMAGES = ROOT / "data-source" / "writing" / "article-images.json"
OUT = ROOT / "src" / "content" / "articles"
REPO_BLOB = "https://github.com/nimdvir/nimdvir.github.io/blob/main/"
TAGS = ROOT / "src" / "data" / "tags.json"

KIND_BY_TYPE = {
    "interview": "interview",
    "column": "column",
    "feature": "feature",
    "review": "review",
    "report": "feature",
    "other": "feature",
}
LEGACY_SLUGS = {
    "jamie-foxx",
    "jim-carrey",
    "julia-louis-dreyfus",
    "lady-gaga",
    "rupaul",
    "michael-fassbender",
}


def split_frontmatter(text: str) -> tuple[dict, str]:
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.S)
    if not match:
        raise ValueError("missing frontmatter")
    return yaml.safe_load(match.group(1)) or {}, text[match.end():]


def page_body(body: str) -> str:
    """Keep the article, drop the furniture the template renders itself."""
    body = body.split("\n---\n\n## Source, backup and citation")[0]
    paragraphs = [p for p in re.split(r"\n\s*\n", body.strip())]
    out: list[str] = []
    skip_next_caption = False
    seen_text = False
    for para in paragraphs:
        stripped = para.strip()
        is_comment = stripped.startswith("<!--") and stripped.endswith("-->")
        is_image = stripped.startswith("![")
        is_italic_line = (
            stripped.startswith("*")
            and stripped.endswith("*")
            and not stripped.startswith("**")
            and "\n" not in stripped
        )
        if is_comment or is_image:
            skip_next_caption = True
            continue
        if is_italic_line and (skip_next_caption or not seen_text):
            # Caption of a photograph not reproduced here, or the subtitle and
            # translation note that precede the article text.
            skip_next_caption = False
            continue
        if is_italic_line and stripped.startswith("*[") :
            continue
        skip_next_caption = False
        if re.fullmatch(r"#{2,3}\s*[•·\*]\s*[•·\*]\s*[•·\*]", stripped):
            out.append("* * *")
            seen_text = True
            continue
        seen_text = True
        out.append(stripped)
    return "\n\n".join(out).strip() + "\n"


def citation_of(body: str) -> str | None:
    match = re.search(r"```text\n(.*?)\n```", body, flags=re.S)
    return match.group(1).strip() if match else None


def quote(value):
    return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--draft", action="store_true", help="write pages with draft: true")
    args = parser.parse_args()

    rows = {
        r["ID"]: r
        for r in csv.DictReader(INVENTORY.open(encoding="utf-8-sig", newline=""))
    }
    images = json.loads(IMAGES.read_text(encoding="utf-8")) if IMAGES.exists() else {}
    registry = {t["label"] for t in json.loads(TAGS.read_text(encoding="utf-8"))["tags"]}
    aliases = {
        a: t["label"]
        for t in json.loads(TAGS.read_text(encoding="utf-8"))["tags"]
        for a in t.get("aliases", [])
    }
    OUT.mkdir(parents=True, exist_ok=True)
    written = []
    problems = []
    for folder in sorted(TRANSLATIONS.glob("W*")):
        md = folder / "article.en.md"
        if not md.exists():
            continue
        wid = folder.name[:4]
        slug = folder.name[5:]
        fm, body = split_frontmatter(md.read_text(encoding="utf-8"))
        row = rows.get(wid, {})
        third = bool(fm.get("thirdPartyCoverage"))
        coauthored = bool(fm.get("coauthored"))
        kind = "coverage" if third else KIND_BY_TYPE.get(row.get("Type", ""), "feature")
        if wid == "W106":
            kind = "review"
        author = str(fm.get("author", "Nimrod Dvir"))
        authors = fm.get("additionalAuthors") or []
        if " and " in author and not authors:
            authors = [a.strip() for a in author.split(" and ")]
        elif coauthored and not authors:
            authors = [author]
        if third and fm.get("additionalAuthors"):
            authors = [author] + list(fm["additionalAuthors"])
        date = str(fm.get("originalPublishedDate", "")).strip()
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
            problems.append(f"{wid}: bad originalPublishedDate {date!r}")
            continue
        tags = []
        for tag in fm.get("tags") or []:
            label = aliases.get(tag, tag)
            if label not in registry:
                problems.append(f"{wid}: tag {tag!r} not in registry")
                continue
            if label not in tags:
                tags.append(label)
        subtitle = (fm.get("subtitle") or "").strip()
        summary = (fm.get("summary") or subtitle or "").strip()
        if not summary:
            problems.append(f"{wid}: no summary")
            continue
        data = {
            "articleId": wid,
            "title": str(fm["title"]).strip(),
        }
        if subtitle:
            data["subtitle"] = subtitle
        data.update(
            {
                "summary": summary,
                "kind": kind,
                "author": author,
            }
        )
        if authors:
            data["authors"] = authors
        if third:
            data["thirdPartyCoverage"] = True
        if coauthored:
            data["coauthored"] = True
        if fm.get("interviewee"):
            data["interviewee"] = str(fm["interviewee"]).strip()
        subjects = [str(s).strip() for s in (fm.get("subjects") or []) if str(s).strip()]
        if subjects:
            data["subjects"] = subjects
        data.update(
            {
                "date": date,
                "originalTitle": str(fm.get("originalTitle", "")).strip(),
                "originalLanguage": str(fm.get("originalLanguage", "he")),
                "source": str(fm.get("source", row.get("Publication", ""))).strip(),
                "sourceUrl": str(fm.get("sourceUrl", "")).strip(),
                "hebrewSource": REPO_BLOB
                + f"data-source/writing/originals/{folder.name}/article.he.md",
            }
        )
        citation = citation_of(body)
        if citation:
            data["citation"] = citation
        data["tags"] = tags
        image = images.get(wid) or {}
        if image.get("image"):
            data["image"] = image["image"]
            if image.get("thumb"):
                data["thumb"] = image["thumb"]
            data["imageAlt"] = image.get("alt", "")
            if image.get("caption"):
                data["imageCaption"] = image["caption"]
            data["imageCredit"] = image.get("credit", "")
            if image.get("license"):
                data["imageLicense"] = image["license"]
            if image.get("licenseUrl"):
                data["imageLicenseUrl"] = image["licenseUrl"]
            if image.get("source"):
                data["imageSource"] = image["source"]
        if slug in LEGACY_SLUGS:
            data["legacyPath"] = f"/interviews/{slug}/"
        data["draft"] = bool(args.draft)

        front = yaml.safe_dump(
            data, allow_unicode=True, sort_keys=False, default_flow_style=False, width=1000
        )
        text = f"---\n{front}---\n\n{page_body(body)}"
        if "—" in text:
            problems.append(f"{wid}: em dash in page text")
        (OUT / f"{slug}.md").write_text(text, encoding="utf-8")
        written.append(slug)

    stale = sorted(p.stem for p in OUT.glob("*.md") if p.stem not in written)
    print(f"wrote {len(written)} article pages to {OUT.relative_to(ROOT)}")
    if stale:
        print("stale pages not produced by this run:", ", ".join(stale))
    if problems:
        print("\n".join(problems))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
