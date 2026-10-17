(function(){
 // Home page reviews: live approved reviews from the panel; clearly labelled examples until real ones exist.
 const API='https://app.magickidsinstitute.com/api/reviews';
 const copy={
  he:{eyebrow:'חוות דעת',title:'מה ההורים מספרים',lead:'חוויות של משפחות במרפאת הילדים ובמרפאת הקשב והריכוז.',cta:'כתבו חוות דעת',sub:'לוקח דקה. כל חוות דעת נבדקת לפני פרסום.',peds:'מרפאת הילדים',adhd:'מרפאת קשב וריכוז',demo:'דוגמה להמחשה',demoNote:'חוות הדעת המוצגות הן דוגמאות להמחשה בלבד ויוחלפו בחוות דעת אמיתיות של מטופלים.',stars:'דירוג {n} מתוך 5',
   demos:[['מיכל א.','pediatrics',5,'קבלה חמה וסבלנית. הרופא הקדיש זמן להסביר לנו הכול, והילד יצא מחייך.'],['אחמד ח.','adhd',5,'התהליך היה מסודר וברור: שאלונים, תזכורות ותור בזמן. הרגשנו מלווים בכל שלב.'],['רנין ס.','pediatrics',5,'קיבלנו תור מהר, בלי המתנה ארוכה. צוות אדיב ומקצועי.'],['יוסי ל.','adhd',4,'קיבלנו הסבר מפורט ותוכנית המשך ברורה. ממליצים להורים שמתלבטים.']]},
  ar:{eyebrow:'آراء الأهل',title:'ماذا يقول الأهل',lead:'تجارب عائلات في عيادة الأطفال وعيادة الانتباه والتركيز.',cta:'اكتبوا رأيكم',sub:'يستغرق دقيقة. تُراجع كل الآراء قبل النشر.',peds:'عيادة الأطفال',adhd:'عيادة الانتباه والتركيز',demo:'مثال توضيحي',demoNote:'الآراء المعروضة أمثلة توضيحية فقط وسيتم استبدالها بآراء حقيقية من المراجعين.',stars:'تقييم {n} من 5',
   demos:[['سماح ع.','pediatrics',5,'استقبال دافئ وصبور. خصّص الطبيب وقتًا ليشرح لنا كل شيء، وخرج ابننا مبتسمًا.'],['أحمد ح.','adhd',5,'المسار كان منظمًا وواضحًا: استبيانات وتذكيرات وموعد في وقته. شعرنا بالمرافقة في كل خطوة.'],['رنين س.','pediatrics',5,'حصلنا على موعد بسرعة ومن دون انتظار طويل. طاقم لطيف ومهني.'],['يوسف ل.','adhd',4,'حصلنا على شرح مفصّل وخطة متابعة واضحة. ننصح الأهل المتردّدين.']]},
  en:{eyebrow:'Reviews',title:'What parents say',lead:'Families on our pediatric clinic and ADHD clinic.',cta:'Write a review',sub:'Takes a minute. Every review is checked before publication.',peds:'Pediatric clinic',adhd:'ADHD clinic',demo:'Example',demoNote:'The reviews shown are illustrative examples only and will be replaced by real patient reviews.',stars:'Rated {n} out of 5',
   demos:[['Michal A.','pediatrics',5,'A warm, patient welcome. The doctor took time to explain everything and our son left smiling.'],['Ahmad H.','adhd',5,'A clear, organised process: questionnaires, reminders and an on-time appointment. We felt supported at every step.'],['Ranin S.','pediatrics',5,'We got an appointment quickly, without a long wait. Kind, professional staff.'],['Yossi L.','adhd',4,'A detailed explanation and a clear follow-up plan. Recommended for hesitant parents.']]}
 };
 const root=document.getElementById('reviews-home');if(!root)return;
 let live=null;
 const lang=()=>document.documentElement.lang in copy?document.documentElement.lang:'ar';
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 function card(name,service,rating,body,demo,t){
  const a=el('article','review-card');const top=el('div','review-top');
  const s=el('span','review-stars','★★★★★'.slice(0,rating)+'☆☆☆☆☆'.slice(0,5-rating));s.setAttribute('role','img');s.setAttribute('aria-label',t.stars.replace('{n}',rating));
  top.append(s);if(demo)top.append(el('span','review-demo',t.demo));
  a.append(top,el('p','review-body','“'+body+'”'));const who=el('p','review-who');who.append(el('b',null,name),document.createTextNode(' · '+(service==='adhd'?t.adhd:t.peds)));a.append(who);return a;
 }
 function render(){
  const t=copy[lang()];
  root.querySelector('[data-r=eyebrow]').textContent=t.eyebrow;root.querySelector('[data-r=title]').textContent=t.title;root.querySelector('[data-r=lead]').textContent=t.lead;
  root.querySelector('[data-r=cta]').textContent=t.cta;root.querySelector('[data-r=sub]').textContent=t.sub;
  const grid=root.querySelector('.review-grid');grid.replaceChildren();
  const real=(live||[]).slice(0,6);
  if(real.length)real.forEach(r=>grid.append(card(r.display_name,r.service,r.rating,r.body,false,t)));
  else t.demos.forEach(d=>grid.append(card(d[0],d[1],d[2],d[3],true,t)));
  const note=root.querySelector('[data-r=note]');note.textContent=real.length?'':t.demoNote;note.hidden=!!real.length;
 }
 root.querySelector('[data-r=open]').addEventListener('click',()=>{const b=document.getElementById('community-launch');if(b)b.click();else location.href='https://app.magickidsinstitute.com/reviews?lang='+lang();});
 render();document.addEventListener('magic-language',render);
 fetch(API,{mode:'cors',credentials:'omit'}).then(r=>r.ok?r.json():null).then(d=>{if(d&&Array.isArray(d.reviews)){live=d.reviews;render();}}).catch(()=>{});
})();
