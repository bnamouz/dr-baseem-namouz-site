(function(){
 'use strict';
 const form=document.querySelector('[data-private-care]');if(!form)return;
 const word=key=>window.MAGIC_TRANSLATIONS?.[document.documentElement.lang]?.[key]||'';
 const status=form.querySelector('[data-private-status]'),panel=form.querySelector('[data-private-quote]');
 const chosen=()=>form.querySelector('input[name="package"]:checked');
 const money=n=>'₪'+Number(n).toLocaleString('en-US');
 let revealed=false;
 const source={h1:1200,h2:1000,h3:800,t1:500,t2:350,t3:250,m1:800,a1:2000};
 function quote(id){
  let total=source[id];
  if(id.startsWith('h'))total=Math.round((total+({0:0,1:500,2:2000}[form.elements.distance.value]||0)+(form.elements.night.checked?500:0))*1.18);
  if(id==='m1'||id==='a1')total=Math.round(total*1.18);
  return money(total)+' · '+word(id==='m1'?'p.approx':'p.total');
 }
 function render(){
  const home=chosen().dataset.kind==='home';
  ['town','distance','night'].forEach(k=>form.querySelector('[data-home-'+k+']').hidden=!home);
  form.elements.city.disabled=!home;form.elements.city.required=home;
  form.elements.distance.disabled=!home;form.elements.night.disabled=!home;
  [...form.elements.distance.options].forEach((o,i)=>o.textContent=word('p.d'+i));
  panel.hidden=!revealed;
  form.querySelectorAll('[data-package-price]').forEach(el=>{el.hidden=!revealed;el.textContent=revealed?quote(el.dataset.packagePrice):'';});
  if(revealed){form.querySelector('[data-quote-label]').textContent=word('p.'+chosen().dataset.kind)+' · '+word('p.'+chosen().value);form.querySelector('[data-quote-total]').textContent=quote(chosen().value);}
 }
 const requested=new URLSearchParams(location.search).get('service');
 if(requested==='moxo')form.querySelector('input[value="m1"]').checked=true;
 if(requested==='adhd')form.querySelector('input[value="a1"]').checked=true;
 form.addEventListener('input',()=>{revealed=false;status.textContent='';render();});
 form.addEventListener('change',()=>{revealed=false;status.textContent='';render();});
 document.addEventListener('magic-language',render);
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const phone=form.elements.phone.value.trim(),digits=phone.replace(/\D/g,'');
  if(digits.length<9||digits.length>15||!/^[+0-9() .-]+$/.test(phone)||form.elements.name.value.trim().length<2||(chosen().dataset.kind==='home'&&form.elements.city.value.trim().length<2)){status.textContent=word('u.invalidForm');return;}
  if(event.submitter?.value==='quote'||!revealed){revealed=true;render();panel.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
  const option=chosen();
  const lines=[word('p.cta'),word('p.'+option.dataset.kind)+' — '+word('p.'+option.value),word('p.quote')+': '+quote(option.value),word('p.contact')+': '+form.elements.name.value.trim(),word('u.phone')+': '+phone];
  if(option.dataset.kind==='home'){lines.push(word('p.city')+': '+form.elements.city.value.trim(),word('p.distance')+': '+word('p.d'+form.elements.distance.value));if(form.elements.night.checked)lines.push(word('p.night'));}
  lines.push(word('p.ack'));
  const text=lines.join('\n'),a=document.createElement('a');
  if(event.submitter?.value==='email')a.href='mailto:magickids@magickidsinstitute.com?subject='+encodeURIComponent(word('p.cta'))+'&body='+encodeURIComponent(text);
  else {a.href='https://wa.me/'+(['moxo','adhd'].includes(option.dataset.kind)?'972544020043':'972543496656')+'?text='+encodeURIComponent(text);a.target='_blank';a.rel='noopener noreferrer';}
  document.body.appendChild(a);a.click();a.remove();status.textContent=word('p.draft');
 });
 render();
})();
