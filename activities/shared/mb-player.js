/* Mighty B Practice Deck player - Format v1 */
const MB_HOST_ORIGIN = "https://mb-practice.mightyblearning.workers.dev";
const DECK = JSON.parse(document.getElementById('mb-deck').textContent);
const MASTERY = typeof DECK.masteryThreshold === 'number' ? DECK.masteryThreshold : 0.85;
const card = document.getElementById('card');
const feedbackLive = document.getElementById('feedbackLive');
const progressLabel = document.getElementById('progressLabel');
const progressFill = document.getElementById('progressFill');
const starsEl = document.getElementById('stars');
let order = [], current = 0, streak = 0, bestStreak = 0, triedWrong = false;
let tries = {}, firstTry = {}, attemptId = '', startedAt = '';

function uuid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });
}
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function tableHTML(t) {
  if (!t) return '';
  return '<table class="data"><thead><tr>' + t[0].map(h => `<th scope="col">${h}</th>`).join('') + '</tr></thead><tbody>' +
    t.slice(1).map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
}
function announce(html) { feedbackLive.innerHTML = html; }
function startAttempt() {
  order = shuffle(DECK.problems); current = 0; streak = 0; bestStreak = 0;
  tries = {}; firstTry = {}; attemptId = uuid(); startedAt = new Date().toISOString();
  DECK.problems.forEach(p => { tries[p.id] = 0; firstTry[p.id] = false; });
  render();
}
function updateTop() {
  progressLabel.textContent = `Question ${Math.min(current + 1, order.length)} of ${order.length}`;
  progressFill.style.width = `${(current / order.length) * 100}%`;
  starsEl.textContent = streak >= 2 ? `⭐ ${streak} in a row` : '';
}
function showNext() {
  const actions = document.getElementById('actionsArea');
  const btn = document.createElement('button');
  btn.className = 'btn-primary'; btn.type = 'button';
  btn.textContent = current === order.length - 1 ? 'See summary' : 'Next question';
  btn.addEventListener('click', () => { if (current < order.length - 1) { current++; render(); } else { renderDone(); } });
  actions.appendChild(btn); btn.focus();
}
function correctFeedback(p) {
  tries[p.id]++;
  if (!triedWrong) { firstTry[p.id] = true; streak++; bestStreak = Math.max(bestStreak, streak); }
  updateTop();
  const html = `<div class="feedback correct"><strong><span aria-hidden="true">✓ </span>${triedWrong ? 'Correct - you got it!' : 'Correct - nice work!'}</strong>${p.explain}</div>`;
  document.getElementById('feedbackArea').innerHTML = html; announce(html);
  showNext();
}
function wrongFeedback(p, hint) {
  tries[p.id]++;
  if (!triedWrong) { streak = 0; updateTop(); }
  triedWrong = true;
  const html = `<div class="feedback incorrect"><strong><span aria-hidden="true">✗ </span>Not quite yet. Here's a hint:</strong>${hint}</div>`;
  document.getElementById('feedbackArea').innerHTML = html; announce(html);
}
function nudge(text) {
  const html = `<div class="feedback incorrect"><strong>One step first:</strong>${text}</div>`;
  document.getElementById('feedbackArea').innerHTML = html; announce(html);
}
function render() {
  triedWrong = false;
  const p = order[current];
  updateTop(); announce('');
  card.innerHTML = `<span class="tag">${p.tag || DECK.title}</span>
    <h2 class="question-text" tabindex="-1" id="qText">${p.q}</h2>${tableHTML(p.table)}
    <div id="body"></div><div id="feedbackArea"></div><div class="actions" id="actionsArea"></div>`;
  if (p.type === 'match') renderMatch(p); else renderMC(p);
  if (current > 0) document.getElementById('qText').focus();
}
function renderMC(p) {
  const body = document.getElementById('body');
  body.innerHTML = '<div class="choices" role="group" aria-label="Answer choices"></div>';
  const wrap = body.firstChild;
  shuffle(p.choices).forEach(val => {
    const b = document.createElement('button');
    b.className = 'choice'; b.type = 'button'; b.innerHTML = val;
    b.addEventListener('click', () => {
      if (val === p.answer) {
        wrap.querySelectorAll('.choice').forEach(x => x.disabled = true);
        b.classList.add('correct'); b.innerHTML = '<span aria-hidden="true">✓ </span>' + val; correctFeedback(p);
      } else {
        b.classList.add('incorrect'); b.disabled = true; b.innerHTML = '<span aria-hidden="true">✗ </span>' + val;
        wrongFeedback(p, (p.hints && p.hints[val]) || p.hint);
      }
    });
    wrap.appendChild(b);
  });
}
function renderMatch(p) {
  const body = document.getElementById('body');
  body.innerHTML = `<p class="match-help">Click a word on the left, then click what it matches on the right.</p>
    <div class="match-grid"><div class="match-col" id="left" role="group" aria-label="Terms"></div><div class="match-col" id="right" role="group" aria-label="Matches"></div></div>`;
  let picked = null, done = 0;
  const left = document.getElementById('left'), right = document.getElementById('right');
  const L = {};
  shuffle(p.pairs).forEach(([a]) => {
    const b = document.createElement('button'); b.className = 'choice'; b.type = 'button'; b.innerHTML = a; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (b.disabled) return;
      Object.values(L).forEach(x => { x.classList.remove('picked'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('picked'); b.setAttribute('aria-pressed', 'true'); picked = a;
    });
    L[a] = b; left.appendChild(b);
  });
  shuffle(p.pairs).forEach(([a, bText]) => {
    const b = document.createElement('button'); b.className = 'choice'; b.type = 'button'; b.innerHTML = bText;
    b.addEventListener('click', () => {
      if (b.disabled) return;
      if (!picked) { nudge('First click a word on the left, then click its match here.'); return; }
      const pair = p.pairs.find(x => x[0] === picked);
      if (pair[1] === bText) {
        L[picked].classList.remove('picked'); L[picked].classList.add('correct'); L[picked].disabled = true;
        L[picked].innerHTML = '<span aria-hidden="true">✓ </span>' + picked;
        b.classList.add('correct'); b.disabled = true; b.innerHTML = '<span aria-hidden="true">✓ </span>' + bText;
        picked = null; done++;
        if (done === p.pairs.length) correctFeedback(p);
        else { document.getElementById('feedbackArea').innerHTML = ''; announce('Matched. Keep going.'); }
      } else {
        b.classList.add('incorrect'); setTimeout(() => b.classList.remove('incorrect'), 900);
        wrongFeedback(p, (p.pairHints && p.pairHints[picked]) || p.hint);
      }
    });
    right.appendChild(b);
  });
}
function sendResult(result) {
  window.dispatchEvent(new CustomEvent('mb-deck-complete', { detail: result }));
  if (window.parent !== window) window.parent.postMessage({ type: 'mb-deck-complete', result }, MB_HOST_ORIGIN);
}
function renderDone() {
  const n = DECK.problems.length;
  const given = DECK.problems.filter(p => firstTry[p.id]).length;
  const mastered = given / n >= MASTERY;
  current = order.length;
  progressLabel.textContent = `Question ${n} of ${n}`;
  progressFill.style.width = '100%'; starsEl.textContent = '';
  const missed = DECK.problems.filter(p => !firstTry[p.id]);
  const missedHTML = missed.length ? `<div class="missed"><h3>Worth another look</h3><ul>${missed.map(p => `<li>${p.skill ? p.skill.replace(/-/g, ' ') + ': ' : ''}${p.q}</li>`).join('')}</ul></div>` : '';
  card.innerHTML = `<div class="done-card"><h2 tabindex="-1" id="doneTitle">${mastered ? '<span aria-hidden="true">✓ </span>Mastered!' : 'Not yet - keep practicing'}</h2>
    <p class="score-line">You got <strong>${given} of ${n}</strong> right on your first try (${Math.round(given / n * 100)}%). Mastery is ${Math.round(MASTERY * 100)}%.<br>Your best streak was ${bestStreak} in a row.</p>
    <p>${DECK.wrapUp}</p>${missedHTML}
    <div class="actions" style="justify-content:center; margin-top:20px;">
    <button class="btn-primary" type="button" id="restartBtn">Try again</button></div></div>`;
  announce(mastered ? 'Mastered.' : 'Not yet.');
  document.getElementById('doneTitle').focus();
  document.getElementById('restartBtn').addEventListener('click', startAttempt);
  sendResult({
    formatVersion: 1, deckId: DECK.deckId, attemptId, startedAt, completedAt: new Date().toISOString(),
    scoreGiven: given, scoreMaximum: n, mastered,
    items: DECK.problems.map(p => { const it = { id: p.id, firstTryCorrect: firstTry[p.id], tries: tries[p.id] }; if (p.skill) it.skill = p.skill; return it; })
  });
}
document.getElementById('contrastToggle').addEventListener('click', function () {
  const root = document.documentElement; const isHigh = root.getAttribute('data-contrast') === 'high';
  root.setAttribute('data-contrast', isHigh ? 'normal' : 'high');
  this.setAttribute('aria-pressed', String(!isHigh)); this.textContent = isHigh ? 'High contrast' : 'Normal contrast';
});
document.getElementById('fontToggle').addEventListener('click', function () {
  const isLarge = document.getElementById('wrap').classList.toggle('font-lg');
  this.setAttribute('aria-pressed', String(isLarge)); this.textContent = isLarge ? 'Smaller text' : 'Larger text';
});
startAttempt();
