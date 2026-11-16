// "Conversa": comentários dos leitores nesta parada. Só aparecem os aprovados; quem escreve não precisa de cadastro
// (o site cria um usuário anônimo na hora de enviar). Quem só lê não cria nada. Se a nuvem falhar, o resto do cartão segue funcionando.
import { $, esc } from './util.js';

const RASC = (p) => `csra.rasc.${p}`; // rascunho do que a pessoa estava escrevendo, para não perder o texto
const lerRasc = (p) => { try { return JSON.parse(localStorage.getItem(RASC(p)) || 'null') || {}; } catch (e) { return {}; } };
const gravarRasc = (p, v) => { try { if (v && (v.texto || v.nome)) localStorage.setItem(RASC(p), JSON.stringify(v)); else localStorage.removeItem(RASC(p)); } catch (e) { /* ignora */ } };
const abrirEspaco = () => window.dispatchEvent(new CustomEvent('csra:espaco'));

export function mount(host, card, ctx) {
  const parada = ctx.story.id;
  let vivo = true;
  host.innerHTML = `<div class="w cv" id="cv">
    <div class="cv__lista" id="cvL" aria-live="polite" aria-busy="true"><p class="cv__estado cv__estado--carrega">Carregando os comentários…</p></div>
    <div class="cv__rodape" id="cvR"></div>
  </div>`;
  const raiz = $('#cv', host), lista = $('#cvL', host), rodape = $('#cvR', host);

  // ao digitar no celular o teclado ocupa metade da tela: a lista some enquanto a pessoa escreve
  raiz.addEventListener('focusin', (e) => { if (e.target.matches('textarea, input')) raiz.classList.add('cv--digitando'); });
  raiz.addEventListener('focusout', () => setTimeout(() => { if (!raiz.contains(document.activeElement)) raiz.classList.remove('cv--digitando'); }, 120));
  raiz.addEventListener('click', (e) => { if (e.target.closest('[data-espaco]')) abrirEspaco(); });

  let M = null; // módulos carregados
  async function modulos() {
    if (!M) {
      const [N, C, V, E] = await Promise.all([import('../../nuvem/nuvem.js'), import('../../nuvem/comentarios.js'), import('../../nuvem/validar.js'), import('../../nuvem/erros.js')]);
      M = { N, C, V, E };
    }
    return M;
  }

  function desenharLista(itens, meuUid) {
    lista.setAttribute('aria-busy', 'false');
    lista.classList.toggle('cv__lista--centro', !itens.length);
    if (!itens.length) { lista.innerHTML = '<p class="cv__estado">Ainda não há comentários aprovados nesta parada. Que tal ser a primeira pessoa?</p>'; return; }
    const { V } = M;
    lista.innerHTML = `<ul class="cv__itens">${itens.map((i) => `<li class="cv__item${i.uid && i.uid === meuUid ? ' cv__item--meu' : ''}">
      <div class="cv__cab"><b>${esc(i.nome || 'Leitor')}</b>${i.uid && i.uid === meuUid ? '<span class="cv__selo">você</span>' : ''}<span class="cv__quando">${esc(V.quando(i.criadoEm))}</span></div>
      <p class="cv__txt">${esc(i.texto)}</p></li>`).join('')}</ul>`;
  }

  const aviso = (nuvemTipo) => `<p class="cv__aviso">Sem cadastro: ligado a um código anônimo deste navegador.${nuvemTipo === 'anonimo' ? ' Para não perder o acesso em outro aparelho, <button type="button" class="cv__link" data-espaco>entre com o Google</button> (opcional).' : ' <button type="button" class="cv__link" data-espaco>Como funciona</button>'}</p>`;

  function desenharForm(rasc) {
    rodape.innerHTML = `<form class="cv__form" id="cvF" novalidate>
      <label class="sv__sr" for="cvT">Seu comentário</label>
      <textarea id="cvT" class="rq__t cv__t" rows="3" maxlength="600" placeholder="O que você pensou, aprendeu ou viveu? Aparece para todos depois de aprovado."></textarea>
      <div class="cv__linha">
        <label class="sv__sr" for="cvN">Seu nome (opcional)</label>
        <input id="cvN" class="cv__nome" type="text" maxlength="40" placeholder="Seu nome (opcional)" autocomplete="nickname" enterkeyhint="done">
        <span class="cv__cont" id="cvC" aria-hidden="true">0/600</span>
      </div>
      <p class="cv__erro" id="cvE" role="alert" hidden></p>
      <button type="submit" class="w-btn w-btn--pri cv__enviar" id="cvB" disabled>Enviar para aprovação</button>
    </form>${aviso(M.N.estado().tipo)}`;
    const t = $('#cvT', rodape), n = $('#cvN', rodape), c = $('#cvC', rodape), e = $('#cvE', rodape), b = $('#cvB', rodape), f = $('#cvF', rodape);
    t.value = (rasc && rasc.texto) || ''; n.value = (rasc && rasc.nome) || '';
    let tr = 0;
    const checar = () => {
      const { V } = M;
      const cru = t.value.trim();
      c.textContent = `${t.value.length}/600`;
      c.classList.toggle('is-perto', t.value.length > 540);
      const v = V.validarComentario({ nome: n.value, texto: t.value });
      const mostrar = !v.ok && cru.length > 0 && (v.campo === 'nome' || cru.length >= 3);
      e.hidden = !mostrar; e.textContent = mostrar ? v.erro : '';
      b.disabled = !v.ok;
      clearTimeout(tr); tr = setTimeout(() => gravarRasc(parada, { texto: t.value, nome: n.value }), 400);
    };
    t.addEventListener('input', checar); n.addEventListener('input', checar);
    checar();
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const { C, V, E } = M;
      const v = V.validarComentario({ nome: n.value, texto: t.value });
      if (!v.ok) { e.hidden = false; e.textContent = v.erro; return; }
      b.disabled = true; b.textContent = 'Enviando…'; e.hidden = true;
      try {
        await C.enviar(parada, { nome: n.value, texto: t.value });
        clearTimeout(tr); gravarRasc(parada, null);
        ctx.toast('Recebido! Aparece depois da aprovação.');
        if (vivo) await atualizarMeu();
      } catch (err) {
        if (!vivo) return;
        b.textContent = 'Enviar para aprovação'; b.disabled = false;
        e.hidden = false; e.textContent = (err && err.name === 'ErroValidacao') ? err.message : (E.mensagemDeErro(err) || 'Não foi possível enviar.');
      }
    });
  }

  function desenharMeu(m) {
    const pend = m.estado === 'pendente';
    rodape.innerHTML = `<div class="cv__meu" data-estado="${m.estado}">
      <p class="cv__meu-t"><b>Seu comentário</b><span class="cv__selo ${pend ? 'cv__selo--espera' : ''}">${pend ? 'aguardando aprovação' : 'publicado'}</span></p>
      ${pend ? `<p class="cv__txt">${esc(m.texto)}</p>` : ''}
      <p class="cv__meu-d">${pend ? 'Só você vê por enquanto. Ele aparece para todos quando for aprovado.' : 'Já aparece na lista para todos.'}</p>
      <button type="button" class="w-btn cv__apagar" id="cvX">Apagar meu comentário</button>
      <p class="cv__erro" id="cvE" role="alert" hidden></p>
    </div>${aviso(M.N.estado().tipo)}`;
    const x = $('#cvX', rodape), e = $('#cvE', rodape);
    x.addEventListener('click', async () => {
      x.disabled = true; x.textContent = 'Apagando…';
      try { await M.C.apagarMeu(parada); ctx.toast('Comentário apagado.'); if (vivo) await carregar(true); }
      catch (err) { x.disabled = false; x.textContent = 'Apagar meu comentário'; e.hidden = false; e.textContent = M.E.mensagemDeErro(err); }
    });
  }

  async function atualizarMeu() {
    const m = await M.C.meu(parada).catch(() => ({ estado: 'nenhum' }));
    if (!vivo) return;
    if (m.estado === 'nenhum') desenharForm(lerRasc(parada)); else desenharMeu(m);
    if (m.estado === 'publicado') { const itens = await M.C.listar(parada, { forcar: true }).catch(() => null); if (itens && vivo) desenharLista(itens, M.N.estado().uid); }
  }

  async function carregar(forcar = false) {
    lista.setAttribute('aria-busy', 'true');
    lista.classList.add('cv__lista--centro');
    lista.innerHTML = '<p class="cv__estado cv__estado--carrega">Carregando os comentários…</p>';
    try {
      await modulos();
      const [itens, m] = await Promise.all([M.C.listar(parada, { forcar }), M.C.meu(parada).catch(() => ({ estado: 'nenhum' }))]);
      if (!vivo) return;
      desenharLista(itens, M.N.estado().uid);
      if (m.estado === 'nenhum') desenharForm(lerRasc(parada)); else desenharMeu(m);
    } catch (err) {
      if (!vivo) return;
      let msg = 'Não foi possível carregar os comentários agora.';
      try { const E = (await modulos()).E; msg = E.mensagemDeErro(err) || msg; } catch (e2) { msg = 'Sem conexão com a internet agora. Tente de novo quando voltar.'; }
      lista.setAttribute('aria-busy', 'false');
      lista.classList.add('cv__lista--centro');
      lista.innerHTML = `<div class="cv__estado cv__estado--erro"><p>${esc(msg)}</p><button type="button" class="w-btn" id="cvTent">Tentar de novo</button></div>`;
      rodape.innerHTML = '';
      $('#cvTent', lista).addEventListener('click', () => carregar(true));
    }
  }

  carregar();
  return () => { vivo = false; };
}
