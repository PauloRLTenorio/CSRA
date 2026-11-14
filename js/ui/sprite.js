// Biblioteca de ilustrações do CSRA: símbolos SVG (viewBox 0 0 100 100) coloridos por variáveis CSS.
// Uso: <svg viewBox="0 0 100 100"><use href="#s-apple"/></svg>. Para trocar por imagens do Gemini, veja js/data/imagens.js.

const grape = (cx, cy, r = 11) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--c-grape)"/>
  <circle cx="${cx + r * 0.25}" cy="${cy + r * 0.3}" r="${r * 0.7}" fill="var(--c-grape-d)" opacity=".35"/>
  <circle cx="${cx - r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.26}" fill="#fff" opacity=".5"/>`;

const grain = (x, y, rot) =>
  `<ellipse cx="${x}" cy="${y}" rx="5.2" ry="10" transform="rotate(${rot} ${x} ${y})" fill="var(--c-wheat)"/>
   <ellipse cx="${x + (rot > 0 ? 1.2 : -1.2)}" cy="${y + 1}" rx="2.2" ry="7" transform="rotate(${rot} ${x} ${y})" fill="var(--c-wheat-d)" opacity=".45"/>`;

const kernel = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="var(--c-lemon-d)" opacity=".55"/>`;

const rays = (n, r1, r2, w) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i * 360) / n;
    return `<rect x="${50 - w / 2}" y="${50 - r2}" width="${w}" height="${r2 - r1}" rx="${w / 2}" transform="rotate(${a} 50 50)"/>`;
  }).join('');

const ticks = Array.from({ length: 12 }, (_, i) => {
  const a = i * 30;
  const big = i % 3 === 0;
  return `<rect x="${50 - (big ? 1.8 : 1)}" y="${big ? 17 : 18}" width="${big ? 3.6 : 2}" height="${big ? 8 : 5}" rx="1" transform="rotate(${a} 50 52)" fill="var(--c-wood-d)"/>`;
}).join('');

export const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="g-sky-day" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#bfe6e6"/><stop offset=".55" stop-color="#ffe9bf"/><stop offset="1" stop-color="#ffd0a0"/>
  </linearGradient>
  <linearGradient id="g-hill-1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d3a8"/><stop offset="1" stop-color="#8bbf93"/></linearGradient>
  <linearGradient id="g-hill-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb27f"/><stop offset="1" stop-color="#4d9a68"/></linearGradient>
  <linearGradient id="g-hill-3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f8a5c"/><stop offset="1" stop-color="#2b6b4f"/></linearGradient>
  <radialGradient id="g-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b57c4f"/><stop offset="1" stop-color="#8c5b3a"/></linearGradient>
</defs>

<symbol id="s-apple" viewBox="0 0 100 100">
  <path d="M50 30C38 20 14 27 14 55c0 22 15 38 29 36 4-.6 10-.6 14 0 14 2 29-14 29-36 0-28-24-35-36-25z" fill="var(--c-apple)"/>
  <path d="M50 30c12-10 36-3 36 25 0 22-15 38-29 36-3-.5-6-.5-8 0 15-8 23-26 19-44-2-7-9-13-18-17z" fill="var(--c-apple-d)" opacity=".5"/>
  <ellipse cx="30" cy="47" rx="5.5" ry="10" transform="rotate(18 30 47)" fill="#fff" opacity=".38"/>
  <path d="M50 30c0-8 2-14 8-19" stroke="var(--c-wood-d)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M56 21c4-9 17-11 24-5-4 9-16 12-24 5z" fill="var(--c-leaf)"/>
  <path d="M58 20c7-1 13-2 18-3" stroke="var(--c-leaf-d)" stroke-width="1.6" stroke-linecap="round" fill="none"/>
</symbol>

<symbol id="s-pear" viewBox="0 0 100 100">
  <path d="M50 14c8 0 10 9 8 17-2 8 16 15 16 36 0 17-11 26-24 26S26 84 26 67c0-21 18-28 16-36-2-8 0-17 8-17z" fill="var(--c-pear)"/>
  <path d="M58 31c-2 8 16 15 16 36 0 17-11 26-24 26 11-6 19-19 14-34-3-9-6-14-6-28z" fill="var(--c-pear-d)" opacity=".45"/>
  <ellipse cx="38" cy="68" rx="4.6" ry="11" transform="rotate(10 38 68)" fill="#fff" opacity=".32"/>
  <path d="M50 14c0-5 1-8 5-11" stroke="var(--c-wood-d)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M54 12c4-6 14-7 20-2-3 7-13 9-20 2z" fill="var(--c-leaf)"/>
