# CSRA — desenvolvimento SEM banco

Endereço: <https://paulorltenorio.github.io/CSRA/desenvolvimento/> (escondida do Google, com faixa laranja "Dev sem banco" no topo).
É uma cópia da versão oficial onde se trabalha **antes** de ir para a produção. A raiz do site **só muda** quando alguém mandar "coloca em produção".

- `/desenvolvimento/` (esta): sem Firebase, sem comentários e sem nuvem. É aqui que ficam as mudanças novas.
- `/desenvolvimento-banco/`: a versão com Firebase (comentários, caderno na nuvem, conta Google, `#/admin`). Está **parada**; ver o `LEIA-ME.md` dela.

## O que esta pasta tem de diferente da versão oficial
| O quê | Detalhe |
| --- | --- |
| Cartão 2 da parada 1 e cartão da página inicial (Resumo) | o link "Cap. 4, § 111" abre o parágrafo 488 do site oficial **com a frase "Cereais, frutas, nozes e verduras constituem o regime dietético escolhido por nosso Criador" destacada**. Antes, os dois cartões levavam ao começo do § 111 |
| Links "No livro" de 11 cartões e 6 interações (17/11/2026) | passagens que ocupam vários parágrafos no site oficial: o link agora abre o parágrafo de que o texto fala, com a frase destacada (campo `hl` em `js/data/stories.js`; nas interações, `hl` em `cenario.js`, `remedios.js` e `refeicao.js`) |
| `js/ui/viewer.js` | campo novo de cartão, `hl`: frase do livro (não aparece na tela) que o link "No livro" destaca |
| `scripts/gerar_links_egw.py` | agora aceita a pasta: `python3 scripts/gerar_links_egw.py desenvolvimento` |

Só existem aqui por ser desenvolvimento (**não vão para a produção**): `css/dev.css`, a faixa `.devbar` e o `noindex`/`canonical`/`[DEV]` do `index.html`, o nome do `manifest.webmanifest`, e o prefixo `dev-csra-` do cache em `scripts/gerar_sw.mjs`.

## Para publicar mudanças aqui
1. Se mexer em referências ao livro (`Cap. X, § Y`): `python3 scripts/gerar_links_egw.py desenvolvimento` (confere tudo e gera `js/data/egw.js`).
2. `node desenvolvimento/scripts/gerar_sw.mjs` (atualiza o cache offline).
3. `git add desenvolvimento && git commit && git push` — o GitHub Pages leva 1–3 minutos.

## Quando for para produção (só quando o dono mandar)
1. Copiar para a raiz: `js/`, `css/` (sem `dev.css`), `assets/`; do `index.html`, só o que mudou de conteúdo (sem a faixa laranja, `noindex`, `canonical`/`og:url` de desenvolvimento, `[DEV]` no título e o `<link>` do `dev.css`).
2. `node scripts/gerar_sw.mjs` na raiz (cache `csra-…`) e, se mexeu em referências, `python3 scripts/gerar_links_egw.py`.
3. Commit, push, conferir ao vivo.
