"""Build data-source/writing/articles.csv from Nim's article spreadsheets.

Run: python scripts/writing/build_inventory.py

Reads every workbook and CSV in Media/Interviews/ (read-only), including links
stored as cell hyperlinks, and writes:
  data-source/writing/articles.csv       one row per article
  reports/writing/inventory-audit.md     what came from where, and why

Safe to re-run. Existing rows keep their ID and every value already filled in;
a re-run only fills empty cells and appends newly found articles.
"""
from __future__ import annotations

import csv
import hashlib
import io
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'Media' / 'Interviews'
CSV_PATH = ROOT / 'data-source' / 'writing' / 'articles.csv'
AUDIT_PATH = ROOT / 'reports' / 'writing' / 'inventory-audit.md'
PAGES = ROOT / 'src' / 'content' / 'interviews'

COLUMNS = ['ID', 'Translate?', 'Priority', 'Status', 'Type', 'Interviewee',
           'Title (Hebrew)', 'Title (English)', 'Publication', 'Date', 'Original URL',
           'Images', 'Original HTML Path', 'Translation Path', 'Page Path',
           'Found In', 'Notes']

# Workbooks with identical content are read once, from the first file listed.
COPY_GROUP = ['MyWriting.xlsx', 'MyWriting (1).xlsx', 'wiki1.xlsx', 'wiki2.xlsx', 'wiki3.xlsx', 'wiki4.xlsx']
PARTIAL_COPY = 'MyWriting (2).xlsx'
GOOGLE_BOOK = 'NimDvirArticles.xlsx'
GOOGLE_CSV = 'MyWriting - NimDvirArticle.csv'
SHEET17_CSV = 'MyWriting - Sheet17.csv'

SHEET_ROLES = {
    'include hebrew titles too. Do t': 'excluded: AI-generated sample table (2021-2025 news Nim did not write)',
    'Sheet2': 'excluded: AI-generated sample table, CSV text copy of the first sheet',
    'Sheet3': 'excluded: AI-generated sample table with Google search placeholder links',
    'Sheet4': 'excluded: AI-generated sample titles (2022 news)',
    'Sheet5': 'excluded: AI-generated sample titles, copy of Sheet4',
    'Sheet6': 'excluded: AI-generated "American celebrity interviews" sample with placeholder titles',
    'Sheet8': 'excluded: AI-generated celebrity interview sample (2021-2025)',
    'Deepseek': 'excluded: AI-generated sample of 2024 Israel Hayom English news',
    'Gemini': 'excluded: AI-generated sample table, CSV text copy of the first sheet',
    'wiki': 'reference: list of Hebrew Wikipedia pages that cite Nim; not articles',
    'wikipedia': 'reference: Wikipedia search results citing Nim; their article titles are listed in wiki-2',
    'Sheet15': 'used: two finished English translations (Jamie Foxx, Jim Carrey), already published',
    'NimDvirArticle': 'used: Google results list, same as NimDvirArticles.xlsx',
    'Sheet12': 'used: Nim\'s list of journalism and academic work with URLs',
    'Sheet17': 'used: press coverage and media appearances (CSV text in cells), same as MyWriting - Sheet17.csv',
    'NimDvirGemini': 'used, flagged: 19 Israel Hayom URLs with suspicious sequential IDs',
    'wiki-2': 'used: article titles cited on Wikipedia, plus direct links',
}

STATUSES = ['not started', 'needs checking', 'not my writing', 'skip',
            'captured', 'translated', 'page created', 'published']
TYPES = ['interview', 'review', 'feature', 'column', 'report', 'other', 'unknown']

HEBREW_MONTHS = {'ינו': 1, 'פבר': 2, 'מרץ': 3, 'מרס': 3, 'אפר': 4, 'מאי': 5, 'יוני': 6,
                 'יולי': 7, 'אוג': 8, 'ספט': 9, 'אוק': 10, 'נוב': 11, 'דצמ': 12}
ENGLISH_MONTHS = {m: i for i, m in enumerate(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 1)}
BYLINE = re.compile(r'נמרוד דביר')
# The name preceded by "reporter" means someone else wrote about him.
ABOUT_NIM = re.compile(r'(?:כתב|הכתב|כתבנו)(?: ynet| הישראלי)? נמרוד דביר')


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cell_text(value) -> str:
    return '' if value is None else str(value).strip()


