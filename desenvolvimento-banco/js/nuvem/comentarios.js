// Comentários de cada parada. Leitura é pública (só os aprovados); escrever cria um usuário anônimo se ainda não houver.
// Regras do servidor: um comentário por pessoa por parada (id "<uid>_<parada>"), texto de 3 a 600 letras, sem links.
import * as N from './nuvem.js';
import { PARADAS } from './config.js';
import { validarComentario } from './validar.js';

const CACHE_MS = 5 * 60 * 1000; // a lista de uma parada só é relida depois de 5 min (as leituras diárias do plano grátis são limitadas)
const cache = new Map();
const ts = (x) => (x && typeof x.toDate === 'function' ? x.toDate() : null);

export class ErroValidacao extends Error {
  constructor(msg, campo) { super(msg); this.name = 'ErroValidacao'; this.campo = campo; }
}

// comentários aprovados, do mais novo para o mais antigo
export async function listar(parada, { forcar = false } = {}) {
  const c = cache.get(parada);
  if (!forcar && c && Date.now() - c.t < CACHE_MS) return c.itens;
  const S = await N.sdk();
  const { collection, query, orderBy, limit, getDocs } = S.fsM;
  const snap = await getDocs(query(collection(S.db, 'paradas', parada, 'comentarios'), orderBy('criadoEm', 'desc'), limit(30)));
  const itens = snap.docs.map((d) => {
    const x = d.data();
    return { id: d.id, uid: x.uid, nome: x.nome || '', texto: x.texto || '', criadoEm: ts(x.criadoEm) };
  });
  cache.set(parada, { t: Date.now(), itens });
  return itens;
}

// o comentário desta pessoa nesta parada: 'nenhum' | 'pendente' | 'publicado'. Não cria usuário.
export async function meu(parada) {
  const S = await N.sdk();
  const u = await N.usuarioAtual();
  if (!u) return { estado: 'nenhum' };
  const id = `${u.uid}_${parada}`;
  const { doc, getDoc } = S.fsM;
  const [pend, pub] = await Promise.all([getDoc(doc(S.db, 'comentarios_pendentes', id)), getDoc(doc(S.db, 'paradas', parada, 'comentarios', id))]);
  if (pend.exists()) { const x = pend.data(); return { estado: 'pendente', id, nome: x.nome || '', texto: x.texto || '', criadoEm: ts(x.criadoEm) }; }
  if (pub.exists()) { const x = pub.data(); return { estado: 'publicado', id, nome: x.nome || '', texto: x.texto || '', criadoEm: ts(x.criadoEm) }; }
  return { estado: 'nenhum', id };
}

// envia para aprovação
export async function enviar(parada, { nome, texto }) {
  const v = validarComentario({ nome, texto });
  if (!v.ok) throw new ErroValidacao(v.erro, v.campo);
  const u = await N.garantirUsuario();
  const S = await N.sdk();
  const { doc, setDoc, serverTimestamp } = S.fsM;
  const id = `${u.uid}_${parada}`;
  await setDoc(doc(S.db, 'comentarios_pendentes', id), { uid: u.uid, parada, texto: v.texto, ...(v.nome ? { nome: v.nome } : {}), criadoEm: serverTimestamp() });
  cache.delete(parada);
  return { id, texto: v.texto, nome: v.nome };
}

// apaga o comentário da pessoa (pendente e publicado) nesta parada
export async function apagarMeu(parada) {
  const S = await N.sdk();
  const u = await N.usuarioAtual();
  if (!u) return;
  const id = `${u.uid}_${parada}`;
  const { doc, writeBatch } = S.fsM;
  const lote = writeBatch(S.db);
  lote.delete(doc(S.db, 'comentarios_pendentes', id));
  lote.delete(doc(S.db, 'paradas', parada, 'comentarios', id));
  await lote.commit();
  cache.delete(parada);
}

// todos os comentários da pessoa (para "Baixar meus dados")
export async function todosOsMeus() {
  const u = await N.usuarioAtual();
  if (!u) return [];
  const saida = [];
  for (const p of PARADAS) {
    const m = await meu(p);
    if (m.estado !== 'nenhum') saida.push({ parada: p, situacao: m.estado, nome: m.nome, texto: m.texto, enviadoEm: m.criadoEm ? m.criadoEm.toISOString() : null });
  }
  return saida;
}
export const limparCache = () => cache.clear();
