"""Build data-source/writing/articles.csv, the list of Nim's Hebrew journalism.

Reads the spreadsheets and CSVs in Media/Interviews/ (never modifying them),
the published interviews in src/content/interviews/, and the Wikipedia
citation cache made by fetch_wikipedia_citations.py. Writes the article list
and reports/writing/inventory-audit.md.

Re-runnable: rows already in articles.csv are never changed. Only articles
that are not in the list yet are appended, with the next free ID. Files are
rewritten only when their content changes.

Usage: python scripts/writing/build_inventory.py
"""
import csv
import datetime as dt
import hashlib
import io
import json
import re
import sys
import urllib.parse
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "Media" / "Interviews"
INTERVIEWS = ROOT / "src" / "content" / "interviews"
OUTPUT = ROOT / "data-source" / "writing" / "articles.csv"
CITATIONS = ROOT / "data-source" / "writing" / "wikipedia-citations.json"
AUDIT = ROOT / "reports" / "writing" / "inventory-audit.md"

COLUMNS = [
    "ID", "Translate?", "Priority", "Status", "Type", "Interviewee",
    "Title (Hebrew)", "Title (English)", "Publication", "Date", "Original URL",
    "Images", "Original HTML Path", "Translation Path", "Page Path",
    "Found In", "Notes",
]
STATUSES = ["not started", "needs checking", "not my writing", "captured",
            "translated", "page created", "published"]
TYPES = ["interview", "review", "feature", "column", "report", "other", "unknown"]

MAIN_BOOK = "MyWriting.xlsx"
COPIES = ["MyWriting (1).xlsx", "wiki1.xlsx", "wiki2.xlsx", "wiki3.xlsx", "wiki4.xlsx"]
SMALL_COPY = "MyWriting (2).xlsx"
ARTICLES_BOOK = "NimDvirArticles.xlsx"
ARTICLES_CSV = "MyWriting - NimDvirArticle.csv"
PRESS_CSV = "MyWriting - Sheet17.csv"

AI_SAMPLE_SHEETS = {
    "include hebrew titles too. Do t": "AI-generated sample table (headlines with placeholder 'Link' cells)",
    "Sheet2": "AI-generated sample table pasted as text",
    "Sheet3": "AI-generated sample table; links point to google.com searches or invented article IDs",
    "Sheet4": "AI-generated list of generic news headlines",
    "Sheet5": "AI-generated list of generic news headlines (same as Sheet4)",
    "Sheet6": "AI-generated 'celebrity interview' sample with placeholder titles",
    "Sheet8": "AI-generated 'celebrity interview' sample",
    "Deepseek": "AI-generated sample of Israel Hayom English and Ynetnews items not written by Nim",
    "Gemini": "AI-generated sample table pasted as text",
}
COVERAGE_DOMAINS = {
    "insidemovies.ew.com", "www.vulture.com", "www.variginlondon.co.uk", "bidur.nana10.co.il",
    "b.walla.co.il", "e.walla.co.il", "www.bizportal.co.il", "podcasts.apple.com",
    "open.spotify.com", "w.wiki",
}
ACADEMIC_DOMAINS = {"scholar.google.com", "papers.ssrn.com", "arxiv.org", "www.sciencedirect.com"}
PUBLICATIONS = [
    ("xnet.ynet.co.il", "Xnet"), ("ynet.co.il", "Ynet"), ("israelhayom.co.il", "Israel Hayom"),
    ("nrg.co.il", "nrg"), ("makorrishon.co.il/nrg", "nrg"), ("atmag.co.il", "At"),
    ("prtfl.co.il", "Portfolio"), ("nimdvir.blogspot.com", "Blog (nimdvir.blogspot.com)"),
    ("jewishjournal.com", "Jewish Journal"),
]
HEBREW_MONTHS = {"ינו": 1, "פבר": 2, "מרץ": 3, "מרס": 3, "אפר": 4, "מאי": 5, "יונ": 6,
                 "יול": 7, "אוג": 8, "ספט": 9, "אוק": 10, "נוב": 11, "דצמ": 12}
AUTHOR = "נמרוד דביר"


# ---------------------------------------------------------------- helpers

def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def domain(url):
    return urllib.parse.urlparse(url).netloc.lower()


