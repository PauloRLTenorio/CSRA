// Utilitários compartilhados pelas interações.
export const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const sym = (id, cls = '') => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#s-${id}"/></svg>`;
export const $ = (s, r) => (r || document).querySelector(s);
export const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export function timers() {
  const ids = [];
  return {
    set(fn, ms) { const id = setTimeout(fn, ms); ids.push(id); return id; },
    clear() { ids.forEach(clearTimeout); ids.length = 0; },
  };
}
