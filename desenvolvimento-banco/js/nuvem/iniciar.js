// Liga tudo da nuvem ao site: botão no cabeçalho, atalho no rodapé, convite nas interações, painel #/admin e sincronização.
// Módulo opcional (carregado por js/main.js com import() dinâmico): se algo aqui falhar, o site funciona igual, só sem a nuvem.
import { NUVEM } from './config.js';

const ICONE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5 4 4 0 0 1 17.5 18H7z"/></svg>';

export function iniciarNuvem({ toast, refresh }) {
  if (!NUVEM.ativa) return;
  const abrirEspaco = () => import('../ui/espaco.js').then((m) => m.abrir()).catch(() => toast('Não foi possível abrir agora.'));

  // botão "Seu espaço" no cabeçalho (antes do botão de tema) e atalho no rodapé
  const tools = document.querySelector('.hdr__tools');
  if (tools && !document.getElementById('btnEspaco')) {
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'btnEspaco'; b.className = 'icon-btn icon-btn--round';
    b.setAttribute('aria-label', 'Seu espaço: caderno, nuvem e conta'); b.title = 'Seu espaço';
    b.innerHTML = ICONE;
    tools.insertBefore(b, document.getElementById('btnTema'));
    b.addEventListener('click', abrirEspaco);
  }
  const links = document.querySelector('.ftr__links');
  if (links && !document.getElementById('btnEspaco2')) {
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'btnEspaco2'; b.className = 'linklike'; b.textContent = 'Seu espaço';
    b.addEventListener('click', abrirEspaco);
    links.appendChild(b);
  }
  window.addEventListener('csra:espaco', abrirEspaco);

  // convite para guardar na nuvem: as interações avisam quando a pessoa escreve ou marca algo
  document.addEventListener('csra:caderno', (e) => {
    const host = e.detail && e.detail.host;
    import('../ui/convite.js').then((m) => m.oferecer(host, { toast })).catch(() => { /* sem convite */ });
  });

  // o caderno mudou por causa da nuvem (outro aparelho): atualiza a tela inicial
  window.addEventListener('csra:estado', () => { try { refresh(); } catch (e) { /* ignora */ } });

  // painel de moderação (não há link para ele: só o endereço #/admin)
  if (NUVEM.admin) {
    const rota = () => { if (/^#\/admin/.test(location.hash)) import('../ui/admin.js').then((m) => m.abrir({ toast })).catch(() => toast('Não foi possível abrir o painel.')); };
    window.addEventListener('hashchange', rota);
    rota();
  }

  // se a pessoa já autorizou antes, volta a sincronizar (com calma, depois da página pronta)
  setTimeout(() => import('./caderno.js').then((m) => m.iniciar()).catch(() => { /* sem sincronização */ }), 1200);
}