def comparable_url(url):
    """Same URL for comparison only: percent-escapes in one case. Stored URLs are never changed."""
    return re.sub(r"%[0-9a-fA-F]{2}", lambda m: m.group(0).upper(),
                  urllib.parse.quote(url, safe=":/?&=#%,;+!$'()*@~-._"))


def article_key(url):
    """Publisher article ID when there is one, otherwise the URL itself."""
    m = re.search(r"xnet\.ynet\.co\.il/.*?L-(\d+)", url)
    if m:
        return "xnet:" + m.group(1)
    m = re.search(r"ynet\.co\.il/(?:.*?L-(\d+)|article/(\d+))", url)
    if m:
        return "ynet:" + (m.group(1) or m.group(2))
    m = re.search(r"israelhayom\.co\.il/(?:[\w/]*/)?(?:article|opinion)/(\d+)", url)
    if m:
        return "ih:" + m.group(1)
    m = re.search(r"(?:nrg\.co\.il|makorrishon\.co\.il/nrg)/online/\d+/ART\d*/(\d+/\d+)\.html", url)
    if m:
        return "nrg:" + m.group(1)
    return "url:" + comparable_url(url)


def is_article_url(url):
    """False for section, tag, label, search and topic pages."""
    if not url or not url.startswith("http"):
        return False
    d = domain(url)
    if "ynet.co.il" in d:
        return bool(re.search(r"L-\d+|/article/\d+", url))
    if d == "nimdvir.blogspot.com":
        return bool(re.search(r"/\d{4}/\d{2}/", url))
    if d == "www.prtfl.co.il":
        return "/archives/tag/" not in url
    return d not in {"www.google.com", "he.wikipedia.org"}


def publication(url):
    for marker, name in PUBLICATIONS:
        if marker in url:
            return name
    return domain(url).removeprefix("www.")


def clean_title(text):
    text = re.sub(r"\s+-\s+ynet\s*$", "", str(text or "").strip())
    text = re.sub(r"\{\{כ\}\}", "", text)
    text = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]", r"\1", text)
    text = text.replace("'''", "").replace("''", "")
    return re.sub(r"\s+", " ", text).strip()


def normal_title(text):
    return re.sub(r"[\W_]", "", clean_title(text).lower())


def hebrew_date(text):
    """First date found in a snippet or citation, as YYYY-MM-DD, YYYY-MM or YYYY."""
    text = str(text or "")
    for label in ("פורסם", "עודכן"):
        m = re.search(label + r"\s*:?\s*\d{1,2}:\d{2},\s*(\d{1,2})/(\d{1,2})/(\d{4})", text)
        if m:
            return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
        m = re.search(label + r"\s*:?\s*(\d{2})\.(\d{2})\.(\d{2})\s*,", text)
        if m:
            return f"20{m.group(3)}-{m.group(2)}-{m.group(1)}"
    m = re.search(r"(\d{1,2})\s+ב(" + "|".join(HEBREW_MONTHS) + r")\S*\s+(\d{4})", text)
    if m:
        return f"{m.group(3)}-{HEBREW_MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}"
    m = re.search(r"(\d{1,2})[./](\d{1,2})[./](\d{4})", text)
    if m:
        return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    return ""


def url_date(url):
    m = re.search(r"/(20\d{2})/(\d{2})/", url or "")
    return f"{m.group(1)}-{m.group(2)}" if m else ""


NAME_COLON = re.compile(r"^([^:\"״]{3,30}?)\s*(?:[\"״]\s*:|:\s*[\"״'])")
INTERVIEW_WITH = re.compile(r"(?:ריאיון|ראיון) עם (.+?)(?:\s+מ[\"״].*)?$")


def classify(title, snippet="", section=""):
    """Return (type, interviewee). Interviewee is 'unknown' when it cannot be read from the text."""
    title = clean_title(title)
    lower = title.lower()
    m = INTERVIEW_WITH.search(title)
    if m:
        return "interview", m.group(1).strip()
    m = NAME_COLON.match(title)
    if m and len(m.group(1).split()) <= 4:
        return "interview", m.group(1).strip()
    if "interview" in lower or re.search(r"ריאיון|ראיון", title) or re.search(r"בראיון|ראיון ל", snippet):
        return "interview", "unknown"
    if "ביקורת" in title or "ביקורות" in section or "review" in lower:
        return "review", ""
    if "set visit" in lower or "ביקור על הסט" in title:
        return "feature", ""
    if "טורים" in section or "מדורים" in section:
        return "column", ""
    if "חדשות" in section or re.search(r"הוכרזו|הזוכים|זוכים בפרס|יקבל את פרס|מונה ל|הלך לעולמו", title):
        return "report", ""
    if "המלצות" in title or "המלצות" in section or "רשימת קריאה" in title:
        return "other", ""
    return "unknown", ""


