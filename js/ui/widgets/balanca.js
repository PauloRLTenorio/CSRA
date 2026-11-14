// "A balança do equilíbrio": procure o meio entre o descuido e o extremismo.
import { sym, $ } from './util.js';

export function mount(host) {
  host.innerHTML = `<div class="w w--split">
    <div class="w__main"><div class="bl__stage"><div class="bl__scale" id="blS">${sym('scale')}</div></div></div>
    <div class="w__side"><div class="bl__chips" id="blC" aria-live="polite"></div>
    <input class="w-range" id="blR" type="range" min="-100" max="100" value="-80" aria-label="Do descuido ao extremismo" style="--w-track:linear-gradient(90deg,#d99a4e 0%,#4aa36a 38%,#4aa36a 62%,#b4532b 100%)">
    <div class="bl__ends"><span>Descuido</span><span>Equilíbrio</span><span>Extremismo</span></div>
    <p class="w__msg" aria-live="polite" id="blM"></p></div></div>`;
  const s = $('#blS', host), r = $('#blR', host), m = $('#blM', host), c = $('#blC', host);
  let zone = '';
  const upd = () => {
    const v = +r.value;
    s.style.setProperty('--tilt', `${(v / 100) * 12}deg`);
    const z = Math.abs(v) <= 18 ? 'mid' : v < 0 ? (v < -55 ? 'left' : 'nl') : (v > 55 ? 'right' : 'nr');
    if (z === zone) return; zone = z;
    c.innerHTML = z === 'mid' ? ['Nutritivo e saboroso', 'Cada corpo é um corpo', 'Passo a passo, sem impor'].map((t, i) => `<span style="animation-delay:${i * 90}ms">${t}</span>`).join('') : '';
    m.innerHTML = {
      left: '<b>Descuido.</b> Comer sem critério nenhum. O livro lembra que cada luz recebida pede um passo.<small>Cap. 1, §§ 12–13</small>',
      nl: '<b>Quase lá.</b> Um pouco mais de cuidado e você chega ao meio.',
      mid: '<b>Equilíbrio.</b> Não é meio-termo morno: é cuidado com sabor, respeito ao corpo e gentileza com os outros.<small>Cap. 11, §§ 317–326</small>',
      nr: '<b>Quase lá.</b> Um pouco mais de leveza e você chega ao meio.',
      right: '<b>Extremismo.</b> Dieta pobre, regras para os outros, vigilância no prato alheio. O livro diz que a reforma vira o contrário do que pretendia.<small>Cap. 11, §§ 324–331</small>',
    }[z];
  };
  r.addEventListener('input', upd);
  upd();
}
