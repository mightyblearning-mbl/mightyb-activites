// Browser test: host page (worker) <-> deck iframe postMessage, using real Chromium and two origins.
import http from 'http'; import fs from 'fs';
const { chromium } = await import(process.env.PW);
// deck server (plays github.io) on 8788, deck's MB_HOST_ORIGIN pointed at 8787
const deckSrc = fs.readFileSync('/tmp/mbv1/activities/3-1-momentum.html','utf8').replace('https://mb-practice.mightyblearning.workers.dev','http://127.0.0.1:8787');
http.createServer((q,s)=>{s.setHeader('content-type','text/html');s.end(deckSrc)}).listen(8788);
// host server on 8787: serves host page HTML pulled from e2e-style launch, and /api/result recording posts
let posts=[];
const hostHtml = fs.readFileSync('/tmp/mbv1/lti/test/host.html','utf8')
  .replace(/https:\/\/mightyblearning-mbl\.github\.io\/mightyb-activites\/activities\//g,'http://127.0.0.1:8788/')
  .replace('"deckOrigin":"https://mightyblearning-mbl.github.io"','"deckOrigin":"http://127.0.0.1:8788"');
http.createServer((q,s)=>{ if(q.url==='/api/result'){let b='';q.on('data',d=>b+=d);q.on('end',()=>{posts.push({auth:q.headers.authorization,body:JSON.parse(b)});s.setHeader('content-type','application/json');s.end(JSON.stringify({saved:true,passback:'sent',scoreGiven:JSON.parse(b).scoreGiven,scoreMaximum:6}))});return;} s.setHeader('content-type','text/html');s.end(hostHtml)}).listen(8787);
const b=await chromium.launch(); const pg=await b.newPage();
await pg.goto('http://127.0.0.1:8787/'); const fr=pg.frameLocator('#deck');
const deck=JSON.parse(deckSrc.match(/id="mb-deck">\n([\s\S]*?)\n<\/script>/)[1]);
for(let k=0;k<deck.problems.length;k++){
  const q=await fr.locator('#qText').innerHTML(); const p=deck.problems.find(x=>x.q===q);
  const texts=await fr.locator('.choice').allTextContents(); await fr.locator('.choice').nth(texts.indexOf(p.answer)).click();
  await fr.locator('.btn-primary').click();
}
await pg.waitForTimeout(800);
console.log('posts',posts.length, posts[0]&&posts[0].body.scoreGiven+'/'+posts[0].body.scoreMaximum, posts[0]&&posts[0].auth.slice(0,12));
console.log('status:', await pg.locator('#status').textContent());
await b.close(); process.exit(0);