# ---------------------------------------------------------------- collection

class Inventory:
    def __init__(self):
        self.rows = []
        self.by_key = {}
        self.excluded = []      # (source, location, title, url, reason)
        self.contrib = {}       # source label -> [new, merged]

    def add(self, source, found_in, url="", title="", date="", kind="", interviewee="",
            notes=(), status="", english="", page_path="", images="", publication_name=""):
        key = article_key(url) if url else "noref:" + found_in
        stats = self.contrib.setdefault(source, [0, 0])
        row = self.by_key.get(key)
        if row:
            stats[1] += 1
            if found_in not in row["found_in"]:
                row["found_in"].append(found_in)
            for field, value in (("title", clean_title(title)), ("date", date), ("english", english)):
                if value and not row[field]:
                    row[field] = value
            if kind and row["type"] in ("", "unknown"):
                row["type"], row["interviewee"] = kind, interviewee
            for note in notes:
                if note not in row["notes"]:
                    row["notes"].append(note)
            return row
        stats[0] += 1
        row = {
            "key": key, "url": url, "title": clean_title(title), "date": date, "type": kind or "unknown",
            "interviewee": interviewee, "found_in": [found_in], "notes": list(notes), "status": status,
            "english": english, "page_path": page_path, "images": images, "html_path": "",
            "publication": publication_name or (publication(url) if url else ""),
        }
        self.rows.append(row)
        self.by_key[key] = row
        return row

    def exclude(self, source, location, title, url, reason):
        self.excluded.append((source, location, clean_title(title), url or "", reason))


def frontmatter(path):
    text = path.read_text(encoding="utf-8")
    block = text.split("---", 2)[1]
    data = {}
    for line in block.splitlines():
        m = re.match(r"(\w+):\s*(['\"])(.*)\2\s*$", line)
        if m:
            data[m.group(1)] = m.group(3)
    return data


def read_published(inv):
    for path in sorted(INTERVIEWS.glob("*.md")):
        data = frontmatter(path)
        date = dt.datetime.strptime(data["date"], "%b %d, %Y").date().isoformat()
        rel = path.relative_to(ROOT).as_posix()
        inv.add("Published interviews", rel, url=data["sourceUrl"], date=date, kind="interview",
                interviewee=data["interviewee"], status="published", english=data["title"],
                page_path=rel, images="on Cloudinary", publication_name=data.get("source", ""))


def read_sheet15(inv, wb):
    for row in wb["Sheet15"].iter_rows(min_row=2):
        cell = row[2]
        url = cell.hyperlink.target if cell.hyperlink else cell.value
        if not url:
            continue
        found = f"{MAIN_BOOK}!Sheet15!{cell.coordinate}"
        if article_key(url) in inv.by_key:
            inv.add("Sheet15", found, url=url, title=row[1].value)
        else:
            inv.add("Sheet15", found, url=url, title=row[1].value, kind="interview",
                    interviewee=str(row[0].value).strip())


def google_target(url):
    m = re.search(r"[?&]q=([^&]+)", url)
    return m.group(1) if m else ""


