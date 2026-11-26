#!/usr/bin/env node
/* Static language versions for search engines. No dependencies.

   The root pages (Arabic) stay the editable source. This script:
   1. syncs the Arabic text, <title>, descriptions and head tags of every root page with site-text.js;
   2. writes Hebrew and English copies of each indexable page to /he/<page>.html and /en/<page>.html,
      with the text already in the HTML (no JavaScript needed to read them);
   3. adds canonical, hreflang, Open Graph locale and JSON-LD structured data;
   4. regenerates sitemap.xml.

   Run after every edit to a root page or to site-text.js:
     node scripts/localize-website.mjs          write
     node scripts/localize-website.mjs --check  fail if anything is out of date (no writes)
   This is NOT scripts/build-website.mjs (which is outdated and must not be run). */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://magickidsinstitute.com';
const VERSION = '20261126-doctor-profile';
const CHECK = process.argv.includes('--check');
// Pages that get their own /he/ and /en/ address. Keep in sync with LOCAL_PAGES in app.js.
const LOCALIZED = ['index', 'adhd', 'child-development', 'moxo-home', 'private-care', 'treatments', 'about', 'activities', 'recruit', 'booking', 'contact', 'workshop-register', 'doctors', 'app', 'privacy', 'terms', 'accessibility'];
// Utility pages: one address, language switched in place by app.js.
const IN_PLACE = ['404', 'offline', 'clinicflow'];
const LANGS = ['ar', 'he', 'en'];
const OG_LOCALE = { ar: 'ar_AR', he: 'he_IL', en: 'en_US' };
const fail = message => { console.error('FAIL: ' + message); process.exit(1); };
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

const textSource = read('site-text.js');
const PREFIX = 'window.MAGIC_TRANSLATIONS = ';
if (!textSource.startsWith(PREFIX)) fail('site-text.js has an unexpected format');
const T = JSON.parse(textSource.slice(PREFIX.length).replace(/;\s*$/, ''));

/* Text that page scripts put over the site-text.js value. The static pages must show what visitors see. */
function literal(file, start, end) {
  const source = read(file), from = source.indexOf(start);
  const to = from < 0 ? -1 : source.indexOf(end, from);
  if (from < 0 || to < 0) fail(`cannot find the text block "${start}" in ${file}; update scripts/localize-website.mjs`);
  return vm.runInNewContext('(' + source.slice(from + start.length, to) + ')');
}
const OVERRIDES = {
  '*': Object.fromEntries(Object.entries(literal('app.js', 'const treatmentIntro=', ';\n')).map(([lang, text]) => [lang, { 'u.treatmentFlow': text }])),
  'child-development': literal('development-flow.js', 'const copy=', '\n function render'),
  activities: Object.fromEntries(Object.entries(literal('app.js', 'const intro=', ';\n')).map(([lang, text]) => [lang, { 'u.treatmentFlow': text }])),
};
const ADULTS = literal('adults-link.js', '(function(){const t=', ';function render');
const RX = literal('adults-link.js', 'const rx=', ';document.querySelectorAll');
function words(page, lang, key) {
  return OVERRIDES[page]?.[lang]?.[key] ?? OVERRIDES['*'][lang]?.[key] ?? T[lang]?.[key] ?? '';
}

const escapeText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = s => escapeText(s).replace(/"/g, '&quot;');
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
const unescape = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, code) => code[0] === '#'
  ? String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10))
  : (NAMED[code.toLowerCase()] ?? all));

const pageUrl = (page, lang) => ORIGIN + (lang === 'ar' ? '/' : `/${lang}/`) + (page === 'index' ? '' : page + '.html');

/* Runs before anything is painted. Pages with language copies redirect to the copy that matches the
   requested (?lang=) or remembered language; utility pages only set the language for app.js. */
