/* "Add to home screen" helper for the public site / PWA.
   Android & desktop (Chrome, Edge, Samsung Internet): one tap opens the browser's native install prompt,
   which places the icon on the home screen. iPhone/iPad: Apple offers no install API, so a short illustrated
   guide (Share → Add to Home Screen) opens instead. Hidden when the app is already installed; dismissal is
   remembered for 14 days. */
(function(){
  var standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(standalone)return;
  var KEY='magic-install:dismissed'; try{var until=Number(localStorage.getItem(KEY)||0);if(until>Date.now())return;}catch(_){}
  var ua=navigator.userAgent, isIOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var isSafari=isIOS&&/Safari/.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  var T={
    he:{btn:'הוספה למסך הבית',short:'למסך הבית',title:'הוסיפו את ילדי הקסם למסך הבית',sub:'האפליקציה נפתחת בלחיצה אחת, בלי להקליד כתובת.',
        ios:['לחצו על כפתור <b>השיתוף</b> בסרגל של Safari','גללו ובחרו <b>״הוסף למסך הבית״</b>','לחצו <b>״הוסף״</b> – האייקון יופיע במסך הבית'],
        iosOther:'כדי להוסיף למסך הבית באייפון יש לפתוח את האתר ב־<b>Safari</b> ואז: שיתוף ← ״הוסף למסך הבית״.',
        android:['פתחו את תפריט הדפדפן (⋮)','בחרו <b>״התקנת אפליקציה״</b> או <b>״הוספה למסך הבית״</b>','אשרו – האייקון יתווסף אוטומטית'],
        wait:'ההתקנה נפתחת…',close:'סגירה',later:'לא עכשיו',dismiss:'הסתרת הכפתור'},
    ar:{btn:'إضافة إلى الشاشة الرئيسية',short:'للشاشة الرئيسية',title:'أضيفوا أطفال السحر إلى الشاشة الرئيسية',sub:'يفتح التطبيق بضغطة واحدة، بدون كتابة عنوان.',
        ios:['اضغطوا على زر <b>المشاركة</b> في شريط Safari','مرّروا واختاروا <b>«إضافة إلى الشاشة الرئيسية»</b>','اضغطوا <b>«إضافة»</b> – ستظهر الأيقونة على الشاشة الرئيسية'],
        iosOther:'للإضافة إلى الشاشة الرئيسية على آيفون افتحوا الموقع في <b>Safari</b> ثم: مشاركة ← «إضافة إلى الشاشة الرئيسية».',
        android:['افتحوا قائمة المتصفح (⋮)','اختاروا <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>','أكّدوا – ستُضاف الأيقونة تلقائيًا'],
        wait:'جارٍ فتح التثبيت…',close:'إغلاق',later:'ليس الآن',dismiss:'إخفاء الزر'},
    en:{btn:'Add to home screen',short:'Home screen',title:'Add Magic Kids to your home screen',sub:'The app opens with one tap – no address to type.',
        ios:['Tap the <b>Share</b> button in the Safari toolbar','Scroll and choose <b>“Add to Home Screen”</b>','Tap <b>“Add”</b> – the icon appears on your home screen'],
        iosOther:'On iPhone, open this site in <b>Safari</b>, then: Share → “Add to Home Screen”.',
        android:['Open the browser menu (⋮)','Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>','Confirm – the icon is added automatically'],
        wait:'Opening the installer…',close:'Close',later:'Not now',dismiss:'Hide this button'}
  };
  function lang(){var q=new URLSearchParams(location.search).get('lang'),l=document.documentElement.lang||'ar';if(['he','ar','en'].indexOf(q)>-1)l=q;else{try{l=localStorage.getItem('magic-language')||l;}catch(_){}}return T[l]?l:'ar';}
  var deferred=null; window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;});
  window.addEventListener('appinstalled',function(){try{localStorage.setItem(KEY,String(Date.now()+365*864e5));}catch(_){}remove();});
  var btn,sheet;
  function remove(){if(btn&&btn.parentNode)btn.parentNode.removeChild(btn);if(sheet&&sheet.parentNode)sheet.parentNode.removeChild(sheet);}
  var shareIcon='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 3v12m0-12 4 4m-4-4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var plusIcon='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function css(){
    var s=document.createElement('style');s.textContent=
      '.mk-install{position:fixed;left:16px;bottom:176px;z-index:45;display:flex;align-items:center;gap:10px;background:#075a5d;color:#fff;border:2px solid #fff;border-radius:999px;padding:12px 18px;font:inherit;font-weight:800;font-size:15px;box-shadow:0 8px 24px rgba(1,52,56,.35);cursor:pointer;direction:inherit}'+
      '.mk-install:hover{background:#064b4e}.mk-install:focus-visible{outline:3px solid #213e70;outline-offset:4px}.mk-install__x{position:absolute;top:-10px;inset-inline-end:-6px;width:24px;height:24px;border-radius:50%;border:0;background:#fff;color:#075a5d;font-size:15px;line-height:24px;text-align:center;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.25)}'+
      '@media(max-width:680px){.mk-install{left:10px;bottom:calc(156px + env(safe-area-inset-bottom));padding:12px 14px;font-size:14px}.mk-install__long{display:none}}@media(min-width:681px){.mk-install__short{display:none}}'+
      '.mk-sheet{position:fixed;inset:0;z-index:9998;background:rgba(1,52,56,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}'+
      '.mk-sheet__card{width:min(520px,100%);background:#fff;color:#0f2a2b;border-radius:22px 22px 18px 18px;padding:24px 22px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);font-family:inherit;position:relative}'+
      '.mk-sheet__card h2{margin:0 0 6px;font-size:21px;color:#075a5d}.mk-sheet__card p{margin:0 0 14px;font-size:15px;line-height:1.55}'+
      '.mk-sheet__steps{list-style:none;margin:0 0 16px;padding:0;display:grid;gap:10px}.mk-sheet__steps li{display:flex;align-items:center;gap:12px;background:#f0f7f5;border-radius:14px;padding:12px 14px;font-size:15px;line-height:1.45}'+
      '.mk-sheet__n{flex:0 0 32px;height:32px;border-radius:50%;background:#075a5d;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}.mk-sheet__ic{flex:0 0 auto;color:#075a5d;display:flex}'+
      '.mk-sheet__btn{display:block;width:100%;border:0;background:#075a5d;color:#fff;border-radius:14px;padding:14px;font:inherit;font-size:16px;font-weight:800;cursor:pointer}.mk-sheet__link{display:block;width:100%;margin-top:8px;border:0;background:none;color:#4a6b6d;font:inherit;font-size:14px;cursor:pointer;text-decoration:underline}'+
      '.mk-sheet__close{position:absolute;top:10px;inset-inline-end:10px;border:0;background:#f0f5f2;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer}';
    document.head.appendChild(s);
  }
  function openSheet(){
    var l=lang(),t=T[l];
    sheet=document.createElement('div');sheet.className='mk-sheet';sheet.setAttribute('dir',l==='en'?'ltr':'rtl');sheet.setAttribute('lang',l);
    var steps=isIOS?(isSafari?t.ios:null):t.android, icons=isIOS?[shareIcon,plusIcon,'✓']:['⋮',plusIcon,'✓'];
    var html='<div class="mk-sheet__card" role="dialog" aria-modal="true" aria-labelledby="mk-install-title"><button type="button" class="mk-sheet__close" aria-label="'+t.close+'">×</button><h2 id="mk-install-title">'+t.title+'</h2><p>'+t.sub+'</p>';
    if(steps){html+='<ol class="mk-sheet__steps">'+steps.map(function(s,i){return '<li><span class="mk-sheet__n">'+(i+1)+'</span><span class="mk-sheet__ic">'+icons[i]+'</span><span>'+s+'</span></li>';}).join('')+'</ol>';}
    else html+='<p>'+t.iosOther+'</p>';
    html+='<button type="button" class="mk-sheet__btn">'+t.close+'</button><button type="button" class="mk-sheet__link">'+t.dismiss+'</button></div>';
    sheet.innerHTML=html;document.body.appendChild(sheet);
    function close(){if(sheet&&sheet.parentNode)sheet.parentNode.removeChild(sheet);sheet=null;}
    sheet.querySelector('.mk-sheet__close').onclick=close;sheet.querySelector('.mk-sheet__btn').onclick=close;
    sheet.querySelector('.mk-sheet__link').onclick=function(){dismiss();close();};
    sheet.addEventListener('click',function(e){if(e.target===sheet)close();});
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',k);}});
  }
  function dismiss(){try{localStorage.setItem(KEY,String(Date.now()+14*864e5));}catch(_){}remove();track('install_button_dismissed');}
  function track(n){try{if(window.magicTrack)window.magicTrack(n,{});}catch(_){}}
  async function install(){
    track('install_button_click');
    if(deferred){var p=deferred;deferred=null;btn.disabled=true;var label=btn.querySelector('.mk-install__long').textContent;btn.querySelector('.mk-install__long').textContent=T[lang()].wait;
      try{p.prompt();var c=await p.userChoice;if(c&&c.outcome==='accepted'){track('install_accepted');return;}}catch(_){}
      btn.disabled=false;btn.querySelector('.mk-install__long').textContent=label;return;}
    openSheet();
  }
  function mount(){
    if(document.querySelector('[data-install]'))return; // the app page already has a large install button
    css();var t=T[lang()];
    btn=document.createElement('button');btn.type='button';btn.className='mk-install';btn.setAttribute('aria-label',t.btn);
    btn.innerHTML=plusIcon+'<span class="mk-install__long">'+t.btn+'</span><span class="mk-install__short">'+t.short+'</span><span class="mk-install__x" role="button" aria-label="'+t.dismiss+'">×</span>';
    btn.addEventListener('click',function(e){if(e.target.classList.contains('mk-install__x')){e.stopPropagation();dismiss();return;}install();});
    document.addEventListener('magic-language',function(e){var tt=T[e.detail&&e.detail.lang]||t;btn.querySelector('.mk-install__long').textContent=tt.btn;btn.querySelector('.mk-install__short').textContent=tt.short;btn.setAttribute('aria-label',tt.btn);});
    document.body.appendChild(btn);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
