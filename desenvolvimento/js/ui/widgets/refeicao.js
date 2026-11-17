// "Monte a refeição": quantos pratos cabem em paz numa mesa.
import { sym, $, $$, esc } from './util.js';

const DISHES = [
  ['arroz', 'Arroz e feijão', 'bowl'], ['salada', 'Salada', 'leaf'], ['pao', 'Pão integral', 'bread'], ['maca', 'Maçã', 'apple'],
  ['cenoura', 'Cenoura', 'carrot'], ['milho', 'Milho', 'corn'], ['sopa', 'Sopa', 'pot'], ['nozes', 'Nozes', 'nut'],
  ['tomate', 'Tomate', 'tomato'], ['uvas', 'Uvas', 'grapes'], ['pera', 'Pêra', 'pear'], ['limao', 'Limão', 'lemon'],
];
// hl: frase do livro (não aparece na tela) que o link da referência destaca, quando a passagem tem vários parágrafos
export const STATES = [
  { max: 0, name: 'Mesa vazia', msg: 'Toque nos pratos para colocá-los na mesa.', ref: '' },
  { max: 2, name: 'Mesa simples', msg: '<b>Poucos pratos.</b> Fácil de preparar e de digerir. Ainda cabe variar na próxima refeição.', ref: '' },
  { max: 4, name: 'Mesa leve', msg: '<b>Mesa leve.</b> Três ou quatro pratos já bastam, diz o livro. Amanhã, mude os pratos: variedade entre as refeições, não dentro delas.', ref: 'Cap. 5, § 177' },
  { max: 6, name: 'Já está pesando', msg: '<b>Já está pesando.</b> O livro alerta que muita variedade na mesma refeição cansa o corpo e tira o prazer de cada alimento.', ref: 'Cap. 5, §§ 181–183', hl: 'comer demasiada variedade de alimentos na mesma refeição' },
  { max: 99, name: 'Banquete!', msg: '<b>Banquete!</b> Para o livro, importa mais comer o que nos faz bem do que provar de todos os pratos.', ref: 'Cap. 5, § 187' },
];

export function mount(host) {
  const chosen = [];
  host.innerHTML = `<div class="w w--split w--fit">
    <div class="w__main"><div class="rf__table" id="rfT"><div class="rf__empty">A mesa está vazia</div></div>
    <div class="rf__meter"><div class="rf__st"><span id="rfName">Mesa vazia</span><span id="rfN">0 pratos</span></div>
      <div class="rf__bar" aria-hidden="true">${'<i></i>'.repeat(8)}</div></div></div>
    <div class="w__side"><div class="rf__chips" role="group" aria-label="Pratos">${DISHES.map(([id, n, s]) => `<button type="button" class="rf__chip" data-id="${id}" aria-pressed="false">${sym(s)}<span>${n}</span></button>`).join('')}</div>
    <p class="w__msg" aria-live="polite"></p></div></div>`;
  const table = $('#rfT', host), nm = $('#rfName', host), nn = $('#rfN', host), msg = $('.w__msg', host), bars = $$('.rf__bar i', host);
  const upd = () => {
    const n = chosen.length;
    table.innerHTML = n ? chosen.map((id) => { const d = DISHES.find((x) => x[0] === id); return `<span class="rf__dish">${sym(d[2])}</span>`; }).join('') : '<div class="rf__empty">A mesa está vazia</div>';
    const s = STATES.find((x) => n <= x.max);
    nm.textContent = s.name; nn.textContent = `${n} ${n === 1 ? 'prato' : 'pratos'}`;
    bars.forEach((b, i) => { b.className = i < n ? (i < 4 ? 'on1' : i < 6 ? 'on2' : 'on3') : ''; });
    msg.innerHTML = s.msg + (s.ref ? `<small${s.hl ? ` data-q="${esc(s.hl)}"` : ''}>${s.ref}</small>` : '');
  };
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.rf__chip'); if (!b) return;
    const id = b.dataset.id, at = chosen.indexOf(id);
    if (at >= 0) { chosen.splice(at, 1); b.setAttribute('aria-pressed', 'false'); } else { chosen.push(id); b.setAttribute('aria-pressed', 'true'); }
    upd();
  });
  upd();
}
