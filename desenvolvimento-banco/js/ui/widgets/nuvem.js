// "Nuvem sobre a mente": quanto mais pesada a refeição, mais nublado o dia.
import { sym, $ } from './util.js';

const TIERS = [
  { max: 25, label: 'leve', msg: '<b>Refeição leve.</b> Dia claro: dá para ouvir, estudar e decidir. O livro promete clareza de pensamento a quem trata bem o estômago.', ref: 'Cap. 5, § 153' },
  { max: 60, label: 'média', msg: '<b>Meio-termo.</b> Ainda dá para seguir, mas o corpo já pede uma pausa antes de pensar com a mesma agilidade.', ref: '' },
  { max: 100, label: 'pesada', msg: '<b>Refeição pesada.</b> Cabeça pesada, sono e pensamento lento. O livro descreve esse mal-estar, inclusive a sonolência em momentos que exigem atenção.', ref: 'Cap. 5, § 155; Cap. 7, § 222' },
];

export function mount(host) {
  host.innerHTML = `<div class="w w--split">
    <div class="w__main"><div class="nv__sky" id="nvSky" style="--p:.15">
      <div class="nv__gray"></div>
      <div class="nv__sun">${sym('sun')}</div>
      <div class="nv__cloud nv__cloud--1">${sym('cloud')}</div>
      <div class="nv__cloud nv__cloud--2">${sym('cloud')}</div>
      <div class="nv__cloud nv__cloud--3">${sym('cloud')}</div>
      <div class="nv__bulb">${sym('bulb')}</div>
    </div></div>
    <div class="w__side"><div class="nv__lbl"><span>Peso da refeição</span><output id="nvOut">leve</output></div>
    <input class="w-range" type="range" min="0" max="100" value="15" aria-label="Peso da refeição, de leve a pesada">
    <div class="w-scale"><span>leve</span><span>pesada</span></div>
    <p class="w__msg" aria-live="polite"></p></div></div>`;
  const sky = $('#nvSky', host), out = $('#nvOut', host), msg = $('.w__msg', host), rng = $('input', host);
  let last = -1;
  const upd = () => {
    const v = +rng.value;
    sky.style.setProperty('--p', (v / 100).toFixed(3));
    const t = TIERS.findIndex((x) => v <= x.max);
    out.textContent = TIERS[t].label;
    if (t !== last) { last = t; msg.innerHTML = TIERS[t].msg + (TIERS[t].ref ? `<small>${TIERS[t].ref}</small>` : ''); }
  };
  rng.addEventListener('input', upd);
  upd();
}
