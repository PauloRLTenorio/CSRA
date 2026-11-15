// "A roda dos oito remédios": a "farmácia" simples da natureza, segundo o livro.
import { sym, $, $$ } from './util.js';

const R = [
  { n: 'Ar puro', s: 'wind', t: 'Ar fresco e pulmões livres renovam o corpo e ajudam a circulação.', ref: 'Cap. 5, §§ 159–160' },
  { n: 'Luz solar', s: 'sun', t: 'A luz do sol está na lista dos remédios simples. Aproveite-a com bom senso.', ref: 'Cap. 17, §§ 452 e 454' },
  { n: 'Abstinência', s: 'shield', t: 'Dizer não ao que prejudica: estimulantes, excessos, pressa. Proteger o corpo também é cuidar.', ref: 'Cap. 17, § 452' },
  { n: 'Repouso', s: 'moon', t: 'O corpo se reconstrói enquanto descansa. Ritmo e sono valem mais que pressa.', ref: 'Cap. 17, § 452' },
  { n: 'Exercício', s: 'feet', t: 'Movimento ajuda a digestão e a saúde em geral. Esforço violento logo depois de comer, não.', ref: 'Cap. 5, § 158; Cap. 17, § 455' },
  { n: 'Regime conveniente', s: 'plate', t: 'O prato certo para você: simples, nutritivo, no horário e na medida.', ref: 'Cap. 17, § 452' },
  { n: 'Uso de água', s: 'drop', t: 'A água pura é uma das maiores bênçãos: bebida com generosidade, ajuda o corpo a fazer o seu trabalho.', ref: 'Cap. 24, § 726' },
  { n: 'Confiança em Deus', s: 'anchor', t: 'Fazer a sua parte e confiar. Para o livro, fé e atitude caminham juntas.', ref: 'Cap. 1, §§ 29 e 38' },
];

export function mount(host) {
  host.innerHTML = `<div class="w w--split">
    <div class="w__main"><div class="rm__wheel" role="group" aria-label="Os oito remédios">
      <div class="rm__ctr" id="rmC">Os 8<br>remédios</div>
      ${R.map((r, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return `<button type="button" class="rm__btn" data-i="${i}" aria-pressed="false" aria-label="${r.n}" style="left:${50 + Math.cos(a) * 38}%;top:${50 + Math.sin(a) * 38}%">${sym(r.s)}</button>`;
      }).join('')}
    </div></div>
    <div class="w__side"><div class="rm__card" aria-live="polite" id="rmK"><h3>Toque num remédio</h3><p>Cada ícone da roda é um dos “remédios” simples que o livro lista.</p></div></div></div>`;
  const card = $('#rmK', host), ctr = $('#rmC', host);
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.rm__btn'); if (!b) return;
    const r = R[+b.dataset.i];
    $$('.rm__btn', host).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    ctr.innerHTML = r.n.replace(' ', '<br>');
    card.innerHTML = `<h3>${r.n}</h3><p>${r.t}</p><small>${r.ref}</small>`;
  });
}
