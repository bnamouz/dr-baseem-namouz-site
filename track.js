/* Magic Kids — first-party usage measurement. No cookies, no third parties, no personal data.
   Sends page views and clicks on booking/contact buttons to the institute's own system. */
(function(){
 try{
  if(navigator.webdriver)return;
  var EP='https://app.magickidsinstitute.com/api/track';
  function rand(){var a=new Uint8Array(12);crypto.getRandomValues(a);var s='';for(var i=0;i<a.length;i++)s+=(a[i]%36).toString(36);return s;}
  function id(store,key){try{var v=store.getItem(key);if(!v){v=rand();store.setItem(key,v);}return v;}catch(e){return rand();}}
  var visitor=id(localStorage,'mk_v'),session=id(sessionStorage,'mk_s');
  function utm(){try{var saved=sessionStorage.getItem('mk_utm');if(saved)return JSON.parse(saved);var p=new URLSearchParams(location.search);var u={utm_source:p.get('utm_source'),utm_medium:p.get('utm_medium'),utm_campaign:p.get('utm_campaign')};if(u.utm_source||u.utm_medium||u.utm_campaign)sessionStorage.setItem('mk_utm',JSON.stringify(u));return u;}catch(e){return {};}}
  function refHost(){try{var h=document.referrer?new URL(document.referrer).host:'';return h&&h!==location.host?h:null;}catch(e){return null;}}
  function device(){var w=window.innerWidth;return w<768?'mobile':w<1100?'tablet':'desktop';}
  function lang(){var l=document.documentElement.lang;return l==='he'||l==='ar'||l==='en'?l:'ar';}
  function send(event,label){
   var b={site:'public',event:event,label:label||null,path:location.pathname.slice(0,200),lang:lang(),visitor:visitor,session:session,referrer:refHost(),device:device()};
   var u=utm();b.utm_source=u.utm_source||null;b.utm_medium=u.utm_medium||null;b.utm_campaign=u.utm_campaign||null;
   var body=JSON.stringify(b);
   if(navigator.sendBeacon)navigator.sendBeacon(EP,new Blob([body],{type:'text/plain'}));
   else fetch(EP,{method:'POST',body:body,keepalive:true,mode:'cors'}).catch(function(){});
  }
  function labelFor(href){
   try{
    var u=new URL(href,location.href);
    if(u.protocol==='tel:')return 'phone';
    if(u.protocol==='mailto:')return 'email';
    if(/(^|\.)wa\.me$|whatsapp\.com$/.test(u.host))return 'whatsapp';
    if(u.host==='app.magickidsinstitute.com'||u.host==='magickids-panel.vercel.app'){
     var p=u.pathname;
     if(p.indexOf('/book/adhd')===0)return u.searchParams.get('visitType')==='followup'?'book_adhd_followup':'book_adhd_assessment';
     if(p.indexOf('/book/pediatrics')===0)return 'book_peds';
     if(p.indexOf('/register')===0||p.indexOf('/onboarding')===0)return 'register';
     if(p.indexOf('/moxo')===0)return 'moxo';
     if(p.indexOf('/treatments')===0)return 'treatments';
     if(p.indexOf('/reviews')===0)return 'reviews';
     if(p.indexOf('/abroad')===0)return 'abroad';
     if(p.indexOf('/classes')===0)return 'classes';
     return 'app:'+p.split('/')[1];
    }
   }catch(e){}
   return null;
  }
  // Wait one tick so the language script has applied the saved language.
  setTimeout(function(){send('view');},0);
  document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;var l=labelFor(a.getAttribute('href'));if(l)send('click',l);},true);
 }catch(e){}
})();
