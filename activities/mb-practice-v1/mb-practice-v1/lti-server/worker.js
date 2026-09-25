// Mighty B Practice - LTI 1.3 host + Canvas grade passback (Cloudflare Worker)
// Follows "Mighty B Practice Deck Format v1", sections 4 and 5.
// Generated from the v1 deck files. deckIds are permanent: never change or reuse one.
const DECKS = {
 "phys-3-2-review-momentum-impulse": {
  "file": "3-2-momentum-and-impulse.html",
  "title": "Review: Momentum & Impulse (3.1–3.2)",
  "kind": "mini-review",
  "questions": 13
 },
 "phys-3-4-review-collisions": {
  "file": "3-4-collisions.html",
  "title": "Review: Collisions (3.3–3.4)",
  "kind": "mini-review",
  "questions": 12
 },
 "phys-unit-3-review": {
  "file": "3-5-unit-3-review.html",
  "title": "Unit 3 Review: Momentum & Impulse",
  "kind": "unit-review",
  "questions": 13
 },
 "phys-unit-4-review": {
  "file": "4-unit-4-energy-work-power.html",
  "title": "Unit 4 Review: Work, Energy & Power",
  "kind": "unit-review",
  "questions": 18
 },
 "phys-unit-5-review": {
  "file": "5-unit-5-circular-motion-gravitation.html",
  "title": "Unit 5 Review: Circular Motion & Gravitation",
  "kind": "unit-review",
  "questions": 15
 },
 "phys-unit-6-review": {
  "file": "6-unit-6-waves-sound.html",
  "title": "Unit 6 Review: Waves & Sound",
  "kind": "unit-review",
  "questions": 13
 },
 "phys-unit-7-review": {
  "file": "7-unit-7-light-em-spectrum.html",
  "title": "Unit 7 Review: Light & the EM Spectrum",
  "kind": "unit-review",
  "questions": 11
 },
 "phys-unit-8-review": {
  "file": "8-unit-8-electricity-magnetism.html",
  "title": "Unit 8 Review: Electricity & Magnetism",
  "kind": "unit-review",
  "questions": 13
 },
 "phys-unit-9-review": {
  "file": "9-unit-9-heat-thermal-energy.html",
  "title": "Unit 9 Review: Heat & Thermal Energy",
  "kind": "unit-review",
  "questions": 12
 },
 "phys-final-review": {
  "file": "final-review.html",
  "title": "Physics Final Review",
  "kind": "final-review",
  "questions": 25
 },
 "phys-10-1-nuclear-fission": {
  "file": "10-1-nuclear-fission.html",
  "title": "10.1 Nuclear Fission",
  "kind": "lesson",
  "questions": 6
 },
 "phys-10-2-nuclear-fusion": {
  "file": "10-2-nuclear-fusion.html",
  "title": "10.2 Nuclear Fusion",
  "kind": "lesson",
  "questions": 7
 },
 "phys-3-1-momentum": {
  "file": "3-1-momentum.html",
  "title": "3.1 Momentum",
  "kind": "lesson",
  "questions": 6
 },
 "phys-3-2-impulse": {
  "file": "3-2-impulse.html",
  "title": "3.2 Impulse",
  "kind": "lesson",
  "questions": 6
 },
 "phys-3-3-how-helmets-affect-impulse": {
  "file": "3-3-how-helmets-affect-impulse.html",
  "title": "3.3 How Helmets Affect Impulse",
  "kind": "lesson",
  "questions": 7
 },
 "phys-3-4-conservation-of-momentum": {
  "file": "3-4-conservation-of-momentum.html",
  "title": "3.4 Conservation of Momentum",
  "kind": "lesson",
  "questions": 8
 },
 "phys-3-5-elastic-vs-inelastic-collisions": {
  "file": "3-5-elastic-vs-inelastic-collisions.html",
  "title": "3.5 Elastic vs. Inelastic Collisions",
  "kind": "lesson",
  "questions": 9
 },
 "phys-4-1-energy": {
  "file": "4-1-energy.html",
  "title": "4.1 Energy",
  "kind": "lesson",
  "questions": 7
 },
 "phys-4-2-forms-of-energy": {
  "file": "4-2-forms-of-energy.html",
  "title": "4.2 Forms of Energy",
  "kind": "lesson",
  "questions": 7
 },
 "phys-4-3-kinetic-vs-potential-energy": {
  "file": "4-3-kinetic-vs-potential-energy.html",
  "title": "4.3 Kinetic vs. Potential Energy",
  "kind": "lesson",
  "questions": 6
 },
 "phys-4-4-kinetic-energy-bowling": {
  "file": "4-4-kinetic-energy-bowling.html",
  "title": "4.4 Kinetic Energy & Bowling",
  "kind": "lesson",
  "questions": 6
 },
 "phys-4-5-gravitational-pe-dams": {
  "file": "4-5-gravitational-pe-dams.html",
  "title": "4.5 Gravitational PE & Dams",
  "kind": "lesson",
  "questions": 6
 },
 "phys-4-6-work-and-power": {
  "file": "4-6-work-and-power.html",
  "title": "4.6 Work and Power",
  "kind": "lesson",
  "questions": 6
 },
 "phys-4-7-calculating-ke-and-pe": {
  "file": "4-7-calculating-ke-and-pe.html",
  "title": "4.7 Calculating KE and PE",
  "kind": "lesson",
  "questions": 8
 },
 "phys-5-1-circular-motion": {
  "file": "5-1-circular-motion.html",
  "title": "5.1 Circular Motion",
  "kind": "lesson",
  "questions": 7
 },
 "phys-5-2-angular-velocity": {
  "file": "5-2-angular-velocity.html",
  "title": "5.2 Angular Velocity",
  "kind": "lesson",
  "questions": 7
 },
 "phys-5-3-centripetal-force-lab": {
  "file": "5-3-centripetal-force-lab.html",
  "title": "5.3 Centripetal Force Lab",
  "kind": "lesson",
  "questions": 6
 },
 "phys-5-4-the-law-of-gravitation": {
  "file": "5-4-the-law-of-gravitation.html",
  "title": "5.4 The Law of Gravitation",
  "kind": "lesson",
  "questions": 6
 },
 "phys-5-5-mass-vs-weight": {
  "file": "5-5-mass-vs-weight.html",
  "title": "5.5 Mass vs. Weight",
  "kind": "lesson",
  "questions": 6
 },
 "phys-6-1-waves": {
  "file": "6-1-waves.html",
  "title": "6.1 Waves",
  "kind": "lesson",
  "questions": 7
 },
 "phys-6-2-sound-waves": {
  "file": "6-2-sound-waves.html",
  "title": "6.2 Sound Waves",
  "kind": "lesson",
  "questions": 6
 },
 "phys-6-3-simple-harmonic-motion": {
  "file": "6-3-simple-harmonic-motion.html",
  "title": "6.3 Simple Harmonic Motion",
  "kind": "lesson",
  "questions": 8
 },
 "phys-6-4-simple-harmonic-motion-lab": {
  "file": "6-4-simple-harmonic-motion-lab.html",
  "title": "6.4 Simple Harmonic Motion Lab",
  "kind": "lesson",
  "questions": 5
 },
 "phys-6-5-wave-speed": {
  "file": "6-5-wave-speed.html",
  "title": "6.5 Wave Speed",
  "kind": "lesson",
  "questions": 7
 },
 "phys-7-1-visible-light": {
  "file": "7-1-visible-light.html",
  "title": "7.1 Visible Light",
  "kind": "lesson",
  "questions": 7
 },
 "phys-7-2-the-electromagnetic-spectrum": {
  "file": "7-2-the-electromagnetic-spectrum.html",
  "title": "7.2 The Electromagnetic Spectrum",
  "kind": "lesson",
  "questions": 9
 },
 "phys-7-3-digital-and-analog-information": {
  "file": "7-3-digital-and-analog-information.html",
  "title": "7.3 Digital and Analog Information",
  "kind": "lesson",
  "questions": 6
 },
 "phys-8-1-electricity": {
  "file": "8-1-electricity.html",
  "title": "8.1 Electricity",
  "kind": "lesson",
  "questions": 7
 },
 "phys-8-2-circuits": {
  "file": "8-2-circuits.html",
  "title": "8.2 Circuits",
  "kind": "lesson",
  "questions": 7
 },
 "phys-8-3-magnetism": {
  "file": "8-3-magnetism.html",
  "title": "8.3 Magnetism",
  "kind": "lesson",
  "questions": 8
 },
 "phys-8-4-electric-charge-and-coulombs-law": {
  "file": "8-4-electric-charge-and-coulomb-s-law.html",
  "title": "8.4 Electric Charge and Coulomb's Law",
  "kind": "lesson",
  "questions": 7
 },
 "phys-9-1-temperature": {
  "file": "9-1-temperature.html",
  "title": "9.1 Temperature",
  "kind": "lesson",
  "questions": 8
 },
 "phys-9-2-heat-transfer": {
  "file": "9-2-heat-transfer.html",
  "title": "9.2 Heat Transfer",
  "kind": "lesson",
  "questions": 7
 },
 "phys-9-3-specific-heat-capacity": {
  "file": "9-3-specific-heat-capacity.html",
  "title": "9.3 Specific Heat Capacity",
  "kind": "lesson",
  "questions": 6
 }
};