def sheet_signature(ws) -> str:
    items = [(c.coordinate, cell_text(c.value), c.hyperlink.target if c.hyperlink else None)
             for row in ws.iter_rows() for c in row if c.value is not None or c.hyperlink]
    return hashlib.md5(json.dumps(items, ensure_ascii=False).encode()).hexdigest()


def book_signature(wb) -> str:
    return hashlib.md5('|'.join(f'{ws.title}:{sheet_signature(ws)}' for ws in wb.worksheets).encode()).hexdigest()


# ---------- URLs ----------

def unwrap(url: str) -> str:
    """Return the destination of a Google redirect link, otherwise the URL unchanged."""
    parts = urlsplit(url)
    if parts.netloc.endswith('google.com') and parts.path == '/url':
        return parse_qs(parts.query).get('q', [url])[0]
    return url


def identity(url: str) -> str:
    """A key that is equal only for links to the same article."""
    host = urlsplit(url).netloc.lower()
    if host.endswith('ynet.co.il'):
        m = re.search(r'L-(\d+)', url) or re.search(r'/article/(\d+)', url)
        if m:
            return f'ynet:{m.group(1)}'
    if host.endswith('israelhayom.co.il'):
        m = re.search(r'/(?:article|opinion)/(\d+)', url)
        if m:
            return f'israelhayom:{m.group(1)}'
    return url


def is_article_url(url: str) -> bool:
    host = urlsplit(url).netloc.lower()
    path = urlsplit(url).path
    if not host:
        return False
    if is_index_url(url):
        return False
    if host.endswith('ynet.co.il'):
        return identity(url).startswith('ynet:')
    if host.endswith('blogspot.com'):
        return '/search/label/' not in path
    return True


def is_index_url(url: str) -> bool:
    """Pages that list articles rather than being one: never imported as rows."""
    parts = urlsplit(url)
    host = parts.netloc.lower()
    return (host == 'w.wiki' or host.endswith('wikipedia.org') or '/search/label/' in parts.path
            or (host.endswith('ynet.co.il') and parts.path.startswith('/topics/')))


def publication(url: str) -> str:
    host = urlsplit(url).netloc.lower()
    for key, name in [('xnet.ynet.co.il', 'Xnet'), ('ynet.co.il', 'Ynet'), ('israelhayom', 'Israel Hayom'),
                      ('atmag', 'At Magazine'), ('prtfl', 'Portfolio'), ('jewishjournal', 'Jewish Journal'),
                      ('nrg.co.il', 'nrg'), ('makorrishon.co.il/nrg', 'nrg'), ('blogspot', 'Nim Dvir blog'),
                      ('ew.com', 'Entertainment Weekly'), ('vulture', 'Vulture'), ('nana10', 'Nana10'),
                      ('walla', 'Walla'), ('bizportal', 'Bizportal'), ('variginlondon', 'Varig in London'),
                      ('apple.com', 'Apple Podcasts'), ('spotify', 'Spotify'), ('scholar.google', 'Google Scholar'),
                      ('ssrn', 'SSRN'), ('arxiv', 'arXiv'), ('sciencedirect', 'ScienceDirect')]:
        if key in host or key in url:
            return name
    return host


# ---------- text ----------

def norm_title(title: str) -> str:
    t = re.sub(r'\s*-\s*ynet\s*$', '', title)
    t = t.replace('ריאיון', 'ראיון')
    return re.sub(r'[^\w]', '', t)


def parse_date(text: str) -> str:
    m = re.search(r'(?<!\d)(\d{1,2})[./](\d{1,2})[./](\d{4}|\d{2})(?!\d)', text)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        y = y + 2000 if y < 100 else y
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}'
    m = re.search(r'(\d{1,2}) ב(' + '|'.join(HEBREW_MONTHS) + r')\S* (\d{4})', text)
    if m:
        return f'{int(m.group(3)):04d}-{HEBREW_MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}'
    m = re.match(r'(\d{4})-(\d{2})(?:-(\d{2}))?$', text.strip()[:10])
    if m:
        return m.group(0)
    return ''