def read_search_results(inv):
    """NimDvirArticles.xlsx: a linked title row, then a breadcrumb row and a snippet row."""
    ws = openpyxl.load_workbook(SOURCES / ARTICLES_BOOK).active
    csv_lines = {}
    with open(SOURCES / ARTICLES_CSV, encoding="utf-8-sig", newline="") as handle:
        reader = csv.reader(handle)
        for record in reader:
            if record:
                csv_lines.setdefault(record[0], f"{ARTICLES_CSV}!line {reader.line_num}")

    records, current, loose = [], None, []
    for r in range(1, ws.max_row + 1):
        cell = ws.cell(r, 1)
        value = str(cell.value or "").strip()
        if not value:
            continue
        link = cell.hyperlink.target if cell.hyperlink else ""
        if link:
            if current and value.startswith("http") and link == current["link"]:
                continue  # the same link repeated as plain text
            title = value
            if value.startswith("http") and loose:
                title = loose[-1][1]  # title sits on its own row above a bare link
            current = {"cell": cell.coordinate, "link": link, "title": title, "text": value,
                       "section": "", "snippet": ""}
            records.append(current)
            loose = []
        elif current and not current["section"] and "›" in value:
            current["section"] = value
        elif current and not current["snippet"]:
            current["snippet"] = value
        else:
            loose.append((cell.coordinate, value))  # e.g. a results count, or a title on its own row

    for rec in records:
        url, notes = rec["link"], []
        found = f"{ARTICLES_BOOK}!{rec['cell']}"
        if domain(url) == "www.google.com":
            url = google_target(url)
            notes.append("link taken from a Google redirect")
        if not is_article_url(url):
            inv.exclude(ARTICLES_BOOK, rec["cell"], rec["title"], rec["link"], "Ynet topic page, not an article")
            continue
        kind, who = classify(rec["title"], rec["snippet"], rec["section"])
        row = inv.add(ARTICLES_BOOK, found, url=url, title=rec["title"], kind=kind, interviewee=who,
                      date=hebrew_date(rec["snippet"]), notes=notes)
        for text in (rec["text"], rec["section"], rec["snippet"]):
            if text in csv_lines and csv_lines[text] not in row["found_in"]:
                row["found_in"].append(csv_lines[text])
                break
    return len(records)


def read_sheet12(inv, wb):
    for row in wb["Sheet12"].iter_rows(min_row=2):
        cell = row[3]
        url = cell.hyperlink.target if cell.hyperlink else cell.value
        if not url:
            continue
        title = str(row[1].value or "")
        hebrew = title.split(" / ")[0] if " / " in title else title
        location = f"Sheet12!{cell.coordinate}"
        if domain(url) in ACADEMIC_DOMAINS:
            inv.exclude(MAIN_BOOK, location, title, url, "academic publication (belongs to the publications collection)")
            continue
        notes = []
        if "prtfl.co.il" in url:
            notes.append("may be a reading list that mentions Nim rather than his own piece")
        kind, who = classify(hebrew)
        r = inv.add("Sheet12", f"{MAIN_BOOK}!{location}", url=url, title=hebrew, kind=kind,
                    interviewee=who, notes=notes)
        if notes:
            r["status"] = "needs checking"


def wiki_page(url):
    if domain(url) != "he.wikipedia.org" or "/wiki/" not in url:
        return None
    return urllib.parse.unquote(url.split("/wiki/", 1)[1]).replace("_", " ")


def citation_by_nim(cite):
    if cite["kind"] != "template" or not cite.get("url"):
        return False
    params = cite["params"]
    if cite["name"] == "הערה":
        body = "|".join(p for p in params if not p.startswith("שם="))
        body = re.sub(r"^1=", "", body)
        return body.split("[", 1)[0].strip().startswith(AUTHOR)
    if any(re.match(r"(הכותב|מחבר|כותב|author)\s*=", p) for p in params):
        return any(re.match(r"(הכותב|מחבר|כותב|author)\s*=.*דביר", p) for p in params)
    return bool(params) and "דביר" in params[0]


def citation_fields(cite):
    params = cite["params"]
    named = dict(p.split("=", 1) for p in params if re.match(r"^[^=\[{]+=", p))
    if cite["name"] == "הערה":
        return clean_title(cite.get("label")), hebrew_date(cite["raw"])
    if "כותרת" in named:
        return clean_title(named["כותרת"]), hebrew_date(named.get("תאריך", ""))
    title = params[1] if len(params) > 1 else cite.get("label")
    date = params[3] if len(params) > 3 else ""
    return clean_title(title), hebrew_date(date)


def add_citation(inv, source, page, cite, found_in, extra_notes=()):
    title, date = citation_fields(cite)
    kind, who = classify(title)
    notes = [f"link from {{{{{cite['name']}}}}} citation on he.wikipedia: {page}", *extra_notes]
    return inv.add(source, found_in, url=cite["url"], title=title, date=date, kind=kind,
                   interviewee=who, notes=notes)


