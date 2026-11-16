// "Plante algo": do canteiro à cesta.
import { sym, $, $$, timers } from './util.js';

const CROPS = ['tomato', 'carrot', 'corn', 'leaf'];
const CAPS = ['Plantar', 'Regar', 'Esperar o sol', 'Colher'];

export function mount(host) {
  const T = timers();
  const plots = CROPS.map((c) => ({ crop: c, stage: 0 }));
  let basket = 0;
  host.innerHTML = `<div class="w w--split ht">
    <div class="w__main"><div class="ht__field" role="group" aria-label="Canteiros">${plots.map((p, i) => `<button type="button" class="ht__plot" data-i="${i}" aria-label="Canteiro ${i + 1}"></button>`).join('')}</div></div>
    <div class="w__side"><div class="ht__basket">${sym('basket')}<span id="htN">Cesta: 0 colheitas</span></div>
    <p class="w__msg" aria-live="polite" id="htM">Toque num canteiro para plantar.</p></div></div>`;
  const msg = $('#htM', host), n = $('#htN', host);

  function paint(i) {
    const el = $$('.ht__plot', host)[i], p = plots[i];
    const art = p.stage === 0 ? '' : p.stage === 1 ? sym('nut') : p.stage === 2 ? sym('seedling') : sym(p.crop);
    el.innerHTML = `${art}<span class="ht__cap">${CAPS[p.stage]}</span>`;
    if (p.stage === 1) el.querySelector('svg').style.width = '24%';
  }
  plots.forEach((_, i) => paint(i));

  host.addEventListener('click', (e) => {
    const b = e.target.closest('.ht__plot'); if (!b) return;
    const i = +b.dataset.i, p = plots[i];
    if (p.stage === 1) b.insertAdjacentHTML('beforeend', `<span class="ht__drop">${sym('drop')}</span>`);
    p.stage = (p.stage + 1) % 4;
    if (p.stage === 0) { basket++; n.textContent = `Cesta: ${basket} ${basket === 1 ? 'colheita' : 'colheitas'}`; }
    T.set(() => paint(i), p.stage === 2 ? 450 : 0);
    if (p.stage !== 2) paint(i);
    msg.innerHTML = basket >= 4
      ? '<b>Cesta cheia!</b> O livro sugere que cada família e cada igreja cultive um pedaço de terra, para ter frutas e verduras frescas na própria mesa.<small>Cap. 18, § 519</small>'
      : ['Colhido! Plante de novo ou cuide dos outros canteiros.', 'Semente no chão. Toque para regar.', 'Regado: o broto apareceu. Toque para dar sol.', 'Cresceu! Toque para colher.'][p.stage];
  });
  return () => T.clear();
}
