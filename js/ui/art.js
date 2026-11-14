// Composição de cenas: posiciona ilustrações (símbolos do sprite) num "palco" e cria cenários de fundo.

export const icon = (id, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#s-${id}"/></svg>`;

// [x%, y%, tamanho (cqmin)]
const LAYOUTS = {
  one: [[50, 52, 66]],
  two: [[31, 54, 46], [70, 47, 46]],
  three: [[50, 31, 42], [29, 66, 40], [71, 66, 40]],
  four: [[32, 36, 40], [68, 34, 40], [32, 68, 40], [68, 66, 40]],
  five: [[50, 26, 36], [25, 50, 34], [75, 50, 34], [36, 76, 32], [64, 76, 32]],
  orbit: [[50, 52, 52], [21, 25, 27], [79, 25, 27], [20, 79, 25], [80, 79, 25]],
};

export function layoutFor(n, name) {
  if (name && LAYOUTS[name]) return LAYOUTS[name].slice(0, n);
  const key = ['', 'one', 'two', 'three', 'four', 'five'][Math.min(n, 5)];
  return LAYOUTS[key].slice(0, n);
}

export function itemsHTML(art) {
  if (!art || !art.items) return '';
  const pos = layoutFor(art.items.length, art.layout);
  const anim = art.anim || 'float';
  return art.items
    .map((id, i) => {
      const [x, y, s] = pos[i] || [50, 50, 30];
      const rot = ((i % 2 ? 1 : -1) * (2 + i * 1.5)).toFixed(1);
      return `<span class="it it--${anim}" style="left:${x}%;top:${y}%;--s:${s};--d:${(i * 0.13).toFixed(2)}s;--r:${rot}deg"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#s-${id}"/></svg></span>`;
    })
    .join('');
}

const STARS = [[12, 14, 1.4], [28, 26, 1], [44, 10, 1.2], [60, 22, 1.6], [76, 12, 1], [88, 28, 1.3], [20, 44, 1], [92, 48, 1.1], [8, 62, 1.2], [70, 40, 0.9]];

export function backdropHTML(name) {
  switch (name) {
    case 'garden':
      return `<div class="bd bd--garden"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle class="bd-sun" cx="16" cy="18" r="16" fill="url(#g-glow)"/>
        <path d="M-5 76C15 64 38 64 58 73S92 80 105 68V105H-5z" fill="url(#g-hill-1)"/>
        <path d="M-5 88C22 78 52 82 74 86S96 88 105 82V105H-5z" fill="url(#g-hill-2)"/>
        <path d="M-5 98C25 92 60 96 105 94V105H-5z" fill="url(#g-hill-3)"/></svg></div>`;
    case 'sky':
      return `<div class="bd bd--sky" aria-hidden="true">
        <i class="bd-cloud" style="--y:10%;--s:34;--t:58s;--o:.0s"><svg viewBox="0 0 100 100"><use href="#s-cloud"/></svg></i>
        <i class="bd-cloud" style="--y:30%;--s:22;--t:80s;--o:-30s"><svg viewBox="0 0 100 100"><use href="#s-cloud"/></svg></i>
        <i class="bd-cloud" style="--y:62%;--s:28;--t:68s;--o:-12s"><svg viewBox="0 0 100 100"><use href="#s-cloud"/></svg></i></div>`;
    case 'glow':
      return '<div class="bd bd--glow" aria-hidden="true"><i></i><i></i></div>';
    case 'night':
      return `<div class="bd bd--night" aria-hidden="true">${STARS.map(([x, y, s], i) => `<i class="bd-star" style="left:${x}%;top:${y}%;--s:${s};--d:${(i * 0.37).toFixed(2)}s"></i>`).join('')}</div>`;
    case 'water':
      return `<div class="bd bd--water" aria-hidden="true"><svg viewBox="0 0 200 60" preserveAspectRatio="none">
        <path class="w1" d="M0 30c25-14 50-14 75 0s50 14 75 0 50-14 75 0V60H0z"/>
        <path class="w2" d="M0 38c25-12 50-12 75 0s50 12 75 0 50-12 75 0V60H0z"/></svg></div>`;
    default:
      return '<div class="bd bd--plain" aria-hidden="true"><i></i><i></i></div>';
  }
}

export function stageHTML(art, scene, imgUrl = '') {
  if (imgUrl) return `<div class="stage stage--img"><img src="${imgUrl}" alt="" decoding="async"></div>`;
  return `<div class="stage">${backdropHTML(scene)}<div class="stage__items">${itemsHTML(art)}</div></div>`;
}
