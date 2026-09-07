"""Regression checks for the reported broken navigation and missing Arabic."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re
import subprocess

root = Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.scripts, self.assets, self.keys = [], [], [], [], []
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get('id'): self.ids.append(d['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'a' and d.get('href'): self.links.append(d['href'])
        if tag == 'script' and d.get('src'): self.scripts.append(d['src'])
        if tag == 'img' and d.get('src'): self.assets.append(d['src'])
        if tag == 'link' and d.get('rel') in ('stylesheet', 'manifest', 'icon', 'apple-touch-icon'): self.assets.append(d['href'])
        for attr in ('data-i18n', 'data-i18n-alt', 'data-i18n-aria', 'data-title-key', 'data-description-key'):
            if d.get(attr): self.keys.append(d[attr])

pages = {}
for f in root.glob('*.html'):
    p = Page(); p.feed(f.read_text()); pages[f.name] = p
texts = json.loads((root/'site-text.js').read_text().removeprefix('window.MAGIC_TRANSLATIONS = ').rstrip(';\n'))
for name, p in pages.items():
    assert len(set(p.ids)) == len(p.ids), (name, 'duplicate IDs')
    assert p.h1 == 1, (name, 'main title')
    assert any('/app.js?v=' in s for s in p.scripts), (name, 'unversioned app')
    assert any('/brand.css?v=' in s for s in p.assets), (name, 'shared template')
    for key in p.keys:
        for lang in ('he', 'ar', 'en'):
            assert texts[lang].get(key), (name, lang, key)
            if lang == 'ar': assert not re.search(r'[\u0590-\u05ff]', texts[lang][key]), (name, 'Hebrew inside Arabic', key)
    for ref in p.links + p.assets + p.scripts:
        u = urlsplit(ref)
        if u.scheme or u.netloc: continue
        target = unquote(u.path).lstrip('/') or name
        assert (root/target).is_file(), (name, 'missing file', ref)
        if u.fragment and target.endswith('.html'):
            assert u.fragment in pages[target].ids, (name, 'broken anchor', ref)
    assert not any('website-preview' in s for s in p.links), (name, 'old preview link')
manifest = json.loads((root/'manifest.webmanifest').read_text())
assert manifest['scope'] == '/' and manifest['start_url'] == '/index.html'
assert {i['sizes'] for i in manifest['icons']} == {'192x192', '512x512'}
for icon in manifest['icons']:
    data = (root/icon['src'].lstrip('/')).read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    size = int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')
    assert icon['sizes'] == f'{size[0]}x{size[1]}'
for f in ('app.js','site-text.js','site-config.js','connect.js','sw.js'):
    subprocess.run(['node','--check',str(root/f)],check=True)
assert 'formsubmit' not in (root/'workshop-register.html').read_text().lower()
print(f'PASS: {len(pages)} routes, {len(texts["ar"])} translation keys in three languages, all links/assets, app manifest/icons and JavaScript syntax.')
