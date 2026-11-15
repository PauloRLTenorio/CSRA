// Traduz erros do Firebase para mensagens simples em português. Devolve '' quando a pessoa apenas cancelou (não é erro).
export function mensagemDeErro(e) {
  const c = String((e && (e.code || e.name)) || '');
  const m = String((e && e.message) || '');
  const tudo = `${c} ${m}`;
  if (/popup-closed-by-user|cancelled-popup-request|user-cancelled/i.test(tudo)) return '';
  if (/disallowed_useragent/i.test(tudo)) return 'O Google não deixa entrar por este navegador. Abra o site no Chrome ou no Safari.';
  if (/popup-blocked/i.test(tudo)) return 'O navegador bloqueou a janela de login. Permita pop-ups para este site e tente de novo.';
  if (/unauthorized-domain/i.test(tudo)) return 'Este endereço ainda não foi autorizado para o login do Google.';
  if (/operation-not-allowed/i.test(tudo)) return 'Este tipo de login não está ligado no projeto.';
  if (/too-many-requests/i.test(tudo)) return 'Muitas tentativas seguidas. Espere um pouco e tente de novo.';
  if (/requires-recent-login/i.test(tudo)) return 'Por segurança, entre de novo com o Google e repita.';
  if (/resource-exhausted|quota/i.test(tudo)) return 'O limite gratuito de hoje foi atingido. Tente de novo amanhã.';
  if (/permission-denied|insufficient permissions/i.test(tudo)) return 'O banco recusou a operação. Confira se o texto não tem links nem @ e tente de novo.';
  if (/network|unavailable|offline|failed to fetch|load failed|importing a module script failed|Failed to fetch dynamically imported module/i.test(tudo)) return 'Sem conexão com a internet agora. Tente de novo quando voltar.';
  return 'Algo deu errado. Tente de novo em instantes.';
}
export const cancelou = (e) => /popup-closed-by-user|cancelled-popup-request|user-cancelled/i.test(`${(e && e.code) || ''} ${(e && e.message) || ''}`);
