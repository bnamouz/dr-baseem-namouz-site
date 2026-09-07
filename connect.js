(function () {
  'use strict';
  var config = window.MAGIC_SITE || {}, google = config.google || {};
  function safeHttps(value, hosts) {
    try { var u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && (!hosts || hosts.includes(u.hostname)) ? u : null; }
    catch (_) { return null; }
  }
  var hub = safeHttps(config.hubOrigin);
  document.querySelectorAll('[data-hub-path]').forEach(function (a) {
    if (hub && config.hubPublic === true) a.href = new URL(a.dataset.hubPath, hub.origin).href;
    // Otherwise retain the public email action from the HTML; no links to private forms.
    var key = config.hubPublic === true ? a.dataset.hubLabel : a.dataset.mailLabel;
    if (key) { a.setAttribute('data-i18n', key); var copy = (window.MAGIC_TRANSLATIONS || {})[document.documentElement.lang]; if (copy && copy[key]) a.textContent = copy[key]; }
  });
  var maps = safeHttps(google.mapsUrl, ['www.google.com', 'maps.google.com', 'maps.app.goo.gl']);
  if (maps) document.querySelectorAll('[data-google-maps]').forEach(function (a) { a.href = maps.href; });
  var calendar = safeHttps(google.calendarBookingUrl, ['calendar.google.com', 'calendar.app.google']);
  if (calendar) document.querySelectorAll('[data-google-booking]').forEach(function (a) { a.href = calendar.href; a.hidden = false; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  // Analytics is disabled until an actual GA4 ID is supplied and the visitor opts in.
  var id = google.analyticsId;
  if (!/^G-[A-Z0-9]{5,20}$/.test(id || '')) return;
  var consentKey = 'magic-analytics-consent', panel;
  function readConsent() { try { return localStorage.getItem(consentKey); } catch (_) { return null; } }
  function saveConsent(value) { try { localStorage.setItem(consentKey, value); } catch (_) {} }
  function words() { return ({he:['נוכל למדוד ביקורים באתר כדי לשפר אותו? המדידה מופעלת רק באישורכם. אפשר לשנות את הבחירה בתחתית האתר.','מאשרים מדידה','ללא מדידה','העדפות מדידה'],ar:['هل تسمحون بقياس زيارات الموقع لتحسينه؟ يبدأ القياس فقط بموافقتكم، ويمكن تغيير الاختيار أسفل الموقع.','أوافق على القياس','دون قياس','تفضيلات القياس'],en:['May we measure site visits to improve the website? Analytics starts only with your permission. You can change this choice in the footer.','Allow analytics','No analytics','Analytics preferences']})[document.documentElement.lang] || ['Allow analytics to improve the website?','Allow','Decline','Analytics preferences']; }
  function activate() {
    if (window.magicAnalyticsStarted) return;
    window.magicAnalyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window['ga-disable-' + id] = false;
    window.gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    window.gtag('js', new Date());
    window.gtag('config', id, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false});
    // Do not send form text, email, phone numbers, referrers, query strings or hashes.
    window.gtag('event', 'page_view', {page_location:location.origin + location.pathname, page_title:document.title, page_referrer:''});
    var tag = document.createElement('script'); tag.async = true; tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id); document.head.appendChild(tag);
  }
  function removeCookies() {
    document.cookie.split(';').forEach(function (part) { var name = part.trim().split('=')[0]; if (!/^_ga(?:_|$)/.test(name)) return; ['', location.hostname, '.' + location.hostname, '.magickidsinstitute.com'].forEach(function (domain) { document.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : ''); }); });
  }
  function choose(value) {
    saveConsent(value); if (panel) panel.remove(); panel = null;
    if (value === 'granted') { window['ga-disable-' + id] = false; if (window.gtag) window.gtag('consent','update',{analytics_storage:'granted'}); activate(); }
    else { window['ga-disable-' + id] = true; if (window.gtag) window.gtag('consent','update',{analytics_storage:'denied'}); removeCookies(); }
  }
  function show() {
    if (panel) panel.remove(); var w = words(); panel = document.createElement('section'); panel.className = 'mk-cookie'; panel.setAttribute('aria-label',w[3]);
    var p = document.createElement('p'); p.textContent = w[0]; panel.appendChild(p);
    var actions = document.createElement('div'); actions.className = 'mk-actions';
    ['granted','denied'].forEach(function (choice,index) { var b = document.createElement('button'); b.type='button'; b.className='mk-button '+(index ? 'mk-button-outline' : 'mk-button-primary'); b.textContent=w[index+1]; b.addEventListener('click',function(){choose(choice);}); actions.appendChild(b); });
    panel.appendChild(actions); document.body.appendChild(panel);
  }
  var prefs = document.createElement('button'); prefs.type='button'; prefs.className='mk-cookie-settings'; prefs.textContent=words()[3]; prefs.addEventListener('click',show); (document.querySelector('.footer__bottom') || document.body).appendChild(prefs);
  document.addEventListener('magic-language',function(){ prefs.textContent=words()[3]; if (panel) show(); });
  if (readConsent()==='granted') activate(); else if (readConsent()!=='denied') show();
})();