</symbol>

<symbol id="s-grapes" viewBox="0 0 100 100">
  <path d="M50 22c0-8 3-12 8-14" stroke="var(--c-wood-d)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M54 14c6-8 20-8 26 0-5 9-19 11-26 0z" fill="var(--c-leaf)"/>
  ${grape(32, 38)}${grape(50, 36)}${grape(68, 38)}
  ${grape(41, 53)}${grape(59, 53)}${grape(32, 56, 0)}
  ${grape(50, 68)}${grape(33, 66, 0)}
  ${grape(41, 74, 0)}
</symbol>

<symbol id="s-orange" viewBox="0 0 100 100">
  <circle cx="50" cy="56" r="35" fill="var(--c-orange)"/>
  <path d="M50 21a35 35 0 0 1 0 70c20-10 28-40 8-60-3-4-6-7-8-10z" fill="var(--c-orange-d)" opacity=".45"/>
  <ellipse cx="34" cy="44" rx="6" ry="11" transform="rotate(35 34 44)" fill="#fff" opacity=".35"/>
  <circle cx="50" cy="22" r="3.2" fill="var(--c-wood-d)"/>
  <path d="M52 21c4-9 16-11 23-5-4 9-16 12-23 5z" fill="var(--c-leaf)"/>
</symbol>

<symbol id="s-lemon" viewBox="0 0 100 100">
  <ellipse cx="50" cy="56" rx="36" ry="27" fill="var(--c-lemon)"/>
  <circle cx="13" cy="56" r="6" fill="var(--c-lemon)"/><circle cx="87" cy="56" r="6" fill="var(--c-lemon)"/>
  <path d="M50 29c20 0 36 12 36 27s-16 27-36 27c14-8 22-30 0-54z" fill="var(--c-lemon-d)" opacity=".5"/>
  <ellipse cx="34" cy="46" rx="5" ry="10" transform="rotate(60 34 46)" fill="#fff" opacity=".45"/>
  <path d="M56 32c4-8 15-10 21-4-4 8-14 10-21 4z" fill="var(--c-leaf)"/>
</symbol>

<symbol id="s-banana" viewBox="0 0 100 100">
  <path d="M16 30c-5-4-9 0-8 6 3 38 33 62 78 40 6-3 4-8-2-8-34 10-58-6-68-38z" fill="var(--c-lemon)"/>
  <path d="M86 68c6-3 10 2 4 7-34 22-70 4-78-37 2 22 26 52 74 30z" fill="var(--c-lemon-d)" opacity=".55"/>
  <path d="M20 31c14 28 36 40 62 36" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>
  <path d="M12 28c-4-3-6-8-3-12l6 2c2 3 2 7-3 10z" fill="var(--c-wood-d)"/>
</symbol>

<symbol id="s-wheat" viewBox="0 0 100 100">
  <path d="M50 96V22" stroke="var(--c-wheat-d)" stroke-width="3.4" stroke-linecap="round"/>
  ${grain(39, 30, -32)}${grain(61, 30, 32)}${grain(38, 46, -34)}${grain(62, 46, 34)}${grain(37, 62, -36)}${grain(63, 62, 36)}
  <ellipse cx="50" cy="13" rx="5.2" ry="11" fill="var(--c-wheat)"/>
  <ellipse cx="51" cy="14" rx="2.2" ry="8" fill="var(--c-wheat-d)" opacity=".45"/>
</symbol>

<symbol id="s-bread" viewBox="0 0 100 100">
  <path d="M12 58c0-18 17-31 38-31s38 13 38 31c0 8-4 12-9 13v15c0 3-2 5-5 5H26c-3 0-5-2-5-5V71c-5-1-9-5-9-13z" fill="var(--c-bread)"/>
  <path d="M12 58c0-18 17-31 38-31s38 13 38 31c0 4-1 7-3 9-3-14-18-25-35-25S18 53 15 67c-2-2-3-5-3-9z" fill="var(--c-crust)" opacity=".55"/>
  <path d="M33 42l9 16M48 38l9 17M63 42l9 16" stroke="var(--c-cream)" stroke-width="5.5" stroke-linecap="round" opacity=".85"/>
  <path d="M26 82h48" stroke="var(--c-bread-d)" stroke-width="3" stroke-linecap="round" opacity=".6"/>