def classify(title: str, snippet: str, breadcrumb: str) -> str:
    text = f'{title} {snippet}'
    if re.search(r'ר(?:י)?איון|בראיון|שוחח איתה|שוחח איתו|פגש את', text) or QUOTE_HEADLINE.match(title.lstrip(',')):
        return 'interview'
    if 'ביקורות' in breadcrumb or re.search(r'ביקורת|:\s*על ', title):
        return 'review'
    if 'טורים' in breadcrumb or 'מדורים' in breadcrumb:
        return 'column'
    if 'המלצות' in title:
        return 'other'
    if 'חדשות' in breadcrumb or re.search(r'הוכרזו|הזוכים|זוכים בפרס|הלך לעולמו|מונה ל|מגיע לישראל|חוזרת לישראל', title):
        return 'report'
    if 'כתבות' in breadcrumb or 'מגזין' in breadcrumb:
        return 'feature'
    return 'unknown'


# A headline of the form  Name: "quote"  (Wikipedia copies may read  Name":quote").
QUOTE_HEADLINE = re.compile(r'^([^:"]{3,30}?)\s*(?:"\s*:|:\s*["\'])')


def interviewee_from(title: str) -> str:
    t = re.sub(r'\s*-\s*ynet\s*$', '', title).lstrip(',')
    m = re.search(r'ר(?:י)?איון עם ([^:"]+?)(?:\s+מ"|\s*\(|$)', t)
    if m:
        return m.group(1).strip()
    m = QUOTE_HEADLINE.match(t)
    if m and len(m.group(1).split()) <= 3:
        return m.group(1).strip()
    return ''


# ---------- records ----------

class Inventory:
    def __init__(self):
        self.records: list[dict] = []
        self.by_identity: dict[str, dict] = {}
        self.aliases: dict[str, set] = defaultdict(set)
        self.skipped: list[tuple[str, str, str]] = []  # (origin, text, reason)

    def add(self, origin: str, url: str = '', **fields) -> None:
        url = url.strip()
        if url:
            real = unwrap(url)
            if real != url:
                fields['notes'] = (fields.get('notes', '') + ' Link was a Google redirect; unwrapped.').strip()
                url = real
            if not is_article_url(url):
                if is_index_url(url) or (not fields.get('title_he') and not fields.get('title_en')):
                    self.skipped.append((origin, url, 'index or reference page, not an article'))
                    return
                fields['notes'] = (fields.get('notes', '') + f' Listed link is not an article page: {url}').strip()
                url = ''
        key = identity(url) if url else None
        if key and key in self.by_identity:
            rec = self.by_identity[key]
            rec['origins'].append(origin)
            if url != rec['url']:
                self.aliases[key].add(url)
            for k, v in fields.items():
                if k == 'notes':
                    if v and v not in rec['notes']:
                        rec['notes'] = (rec['notes'] + ' ' + v).strip()
                elif k == 'status':
                    rec['status'] = stronger(rec['status'], v)
                elif v and not rec.get(k):
                    rec[k] = v
            return
        rec = {'url': url, 'origins': [origin], 'title_he': '', 'title_en': '', 'date': '', 'type': '',
               'interviewee': '', 'status': '', 'notes': '', 'publication': publication(url) if url else ''}
        rec.update({k: v for k, v in fields.items() if v})
        self.records.append(rec)
        if key:
            self.by_identity[key] = rec


# Facts noticed while reviewing the sources, attached to the matching row.
KNOWN_NOTES = {
    'ynet:4478514': 'Same Hebrew headline as the published Michael Fassbender interview (Ynet L-4478269); '
                    'probably the same article at a second address.',
}

# A later source can make a row more cautious, never less.
STRENGTH = ['not started', 'needs checking', 'skip', 'not my writing', 'published']


def stronger(a: str, b: str) -> str:
    if not a:
        return b
    if not b:
        return a
    return a if STRENGTH.index(a) >= STRENGTH.index(b) else b