const CANVAS = {
  iss: 'https://canvas.instructure.com',
  authorize: 'https://sso.canvaslms.com/api/lti/authorize_redirect',
  token: 'https://sso.canvaslms.com/login/oauth2/token',
  jwks: 'https://sso.canvaslms.com/api/lti/security/jwks',
};
const DECK_BASE = 'https://mightyblearning-mbl.github.io/mightyb-activites/activities/';
const DECK_ORIGIN = 'https://mightyblearning-mbl.github.io';
const AGS_SCORE = 'https://purl.imsglobal.org/spec/lti-ags/scope/score';
const C = {
  msg: 'https://purl.imsglobal.org/spec/lti/claim/message_type',
  ver: 'https://purl.imsglobal.org/spec/lti/claim/version',
  dep: 'https://purl.imsglobal.org/spec/lti/claim/deployment_id',
  ctx: 'https://purl.imsglobal.org/spec/lti/claim/context',
  rl: 'https://purl.imsglobal.org/spec/lti/claim/resource_link',
  roles: 'https://purl.imsglobal.org/spec/lti/claim/roles',
  custom: 'https://purl.imsglobal.org/spec/lti/claim/custom',
  ags: 'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint',
  dl: 'https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings',
  dlData: 'https://purl.imsglobal.org/spec/lti-dl/claim/data',
};