</symbol>

<symbol id="s-corn" viewBox="0 0 100 100">
  <ellipse cx="50" cy="46" rx="17" ry="36" fill="var(--c-lemon)"/>
  ${[0, 1, 2, 3, 4, 5].map((r) => [-9, 0, 9].map((c) => kernel(50 + c, 20 + r * 11)).join('')).join('')}
  <path d="M50 96C30 90 20 66 30 44c4 16 14 32 20 52z" fill="var(--c-leaf)"/>
  <path d="M50 96c20-6 30-30 20-52-4 16-14 32-20 52z" fill="var(--c-leaf-d)"/>
  <path d="M50 96c-6-22-8-38-6-56 6 20 8 36 6 56z" fill="var(--c-leaf)" opacity=".8"/>
</symbol>

<symbol id="s-tomato" viewBox="0 0 100 100">
  <path d="M50 24c-22-4-38 10-38 32 0 20 16 34 38 34s38-14 38-34c0-22-16-36-38-32z" fill="var(--c-apple)"/>
  <path d="M50 24c22-4 38 10 38 32 0 20-16 34-38 34 16-8 26-24 22-42-2-9-10-17-22-24z" fill="var(--c-apple-d)" opacity=".45"/>
  <ellipse cx="30" cy="48" rx="5" ry="9" transform="rotate(25 30 48)" fill="#fff" opacity=".35"/>
  <path d="M50 28l-14-8 8 14-14 4 14 6-4 12 10-8 10 8-4-12 14-6-14-4 8-14z" fill="var(--c-leaf)"/>
  <path d="M50 28v-10" stroke="var(--c-leaf-d)" stroke-width="3.5" stroke-linecap="round"/>
</symbol>

<symbol id="s-carrot" viewBox="0 0 100 100">
  <g transform="rotate(28 50 50)">
    <path d="M36 28Q50 20 64 28L53 92Q50 98 47 92Z" fill="var(--c-orange)"/>
    <path d="M50 22Q64 22 64 28L53 92Q50 98 50 98Z" fill="var(--c-orange-d)" opacity=".4"/>
    <path d="M41 40h9M46 54h9M45 68h7M49 80h4" stroke="var(--c-orange-d)" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M50 24c-12-4-16-14-12-20 6 2 12 10 12 20z" fill="var(--c-leaf)"/>
    <path d="M50 24c0-12 4-20 8-22 4 6 0 16-8 22z" fill="var(--c-leaf-d)"/>
    <path d="M50 24c8-6 16-6 20-2-2 6-12 8-20 2z" fill="var(--c-leaf)"/>
  </g>
</symbol>

<symbol id="s-leaf" viewBox="0 0 100 100">
  <path d="M16 84C10 42 42 12 88 12 92 58 62 88 16 84z" fill="var(--c-leaf)"/>
  <path d="M88 12C92 58 62 88 16 84 50 76 74 52 88 12z" fill="var(--c-leaf-d)" opacity=".4"/>
  <path d="M18 82C40 62 62 40 84 16" stroke="var(--c-leaf-d)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <path d="M42 62l-2-14M56 48l-1-14M32 72l-12-4M54 60l12 2" stroke="var(--c-leaf-d)" stroke-width="2" stroke-linecap="round" fill="none"/>
</symbol>

<symbol id="s-nut" viewBox="0 0 100 100">
  <path d="M50 18c-20 0-32 14-32 32 0 20 14 34 32 34s32-14 32-34c0-18-12-32-32-32z" fill="#b98351"/>
  <path d="M50 18c20 0 32 14 32 32 0 20-14 34-32 34 12-10 18-22 16-36-1-12-8-22-16-30z" fill="#8e5d34" opacity=".5"/>
  <path d="M50 18c-7 10-8 20-2 32s6 22 2 34" stroke="#7a4e2a" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M30 34c4 6 10 8 16 6M32 58c6-4 10-2 14 4M68 40c-4 4-8 4-12 2M66 64c-4-2-8 0-10 4" stroke="#7a4e2a" stroke-width="2" stroke-linecap="round" fill="none" opacity=".65"/>
  <ellipse cx="32" cy="36" rx="4" ry="8" transform="rotate(25 32 36)" fill="#fff" opacity=".28"/>
