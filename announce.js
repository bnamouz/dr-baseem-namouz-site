/* Timed announcement shown when the website or installed app opens.
   Configuration lives in site-config.js (window.MAGIC_SITE.announcement). Shown once per browser session,
   auto-closes after `seconds` (progress bar; pauses while hovered/focused), and is skipped when the
   visitor already arrived at the booking link or asked for reduced motion only in the animation sense. */
(function(){
  var cfg=(window.MAGIC_SITE||{}).announcement; if(!cfg||!cfg.enabled)return;
  var today;try{today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}catch(_){today=new Date().toISOString().slice(0,10);} if((cfg.from&&today<cfg.from)||(cfg.until&&today>cfg.until))return;
  var key='magic-announcement:'+cfg.id; try{if(sessionStorage.getItem(key))return;}catch(_){}
  var q=new URLSearchParams(location.search).get('lang'),lang=document.documentElement.lang||'ar';
  if(['he','ar','en'].indexOf(q)>-1)lang=q; else{try{lang=localStorage.getItem('magic-language')||lang;}catch(_){}} if(['he','ar','en'].indexOf(lang)<0)lang='ar';
  var text=cfg.text[lang]||cfg.text.ar, seconds=Math.max(3,Number(cfg.seconds)||5), href=cfg.href.replace('{lang}',lang);
  function show(){
    try{sessionStorage.setItem(key,'1');}catch(_){}
    var css=document.createElement('style');css.textContent=
      '.mk-ann{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(1,52,56,.55);padding:16px;animation:mkFade .25s}'+
      '.mk-ann__card{position:relative;width:min(520px,100%);background:#fff;color:#0f2a2b;border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.35);padding:28px 26px 22px;overflow:hidden;font-family:inherit}'+
      '.mk-ann__badge{display:inline-block;background:#fff1d6;color:#8a5a00;border-radius:30px;padding:4px 12px;font-size:13px;font-weight:700;margin-bottom:12px}'+
      '.mk-ann__card h2{margin:0 0 10px;font-size:clamp(20px,3.5vw,26px);line-height:1.3;color:#075a5d}.mk-ann__card p{margin:0 0 18px;font-size:16px;line-height:1.6}'+
      '.mk-ann__btn{display:block;text-align:center;background:#075a5d;color:#fff!important;text-decoration:none;border-radius:14px;padding:15px 18px;font-size:17px;font-weight:800}.mk-ann__btn:hover{background:#064b4e}'+
      '.mk-ann__close{position:absolute;top:10px;inset-inline-end:10px;border:0;background:#f0f5f2;color:#0f2a2b;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer}'+
      '.mk-ann__bar{position:absolute;left:0;right:0;bottom:0;height:5px;background:#dfe9e4}.mk-ann__bar i{display:block;height:100%;width:100%;background:#f1b63a;transform-origin:0 50%;animation:mkShrink var(--mk-s) linear forwards}'+
      '.mk-ann[data-paused] .mk-ann__bar i{animation-play-state:paused}'+
      '@keyframes mkShrink{to{transform:scaleX(0)}}@keyframes mkFade{from{opacity:0}}@media(prefers-reduced-motion:reduce){.mk-ann{animation:none}}';
    document.head.appendChild(css);
    var wrap=document.createElement('div');wrap.className='mk-ann';wrap.setAttribute('dir',lang==='en'?'ltr':'rtl');wrap.setAttribute('lang',lang);wrap.style.setProperty('--mk-s',seconds+'s');
    wrap.innerHTML='<div class="mk-ann__card" role="dialog" aria-modal="true" aria-labelledby="mk-ann-title" aria-describedby="mk-ann-text">'+
      '<button type="button" class="mk-ann__close" aria-label="'+text.close+'">×</button>'+
      '<span class="mk-ann__badge">'+text.badge+'</span><h2 id="mk-ann-title">'+text.title+'</h2><p id="mk-ann-text">'+text.body+'</p>'+
      '<a class="mk-ann__btn" href="'+href+'" data-preserve-language>'+text.button+'</a><div class="mk-ann__bar" aria-hidden="true"><i></i></div></div>';
    document.body.appendChild(wrap);
    var timer=null,remaining=seconds*1000,started=Date.now();
    function close(){clearTimeout(timer);if(wrap.parentNode)wrap.parentNode.removeChild(wrap);document.removeEventListener('keydown',onKey);}
    function arm(){started=Date.now();timer=setTimeout(close,remaining);}
    function pause(){clearTimeout(timer);remaining-=Date.now()-started;wrap.setAttribute('data-paused','');}
    function resume(){wrap.removeAttribute('data-paused');arm();}
    function onKey(e){if(e.key==='Escape')close();}
    wrap.querySelector('.mk-ann__close').addEventListener('click',close);
    wrap.addEventListener('click',function(e){if(e.target===wrap)close();});
    wrap.addEventListener('mouseenter',pause);wrap.addEventListener('mouseleave',resume);
    wrap.addEventListener('focusin',pause);wrap.addEventListener('focusout',function(e){if(!wrap.contains(e.relatedTarget))resume();});
    wrap.addEventListener('touchstart',pause,{passive:true});
    document.addEventListener('keydown',onKey);
    wrap.querySelector('.mk-ann__btn').addEventListener('click',function(){try{if(window.magicTrack)window.magicTrack('announcement_click',{id:cfg.id});}catch(_){}});
    try{if(window.magicTrack)window.magicTrack('announcement_view',{id:cfg.id});}catch(_){}
    arm(); wrap.querySelector('.mk-ann__btn').focus({preventScroll:true}); resume();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show);else show();
})();
