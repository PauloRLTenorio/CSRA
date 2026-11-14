// "Convide alguém": link, texto e uma imagem vertical para stories/status (gerada no seu aparelho).
import { $, esc } from './util.js';

const SITE = 'https://paulorltenorio.github.io/CSRA/';
const TXT = 'Tudo começou com um cardápio. Uma jornada em cartões pelas ideias do livro Conselhos sobre o Regime Alimentar.';

function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

// converte um símbolo do sprite numa imagem (resolvendo as variáveis de cor)
function symbolImage(id) {
  const el = document.getElementById(`s-${id}`);
  if (!el) return Promise.resolve(null);
  const inner = el.innerHTML.replace(/var\((--[\w-]+)\)/g, (_, v) => cssVar(v) || '#888');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">${inner}</svg>`;
  return new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
}

function wrap(ctx, text, maxW) {
  const words = text.split(' '), lines = []; let cur = '';
  words.forEach((w) => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}

async function draw(canvas) {
  const W = 1080, H = 1920; canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff0c2'); g.addColorStop(0.6, '#d9ecc8'); g.addColorStop(1, '#bfe4c6');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const sun = c.createRadialGradient(840, 300, 10, 840, 300, 420); sun.addColorStop(0, 'rgba(255,244,190,.95)'); sun.addColorStop(1, 'rgba(255,244,190,0)');
  c.fillStyle = sun; c.fillRect(0, 0, W, H);
  // colinas
  const hill = (y, col, amp) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); c.lineTo(0, y); c.bezierCurveTo(W * .25, y - amp, W * .5, y + amp, W * .75, y - amp * .4); c.bezierCurveTo(W * .9, y - amp * .8, W, y - amp * .2, W, y); c.lineTo(W, H); c.closePath(); c.fill(); };
  hill(1500, '#9fcda0', 90); hill(1640, '#6fb27f', 80); hill(1780, '#3f8a5c', 60);
  try { await document.fonts.load('600 100px Newsreader'); await document.fonts.load('600 40px Inter'); } catch (e) { /* segue */ }
  const [apple, wheat, leaf] = await Promise.all(['apple', 'wheat', 'leaf'].map(symbolImage));
  if (wheat) c.drawImage(wheat, 150, 1040, 360, 360);
  if (apple) c.drawImage(apple, 380, 1000, 420, 420);
  if (leaf) c.drawImage(leaf, 700, 1070, 300, 300);
  c.fillStyle = '#17382a'; c.textAlign = 'left';
  c.font = '600 40px Inter, system-ui, sans-serif'; c.fillText('CSRA · CONSELHOS SOBRE O REGIME ALIMENTAR', 90, 200);
  c.font = '600 128px Newsreader, Georgia, serif';
  let y = 420; wrap(c, 'Tudo começou com um cardápio.', 900).forEach((l) => { c.fillText(l, 90, y); y += 140; });
  c.font = '500 46px Inter, system-ui, sans-serif'; c.fillStyle = '#2f4b3c';
  y += 30; wrap(c, 'Uma jornada em cartões pelas ideias de um livro de mais de cem anos.', 860).forEach((l) => { c.fillText(l, 90, y); y += 66; });
  c.font = '700 44px Inter, system-ui, sans-serif'; c.fillStyle = '#fff8ea';
  c.fillText('paulorltenorio.github.io/CSRA', 90, 1840);
}

export function mount(host, card, ctx) {
  host.innerHTML = `<div class="w w--split cp">
    <div class="w__main"><div class="cp__prev"><canvas id="cpC" aria-label="Pré-visualização da imagem para stories"></canvas></div></div>
    <div class="w__side"><div class="cp__box">
      <button type="button" class="w-btn w-btn--pri" id="cpShare">Compartilhar o link</button>
      <button type="button" class="w-btn" id="cpImg">Baixar imagem para stories</button>
      <button type="button" class="w-btn" id="cpCopy">Copiar o link</button>
    </div></div></div>`;
  const canvas = $('#cpC', host);
  draw(canvas);
  $('#cpShare', host).addEventListener('click', async () => {
    try { if (navigator.share) await navigator.share({ title: 'CSRA', text: TXT, url: SITE }); else { await navigator.clipboard.writeText(SITE); ctx.toast('Link copiado!'); } } catch (e) { /* cancelado */ }
  });
  $('#cpCopy', host).addEventListener('click', async () => { try { await navigator.clipboard.writeText(SITE); ctx.toast('Link copiado!'); } catch (e) { ctx.toast(SITE); } });
  $('#cpImg', host).addEventListener('click', () => {
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'csra-cardapio.png', { type: 'image/png' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: TXT }); return; }
      } catch (e) { return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'csra-cardapio.png'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      ctx.toast('Imagem baixada!');
    }, 'image/png');
  });
}