</symbol>

<symbol id="s-plate" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="var(--c-white)" stroke="#e7dcc2" stroke-width="3"/>
  <circle cx="50" cy="50" r="29" fill="none" stroke="#efe5cc" stroke-width="3"/>
  <circle cx="50" cy="50" r="24" fill="#faf3e0"/>
</symbol>

<symbol id="s-bowl" viewBox="0 0 100 100">
  <path d="M18 46c3-14 18-22 32-22s29 8 32 22z" fill="var(--c-cream)"/>
  <circle cx="34" cy="40" r="3" fill="#fff"/><circle cx="46" cy="34" r="3" fill="#fff"/><circle cx="58" cy="38" r="3" fill="#fff"/><circle cx="68" cy="42" r="3" fill="#fff"/>
  <ellipse cx="42" cy="42" rx="5" ry="3.2" fill="#7a4a2a"/><ellipse cx="56" cy="44" rx="5" ry="3.2" fill="#7a4a2a"/><ellipse cx="66" cy="36" rx="4.4" ry="3" fill="#7a4a2a"/>
  <path d="M10 46h80c0 26-17 42-40 42S10 72 10 46z" fill="var(--terra)"/>
  <path d="M50 88c23 0 40-16 40-42H64c0 20-6 34-14 42z" fill="#000" opacity=".15"/>
  <path d="M10 46h80" stroke="#e9a07a" stroke-width="3" stroke-linecap="round"/>
  <path d="M26 62c8 4 20 6 30 4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3" fill="none"/>
</symbol>

<symbol id="s-jug" viewBox="0 0 100 100">
  <path d="M30 22h38l8 12c3 22 1 44-8 56H32c-9-12-11-34-8-56z" fill="#e8f6fb" stroke="#bfe0ec" stroke-width="2.5"/>
  <path d="M27 50h46c1 14-1 30-7 40H33c-6-10-8-26-6-40z" fill="var(--c-water)"/>
  <path d="M27 50h46" stroke="#fff" stroke-width="3" opacity=".6"/>
  <path d="M74 38c14-2 18 10 14 20-3 8-10 10-14 8" stroke="#bfe0ec" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <path d="M36 32c-2 14-2 28 2 44" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7" fill="none"/>
  <path d="M30 22c-5 0-8-4-8-8 6 2 14 4 20 8z" fill="#e8f6fb" stroke="#bfe0ec" stroke-width="2"/>
</symbol>

<symbol id="s-glass" viewBox="0 0 100 100">
  <path d="M26 16h48l-6 72c0 3-2 5-5 5H37c-3 0-5-2-5-5z" fill="#eaf7fb" stroke="#bfe0ec" stroke-width="2.5"/>
  <path d="M29 42h42l-4 46H33z" fill="var(--c-water)"/>
  <path d="M29 42h42" stroke="#fff" stroke-width="3" opacity=".6"/>
  <path d="M36 22l3 60" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
</symbol>

<symbol id="s-drop" viewBox="0 0 100 100">
  <path d="M50 8C36 32 20 46 20 64c0 18 13 28 30 28s30-10 30-28C80 46 64 32 50 8z" fill="var(--c-water)"/>
  <path d="M50 8c14 24 30 38 30 56 0 18-13 28-30 28 16-8 22-22 20-38-1-12-8-24-20-46z" fill="var(--c-water-d)" opacity=".4"/>
  <path d="M34 62c0 8 4 14 10 17" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>
</symbol>

<symbol id="s-clock" viewBox="0 0 100 100">
  <circle cx="50" cy="52" r="42" fill="url(#g-wood)"/>
  <circle cx="50" cy="52" r="36" fill="var(--c-white)"/>
  <circle cx="50" cy="52" r="36" fill="none" stroke="#e9dcc0" stroke-width="2"/>
  ${ticks}
  <path d="M50 52V30" stroke="var(--c-wood-d)" stroke-width="4.4" stroke-linecap="round"/>
  <path d="M50 52l15 9" stroke="var(--c-wood-d)" stroke-width="3.6" stroke-linecap="round"/>
  <circle cx="50" cy="52" r="4" fill="var(--terra)"/>
  <circle cx="26" cy="12" r="7" fill="var(--c-wood)"/><circle cx="74" cy="12" r="7" fill="var(--c-wood)"/>
