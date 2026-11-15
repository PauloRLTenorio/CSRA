// "Pausa de 10 segundos": pare, agradeça, escolha.
import { sym, $, timers } from './util.js';

const PHASES = [
  { w: 'Pare', s: 'pause', d: 4000, t: 'Respire fundo. Largue a pressa.' },
  { w: 'Agradeça', s: 'heart', d: 3000, t: 'Uma palavra de gratidão pelo alimento.' },
  { w: 'Escolha', s: 'plate', d: 3000, t: 'Decida com calma o que e quanto comer.' },
];

export function mount(host) {
  const T = timers();
  host.innerHTML = `<div class="w w--split ps" id="ps" data-ph="0">
    <div class="w__main"><div class="ps__orb"><div class="ps__ic" id="psI">${sym('plate')}</div></div></div>
    <div class="w__side ps__side"><div class="ps__word" id="psW" aria-live="assertive">Pronto?</div>
    <div class="ps__bar" aria-hidden="true"><i></i></div>
    <p class="w__msg" id="psT" aria-live="polite" style="text-align:center">São só dez segundos.</p>
    <button type="button" class="w-btn w-btn--pri" id="psB">Começar</button></div></div>`;
  const root = $('#ps', host), ic = $('#psI', host), wd = $('#psW', host), tx = $('#psT', host), bt = $('#psB', host);
  let running = false;

  function run() {
    if (running) return;
    running = true; bt.disabled = true; bt.textContent = 'Respirando…';
    root.classList.remove('is-run'); void root.offsetWidth; root.classList.add('is-run');
    let at = 0;
    PHASES.forEach((p, i) => {
      T.set(() => { root.dataset.ph = String(i); wd.textContent = p.w; tx.textContent = p.t; ic.innerHTML = sym(p.s); }, at);
      at += p.d;
    });
    T.set(() => {
      wd.textContent = 'Pronto.';
      tx.innerHTML = 'Agora você escolhe com calma. Faça isso antes da próxima refeição.<small>Cap. 5, § 175; Cap. 8, § 266</small>';
      ic.innerHTML = sym('heart'); root.classList.remove('is-run'); running = false; bt.disabled = false; bt.textContent = 'Fazer de novo';
    }, at);
  }
  bt.addEventListener('click', run);
  return () => T.clear();
}