def read_google(inv: Inventory, cells: list[tuple[str, str, str]], label: str) -> list[str]:
    """Search-result triplets: title (with hyperlink), breadcrumb, snippet."""
    current = None
    pending_title = ''
    noise = []

    def flush():
        if not current:
            return
        title, url, crumb, snippet, origin = current
        byline = bool(BYLINE.search(snippet)) and not ABOUT_NIM.search(snippet)
        kind = classify(title, snippet, crumb)
        notes = ''
        if title.endswith('...'):
            notes = 'Title is cut off in the search result.'
        status = 'not started' if byline else 'needs checking'
        if not byline:
            notes = (notes + ' Search snippet does not show Nim as the author; confirm he wrote it.').strip()
        inv.add(origin, url, title_he=re.sub(r'\s*-\s*ynet\s*$', '', title), date=parse_date(snippet),
                type=kind, status=status, notes=notes, snippet=snippet)

    for coord, text, link in cells:
        origin = f'{label}!{coord}'
        if link:
            if current and link == current[1] and text.startswith('http'):
                continue  # the URL repeated as text under its own title
            flush()
            title = pending_title if text.startswith('http') and pending_title else text
            current = [title, link, '', '', origin]
            pending_title = ''
        elif current and '›' in text and not current[2]:
            current[2] = text
        elif current and not current[3]:
            current[3] = text
        elif re.match(r'^בערך [\d,]+ תוצאות', text):
            noise.append(f'{origin}: "{text}" (search result count)')
        else:
            pending_title = text
    flush()
    return noise


def parse_sheet17(text: str) -> list[dict]:
    """title,short_description,url,date rows; one title contains an unquoted comma."""
    out = []
    for fields in list(csv.reader(io.StringIO(text)))[1:]:
        at = next((i for i, f in enumerate(fields) if f.strip().startswith('http')), None)
        if at is None or at < 2:
            continue
        out.append({'title': ','.join(fields[:at - 1]), 'short_description': fields[at - 1],
                    'url': fields[at].strip(), 'date': fields[at + 1] if at + 1 < len(fields) else ''})
    return out


