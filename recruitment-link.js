(async function(){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
 try{
 const response=await fetch('https://app.magickidsinstitute.com/recruitment',{signal:controller.signal,cache:'no-store',credentials:'omit'});
 if(!response.ok)return;
 const text=await response.text();if(!text.includes('הצטרפות לצוות | Magic Kids Institute'))return;
 const old=document.getElementById('enquiry'),direct=document.getElementById('recruitment-direct');
 if(old&&direct){old.hidden=true;old.id='recruitment-legacy';direct.id='enquiry';direct.hidden=false;}
 }catch{}finally{clearTimeout(timer);}
})();
