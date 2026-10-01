"""Check a built static site using only Python's standard library.
Run npm run build, then python scripts/verify_site.py.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1] / 'dist'
class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.ids=set(); self.references=[]; self.image_errors=[]; self.h1=0; self.main=0
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.add(attrs['id'])
        if 'name' in attrs:self.ids.add(attrs['name'])
        if tag=='h1':self.h1+=1
        if tag=='main':self.main+=1
        if tag=='img' and 'alt' not in attrs:self.image_errors.append(attrs.get('src','unknown image'))
        for key in ('href','src'):
            if attrs.get(key):self.references.append(attrs[key])
if not ROOT.exists():sys.exit('Build dist/ first with npm run build.')
files=sorted(ROOT.rglob('*.html'))
parsed={p.resolve():Document(p) for p in files}
errors=[]
for file,doc in parsed.items():
    label=str(file.relative_to(ROOT))
    for image in doc.image_errors:errors.append(f'{label}: missing alt text: {image}')
    for value in doc.references:
        url=urlsplit(value)
        if url.scheme or url.netloc:continue
        if not url.path:target=file
        elif url.path.startswith('/'):target=ROOT/unquote(url.path).lstrip('/')
        else:target=file.parent/unquote(url.path)
        target=target.resolve()
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'{label}: missing local target: {value}');continue
        if url.fragment and target in parsed and unquote(url.fragment) not in parsed[target].ids:errors.append(f'{label}: missing anchor: {value}')
    if doc.main and doc.main!=1:errors.append(f'{label}: expected one main landmark; got {doc.main}')
projects=ROOT/'projects'
project_pages=[p for p in projects.glob('*/index.html')]
if len(project_pages)!=12:errors.append(f'Expected all 12 legacy projects, found {len(project_pages)}')
if not (ROOT/'files/Nim-Dvir-CV-2026-09.pdf').exists():errors.append('Current downloadable CV is missing')
for p in ROOT.glob('sitemap*.xml'):
    if '/design' in p.read_text():errors.append(f'{p.name}: design reference must not be in sitemap')
design=(ROOT/'design/index.html').read_text()
if 'noindex' not in design:errors.append('Design reference is missing noindex')
for p in files:
    if p==ROOT/'design/index.html':continue
    if 'href="/design' in p.read_text():errors.append(f'{p}: unlisted design reference is linked publicly')
if errors:
    print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(files)} HTML files; local links, assets, fragments, image alternatives, landmarks, 12 projects, CV, and unlisted design page.')
