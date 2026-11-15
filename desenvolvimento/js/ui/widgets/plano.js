// "Plano de 7 dias": um gesto pequeno por dia, guardado só no seu aparelho.
import { state } from '../../state.js';
import { sym, $, $$, esc } from './util.js';

const DIAS = [
  'Faça a pausa de 10 segundos antes da primeira refeição: pare, agradeça, escolha.',
  'Faça uma refeição sem tela, mastigando devagar e deixando a pressa do lado de fora.',
  'Escolha um intervalo sem beliscar entre duas refeições. Ajuste ao seu corpo e à orientação do seu médico.',
  'Monte uma refeição com três ou quatro pratos simples. Amanhã, troque os pratos.',
  'Beba água ao longo do dia e faça uma caminhada ao ar livre.',
  'Cozinhe um prato simples, do começo ao fim, para você ou para alguém.',
  'Convide alguém, sem explicar demais, para conhecer este site ou comer com você.',
];

export function mount(host, card, ctx) {
  host.innerHTML = `<div class="w pn">
    <div class="pn__top"><div class="pn__plant" aria-hidden="true">${sym('seedling')}${sym('tree')}</div><div class="pn__sum" id="pnS"></div></div>
    <div class="pn__list" id="pnL" role="group" aria-label="Plano de sete dias">${DIAS.map((d, i) => `<button type="button" class="pn__day" role="checkbox" aria-checked="false" data-i="${i}"><b>${i + 1}</b><span>${esc(d)}</span></button>`).join('')}</div>
    <div class="pn__act"><button type="button" class="w-btn w-btn--pri" id="pnShare">Compartilhar meu plano</button><button type="button" class="w-btn" id="pnReset">Recomeçar</button></div></div>`;
  const sum = $('#pnS', host), [seed, tree] = $$('.pn__plant svg', host);
  const paint = () => {
    const c = state.plan().checks;
    $$('.pn__day', host).forEach((el) => el.setAttribute('aria-checked', String(c.includes(+el.dataset.i))));
    const n = c.length;
    seed.style.opacity = n >= 6 ? 0 : 1; seed.style.transform = `scale(${0.7 + n * 0.08})`;
    tree.style.opacity = n >= 6 ? 1 : 0; tree.style.transform = n >= 6 ? 'scale(1)' : 'scale(.5)';
    sum.innerHTML = n === 0 ? 'Comece pelo dia 1<small>Marque cada gesto quando fizer.</small>'
      : n === 7 ? 'Plano completo! 🌳<small>Sete gestos pequenos já formam um começo de hábito.</small>'
      : `${n} de 7 gestos<small>${7 - n === 1 ? 'Falta só um.' : `Faltam ${7 - n}.`}</small>`;
  };
  host.addEventListener('click', async (e) => {
    const d = e.target.closest('.pn__day');
    if (d) { state.togglePlan(+d.dataset.i); paint(); host.dispatchEvent(new CustomEvent('csra:caderno', { bubbles: true, detail: { host } })); return; }
    if (e.target.closest('#pnReset')) { state.resetPlan(); paint(); return; }
    if (e.target.closest('#pnShare')) {
      const n = state.plan().checks.length;
      const data = { title: 'Meu plano de 7 dias · CSRA', text: `Estou fazendo um plano de 7 dias de pequenos gestos à mesa (${n}/7 até agora). Vem junto?`, url: 'https://paulorltenorio.github.io/CSRA/' };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(`${data.text} ${data.url}`); ctx.toast('Texto copiado!'); }
      } catch (err) { /* cancelado */ }
    }
  });
  paint();
}
