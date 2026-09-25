// Local end-to-end test with a fake Canvas + fake Supabase.
import fs from 'fs';
import worker from '../src/index.js';
const { subtle } = globalThis.crypto;
const b64u = b => Buffer.from(b).toString('base64url');
const enc = new TextEncoder();

const toolKP = await subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const toolJwk = { ...(await subtle.exportKey('jwk', toolKP.privateKey)), kid: 'tool1' };
const canvasKP = await subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const canvasPub = { ...(await subtle.exportKey('jwk', canvasKP.publicKey)), kid: 'cv1' };
const env = { LTI_CLIENT_ID: '10000000000123', SESSION_SECRET: 'test-secret-123456', TOOL_PRIVATE_JWK: JSON.stringify(toolJwk), SUPABASE_URL: 'https://sb.test', SUPABASE_SERVICE_KEY: 'svc' };

const db = { deck_attempts: [], deck_best_scores: [] };
const scoresPosted = [];
let canvasDown = false;
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  const u = new URL(url);
  if (url === 'https://sso.canvaslms.com/api/lti/security/jwks') return Response.json({ keys: [canvasPub] });
  if (url === 'https://sso.canvaslms.com/login/oauth2/token') return Response.json({ access_token: 'ags-tok', expires_in: 3600 });
  if (u.pathname.endsWith('/scores')) { if (canvasDown) return new Response('down', { status: 503 }); scoresPosted.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); }
  if (u.host === 'mightyblearning-mbl.github.io') return new Response(fs.readFileSync('/tmp/mbv1/activities/' + u.pathname.split('/').pop(), 'utf8'));
  if (u.host === 'sb.test') {
    const table = u.pathname.split('/').pop(); const rows = db[table];
    const filt = [...u.searchParams].filter(([k]) => !['select', 'order', 'limit', 'on_conflict'].includes(k)).map(([k, v]) => [k, v.replace(/^eq\./, '')]);
    const match = r => filt.every(([k, v]) => String(r[k]) === v);
    const m = init.method || 'GET';
    if (m === 'GET') return Response.json(rows.filter(match));
    if (m === 'PATCH') { rows.filter(match).forEach(r => Object.assign(r, JSON.parse(init.body))); return new Response(''); }
    if (m === 'POST') {
      const row = JSON.parse(init.body); const keys = u.searchParams.get('on_conflict').split(',');
      const ex = rows.find(r => keys.every(k => r[k] === row[k]));
      if (ex) { if (init.headers.prefer.includes('merge')) Object.assign(ex, row); return Response.json(init.headers.prefer.includes('ignore') ? [] : [ex]); }
      rows.push(row); return Response.json([row]);
    }
  }
  throw new Error('unexpected fetch ' + url);
};
async function canvasSign(payload) {
  const h = b64u(JSON.stringify({ alg: 'RS256', kid: 'cv1' })), b = b64u(JSON.stringify(payload));
  return h + '.' + b + '.' + b64u(await subtle.sign('RSASSA-PKCS1-v1_5', canvasKP.privateKey, enc.encode(h + '.' + b)));
}
const ORIGIN = 'https://mb-practice.mightyblearning.workers.dev';
const call = (path, init) => worker.fetch(new Request(ORIGIN + path, init), env);
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };

