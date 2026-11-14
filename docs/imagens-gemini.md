# Como trocar as ilustrações por imagens do Gemini

O site já funciona com ilustrações em SVG feitas à mão (leves, nítidas e animadas). Quando você gerar imagens no Gemini, é só soltar os arquivos numa pasta e apontar para eles — **sem mexer no HTML nem nos cartões**.

## Passo a passo

1. Gere a imagem (veja os prompts abaixo) em proporção **4:5 vertical** (ex.: 1200 × 1500 px).
2. Salve em `assets/img/` (crie a pasta se não existir), de preferência em **.webp** ou **.jpg** com menos de 250 KB. Exemplo: `assets/img/parada-1.webp`.
3. Abra `js/data/imagens.js` e preencha a chave correspondente:

   ```js
   'parada-1': 'assets/img/parada-1.webp',
   ```

4. Rode `node scripts/gerar_sw.mjs` (inclui as imagens no cache offline), faça o commit e o push. Em 1 ou 2 minutos o GitHub Pages publica. Chave vazia (`''`) = o site continua usando a ilustração SVG.

## Onde cada imagem aparece

| Chave | Onde aparece | Proporção sugerida |
|---|---|---|
| `hero` | Fundo da página inicial (atrás do texto e da mesa interativa) | 16:9 largo (2400 × 1350), com o lado esquerdo mais calmo |
| `parada-0` | Cartão de abertura e final do "livro em 60 segundos" | 4:5 |
| `parada-1` … `parada-12` | **1º cartão** da parada, **cartão final** e miniatura na lista de paradas | 4:5 (o miniatura recorta o centro) |
| `c-<parada>-<cartão>` | Substitui a ilustração de **um cartão específico**. Ex.: `c-5-3` = parada 5, 3º cartão | 4:5 |
| `og` | Só para referência: a imagem de compartilhamento fica em `assets/og-image.png` (1200 × 630) | 1200 × 630 |

Dicas de composição: um painel de texto cobre o **terço inferior** da imagem no celular; deixe o assunto principal no terço superior e médio. Em celular deitado a imagem é recortada nas laterais; mantenha o centro limpo.

## Guia de estilo (cole no começo de todo prompt)

> Ilustração editorial em estilo flat, com leve textura de papel, formas arredondadas e suaves, paleta natural e calorosa (creme #FFF8EA, verde-floresta #1E4D3A, verde-sálvia #8DB596, dourado #F4B73F, terracota #C9633C), luz suave de manhã, composição vertical 4:5. Assunto principal no terço superior e médio; terço inferior mais simples e calmo. **Sem texto, sem letras, sem logotipos, sem marca d'água.** Se houver pessoas, desenhe-as de forma simples, estilizada e amigável (sem realismo).

Todos os temas e cores das paradas estão em `js/data/stories.js` (campo `theme`). Se quiser que cada imagem combine com o fundo do cartão, cite a cor dominante no prompt.

## Prompts sugeridos

**hero** (16:9): *Amanhecer num jardim de colinas suaves, sol dourado nascendo à direita com brilho quente, duas macieiras carregadas de frutos, uma longa mesa de madeira posta ao ar livre com cesta de frutas, pão e jarra de água, céu verde-água se abrindo em tons de pêssego. Lado esquerdo da imagem calmo e com pouco detalhe.*

**parada-0 — O livro em 60 segundos**: *Uma mesa posta ao amanhecer com um relógio de mesa, uma maçã e uma pequena planta brotando; sensação de calma e começo.*

**parada-1 — O primeiro cardápio**: *O jardim do Éden ao amanhecer: uma macieira carregada, espigas de trigo dourado, nozes e folhas verdes em primeiro plano, uma cesta com uvas e peras sobre a grama; luz dourada.*

**parada-2 — Um corpo emprestado**: *Mãos abertas, simples e acolhedoras, segurando uma pequena casa luminosa com um coração pairando acima; tons de âmbar e pêssego; sensação de gratidão e cuidado.*

**parada-3 — A mesa e a mente**: *Uma lâmpada acesa e brilhante sobre uma mesa limpa com um prato simples; céu claro com poucas nuvens leves; ao fundo, nuvens cinzentas se afastando; tons azul-claro e creme.*

**parada-4 — Simples é suficiente**: *Vista levemente inclinada de uma mesa de madeira com apenas três pratos simples (arroz e feijão, salada, pão integral), muito espaço livre; tons verde-sálvia e creme.*

**parada-5 — O ritmo do dia**: *Um relógio de parede antigo numa cozinha ao amanhecer, sol entrando pela janela desenhando uma faixa de luz na mesa onde há apenas um prato; tons de pêssego e terracota.*

**parada-6 — Fome ou vontade?**: *Tons de verde-escuro e dourado: um prato vazio e uma maçã sob a luz de uma pequena vela, com uma montanha serena ao fundo e um céu de aurora; sensação de força interior e calma.*

**parada-7 — A cozinha que cura**: *Cozinha acolhedora: uma panela fumegando no fogão, ervas frescas, pão assando no forno e uma colher de pau; luz quente de fim de tarde; terracota e dourado.*

**parada-8 — Pequenos à mesa**: *Mesa de família com uma cadeirinha infantil, pratinhos pequenos e coloridos com frutas, mãos de adulto e de criança estilizadas se encontrando; tons de pêssego, rosa-claro e amarelo-manteiga.*

**parada-9 — Sem extremos**: *Uma balança de madeira perfeitamente equilibrada, com uma maçã num prato e um pão no outro; fundo lavanda suave e creme; formas calmas e simétricas.*

**parada-10 — Remédios simples**: *Natureza pura: um riacho cristalino, folhas ao vento, raios de sol atravessando a copa das árvores, um copo de água sobre uma pedra e uma trilha de pegadas; tons aqua e verde-claro.*

**parada-11 — A mesa que abre portas**: *Uma porta de madeira entreaberta com luz dourada saindo; do outro lado, uma mesa posta num jardim e um caminho convidativo; tons de dourado e laranja suave.*

**parada-12 — Seu próximo passo**: *Noite estrelada num jardim; uma pequena árvore com frutos brilhantes como lanternas, vaga-lumes e, ao longe, uma mesa iluminada por uma lamparina; verde-escuro profundo e dourado.*

## Prompt-modelo para imagens de cartões individuais (`c-<parada>-<cartão>`)

> [Guia de estilo]. Cena: [descreva o tema do cartão em uma frase, usando o título do cartão em `js/data/stories.js`]. Elementos: [2 a 4 objetos, como os que aparecem no cartão]. Cor dominante: [a cor `a`/`b` da parada].

## Dicas

- Gere sempre em lote com o mesmo guia de estilo para manter o conjunto coeso.
- Se a imagem tiver muito detalhe, o texto do cartão (que fica sobre um painel) continua legível, mas imagens mais calmas funcionam melhor.
- Para conferir: abra o site no celular em pé e deitado e passe pelos cartões. As imagens têm um leve movimento lento (zoom suave); quem prefere menos movimento no sistema o desativa automaticamente.