</symbol>

<symbol id="s-bulb" viewBox="0 0 100 100">
  <g fill="var(--sun)" opacity=".9">${rays(8, 40, 48, 4)}</g>
  <circle cx="50" cy="42" r="24" fill="var(--sun-2)"/>
  <circle cx="50" cy="42" r="24" fill="none" stroke="var(--sun)" stroke-width="3"/>
  <path d="M42 46l4 8 4-8 4 8 4-8" stroke="var(--terra)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M38 60h24l-3 9H41z" fill="#cfc7b6"/>
  <rect x="40" y="70" width="20" height="8" rx="3" fill="#a79f8e"/>
  <rect x="44" y="78" width="12" height="6" rx="3" fill="#7e7767"/>
  <ellipse cx="41" cy="33" rx="4" ry="7" transform="rotate(30 41 33)" fill="#fff" opacity=".6"/>
</symbol>

<symbol id="s-sun" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="url(#g-glow)"/>
  <g fill="var(--sun)">${rays(12, 31, 44, 5)}</g>
  <circle cx="50" cy="50" r="22" fill="var(--sun-2)"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="var(--sun)" stroke-width="3"/>
  <ellipse cx="43" cy="43" rx="5" ry="8" transform="rotate(35 43 43)" fill="#fff" opacity=".45"/>
</symbol>

<symbol id="s-cloud" viewBox="0 0 100 100">
  <path d="M26 74c-11 0-18-8-18-17 0-9 7-16 16-16 2-12 12-20 25-20 14 0 24 9 26 21 9 1 15 7 15 16 0 9-7 16-17 16z" fill="var(--c-white)"/>
  <path d="M82 57c0 9-7 17-17 17H26c-11 0-18-8-18-17 12 8 40 9 74 0z" fill="#d8e3ea" opacity=".6"/>
</symbol>

<symbol id="s-moon" viewBox="0 0 100 100">
  <path d="M62 12A40 40 0 1 0 90 66 32 32 0 0 1 62 12z" fill="var(--sun-2)"/>
  <circle cx="40" cy="58" r="5" fill="var(--sun)" opacity=".5"/><circle cx="52" cy="76" r="3.4" fill="var(--sun)" opacity=".5"/><circle cx="32" cy="38" r="3" fill="var(--sun)" opacity=".5"/>
</symbol>

<symbol id="s-star" viewBox="0 0 100 100">
  <path d="M50 6l10 32 32 12-32 12-10 32-10-32-32-12 32-12z" fill="var(--sun)"/>
  <path d="M50 6l10 32 32 12-32 12z" fill="#fff" opacity=".25"/>
</symbol>

<symbol id="s-book" viewBox="0 0 100 100">
  <path d="M6 28c16-6 32-4 44 4v54c-12-8-28-10-44-4z" fill="#f6ecd2" stroke="#d9c9a3" stroke-width="2"/>
  <path d="M94 28c-16-6-32-4-44 4v54c12-8 28-10 44-4z" fill="#fff8e6" stroke="#d9c9a3" stroke-width="2"/>
  <path d="M6 82c16-6 32-4 44 4 12-8 28-10 44-4v6c-16-5-32-3-44 5-12-8-28-10-44-5z" fill="var(--c-forest-2)"/>
  <path d="M15 40c8-2 16-1 24 2M15 50c8-2 16-1 24 2M15 60c8-2 16-1 24 2M61 42c8-3 16-4 24-2M61 52c8-3 16-4 24-2" stroke="#c9b98f" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <path d="M50 32v54" stroke="#d9c9a3" stroke-width="2"/>
</symbol>

<symbol id="s-heart" viewBox="0 0 100 100">
  <path d="M50 88C20 66 8 48 8 32 8 18 19 10 31 10c8 0 15 4 19 11 4-7 11-11 19-11 12 0 23 8 23 22 0 16-12 34-42 56z" fill="#e0524c"/>
  <path d="M50 21c4-7 11-11 19-11 12 0 23 8 23 22 0 16-12 34-42 56 20-18 30-36 26-52-1-7-8-12-26-15z" fill="#b4302a" opacity=".4"/>
  <ellipse cx="26" cy="30" rx="4.4" ry="8" transform="rotate(35 26 30)" fill="#fff" opacity=".45"/>
</symbol>

