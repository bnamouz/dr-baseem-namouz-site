/* Seasonal decoration layer. Configuration lives in site-config.js (window.MAGIC_SITE.season):
   { id, theme:'halloween', enabled, from, until, text:{he,ar,en:{title,body,close}} }.
   Active only inside the date window (Asia/Jerusalem). Adds a dismissible greeting strip above the hero,
   bunting + floating decorations inside the hero and a hat on the logo. Decorations are aria-hidden and
   never intercept pointer events; the strip can be closed for the rest of the browser session. */
(function(){
  var cfg=(window.MAGIC_SITE||{}).season; if(!cfg||!cfg.enabled||cfg.theme!=='halloween')return;
  var today;try{today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}catch(_){today=new Date().toISOString().slice(0,10);}
  if((cfg.from&&today<cfg.from)||(cfg.until&&today>cfg.until))return;
  var q=new URLSearchParams(location.search).get('lang'),lang=document.documentElement.lang||'ar';
  if(['he','ar','en'].indexOf(q)>-1)lang=q; else{try{lang=localStorage.getItem('magic-language')||lang;}catch(_){}} if(['he','ar','en'].indexOf(lang)<0)lang='ar';
  var text=(cfg.text||{})[lang]||(cfg.text||{}).ar||{title:'Happy Halloween!',body:'',close:'Close'};
  var closedKey='mk-season:'+cfg.id+':closed';

  var SVG={
    pumpkin:'<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><path d="M58 20c-2-9 2-16 10-19 2 4 1 9-2 13l-2 6z" fill="#5a8f3a"/><path d="M60 24c-4-6-12-6-16 0-8-6-20-3-24 6-10 2-16 12-14 26 2 22 18 44 48 50 6 2 8 2 14 0 30-6 46-28 48-50 2-14-4-24-14-26-4-9-16-12-24-6-4-6-14-6-18 0z" fill="#f58a1f"/><path d="M60 24c-5 12-7 32-6 58 0 8 1 16 2 24-4 0-6-2-9-3-1-9-2-17-2-27 0-24 5-40 15-52zM60 24c5 12 7 32 6 58 0 8-1 16-2 24 4 0 6-2 9-3 1-9 2-17 2-27 0-24-5-40-15-52z" fill="#e3760f" opacity=".75"/><path d="M20 30c-10 2-16 12-14 26 2 22 18 44 48 50-20-10-32-28-34-50 0-12 0-22 0-26zM100 30c10 2 16 12 14 26-2 22-18 44-48 50 20-10 32-28 34-50 0-12 0-22 0-26z" fill="#d96f0b" opacity=".55"/><ellipse cx="42" cy="54" rx="7.5" ry="8.5" fill="#2a1a3f"/><ellipse cx="78" cy="54" rx="7.5" ry="8.5" fill="#2a1a3f"/><circle cx="44.5" cy="51" r="2.5" fill="#fff"/><circle cx="80.5" cy="51" r="2.5" fill="#fff"/><path d="M38 72c6 10 16 14 22 14s16-4 22-14c-7 3-14 4-22 4s-15-1-22-4z" fill="#2a1a3f"/><path d="M48 78c4 2 8 3 12 3s8-1 12-3c-3 4-7 6-12 6s-9-2-12-6z" fill="#fff"/><circle cx="30" cy="66" r="6" fill="#ff9aa6" opacity=".7"/><circle cx="90" cy="66" r="6" fill="#ff9aa6" opacity=".7"/></svg>',
    ghost:'<svg viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg"><path d="M45 4C23 4 8 21 8 44v52c0 6 6 8 10 4l7-7 8 9c3 4 8 4 11 0l8-9 8 9c3 4 8 4 11 0l7-9c4-4 10-2 10 4V44C88 21 67 4 45 4z" fill="#fff" stroke="#dfe7f3" stroke-width="3"/><ellipse cx="33" cy="46" rx="6" ry="8" fill="#2a1a3f"/><ellipse cx="57" cy="46" rx="6" ry="8" fill="#2a1a3f"/><circle cx="35" cy="43" r="2" fill="#fff"/><circle cx="59" cy="43" r="2" fill="#fff"/><ellipse cx="45" cy="64" rx="6" ry="7" fill="#2a1a3f"/><circle cx="22" cy="58" r="5" fill="#ffb3bd" opacity=".8"/><circle cx="68" cy="58" r="5" fill="#ffb3bd" opacity=".8"/></svg>',
    bat:'<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M50 22c-4-10-12-14-22-12 4 4 5 8 4 12C20 14 8 16 2 28c8-2 14 1 18 6-8 1-12 6-14 13 8-5 16-5 24 0 2 6 8 9 14 9h12c6 0 12-3 14-9 8-5 16-5 24 0-2-7-6-12-14-13 4-5 10-8 18-6-6-12-18-14-30-6-1-4 0-8 4-12-10-2-18 2-22 12z" fill="#213e70"/><path d="M40 8l4 8 6-2 6 2 4-8" fill="#213e70"/><circle cx="43" cy="30" r="4" fill="#fff"/><circle cx="57" cy="30" r="4" fill="#fff"/><circle cx="44" cy="31" r="2" fill="#2a1a3f"/><circle cx="56" cy="31" r="2" fill="#2a1a3f"/><path d="M45 40c3 3 7 3 10 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    moon:'<svg viewBox="0 0 110 100" xmlns="http://www.w3.org/2000/svg"><path d="M58 8c-26 0-46 20-46 46s20 46 46 46c10 0 19-3 27-9-22 2-42-16-42-40S61 7 85 14c-8-4-17-6-27-6z" fill="#ffe476" stroke="#f1cf43" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="40" r="5" fill="#f1cf43"/><circle cx="30" cy="62" r="3.5" fill="#f1cf43"/><path d="M94 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" opacity=".9"/><path d="M100 70l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff" opacity=".9"/></svg>',
    hat:'<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg"><path d="M30 2c-2 10-8 22-16 34h32C38 24 32 12 30 2z" fill="#5b2a86"/><path d="M14 36h32c-4-4-24-4-32 0z" fill="#3e1a5e"/><path d="M20 30c6 2 14 2 20 0l2 6H18z" fill="#f58a1f"/><path d="M4 40c0 6 52 6 52 0 0-4-10-6-26-6S4 36 4 40z" fill="#5b2a86"/><path d="M4 40c0 6 52 6 52 0 0-1-1-2-3-3 0 4-46 4-46 0-2 1-3 2-3 3z" fill="#3e1a5e"/><path d="M36 10l1.5 3.5 3.5 1.5-3.5 1.5L36 20l-1.5-3.5L31 15l3.5-1.5z" fill="#ffe476"/></svg>',
    spider:'<svg viewBox="0 0 40 90" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="0" x2="20" y2="58" stroke="#213e70" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M6 62c4-4 8-6 14-6s10 2 14 6M6 72c4-2 8-3 14-3s10 1 14 3M8 80c3-3 7-4 12-4s9 1 12 4" stroke="#213e70" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="70" rx="9" ry="10" fill="#213e70"/><circle cx="20" cy="58" r="5" fill="#213e70"/><circle cx="17" cy="66" r="2.2" fill="#fff"/><circle cx="23" cy="66" r="2.2" fill="#fff"/><circle cx="17" cy="66.5" r="1" fill="#2a1a3f"/><circle cx="23" cy="66.5" r="1" fill="#2a1a3f"/></svg>'
  };
  function bunting(){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="46" aria-hidden="true"><defs><pattern id="mkHwFlags" width="222" height="46" patternUnits="userSpaceOnUse">'+
      '<path d="M0 2q55 12 111 2t111 2" fill="none" stroke="#5b2a86" stroke-width="2.5"/>'+
      '<path class="mk-hw-flag" d="M10 4l30 2-15 30z" fill="#f58a1f"/><path class="mk-hw-flag" d="M47 7l30 1-15 30z" fill="#5b2a86"/><path class="mk-hw-flag" d="M84 7l30-1-15 30z" fill="#fff4e3"/>'+
      '<path class="mk-hw-flag" d="M121 5l30-2-15 30z" fill="#f58a1f"/><path class="mk-hw-flag" d="M158 3l30 0-15 30z" fill="#5b2a86"/><path class="mk-hw-flag" d="M195 3l30 1-15 30z" fill="#fff4e3"/>'+
      '<circle cx="99" cy="21" r="3.5" fill="#f58a1f"/><circle cx="210" cy="20" r="3.5" fill="#f58a1f"/>'+
      '</pattern></defs><rect width="100%" height="46" fill="url(#mkHwFlags)"/></svg>';
  }
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;e.setAttribute('aria-hidden','true');return e;}

  function decorate(){
    document.documentElement.classList.add('mk-season','mk-halloween');
    var page=document.body.getAttribute('data-page')||'';
    var hero=document.querySelector('.home-hero, .page-hero');
    // Greeting strip (dismissible for the session)
    var closed=false;try{closed=!!sessionStorage.getItem(closedKey);}catch(_){}
    if(hero&&!closed){
      var bar=document.createElement('div');bar.className='mk-hw-bar';bar.setAttribute('role','note');bar.setAttribute('dir',lang==='en'?'ltr':'rtl');bar.setAttribute('lang',lang);
      bar.innerHTML='<span class="mk-hw-bar__icon" aria-hidden="true">'+SVG.pumpkin+'</span><span class="mk-hw-bar__text"><span>'+text.title+'</span>'+(text.body?'<small>'+text.body+'</small>':'')+'</span>'+
        '<button type="button" class="mk-hw-bar__close" aria-label="'+(text.close||'Close')+'">×</button>';
      hero.parentNode.insertBefore(bar,hero);
      bar.querySelector('.mk-hw-bar__close').addEventListener('click',function(){try{sessionStorage.setItem(closedKey,'1');}catch(_){} if(bar.parentNode)bar.parentNode.removeChild(bar);try{if(window.magicTrack)window.magicTrack('season_close',{id:cfg.id});}catch(_){}});
    }
    // Bunting + floating decorations inside the hero
    if(hero){
      hero.classList.add('mk-hw-host');
      hero.insertBefore(el('div','mk-hw-bunting',bunting()),hero.firstChild);
      var set=page==='app'?['moon','pumpkin','ghost','bat','bat2']:['ghost','pumpkin','pumpkin-small','bat','bat2','spider'];
      set.forEach(function(name){var kind=name.replace(/-small$|2$/,'');hero.appendChild(el('div','mk-hw-decor mk-hw-decor--'+name,SVG[kind]));});
    }
    // Hat on the header logo
    var brand=document.querySelector('.site-header .brand');
    if(brand&&!brand.querySelector('.mk-hw-hat'))brand.appendChild(el('span','mk-hw-hat',SVG.hat));
    try{if(window.magicTrack&&!sessionStorage.getItem('mk-season:'+cfg.id+':seen')){sessionStorage.setItem('mk-season:'+cfg.id+':seen','1');window.magicTrack('season_view',{id:cfg.id,page:page});}}catch(_){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
})();
