// "Seu espaço": central da pessoa para decidir o que fica guardado (caderno na nuvem), entrar com o Google (opcional),
// baixar ou apagar os próprios dados e entender como tudo funciona. Abre por um diálogo; nada aqui carrega o Firebase
// até a pessoa tocar num botão que precisa dele.
import { state } from '../state.js';
import { NUVEM } from '../nuvem/config.js';

const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = (s, r = document) => r.querySelector(s);

let dlg = null, M = null, confirmando = false, tirar = [];

async function modulos() {
  if (!M) {
    const [N, K, C, E] = await Promise.all([import('../nuvem/nuvem.js'), import('../nuvem/caderno.js'), import('../nuvem/comentarios.js'), import('../nuvem/erros.js')]);
    M = { N, K, C, E };
  }
  return M;
}

const quandoSync = (s) => {
  if (s.status === 'enviando') return 'Sincronizando…';
  if (s.status === 'erro') return `Não foi possível sincronizar agora (${s.erro || 'erro'}). Vamos tentar de novo sozinhos.`;
  if (s.status === 'ok' && s.quando) return `Sincronizado às ${s.quando.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;
  return '';
};

function montar() {
  dlg = document.createElement('dialog');
  dlg.className = 'espaco';
  dlg.id = 'espaco';
  dlg.setAttribute('aria-labelledby', 'esp-t');
  dlg.innerHTML = `<div class="espaco__in">
    <header class="espaco__cab"><h2 id="esp-t">Seu espaço</h2><button type="button" class="espaco__x" data-fechar aria-label="Fechar">${'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'}</button></header>
    <p class="espaco__sub">Aqui você decide o que fica guardado e onde. Para ler e aprender, você não precisa de nada disto: nem cadastro, nem login.</p>

    <section class="espaco__sec" aria-labelledby="esp-c">
      <h3 id="esp-c">Seu caderno</h3>
      <div id="espStatus" aria-live="polite"></div>
      <div class="espaco__acoes" id="espAcoes"></div>
      <p class="espaco__msg" id="espMsg" role="status" hidden></p>
    </section>

    <section class="espaco__sec" aria-labelledby="esp-m">
      <h3 id="esp-m">Seus comentários</h3>
      <p>Cada comentário passa por aprovação antes de aparecer para os outros. Você pode apagar o seu a qualquer momento, no cartão “Conversa” da parada.</p>
    </section>

    <section class="espaco__sec" aria-labelledby="esp-d">
      <h3 id="esp-d">Seus dados</h3>
      <div class="espaco__acoes">
        <button type="button" class="btn btn--ghost" data-acao="baixar">Baixar meus dados</button>
        <button type="button" class="btn btn--ghost espaco__perigo" data-acao="apagar" id="espApagar">Apagar meus dados da nuvem</button>
      </div>
      <p class="espaco__msg" id="espMsg2" role="status" hidden></p>
    </section>

    <section class="espaco__sec" aria-labelledby="esp-f">
      <h3 id="esp-f">Como funciona</h3>
      <details><summary>O que é o “código anônimo”?</summary><p>Um código aleatório criado quando você comenta ou guarda o caderno. Ele fica guardado neste navegador e liga o que você escreveu a você, sem nome, e-mail ou telefone.</p></details>
      <details><summary>E se eu limpar o navegador ou trocar de aparelho?</summary><p>O código se perde, e você deixa de ver e de apagar o que enviou antes. Para isso não acontecer, entre com o Google: o caderno e os comentários passam a acompanhar a sua conta.</p></details>
      <details><summary>O que o Google vê?</summary><p>Usamos o Firebase, do Google, para guardar o caderno e os comentários. O seu navegador só se conecta aos servidores dele quando você abre um cartão de comentários ou autoriza guardar o caderno. Como em qualquer site, o Google recebe o endereço de rede da conexão. Não usamos Google Analytics nem anúncios.</p></details>
      <details><summary>Que dados ficam guardados?</summary><p>Seu caderno (reflexões, plano de 7 dias, progresso) e os comentários que você enviar (nome opcional e texto). Se entrar com o Google, o Firebase também guarda o seu nome e e-mail de login.</p></details>
      <details><summary>Como pedir a remoção de algo?</summary><p>Use “Apagar meu comentário” no cartão, ou “Apagar meus dados da nuvem” aqui. Se você perdeu o acesso, fale com quem mantém o site.</p></details>
    </section>
    <div class="espaco__fim"><button type="button" class="btn btn--primary" data-fechar>Fechar</button></div>
  </div>`;
  document.body.appendChild(dlg);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-fechar]')) { dlg.close(); return; }
    const b = e.target.closest('[data-acao]');
    if (b) acao(b);
  });
  dlg.addEventListener('close', () => { tirar.forEach((f) => f()); tirar = []; confirmando = false; });
}

function msg(texto, tipo = '', alvo = 'espMsg') {
  const el = $(`#${alvo}`, dlg);
  if (!el) return;
  el.textContent = texto || ''; el.hidden = !texto; el.dataset.tipo = tipo;
}

