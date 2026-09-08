/* Cache only the public offline contact page and explicitly listed shared assets.
   Network-only navigation prevents old/new template mixing. No patient data,
   forms, API responses, calendars or external requests enter this cache. */
const CACHE='magic-kids-public-20260908-admin-whatsapp-1';
const ASSETS=['/offline.html','/brand.css?v=20260908-admin-whatsapp-1','/site-text.js?v=20260908-admin-whatsapp-1','/app.js?v=20260908-admin-whatsapp-1','/site-config.js?v=20260908-admin-whatsapp-1','/connect.js?v=20260908-admin-whatsapp-1','/assets/institute-logo.jpg','/assets/app-icon-192.png','/assets/app-icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('magic-kids-public-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin)return;
 if(r.mode==='navigate'){
  if(!/^\/(?:[a-z-]+\.html)?$/.test(u.pathname))return;
  e.respondWith(fetch(r,{cache:'no-store'}).catch(async()=>await caches.match('/offline.html')||Response.error()));return;
 }
 if(ASSETS.includes(u.pathname+u.search))e.respondWith(fetch(r).catch(()=>caches.match(r).then(c=>c||Response.error())));
});