<symbol id="s-seedling" viewBox="0 0 100 100">
  <ellipse cx="50" cy="86" rx="30" ry="10" fill="#7a5233"/>
  <ellipse cx="50" cy="83" rx="30" ry="9" fill="#946541"/>
  <path d="M50 84C50 66 49 56 50 44" stroke="var(--c-leaf-d)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <path d="M50 52C34 54 22 46 20 30c16-2 28 6 30 22z" fill="var(--c-leaf)"/>
  <path d="M50 44C54 28 66 18 82 18c0 18-12 28-32 26z" fill="var(--c-leaf-d)"/>
  <path d="M26 34c8 4 14 10 20 16M78 22c-8 6-16 14-24 20" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".4"/>
</symbol>

<symbol id="s-tree" viewBox="0 0 100 100">
  <path d="M44 94c1-14 2-26 0-42h12c-2 16-1 28 0 42z" fill="var(--c-wood)"/>
  <path d="M52 94c-1-14-1-26 0-42h4c-2 16-1 28 0 42z" fill="var(--c-wood-d)" opacity=".35"/>
  <path d="M50 70l-13-13M52 62l13-11" stroke="var(--c-wood)" stroke-width="4.4" stroke-linecap="round"/>
  <circle cx="50" cy="32" r="22" fill="var(--c-leaf)"/>
  <circle cx="30" cy="43" r="18" fill="var(--c-leaf)"/>
  <circle cx="70" cy="43" r="18" fill="var(--c-leaf)"/>
  <ellipse cx="50" cy="55" rx="30" ry="9" fill="var(--c-leaf-d)" opacity=".32"/>
  <circle cx="40" cy="26" r="6" fill="#fff" opacity=".14"/>
  <circle cx="38" cy="40" r="4.4" fill="var(--c-apple)"/><circle cx="60" cy="30" r="4.4" fill="var(--c-apple)"/><circle cx="68" cy="48" r="4.4" fill="var(--c-apple)"/><circle cx="28" cy="52" r="4.4" fill="var(--c-apple)"/><circle cx="52" cy="46" r="4.4" fill="var(--c-apple)"/>
</symbol>

<symbol id="s-pot" viewBox="0 0 100 100">
  <path d="M30 14c-6 8 6 12 0 22M48 8c-6 10 6 14 0 26M66 14c-6 8 6 12 0 22" stroke="var(--c-white)" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".85"/>
  <ellipse cx="50" cy="44" rx="34" ry="9" fill="#b9553a"/>
  <path d="M16 46h68v26c0 10-8 16-18 16H34c-10 0-18-6-18-16z" fill="var(--terra)"/>
  <path d="M66 46h18v26c0 10-8 16-18 16 8-6 4-26 0-42z" fill="#000" opacity=".15"/>
  <ellipse cx="50" cy="44" rx="34" ry="9" fill="none" stroke="#e9a07a" stroke-width="3"/>
  <path d="M12 54c-8 0-8 12 0 12M88 54c8 0 8 12 0 12" stroke="var(--c-wood-d)" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M26 58c-1 8 1 14 4 18" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3" fill="none"/>
</symbol>

<symbol id="s-scale" viewBox="0 0 100 100">
  <path d="M50 22v62M34 90h32" stroke="var(--c-wood-d)" stroke-width="6" stroke-linecap="round"/>
  <path d="M20 40L80 34" stroke="var(--c-wood)" stroke-width="5" stroke-linecap="round"/>
  <circle cx="50" cy="22" r="6.5" fill="var(--sun)" stroke="var(--c-wood-d)" stroke-width="3"/>
  <path d="M20 40L6 66M20 40L34 66M80 34L66 60M80 34L94 60" stroke="var(--c-wood-d)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M3 66h34c0 9-8 13-17 13S3 75 3 66z" fill="var(--terra)"/>
  <path d="M63 60h34c0 9-8 13-17 13S63 69 63 60z" fill="var(--terra)"/>
  <path d="M10 70c4 3 8 4 12 4" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".35" fill="none"/>
</symbol>

<symbol id="s-house" viewBox="0 0 100 100">
  <path d="M14 48L50 16l36 32z" fill="var(--terra)"/>
  <path d="M50 16l36 32H50z" fill="#000" opacity=".12"/>
  <rect x="22" y="46" width="56" height="42" rx="3" fill="var(--c-cream)"/>
  <rect x="42" y="62" width="16" height="26" rx="8" fill="var(--c-wood)"/>
  <rect x="27" y="54" width="12" height="12" rx="2" fill="var(--c-water)"/><rect x="61" y="54" width="12" height="12" rx="2" fill="var(--c-water)"/>
  <rect x="66" y="22" width="9" height="16" fill="var(--c-wood-d)"/>