def read_sources(inv: Inventory, audit: dict) -> None:
    files = sorted(p.name for p in SOURCES.iterdir() if p.is_file())
    audit['files'] = [(n, sha(SOURCES / n)) for n in files]
    books = {n: openpyxl.load_workbook(SOURCES / n) for n in files if n.endswith('.xlsx')}
    sigs = {n: book_signature(wb) for n, wb in books.items()}
    audit['identical'] = [n for n in COPY_GROUP if sigs.get(n) == sigs[COPY_GROUP[0]]]
    audit['not_identical'] = [n for n in COPY_GROUP if n in sigs and sigs[n] != sigs[COPY_GROUP[0]]]
    primary = books[COPY_GROUP[0]]

    # MyWriting (2): every sheet it shares with MyWriting must match, otherwise read it too.
    partial = books.get(PARTIAL_COPY)
    audit['partial'] = []
    extra_sheets = []
    if partial:
        for ws in partial.worksheets:
            same = ws.title in primary.sheetnames and sheet_signature(ws) == sheet_signature(primary[ws.title])
            audit['partial'].append((ws.title, 'identical to MyWriting.xlsx' if same else 'differs: read separately'))
            if not same:
                extra_sheets.append(ws)

    # Google results list.
    gws = books[GOOGLE_BOOK].active
    gcells = [(c.coordinate, cell_text(c.value), c.hyperlink.target if c.hyperlink else '')
              for row in gws.iter_rows() for c in row[:1] if c.value is not None]
    same_as_sheet = [t for _, t, _ in gcells] == [cell_text(r[0].value) for r in primary['NimDvirArticle'].iter_rows() if r[0].value is not None]
    audit['google'] = {
        'cells': len(gcells), 'links': sum(1 for *_, l in gcells if l),
        'distinct': len({l for *_, l in gcells if l}),
        'same_as_sheet': same_as_sheet,
        'formulas': [f'{c.coordinate}: {c.value}' for row in gws.iter_rows() for c in row
                     if isinstance(c.value, str) and c.value.startswith('=')],
    }
    audit['noise'] = read_google(inv, gcells, f'{GOOGLE_BOOK}!{gws.title}')

    # The CSV export of the same list lost its links. Report any line the workbook lacks.
    with open(SOURCES / GOOGLE_CSV, encoding='utf-8-sig', newline='') as f:
        csv_lines = [r[0].strip() for r in csv.reader(f) if r and r[0].strip()]
    book_text = {t for _, t, _ in gcells}
    audit['google_csv'] = {'lines': len(csv_lines), 'missing_from_book': [l for l in csv_lines if l not in book_text]}
    for line in audit['google_csv']['missing_from_book']:
        inv.add(f'{GOOGLE_CSV}', '', title_he=line, status='needs checking',
                notes='Only in the CSV export; no link.', type='unknown')

    # Sheet12: "Hebrew / English" titles with URLs, journalism and academic.
    for row in primary['Sheet12'].iter_rows(min_row=2):
        title, source, link = cell_text(row[1].value), cell_text(row[2].value), cell_text(row[3].value)
        if not link:
            continue
        he, _, en = title.partition(' / ')
        if not re.search(r'[֐-׿]', he):
            he, en = '', title
        origin = f'MyWriting.xlsx!Sheet12!{row[1].coordinate}'
        if source in ('Google Scholar', 'SSRN', 'arXiv', 'ScienceDirect'):
            inv.add(origin, link, title_en=en, status='skip', type='other',
                    notes='Academic publication; handled by the publications collection.')
        elif source == 'Jewish Journal':
            inv.add(origin, link, title_en=en, status='skip', type='column', notes='Written in English; no translation needed.')
        else:
            inv.add(origin, link, title_he=he.strip(), title_en=en.strip(), status='not started',
                    type=classify(he, '', ''), publication=source if source != 'ynet' else '')

    # Sheet15: finished English translations.
    for row in primary['Sheet15'].iter_rows(min_row=2):
        link = cell_text(row[2].value)
        if link:
            inv.add(f'MyWriting.xlsx!Sheet15!{row[0].coordinate}', link, title_he=cell_text(row[1].value),
                    type='interview', notes='English translation exists in MyWriting.xlsx Sheet15.')

    # Sheet17 (CSV text in cells) and its CSV twin.
    sheet17 = '\n'.join(cell_text(r[0].value) for r in primary['Sheet17'].iter_rows() if r[0].value is not None)
    with open(SOURCES / SHEET17_CSV, encoding='utf-8-sig', newline='') as f:
        # A one-column export of the sheet: each line is one cell holding CSV text.
        csv17 = '\n'.join(r[0] for r in csv.reader(f) if r)
    rows17 = parse_sheet17(sheet17)
    rows_csv = parse_sheet17(csv17)
    audit['sheet17'] = {'sheet_rows': len(rows17), 'csv_rows': len(rows_csv),
                        'only_in_csv': [r['url'] for r in rows_csv if r['url'] not in {x['url'] for x in rows17}]}
    for i, r in enumerate(rows17 + [r for r in rows_csv if r['url'] in audit['sheet17']['only_in_csv']], 2):
        origin = f'MyWriting.xlsx!Sheet17!A{i}' if i - 2 < len(rows17) else f'{SHEET17_CSV}!{r["url"]}'
        url, desc, title = r['url'].strip(), r['short_description'], r['title'].strip()
        pub = publication(url)
        if pub in ('Apple Podcasts', 'Spotify'):
            inv.skipped.append((origin, url, 'podcast appearance, not writing'))
            continue
        he = title if re.search(r'[֐-׿]', title) and 'to verify' not in title else ''
        if 'response article by' in desc:
            inv.add(origin, url, title_he=he, status='not my writing', notes='Response to Nim\'s article, written by Yuval Ganor.')
        elif pub in ('Ynet', 'Xnet', 'nrg'):
            note = 'Article about Nim\'s encounter with Sacha Baron Cohen; byline needs checking.' if 'Dictator' in desc else ''
            status = 'needs checking' if note else ''  # a placeholder title says nothing about authorship
            inv.add(origin, url, title_he=he, date=parse_date(r['date']), status=status, notes=note)
        else:
            inv.add(origin, url, title_he=he, title_en='' if he else title, date=parse_date(r['date']),
                    status='not my writing', notes='Coverage about Nim, not written by him.')

    # NimDvirGemini: suspicious sequential IDs.
    for row in primary['NimDvirGemini'].iter_rows(min_row=2):
        link, title = cell_text(row[0].value), cell_text(row[1].value).strip('"')
        if link:
            inv.add(f'MyWriting.xlsx!NimDvirGemini!{row[0].coordinate}', link, title_he=title, status='needs checking',
                    type=classify(title, '', ''),
                    notes='Suspicious: sequential IDs from an AI-generated sheet. Open in a browser before trusting.')

    # wiki-2: titles cited on Wikipedia, plus direct links.
    for row in primary['wiki-2'].iter_rows(min_row=2):
        headline, link = cell_text(row[0].value), cell_text(row[1].value)
        if not headline and not link:
            continue
        origin = f'MyWriting.xlsx!wiki-2!{row[0].coordinate}'
        host = urlsplit(link).netloc.lower()
        if 'wikipedia.org' in host:
            inv.add(origin, '', title_he=headline, type=classify(headline, '', ''), status='needs checking',
                    notes=f'Title cited on Hebrew Wikipedia ({link}); no article link yet. Punctuation may be scrambled.')
            continue
        pub = publication(link)
        if pub in ('Entertainment Weekly', 'Vulture', 'Nana10', 'Varig in London'):
            inv.add(origin, link, title_en=headline, status='not my writing', notes='Coverage about Nim, not written by him.')
        elif pub == 'Nim Dvir blog':
            inv.add(origin, link, title_en=headline, status='skip', notes='English post on Nim\'s blog; no translation needed.')
        else:
            unverified = 'not yet verified' in headline or 'supplied by user' in headline
            he = '' if unverified or not re.search(r'[֐-׿]', headline) else headline
            inv.add(origin, link, title_he=he, title_en='' if he or unverified else headline,
                    type=classify(he, '', ''), status='' if unverified or not he else 'not started')

    for ws in extra_sheets:
        audit.setdefault('extra', []).append(ws.title)

    audit['sheets'] = [(ws.title, ws.max_row, SHEET_ROLES.get(ws.title, 'unmapped: review')) for ws in primary.worksheets]