// ---------- small helpers ----------
const enc = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uStr = s => b64u(enc.encode(s));
const unb64u = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
const jparse = s => JSON.parse(new TextDecoder().decode(unb64u(s)));
const now = () => Math.floor(Date.now() / 1000);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...extra } });
const html = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': `frame-ancestors https://*.instructure.com https://*.canvaslms.com; frame-src ${DECK_ORIGIN}` } });
const err = (msg, status = 400) => html(page('Something went wrong', `<p>${esc(msg)}</p><p>Please close this and open the practice again from Canvas.</p>`), status);

async function hmacKey(secret) { return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
async function signHS(payload, secret) {
  const head = b64uStr(JSON.stringify({ alg: 'HS256', typ: 'JWT' })), body = b64uStr(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(head + '.' + body));
  return head + '.' + body + '.' + b64u(sig);
}
async function verifyHS(token, secret) {
  const [h, b, s] = String(token || '').split('.'); if (!s) return null;
  const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), unb64u(s), enc.encode(h + '.' + b));
  if (!ok) return null; const p = jparse(b); if (p.exp && p.exp < now()) return null; return p;
}
async function toolKey(env) {
  const jwk = JSON.parse(env.TOOL_PRIVATE_JWK);
  return { jwk, key: await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']) };
}
async function signRS(payload, env) {
  const { jwk, key } = await toolKey(env);
  const head = b64uStr(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: jwk.kid })), body = b64uStr(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(head + '.' + body));
  return head + '.' + body + '.' + b64u(sig);
}
let jwksCache = { at: 0, keys: [] };
async function canvasKey(kid) {
  if (!jwksCache.keys.find(k => k.kid === kid) || Date.now() - jwksCache.at > 3600e3) {
    const r = await fetch(CANVAS.jwks); jwksCache = { at: Date.now(), keys: (await r.json()).keys || [] };
  }
  const jwk = jwksCache.keys.find(k => k.kid === kid); if (!jwk) throw new Error('Unknown Canvas signing key');
  return crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
}
async function verifyCanvasIdToken(token, env) {
  const [h, b, s] = String(token || '').split('.'); if (!s) throw new Error('Missing launch token');
  const head = jparse(h); if (head.alg !== 'RS256') throw new Error('Bad token algorithm');
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', await canvasKey(head.kid), unb64u(s), enc.encode(h + '.' + b));
  if (!ok) throw new Error('Launch signature did not verify');
  const p = jparse(b);
  if (p.iss !== CANVAS.iss) throw new Error('Wrong issuer');
  const aud = Array.isArray(p.aud) ? p.aud : [p.aud];
  if (!aud.includes(env.LTI_CLIENT_ID)) throw new Error('Wrong audience');
  if (!p.exp || p.exp < now() - 60) throw new Error('Launch expired');
  if (env.LTI_DEPLOYMENT_ID && p[C.dep] !== env.LTI_DEPLOYMENT_ID) throw new Error('Unknown deployment');
  return p;
}

