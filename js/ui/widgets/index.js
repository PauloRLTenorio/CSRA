// Registro das interações. Cada módulo exporta mount(host, card, ctx) e devolve (opcionalmente) uma função de limpeza.
const LOADERS = {
  prato: () => import('./prato.js'),
  nuvem: () => import('./nuvem.js'),
  refeicao: () => import('./refeicao.js'),
  relogio: () => import('./relogio.js'),
  pausa: () => import('./pausa.js'),
  horta: () => import('./horta.js'),
  balanca: () => import('./balanca.js'),
  remedios: () => import('./remedios.js'),
  cenario: () => import('./cenario.js'),
  plano: () => import('./plano.js'),
  frase: () => import('./frase.js'),
  compartilhar: () => import('./compartilhar.js'),
  reflexao: () => import('./reflexao.js'),
};

export async function mountWidget(name, host, card, ctx) {
  const load = LOADERS[name];
  if (!load) { host.innerHTML = '<p class="sv__small">Interação em preparo.</p>'; return () => {}; }
  const mod = await load();
  const clean = mod.mount(host, card, ctx);
  return typeof clean === 'function' ? clean : () => {};
}
