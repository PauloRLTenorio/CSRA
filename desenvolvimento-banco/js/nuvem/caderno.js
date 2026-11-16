// Caderno na nuvem: mantém o que está neste aparelho (js/state.js) igual ao que está guardado na conta da pessoa.
// A cada mudança (com uma pausa de ~2 s) faz uma transação: lê a nuvem, junta com o aparelho (merge.js) e grava o resultado.
// Só roda se a pessoa autorizou ("csra.nuvem" = "sim"). Se falhar, o caderno do aparelho continua intacto e tentamos de novo.
import { state } from '../state.js';
import { mesclar, canon, paraNuvem, normalizar } from './merge.js';
import { mensagemDeErro } from './erros.js';
import * as N from './nuvem.js';

let ligado = false, timer = 0, ocupado = false, outraVez = false, falhas = 0, sujo = false, desinscrever = null;
let sync = { status: 'parado', quando: null, erro: '' };

function aviso(p) {
  sync = { ...sync, ...p };
  try { window.dispatchEvent(new CustomEvent('csra:sync', { detail: sync })); } catch (e) { /* ignora */ }
}
export const statusSync = () => sync;

async function conciliar() {
  const S = await N.sdk();
  const u = await N.garantirUsuario();
  const ref = S.fsM.doc(S.db, 'usuarios', u.uid);
  const final = await S.fsM.runTransaction(S.db, async (tx) => {
    const snap = await tx.get(ref);
    const nuvem = snap.exists() ? normalizar(snap.data()) : null;
    const local = state.snapshot();
    const junto = nuvem ? mesclar(local, nuvem) : normalizar(local);
    if (!nuvem || canon(junto) !== canon(nuvem)) tx.set(ref, { v: 1, ...paraNuvem(junto), atualizadoEm: S.fsM.serverTimestamp() });
    return junto;
  });
  // se a pessoa escreveu algo enquanto isso, o que é mais novo vence (e vai na próxima rodada)
  const agora = state.snapshot();
  const resultado = mesclar(agora, final);
  if (canon(resultado) !== canon(agora)) state.aplicar(resultado);
}

async function empurrar() {
  if (!ligado) return;
  if (ocupado) { outraVez = true; return; }
  ocupado = true;
  aviso({ status: 'enviando', erro: '' });
  const antes = sujo; sujo = false;
  try {
    await conciliar();
    falhas = 0;
    aviso({ status: 'ok', quando: new Date(), erro: '' });
  } catch (e) {
    sujo = sujo || antes || true;
    falhas++;
    aviso({ status: 'erro', erro: mensagemDeErro(e) });
    if (ligado) { clearTimeout(timer); timer = setTimeout(empurrar, Math.min(300000, 8000 * 2 ** Math.min(falhas, 5))); }
  } finally {
    ocupado = false;
    if (outraVez) { outraVez = false; agendar(1200); }
  }
}

export function agendar(ms = 2000) {
  if (!ligado) return;
  clearTimeout(timer);
  timer = setTimeout(empurrar, ms);
}

const aoEsconder = () => { if (document.visibilityState === 'hidden' && ligado && sujo) { clearTimeout(timer); empurrar(); } };
const aoVoltarOnline = () => { if (ligado && sync.status === 'erro') agendar(500); };

function ligar() {
  if (ligado) return;
  ligado = true;
  desinscrever = state.subscribe((origem) => { if (origem !== 'nuvem') { sujo = true; agendar(); } });
  document.addEventListener('visibilitychange', aoEsconder);
  addEventListener('online', aoVoltarOnline);
}
export function desligar() {
  ligado = false; clearTimeout(timer);
  if (desinscrever) desinscrever();
  desinscrever = null;
  document.removeEventListener('visibilitychange', aoEsconder);
  removeEventListener('online', aoVoltarOnline);
  aviso({ status: 'parado', erro: '' });
}

// ao abrir o site: se a pessoa já autorizou antes, volta a sincronizar (depois que a página ficou pronta)
export function iniciar() {
  if (N.ativa() && N.consentimento() === 'sim') { ligar(); sujo = true; agendar(1500); }
}

// a pessoa autorizou agora: cria o usuário anônimo (se preciso), junta tudo e liga a sincronização. Lança erro se falhar.
export async function ativar() {
  ligar();
  aviso({ status: 'enviando', erro: '' });
  try {
    await conciliar();
    N.definirConsentimento('sim');
    sujo = false;
    aviso({ status: 'ok', quando: new Date(), erro: '' });
  } catch (e) {
    desligar();
    aviso({ status: 'erro', erro: mensagemDeErro(e) });
    throw e;
  }
}

// a pessoa não quer mais: para de sincronizar (o que já está na nuvem continua lá até ela apagar)
export function desativar() { desligar(); N.definirConsentimento('nao'); }