async function launch({ sub = 'user-A', deck = 'phys-3-1-momentum', roles = ['http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'], type = 'LtiResourceLinkRequest', extra = {} } = {}) {
  const lr = await call('/lti/login', { method: 'POST', body: new URLSearchParams({ iss: 'https://canvas.instructure.com', login_hint: 'x', client_id: env.LTI_CLIENT_ID, target_link_uri: ORIGIN + '/lti/launch' }) });
  const loc = new URL(lr.headers.get('location')); const state = loc.searchParams.get('state'), nonce = loc.searchParams.get('nonce');
  const now = Math.floor(Date.now() / 1000);
  const idt = await canvasSign({ iss: 'https://canvas.instructure.com', aud: env.LTI_CLIENT_ID, sub, iat: now, exp: now + 300, nonce,
    'https://purl.imsglobal.org/spec/lti/claim/message_type': type, 'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
    'https://purl.imsglobal.org/spec/lti/claim/deployment_id': 'dep1', 'https://purl.imsglobal.org/spec/lti/claim/roles': roles,
    'https://purl.imsglobal.org/spec/lti/claim/context': { id: 'ctx1' }, 'https://purl.imsglobal.org/spec/lti/claim/resource_link': { id: 'rl1' },
    'https://purl.imsglobal.org/spec/lti/claim/custom': { deck_id: deck, canvas_user_id: '77', canvas_course_id: '35' },
    'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint': { lineitem: 'https://mightyblearning.instructure.com/api/lti/courses/35/line_items/9', scope: [] }, ...extra });
  const r = await call('/lti/launch', { method: 'POST', body: new URLSearchParams({ id_token: idt, state }) });
  return { r, text: await r.text() };
}
const tokenOf = t => JSON.parse(t.match(/const CFG=(\{.*?\});/)[1].replace(/\\u003c/g, '<')).token;
function result(given, n = 6, id = crypto.randomUUID(), deckId = 'phys-3-1-momentum') {
  return { formatVersion: 1, deckId, attemptId: id, startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), scoreGiven: given, scoreMaximum: n, mastered: given / n >= .85,
    items: Array.from({ length: n }, (_, i) => ({ id: 'q' + String(i + 1).padStart(2, '0'), firstTryCorrect: i < given, tries: i < given ? 1 : 2 })) };
}
const post = (tok, body) => call('/api/result', { method: 'POST', headers: { authorization: 'Bearer ' + tok, 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(async r => ({ status: r.status, j: await r.json() }));

// jwks + config
const jw = await (await call('/.well-known/jwks.json')).json(); ok(jw.keys[0].kid === 'tool1' && !jw.keys[0].d, 'JWKS publishes only the public key');
const cfg = await (await call('/lti/config.json')).json(); ok(cfg.target_link_uri === ORIGIN + '/lti/launch', 'developer key config served');

// student launch
const L = await launch(); ok(L.r.status === 200 && L.text.includes('3-1-momentum.html'), 'student launch opens the 3.1 deck');
const tok = tokenOf(L.text);
let x = await post(tok, result(4)); ok(x.j.passback === 'sent' && scoresPosted.at(-1).scoreGiven === 4 && scoresPosted.at(-1).userId === 'user-A', 'first attempt 4/6 posted to Canvas');
ok(db.deck_attempts[0].items.length === 6 && db.deck_attempts[0].canvas_course_id === '35', 'attempt saved with per-question items');
x = await post(tok, result(3)); ok(x.j.passback === 'not_higher' && scoresPosted.length === 1, 'lower score 3/6 saved but NOT posted');
x = await post(tok, result(4)); ok(x.j.passback === 'not_higher' && scoresPosted.length === 1, 'equal score not re-posted');
const id6 = crypto.randomUUID();
x = await post(tok, result(6, 6, id6)); ok(x.j.passback === 'sent' && scoresPosted.at(-1).scoreGiven === 6 && x.j.mastered, 'higher score 6/6 posted, mastered');
x = await post(tok, result(6, 6, id6)); ok(x.j.duplicate === true && scoresPosted.length === 2, 'repeated attemptId ignored');
x = await post(tok, result(5, 6, undefined, 'phys-3-2-impulse')); ok(x.status === 400, 'result for a different deck rejected');
const bad = result(5); bad.scoreGiven = 6; x = await post(tok, bad); ok(x.status === 400, 'score not matching items rejected');
x = await post(tok, result(7, 7)); ok(x.status === 400, 'wrong question count rejected');
x = await post('forged.token.here', result(6)); ok(x.status === 401, 'forged session rejected');
ok(db.deck_attempts.length === 4, 'every valid attempt saved (4 rows)');

// student B gets their own best
const LB = await launch({ sub: 'user-B' }); x = await post(tokenOf(LB.text), result(2)); ok(x.j.passback === 'sent' && scoresPosted.at(-1).userId === 'user-B', 'second student posted separately');

// Canvas down -> pending -> cron retry
canvasDown = true; const LC = await launch({ sub: 'user-C' }); x = await post(tokenOf(LC.text), result(5));
ok(x.j.passback === 'pending', 'Canvas outage: saved as pending');
canvasDown = false; await worker.scheduled({}, env);
ok(db.deck_attempts.find(a => a.lti_user_sub === 'user-C').passback_status === 'sent' && scoresPosted.at(-1).userId === 'user-C', 'scheduled retry sent the pending score');

// teacher
const LT = await launch({ sub: 'teacher', roles: ['http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor'] });
ok(LT.text.includes('Teacher preview'), 'teacher launch shows preview note');
x = await post(tokenOf(LT.text), result(6)); ok(x.j.passback === 'instructor', 'teacher score not posted');

// bad signature
const now = Math.floor(Date.now() / 1000);
const lr = await call('/lti/login', { method: 'POST', body: new URLSearchParams({ iss: 'https://canvas.instructure.com', login_hint: 'x', client_id: env.LTI_CLIENT_ID }) });
const st = new URL(lr.headers.get('location')).searchParams.get('state');
const fake = await canvasSign({ iss: 'https://canvas.instructure.com', aud: env.LTI_CLIENT_ID, sub: 'evil', exp: now + 300, nonce: 'wrong' });
const rb = await call('/lti/launch', { method: 'POST', body: new URLSearchParams({ id_token: fake, state: st }) }); ok(rb.status === 400, 'nonce mismatch rejected');

// deep linking
const DL = await launch({ type: 'LtiDeepLinkingRequest', roles: ['http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor'], extra: { 'https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings': { deep_link_return_url: 'https://mightyblearning.instructure.com/courses/35/deep_linking_response', data: 'abc' } } });
ok(DL.text.includes('phys-final-review'), 'deck picker lists decks');
const t = DL.text.match(/name="t" value="([^"]+)"/)[1];
const dr = await (await call('/lti/deeplink', { method: 'POST', body: new URLSearchParams({ t, deck: 'phys-4-6-work-and-power' }) })).text();
const jwt = dr.match(/name="JWT" value="([^"]+)"/)[1]; const pl = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url'));
const item = pl['https://purl.imsglobal.org/spec/lti-dl/claim/content_items'][0];
ok(item.custom.deck_id === 'phys-4-6-work-and-power' && item.lineItem.scoreMaximum === 100 && pl['https://purl.imsglobal.org/spec/lti-dl/claim/data'] === 'abc', 'deep link returns graded deck assignment');
const vk = await subtle.importKey('jwk', { kty: 'RSA', n: jw.keys[0].n, e: jw.keys[0].e }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
ok(await subtle.verify('RSASSA-PKCS1-v1_5', vk, Buffer.from(jwt.split('.')[2], 'base64url'), enc.encode(jwt.split('.').slice(0, 2).join('.'))), 'deep link JWT verifies with published JWKS');
fs.writeFileSync('/tmp/mbv1/lti/test/host.html', L.text);
const LQ = await launch({ deck: '', extra: { 'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': ORIGIN + '/lti/launch?deck=phys-5-2-angular-velocity' } });
ok(LQ.text.includes('5-2-angular-velocity.html'), 'assignment URL ?deck= works (for API-created assignments)');