function desenhar() {
  if (!dlg || !M) return;
  const { N, K } = M;
  const e = N.estado(), c = N.consentimento(), s = K.statusSync(), interno = N.interno();
  let h = '';
  const acoes = [];
  if (c !== 'sim') {
    h = '<p><b>Só neste aparelho.</b> Suas reflexões, o plano de 7 dias e o progresso ficam guardados aqui. Se você limpar o navegador ou trocar de aparelho, eles se perdem.</p>';
    acoes.push(['guardar', 'Guardar na nuvem', 'btn btn--primary']);
  } else if (e.tipo === 'google') {
    h = `<p><b>Guardado na nuvem, na conta ${esc(e.email || e.nome || 'Google')}.</b> Em qualquer aparelho, ao entrar com o mesmo Google, você vê tudo. Só você enxerga o seu caderno.</p><p class="espaco__sync">${esc(quandoSync(s))}</p>`;
    acoes.push(['sair', 'Sair desta conta', 'btn btn--ghost'], ['parar', 'Parar de guardar na nuvem', 'btn btn--ghost']);
  } else {
    h = `<p><b>Guardado na nuvem, sem cadastro.</b> Só você vê. Neste navegador tudo continua aparecendo; em outro aparelho, só se você entrar com o Google.</p><p class="espaco__sync">${esc(quandoSync(s))}</p>`;
    if (!interno) acoes.push(['google', 'Entrar com o Google', 'btn btn--primary']);
    acoes.push(['parar', 'Parar de guardar na nuvem', 'btn btn--ghost']);
  }
  if (c !== 'sim' && e.tipo === 'google') {
    h += `<p>Você está conectado com o Google (${esc(e.email || e.nome)}).</p>`;
    acoes.push(['sair', 'Sair desta conta', 'btn btn--ghost']);
  }
  if (interno && e.tipo !== 'google') {
    h += `<p class="espaco__alerta">Você abriu o site dentro do <b>${esc(interno)}</b>. O Google não deixa entrar com a conta por aqui. Para entrar, abra este endereço no <b>Chrome</b> ou no <b>Safari</b>.</p>`;
    acoes.push(['copiar', 'Copiar o link do site', 'btn btn--ghost']);
  }
  $('#espStatus', dlg).innerHTML = h;
  $('#espAcoes', dlg).innerHTML = acoes.map(([a, t, k]) => `<button type="button" class="${k}" data-acao="${a}">${t}</button>`).join('');
  const ap = $('#espApagar', dlg);
  if (ap && !confirmando) { ap.textContent = 'Apagar meus dados da nuvem'; ap.classList.remove('is-confirmar'); }
}

async function acao(b) {
  const a = b.dataset.acao;
  const { N, K, C, E } = await modulos();
  const original = b.textContent;
  const livre = () => { b.disabled = false; b.textContent = original; };
  let manter = false; // true: o botão de apagar ficou esperando a confirmação (não restaurar o texto)
  try {
    if (a === 'guardar') {
      b.disabled = true; b.textContent = 'Guardando…'; msg('');
      await K.ativar();
      msg('Pronto! Seu caderno agora fica guardado na nuvem, sem cadastro.', 'ok');
    } else if (a === 'parar') {
      K.desativar(); msg('Certo. O caderno volta a ficar só neste aparelho. O que já foi enviado continua na nuvem até você apagar.', 'ok');
    } else if (a === 'google') {
      b.disabled = true; b.textContent = 'Abrindo o Google…'; msg('');
      const r = await N.entrarComGoogle();
      if (N.consentimento() === 'sim') K.agendar(300);
      msg(r.trocou ? 'Você entrou numa conta que já existia. O caderno deste aparelho foi combinado com o dela.' : 'Pronto! Agora você está conectado com o Google.', 'ok');
    } else if (a === 'sair') {
      b.disabled = true;
      await N.sair(); K.desativar();
      msg('Você saiu da conta. O caderno continua neste aparelho.', 'ok');
    } else if (a === 'copiar') {
      const url = location.href.split('#')[0];
      try { await navigator.clipboard.writeText(url); msg('Link copiado! Cole no Chrome ou no Safari.', 'ok'); } catch (err) { msg(url, ''); }
    } else if (a === 'baixar') {
      b.disabled = true; b.textContent = 'Preparando…';
      const dados = { site: 'CSRA', ambiente: NUVEM.ambiente, exportadoEm: new Date().toISOString(), caderno: state.snapshot(), comentarios: [] };
      try { dados.comentarios = await C.todosOsMeus(); } catch (err) { dados.aviso = 'Os comentários da nuvem não puderam ser lidos agora.'; }
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); link.download = 'csra-meus-dados.json';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 4000);
      msg('Arquivo baixado.', 'ok', 'espMsg2');
    } else if (a === 'apagar') {
      if (!confirmando) {
        confirmando = true; b.textContent = 'Tem certeza? Toque de novo para apagar'; b.classList.add('is-confirmar');
        setTimeout(() => { if (confirmando) { confirmando = false; desenhar(); } }, 6000);
        manter = true;
        return;
      }
      confirmando = false; b.disabled = true; b.textContent = 'Apagando…';
      K.desativar();
      const apagou = await N.apagarMeusDados();
      C.limparCache();
      msg(apagou ? 'Pronto. Apagamos seu caderno e seus comentários da nuvem. O que está neste aparelho continua aqui.' : 'Não havia nada seu na nuvem.', 'ok', 'espMsg2');
    }
  } catch (err) {
    const t = E.mensagemDeErro(err);
    if (t) msg(t, 'erro', a === 'apagar' || a === 'baixar' ? 'espMsg2' : 'espMsg');
  } finally {
    if (!manter) { livre(); desenhar(); }
  }
}

export async function abrir() {
  await modulos();
  if (!dlg) montar();
  if (dlg.open) return;
  msg(''); msg('', '', 'espMsg2');
  desenhar();
  tirar.push(M.N.assinar(desenhar));
  const aoSync = () => desenhar();
  window.addEventListener('csra:sync', aoSync);
  tirar.push(() => window.removeEventListener('csra:sync', aoSync));
  try { dlg.showModal(); } catch (e) { /* já aberto */ }
}
