// GERADO por scripts/gerar_sw.mjs — não edite à mão.
const CACHE = 'dev-csra-2b5fb910a1';
const ARQUIVOS = [
 "./",
 "assets/apple-touch-icon.png",
 "assets/favicon.svg",
 "assets/fonts/inter-latin-ext.woff2",
 "assets/fonts/inter-latin.woff2",
 "assets/fonts/newsreader-latin-ext.woff2",
 "assets/fonts/newsreader-latin.woff2",
 "assets/icon-192.png",
 "assets/icon-512.png",
 "assets/og-image.png",
 "assets/qr.png",
 "assets/qr.svg",
 "css/base.css",
 "css/fonts.css",
 "css/home.css",
 "css/nuvem.css",
 "css/story.css",
 "css/tokens.css",
 "css/widgets.css",
 "index.html",
 "js/data/egw.js",
 "js/data/imagens.js",
 "js/data/livro.js",
 "js/data/stories.js",
 "js/main.js",
 "js/nuvem/caderno.js",
 "js/nuvem/comentarios.js",
 "js/nuvem/config.js",
 "js/nuvem/erros.js",
 "js/nuvem/iniciar.js",
 "js/nuvem/merge.js",
 "js/nuvem/navegador.js",
 "js/nuvem/nuvem.js",
 "js/nuvem/validar.js",
 "js/state.js",
 "js/ui/admin.js",
 "js/ui/art.js",
 "js/ui/convite.js",
 "js/ui/espaco.js",
 "js/ui/hero.js",
 "js/ui/journey.js",
 "js/ui/leve.js",
 "js/ui/qr.js",
 "js/ui/refs.js",
 "js/ui/sprite.js",
 "js/ui/viewer.js",
 "js/ui/widgets/balanca.js",
 "js/ui/widgets/cenario.js",
 "js/ui/widgets/compartilhar.js",
 "js/ui/widgets/conversa.js",
 "js/ui/widgets/frase.js",
 "js/ui/widgets/horta.js",
 "js/ui/widgets/index.js",
 "js/ui/widgets/nuvem.js",
 "js/ui/widgets/pausa.js",
 "js/ui/widgets/plano.js",
 "js/ui/widgets/prato.js",
 "js/ui/widgets/refeicao.js",
 "js/ui/widgets/reflexao.js",
 "js/ui/widgets/relogio.js",
 "js/ui/widgets/remedios.js",
 "js/ui/widgets/util.js",
 "manifest.webmanifest"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('dev-csra-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// rede primeiro (sempre a versão mais nova quando há internet); sem internet, usa o cache
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
