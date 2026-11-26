"""Regression checks for the reported broken navigation and missing Arabic."""
from pathlib import Path
from html import unescape
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
for f in [*root.glob('*.html'), *root.glob('he/*.html'), *root.glob('en/*.html')]:
    p = Page(); p.feed(f.read_text()); pages[f.relative_to(root).as_posix()] = p
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
        target = unquote(u.path).lstrip('/') if u.path else name
        if target == '' or target.endswith('/'): target += 'index.html'
        assert (root/target).is_file(), (name, 'missing file', ref)
        if u.fragment and target.endswith('.html'):
            assert u.fragment in pages[target].ids, (name, 'broken anchor', ref)
    assert not any('website-preview' in s for s in p.links), (name, 'old preview link')
# Language pages: every localized page exists in three languages with matching search tags.
subprocess.run(['node', str(root/'scripts/localize-website.mjs'), '--check'], check=True)
site = 'https://magickidsinstitute.com'
local = sorted(f.name for f in root.glob('he/*.html'))
assert local and local == sorted(f.name for f in root.glob('en/*.html')), 'language folders differ'
def public_url(lang, page):
    return site + ('' if lang == 'ar' else '/' + lang) + '/' + ('' if page == 'index.html' else page)
sitemap = (root/'sitemap.xml').read_text()
locs = re.findall(r'<loc>([^<]+)</loc>', sitemap)
assert len(locs) == len(set(locs)) == len(local) * 3, ('sitemap size', len(locs))
assert 'Sitemap: ' + site + '/sitemap.xml' in (root/'robots.txt').read_text(), 'robots.txt sitemap'
area_pages = {'index.html', 'adhd.html', 'doctors.html'}
areas_by_language = {}
for page in local:
    for lang in ('ar', 'he', 'en'):
        name = page if lang == 'ar' else f'{lang}/{page}'
        html = (root/name).read_text()
        assert re.search(r'<html lang="%s" dir="%s"' % (lang, 'ltr' if lang == 'en' else 'rtl'), html), (name, 'lang/dir')
        assert f'<link rel="canonical" href="{public_url(lang, page)}">' in html, (name, 'canonical')
        for alt in ('ar', 'he', 'en'):
            assert f'<link rel="alternate" hreflang="{alt}" href="{public_url(alt, page)}">' in html, (name, 'hreflang', alt)
        assert f'<link rel="alternate" hreflang="x-default" href="{public_url("ar", page)}">' in html, (name, 'x-default')
        assert public_url(lang, page) in locs, (name, 'missing from sitemap')
        title = re.search(r'<title>([^<]+)</title>', html); desc = re.search(r'<meta name="description" content="([^"]+)"', html)
        assert title and desc and len(desc.group(1)) >= 50, (name, 'title/description')
        if lang != 'he': assert not re.search(r'[\u0590-\u05ff]', title.group(1) + desc.group(1)), (name, 'Hebrew in title/description')
        blocks = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S)
        assert blocks, (name, 'structured data')
        graphs = [json.loads(block) for block in blocks]
        if page in area_pages:
            entities = {item['@type']: item for item in graphs[0]['@graph']}
            institute = entities['MedicalClinic']
            areas = institute['areaServed']
            assert [area['@type'] for area in areas] == ['City'] * 14 + ['AdministrativeArea'] * 2, (name, 'area types')
            assert len({area['name'] for area in areas if area['name']}) == 16, (name, 'unique area names')
            assert areas_by_language.setdefault(lang, areas) == areas, (name, 'consistent institute area')
            assert re.search(fr'<loc>{re.escape(public_url(lang, page))}</loc><lastmod>\d{{4}}-\d{{2}}-\d{{2}}</lastmod>', sitemap), (name, 'sitemap lastmod')
            if page == 'index.html':
                assert 'areaServed' not in entities['Physician'], (name, 'unrelated pediatric clinic area')
        if page in {'adhd.html', 'doctors.html'}:
            assert len(unescape(title[1])) <= 60 and len(unescape(desc[1])) <= 160, (name, 'metadata length')
            assert re.search(r'<p data-i18n="adhd\.loc_text">[^<]*</p>\s*<p data-i18n="adhd\.reach_text">', html), (name, 'service area after location text')
            questions = entities['FAQPage']['mainEntity']
            prefix, original_count = ('doc', 6) if page == 'doctors.html' else ('adhd', 7)
            assert len(questions) == original_count + 1, (name, 'FAQ count')
            faq_keys = [f'{prefix}.faq{i}' for i in range(1, original_count + 1)] + ['adhd.reach']
            for key, item in zip(faq_keys, questions):
                for suffix, expected in [('q', item['name']), ('a', item['acceptedAnswer']['text'])]:
                    match = re.search(fr'data-i18n="{re.escape(key)}_{suffix}"[^>]*>([^<]*)<', html)
                    assert match and unescape(match[1]) == expected, (name, 'FAQ text', key, suffix)
        if page == 'doctors.html':
            assert {'Physician', 'FAQPage', 'BreadcrumbList'} <= entities.keys(), (name, 'profile structured data')
            physician = entities['Physician']
            assert physician['url'] == public_url(lang, page), (name, 'physician URL')
            assert physician['address'] == institute['address'] and physician['telephone'] == institute['telephone'], (name, 'institute address/phone')
            assert 'worksFor' not in physician and physician['parentOrganization'] == {'@id': institute['@id']}, (name, 'institute reference')
            assert physician['availableLanguage'] == ['Arabic', 'Hebrew'], (name, 'consultation languages')
            assert physician['areaServed'] == areas, (name, 'physician area')
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
print(f'PASS: {len(pages)} routes ({len(local)} pages in three languages), {len(texts["ar"])} translation keys in three languages, all links/assets, app manifest/icons and JavaScript syntax.')
