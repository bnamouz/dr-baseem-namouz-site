# One public website

Canonical website: https://magickidsinstitute.com/

## Editing pages

The HTML pages are edited directly. `scripts/build-website.mjs`, `src/copy.mjs` and `src/translations.json` are an old generator that no longer matches the live pages: do not run it, it would overwrite later work.

Visible text lives in `site-text.js` (one key, three languages) and is referenced from the HTML with `data-i18n`, `data-i18n-alt`, `data-i18n-aria`, `data-title-key` and `data-description-key`. A few pages take their text from their own script instead (`development-flow.js`, the treatment and activity intros in `app.js`, `adults-link.js`).

After any change to a root page, to `site-text.js` or to one of those scripts, run:

```
node scripts/localize-website.mjs
python3 scripts/verify-website.py
```

## Languages and search

Each public page has three addresses, so search engines can index every language:

- Arabic (default): `/adhd.html`
- Hebrew: `/he/adhd.html`
- English: `/en/adhd.html`

The root pages are the source. `scripts/localize-website.mjs` keeps their Arabic text in step with `site-text.js`, writes the `he/` and `en/` copies, and maintains the title, description, canonical address, `hreflang` links, Open Graph tags, JSON-LD structured data and `sitemap.xml`. Never edit files in `he/` or `en/` by hand; they are overwritten. `node scripts/localize-website.mjs --check` fails when anything is out of date, and the verify script runs it.

The list of pages that get language addresses must be identical in `LOCALIZED` (in the script) and `LOCAL_PAGES` (in `app.js`). The utility pages `404.html`, `offline.html` and `clinicflow.html` have one address and switch language in place.

A small script in each page `<head>` picks the language: `?lang=` first, then the address (`/he/`, `/en/`), then, on Arabic addresses only, the language the visitor chose before. Old `?lang=he` links are redirected to the matching address. The language buttons switch the text in place and update the address without reloading.

When shared files change, update the `VERSION` label in the script and the cache name and asset list in `sw.js`.

Structured data: the home page and contact page describe the clinic and the doctor, the ADHD page carries its questions and answers, and every other page has a breadcrumb. Opening hours are written once in the script and it stops if the visible hours text changes, so both are updated together.

Google Search Console: paste the verification token into `searchConsoleVerification` in `site-config.js` and run the localize script; the tag is then added to every page.

`scripts/verify-website.py` checks every route in all three languages: links, fragments, assets, translation keys, one main title per page, canonical and `hreflang` tags, structured data, the sitemap and the app icons.

The `app.html` page installs the same website as a PWA. Browser support determines whether an install prompt or platform instructions are shown. The service worker never caches clinical data or API calls. Navigations use the network; offline access provides the public contact page only. Change the release label in both `scripts/localize-website.mjs` and the service worker when publishing shared-asset updates.

Public interest/application forms prepare email or WhatsApp drafts addressed to the institute. They do not save submissions or claim successful delivery. The existing private management app retains its own stored enquiry workflow. No website form is an appointment confirmation.

`site-config.js` holds public contact and optional Google booking/analytics configuration. No credentials belong in this repository. Online appointment booking remains disabled until a real clinic booking URL is configured. The private staff area links to the identified Pediatrics Clinic Appointments calendar; the connected account currently has reader access. Calendar events stay in Google, behind its access controls.

The old workshop date (19 April 2026) is historical; the page now accepts enquiries about a future session without advertising an unconfirmed date or price.