// ---------- Supabase (service role, server side only) ----------
async function sb(env, path, opts = {}) {
  const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + path, {
    ...opts, headers: { apikey: env.SUPABASE_SERVICE_KEY, authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY, 'content-type': 'application/json', ...(opts.headers || {}) },
  });
  const text = await r.text();
  if (!r.ok) throw new Error('Database ' + r.status + ': ' + text.slice(0, 200));
  return text ? JSON.parse(text) : null;
}

// ---------- Canvas AGS ----------
let agsToken = { exp: 0, tok: '' };
async function agsAccessToken(env) {
  if (agsToken.exp > now() + 60) return agsToken.tok;
  const assertion = await signRS({ iss: env.LTI_CLIENT_ID, sub: env.LTI_CLIENT_ID, aud: CANVAS.token, iat: now(), exp: now() + 300, jti: crypto.randomUUID() }, env);
  const r = await fetch(CANVAS.token, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer', client_assertion: assertion, scope: AGS_SCORE }),
  });
  const j = await r.json(); if (!r.ok) throw new Error('Canvas token ' + r.status + ': ' + JSON.stringify(j).slice(0, 200));
  agsToken = { tok: j.access_token, exp: now() + (j.expires_in || 3600) }; return agsToken.tok;
}
async function postScore(env, lineitem, userSub, given, max) {
  const url = lineitem.split('?')[0].replace(/\/$/, '') + '/scores' + (lineitem.includes('?') ? '?' + lineitem.split('?')[1] : '');
  const r = await fetch(url, {
    method: 'POST', headers: { authorization: 'Bearer ' + await agsAccessToken(env), 'content-type': 'application/vnd.ims.lis.v1.score+json' },
    body: JSON.stringify({ userId: userSub, scoreGiven: given, scoreMaximum: max, activityProgress: 'Completed', gradingProgress: 'FullyGraded', timestamp: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error('Canvas score ' + r.status + ': ' + (await r.text()).slice(0, 200));
}

// Post only if this attempt beats the best score already sent (Canvas keeps the last score it gets).
async function passback(env, s, a) {
  if (!s.lineitem) return { status: 'no_lineitem' };
  if (s.instructor) return { status: 'instructor' };
  const ratio = a.score_maximum ? a.score_given / a.score_maximum : 0;
  const best = (await sb(env, `deck_best_scores?lti_user_sub=eq.${encodeURIComponent(s.sub)}&lineitem_url=eq.${encodeURIComponent(s.lineitem)}&select=best_ratio`))[0];
  if (best && ratio <= Number(best.best_ratio)) return { status: 'not_higher' };
  await postScore(env, s.lineitem, s.sub, a.score_given, a.score_maximum);
  await sb(env, 'deck_best_scores?on_conflict=lti_user_sub,lineitem_url', {
    method: 'POST', headers: { prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ lti_user_sub: s.sub, lineitem_url: s.lineitem, deck_id: a.deck_id, canvas_user_id: s.cuid, canvas_course_id: s.ccid,
      best_ratio: ratio, best_score_given: a.score_given, best_score_maximum: a.score_maximum, best_attempt_id: a.attempt_id, sent_at: new Date().toISOString() }),
  });
  return { status: 'sent' };
}

// ---------- deck checks ----------
const deckCache = new Map();
async function deckData(deckId) {
  if (deckCache.has(deckId)) return deckCache.get(deckId);
  const meta = DECKS[deckId]; if (!meta) throw new Error('Unknown deck');
  const t = await (await fetch(DECK_BASE + meta.file, { cf: { cacheTtl: 300 } })).text();
  const m = t.match(/<script type="application\/json" id="mb-deck">([\s\S]*?)<\/script>/);
  const d = JSON.parse(m[1]); deckCache.set(deckId, d); return d;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function checkResult(r, s) {
  if (!r || r.formatVersion !== 1) throw new Error('Unsupported result format');
  if (r.deckId !== s.deck) throw new Error('Result is for a different deck');
  if (!UUID.test(r.attemptId || '')) throw new Error('Bad attemptId');
  const d = await deckData(r.deckId);
  const n = d.problems.length;
  if (r.scoreMaximum !== n || !Number.isInteger(r.scoreGiven) || r.scoreGiven < 0 || r.scoreGiven > n) throw new Error('Score out of range');
  if (!Array.isArray(r.items) || r.items.length !== n) throw new Error('Items do not match the deck');
  const ids = new Set(d.problems.map(p => p.id));
  if (r.items.some(i => !ids.has(i.id))) throw new Error('Unknown question id');
  if (r.items.filter(i => i.firstTryCorrect === true).length !== r.scoreGiven) throw new Error('Score does not match items');
  const mastered = r.scoreGiven / n >= (d.masteryThreshold ?? 0.85);
  const ts = x => (x && !isNaN(Date.parse(x))) ? new Date(x).toISOString() : null;
  return { started_at: ts(r.startedAt), completed_at: ts(r.completedAt), mastered, n };
}

// ---------- pages ----------
function page(title, body, extraHead = '') {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>:root{--bg:#0f2540;--text:#eef4fb;--soft:#b9cde3;--accent:#5fb3a3}html,body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,Helvetica,sans-serif}
main{max-width:720px;margin:0 auto;padding:24px 16px}a,button{font:inherit}.deck{display:block;width:100%;text-align:left;background:#16345c;color:var(--text);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:12px 14px;margin:6px 0;cursor:pointer}
.deck:hover,.deck:focus-visible{outline:3px solid #ffd166}.muted{color:var(--soft)}</style>${extraHead}</head><body>${body}</body></html>`;
}

function hostPage(s, token, deckTitle) {
  const src = DECK_BASE + DECKS[s.deck].file;
  const cfg = JSON.stringify({ token, deckId: s.deck, uh: s.uh, deckOrigin: DECK_ORIGIN, teacher: !!s.instructor, graded: !!s.lineitem }).replace(/</g, '\\u003c');
  return page(deckTitle, `
<div id="status" role="status" aria-live="polite" style="font-size:15px;padding:8px 14px;background:#16345c;color:#eef4fb;border-bottom:1px solid rgba(255,255,255,.12)"></div>
<iframe id="deck" title="${esc(deckTitle)} practice" src="${esc(src)}" style="display:block;border:0;width:100%;height:calc(100vh - 38px);min-height:640px" allow="fullscreen"></iframe>
<script>
const CFG=${cfg};
const st=document.getElementById('status');
const say=t=>{st.textContent=t;};
say(CFG.teacher?'Teacher preview: scores are not sent to Canvas.':(CFG.graded?'Your first-try score is saved to Canvas when you finish. Canvas keeps your best score.':'Practice only - this link is not connected to a Canvas grade.'));
try{parent.postMessage({subject:'lti.frameResize',height:900},'*');}catch(e){}
const KEY='mb-pending-'+CFG.uh;
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
const save=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}};
async function send(result){
  const r=await fetch('/api/result',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+CFG.token},body:JSON.stringify(result)});
  const j=await r.json().catch(()=>({}));
  if(r.status===401) throw Object.assign(new Error('expired'),{keep:true});
  if(!r.ok && r.status>=500) throw Object.assign(new Error('server'),{keep:true});
  return j;
}
async function flush(){
  const q=load(); if(!q.length) return; const left=[]; let expired=false;
  for(const item of q){
    if(item.deckId!==CFG.deckId){left.push(item);continue;}
    try{const j=await send(item); report(j);}catch(e){left.push(item); if(e.message==='expired') expired=true;}
  }
  save(left);
  if(expired) return say('Saved on this device. Please open this practice again from Canvas so we can send your score.');
  if(left.some(i=>i.deckId===CFG.deckId)) { say('Saved. Sending to Canvas... (we will keep trying)'); setTimeout(flush,15000); }
}
function report(j){
  if(CFG.teacher) return say('Teacher preview: finished. Scores are not sent for teachers.');
  if(j.passback==='sent') say('✓ Saved. Your score of '+j.scoreGiven+' out of '+j.scoreMaximum+' was sent to Canvas.');
  else if(j.passback==='not_higher') say('✓ Saved. Your best score so far is already in Canvas.');
  else if(j.passback==='pending') say('Saved. Sending to Canvas... (we will keep trying)');
  else if(j.passback==='no_lineitem') say('✓ Saved. This practice is not connected to a Canvas grade.');
  else if(j.duplicate) say('✓ Already saved.');
  else if(j.error) say('Saved on this device. Please open this practice again from Canvas so we can send your score.');
}
window.addEventListener('message',async e=>{
  if(e.origin!==CFG.deckOrigin||e.source!==document.getElementById('deck').contentWindow) return;
  const m=e.data; if(!m||m.type!=='mb-deck-complete'||!m.result||m.result.deckId!==CFG.deckId) return;
  say('Saved. Sending to Canvas...');
  const q=load(); if(!q.some(x=>x.attemptId===m.result.attemptId)){q.push(m.result);save(q);}
  flush();
});
flush();
</script>`);
}

function pickerPage(token, decks) {
  const rows = Object.entries(DECKS).map(([id, d]) => `<button class="deck" name="deck" value="${esc(id)}"><strong>${esc(d.title)}</strong> <span class="muted">· ${d.questions} questions · ${esc(id)}</span></button>`).join('');
  return page('Choose a practice deck', `<main><h1 style="font-size:22px">Choose a Mighty B practice deck</h1>
<p class="muted">The deck becomes a graded assignment. Students' first-try scores are sent to the gradebook, and Canvas keeps each student's best score.</p>
<form method="post" action="/lti/deeplink"><input type="hidden" name="t" value="${esc(token)}">${rows}</form></main>`);
}

// ---------- routes ----------
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p === '/.well-known/jwks.json') {
        const { jwk } = await toolKey(env);
        return json({ keys: [{ kty: jwk.kty, n: jwk.n, e: jwk.e, kid: jwk.kid, alg: 'RS256', use: 'sig' }] });
      }
      if (p === '/lti/config.json') return json(devKeyConfig(url.origin));
      if (p === '/lti/login') {
        const f = req.method === 'POST' ? Object.fromEntries(await req.formData()) : Object.fromEntries(url.searchParams);
        if (f.iss !== CANVAS.iss) return err('This tool only works with Canvas.');
        if (f.client_id && f.client_id !== env.LTI_CLIENT_ID) return err('Unknown tool.');
        const nonce = crypto.randomUUID();
        const state = await signHS({ n: nonce, exp: now() + 600 }, env.SESSION_SECRET);
        const q = new URLSearchParams({ scope: 'openid', response_type: 'id_token', response_mode: 'form_post', prompt: 'none',
          client_id: env.LTI_CLIENT_ID, redirect_uri: url.origin + '/lti/launch', login_hint: f.login_hint, state, nonce });
        if (f.lti_message_hint) q.set('lti_message_hint', f.lti_message_hint);
        return Response.redirect(CANVAS.authorize + '?' + q, 302);
      }
      if (p === '/lti/launch' && req.method === 'POST') {
        const f = Object.fromEntries(await req.formData());
        const st = await verifyHS(f.state, env.SESSION_SECRET); if (!st) return err('This launch expired. Please try again.');
        const t = await verifyCanvasIdToken(f.id_token, env);
        if (t.nonce !== st.n) return err('Launch check failed.');
        const roles = (t[C.roles] || []).join(' ');
        const instructor = /Instructor|Administrator|ContentDeveloper|TeachingAssistant/.test(roles) && !/#Learner|membership#Learner/.test(roles);
        if (t[C.msg] === 'LtiDeepLinkingRequest') {
          const tok = await signHS({ dl: t[C.dl], dep: t[C.dep], exp: now() + 1800 }, env.SESSION_SECRET);
          return html(pickerPage(tok));
        }
        if (t[C.msg] !== 'LtiResourceLinkRequest') return err('Unsupported launch type.');
        const custom = t[C.custom] || {};
        let tl = null; try { tl = new URL(t['https://purl.imsglobal.org/spec/lti/claim/target_link_uri']).searchParams.get('deck'); } catch (e) {}
        const deck = custom.deck_id || tl;
        if (!deck || !DECKS[deck]) return err('This assignment is not linked to a practice deck yet.');
        const s = {
          sub: t.sub, deck, instructor, lineitem: (t[C.ags] || {}).lineitem || null,
          cuid: String(custom.canvas_user_id || ''), ccid: String(custom.canvas_course_id || (t[C.ctx] || {}).id || ''),
          ctx: (t[C.ctx] || {}).id || '', rl: (t[C.rl] || {}).id || '', dep: t[C.dep],
          uh: b64u(await crypto.subtle.digest('SHA-256', enc.encode(t.sub + '|' + env.SESSION_SECRET))).slice(0, 16),
          exp: now() + 6 * 3600,
        };
        const token = await signHS(s, env.SESSION_SECRET);
        return html(hostPage(s, token, DECKS[deck].title));
      }
      if (p === '/lti/deeplink' && req.method === 'POST') {
        const f = Object.fromEntries(await req.formData());
        const s = await verifyHS(f.t, env.SESSION_SECRET); if (!s) return err('The deck picker expired. Please open it again.');
        const d = DECKS[f.deck]; if (!d) return err('Unknown deck.');
        const item = { type: 'ltiResourceLink', title: d.title + ' Practice', url: url.origin + '/lti/launch',
          custom: { deck_id: f.deck } };
        if (d.kind !== 'mini-review') item.lineItem = { scoreMaximum: 100, label: d.title + ' Practice', resourceId: f.deck }; // mini-reviews stay ungraded (spec)
        const jwt = await signRS({ iss: env.LTI_CLIENT_ID, aud: CANVAS.iss, iat: now(), exp: now() + 300, nonce: crypto.randomUUID(),
          [C.msg]: 'LtiDeepLinkingResponse', [C.ver]: '1.3.0', [C.dep]: s.dep,
          'https://purl.imsglobal.org/spec/lti-dl/claim/content_items': [item],
          ...(s.dl.data ? { [C.dlData]: s.dl.data } : {}) }, env);
        return html(page('Adding deck', `<form id="f" method="post" action="${esc(s.dl.deep_link_return_url)}"><input type="hidden" name="JWT" value="${esc(jwt)}"></form><script>document.getElementById('f').submit()</script>`));
      }
      if (p === '/api/result' && req.method === 'POST') {
        const s = await verifyHS((req.headers.get('authorization') || '').replace(/^Bearer /, ''), env.SESSION_SECRET);
        if (!s) return json({ error: 'session expired' }, 401);
        const r = await req.json();
        let chk; try { chk = await checkResult(r, s); } catch (e) { return json({ error: e.message }, 400); }
        const row = { attempt_id: r.attemptId, deck_id: r.deckId, lti_user_sub: s.sub, canvas_user_id: s.cuid || null, canvas_course_id: s.ccid || null,
          context_id: s.ctx, resource_link_id: s.rl, lineitem_url: s.lineitem, score_given: r.scoreGiven, score_maximum: r.scoreMaximum,
          mastered: chk.mastered, items: r.items, started_at: chk.started_at, completed_at: chk.completed_at, is_instructor: !!s.instructor, passback_status: 'pending' };
        const ins = await sb(env, 'deck_attempts?on_conflict=attempt_id', { method: 'POST', headers: { prefer: 'resolution=ignore-duplicates,return=representation' }, body: JSON.stringify(row) });
        if (!ins || !ins.length) return json({ duplicate: true });
        let out;
        try { out = await passback(env, s, row); } catch (e) { out = { status: 'pending', error: e.message }; }
        await sb(env, `deck_attempts?attempt_id=eq.${r.attemptId}`, { method: 'PATCH', body: JSON.stringify({ passback_status: out.status, passback_error: out.error || null, session: out.status === 'pending' ? s : null }) });
        return json({ saved: true, passback: out.status, scoreGiven: r.scoreGiven, scoreMaximum: r.scoreMaximum, mastered: chk.mastered });
      }
      if (p === '/') return html(page('Mighty B Practice', '<main><h1>Mighty B Practice</h1><p class="muted">This service connects Mighty B practice decks to Canvas. Open a deck from its Canvas assignment.</p></main>'));
      return new Response('Not found', { status: 404 });
    } catch (e) {
      return p.startsWith('/api/') ? json({ error: e.message }, 500) : err(e.message, 500);
    }
  },
  // Retry scores that could not reach Canvas (runs every 15 minutes).
  async scheduled(ev, env) {
    const rows = await sb(env, 'deck_attempts?passback_status=eq.pending&select=attempt_id,deck_id,score_given,score_maximum,session&order=received_at.asc&limit=50');
    for (const a of rows) {
      if (!a.session) continue;
      let out; try { out = await passback(env, a.session, a); } catch (e) { out = { status: 'pending', error: e.message }; }
      await sb(env, `deck_attempts?attempt_id=eq.${a.attempt_id}`, { method: 'PATCH', body: JSON.stringify({ passback_status: out.status, passback_error: out.error || null, session: out.status === 'pending' ? a.session : null }) });
    }
  },
};

function devKeyConfig(origin) {
  const host = new URL(origin).host;
  return {
    title: 'Mighty B Practice',
    description: 'Mighty B practice decks with automatic grade passback',
    oidc_initiation_url: origin + '/lti/login',
    target_link_uri: origin + '/lti/launch',
    public_jwk_url: origin + '/.well-known/jwks.json',
    scopes: ['https://purl.imsglobal.org/spec/lti-ags/scope/score'],
    custom_fields: { canvas_user_id: '$Canvas.user.id', canvas_course_id: '$Canvas.course.id' },
    extensions: [{
      domain: host, tool_id: 'mighty-b-practice', platform: 'canvas.instructure.com', privacy_level: 'anonymous',
      settings: { text: 'Mighty B Practice', placements: [
        { placement: 'assignment_selection', message_type: 'LtiDeepLinkingRequest', target_link_uri: origin + '/lti/launch' },
        { placement: 'link_selection', message_type: 'LtiDeepLinkingRequest', target_link_uri: origin + '/lti/launch' },
      ] },
    }],
  };
}