def read_pages(inv: Inventory) -> None:
    for path in sorted(PAGES.glob('*.md')):
        front = path.read_text(encoding='utf-8').split('---')[1]
        meta = {}
        for line in front.splitlines():
            m = re.match(r'(\w+):\s*(.*)$', line)
            if m:
                meta[m.group(1)] = m.group(2).strip().strip('"\'')
        d = re.match(r'(\w{3}) (\d{1,2}), (\d{4})', meta.get('date', ''))
        date = f'{d.group(3)}-{ENGLISH_MONTHS[d.group(1)]:02d}-{int(d.group(2)):02d}' if d else ''
        rel = path.relative_to(ROOT).as_posix()
        inv.add(rel, meta['sourceUrl'], title_en=meta.get('title', ''), interviewee=meta.get('interviewee', ''),
                date=date, type='interview', status='published', page=rel, images='on Cloudinary',
                publication=meta.get('source', ''))
        rec = inv.by_identity[identity(meta['sourceUrl'])]
        rec['interviewee'] = meta.get('interviewee', '')  # the published page is authoritative
        rec['type'] = 'interview'
        rec['title_en'] = meta.get('title', '')
        rec['date'] = date or rec['date']


def finish(inv: Inventory) -> None:
    for rec in inv.records:
        if not rec.get('type'):
            rec['type'] = classify(rec.get('title_he', ''), rec.get('snippet', ''), '')
        if rec['type'] == 'interview' and not rec.get('interviewee'):
            rec['interviewee'] = interviewee_from(rec.get('title_he', '')) or 'unknown'
            if rec['interviewee'] == 'unknown' and rec['status'] == 'not started':
                rec['status'] = 'needs checking'
                rec['notes'] = (rec['notes'] + ' Interviewee not clear from the title.').strip()
        if not rec.get('status') or (rec['status'] == 'not started' and not rec['url']):
            rec['status'] = 'needs checking'
        note = KNOWN_NOTES.get(identity(rec['url'])) if rec['url'] else None
        if note and note not in rec['notes']:
            rec['notes'] = (rec['notes'] + ' ' + note).strip()
            rec['status'] = stronger(rec['status'], 'needs checking')

    # Possible duplicates: same normalized title, never merged automatically.
    groups = defaultdict(list)
    for rec in inv.records:
        key = norm_title(rec.get('title_he') or rec.get('title_en') or '')
        if len(key) >= 4:
            groups[key].append(rec)
    # Two different Ynet article IDs are two different articles, even with the same title.
    inv.dupes = []
    for g in groups.values():
        flagged = [r for r in g if any(o is not r and not both_ynet(r, o) for o in g)]
        if len(flagged) > 1:
            inv.dupes.append(flagged)