def best_citation(title, cites):
    if len(cites) == 1:
        return cites[0]
    wanted = set(re.findall(r"\w+", clean_title(title)))
    scored = []
    for cite in cites:
        words = set(re.findall(r"\w+", citation_fields(cite)[0]))
        scored.append((len(wanted & words) / max(len(wanted), 1), cite))
    scored.sort(key=lambda pair: -pair[0])
    return scored[0][1] if scored and scored[0][0] >= 0.5 else None


def read_wiki2(inv, wb, cache):
    used = set()
    for row in wb["wiki-2"].iter_rows(min_row=2):
        cell = row[1]
        url = cell.hyperlink.target if cell.hyperlink else cell.value
        if not url:
            continue
        headline = str(row[0].value or "").strip()
        location = f"wiki-2!{cell.coordinate}"
        found = f"{MAIN_BOOK}!{location}"
        d = domain(url)
        page = wiki_page(url)
        if page:
            entry = cache["pages"].get(page, {})
            cites = [c for c in entry.get("citations", []) if citation_by_nim(c)]
            cite = best_citation(headline, cites)
            if cite:
                used.add((page, cite["raw"]))
                add_citation(inv, "wiki-2", page, cite, found)
            else:
                reason = entry.get("error") and f"page not found ({entry['error']})" or "no citation by Nim matched the headline"
                kind, who = classify(headline)
                r = inv.add("wiki-2", found, title=headline.strip(","), kind=kind, interviewee=who,
                            notes=[f"no article link: he.wikipedia {page}: {reason}"], status="needs checking")
            continue
        if d in COVERAGE_DOMAINS:
            inv.exclude(MAIN_BOOK, location, headline, url, "coverage about Nim, not his writing")
            continue
        if not is_article_url(url):
            if re.search(r"label|archive|tag", headline, re.I) or "/search/label/" in url or "/archives/tag/" in url:
                inv.exclude(MAIN_BOOK, location, headline, url, "archive, label or tag page, not an article")
                continue
            kind, who = classify(headline)
            inv.add("wiki-2", found, title=headline, kind=kind, interviewee=who, status="needs checking",
                    notes=[f"listed with a section page, not an article link: {url}"])
            continue
        placeholder = "not yet verified" in headline
        kind, who = classify("" if placeholder else headline)
        notes = ["headline not verified in source sheet"] if placeholder else []
        if d == "nimdvir.blogspot.com":
            notes.append("English post on Nim's blog")
        inv.add("wiki-2", found, url=url, title="" if placeholder else headline, kind=kind,
                interviewee=who, date=url_date(url), notes=notes)
    return used


def read_remaining_citations(inv, cache, used):
    for page in sorted(cache["pages"]):
        for cite in cache["pages"][page].get("citations", []):
            if (page, cite["raw"]) in used:
                continue
            if not citation_by_nim(cite):
                if cite.get("url"):
                    inv.exclude("he.wikipedia", page, cite.get("label"), cite["url"],
                                "citation does not name Nim as author (coverage about him)")
                continue
            used.add((page, cite["raw"]))
            add_citation(inv, "Wikipedia citations", page, cite, f"he.wikipedia:{page}")


def read_press_csv(inv):
    """Sheet17.csv: each line is one quoted field holding a whole CSV row."""
    with open(SOURCES / PRESS_CSV, encoding="utf-8-sig", newline="") as handle:
        outer = [(n, r[0]) for n, r in enumerate(csv.reader(handle), start=1) if r]
    for number, inner in outer[1:]:
        fields = next(csv.reader([inner]))
        # One headline holds an unquoted comma; the last three fields are always description, url, date.
        title, (description, url, date) = ",".join(fields[:-3]), fields[-3:]
        location = f"line {number}"
        found = f"{PRESS_CSV}!{location}"
        d = domain(url)
        if d in COVERAGE_DOMAINS and "to verify" in title:
            inv.exclude(PRESS_CSV, location, title, url, "unverified Walla Branja item; Branja is media-industry "
                        "news, so probably about Nim rather than by him. Check by hand.")
            continue
        if d in COVERAGE_DOMAINS:
            inv.exclude(PRESS_CSV, location, title, url, f"coverage or appearance, not Nim's writing: {description}")
            continue
        doubt = re.search(r"about Nimrod Dvir|response article by", description)
        placeholder = "to verify" in title
        key = article_key(url)
        notes = [f"Sheet17.csv says: {description}"] if doubt else []
        if key in inv.by_key:
            row = inv.add("Sheet17.csv", found, url=url, notes=notes)
            if doubt:
                row["status"] = "needs checking"
            continue
        kind, who = classify("" if placeholder else title)
        row = inv.add("Sheet17.csv", found, url=url, title="" if placeholder else title, kind=kind,
                      interviewee=who, date=hebrew_date(date) or (date[:10] if re.match(r"\d{4}-\d{2}", date) else ""),
                      notes=notes + (["headline and date not verified in source sheet"] if placeholder else []))
        if doubt:
            row["status"] = "needs checking"


