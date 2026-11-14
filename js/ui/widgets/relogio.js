// "Relógio do dia": arraste as refeições e veja o descanso do estômago entre elas.
import { sym, $, $$ } from './util.js';

const T0 = 6 * 60, T1 = 22 * 60, SPAN = T1 - T0;
const fmt = (t) => `${Math.floor(t / 60)}h${String(t % 60).padStart(2, '0')}`;
const dur = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`.replace(/h$/, 'h');
const PRESETS = [
  { id: 'duas', nome: '2 refeições', ev: [[7 * 60, 'meal'], [13 * 60, 'meal']] },
  { id: 'tres', nome: '3 refeições', ev: [[7 * 60, 'meal'], [12 * 60 + 30, 'meal'], [18 * 60, 'meal']] },
  { id: 'livro', nome: 'Exemplo da autora', ev: [[6 * 60 + 30, 'meal'], [13 * 60 + 30, 'meal']], msg: '<b>Exemplo da autora.</b> Ela relatou desjejum às 6h30 e almoço às 13h30, sem ceia. É apenas um exemplo, não uma regra.<small>Apêndice 1, § 20</small>' },
];

export function mount(host) {
  let seq = 0;
  let evs = PRESETS[0].ev.map(([t, k]) => ({ id: ++seq, t, k }));
  let override = '';
  host.innerHTML = `<div class="w w--split w--fit">
    <div class="w__main"><div class="rl__presets" role="group" aria-label="Exemplos">${PRESETS.map((p) => `<button type="button" class="w-btn" data-p="${p.id}">${p.nome}</button>`).join('')}<button type="button" class="w-btn" data-snack>＋ Beliscar</button></div>
    <div class="rl__track" id="rlT" role="group" aria-label="Linha do dia das 6h às 22h"><div class="rl__line" id="rlL"></div></div>
    <p class="rl__hint">Arraste os pratos. Toque na linha para “beliscar”.</p></div>
    <div class="w__side"><ul class="rl__gaps" id="rlG"></ul>
    <p class="w__msg" aria-live="polite" id="rlM"></p></div></div>`;
  const track = $('#rlT', host), line = $('#rlL', host), gaps = $('#rlG', host), msg = $('#rlM', host);
  const pct = (t) => ((t - T0) / SPAN) * 100;

  // marcas de hora
  [6, 9, 12, 15, 18, 21].forEach((h) => track.insertAdjacentHTML('beforeend', `<span class="rl__tick" style="left:${pct(h * 60)}%">${h}h</span>`));

  const sorted = () => [...evs].sort((a, b) => a.t - b.t);

  function render() {
    // marcadores
    const existing = new Map($$('.rl__mk', track).map((el) => [+el.dataset.id, el]));
    evs.forEach((e) => {
      let el = existing.get(e.id);
      if (!el) {
        el = document.createElement('button');
        el.type = 'button'; el.className = 'rl__mk' + (e.k === 'snack' ? ' rl__mk--snack' : ''); el.dataset.id = e.id;
        el.setAttribute('role', 'slider'); el.setAttribute('aria-valuemin', T0); el.setAttribute('aria-valuemax', T1);
        el.innerHTML = `${sym(e.k === 'snack' ? 'apple' : 'plate')}<span class="rl__time"></span>`;
        track.appendChild(el);
      }
      existing.delete(e.id);
      el.style.left = pct(e.t) + '%';
      el.setAttribute('aria-valuenow', e.t);
      el.setAttribute('aria-label', `${e.k === 'snack' ? 'Beliscada' : 'Refeição'} às ${fmt(e.t)}`);
      el.setAttribute('aria-valuetext', fmt(e.t));
      $('.rl__time', el).textContent = fmt(e.t);
    });
    existing.forEach((el) => el.remove());

    // intervalos
    const s = sorted();
    line.innerHTML = '';
    const items = [];
    for (let i = 0; i < s.length - 1; i++) {
      const m = s[i + 1].t - s[i].t;
      const cls = m >= 300 ? 'g-ok' : m >= 180 ? 'g-mid' : 'g-bad';
      line.insertAdjacentHTML('beforeend', `<i class="rl__gap ${cls}" style="left:${pct(s[i].t)}%;width:${pct(s[i + 1].t) - pct(s[i].t)}%"></i>`);
      items.push({ a: s[i], b: s[i + 1], m, cls });
    }
    gaps.innerHTML = items.map(({ a, b, m, cls }) => `<li><i style="background:${cls === 'g-ok' ? '#4aa36a' : cls === 'g-mid' ? '#e7b73c' : '#d4553f'}"></i>${fmt(a.t)} → ${fmt(b.t)}: <b>${dur(m)}</b> ${m >= 300 ? '· estômago descansa' : '· intervalo curto'}</li>`).join('');

    // mensagem
    if (override) { msg.innerHTML = override; return; }
    const snacks = evs.filter((e) => e.k === 'snack').length;
    const meals = s.filter((e) => e.k === 'meal');
    const minMeal = meals.length > 1 ? Math.min(...meals.slice(1).map((e, i) => e.t - meals[i].t)) : 999;
    if (snacks) msg.innerHTML = '<b>Beliscou?</b> Cada beliscada divide o intervalo e põe o estômago de volta ao trabalho. O livro sugere nada entre as refeições.<small>Cap. 9, §§ 281–282</small>';
    else if (meals.length < 2) msg.textContent = 'Coloque ao menos duas refeições para ver o intervalo.';
    else if (minMeal >= 300) msg.innerHTML = '<b>O estômago descansa.</b> Todos os intervalos têm cinco horas ou mais, como o livro recomenda.<small>Cap. 9, §§ 267 e 281</small>';
    else msg.innerHTML = `<b>Intervalo curto.</b> O livro sugere pelo menos cinco horas entre as refeições (o menor aqui tem ${dur(minMeal)}).<small>Cap. 9, § 267</small>`;
    const last = meals[meals.length - 1];
    if (!snacks && last && last.t >= 19 * 60 && meals.length >= 3) msg.innerHTML += '<br>Jantar tarde pesa no sono: se houver, que seja bem leve.';
  }

  // arrastar
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    const mk = e.target.closest('.rl__mk');
    if (!mk) return;
    drag = { id: +mk.dataset.id, el: mk, moved: false };
    try { mk.setPointerCapture(e.pointerId); } catch (err) { /* ponteiro sintético */ }
    mk.classList.add('is-drag');
    override = '';
  });
  const moveTo = (clientX) => {
    if (!drag) return;
    const r = track.getBoundingClientRect();
    let t = T0 + ((clientX - r.left) / r.width) * SPAN;
    t = Math.max(T0, Math.min(T1, Math.round(t / 15) * 15));
    const ev = evs.find((x) => x.id === drag.id);
    if (ev && ev.t !== t) { ev.t = t; drag.moved = true; render(); }
  };
  track.addEventListener('pointermove', (e) => moveTo(e.clientX));
  const end = () => { if (drag) { drag.el.classList.remove('is-drag'); drag = null; } };
  track.addEventListener('pointerup', (e) => {
    if (drag) { moveTo(e.clientX); end(); return; }
    if (e.target.closest('.rl__mk')) return;
    if (evs.filter((x) => x.k === 'snack').length >= 3) return;
    const r = track.getBoundingClientRect();
    const t = Math.max(T0 + 30, Math.min(T1 - 30, Math.round((T0 + ((e.clientX - r.left) / r.width) * SPAN) / 15) * 15));
    override = ''; evs.push({ id: ++seq, t, k: 'snack' }); render();
  });
  track.addEventListener('pointercancel', end);
  track.addEventListener('keydown', (e) => {
    const mk = e.target.closest('.rl__mk'); if (!mk) return;
    const step = e.key === 'ArrowLeft' ? -15 : e.key === 'ArrowRight' ? 15 : e.key === 'PageUp' ? 60 : e.key === 'PageDown' ? -60 : 0;
    if (!step) return;
    e.preventDefault(); override = '';
    const ev = evs.find((x) => x.id === +mk.dataset.id);
    ev.t = Math.max(T0, Math.min(T1, ev.t + step)); render();
  });

  host.addEventListener('click', (e) => {
    const p = e.target.closest('[data-p]');
    if (p) {
      const pr = PRESETS.find((x) => x.id === p.dataset.p);
      evs = pr.ev.map(([t, k]) => ({ id: ++seq, t, k })); override = pr.msg || ''; $$('.rl__mk', track).forEach((el) => el.remove()); render(); return;
    }
    if (e.target.closest('[data-snack]')) {
      if (evs.filter((x) => x.k === 'snack').length >= 3) return;
      const s = sorted(); let best = [0, 12 * 60];
      for (let i = 0; i < s.length - 1; i++) { const m = s[i + 1].t - s[i].t; if (m > best[0]) best = [m, Math.round((s[i].t + m / 2) / 15) * 15]; }
      override = ''; evs.push({ id: ++seq, t: best[1], k: 'snack' }); render();
    }
  });
  render();
}