def both_ynet(a: dict, b: dict) -> bool:
    return all(r['url'] and identity(r['url']).startswith('ynet:') for r in (a, b))


def to_row(rec: dict, rid: str) -> dict:
    return {
        'ID': rid, 'Translate?': 'No', 'Priority': '', 'Status': rec['status'], 'Type': rec['type'],
        'Interviewee': rec.get('interviewee', '') if rec['type'] == 'interview' else rec.get('interviewee', ''),
        'Title (Hebrew)': rec.get('title_he', ''), 'Title (English)': rec.get('title_en', ''),
        'Publication': rec.get('publication', ''), 'Date': rec.get('date', ''), 'Original URL': rec['url'],
        'Images': rec.get('images', ''), 'Original HTML Path': '', 'Translation Path': '',
        'Page Path': rec.get('page', ''), 'Found In': '; '.join(dict.fromkeys(rec['origins'])),
        'Notes': rec.get('notes', ''),
    }


def row_key(row: dict) -> str:
    return identity(row['Original URL']) if row['Original URL'] else 'origin:' + row['Found In'].split('; ')[0]


def merge(inv: Inventory) -> list[dict]:
    existing = []
    if CSV_PATH.exists():
        with open(CSV_PATH, encoding='utf-8-sig', newline='') as f:
            existing = list(csv.DictReader(f))
    by_key = {row_key(r): r for r in existing}
    next_id = max([int(r['ID'][1:]) for r in existing] or [0]) + 1

    def order(rec):
        return (0 if rec.get('date') else 1, rec.get('date', ''), rec['origins'][0])

    # Duplicate notes need IDs, so assign IDs first.
    ids = {}
    for rec in sorted(inv.records, key=order):
        fresh = to_row(rec, '')
        old = by_key.get(row_key(fresh))
        if old:
            ids[id(rec)] = old['ID']
        else:
            ids[id(rec)] = f'W{next_id:03d}'
            next_id += 1
    for group in inv.dupes:
        for rec in group:
            others = ', '.join(sorted(ids[id(o)] for o in group if o is not rec and not both_ynet(rec, o)))
            rec['notes'] = (rec['notes'] + f' Possible duplicate of {others}.').strip()

    rows = {r['ID']: r for r in existing}
    for rec in inv.records:
        fresh = to_row(rec, ids[id(rec)])
        old = rows.get(fresh['ID'])
        if old:
            for col in COLUMNS:  # fill empty cells only; never overwrite
                if not old.get(col) and fresh[col]:
                    old[col] = fresh[col]
        else:
            rows[fresh['ID']] = fresh
    return [rows[k] for k in sorted(rows, key=lambda x: int(x[1:]))]


def write_csv(rows: list[dict]) -> None:
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=COLUMNS, lineterminator='\n')
    w.writeheader()
    w.writerows({c: r.get(c, '') for c in COLUMNS} for r in rows)
    CSV_PATH.write_text(buf.getvalue(), encoding='utf-8-sig', newline='')