def attach_captures(inv):
    """PDF captures already saved next to the spreadsheets."""
    for pdf in sorted(SOURCES.glob("*.pdf")):
        rel = pdf.relative_to(ROOT).as_posix()
        key = article_key("https://" + pdf.stem.replace("_", "/"))
        row = inv.by_key.get(key)
        if not row:
            wanted = normal_title(pdf.stem)
            row = next((r for r in inv.rows if r["title"] and normal_title(r["title"]) == wanted), None)
        if row:
            row["html_path"] = rel
            row["notes"].append("original saved as PDF")
            if row["status"] in ("", "not started"):
                row["status"] = "captured"


def finish(inv):
    """Default statuses, interviewee checks and possible-duplicate notes."""
    for row in inv.rows:
        if row["type"] == "interview" and not row["interviewee"]:
            row["interviewee"] = "unknown"
        if not row["status"]:
            missing = not row["url"] or not row["title"] or row["interviewee"] == "unknown"
            row["status"] = "needs checking" if missing else "not started"
        if row["status"] == "published" and len(row["found_in"]) == 1:
            row["notes"].append("site sourceUrl not found in any source list")


def flag_duplicates(rows):
    seen_titles, seen_dates = {}, {}
    for row in rows:
        title = normal_title(row["title"])
        if title:
            for other in seen_titles.get(title, []):
                if not row["date"] or not other["date"] or row["date"] == other["date"]:
                    note = f"possible duplicate of {other['id']}"
                    if note not in row["notes"]:
                        row["notes"].append(note)
            seen_titles.setdefault(title, []).append(row)
        if row["type"] == "interview" and len(row["date"]) == 10:
            for other in seen_dates.get(row["date"], []):
                note = f"possible duplicate of {other['id']} (same date, both interviews)"
                if f"possible duplicate of {other['id']}" not in " ".join(row["notes"]):
                    row["notes"].append(note)
            seen_dates.setdefault(row["date"], []).append(row)


# ---------------------------------------------------------------- output

def to_csv_row(row):
    return {
        "ID": row["id"], "Translate?": "No", "Priority": "", "Status": row["status"],
        "Type": row["type"], "Interviewee": row["interviewee"], "Title (Hebrew)": row["title"],
        "Title (English)": row["english"], "Publication": row["publication"], "Date": row["date"],
        "Original URL": row["url"], "Images": row["images"], "Original HTML Path": row["html_path"],
        "Translation Path": "", "Page Path": row["page_path"],
        "Found In": "; ".join(row["found_in"]), "Notes": "; ".join(row["notes"]),
    }


def existing_key(row):
    if row["Original URL"]:
        return article_key(row["Original URL"])
    return "noref:" + row["Found In"].split("; ")[0]


def write_if_changed(path, text, encoding="utf-8"):
    data = text.encode(encoding)
    if path.exists() and path.read_bytes() == data:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return True


def csv_text(rows):
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=COLUMNS, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue()


def sheet_dump(ws):
    return [(c.coordinate, c.value, c.hyperlink.target if c.hyperlink else None)
            for row in ws.iter_rows() for c in row if c.value is not None]


def nonempty_rows(ws):
    return sum(1 for row in ws.iter_rows() if any(c.value is not None for c in row))


