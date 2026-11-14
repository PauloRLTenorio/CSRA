// Estado do leitor, guardado só no navegador (localStorage). Tudo opcional: o site funciona sem isso.
const KEY = 'csra.v1';
let mem = { pos: {}, done: [], plan: { start: null, checks: [] }, hint: false, frases: [] };
const subs = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      mem = { ...mem, ...d, plan: { ...mem.plan, ...(d.plan || {}) } };
    }
  } catch (e) { /* sem armazenamento: segue na memória */ }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* ignora */ }
  subs.forEach((f) => { try { f(); } catch (e) { /* ignora */ } });
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
  setLast(id) { mem.last = id; save(); },
  hintSeen() { return !!mem.hint; },
  setHintSeen() { mem.hint = true; save(); },
  plan() { return mem.plan; },
  togglePlan(i) {
    const c = mem.plan.checks;
    const at = c.indexOf(i);
    if (at >= 0) c.splice(at, 1); else { c.push(i); if (!mem.plan.start) mem.plan.start = new Date().toISOString().slice(0, 10); }
    save();
  },
  resetPlan() { mem.plan = { start: null, checks: [] }; save(); },
  reset() { mem = { pos: {}, done: [], plan: { start: null, checks: [] }, hint: true, frases: [] }; save(); },
};
