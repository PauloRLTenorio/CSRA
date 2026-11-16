// Junta o caderno deste aparelho com o da nuvem. Funções puras (sem DOM e sem rede), testadas em testes/nuvem.test.mjs.
//
// Formato (o mesmo do estado local, js/state.js):
//   epoch   texto ISO da última "recomeçar tudo"; quem tem a época mais nova vence por inteiro
//   pos     { parada: índice do cartão } — vale o maior
//   done    [paradas concluídas] — união
//   plan    { start, checks:[0..6], u } — vale o mais recente (u); sem u, união dos dias marcados
//   notes   { parada: { t, d, u } } — vale a mais recente (u); t vazio = anotação apagada
//   last    última parada aberta
//   frases  [frases guardadas] — união
const TEXTO_MAX = 600;
const ehObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
const iso = (x) => (typeof x === 'string' ? x : '');
const unico = (arr) => [...new Set(arr)];
const menorData = (a, b) => (a && b ? (a <= b ? a : b) : a || b || null);
const marca = (n) => n.u || (n.d ? `${n.d}T00:00:00.000Z` : '');

export function vazio() {
  return { epoch: '', pos: {}, done: [], plan: { start: null, checks: [], u: '' }, notes: {}, last: null, frases: [] };
}

// aceita qualquer coisa (inclusive dados antigos ou estranhos) e devolve sempre o formato certo
export function normalizar(x) {
  const s = ehObj(x) ? x : {};
  const pos = {};
  if (ehObj(s.pos)) for (const [k, v] of Object.entries(s.pos)) { const n = Number(v); if (Number.isFinite(n) && n >= 0) pos[k] = Math.floor(n); }
  const done = Array.isArray(s.done) ? unico(s.done.filter((v) => typeof v === 'string')) : [];
  const p = ehObj(s.plan) ? s.plan : {};
  const checks = Array.isArray(p.checks) ? unico(p.checks.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)).sort((a, b) => a - b) : [];
  const plan = { start: typeof p.start === 'string' ? p.start : null, checks, u: iso(p.u) };
  const notes = {};
  if (ehObj(s.notes)) {
    for (const [k, v] of Object.entries(s.notes)) {
      if (!ehObj(v)) continue;
      notes[k] = { t: typeof v.t === 'string' ? v.t.slice(0, TEXTO_MAX) : '', d: iso(v.d), u: iso(v.u) };
    }
  }
  return {
    epoch: iso(s.epoch), pos, done, plan, notes,
    last: typeof s.last === 'string' ? s.last : null,
    frases: Array.isArray(s.frases) ? unico(s.frases.filter((v) => typeof v === 'string')).slice(0, 100) : [],
  };
}

function escolherNota(x, y) {
  const a = marca(x), b = marca(y);
  if (a > b) return x;
  if (b > a) return y;
  return y.t.length > x.t.length ? y : x; // empate (raro): fica o texto mais completo
}

// a = deste aparelho, b = da nuvem (ou o contrário: o resultado não depende da ordem, exceto "last")
export function mesclar(a, b) {
  const A = normalizar(a), B = normalizar(b);
  if (A.epoch > B.epoch) return A; // alguém recomeçou tudo depois: o outro lado é descartado
  if (B.epoch > A.epoch) return B;
  const pos = { ...A.pos };
  for (const [k, v] of Object.entries(B.pos)) pos[k] = Math.max(pos[k] || 0, v);
  let plan;
  if (A.plan.u > B.plan.u) plan = A.plan;
  else if (B.plan.u > A.plan.u) plan = B.plan;
  else plan = { start: menorData(A.plan.start, B.plan.start), checks: unico([...A.plan.checks, ...B.plan.checks]).sort((x, y) => x - y), u: A.plan.u };
  const notes = {};
  for (const k of new Set([...Object.keys(A.notes), ...Object.keys(B.notes)])) {
    const x = A.notes[k], y = B.notes[k];
    notes[k] = !x ? y : !y ? x : escolherNota(x, y);
  }
  return { epoch: A.epoch, pos, done: unico([...A.done, ...B.done]), plan, notes, last: A.last || B.last, frases: unico([...A.frases, ...B.frases]).slice(0, 100) };
}

// forma canônica (chaves e listas em ordem fixa) para comparar dois cadernos sem se confundir com a ordem
export function canon(snap) {
  const s = normalizar(snap);
  const ord = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
  return JSON.stringify({
    epoch: s.epoch, pos: ord(s.pos), done: [...s.done].sort(), plan: s.plan,
    notes: ord(Object.fromEntries(Object.entries(s.notes).map(([k, n]) => [k, ord(n)]))),
    last: s.last, frases: [...s.frases].sort(),
  });
}
export const igual = (a, b) => canon(a) === canon(b);

// o que vai para o Firestore (campo "last" nulo é aceito pelas regras)
export function paraNuvem(snap) {
  const s = normalizar(snap);
  return { epoch: s.epoch, pos: s.pos, done: s.done, plan: s.plan, notes: s.notes, last: s.last, frases: s.frases };
}