def write_audit(inv: Inventory, audit: dict, rows: list[dict]) -> None:
    L = ['# Article inventory audit', '',
         'Generated by `python scripts/writing/build_inventory.py`. Do not edit by hand; rerun the script.', '',
         '## Source files', '', '| File | SHA-256 (first 16) |', '| --- | --- |']
    L += [f'| `{n}` | `{h[:16]}` |' for n, h in audit['files']]
    L += ['', '## Copies', '',
          f'These workbooks have identical sheets, cell values, and hyperlinks (file bytes differ): '
          f'{", ".join(f"`{n}`" for n in audit["identical"])}. Only `{COPY_GROUP[0]}` is read.']
    if audit['not_identical']:
        L.append(f'Not identical, needs review: {", ".join(audit["not_identical"])}.')
    L += ['', f'`{PARTIAL_COPY}`, sheet by sheet:', '']
    L += [f'- {t}: {s}' for t, s in audit['partial']]
    if audit.get('extra'):
        L.append(f'- Sheets that differ and were NOT imported automatically: {", ".join(audit["extra"])}. Review them.')
    g = audit['google']
    L += ['', f'## `{GOOGLE_BOOK}`', '',
          f'- {g["cells"]} nonempty cells, {g["links"]} hyperlinks, {g["distinct"]} distinct targets.',
          f'- Same text as the `NimDvirArticle` sheet in `{COPY_GROUP[0]}`: {"yes" if g["same_as_sheet"] else "NO"}.',
          f'- Formulas: {"; ".join(g["formulas"]) or "none"} (refers to the link already read from A1).']
    L += [f'- Ignored: {n}' for n in audit['noise']]
    c = audit['google_csv']
    L += [f'- `{GOOGLE_CSV}`: {c["lines"]} lines, links lost in export. Lines not in the workbook: '
          f'{len(c["missing_from_book"])}.']
    s = audit['sheet17']
    L += ['', '## Sheet17 and its CSV', '',
          f'- Sheet rows: {s["sheet_rows"]}; `{SHEET17_CSV}` rows: {s["csv_rows"]}; rows only in the CSV: {len(s["only_in_csv"])}.']
    L += ['', f'## Sheets in `{COPY_GROUP[0]}`', '', '| Sheet | Rows | Handling |', '| --- | ---: | --- |']
    L += [f'| {t} | {n} | {r} |' for t, n, r in audit['sheets']]
    L += ['', '## Counts', '', f'Rows in `articles.csv`: {len(rows)}', '', '| Status | Rows |', '| --- | ---: |']
    sc = Counter(r['Status'] for r in rows)
    L += [f'| {k} | {sc[k]} |' for k in STATUSES if sc[k]]
    L += ['', 'Rows that could be translated (not started, needs checking, published):', '', '| Type | Rows |', '| --- | ---: |']
    tc = Counter(r['Type'] for r in rows if r['Status'] in ('not started', 'needs checking', 'published'))
    L += [f'| {k} | {tc[k]} |' for k in TYPES if tc[k]]
    L += ['', f'- With an article link: {sum(1 for r in rows if r["Original URL"])}',
          f'- Without a link: {sum(1 for r in rows if not r["Original URL"])}',
          f'- Interviews with interviewee "unknown": {sum(1 for r in rows if r["Type"] == "interview" and r["Interviewee"] == "unknown")}']
    L += ['', '## Links listed more than one way', '']
    L += [f'- `{k}`: {", ".join(sorted(v))}' for k, v in sorted(inv.aliases.items())] or ['None.']
    L += ['', '## Possible duplicates (same title, not merged)', '']
    id_by_rec = {}
    for r in rows:
        id_by_rec[(r['Original URL'], r['Found In'].split('; ')[0])] = r['ID']
    for group in inv.dupes:
        ids = [id_by_rec.get((rec['url'], rec['origins'][0]), '?') for rec in group]
        L.append(f'- {", ".join(sorted(ids))}: {group[0].get("title_he") or group[0].get("title_en")}')
    L += ['', '## Not imported', '']
    L += [f'- {o}: {t} ({why})' for o, t, why in inv.skipped] or ['None.']
    AUDIT_PATH.parent.mkdir(parents=True, exist_ok=True)
    AUDIT_PATH.write_text('\n'.join(L) + '\n', encoding='utf-8', newline='\n')


def main() -> None:
    inv, audit = Inventory(), {}
    read_sources(inv, audit)
    read_pages(inv)
    finish(inv)
    rows = merge(inv)
    write_csv(rows)
    write_audit(inv, audit, rows)
    print(f'{len(rows)} rows written to {CSV_PATH.relative_to(ROOT)}')
    print(f'Audit written to {AUDIT_PATH.relative_to(ROOT)}')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
