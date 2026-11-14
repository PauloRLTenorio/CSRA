# Como editar e manter o CSRA

O site é **estático**: HTML, CSS e JavaScript puros. Não há etapa de build nem dependências. Qualquer servidor de arquivos serve (o GitHub Pages serve direto da branch `main`).

## Rodar no seu computador

```bash
cd CSRA
python3 -m http.server 8765
# abra http://localhost:8765/
```

Dica: o navegador guarda arquivos em cache; recarregue com Cmd+Shift+R depois de editar.

## Onde está cada coisa

| Arquivo | O que faz |
|---|---|
| `index.html` | Estrutura da página inicial, textos fixos (herói, três ideias, sobre o livro, aviso) e metadados de compartilhamento |
| `js/data/stories.js` | **Todo o conteúdo das 12 paradas** (títulos, cores, cartões, citações) e o baralho de frases |
| `js/data/imagens.js` | Troca das ilustrações por imagens (veja `docs/imagens-gemini.md`) |
| `js/ui/sprite.js` | Biblioteca das ilustrações SVG (frutas, pão, relógio etc.) |
| `js/ui/art.js` | Como as ilustrações são compostas em cada cartão (`layout`, `anim`) |
| `js/ui/viewer.js` | O visualizador de cartões (toque, deslize, teclado, progresso) |
| `js/ui/widgets/*.js` | As 11 interações (prato, nuvem, relógio, pausa etc.) |
| `css/*.css` | Visual: `tokens.css` (cores e tamanhos), `home.css`, `story.css`, `widgets.css` |

## Editar ou criar um cartão

Em `js/data/stories.js`, cada parada tem uma lista `cards`. Um cartão comum:

```js
say('Título curto do cartão.', 'Texto de apoio, em uma ou duas frases.',
    { items: ['apple', 'wheat'], layout: 'two', anim: 'float' },
    'Cap. 4, § 111',                       // referência exibida ("No livro: ...")
    { q: 'citação literal curta', note: 'aviso opcional' })
```

- `items`: ilustrações do sprite (`apple`, `pear`, `grapes`, `wheat`, `bread`, `leaf`, `nut`, `plate`, `clock`, `bulb`, `heart`, `anchor`, ... veja `SYMBOLS` em `js/ui/sprite.js`).
- `layout`: `one`, `two`, `three`, `four`, `five` ou `orbit` (um item grande no centro e os outros em volta).
- `anim`: `float`, `sway`, `pulse` ou `bounce`.
- Interações: `widget('prato', 'Título', 'Instrução')`. Nomes disponíveis: `prato`, `nuvem`, `refeicao`, `relogio`, `pausa`, `horta`, `balanca`, `remedios`, `cenario`, `plano`, `frase`, `compartilhar`.

O cartão final de cada parada ("Parada concluída") é criado sozinho, com o resumo (`recap`) e a indicação de leitura (`book`).

## Regras de ouro do conteúdo

1. **Palavras próprias.** O livro tem licença de uso pessoal (sem obras derivadas). Por isso o site parafraseia. Citações literais só curtas (**até 15 palavras**), sempre com capítulo e passagem.
2. **Conferir citações.** Depois de editar, rode a conferência contra o texto do livro (abaixo).
3. **Tom.** Sem culpa, sem medo, sem impor. O próprio livro pede equilíbrio, persuasão e atenção ao que cada corpo precisa.
4. **Saúde.** Não afirmar causas de doenças nem prometer curas. Em dúvida, mantenha o aviso "não substitui orientação médica".

## Conferir as citações contra o livro

1. Extraia o texto do PDF (no Mac, sem instalar nada). Salve este script como `extrair.js`:

   ```js
   ObjC.import('PDFKit'); ObjC.import('Foundation');
   function run(argv){
     var d = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(argv[0]));
     var out = [];
     for (var i = 0; i < d.pageCount; i++) out.push(ObjC.unwrap(d.pageAtIndex(i).string) || '');
     $(out.join('\n')).writeToFileAtomicallyEncodingError(argv[1], true, $.NSUTF8StringEncoding, null);
   }
   ```

   ```bash
   osascript -l JavaScript extrair.js "Conselhos-sobre-o-Regime-Alimentar.pdf" livro.txt
   ```

2. Rode:

   ```bash
   node scripts/exportar_citacoes.mjs > citacoes.json
   python3 scripts/verificar_citacoes.py livro.txt citacoes.json
   ```

   Qualquer linha `FALTA` ou `MAIS DE 15 PALAVRAS` precisa ser corrigida.

3. Atualize a tabela de fontes: `node scripts/gerar_fontes.mjs` (gera `docs/FONTES.md`).

**Não suba o PDF nem o texto extraído para o repositório.** O `.gitignore` já ignora `*.pdf` e a pasta `_trabalho/`.

## Publicar

O GitHub Pages está configurado para a branch `main` (raiz). Basta:

```bash
git add -A && git commit -m "ajustes" && git push
```

Em 1–2 minutos o site atualiza em https://paulorltenorio.github.io/CSRA/.

## Acessibilidade e movimento

- Todos os botões têm nome acessível; o visualizador prende o foco, fecha com Esc e navega com as setas do teclado.
- Quem ativa "reduzir movimento" no sistema vê as animações desligadas (`prefers-reduced-motion`).
- Tema claro/escuro automático (e botão para alternar).