// Google Search Console: paste the verification token into site-config.js and rerun this script.
const VERIFICATION = (read('site-config.js').match(/searchConsoleVerification:\s*'([^']*)'/) || [])[1] || '';
const BOOT = `<script data-lang-boot>(function(){var L=['he','ar','en'],d=document.documentElement,p=location.pathname,m=p.match(/^\\/(he|en)(?=\\/|$)/),s=new URLSearchParams(location.search),q=s.get('lang'),t=null,here=m?m[1]:'ar',l;try{t=localStorage.getItem('magic-language')}catch(e){}if(L.indexOf(q)<0)q=null;if(L.indexOf(t)<0)t=null;if(d.hasAttribute('data-localized')){l=q||(m?here:t)||'ar';if(l!==here){s.delete('lang');if(l==='ar')s.set('lang','ar');var f=p.replace(/^\\/(he|en)(?=\\/|$)/,'')||'/',qs=s.toString();try{localStorage.setItem('magic-language',l)}catch(e){}window.magicRedirecting=true;d.style.visibility='hidden';location.replace((l==='ar'?'':'/'+l)+f+(qs?'?'+qs:'')+location.hash)}}else l=q||(m?here:t)||'ar';d.lang=l;d.dir=l==='en'?'ltr':'rtl';window.magicLanguage=l})();</script>`;
const BOOT_PATTERN = /<script(?: data-lang-boot)?>\(function\(\)\{var (?:q=new URLSearchParams\(location\.search\)\.get\('lang'\),l='ar'|L=\['he','ar','en'\])[\s\S]*?<\/script>/;

const HOURS = [['Monday', '09:00', '16:00'], ['Tuesday', '16:00', '20:00'], ['Wednesday', '16:00', '20:00'], ['Thursday', '17:00', '20:00'], ['Friday', '09:30', '12:30'], ['Saturday', '09:30', '12:30']];
HOURS.forEach(([, opens, closes], i) => {
  if (T.he[`booking.day${i + 2}_hours`] !== `${opens}–${closes}`) fail(`reception hours changed (booking.day${i + 2}_hours); update HOURS in scripts/localize-website.mjs`);
});
if (T.he['booking.day1_hours'] !== 'אין קבלת קהל') fail('reception hours changed (booking.day1_hours); update HOURS in scripts/localize-website.mjs');
const FACTS = {
  institute: { he: 'מכון ילדי הקסם', ar: 'معهد أطفال السحر', en: 'Magic Kids Institute' },
  doctor: { he: 'ד״ר בסים נמוז', ar: 'د. بسيم نموز', en: 'Dr. Baseem Namouz' },
  role: { he: 'רופא ילדים מומחה', ar: 'طبيب أطفال مختص', en: 'Pediatric specialist' },
  city: { he: 'שפרעם', ar: 'شفاعمرو', en: 'Shefa-Amr' },
  instituteStreet: { he: 'דאהר עומר אלזידאני 9', ar: 'ظاهر عمر الزيداني 9', en: '9 Daher Omar Al-Zaydani St.' },
  clinicStreet: { he: 'תופיק זיאד 21', ar: 'توفيق زياد 21', en: '21 Tawfiq Ziad St.' },
};
function structuredData(page, lang, title) {
  const address = street => ({ '@type': 'PostalAddress', streetAddress: FACTS[street][lang], addressLocality: FACTS.city[lang], addressCountry: 'IL' });
  const institute = {
    '@type': 'MedicalClinic', '@id': ORIGIN + '/#institute', name: FACTS.institute[lang],
    alternateName: LANGS.filter(l => l !== lang).map(l => FACTS.institute[l]), url: pageUrl('index', lang),
    logo: ORIGIN + '/assets/institute-logo.jpg', image: ORIGIN + '/assets/institute-logo.jpg',
    telephone: '+972544020043', email: 'magickids@magickidsinstitute.com', address: address('instituteStreet'),
    hasMap: 'https://maps.app.goo.gl/MG3eHopWuLA4imPH8', sameAs: ['https://www.youtube.com/@magickids-q7b'],
  };
  const clinic = {
    '@type': 'Physician', '@id': ORIGIN + '/#pediatric-clinic', name: FACTS.doctor[lang], description: FACTS.role[lang],
    url: pageUrl('about', lang), image: ORIGIN + '/assets/doctor.jpg', medicalSpecialty: 'https://schema.org/Pediatric',
    telephone: '+97248717911', address: address('clinicStreet'),
    openingHoursSpecification: HOURS.map(([day, opens, closes]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/' + day, opens, closes })),
  };
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: words(page, lang, 'nav.home'), item: pageUrl('index', lang) },
    { '@type': 'ListItem', position: 2, name: title.split(' | ')[0], item: pageUrl(page, lang) },
  ] };
  let graph;
  if (page === 'index') graph = [institute, clinic, { '@type': 'WebSite', '@id': ORIGIN + '/#website', url: ORIGIN + '/', name: FACTS.institute[lang], inLanguage: lang, publisher: { '@id': institute['@id'] } }];
  else if (page === 'contact') graph = [institute, clinic, crumbs];
  else if (page === 'about') graph = [{ '@type': 'ProfilePage', url: pageUrl(page, lang), inLanguage: lang, mainEntity: { '@type': 'Person', '@id': ORIGIN + '/#doctor', name: FACTS.doctor[lang], jobTitle: FACTS.role[lang], image: ORIGIN + '/assets/doctor.jpg', worksFor: { '@id': institute['@id'] } } }, institute, crumbs];
  else if (page === 'adhd' || page === 'doctors') {
    const prefix = page === 'adhd' ? 'adhd' : 'doc';
    const questions = [];
    for (let i = 1; T[lang][`${prefix}.faq${i}_q`]; i++) {
      questions.push({ '@type': 'Question', name: T[lang][`${prefix}.faq${i}_q`], acceptedAnswer: { '@type': 'Answer', text: T[lang][`${prefix}.faq${i}_a`] } });
    }
    graph = [{ '@type': 'FAQPage', url: pageUrl(page, lang), inLanguage: lang, mainEntity: questions }, institute, crumbs];
    if (page === 'doctors') {
      const organization = { '@id': institute['@id'] };
      graph.unshift({
        '@type': 'Physician', '@id': pageUrl(page, 'ar') + '#physician', name: FACTS.doctor[lang],
        url: pageUrl(page, lang), image: clinic.image, medicalSpecialty: clinic.medicalSpecialty,
        knowsAbout: [words(page, lang, 'doc.area1_title'), words(page, lang, 'doc.area2_title'), words(page, lang, 'doc.area3_title')],
        parentOrganization: organization,
        telephone: institute.telephone, address: institute.address,
        availableLanguage: ['Arabic', 'Hebrew'],
      });
    }
  } else graph = [crumbs];
  return `<script type="application/ld+json" data-seo>${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

/* Apply fn to the markup between <script>/<style> blocks, which are left untouched. */
function mapMarkup(html, fn) {
  return html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/).map((part, i) => i % 2 ? part : fn(part)).join('');
}
function setAttribute(tag, name, value) {
  const pattern = new RegExp(`(\\s${name}=")([^"]*)(")`);
  const found = pattern.exec(tag);
  if (!found) return tag.replace(/\s*\/?>$/, end => ` ${name}="${escapeAttr(value)}"` + end.trimStart());
  return unescape(found[2]) === value ? tag : tag.replace(pattern, (all, a, old, b) => a + escapeAttr(value) + b);
}
function setOne(html, pattern, replacement, what, file) {
  if (!pattern.test(html)) fail(`${file}: ${what} not found`);
  return html.replace(pattern, replacement);
}

function render(page, lang, source) {
  const file = page + '.html', localized = LOCALIZED.includes(page);
  const need = key => { const text = words(page, lang, key); if (!text) fail(`${file}: no ${lang} text for "${key}"`); return text; };
  let expected = 0, done = 0;
  mapMarkup(source, part => { expected += (part.match(/\sdata-i18n="/g) || []).length; return part; });
  let html = mapMarkup(source, part => part
    .replace(/(<([a-z0-9]+)\b[^<>]*?\sdata-i18n="([^"]+)"[^<>]*>)([^<]*)(<\/\2>)/g, (all, open, tag, key, old, close) => {
      done++;
      const text = need(key);
      return unescape(old) === text ? all : open + escapeText(text) + close;
    })
    .replace(/(<([a-z0-9]+)\b[^<>]*?\sdata-i18n-optional="([^"]+)"[^<>]*>)[^<]*(<\/\2>)/g, (all, open, tag, key, close) => {
      const text = words(page, lang, key).trim();
      const visible = open.replace(/ hidden(?=[\s>])/, '');
      return (text ? visible : visible.replace(/>$/, ' hidden>')) + escapeText(text) + close;
    })
    .replace(/<a\b[^<>]*\sdata-adults-link="(short|full)"[^<>]*>\s*<span data-adults-label>[^<]*<\/span>/g, (all, kind) => all.replace(/(<span data-adults-label>)[^<]*/, '$1' + escapeText(ADULTS[lang][kind])))
    .replace(/(<span data-rx-label>)[^<]*/g, '$1' + escapeText(RX[lang]))
    .replace(/<[a-z0-9]+\b[^<>]*\sdata-i18n-(?:alt|aria)="[^"]+"[^<>]*>/g, tag => {
      const alt = /\sdata-i18n-alt="([^"]+)"/.exec(tag), aria = /\sdata-i18n-aria="([^"]+)"/.exec(tag);
      if (alt) tag = setAttribute(tag, 'alt', need(alt[1]));
      if (aria) tag = setAttribute(tag, 'aria-label', need(aria[1]));
      return tag;
    })
    .replace(/(\s(?:href|src)=")([^"]*)(")/g, (all, a, value, b) => {
      let next = value;
      if (next && !/^(?:[a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(next)) next = '/' + next; // page-relative → site-relative
      const link = /^\/(?:([a-z-]+)\.html)?([?#].*)?$/.exec(next);
      if (lang !== 'ar' && a.includes('href') && link && LOCALIZED.includes(link[1] || 'index')) next = `/${lang}/` + (link[1] ? link[1] + '.html' : '') + (link[2] || '');
      return a + next + b;
    }));
  if (done !== expected) fail(`${file}: ${expected - done} data-i18n element(s) contain other tags; give the text its own element`);

  const body = /<body\b[^>]*>/.exec(html)?.[0] || fail(`${file}: <body> not found`);
  const titleKey = /\sdata-title-key="([^"]+)"/.exec(body)?.[1], descriptionKey = /\sdata-description-key="([^"]+)"/.exec(body)?.[1];
  if (!titleKey || !descriptionKey) fail(`${file}: data-title-key or data-description-key missing on <body>`);
  // Same source as app.js, which sets the title and description from site-text.js only.
  const plain = key => T[lang]?.[key] || fail(`${file}: no ${lang} text for "${key}"`);
  const title = plain(titleKey) + (/\sdata-title-full\b/.test(body) ? '' : ' | ' + plain('header.logo_name'));
  const description = plain(descriptionKey);
  html = setOne(html, /<html\b[^>]*>/, `<html lang="${lang}" dir="${lang === 'en' ? 'ltr' : 'rtl'}"${localized ? ' data-localized' : ''}>`, '<html>', file);
  html = setOne(html, /<title>[^<]*<\/title>/, `<title>${escapeText(title)}</title>`, '<title>', file);
  html = setOne(html, /(<meta name="description" content=")[^"]*(">)/, (all, a, b) => a + escapeAttr(description) + b, 'meta description', file);
  html = setOne(html, /(<meta property="og:title" content=")[^"]*(">)/, (all, a, b) => a + escapeAttr(title) + b, 'og:title', file);
  html = setOne(html, /(<meta property="og:description" content=")[^"]*(">)/, (all, a, b) => a + escapeAttr(description) + b, 'og:description', file);
  if (page === 'doctors') html = setOne(html, /(<meta property="og:image" content=")[^"]*(">)/, (all, a, b) => a + ORIGIN + '/assets/doctor.jpg' + b, 'og:image', file);
  html = setOne(html, BOOT_PATTERN, () => BOOT, 'language script', file);
  html = html.replace(/(\/(?:(?:site-text|app|track)\.js|brand\.css)\?v=)[^"]+/g, '$1' + VERSION);
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '').replace(/<meta property="og:locale(?::alternate)?" content="[^"]*">/g, '').replace(/<script type="application\/ld\+json" data-seo>[\s\S]*?<\/script>/g, '');
  html = html.replace(/<meta name="google-site-verification" content="[^"]*">/g, '');
  if (VERIFICATION) html = setOne(html, /<meta name="description"/, `<meta name="google-site-verification" content="${escapeAttr(VERIFICATION)}"><meta name="description"`, 'google verification', file);
  if (localized) {
    const url = pageUrl(page, lang);
    const alternates = [...LANGS.map(l => [l, pageUrl(page, l)]), ['x-default', pageUrl(page, 'ar')]].map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${href}">`).join('');
    html = setOne(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">` + alternates, 'canonical', file);
    html = setOne(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}"><meta property="og:locale" content="${OG_LOCALE[lang]}">` + LANGS.filter(l => l !== lang).map(l => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`).join(''), 'og:url', file);
    html = setOne(html, /<\/head>/, () => structuredData(page, lang, title) + '</head>', '</head>', file);
  }
  return html;
}

const outputs = new Map();
for (const page of [...LOCALIZED, ...IN_PLACE]) {
  const arabic = render(page, 'ar', read(page + '.html'));
  if (render(page, 'ar', arabic) !== arabic) fail(`${page}.html: output is not stable when the script runs twice`);
  outputs.set(page + '.html', arabic);
  if (LOCALIZED.includes(page)) for (const lang of ['he', 'en']) outputs.set(`${lang}/${page}.html`, render(page, lang, arabic));
}
outputs.set('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
  + LOCALIZED.flatMap(page => LANGS.map(lang => `<url><loc>${pageUrl(page, lang)}</loc>`
    + [...LANGS.map(l => [l, pageUrl(page, l)]), ['x-default', pageUrl(page, 'ar')]].map(([code, href]) => `<xhtml:link rel="alternate" hreflang="${code}" href="${href}"/>`).join('') + '</url>')).join('\n')
  + '\n</urlset>\n');

const stale = [];
for (const lang of ['he', 'en']) {
  const dir = path.join(ROOT, lang);
  if (fs.existsSync(dir)) for (const name of fs.readdirSync(dir)) if (!outputs.has(`${lang}/${name}`)) stale.push(`${lang}/${name}`);
}
let changed = 0;
for (const [file, content] of outputs) {
  const target = path.join(ROOT, file);
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === content) continue;
  changed++;
  if (CHECK) { console.error('out of date: ' + file); continue; }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
if (CHECK) {
  stale.forEach(file => console.error('unexpected file: ' + file));
  if (changed || stale.length) fail('language pages are out of date; run: node scripts/localize-website.mjs');
  console.log(`PASS: ${outputs.size} files up to date`);
} else {
  stale.forEach(file => fs.unlinkSync(path.join(ROOT, file)));
  console.log(`localize-website: ${outputs.size} files checked, ${changed} written, ${stale.length} removed`);
}