def audit_text(inv, wb, copies_report, final_rows, search_records, wiki_cache):
    lines = ["# Writing inventory audit", "",
             "Generated by `scripts/writing/build_inventory.py`. It records where each row of "
             "`data-source/writing/articles.csv` came from and what was left out, and why. "
             "No source file was moved or changed.", "",
             "## Source files", "", "| File | SHA-256 | Notes |", "| --- | --- | --- |"]
    for path in sorted(SOURCES.iterdir()):
        if path.is_file():
            lines.append(f"| `{path.name}` | `{sha256(path)[:16]}…` | {copies_report.get(path.name, '')} |")
    lines += ["", "Hashes differ between the workbook copies because each file was saved separately; "
              "the comparison above is of every sheet's cell values and hyperlinks.", ""]

    lines += ["## What each source contributed", "", "| Source | New rows | Merged into an existing row |",
              "| --- | --- | --- |"]
    for source, (new, merged) in inv.contrib.items():
        lines.append(f"| {source} | {new} | {merged} |")
    lines += ["", f"`{ARTICLES_BOOK}` holds {search_records} linked search results (some repeat). "
              f"`{ARTICLES_CSV}` is a text export of the same column: every line matches the xlsx, so it "
              "added no rows; its line numbers are recorded in Found In.", ""]

    lines += ["## Sheets left out", "", "| Sheet | Non-empty rows | Reason |", "| --- | --- | --- |"]
    for sheet, reason in AI_SAMPLE_SHEETS.items():
        lines.append(f"| {sheet} | {nonempty_rows(wb[sheet])} | {reason} |")
    lines.append(f"| NimDvirGemini | {nonempty_rows(wb['NimDvirGemini']) - 1} | AI-generated list: Israel Hayom "
                 "article IDs run in steps of 2 (768051, 768053...). Israel Hayom blocks automated checks, "
                 "so these were not verified. Listed below for a manual check. |")
    lines.append(f"| wiki | {nonempty_rows(wb['wiki']) - 1} | Hebrew Wikipedia pages that mention Nim. Used only "
                 "to find citations of his articles. |")
    lines.append(f"| wikipedia | {nonempty_rows(wb['wikipedia'])} | Wikipedia search results (page, snippet, "
                 "size). Used only to find citations of his articles. |")
    lines.append(f"| Sheet17 | {nonempty_rows(wb['Sheet17'])} | Same content as `{PRESS_CSV}`, which was read instead. |")
    lines += ["", "### NimDvirGemini URLs to check by hand", ""]
    for row in wb["NimDvirGemini"].iter_rows(min_row=2):
        if row[0].value:
            lines.append(f"- {row[0].value} {clean_title(row[1].value)}")

    lines += ["", "## Items left out of other sheets", "", "| Source | Where | Title | URL | Reason |",
              "| --- | --- | --- | --- | --- |"]
    for source, where, title, url, reason in inv.excluded:
        lines.append(f"| {source} | {where} | {title.replace('|', '/')} | {url} | {reason} |")

    pages = wiki_cache["pages"]
    cites = [c for p in pages.values() for c in p.get("citations", [])]
    errors = {t: p["error"] for t, p in pages.items() if "error" in p}
    from_wiki = sum(1 for r in final_rows if "he.wikipedia" in r["Notes"] and r["Original URL"])
    lines += ["", "## Wikipedia citations", "",
              f"- Pages read: {len(pages)}. Citations naming Dvir: {len(cites)}. "
              f"Counted as Nim's (Dvir named as author): {sum(1 for c in cites if citation_by_nim(c))}.",
              f"- Rows whose article link came from a Wikipedia citation: {from_wiki}.",
              "- The Wikipedia page itself is never used as an article URL. Links were rendered by "
              "Wikipedia's own citation templates (`action=expandtemplates`)."]
    for title, error in sorted(errors.items()):
        lines.append(f"- Page not found: {title} ({error}). The link in the sheet is probably misspelled.")

    dup = [r for r in final_rows if "possible duplicate" in r["Notes"]]
    lines += ["", "## Possible duplicates (not merged)", ""]
    for r in dup:
        lines.append(f"- {r['ID']} {r['Title (Hebrew)'] or r['Title (English)']}: "
                     + "; ".join(n for n in r["Notes"].split("; ") if "possible duplicate" in n))
    lines += ["", "## Known issues", "",
              "- The Michael Fassbender page on the site uses `L-4478269` as its source. That ID is in no "
              "source list. Hebrew Wikipedia and wiki-2 cite the same headline and date as `L-4478514`. "
              "Check which link is right before changing the page.",
              "- Julia Louis-Dreyfus \"חזרתי\" appears under two Israel Hayom IDs (645081 and the magazine "
              "URL 9387288). They are kept as two rows.",
              "- Matching rule: two rows are one article only when they share a publisher article ID "
              "(Ynet `L-n` and `/article/n` are the same ID) or the same URL. URLs are compared with "
              "percent-escapes in one case; stored URLs are left exactly as found.", ""]

    counts = {}
    for r in final_rows:
        counts.setdefault(r["Status"], 0)
        counts[r["Status"]] += 1
    lines += ["## Totals", "", f"- Rows: {len(final_rows)}",
              f"- With an Original URL: {sum(1 for r in final_rows if r['Original URL'])}"]
    for status in STATUSES:
        if counts.get(status):
            lines.append(f"- Status {status}: {counts[status]}")
    for kind in TYPES:
        n = sum(1 for r in final_rows if r["Type"] == kind)
        if n:
            lines.append(f"- Type {kind}: {n}")
    lines.append("")
    return "\n".join(lines)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    wb = openpyxl.load_workbook(SOURCES / MAIN_BOOK)
    reference = {ws.title: sheet_dump(ws) for ws in wb.worksheets}

    copies_report = {MAIN_BOOK: f"read; {len(wb.worksheets)} sheets"}
    for name in COPIES + [SMALL_COPY]:
        other = openpyxl.load_workbook(SOURCES / name)
        same = all(sheet_dump(ws) == reference.get(ws.title) for ws in other.worksheets)
        all_sheets = {ws.title for ws in other.worksheets} == set(reference)
        if same and all_sheets:
            copies_report[name] = f"identical to {MAIN_BOOK} (all {len(other.worksheets)} sheets)"
        elif same:
            copies_report[name] = f"{len(other.worksheets)} sheets, each identical to {MAIN_BOOK}; adds nothing"
        else:
            raise SystemExit(f"{name} differs from {MAIN_BOOK}; review it before building")
    copies_report[ARTICLES_BOOK] = "read; column A matches the NimDvirArticle sheet, column B holds one stray formula"
    copies_report[ARTICLES_CSV] = "read; text export of the same list, links lost"
    copies_report[PRESS_CSV] = "read; press coverage and appearances"

    cache = json.loads(CITATIONS.read_text(encoding="utf-8")) if CITATIONS.exists() else {"pages": {}}
    if not cache["pages"]:
        print("warning: no Wikipedia citation cache; run fetch_wikipedia_citations.py first")

    inv = Inventory()
    read_published(inv)
    read_sheet15(inv, wb)
    search_records = read_search_results(inv)
    read_sheet12(inv, wb)
    used = read_wiki2(inv, wb, cache)
    read_remaining_citations(inv, cache, used)
    read_press_csv(inv)
    attach_captures(inv)
    finish(inv)

    existing = []
    if OUTPUT.exists():
        with open(OUTPUT, encoding="utf-8-sig", newline="") as handle:
            existing = list(csv.DictReader(handle))
    known = {existing_key(r) for r in existing}
    next_number = max((int(r["ID"][1:]) for r in existing), default=0) + 1
    new_rows = []
    for row in inv.rows:
        if row["key"] in known:
            continue
        row["id"] = f"W{next_number:03d}"
        next_number += 1
        new_rows.append(row)
    flag_duplicates([{**r, "id": r["ID"], "title": r["Title (Hebrew)"], "date": r["Date"], "type": r["Type"],
                      "notes": r["Notes"].split("; ") if r["Notes"] else []} for r in existing] + new_rows)

    final_rows = existing + [to_csv_row(r) for r in new_rows]
    final_rows.sort(key=lambda r: int(r["ID"][1:]))
    changed = write_if_changed(OUTPUT, csv_text(final_rows), encoding="utf-8-sig")
    audit_changed = write_if_changed(AUDIT, audit_text(inv, wb, copies_report, final_rows, search_records, cache))

    print(f"{len(final_rows)} rows ({len(new_rows)} new); articles.csv {'updated' if changed else 'unchanged'}; "
          f"audit {'updated' if audit_changed else 'unchanged'}")


if __name__ == "__main__":
    main()
