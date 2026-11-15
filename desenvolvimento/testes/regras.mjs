// Teste das regras do Firestore contra o projeto REAL (csra-e60b2), por REST, com usuários anônimos de teste.
// Cria 2 usuários anônimos, tenta o que pode e o que não pode, e apaga o que criou.
// Uso: node desenvolvimento/testes/regras.mjs --confirmo   (a chave abaixo é a chave web pública do Firebase)
if (!process.argv.includes('--confirmo')) { console.log('Este teste escreve no banco do projeto real (e apaga em seguida). Rode com --confirmo para continuar.'); process.exit(2); }
const KEY = 'AIzaSyC3SN3FtB0XEJ5rAJuMoct0cjw99YY4NN0';
const P = 'csra-e60b2';
const DB = `projects/${P}/databases/(default)/documents`;
const FS = `https://firestore.googleapis.com/v1/${DB}`;
const COMMIT = `https://firestore.googleapis.com/v1/${DB}:commit`;

const s = (v) => ({ stringValue: v });
const n = (v) => ({ integerValue: String(v) });
const ts = (d) => ({ timestampValue: d.toISOString() });

async function anonimo() {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"returnSecureToken":true}' });
  const j = await r.json();
  if (!j.idToken) throw new Error('não criou usuário anônimo: ' + JSON.stringify(j));
  return { uid: j.localId, token: j.idToken };
}
async function http(method, url, token, body) {
  const r = await fetch(url, { method, headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch (e) { /* vazio */ }
  return { status: r.status, json: j };
}
// escreve um documento (upsert) com campos e, opcionalmente, um timestamp do servidor
const gravar = (token, caminho, fields, serverTs = []) => http('POST', COMMIT, token, {
  writes: [{ update: { name: `${DB}/${caminho}`, fields }, ...(serverTs.length ? { updateTransforms: serverTs.map((f) => ({ fieldPath: f, setToServerValue: 'REQUEST_TIME' })) } : {}) }],
});
const apagar = (token, caminho) => http('DELETE', `${FS}/${caminho}`, token);
const ler = (token, caminho) => http('GET', `${FS}/${caminho}`, token);
const consulta = (token, pai, colecao, limite) => http('POST', `${FS}/${pai}:runQuery`, token, { structuredQuery: { from: [{ collectionId: colecao }], ...(limite ? { limit: limite } : {}) } });
const consultaRaiz = (token, colecao, limite) => http('POST', `${FS}:runQuery`, token, { structuredQuery: { from: [{ collectionId: colecao }], ...(limite ? { limit: limite } : {}) } });

const pend = (uid, parada, texto, extra = {}) => ({ uid: s(uid), parada: s(parada), texto: s(texto), ...extra });
const PAR = 'primeiro-cardapio';

let ok = 0, falhas = 0;
const linhas = [];
function checar(nome, r, esperado) {
  const passou = esperado === 'permitido' ? r.status === 200 : r.status === 403;
  passou ? ok++ : falhas++;
  linhas.push(`${passou ? 'OK   ' : 'FALHA'} | ${esperado.padEnd(9)} | HTTP ${r.status} | ${nome}${passou ? '' : ' | ' + JSON.stringify(r.json).slice(0, 160)}`);
}

const A = await anonimo(), B = await anonimo();
console.log('usuários de teste:', A.uid.slice(0, 6) + '…', B.uid.slice(0, 6) + '…');
const idA = `${A.uid}_${PAR}`, idB = `${B.uid}_${PAR}`;

// ---------- sem login ----------
checar('lista pública de aprovados (limite 20)', await consulta(null, `paradas/${PAR}`, 'comentarios', 20), 'permitido');
checar('lista pública sem limite', await consulta(null, `paradas/${PAR}`, 'comentarios'), 'negado');
checar('lista pública com limite 100', await consulta(null, `paradas/${PAR}`, 'comentarios', 100), 'negado');
checar('ler comentário pendente', await ler(null, `comentarios_pendentes/${idA}`), 'negado');
checar('listar pendentes', await consultaRaiz(null, 'comentarios_pendentes', 10), 'negado');
checar('criar pendente sem login', await gravar(null, `comentarios_pendentes/x_${PAR}`, pend('x', PAR, 'oi tudo bem', {}), ['criadoEm']), 'negado');
checar('ler usuarios/x', await ler(null, 'usuarios/x'), 'negado');
checar('ler config/admin', await ler(null, 'config/admin'), 'negado');

// ---------- usuário A: comentários ----------
checar('A cria o próprio pendente', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'Gostei muito desta parada.'), ['criadoEm']), 'permitido');
checar('A reescreve o próprio pendente', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'Texto novo, ainda melhor.', { nome: s('Ana') }), ['criadoEm']), 'permitido');
const lido = await ler(A.token, `comentarios_pendentes/${idA}`);
checar('A lê o próprio pendente', lido, 'permitido');
if (lido.json && lido.json.fields && lido.json.fields.texto.stringValue !== 'Texto novo, ainda melhor.') { falhas++; linhas.push('FALHA | texto lido não confere'); }
checar('texto com 2 letras', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'ok', {}), ['criadoEm']), 'negado');
checar('texto com 601 letras', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'a'.repeat(601)), ['criadoEm']), 'negado');
checar('texto com 600 letras', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'a'.repeat(600)), ['criadoEm']), 'permitido');
checar('texto com 600 letras acentuadas (2 bytes cada)', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'ã'.repeat(600)), ['criadoEm']), 'permitido');
checar('texto com 300 emojis (600 unidades no JavaScript)', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, '😀'.repeat(300)), ['criadoEm']), 'permitido');
checar('texto com 601 emojis', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, '😀'.repeat(601)), ['criadoEm']), 'negado');
checar('texto com http', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'veja http://exemplo.com agora'), ['criadoEm']), 'negado');
checar('texto com e-mail', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'escreva para fulano@gmail.com'), ['criadoEm']), 'negado');
checar('texto com endereço sem http', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'acesse meusite.com.br hoje'), ['criadoEm']), 'negado');
checar('texto com www', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'acesse www.algo agora'), ['criadoEm']), 'negado');
checar('texto normal com pontos e quebra de linha', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'Gostei. Muito bom!\nVou fazer o plano... em 7 dias.'), ['criadoEm']), 'permitido');
checar('parada inexistente', await gravar(A.token, `comentarios_pendentes/${A.uid}_xyz`, pend(A.uid, 'xyz', 'comentário válido'), ['criadoEm']), 'negado');
checar('id de outra pessoa (uid do campo = A)', await gravar(A.token, `comentarios_pendentes/${idB}`, pend(A.uid, PAR, 'comentário válido'), ['criadoEm']), 'negado');
checar('uid do campo de outra pessoa', await gravar(A.token, `comentarios_pendentes/${idB}`, pend(B.uid, PAR, 'comentário válido'), ['criadoEm']), 'negado');
checar('campo extra (aprovado)', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'comentário válido', { aprovado: { booleanValue: true } }), ['criadoEm']), 'negado');
checar('data escolhida pelo cliente', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'comentário válido', { criadoEm: ts(new Date('2020-01-01')) })), 'negado');
checar('sem data', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'comentário válido')), 'negado');
checar('nome com 41 letras', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'comentário válido', { nome: s('n'.repeat(41)) }), ['criadoEm']), 'negado');
checar('nome com 40 letras', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'comentário válido', { nome: s('n'.repeat(40)) }), ['criadoEm']), 'permitido');
checar('nome com @', await gravar(A.token, `comentarios_pendentes/${idA}`, pend(A.uid, PAR, 'comentário válido', { nome: s('@fulano') }), ['criadoEm']), 'negado');

