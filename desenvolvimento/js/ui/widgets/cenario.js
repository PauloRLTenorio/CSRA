// "O que você diria?": três situações do dia a dia. Sem nota: só reflexão.
import { $, $$, esc } from './util.js';

// hl: frase do livro (não aparece na tela) que o link da referência destaca, quando a passagem tem vários parágrafos
export const SC = [
  {
    q: 'Na mesa do trabalho, um colega estranha o que você está comendo e pergunta por quê.',
    o: [
      { t: 'Explica tudo e diz que ele está errado.', c: 'bad', f: 'Persuasão, não imposição. O livro pede para guiar, e não fustigar: quem corrige à força costuma despertar resistência.', r: 'Cap. 25, §§ 798 e 800' },
      { t: 'Conta com simplicidade o que faz bem a você, sem pressão.', c: 'good', f: 'É o espírito do livro: o exemplo e a simpatia vêm antes das palavras.', r: 'Cap. 25, §§ 791 e 798' },
      { t: 'Muda de assunto e come como todo mundo para evitar conflito.', c: 'mid', f: 'Evitar atrito é compreensível, mas o livro valoriza a coerência: firme com gentileza, sem esconder nem impor.', r: 'Cap. 11, § 315' },
    ],
  },
  {
    q: 'Um parente mais velho sempre comeu de um jeito e não aceita mudanças.',
    o: [
      { t: 'Troca tudo na casa dele de uma vez.', c: 'bad', f: 'O livro alerta contra mudanças bruscas e contra transformar a comida em teste para os outros.', r: 'Cap. 25, § 800' },
      { t: 'Começa por um prato simples e gostoso que ele possa aprovar.', c: 'good', f: 'Primeiro ensinar a preparar comida saudável, saborosa e barata. Depois, se for o caso, ir além.', r: 'Cap. 25, § 793', hl: 'Até que possamos ensiná-las a prepararem alimento saudável que seja apetitoso' },
      { t: 'Desiste e não fala mais no assunto.', c: 'mid', f: 'O livro reconhece que há tempo de calar. Mas o exemplo e o prato bem feito continuam sendo um convite silencioso.', r: 'Cap. 25, § 796', hl: 'Há tempo para falar, e tempo para calar.' },
    ],
  },
  {
    q: 'Almoço de família, mesa farta, muitos pratos diferentes.',
    o: [
      { t: 'Prova de todos, para não fazer desfeita.', c: 'mid', f: 'Gentileza não exige provar tudo. Para o livro, importa mais comer o que nos faz bem do que provar de cada prato.', r: 'Cap. 5, § 187' },
      { t: 'Escolhe poucos pratos, come devagar e agradece a quem cozinhou.', c: 'good', f: 'Duas ou três espécies por refeição, sem culpar quem serve. Gratidão e calma à mesa.', r: 'Cap. 8, § 264; Cap. 5, § 175', hl: 'comei devagar e satisfeitos, o coração cheio de gratidão' },
      { t: 'Critica o cardápio em voz alta.', c: 'bad', f: 'O livro pede “moderação conhecida de todos”, mas como testemunho que se vê, não como discussão que se vence.', r: 'Cap. 21, § 592', hl: 'Seja a vossa moderação conhecida a todos os homens.' },
    ],
  },
];
const TAG = { good: 'Boa escolha', mid: 'Dá para melhorar', bad: 'Cuidado' };

export function mount(host) {
  let i = 0;
  const draw = () => {
    const s = SC[i];
    host.innerHTML = `<div class="w cn">
      <span class="cn__n">Situação ${i + 1} de ${SC.length}</span>
      <p class="cn__q">${s.q}</p>
      <div class="cn__opts" role="group" aria-label="Respostas">${s.o.map((o, k) => `<button type="button" class="cn__opt" data-k="${k}">${o.t}</button>`).join('')}</div>
      <div id="cnF" aria-live="polite"></div></div>`;
    host.querySelector('.cn__opts').addEventListener('click', (e) => {
      const b = e.target.closest('.cn__opt'); if (!b) return;
      const o = s.o[+b.dataset.k];
      $$('.cn__opt', host).forEach((x) => x.classList.toggle('is-pick', x === b));
      const last = i === SC.length - 1;
      $('#cnF', host).innerHTML = `<div class="cn__fb t-${o.c}"><b>${TAG[o.c]}</b>${o.f}<small${o.hl ? ` data-q="${esc(o.hl)}"` : ''}>${o.r}</small></div>
        <div class="w-row" style="margin-top:8px"><button type="button" class="w-btn w-btn--pri" id="cnN">${last ? 'Recomeçar' : 'Próxima situação'}</button></div>`;
      $('#cnN', host).addEventListener('click', () => { i = last ? 0 : i + 1; draw(); });
    });
  };
  draw();
}
