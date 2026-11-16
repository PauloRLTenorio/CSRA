// Validação dos comentários. Espelha as regras do Firestore (firestore.rules): quem manda é o servidor,
// aqui só avisamos antes, para a pessoa não perder o texto por causa de uma recusa.
export const LIMITES = { textoMin: 3, textoMax: 600, nomeMax: 40 };

// endereços, e-mails e @ não são aceitos (reduz spam). Mesmo padrão das regras.
const PADRAO_LINK = /(https?:|www\.|@|[a-z0-9-]+\.(com|net|org|br|io|me|xyz|info|app|site|link)\b)/i;
export const temLink = (t) => PADRAO_LINK.test(String(t == null ? '' : t));

export function limparTexto(t) {
  return String(t == null ? '' : t).replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
export function limparNome(n) {
  return String(n == null ? '' : n).replace(/\s+/g, ' ').trim();
}

// devolve { ok, texto, nome } ou { ok:false, campo, erro, texto, nome }
export function validarComentario({ nome = '', texto = '' } = {}) {
  const t = limparTexto(texto), n = limparNome(nome);
  const falha = (campo, erro) => ({ ok: false, campo, erro, texto: t, nome: n });
  if (t.length < LIMITES.textoMin) return falha('texto', `Escreva pelo menos ${LIMITES.textoMin} letras.`);
  if (t.length > LIMITES.textoMax) return falha('texto', `O comentário tem ${t.length} caracteres; o máximo é ${LIMITES.textoMax}.`);
  if (temLink(t)) return falha('texto', 'Por segurança, não aceitamos links, e-mails ou @ no comentário.');
  if (n.length > LIMITES.nomeMax) return falha('nome', `O nome pode ter até ${LIMITES.nomeMax} letras.`);
  if (n && temLink(n)) return falha('nome', 'No nome, não use links nem @.');
  return { ok: true, texto: t, nome: n };
}

// "há 3 min", "ontem", "12 nov." — datas curtas para a lista de comentários
export function quando(data, agora = new Date()) {
  if (!(data instanceof Date) || isNaN(data)) return '';
  const s = Math.max(0, Math.round((agora - data) / 1000));
  if (s < 60) return 'agora';
  if (s < 3600) return `há ${Math.round(s / 60)} min`;
  if (s < 86400) return `há ${Math.round(s / 3600)} h`;
  const d = Math.round(s / 86400);
  if (d === 1) return 'ontem';
  if (d < 7) return `há ${d} dias`;
  return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: data.getFullYear() === agora.getFullYear() ? undefined : 'numeric' });
}
