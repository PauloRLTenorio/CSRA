// "Monte o primeiro prato": quatro grupos do cardápio original.
import { sym, $, $$, esc, reduceMotion } from './util.js';

const GROUPS = [
  { id: 'frutas', nome: 'Frutas', sym: 'apple', items: [['apple', 31, 31, 28, -6], ['grapes', 43, 46, 22, 8]],
    msg: '<b>Frutas.</b> Frescas e maduras, o mais perto possível do pé. O livro sugere cozinhar menos e comer mais fruta em estado natural.', ref: 'Cap. 18, § 466' },
  { id: 'graos', nome: 'Grãos', sym: 'wheat', items: [['wheat', 69, 31, 28, 6], ['bread', 58, 47, 23, -4]],
    msg: '<b>Grãos.</b> Trigo, aveia, arroz, milho: a base do prato. O pão, diz o livro, deve ser bem assado e, de preferência, integral.', ref: 'Cap. 18, §§ 481–506' },
  { id: 'nozes', nome: 'Nozes', sym: 'nut', items: [['nut', 30, 67, 24, -8], ['nut', 43, 75, 18, 12]],
    msg: '<b>Nozes.</b> Sementes que dão força e sabor. O livro pede moderação e variedade, sem reduzir o cardápio a elas.', ref: 'Cap. 22, §§ 617–623' },
  { id: 'verduras', nome: 'Verduras', sym: 'leaf', items: [['tomato', 68, 66, 25, 4], ['leaf', 57, 76, 22, -14], ['carrot', 78, 52, 20, 10]],
    msg: '<b>Verduras.</b> Vindas da horta, simples e bem preparadas. O livro incentiva até cultivar a própria horta.', ref: 'Cap. 18, §§ 509 e 519' },
];
const FULL = '<b>O prato completo.</b> Quatro grupos do mesmo jardim. O livro sustenta que neles estão todos os elementos de que o corpo precisa.<small>Cap. 4, § 138</small>';

export function mount(host) {
  const on = new Set();
  host.innerHTML = `<div class="w w--split">
    <div class="w__main"><div class="pl"><div class="pl__plate">${sym('plate')}
      ${GROUPS.map((g) => g.items.map(([s, x, y, z, r], i) => `<span class="pl__it" data-g="${g.id}" style="left:${x}%;top:${y}%;--s:${z};--r:${r}deg;transition-delay:${i * 90}ms">${sym(s)}</span>`).join('')).join('')}
      <div class="pl__burst" aria-hidden="true"></div></div></div></div>
    <div class="w__side"><div class="pl__chips" role="group" aria-label="Grupos do primeiro cardápio">${GROUPS.map((g) => `<button type="button" class="pl__chip" data-g="${g.id}" aria-pressed="false">${sym(g.sym)}<span>${g.nome}</span></button>`).join('')}</div>
    <p class="w__msg" aria-live="polite">Toque em um grupo para colocá-lo no prato.</p></div></div>`;
  const msg = $('.w__msg', host);
  const burst = $('.pl__burst', host);

  function celebrate() {
    if (reduceMotion()) return;
    burst.innerHTML = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2, d = 90 + (i % 3) * 30;
      return `<i style="--bx:${Math.cos(a) * d}%;--by:${Math.sin(a) * d}%;animation-delay:${i * 30}ms">${sym('star')}</i>`;
    }).join('');
    setTimeout(() => { burst.innerHTML = ''; }, 1500);
  }

  host.addEventListener('click', (e) => {
    const b = e.target.closest('.pl__chip'); if (!b) return;
    const g = GROUPS.find((x) => x.id === b.dataset.g);
    const pressed = !on.has(g.id);
    if (pressed) on.add(g.id); else on.delete(g.id);
    b.setAttribute('aria-pressed', String(pressed));
    $$(`.pl__it[data-g="${g.id}"]`, host).forEach((el) => el.classList.toggle('is-on', pressed));
    if (on.size === 4) { msg.innerHTML = FULL; celebrate(); }
    else if (pressed) msg.innerHTML = `${g.msg}<small>${esc(g.ref)}</small>`;
    else msg.textContent = on.size ? 'Retirado. Toque de novo para repor.' : 'Toque em um grupo para colocá-lo no prato.';
  });
}
