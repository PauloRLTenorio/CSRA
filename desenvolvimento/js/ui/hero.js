// Cena interativa da página inicial: a mesa posta. Cada objeto abre uma história.
const W = 640, H = 540;

const HOTS = [
  { sym: 'basket', story: 'primeiro-cardapio', label: 'O primeiro cardápio', x: 168, y: 322, w: 138, edge: 'l', pd: 0 },
  { sym: 'bread', story: 'cozinha-que-cura', label: 'A cozinha que cura', x: 314, y: 344, w: 98, pd: 0.5 },
  { sym: 'jug', story: 'remedios-simples', label: 'Remédios simples', x: 448, y: 330, w: 116, pd: 1.0 },
  { sym: 'clock', story: 'ritmo-do-dia', label: 'O ritmo do dia', x: 560, y: 338, w: 100, edge: 'r', pd: 1.5 },
  { sym: 'bulb', story: 'mesa-e-mente', label: 'A mesa e a mente', x: 330, y: 186, w: 112, float: true, glow: true, pd: 2.0 },
  { sym: 'scale', story: 'sem-extremos', label: 'Sem extremos', x: 62, y: 338, w: 94, edge: 'l', pd: 2.5 },
];

function scallops(x0, x1, y, r) {
  const n = Math.round((x1 - x0) / (2 * r));
  let d = `M${x0} ${y - 30}V${y}`;
  for (let i = 0; i < n; i++) d += `a${r} ${r * 0.9} 0 0 0 ${2 * r} 0`;
  d += `V${y - 30}z`;
  return d;
}

function bgSVG() {
  return `<svg class="scene__bg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
    <ellipse cx="320" cy="468" rx="300" ry="22" fill="#10281c" opacity=".2"/>
    <use href="#s-tree" x="-34" y="26" width="270" height="270"/>
    <use href="#s-tree" x="468" y="140" width="190" height="190" opacity=".95"/>
    <rect x="98" y="390" width="16" height="80" rx="6" fill="#6b4529"/><rect x="526" y="390" width="16" height="80" rx="6" fill="#6b4529"/>
    <rect x="46" y="372" width="548" height="26" rx="13" fill="#fff4d6"/>
    <rect x="46" y="384" width="548" height="6" fill="#e9a07a" opacity=".55"/>
    <path d="${scallops(50, 590, 430, 15)}" fill="#fff0cc"/>
    <path d="${scallops(50, 590, 430, 15)}" fill="none" stroke="#e9d7a8" stroke-width="2"/>
    <rect x="46" y="372" width="548" height="8" rx="4" fill="#fff" opacity=".5"/>
  </svg>`;
}

export function mountHero(host, { onOpen }) {
  host.innerHTML = bgSVG() + HOTS.map((h, i) => `
    <button type="button" class="hot${h.float ? ' hot--float' : ''}${h.glow ? ' hot--glow' : ''}" data-story="${h.story}" ${h.edge ? `data-edge="${h.edge}"` : ''}
      style="left:${(h.x / W * 100).toFixed(2)}%;top:${(h.y / H * 100).toFixed(2)}%;width:${(h.w / W * 100).toFixed(2)}%;--pd:${h.pd}s;--hi:${i}"
      aria-label="${h.label}: abrir história">
      <span class="hot__ping" aria-hidden="true"></span>
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#s-${h.sym}"/></svg>
      <span class="hot__label" aria-hidden="true">${h.label}</span>
    </button>`).join('');

  const touch = matchMedia('(hover: none)').matches;
  const hint = document.getElementById('heroHint');
  if (hint) hint.textContent = touch ? 'Toque nos objetos da mesa' : 'Passe o mouse nos objetos da mesa';

  let timer = 0;
  const closeAll = () => host.querySelectorAll('.hot.is-open').forEach((b) => b.classList.remove('is-open'));
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.hot'); if (!b) return;
    b.classList.add('is-seen');
    if (touch && !b.classList.contains('is-open')) {
      closeAll(); b.classList.add('is-open');
      clearTimeout(timer); timer = setTimeout(closeAll, 3200);
      return;
    }
    closeAll();
    onOpen(b.dataset.story);
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.hot')) closeAll(); });
}
