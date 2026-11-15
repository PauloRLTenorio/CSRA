// Painel de moderação (#/admin): só funciona para quem está na lista de administradores (config/admin no Firestore).
// Quem não é administrador vê apenas um aviso. Não há link para esta tela em lugar nenhum do site.
import { STORIES } from '../data/stories.js';

const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = (s, r = document) => r.querySelector(s);
const TITULO = Object.fromEntries(STORIES.map((s) => [s.id, `${s.n}. ${s.title}`]));

let dlg = null, M = null, aba = 'pendentes', toast = () => {};

async function modulos() {
  if (!M) {
    const [N, C, V, E] = await Promise.all([import('../nuvem/nuvem.js'), import('../nuvem/comentarios.js'), import('../nuvem/validar.js'), import('../nuvem/erros.js')]);
    M = { N, C, V, E };
  }
  return M;
}

function montar() {
  dlg = document.createElement('dialog');
  dlg.className = 'espaco admin';
  dlg.id = 'admin';
  dlg.setAttribute('aria-labelledby', 'adm-t');
  dlg.innerHTML = `<div class="espaco__in">
    <header class="espaco__cab"><h2 id="adm-t">Moderação de comentários</h2><button type="button" class="espaco__x" data-fechar aria-label="Fechar"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <div id="admCorpo" aria-live="polite"></div>
  </div>`;
  document.body.appendChild(dlg);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-fechar]')) { dlg.close(); return; }
    const b = e.target.closest('[data-adm]');
    if (b) agir(b);
  });
  dlg.addEventListener('close', () => { if (/^#\/admin/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); });
}

const corpo = () => $('#admCorpo', dlg);

async function ehAdmin(S, u) {
  // quem é administrador consegue listar os pendentes; os outros recebem "permissão negada"
  try { await S.fsM.getDocs(S.fsM.query(S.fsM.collection(S.db, 'comentarios_pendentes'), S.fsM.limit(1))); return true; } catch (e) { return false; }
}

async function desenhar() {
  const { N, E } = await modulos();
  const c = corpo();
  c.innerHTML = '<p class="cv__estado cv__estado--carrega">Verificando…</p>';
  let S, u;
  try { S = await N.sdk(); u = await N.usuarioAtual(); } catch (e) { c.innerHTML = `<p class="espaco__alerta">${esc(E.mensagemDeErro(e))}</p>`; return; }
  if (!u || u.isAnonymous) {
    c.innerHTML = `<p>Entre com a conta Google de administrador para moderar os comentários.</p>
      ${N.interno() ? `<p class="espaco__alerta">Abra este endereço no Chrome ou no Safari: o Google não deixa entrar por dentro do ${esc(N.interno())}.</p>` : '<div class="espaco__acoes"><button type="button" class="btn btn--primary" data-adm="entrar">Entrar com o Google</button></div>'}
      <p class="espaco__msg" id="admMsg" role="status" hidden></p>`;
    return;
  }
  if (!(await ehAdmin(S, u))) {
    c.innerHTML = `<p class="espaco__alerta">A conta <b>${esc(u.email || u.displayName || 'atual')}</b> não é de administradora.</p>
      <p>Para dar acesso, acrescente este código em <code>config/admin</code> (campo <code>uids</code>) no Firestore:</p>
      <p><code class="admin__uid">${esc(u.uid)}</code></p>
      <div class="espaco__acoes"><button type="button" class="btn btn--ghost" data-adm="copiar" data-uid="${esc(u.uid)}">Copiar o código</button><button type="button" class="btn btn--ghost" data-adm="sair">Sair desta conta</button></div>
      <p class="espaco__msg" id="admMsg" role="status" hidden></p>`;
    return;
  }
  c.innerHTML = `<div class="admin__abas" role="tablist">
      <button type="button" role="tab" class="admin__aba" data-adm="aba" data-aba="pendentes" aria-selected="${aba === 'pendentes'}">Aguardando</button>
      <button type="button" role="tab" class="admin__aba" data-adm="aba" data-aba="publicados" aria-selected="${aba === 'publicados'}">Publicados</button>
      <button type="button" class="admin__atualizar" data-adm="atualizar">Atualizar</button>
    </div>
    <div id="admLista"><p class="cv__estado cv__estado--carrega">Carregando…</p></div>
    <p class="espaco__msg" id="admMsg" role="status" hidden></p>`;
  aba === 'pendentes' ? listarPendentes() : listarPublicados();
}

const dataBr = (d) => (d ? d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const dataDe = (x) => (x && typeof x.toDate === 'function' ? x.toDate() : null);

async function listarPendentes() {
  const { N, E } = M;
  const alvo = $('#admLista', dlg);
  try {
    const S = await N.sdk();
    const { collection, query, orderBy, limit, getDocs } = S.fsM;
    const snap = await getDocs(query(collection(S.db, 'comentarios_pendentes'), orderBy('criadoEm', 'asc'), limit(100)));
    if (snap.empty) { alvo.innerHTML = '<p class="cv__estado">Nenhum comentário aguardando aprovação.</p>'; return; }
    alvo.innerHTML = `<ul class="cv__itens admin__itens">${snap.docs.map((d) => {
      const x = d.data();
      return `<li class="cv__item" data-id="${esc(d.id)}" data-parada="${esc(x.parada)}">
        <div class="cv__cab"><b>${esc(x.nome || 'Leitor')}</b><span class="cv__quando">${esc(dataBr(dataDe(x.criadoEm)))}</span></div>
        <p class="admin__onde">${esc(TITULO[x.parada] || x.parada)}</p>
        <p class="cv__txt">${esc(x.texto)}</p>
        <div class="espaco__acoes"><button type="button" class="btn btn--primary" data-adm="aprovar">Aprovar</button><button type="button" class="btn btn--ghost espaco__perigo" data-adm="rejeitar">Apagar</button></div>
      </li>`;
    }).join('')}</ul>`;
  } catch (e) { alvo.innerHTML = `<p class="espaco__alerta">${esc(E.mensagemDeErro(e))}</p>`; }
}

async function listarPublicados() {
  const { C, E } = M;
  const alvo = $('#admLista', dlg);
  alvo.innerHTML = `<label class="admin__sel">Parada <select id="admParada">${STORIES.filter((s) => s.n > 0).map((s) => `<option value="${esc(s.id)}">${esc(TITULO[s.id])}</option>`).join('')}</select></label><div id="admPub"></div>`;
  const sel = $('#admParada', dlg);
  const carregar = async () => {
    const pub = $('#admPub', dlg);
    pub.innerHTML = '<p class="cv__estado cv__estado--carrega">Carregando…</p>';
    try {
      const itens = await C.listar(sel.value, { forcar: true });
      pub.innerHTML = itens.length ? `<ul class="cv__itens admin__itens">${itens.map((i) => `<li class="cv__item" data-id="${esc(i.id)}" data-parada="${esc(sel.value)}"><div class="cv__cab"><b>${esc(i.nome || 'Leitor')}</b><span class="cv__quando">${esc(dataBr(i.criadoEm))}</span></div><p class="cv__txt">${esc(i.texto)}</p><div class="espaco__acoes"><button type="button" class="btn btn--ghost espaco__perigo" data-adm="despublicar">Apagar</button></div></li>`).join('')}</ul>` : '<p class="cv__estado">Nenhum comentário publicado nesta parada.</p>';
    } catch (e) { pub.innerHTML = `<p class="espaco__alerta">${esc(E.mensagemDeErro(e))}</p>`; }
  };
  sel.addEventListener('change', carregar);
  carregar();
}

const dizer = (t, tipo = '') => { const m = $('#admMsg', dlg); if (m) { m.textContent = t; m.hidden = !t; m.dataset.tipo = tipo; } };

async function agir(b) {
  const a = b.dataset.adm;
  const { N, C, E } = await modulos();
  try {
    if (a === 'entrar') { b.disabled = true; await N.entrarComGoogle(); await desenhar(); return; }
    if (a === 'sair') { await N.sair(); await desenhar(); return; }
    if (a === 'copiar') { try { await navigator.clipboard.writeText(b.dataset.uid); dizer('Código copiado.', 'ok'); } catch (e) { dizer(b.dataset.uid); } return; }
    if (a === 'aba') { aba = b.dataset.aba; await desenhar(); return; }
    if (a === 'atualizar') { await desenhar(); return; }
    const li = b.closest('li'); if (!li) return;
    const id = li.dataset.id, parada = li.dataset.parada;
    const S = await N.sdk();
    const { doc, getDoc, writeBatch, serverTimestamp } = S.fsM;
    b.disabled = true;
    if (a === 'aprovar') {
      const pend = await getDoc(doc(S.db, 'comentarios_pendentes', id));
      if (!pend.exists()) { li.remove(); return; }
      const x = pend.data();
      const lote = writeBatch(S.db);
      lote.set(doc(S.db, 'paradas', parada, 'comentarios', id), { uid: x.uid, ...(x.nome ? { nome: x.nome } : {}), texto: x.texto, criadoEm: x.criadoEm, aprovadoEm: serverTimestamp() });
      lote.delete(doc(S.db, 'comentarios_pendentes', id));
      await lote.commit();
      C.limparCache(); li.remove(); dizer('Aprovado: já aparece para todos.', 'ok');
    } else if (a === 'rejeitar') {
      await S.fsM.deleteDoc(doc(S.db, 'comentarios_pendentes', id)); li.remove(); dizer('Comentário apagado.', 'ok');
    } else if (a === 'despublicar') {
      await S.fsM.deleteDoc(doc(S.db, 'paradas', parada, 'comentarios', id)); C.limparCache(); li.remove(); dizer('Comentário despublicado e apagado.', 'ok');
    }
  } catch (e) { b.disabled = false; dizer(E.mensagemDeErro(e) || 'Não foi possível concluir.', 'erro'); }
}

export async function abrir(opcoes = {}) {
  if (opcoes.toast) toast = opcoes.toast;
  await modulos();
  if (!dlg) montar();
  if (!dlg.open) { try { dlg.showModal(); } catch (e) { /* já aberto */ } }
  desenhar();
}
