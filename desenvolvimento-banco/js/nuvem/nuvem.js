// Núcleo da nuvem: carrega o Firebase só quando alguém usa um recurso, cuida do usuário (anônimo ou Google)
// e guarda a escolha da pessoa sobre guardar o caderno na nuvem. Nada aqui roda se a pessoa só estiver lendo.
import { NUVEM, PARADAS } from './config.js';
import { navegadorInterno } from './navegador.js';
import { cancelou } from './erros.js';

const PREF = 'csra.nuvem'; // 'sim' = guardar o caderno na nuvem; 'nao' = só neste aparelho; ausente = ainda não decidiu
const lerPref = () => { try { return localStorage.getItem(PREF); } catch (e) { return null; } };
const gravarPref = (v) => { try { if (v) localStorage.setItem(PREF, v); else localStorage.removeItem(PREF); } catch (e) { /* sem armazenamento */ } };

let info = { fase: 'inativo', tipo: null, uid: null, nome: '', email: '', foto: '', erro: '' };
const ouvintes = new Set();
function mudar(p) { info = { ...info, ...p }; ouvintes.forEach((f) => { try { f(info); } catch (e) { /* ignora */ } }); }

export const estado = () => info;
export function assinar(fn) { ouvintes.add(fn); return () => ouvintes.delete(fn); }
export const ativa = () => !!(NUVEM.ativa && NUVEM.firebase && NUVEM.firebase.apiKey);
export const consentimento = () => lerPref();
export function definirConsentimento(v) { gravarPref(v); mudar({}); }
export const interno = () => navegadorInterno();

let promessaSdk = null;
function usuarioMudou(u) {
  mudar(u
    ? { fase: 'pronto', tipo: u.isAnonymous ? 'anonimo' : 'google', uid: u.uid, nome: u.displayName || '', email: u.email || '', foto: u.photoURL || '' }
    : { fase: promessaSdk ? 'pronto' : 'inativo', tipo: null, uid: null, nome: '', email: '', foto: '' });
}

// carrega o Firebase (app + login + banco "lite", bem menor que o completo) e liga o login
export function sdk() {
  if (!ativa()) return Promise.reject(new Error('A nuvem está desligada.'));
  if (!promessaSdk) {
    mudar({ fase: 'conectando', erro: '' });
    promessaSdk = (async () => {
      const base = `https://www.gstatic.com/firebasejs/${NUVEM.sdk}/`;
      const [appM, authM, fsM] = await Promise.all([
        import(`${base}firebase-app.js`), import(`${base}firebase-auth.js`), import(`${base}firebase-firestore-lite.js`),
      ]);
      const app = appM.initializeApp(NUVEM.firebase);
      // se o navegador não deixa guardar nada (aba privada), o login vale só até fechar a aba
      const auth = authM.initializeAuth(app, {
        persistence: [authM.indexedDBLocalPersistence, authM.browserLocalPersistence, authM.inMemoryPersistence],
        popupRedirectResolver: authM.browserPopupRedirectResolver,
      });
      auth.languageCode = 'pt-BR';
      authM.onAuthStateChanged(auth, usuarioMudou);
      return { appM, authM, fsM, app, auth, db: fsM.getFirestore(app) };
    })().catch((e) => { promessaSdk = null; mudar({ fase: 'erro', erro: String((e && e.message) || e) }); throw e; });
  }
  return promessaSdk;
}

// quem está logado agora (sem criar ninguém). Útil para só LER o que é da pessoa.
export async function usuarioAtual() {
  const S = await sdk();
  await S.auth.authStateReady();
  return S.auth.currentUser;
}

// garante um usuário: usa o que já existe (anônimo ou Google) ou cria um anônimo na hora
export async function garantirUsuario() {
  const S = await sdk();
  await S.auth.authStateReady();
  if (!S.auth.currentUser) await S.authM.signInAnonymously(S.auth);
  return S.auth.currentUser;
}

// entra com o Google. Quem já era anônimo mantém tudo (a conta anônima vira a conta Google, com o mesmo código).
// Se aquele Google já tinha conta no site (outro aparelho), entra nela e os dados deste aparelho são combinados depois.
export async function entrarComGoogle() {
  const S = await sdk();
  await S.auth.authStateReady();
  const prov = new S.authM.GoogleAuthProvider();
  prov.setCustomParameters({ prompt: 'select_account' });
  const atual = S.auth.currentUser;
  try {
    let r;
    if (atual && atual.isAnonymous) r = await S.authM.linkWithPopup(atual, prov);
    else r = await S.authM.signInWithPopup(S.auth, prov);
    usuarioMudou(S.auth.currentUser);
    return { user: r.user, trocou: false };
  } catch (e) {
    if (e && (e.code === 'auth/credential-already-in-use' || e.code === 'auth/email-already-in-use')) {
      const cred = S.authM.GoogleAuthProvider.credentialFromError(e);
      if (cred) {
        const r = await S.authM.signInWithCredential(S.auth, cred);
        usuarioMudou(S.auth.currentUser);
        return { user: r.user, trocou: true };
      }
    }
    throw e;
  }
}

export async function sair() {
  const S = await sdk();
  await S.authM.signOut(S.auth);
  usuarioMudou(null);
}

// apaga TUDO que é da pessoa na nuvem (caderno e comentários) e a identidade dela. O que está neste aparelho fica.
// Quem entrou com o Google confirma de novo (janela do Google): protege contra apagar por engano ou por quem pegou o aparelho.
// Devolve { apagou, contaRemovida }.
export async function apagarMeusDados() {
  const S = await sdk();
  await S.auth.authStateReady();
  const u = S.auth.currentUser;
  if (!u) return { apagou: false, contaRemovida: false };
  let confirmou = !!u.isAnonymous;
  if (!u.isAnonymous) {
    try { await S.authM.reauthenticateWithPopup(u, new S.authM.GoogleAuthProvider()); confirmou = true; } catch (e) { if (cancelou(e)) throw e; /* outro problema: apaga os dados e só sai da conta */ }
  }
  const { doc, writeBatch } = S.fsM;
  const lote = writeBatch(S.db);
  lote.delete(doc(S.db, 'usuarios', u.uid));
  for (const p of PARADAS) {
    lote.delete(doc(S.db, 'comentarios_pendentes', `${u.uid}_${p}`));
    lote.delete(doc(S.db, 'paradas', p, 'comentarios', `${u.uid}_${p}`));
  }
  await lote.commit();
  let contaRemovida = false;
  if (confirmou) { try { await S.authM.deleteUser(u); contaRemovida = true; } catch (e) { /* segue: só sai */ } }
  if (!contaRemovida) await S.authM.signOut(S.auth);
  usuarioMudou(null);
  return { apagou: true, contaRemovida };
}