</symbol>

<symbol id="s-child" viewBox="0 0 100 100">
  <path d="M24 98c-1-22 5-36 26-36s27 14 26 36z" fill="var(--sun)"/>
  <path d="M50 62c21 0 27 14 26 36H50z" fill="#000" opacity=".1"/>
  <path d="M26 70c-6 8-8 16-5 24l9 0c0-8 1-14 5-20z" fill="#f0a82a"/>
  <path d="M74 70c6 8 8 16 5 24l-9 0c0-8-1-14-5-20z" fill="#d9921c"/>
  <circle cx="21.5" cy="95" r="5.5" fill="var(--c-skin)"/><circle cx="78.5" cy="95" r="5.5" fill="var(--c-skin)"/>
  <circle cx="50" cy="34" r="22" fill="var(--c-skin)"/>
  <path d="M28 33c-2-15 10-26 22-26s24 11 22 26c-5-10-13-14-22-14s-17 4-22 14z" fill="var(--c-hair)"/>
  <circle cx="42" cy="38" r="2.6" fill="var(--c-wood-d)"/><circle cx="58" cy="38" r="2.6" fill="var(--c-wood-d)"/>
  <path d="M43 47c4 4.4 10 4.4 14 0" stroke="var(--c-wood-d)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <circle cx="35" cy="45" r="3.8" fill="#f59a8b" opacity=".6"/><circle cx="65" cy="45" r="3.8" fill="#f59a8b" opacity=".6"/>
</symbol>

<symbol id="s-adult" viewBox="0 0 100 100">
  <path d="M16 98c0-24 8-38 26-42h16c18 4 26 18 26 42z" fill="var(--leaf)"/>
  <path d="M50 56h8c18 4 26 18 26 42H50z" fill="#000" opacity=".1"/>
  <path d="M20 68c-6 10-7 20-4 30h10c-1-9 0-17 5-24z" fill="#3a8656"/>
  <path d="M80 68c6 10 7 20 4 30H74c1-9 0-17-5-24z" fill="#2f7448"/>
  <path d="M41 54c1 7 17 7 18 0l-2-9H43z" fill="var(--c-skin-d)"/>
  <path d="M42 56l8 12 8-12" fill="none" stroke="#2f7448" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="50" cy="30" r="19" fill="var(--c-skin)"/>
  <path d="M30 28c-3-14 8-24 20-24s23 10 20 24c-4-8-11-12-20-12s-16 4-20 12z" fill="var(--c-hair)"/>
  <circle cx="43" cy="33" r="2.4" fill="var(--c-wood-d)"/><circle cx="57" cy="33" r="2.4" fill="var(--c-wood-d)"/>
  <path d="M44 41c4 4 8 4 12 0" stroke="var(--c-wood-d)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
</symbol>

<symbol id="s-anchor" viewBox="0 0 100 100">
  <circle cx="50" cy="16" r="8" fill="none" stroke="var(--c-forest)" stroke-width="5"/>
  <path d="M50 24v62M34 40h32" stroke="var(--c-forest)" stroke-width="6" stroke-linecap="round"/>
  <path d="M14 62c4 22 20 28 36 28s32-6 36-28" stroke="var(--c-forest)" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M8 66l6-8 8 8M92 66l-6-8-8 8" stroke="var(--c-forest)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</symbol>

<symbol id="s-shield" viewBox="0 0 100 100">
  <path d="M50 8l36 12v26c0 22-14 38-36 46-22-8-36-24-36-46V20z" fill="var(--c-forest-2)"/>
  <path d="M50 8l36 12v26c0 22-14 38-36 46z" fill="#000" opacity=".14"/>
  <path d="M32 50l13 13 23-26" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</symbol>

