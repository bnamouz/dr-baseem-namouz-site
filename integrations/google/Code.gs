/* Magic Kids Institute — private Google Sheets log and notifications.
 * Run setup() only while signed in as magickids@magickidsinstitute.com.
 * The deployed web app verifies a server-to-server HMAC on every request.
 */
var INSTITUTE_EMAIL = 'magickids@magickidsinstitute.com';
var ADMIN_URL = 'https://magic-kids-hub.baseem-n.chatgpt.site/admin';
function instituteAccount_() {
  var email = Session.getEffectiveUser().getEmail().toLowerCase();
  if (email !== INSTITUTE_EMAIL) throw new Error('Use the institute Google account.');
  return email;
}
function setup() {
  instituteAccount_();
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('BRIDGE_SECRET')) props.setProperty('BRIDGE_SECRET', [Utilities.getUuid(),Utilities.getUuid(),Utilities.getUuid()].join('').replace(/-/g,''));
  if (!props.getProperty('SPREADSHEET_ID')) {
    var file = SpreadsheetApp.create('Magic Kids | פניות וגיוס');
    var sheet = file.getSheets()[0]; sheet.setName('פניות');
    sheet.appendRow(['מזהה פנייה','נוצרה','סוג','שם איש קשר','טלפון','מייל','חוג','תחום הדרכה','שפה','מצב הודעה','עדכון']);
    sheet.setFrozenRows(1); sheet.setRightToLeft(true);
    sheet.getRange(1,1,1,11).setBackground('#075a5d').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setColumnWidths(1,11,165);
    props.setProperty('SPREADSHEET_ID',file.getId());
  }
  if (!props.getProperty('EMAIL_ENABLED')) props.setProperty('EMAIL_ENABLED','false');
  console.log('Setup ready. Spreadsheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('SPREADSHEET_ID'));
  // Secrets are intentionally never logged or returned by the web app.
}
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function equal_(left,right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  var diff=0; for(var i=0;i<left.length;i++) diff |= left.charCodeAt(i)^right.charCodeAt(i); return diff===0;
}
function cell_(value) {
  var text = String(value || '').slice(0,300);
  return /^[\s]*[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
}
function doGet() { return json_({ok:false,error:'Signed POST required'}); }
function doPost(e) {
  var lock;
  try {
    var raw=e&&e.postData&&e.postData.contents;
    if(!raw || raw.length>12000) throw new Error('Invalid request');
    var envelope=JSON.parse(raw), props=PropertiesService.getScriptProperties(), secret=props.getProperty('BRIDGE_SECRET');
    if(!secret || typeof envelope.body!=='string' || envelope.body.length>10000) throw new Error('Invalid request');
    var expected=Utilities.computeHmacSha256Signature(envelope.body,secret,Utilities.Charset.UTF_8).map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');
    if(!equal_(expected,envelope.signature)) throw new Error('Invalid signature');
    var request=JSON.parse(envelope.body);
    if(typeof request.timestamp!=='number' || Math.abs(Date.now()-request.timestamp)>300000 || !/^[a-f0-9-]{36}$/.test(request.nonce||'')) throw new Error('Expired request');
    var email=instituteAccount_(), sheet=SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName('פניות');
    if(!sheet)throw new Error('Run setup first');
    if(request.action==='health')return json_({ok:true,email:email,sheetUrl:'https://docs.google.com/spreadsheets/d/'+props.getProperty('SPREADSHEET_ID'),mail:props.getProperty('EMAIL_ENABLED')==='true'?'enabled':'disabled'});
    if(request.action!=='inquiry') throw new Error('Unknown action');
    var p=request.payload||{};
    if(!/^[a-f0-9-]{36}$/.test(p.id||'') || !['parent','instructor'].includes(p.kind) || typeof p.name!=='string' || typeof p.phone!=='string') throw new Error('Invalid inquiry');
    lock=LockService.getScriptLock(); if(!lock.tryLock(10000))throw new Error('Busy');
    var found=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(p.id).matchEntireCell(true).findNext():null;
    var row;
    if(found)row=found.getRow();
    else {
      sheet.appendRow([p.id,cell_(p.createdAt),p.kind==='parent'?'התעניינות בחוג':'מועמדות לצוות',cell_(p.name),cell_(p.phone),cell_(p.email),cell_(p.course),cell_(p.specialty),cell_(p.language),'pending',new Date().toISOString()]);
      SpreadsheetApp.flush(); row=sheet.getLastRow();
    }
    var status=sheet.getRange(row,10).getValue();
    if(status==='sent')return json_({ok:true,email:email,id:p.id,mail:'sent'});
    if(status==='sending'||status==='uncertain')return json_({ok:true,email:email,id:p.id,mail:'uncertain'});
    if(props.getProperty('EMAIL_ENABLED')!=='true')return json_({ok:true,email:email,id:p.id,mail:'disabled'});
    if(MailApp.getRemainingDailyQuota()<1)throw new Error('Mail quota');
    // Mark before send. An ambiguous provider outcome is reviewed, never resent blindly.
    sheet.getRange(row,10).setValue('sending'); SpreadsheetApp.flush();
    try {
      MailApp.sendEmail({to:INSTITUTE_EMAIL,subject:'ילדי הקסם | '+(p.kind==='parent'?'התעניינות חדשה בחוג':'מועמדות חדשה לצוות')+' | '+p.id.slice(0,8),body:'התקבלה פנייה חדשה באתר המכון.\n\nמזהה פנייה: '+p.id+'\nסוג: '+(p.kind==='parent'?'התעניינות בחוג':'מועמדות לצוות')+'\n\nפרטי הפנייה שמורים במרכז הניהול:\n'+ADMIN_URL+'\n\nזו הודעה אוטומטית ממערכת המכון.',name:'מכון ילדי הקסם'});
      sheet.getRange(row,10).setValue('sent'); sheet.getRange(row,11).setValue(new Date().toISOString()); SpreadsheetApp.flush();
    }catch(error){sheet.getRange(row,10).setValue('uncertain');SpreadsheetApp.flush();return json_({ok:true,email:email,id:p.id,mail:'uncertain'});}
    return json_({ok:true,email:email,id:p.id,mail:'sent'});
  }catch(error){return json_({ok:false,error:'Google connection requires attention'});}
  finally{if(lock&&lock.hasLock())lock.releaseLock();}
}
