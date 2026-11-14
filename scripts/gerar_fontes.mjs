// Gera docs/FONTES.md: para cada cartão, a passagem do livro que o sustenta (e a citação curta, se houver).
// Uso (na raiz do projeto): node scripts/gerar_fontes.mjs
import { STORIES, RESUMO } from '../js/data/stories.js';
import { writeFileSync } from 'node:fs';

const linhas = [
  '# Fontes de cada cartão',
  '',
  'Este arquivo é gerado por `node scripts/gerar_fontes.mjs` a partir de `js/data/stories.js`.',
  'As referências seguem o formato **Cap. X, § N**: capítulo do livro e número da passagem (o livro numera as passagens de 1 a 822; o Apêndice 1 reinicia a contagem).',
  'Os textos do site são **paráfrases em palavras próprias**; só as citações da coluna “Citação” são trechos literais (todas com 15 palavras ou menos e conferidas por `scripts/verificar_citacoes.py`).',
  '',
];
const tabela = (s) => {
  linhas.push(`## ${s.n ? `Parada ${s.n} — ` : ''}${s.title}`, '', `Para ler no livro: ${s.book}.`, '', '| # | Cartão | Referência | Citação literal |', '|---|---|---|---|');
  s.cards.forEach((c, i) => {
    const titulo = (c.big || '').replace(/\|/g, '/');
    const q = c.q ? `“${c.q.replace(/\|/g, '/')}”` : '';
    linhas.push(`| ${i + 1} | ${c.k === 'widget' ? '🎮 ' : ''}${titulo} | ${c.ref || '—'} | ${q} |`);
  });
  linhas.push('');
};
tabela(RESUMO);
STORIES.forEach(tabela);
writeFileSync(new URL('../docs/FONTES.md', import.meta.url), linhas.join('\n'));
console.log('docs/FONTES.md gerado');
