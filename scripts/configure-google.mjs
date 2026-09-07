import {readFile,writeFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
const ctx={window:{}};
vm.runInNewContext(await readFile(new URL('../site-config.js',import.meta.url),'utf8'),ctx,{timeout:1000});
const token=ctx.window.MAGIC_SITE?.google?.searchConsoleVerification || '';
if(token && !/^[a-zA-Z0-9_-]{10,200}$/.test(token))throw new Error('Invalid Search Console verification token');
const root=new URL('../',import.meta.url);
for(const name of (await readdir(root)).filter(n=>n.endsWith('.html'))){
 const url=new URL(name,root);let html=await readFile(url,'utf8');html=html.replace(/<meta name="google-site-verification" content="[^"]*">\n?/g,'');
 if(token)html=html.replace('</head>','<meta name="google-site-verification" content="'+token+'">\n</head>');
 await writeFile(url,html);
}
console.log(token?'Verification tag written to HTML. Google must confirm ownership.':'No verification token supplied; no claim of verified ownership.');
