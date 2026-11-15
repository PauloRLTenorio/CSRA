// Estado do leitor, guardado no navegador (localStorage). Tudo opcional: o site funciona sem isso.
// Na versão em desenvolvimento ele também pode ser guardado na nuvem (js/nuvem/caderno.js), mas só se a pessoa autorizar.
const KEY = 'csra.v1';
const novo = () => ({ pos: {}, done: [], plan: { start: null, checks: [], u: '' }, hint: false, frases: [], notes: {}, epoch: '' });
let mem = novo();
const subs = new Set();
const agora = () => new Date().toISOString();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      mem = { ...novo(), ...d, plan: { ...novo().plan, ...(d.plan || {}) } };
    }
  } catch (e) { /* sem armazenamento: segue na memória */ }
}
// origem: undefined = mudança feita pela pessoa; 'nuvem' = veio da nuvem (não precisa ser enviada de volta)
function save(origem) {
  try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* ignora */ }
  subs.forEach((f) => { try { f(origem); } catch (e) { /* ignora */ } });
}
load();

export const state = {
  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  pos(id) { return mem.pos[id] || 0; },
  setPos(id, i) { if (i > (mem.pos[id] || 0)) { mem.pos[id] = i; save(); } },
  isDone(id) { return mem.done.includes(id); },
  setDone(id) { if (!mem.done.includes(id)) { mem.done.push(id); save(); } },
  doneCount() { return mem.done.length; },
  started(id) { return (mem.pos[id] || 0) > 0 && !mem.done.includes(id); },
  lastOpen() { return mem.last || null; },
  setLast(id) { if (mem.last !== id) { mem.last = id; save(); } },
  hintSeen() { return !!mem.hint; },
  setHintSeen() { mem.hint = true; save(); },
  plan() { return mem.plan; },
  togglePlan(i) {
    const c = mem.plan.checks;
    const at = c.indexOf(i);
    if (at >= 0) c.splice(at, 1); else { c.push(i); if (!mem.plan.start) mem.plan.start = agora().slice(0, 10); }
    mem.plan.u = agora();
    save();
  },
  resetPlan() { mem.plan = { start: null, checks: [], u: agora() }; save(); },
  // anotações: só as que têm texto (as apagadas ficam guardadas como "texto vazio" para a nuvem saber que foram apagadas)
  notes() {
    const out = {};
    Object.entries(mem.notes || {}).forEach(([k, n]) => { if (n && n.t) out[k] = n; });
    return out;
  },
  setNote(id, text) {
    mem.notes = mem.notes || {};
    const t = String(text || '').trim();
    const u = agora();
    if (t) {
      if (mem.notes[id] && mem.notes[id].t === t) return; // nada mudou
      mem.notes[id] = { t, d: u.slice(0, 10), u };
    } else if (mem.notes[id] && mem.notes[id].t) {
      mem.notes[id] = { t: '', d: u.slice(0, 10), u };
    } else return;
    save();
  },
  reset() { mem = { ...novo(), hint: true, epoch: agora() }; save(); },

  // ----- nuvem (js/nuvem/caderno.js) -----
  nuvemLigada() { try { return localStorage.getItem('csra.nuvem') === 'sim'; } catch (e) { return false; } },
  // cópia do que pode ir para a nuvem (a "dica de toque" e coisas do aparelho ficam de fora)
  snapshot() {
    const { epoch, pos, done, plan, notes, last, frases } = mem;
    return JSON.parse(JSON.stringify({ epoch: epoch || '', pos, done, plan, notes: notes || {}, last: last || null, frases: frases || [] }));
  },
  // aplica o resultado da junção com a nuvem
  aplicar(s) {
    mem = { ...mem, epoch: s.epoch || '', pos: { ...s.pos }, done: [...s.done], plan: { ...s.plan }, notes: { ...s.notes }, frases: [...s.frases] };
    if (s.last && !mem.last) mem.last = s.last;
    save('nuvem');
    try { window.dispatchEvent(new CustomEvent('csra:estado')); } catch (e) { /* ignora */ }
  },
};
