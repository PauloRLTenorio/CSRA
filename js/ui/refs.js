// Referências ao livro viram links que abrem o trecho exato no site oficial (m.egwwritings.org), para conferir na fonte.
// Funciona sobre qualquer texto da página: basta escrever "Cap. 4, § 111" (ou "Cap. 4, §§ 144–146", "Cap. 19, §§ 531 e 544",
// "Cap. 5, “Título da seção”", "Caps. 12 e 13", "Apêndice 1, § 25") e o link aparece sozinho. Os IDs ficam em js/data/egw.js (gerado).
// Quando a referência está junto de uma citação literal (elemento com data-q), o link também destaca a frase na página do livro.
import { LIVRO_SITE } from '../data/livro.js';
import { CAPS, PASSAGENS, AP1, TITULOS, CITACOES } from '../data/egw.js';

const N = '\\d{1,3}';
const ITEM = `${N}(?:\\s*[–-]\\s*${N})?`;
const LISTA = `${ITEM}(?:\\s*(?:e|,)\\s*${ITEM})*`;
// 1 rótulo · 2 capítulo · 3 segundo capítulo ("Caps. 12 e 13") · 4 §/§§ · 5 lista de passagens · 6 título entre aspas
const RE = new RegExp(`(Caps?\\.|Apêndice)\\s*(\\d{1,2})(?:\\s+e\\s+(\\d{1,2}))?(?:,\\s*(?:(§§?)\\s*(${LISTA})|“([^”]{3,100})”))?`, 'g');
const IGNORAR = 'a, script, style, textarea, input, select, noscript, [data-no-ref]';

const url = (p, frase) => `${LIVRO_SITE}.${p[0]}#${p[1]}${frase ? `:~:text=${frase}` : ''}`;
const capitulo = (c) => (CAPS[c] ? [CAPS[c], CAPS[c]] : null);

function link(txt, href, dica) {
  const a = document.createElement('a');
  a.className = 'egw-ref';
  a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
  a.dataset.egw = '';
  a.title = dica;
  a.setAttribute('aria-label', `${txt}: ${dica} (abre em outra aba)`);
  a.textContent = txt;
  return a;
}

// o texto de uma citação literal junto de uma referência (se o elemento ou um ancestral tiver data-q)
function citacaoDe(no) {
  const el = no.parentElement && no.parentElement.closest('[data-q]');
  return el ? CITACOES[el.dataset.q] || null : null;
}

function nodosDe(m, cit) {
  const [, rot, c1, c2, , lista, titulo] = m;
  const ap = rot === 'Apêndice';
  const cap = ap ? `a${c1}` : c1;
  const out = [];

  if (lista) { // passagens numeradas (§)
    lista.split(/(\s*(?:e|,)\s*)/).forEach((p, i) => { // itens e separadores, alternados
      if (i % 2) { out.push(p); return; }
      const [a, b] = p.split(/\s*[–-]\s*/).map(Number);
      const alvo = ap ? AP1[a] : PASSAGENS[a];
      const txt = `${i === 0 ? `${rot} ${c1}, ` : ''}${b ? '§§' : '§'} ${p}`;
      if (!alvo) { out.push(txt); return; }
      const dentro = cit && cit.n >= a && cit.n <= (b || a); // a citação literal está neste trecho: destaca a frase
      out.push(link(txt, url(dentro ? cit.u : alvo, dentro ? cit.u[2] : ''), dentro ? 'Conferir no livro, com a frase destacada' : 'Conferir no livro'));
    });
    return out;
  }

  // capítulo ou seção (com ou sem título entre aspas)
  const alvo = (titulo && TITULOS[`${cap}:${titulo}`]) || capitulo(cap);
  const txt = titulo ? `${rot} ${c1}, “${titulo}”` : `${rot} ${c1}`;
  out.push(alvo ? link(txt, url(alvo), titulo && TITULOS[`${cap}:${titulo}`] ? 'Abrir esta parte no livro' : 'Abrir o capítulo no livro') : txt);
  if (c2) { // "Caps. 12 e 13"
    out.push(' e ');
    const a2 = capitulo(c2);
    out.push(a2 ? link(c2, url(a2), 'Abrir o capítulo no livro') : c2);
  }
  return out;
}

export function linkar(raiz) {
  const nos = [];
  if (raiz.nodeType === 3) nos.push(raiz);
  else if (raiz.nodeType === 1) {
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) nos.push(n);
  }
  for (const no of nos) {
    const t = no.nodeValue;
    if (!t || (t.indexOf('Cap') < 0 && t.indexOf('Apêndice') < 0)) continue;
    const pai = no.parentElement;
    if (!pai || pai.closest(IGNORAR)) continue;
    const ms = [...t.matchAll(RE)];
    if (!ms.length) continue;
    const cit = citacaoDe(no);
    const frag = document.createDocumentFragment();
    let pos = 0;
    for (const m of ms) {
      if (m.index > pos) frag.append(t.slice(pos, m.index));
      frag.append(...nodosDe(m, cit));
      pos = m.index + m[0].length;
    }
    if (pos < t.length) frag.append(t.slice(pos));
    no.replaceWith(frag);
  }
}

// liga os links agora e sempre que o conteúdo da página mudar (cartões novos, mensagens das interações)
export function observarRefs(raiz) {
  linkar(raiz);
  if (!('MutationObserver' in window)) return;
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'characterData') linkar(m.target);
      else m.addedNodes.forEach((n) => linkar(n));
    }
  }).observe(raiz, { childList: true, subtree: true, characterData: true });
}
