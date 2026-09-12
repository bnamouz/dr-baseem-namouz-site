(function () {
  'use strict';
  // A previously cached HTML page may request this script after a publication.
  if(!document.body.dataset.page){const fresh=new URL(location.href);if(fresh.searchParams.get('site-version')!=='20260912-passportcard-1'){fresh.searchParams.set('site-version','20260912-passportcard-1');location.replace(fresh.href);}return;}
  const root=document.documentElement, translations=window.MAGIC_TRANSLATIONS||{};
  let language=window.magicLanguage||'ar';
  const words=key=>translations[language]?.[key]||'';
  let installPrompt=null,installed=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  function updateInstallLabel(){document.querySelectorAll('[data-install]').forEach(b=>{b.disabled=installed;b.querySelector('[data-i18n]').textContent=words(installed?'u.installed':'u.install');});}
  function languageLinks(){document.querySelectorAll('a[href]').forEach(a=>{if(a.hasAttribute('data-preserve-language'))return;const u=new URL(a.getAttribute('href'),location.href);if((u.origin===location.origin&&/\.html$/.test(u.pathname))||u.origin==='https://magic-kids-hub.baseem-n.chatgpt.site'||(['https://app.magickidsinstitute.com','https://magickids-panel.vercel.app'].includes(u.origin)&&(u.pathname.startsWith('/book/')||u.pathname==='/onboarding/public'||u.pathname==='/moxo'||u.pathname==='/treatments'))){u.searchParams.set('lang',language);a.href=u.origin===location.origin?u.pathname+u.search+u.hash:u.href;}});}
  function applyLanguage(lang){
    if(!translations[lang])return;
    language=lang;root.lang=lang;root.dir=lang==='en'?'ltr':'rtl';
    try{localStorage.setItem('magic-language',lang);}catch(_){}
    document.querySelectorAll('[data-i18n]').forEach(el=>{const text=words(el.dataset.i18n);if(text)el.textContent=text;});
    document.querySelectorAll('[data-i18n-alt]').forEach(el=>el.alt=words(el.dataset.i18nAlt));
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',words(el.dataset.i18nAria)));
    document.querySelectorAll('[data-lang-switch]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.langSwitch===lang)));
    document.title=words(document.body.dataset.titleKey)+' | Magic Kids Institute';
    const desc=words(document.body.dataset.descriptionKey);
    document.querySelector('meta[name="description"]')?.setAttribute('content',desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',desc);
    document.querySelectorAll('.form-status').forEach(s=>{if(s.dataset.messageKey)s.textContent=words(s.dataset.messageKey);});
    languageLinks();const current=new URL(location.href);current.searchParams.set('lang',lang);
    try{history.replaceState(null,'',current.pathname+current.search+current.hash);}catch(_){}
    document.dispatchEvent(new CustomEvent('magic-language',{detail:{lang}}));updateInstallLabel();
  }
  document.querySelectorAll('[data-lang-switch]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.langSwitch)));
  const toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('.main-nav');
  function closeMenu(){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}
  toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.querySelectorAll('[data-enquiry]').forEach(form=>{
    const selected=new URLSearchParams(location.search).get('activity');
    if(selected&&form.elements.activity&&[...form.elements.activity.options].some(o=>o.value===selected))form.elements.activity.value=selected;
    form.querySelectorAll('button[type=submit]').forEach(b=>b.disabled=false);
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form),phone=String(data.get('phone')).replace(/\D/g,''),status=form.querySelector('.form-status');
      if(String(data.get('name')).trim().length<2||phone.length<7||phone.length>15||!/^[+0-9() .-]+$/.test(String(data.get('phone')))){status.dataset.messageKey='u.invalidForm';status.textContent=words('u.invalidForm');return;}
      const key=form.dataset.enquiry==='instructor'?'u.recruitSubject':form.dataset.enquiry==='workshop'?'u.workshopSubject':'u.parentSubject';
      const subject=words(key),lines=[subject,words('u.name')+': '+String(data.get('name')).trim(),words('u.phone')+': '+String(data.get('phone')).trim()];
      if(data.get('email'))lines.push(words('u.email')+': '+data.get('email'));
      if(form.elements.activity)lines.push(words('u.subject')+': '+form.elements.activity.selectedOptions[0].textContent);
      if(data.get('message'))lines.push(String(data.get('message')).trim());
      const body=lines.join('\n');
      const href=e.submitter?.value==='whatsapp'?'https://wa.me/972544020043?text='+encodeURIComponent(body):'mailto:magickids@magickidsinstitute.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      // A click opens a compose screen. No automatic messaging or third-party submission.
      const a=document.createElement('a');a.href=href;if(e.submitter?.value==='whatsapp'){a.target='_blank';a.rel='noopener noreferrer';}document.body.appendChild(a);a.click();a.remove();
      status.dataset.messageKey='u.draftNote';status.textContent=words('u.draftNote');
    });
  });
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;updateInstallLabel();});
  window.addEventListener('appinstalled',()=>{installed=true;installPrompt=null;updateInstallLabel();});
  document.querySelectorAll('[data-install]').forEach(b=>b.addEventListener('click',async()=>{if(installPrompt){const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();await prompt.userChoice;}catch(_){document.getElementById('install-dialog')?.showModal();}}else document.getElementById('install-dialog')?.showModal();}));

  const bookingDialog=document.getElementById('booking-dialog');
  let bookingOpener=null;
  document.querySelectorAll('[data-booking-open]').forEach(button=>button.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!bookingDialog?.showModal)return;
    event.preventDefault();bookingOpener=button;closeMenu();bookingDialog.showModal();
    document.documentElement.classList.add('booking-modal-open');
  }));
  bookingDialog?.addEventListener('close',()=>{document.documentElement.classList.remove('booking-modal-open');bookingOpener?.focus();});
  bookingDialog?.addEventListener('click',event=>{
    if(event.target===bookingDialog){const rect=bookingDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)bookingDialog.close();}
  });
  bookingDialog?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>bookingDialog.close()));
  const facts=document.querySelector('.family-facts');
  if(facts){
    const slides=[...facts.querySelectorAll('.fact-slide')], motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const button=facts.querySelector('[data-fact-toggle]');
    let index=0, paused=motion.matches, hovered=false, timer=null;
    facts.querySelector('.facts-controls').hidden=false;
    function label(){const key=paused?'f.play':'f.pause';button.querySelector('[data-i18n]').dataset.i18n=key;button.querySelector('[data-i18n]').textContent=words(key);}
    function schedule(){clearInterval(timer);if(!paused&&!hovered&&!document.hidden&&!facts.contains(document.activeElement))timer=setInterval(()=>show(index+1),15000);}
    function show(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);facts.querySelector('.facts-count').textContent=(index+1)+' / '+slides.length;}
    button.addEventListener('click',()=>{paused=!paused;label();schedule();});
    facts.querySelector('[data-fact-next]').addEventListener('click',()=>{show(index+1);schedule();});
    facts.querySelector('[data-fact-prev]').addEventListener('click',()=>{show(index-1);schedule();});
    facts.addEventListener('mouseenter',()=>{hovered=true;schedule();});facts.addEventListener('mouseleave',()=>{hovered=false;schedule();});
    facts.addEventListener('focusin',schedule);facts.addEventListener('focusout',()=>setTimeout(schedule,0));
    document.addEventListener('visibilitychange',schedule);document.addEventListener('magic-language',label);
    motion.addEventListener('change',()=>{paused=motion.matches;label();schedule();});label();schedule();
  }
  applyLanguage(language);
  if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});});
  const aliases={'#vision':'#services','#contact':'#contact-home','#main-services':'#services'};
  if(document.body.dataset.page==='index'&&aliases[location.hash])document.querySelector(aliases[location.hash])?.scrollIntoView();
})();