<symbol id="s-feet" viewBox="0 0 100 100">
  <g fill="var(--c-forest-2)">
    <ellipse cx="34" cy="62" rx="13" ry="20" transform="rotate(-8 34 62)"/>
    <circle cx="26" cy="36" r="4.6"/><circle cx="35" cy="32" r="4.6"/><circle cx="44" cy="33" r="4.2"/><circle cx="50" cy="39" r="3.6"/>
    <ellipse cx="68" cy="44" rx="13" ry="20" transform="rotate(8 68 44)"/>
    <circle cx="60" cy="18" r="4.6"/><circle cx="69" cy="14" r="4.6"/><circle cx="78" cy="15" r="4.2"/><circle cx="84" cy="21" r="3.6"/>
  </g>
</symbol>

<symbol id="s-wind" viewBox="0 0 100 100">
  <g fill="none" stroke="var(--c-forest-2)" stroke-width="6" stroke-linecap="round">
    <path d="M10 36h52c12 0 18-14 8-20-6-3-14 1-14 8"/>
    <path d="M10 54h70c12 0 18 14 8 20-6 3-14-1-14-8"/>
    <path d="M10 72h38c8 0 12 8 6 13-4 3-10 1-10-5"/>
  </g>
</symbol>

<symbol id="s-pause" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="var(--c-sky)"/>
  <rect x="33" y="30" width="12" height="40" rx="5" fill="var(--c-forest)"/><rect x="55" y="30" width="12" height="40" rx="5" fill="var(--c-forest)"/>
</symbol>

<symbol id="s-basket" viewBox="0 0 100 100">
  <path d="M22 42c0-26 56-26 56 0" stroke="var(--c-wood-d)" stroke-width="5" stroke-linecap="round" fill="none"/>
  <g transform="translate(14 8) scale(.34)"><use href="#s-apple"/></g>
  <g transform="translate(36 2) scale(.36)"><use href="#s-pear"/></g>
  <g transform="translate(52 12) scale(.34)"><use href="#s-orange"/></g>
  <g transform="translate(30 14) scale(.34)"><use href="#s-grapes"/></g>
  <path d="M14 48h72l-8 38c-1 4-4 6-8 6H30c-4 0-7-2-8-6z" fill="#c99358"/>
  <path d="M86 48l-8 38c-1 4-4 6-8 6H50c18-8 26-26 36-44z" fill="#000" opacity=".12"/>
  <path d="M14 48h72" stroke="#a9753c" stroke-width="5" stroke-linecap="round"/>
  <path d="M22 60h56M24 72h52M28 84h44" stroke="#a9753c" stroke-width="3" stroke-linecap="round"/>
  <path d="M36 50l4 40M50 50v42M64 50l-4 40" stroke="#a9753c" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
</symbol>

<symbol id="s-hands" viewBox="0 0 100 100">
  <path d="M10 62c8-10 18-16 30-16h14c6 0 10 6 6 10-2 2-4 3-8 3H44c-2 0-2 3 0 3h26c6 0 14-4 20-10l4 8c-8 12-20 20-34 20H30c-8 0-14-4-20-10z" fill="var(--c-skin)"/>
  <path d="M10 62c6 6 12 10 20 10h22c-8 8-22 12-34 10-6-1-10-6-8-12z" fill="var(--c-skin-d)" opacity=".5"/>
  <path d="M50 44c-10-8-16-14-16-22 0-6 4-10 9-10 3 0 6 2 7 5 1-3 4-5 7-5 5 0 9 4 9 10 0 8-6 14-16 22z" fill="#e0524c"/>
</symbol>

<symbol id="s-fork" viewBox="0 0 100 100">
  <g transform="rotate(-18 50 50)" fill="#c9cfd2">
    <path d="M28 8v28c0 6 4 9 8 9v47h6V45c4 0 8-3 8-9V8h-5v22h-3V8h-5v22h-4V8z"/>
  </g>
  <g transform="rotate(18 50 50)" fill="#c9cfd2">
    <path d="M66 8c-8 6-10 22-8 38h8v44h6V8z"/>
  </g>
</symbol>

</svg>`;

export const SYMBOLS = [
  'apple', 'pear', 'grapes', 'orange', 'lemon', 'banana', 'wheat', 'bread', 'corn', 'tomato', 'carrot', 'leaf', 'nut',
  'plate', 'bowl', 'jug', 'glass', 'drop', 'clock', 'bulb', 'sun', 'cloud', 'moon', 'star', 'book', 'heart', 'seedling',
  'tree', 'pot', 'scale', 'house', 'child', 'adult', 'anchor', 'shield', 'feet', 'wind', 'pause', 'basket', 'hands',
  'fork',
];
