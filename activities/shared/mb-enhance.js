/* Mighty B Practice - game layer (optional; Format v1 + optional "theme").
   Adds: unit themes, sound effects with mute, streak pops, mastery celebration,
   Boss Level styling for unit/final reviews, and a Calm mode. Never changes scoring or the result object. */
(function () {
  const THEMES = {
    maycomb:   { label: 'Maycomb',   bg: 'linear-gradient(160deg,#2b1d14 0%,#4a2f1b 55%,#6b4423 100%)', card: '#3b2718', alt: '#533622', accent: '#e8a33d', strong: '#c7832a', text: '#fbf1e4', soft: '#e3cdb2', motif: 'leaves' },
    rome:      { label: 'Rome',      bg: 'linear-gradient(160deg,#2a0f14 0%,#4b1620 60%,#6d1f2b 100%)', card: '#3a141b', alt: '#521c26', accent: '#e6c15a', strong: '#c9a23a', text: '#fbf3e6', soft: '#e7cfc0', motif: 'laurel' },
    courtroom: { label: 'Courtroom', bg: 'linear-gradient(160deg,#1a1a22 0%,#2a2a36 60%,#3a3446 100%)', card: '#262632', alt: '#343442', accent: '#d9b36c', strong: '#b8924d', text: '#f3f1ea', soft: '#cfcbd9', motif: 'scales' },
    sea:       { label: 'The Sea',   bg: 'linear-gradient(180deg,#07324a 0%,#0b4d6b 55%,#136a86 100%)', card: '#0b3b55', alt: '#12506f', accent: '#ffcc66', strong: '#e5ae3f', text: '#eef8fc', soft: '#b9dbe8', motif: 'waves' },
    frontier:  { label: 'Frontier',  bg: 'linear-gradient(160deg,#1f2a22 0%,#2e3f30 60%,#445a3f 100%)', card: '#28372b', alt: '#35493a', accent: '#f0b35b', strong: '#d3953d', text: '#f4f1e8', soft: '#cfd8c6', motif: 'stars' },
    poetry:    { label: 'Poetry',    bg: 'linear-gradient(160deg,#1d1633 0%,#2e2150 60%,#442e6e 100%)', card: '#271d43', alt: '#35285a', accent: '#f2a7c3', strong: '#d985a6', text: '#f7f2fb', soft: '#d6cbe8', motif: 'stars' },
    liberty:   { label: 'Liberty',   bg: 'linear-gradient(160deg,#10223d 0%,#1a3561 60%,#274a80 100%)', card: '#172c4f', alt: '#213b66', accent: '#e4574c', strong: '#c43f35', text: '#f5f7fb', soft: '#c7d3e8', motif: 'stars' },
    launch:    { label: 'Launch Pad', bg: 'linear-gradient(160deg,#0e1f33 0%,#143a52 60%,#1b5a6b 100%)', card: '#12304a', alt: '#1a4260', accent: '#ffd166', strong: '#e6b440', text: '#f1f7fb', soft: '#c3d9e6', motif: 'stars' },
    grammar:   { label: 'Grammar Lab', bg: 'linear-gradient(160deg,#0f2b2b 0%,#154040 60%,#1d5756 100%)', card: '#133737', alt: '#1b4a4a', accent: '#8fe3c8', strong: '#5fc4a6', text: '#effaf6', soft: '#bfe2d8', motif: 'dots' },
  };
  const root = document.documentElement;
  const theme = THEMES[DECK.theme];
  const boss = DECK.kind === 'unit-review' || DECK.kind === 'final-review';
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return localStorage.getItem('mb-' + k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem('mb-' + k, v); } catch (e) {} } };
  let muted = store.get('muted') === '1';
  let calm = store.get('calm') === '1';

  // ---------- styles ----------
  const css = document.createElement('style');
  css.textContent = `
  body.themed { background: ${theme ? theme.bg : 'var(--bg)'}; background-attachment: fixed; }
  .motif { position: fixed; inset: 0; pointer-events: none; opacity: .12; z-index: 0; }
  .wrap { position: relative; z-index: 1; }
  .theme-chip { display:inline-block; margin-left:8px; font-size:.75rem; padding:2px 8px; border-radius:999px; background: var(--accent); color:#1b1b1b; font-weight:bold; vertical-align:middle; }
  .boss-banner { display:flex; align-items:center; gap:10px; margin:0 0 14px; padding:10px 14px; border-radius:12px; background: linear-gradient(90deg, var(--accent), var(--accent-strong)); color:#1b1b1b; font-weight:bold; }
  .boss-banner small { font-weight:normal; }
  body.boss .card { box-shadow: 0 0 0 2px var(--accent), 0 10px 30px rgba(0,0,0,.45); }
  .pop { animation: pop .45s ease; } @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.06)} 100%{transform:scale(1)} }
  .streak-toast { position:fixed; left:50%; top:18px; transform:translateX(-50%); background:var(--accent); color:#1b1b1b; font-weight:bold; padding:8px 16px; border-radius:999px; box-shadow:0 6px 18px rgba(0,0,0,.35); z-index:10; animation: toast 1.6s ease forwards; }
  @keyframes toast { 0%{opacity:0; transform:translate(-50%,-8px)} 15%{opacity:1; transform:translate(-50%,0)} 80%{opacity:1} 100%{opacity:0} }
  #confetti { position:fixed; inset:0; pointer-events:none; z-index:20; }
  body.calm .motif, body.calm .boss-banner .flair { display:none; }
  body.calm { background: var(--bg) !important; }
  body.calm .stars { visibility:hidden; }
  body.calm *, body.calm *::before, body.calm *::after { animation:none !important; transition:none !important; }`;
  document.head.appendChild(css);
  if (theme) {
    const tv = document.createElement('style');   // theme colors yield to High contrast
    tv.textContent = `:root:not([data-contrast="high"]) { --bg:${theme.card}; --card:${theme.card}; --card-alt:${theme.alt}; --accent:${theme.accent}; --accent-strong:${theme.strong}; --text:${theme.text}; --text-soft:${theme.soft}; }
      [data-contrast="high"] body.themed { background: var(--bg); } [data-contrast="high"] .motif { display:none; }`;
    document.head.appendChild(tv);
    document.body.classList.add('themed');
    document.body.insertAdjacentHTML('afterbegin', motifSVG(theme.motif));
    const brand = document.querySelector('.brand'); if (brand) brand.insertAdjacentHTML('beforeend', `<span class="theme-chip">${theme.label}</span>`);
  }
  if (boss) document.body.classList.add('boss');

  // ---------- controls: sound + calm ----------
  const controls = document.querySelector('.controls');
  const soundBtn = mk('soundToggle'), calmBtn = mk('calmToggle');
  function mk(id) { const b = document.createElement('button'); b.id = id; b.type = 'button'; controls.appendChild(b); return b; }
  function syncControls() {
    soundBtn.textContent = muted ? 'Sound: off' : 'Sound: on'; soundBtn.setAttribute('aria-pressed', String(!muted));
    calmBtn.textContent = calm ? 'Calm mode: on' : 'Calm mode'; calmBtn.setAttribute('aria-pressed', String(calm));
    document.body.classList.toggle('calm', calm);
    soundBtn.disabled = calm;
  }
  soundBtn.addEventListener('click', () => { muted = !muted; store.set('muted', muted ? '1' : '0'); syncControls(); if (!muted) tone('ok'); });
  calmBtn.addEventListener('click', () => { calm = !calm; store.set('calm', calm ? '1' : '0'); syncControls(); });
  syncControls();

  // ---------- sound (synthesized, no files) ----------
  let ac = null;
  function tone(kind) {
    if (muted || calm) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[660, .09], [880, .12]], no: [[220, .16]], streak: [[523, .08], [659, .08], [784, .14]], win: [[523, .1], [659, .1], [784, .1], [1047, .28]] }[kind];
      let t = ac.currentTime;
      for (const [f, d] of seq) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = kind === 'no' ? 'triangle' : 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(kind === 'no' ? 0.05 : 0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.9;
      }
    } catch (e) {}
  }

  // ---------- hooks into the v1 player ----------
  const _correct = window.correctFeedback, _wrong = window.wrongFeedback, _render = window.render, _done = window.renderDone;
  window.correctFeedback = function (p) {
    const before = streak; _correct(p);
    tone(streak > before && (streak === 3 || streak === 5 || streak === 10) ? 'streak' : 'ok');
    if (!calm && !reduced && streak > before && (streak === 3 || streak === 5 || streak === 10)) toast(`${streak} in a row!`);
    if (!calm && !reduced) { const c = document.querySelector('.feedback.correct'); if (c) c.classList.add('pop'); }
  };
  window.wrongFeedback = function (p, hint) { _wrong(p, hint); tone('no'); };
  window.render = function () {
    _render();
    if (boss && current === 0 && !document.querySelector('.boss-banner')) {
      card.insertAdjacentHTML('afterbegin', `<div class="boss-banner"><span class="flair" aria-hidden="true">⚔</span><span>Boss Level: ${DECK.kind === 'final-review' ? 'Final Review' : 'Unit Review'} <small>Beat it with ${Math.round(MASTERY * 100)}% on first tries.</small></span></div>`);
    }
  };
  window.renderDone = function () {
    _done();
    const title = document.getElementById('doneTitle');
    const won = title && /Mastered/.test(title.textContent);
    if (won && boss && title) title.innerHTML = '<span aria-hidden="true">⚔ </span>Boss defeated! Mastered!';
    if (won) { tone('win'); if (!calm && !reduced) confetti(); }
  };
  function toast(text) { const t = document.createElement('div'); t.className = 'streak-toast'; t.setAttribute('aria-hidden', 'true'); t.textContent = text; document.body.appendChild(t); setTimeout(() => t.remove(), 1700); }
  function confetti() {
    const cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv);
    const cx = cv.getContext('2d'); const W = cv.width = innerWidth, H = cv.height = innerHeight;
    const colors = [getComputedStyle(root).getPropertyValue('--accent').trim() || '#ffd166', '#ffffff', '#ff8fa3', '#7ad3ff', '#b8f28a'];
    const bits = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - .5) * 120, y: H / 3, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 3, c: colors[Math.random() * colors.length | 0], a: Math.random() * 6 }));
    let f = 0; (function step() { cx.clearRect(0, 0, W, H); for (const b of bits) { b.vy += .35; b.x += b.vx; b.y += b.vy; b.a += .2; cx.fillStyle = b.c; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.a); cx.fillRect(-b.r / 2, -b.r / 2, b.r, b.r * .6); cx.restore(); } if (++f < 150) requestAnimationFrame(step); else cv.remove(); })();
  }
  function motifSVG(kind) {
    const pat = {
      leaves: '<path d="M20 40 C 5 25, 20 5, 40 10 C 35 30, 30 38, 20 40 Z" fill="currentColor"/><path d="M70 80 C 55 65, 70 45, 90 50 C 85 70, 80 78, 70 80 Z" fill="currentColor"/>',
      laurel: '<ellipse cx="25" cy="25" rx="10" ry="4" transform="rotate(-35 25 25)" fill="currentColor"/><ellipse cx="75" cy="75" rx="10" ry="4" transform="rotate(35 75 75)" fill="currentColor"/>',
      scales: '<path d="M50 15 V70 M30 25 H70 M30 25 L20 45 H40 Z M70 25 L60 45 H80 Z M35 75 H65" stroke="currentColor" stroke-width="3" fill="none"/>',
      waves: '<path d="M0 40 Q 25 25 50 40 T 100 40 M0 80 Q 25 65 50 80 T 100 80" stroke="currentColor" stroke-width="3" fill="none"/>',
      stars: '<path d="M25 10 l4 10 10 1 -8 7 3 10 -9 -6 -9 6 3 -10 -8 -7 10 -1z" fill="currentColor"/><circle cx="75" cy="70" r="3" fill="currentColor"/>',
      dots: '<circle cx="20" cy="20" r="4" fill="currentColor"/><circle cx="70" cy="60" r="4" fill="currentColor"/>',
    }[kind] || '';
    return `<svg class="motif" width="100%" height="100%" aria-hidden="true" style="color:${theme.accent}"><defs><pattern id="mbm" width="100" height="100" patternUnits="userSpaceOnUse">${pat}</pattern></defs><rect width="100%" height="100%" fill="url(#mbm)"/></svg>`;
  }
  if (boss) window.render();
})();
