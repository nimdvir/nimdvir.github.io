"""Audit built SEO metadata, scholarly records, feeds, and internal URLs.
Run after npm run build. Uses only the Python standard library.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET
from email.utils import parsedate_to_datetime
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import sys

ROOT = Path(__file__).resolve().parents[1] / 'dist'
SITE = 'https://nimdvir.com'
INTERNAL_HOSTS = {'nimdvir.com', 'www.nimdvir.com', 'nimdvir.github.io'}

class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.meta = {}; self.links = []; self.ids = set(); self.schemas = []
        self.title = ''; self.h1 = 0; self.main = 0; self.base = False
        self._title = False; self._schema = None
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title': self._title = True
        if tag == 'h1': self.h1 += 1
        if tag == 'main': self.main += 1
        if tag == 'base' and a.get('target') == '_blank': self.base = True
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'meta': self.meta.setdefault(a.get('name', a.get('property', '')), []).append(a.get('content', ''))
        if tag in ('a', 'link') and a.get('href'): self.links.append(a)
        if tag == 'script' and a.get('type') == 'application/ld+json': self._schema = ''
    def handle_data(self, data):
        if self._title: self.title += data
        if self._schema is not None: self._schema += data
    def handle_endtag(self, tag):
        if tag == 'title': self._title = False
        if tag == 'script' and self._schema is not None:
            self.schemas.append(json.loads(self._schema)); self._schema = None
    def one(self, key):
        values = self.meta.get(key, [])
        return values[0] if len(values) == 1 else None

if not ROOT.exists(): sys.exit('Build dist/ first.')
docs = {p.resolve(): Document(p) for p in ROOT.rglob('*.html')}
errors = []; titles = {}; descriptions = {}; indexed = {}; publications = []
def require(ok, message):
    if not ok: errors.append(message)
def target(value):
    path = ROOT / unquote(urlsplit(value).path).lstrip('/')
    return path / 'index.html' if path.is_dir() else path

for file, doc in docs.items():
    label = str(file.relative_to(ROOT)); noindex = 'noindex' in (doc.one('robots') or '')
    canon = [link['href'] for link in doc.links if link.get('rel') == 'canonical']
    require(not doc.base, f'{label}: global new-tab default')
    if canon: require(len(canon) == 1 and canon[0].startswith(SITE + '/'), f'{label}: canonical domain')
    for link in doc.links:
        url = urlsplit(link['href'])
        if url.hostname in INTERNAL_HOSTS and not url.path.startswith('/cce-2026'):
            t = target(link['href']).resolve()
            require(t.exists(), f'{label}: missing absolute internal URL {link["href"]}')
            if url.fragment and t in docs: require(unquote(url.fragment) in docs[t].ids, f'{label}: missing absolute anchor {link["href"]}')
    if not doc.main or noindex: continue
    require(doc.h1 == 1, f'{label}: expected one h1')
    require(len(canon) == 1, f'{label}: missing canonical')
    if not canon: continue
    canonical = canon[0]; indexed[canonical] = doc
    require(target(canonical).resolve() == file, f'{label}: canonical points elsewhere')
    for key in ['description', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:title', 'twitter:description', 'twitter:url', 'twitter:image']:
        require(bool(doc.one(key)), f'{label}: missing/duplicate {key}')
    for key in ['og:url', 'twitter:url']: require(doc.one(key) == canonical, f'{label}: {key} differs from canonical')
    for key in ['og:title', 'twitter:title']: require(doc.one(key) == doc.title, f'{label}: {key} differs from title')
    require('—' not in doc.title, f'{label}: em dash in title')
    require(doc.title not in titles, f'{label}: duplicate title')
    require(doc.one('description') not in descriptions, f'{label}: duplicate description')
    titles[doc.title] = label; descriptions[doc.one('description')] = label
    require(any(l.get('type') == 'application/rss+xml' and l['href'] == SITE + '/rss.xml' for l in doc.links), f'{label}: RSS discovery')
    types = {s.get('@type'): s for s in doc.schemas}
    require(types.get('Person', {}).get('@id') == SITE + '/#person', f'{label}: stable Person identity')
    require(types.get('Person', {}).get('image') == SITE + '/images/nim-dvir-cce.jpg', f'{label}: Person image is not a portrait')
    require(types.get('WebSite', {}).get('url') == SITE + '/', f'{label}: WebSite domain')
    if label == 'cv/index.html': require(types.get('ProfilePage', {}).get('mainEntity', {}).get('@id') == SITE + '/#person', 'CV: ProfilePage mainEntity')
    parts = file.relative_to(ROOT).parts
    if len(parts) == 3 and parts[0] in ('projects', 'research', 'blog', 'publications'):
        crumbs = types.get('BreadcrumbList', {}).get('itemListElement', [])
        require(len(crumbs) == 3 and [c['position'] for c in crumbs] == [1,2,3], f'{label}: breadcrumb positions')
        require(bool(crumbs) and crumbs[-1]['item'] == canonical, f'{label}: breadcrumb URL')
    if parts[0] == 'blog' and len(parts) == 3:
        article = types.get('BlogPosting', {})
        require(article.get('url') == canonical and article.get('headline') in doc.title, f'{label}: blog article identity')
        require(article.get('datePublished') and article.get('author', {}).get('url') == SITE + '/cv/', f'{label}: article date/byline')
    if parts[0] == 'publications':
        publications.append(label)
        for key in ('citation_title', 'citation_publication_date', 'citation_abstract_html_url'):
            require(bool(doc.one(key)), f'{label}: missing {key}')
        article = types.get('ScholarlyArticle', {})
        require(article.get('headline') == doc.one('citation_title'), f'{label}: citation title mismatch')
        require(article.get('abstract') and 'abstract-title' in doc.ids, f'{label}: visible original abstract')
        require([a['name'] for a in article.get('author', [])] == doc.meta.get('citation_author', []), f'{label}: citation authors mismatch')
        require(doc.one('citation_abstract_html_url') == canonical, f'{label}: abstract URL')
        pdf = doc.one('citation_pdf_url')
        if pdf:
            require(pdf.startswith(canonical), f'{label}: PDF is not colocated')
            f = target(pdf)
            require(f.exists() and f.read_bytes().startswith(b'%PDF') and f.stat().st_size < 5_000_000, f'{label}: missing/oversize/non-PDF full text')

ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [e.text for e in ET.parse(ROOT/'sitemap.xml').findall('s:url/s:loc', ns)]
require(len(urls) == len(set(urls)), 'Duplicate sitemap URLs')
require(set(urls) == set(indexed), 'Sitemap must match indexable canonical pages exactly')
require((ROOT/'robots.txt').read_text() == f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n', 'robots.txt content')
feed = ET.parse(ROOT/'rss.xml').getroot(); items = feed.findall('channel/item')
guids = [item.findtext('guid') for item in items]
require(len(guids) == len(set(guids)), 'RSS duplicate GUIDs')
dates = []
for item in items:
    link = item.findtext('link'); doc = docs.get(target(link).resolve()); fragment = urlsplit(link).fragment
    require(link.startswith(SITE + '/') and doc is not None, f'RSS URL {link}')
    require(not fragment or fragment in doc.ids, f'RSS anchor {link}')
    date = parsedate_to_datetime(item.findtext('pubDate')); dates.append(date)
    require(date.date() <= datetime.now(ZoneInfo('America/New_York')).date(), 'Future item in RSS')
require(dates == sorted(dates, reverse=True), 'RSS must be newest first')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'PASS: {len(indexed)} canonical pages, unique titles/descriptions, structured data, {len(publications)} scholarly pages, {len(items)} RSS items, sitemap, robots, and absolute internal links.')