// ---------- A: caderno ----------
const user = (extra = {}, v = 1) => ({ v: n(v), pos: { mapValue: { fields: { [PAR]: n(3) } } }, done: { arrayValue: { values: [s(PAR)] } }, plan: { mapValue: { fields: { start: s('2026-11-15'), checks: { arrayValue: { values: [n(0), n(2)] } } } } }, notes: { mapValue: { fields: { [PAR]: { mapValue: { fields: { t: s('minha nota'), d: s('2026-11-15') } } } } } }, ...extra });
checar('A grava o próprio caderno', await gravar(A.token, `usuarios/${A.uid}`, user(), ['atualizadoEm']), 'permitido');
checar('A lê o próprio caderno', await ler(A.token, `usuarios/${A.uid}`), 'permitido');
checar('caderno com campo desconhecido', await gravar(A.token, `usuarios/${A.uid}`, user({ admin: { booleanValue: true } }), ['atualizadoEm']), 'negado');
checar('caderno com v=2', await gravar(A.token, `usuarios/${A.uid}`, user({}, 2), ['atualizadoEm']), 'negado');
checar('caderno sem data do servidor', await gravar(A.token, `usuarios/${A.uid}`, user()), 'negado');
checar('A grava o caderno de B', await gravar(A.token, `usuarios/${B.uid}`, user(), ['atualizadoEm']), 'negado');
checar('A lê o caderno de B', await ler(A.token, `usuarios/${B.uid}`), 'negado');

// ---------- B e cruzamentos ----------
checar('B cria o próprio pendente', await gravar(B.token, `comentarios_pendentes/${idB}`, pend(B.uid, PAR, 'Comentário do B, bem escrito.'), ['criadoEm']), 'permitido');
checar('A lê o pendente de B', await ler(A.token, `comentarios_pendentes/${idB}`), 'negado');
checar('A apaga o pendente de B', await apagar(A.token, `comentarios_pendentes/${idB}`), 'negado');
checar('B lê a lista pública', await consulta(B.token, `paradas/${PAR}`, 'comentarios', 20), 'permitido');
checar('A tenta publicar (aprovar) o próprio comentário', await gravar(A.token, `paradas/${PAR}/comentarios/${idA}`, { uid: s(A.uid), texto: s('publicado por mim'), criadoEm: ts(new Date()) }, ['aprovadoEm']), 'negado');
checar('A tenta criar config/admin', await gravar(A.token, 'config/admin', { uids: { arrayValue: { values: [s(A.uid)] } } }), 'negado');
checar('A lista os pendentes', await consultaRaiz(A.token, 'comentarios_pendentes', 10), 'negado');
checar('A cria coleção qualquer', await gravar(A.token, 'qualquer/coisa', { a: s('b') }), 'negado');

// ---------- limpeza ----------
checar('A apaga o próprio pendente', await apagar(A.token, `comentarios_pendentes/${idA}`), 'permitido');
checar('A apaga de novo (não existe)', await apagar(A.token, `comentarios_pendentes/${idA}`), 'permitido');
checar('B apaga o próprio pendente', await apagar(B.token, `comentarios_pendentes/${idB}`), 'permitido');
checar('A apaga o próprio caderno', await apagar(A.token, `usuarios/${A.uid}`), 'permitido');
// remove os usuários de teste do Authentication
for (const u of [A, B]) await http('POST', `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${KEY}`, null, { idToken: u.token });

console.log(linhas.join('\n'));
console.log(`\n${ok} certos, ${falhas} falhas`);
process.exit(falhas ? 1 : 0);
