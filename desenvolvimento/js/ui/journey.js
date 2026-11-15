// Lista de paradas, progresso (frutos) e atalhos para as interações.
import { STORIES, BY_ID } from '../data/stories.js';
import { state } from '../state.js';
import { icon } from './art.js';
import { img } from '../data/imagens.js';

const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mins = (s) => Math.max(1, Math.round((s.cards.length + 1) * 0.24));

const TOYS = [
  { w: 'prato', story: 'primeiro-cardapio', icon: 'plate', t: 'Monte o primeiro prato', d: 'Quatro grupos, um só jardim.' },
  { w: 'nuvem', story: 'mesa-e-mente', icon: 'cloud', t: 'Nuvem sobre a mente', d: 'O que uma refeição pesada faz com o dia.' },
  { w: 'refeicao', story: 'simples-e-suficiente', icon: 'bowl', t: 'Quantos pratos cabem?', d: 'Monte uma mesa e veja quando pesa.' },
  { w: 'relogio', story: 'ritmo-do-dia', icon: 'clock', t: 'Relógio do dia', d: 'Arraste as refeições e meça o descanso.' },
  { w: 'pausa', story: 'fome-ou-vontade', icon: 'pause', t: 'Pausa de 10 segundos', d: 'Pare, agradeça, escolha.' },
  { w: 'horta', story: 'cozinha-que-cura', icon: 'seedling', t: 'Plante algo', d: 'Do canteiro à cesta.' },
  { w: 'balanca', story: 'sem-extremos', icon: 'scale', t: 'A balança do equilíbrio', d: 'Procure o meio entre dois extremos.' },
  { w: 'remedios', story: 'remedios-simples', icon: 'sun', t: 'Roda dos oito remédios', d: 'Ar, luz, água, repouso e mais.' },
  { w: 'cenario', story: 'mesa-que-abre-portas', icon: 'hands', t: 'O que você diria?', d: 'Três conversas à mesa.' },
  { w: 'plano', story: 'proximo-passo', icon: 'tree', t: 'Plano de 7 dias', d: 'Um gesto pequeno por dia.' },
  { w: 'frase', story: 'proximo-passo', icon: 'book', t: 'Leve uma frase', d: 'Vire a carta e guarde.' },
];

export function toyHref(t) {
  const s = BY_ID[t.story];
  const i = s.cards.findIndex((c) => c.w === t.w);
  return `#/h/${s.id}/${Math.max(0, i)}`;
}

export function renderJourney() {
  const path = $('#path');
  if (!path) return;
  const done = state.doneCount();
  const nextStory = STORIES.find((s) => !state.isDone(s.id));
  path.innerHTML = STORIES.map((s) => {
    const isDone = state.isDone(s.id);
    const started = state.started(s.id);
    const badge = isDone ? '<span class="badge badge--ok">Concluída</span>' : started ? '<span class="badge badge--go">Continuar</span>' : '';
    const pos = started ? `/${state.pos(s.id)}` : '';
    return `<li class="stop reveal${isDone ? ' is-done' : ''}" style="--st-a:${s.theme.a};--st-b:${s.theme.b}">
      <span class="stop__node" aria-hidden="true">${isDone ? '✓' : s.n}</span>
      <a class="stop__card" href="#/h/${s.id}${pos}" aria-label="Parada ${s.n}: ${esc(s.title)}. ${isDone ? 'Concluída.' : ''}">
        <span class="stop__art">${img(`parada-${s.n}`) ? `<img src="${img(`parada-${s.n}`)}" alt="" loading="lazy" decoding="async">` : icon(s.icon)}</span>
        <span class="stop__body">
          <span class="stop__tit">${esc(s.title)}</span>
          <span class="stop__hook">${esc(s.hook)}</span>
          <span class="stop__meta"><span>${s.cards.length} cartões</span><span aria-hidden="true">·</span><span>≈ ${mins(s)} min</span>${badge}</span>
        </span>
      </a></li>`;
  }).join('');

  const tree = $('#tree');
  if (tree) {
    tree.innerHTML = `
      <div class="tree__fruits" aria-hidden="true">${STORIES.map((s) => `<span class="tree__fruit${state.isDone(s.id) ? ' is-on' : ''}">${icon('apple')}</span>`).join('')}</div>
      <span class="tree__txt">${done === 0 ? 'Nenhuma parada concluída ainda' : done === STORIES.length ? 'Jornada completa! 🌳' : `${done} de ${STORIES.length} paradas concluídas`}</span>
      ${nextStory && done > 0 ? `<a class="tree__go" href="#/h/${nextStory.id}${state.started(nextStory.id) ? '/' + state.pos(nextStory.id) : ''}">Continuar: ${esc(nextStory.title)}</a>` : ''}`;
  }

  const toys = $('#toys');
  if (toys && !toys.dataset.ready) {
    toys.dataset.ready = '1';
    toys.innerHTML = TOYS.map((t) => {
      const s = BY_ID[t.story];
      return `<li class="reveal"><a class="toy" href="${toyHref(t)}" style="--st-a:${s.theme.a};--st-b:${s.theme.b}">
        <span class="toy__ic">${icon(t.icon)}</span><span class="toy__t">${esc(t.t)}</span><span class="toy__d">${esc(t.d)}</span></a></li>`;
    }).join('');
  }
  renderNotebook();
  observeReveal();
}

export function renderNotebook() {
  const sec = $('#caderno'); if (!sec) return;
  const notes = state.notes();
  const ids = STORIES.filter((s) => notes[s.id]).map((s) => s.id);
  sec.hidden = ids.length === 0;
  if (!ids.length) return;
  $('#cadernoLista').innerHTML = ids.map((id) => {
    const s = BY_ID[id];
    const card = s.cards.find((c) => c.w === 'reflexao');
    return `<article class="nota"><h3>Parada ${s.n} · ${esc(s.title)}</h3><p class="nota__q">${esc(card ? card.pergunta : '')}</p><p>${esc(notes[id].t)}</p></article>`;
  }).join('');
}

let io;
export function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  io = io || new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e, i) => { e.style.setProperty('--rd', `${(i % 4) * 0.06}s`); io.observe(e); });
}
