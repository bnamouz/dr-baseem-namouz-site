(function(){
  'use strict';
  const form=document.querySelector('[data-private-care]');if(!form)return;
  const word=key=>window.MAGIC_TRANSLATIONS?.[document.documentElement.lang]?.[key]||'';
  const status=form.querySelector('[data-private-status]');
  const chosen=()=>form.querySelector('input[name="package"]:checked');
  const money=n=>'₪'+Number(n).toLocaleString('en-US');
  function update(){
    const option=chosen(), home=option.dataset.kind==='home';
    form.querySelector('[data-home-town]').hidden=!home;
    form.elements.city.disabled=!home;form.elements.city.required=home;
    form.querySelector('[data-quote-label]').textContent=word('p.'+option.dataset.kind)+' · '+word('p.'+option.value);
    form.querySelector('[data-quote-total]').textContent=money(option.dataset.total);
    status.textContent='';
  }
  form.querySelectorAll('input[name="package"]').forEach(r=>r.addEventListener('change',update));
  document.addEventListener('magic-language',update);
  form.querySelectorAll('button[type="submit"]').forEach(b=>b.disabled=false);
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const phone=form.elements.phone.value.trim(), digits=phone.replace(/\D/g,'');
    if(digits.length<9||digits.length>15||!/^[+0-9() .-]+$/.test(phone)||form.elements.name.value.trim().length<2||(chosen().dataset.kind==='home'&&form.elements.city.value.trim().length<2)){
      status.textContent=word('u.invalidForm');return;
    }
    const option=chosen();
    const lines=[word('p.cta'),word('p.'+option.dataset.kind)+' — '+word('p.'+option.value),word('p.quote')+': '+money(option.dataset.total)+' ('+word('p.total')+')',word('p.contact')+': '+form.elements.name.value.trim(),word('u.phone')+': '+phone];
    if(option.dataset.kind==='home')lines.push(word('p.city')+': '+form.elements.city.value.trim());
    lines.push(word('p.ack'));
    const text=lines.join('\n'), a=document.createElement('a');
    if(event.submitter?.value==='email'){
      a.href='mailto:magickids@magickidsinstitute.com?subject='+encodeURIComponent(word('p.cta'))+'&body='+encodeURIComponent(text);
    }else{
      a.href='https://wa.me/972543496656?text='+encodeURIComponent(text);a.target='_blank';a.rel='noopener noreferrer';
    }
    document.body.appendChild(a);a.click();a.remove();status.textContent=word('p.draft');
  });
  update();
})();
