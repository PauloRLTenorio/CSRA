# CSRA — Conselhos Sobre o Regime Alimentar

> **Tudo começou com um cardápio.**
> Uma jornada interativa, em cartões curtos, pelas ideias do livro *Conselhos Sobre o Regime Alimentar* (Ellen G. White).

🔗 **Site:** https://paulorltenorio.github.io/CSRA/

## O que é

Um site feito para quem está acostumado a conteúdo curto (stories, shorts, status): em vez de reproduzir o livro, ele **conta a mensagem como um palestrante**, em **12 paradas** de 1 a 2 minutos, mais uma versão de **60 segundos**. Cada parada é uma sequência de cartões com ilustração animada, uma ideia central e a indicação exata de onde ler mais no livro.

- **Página inicial interativa:** uma mesa posta; cada objeto abre uma história.
- **Cartões em tela cheia:** toque, deslize ou use as setas do teclado; barra de progresso; "continuar de onde parou".
- **Modo palestrante:** botão ▶ reproduz os cartões sozinhos; se o aparelho tiver voz em português, o botão de som narra em voz alta (usa a voz do próprio navegador, sem enviar nada para servidores do site).
- **11 interações:** montar o primeiro prato, nuvem sobre a mente, quantos pratos cabem, relógio do dia, pausa de 10 segundos, horta, balança do equilíbrio, roda dos oito remédios, "o que você diria?", plano de 7 dias, carta com frase do livro (e imagem para stories).
- **Celular primeiro** (em pé e deitado), com tema claro/escuro, sem cadastro e sem rastreamento.

## Como foi feito

HTML, CSS e JavaScript puros (sem build, sem dependências). Ilustrações em SVG feitas à mão (`js/ui/sprite.js`), fontes Inter e Newsreader locais (licença SIL OFL). Veja **[docs/COMO-EDITAR.md](docs/COMO-EDITAR.md)**.

```
index.html            página inicial
js/data/stories.js    conteúdo das paradas e frases
js/data/imagens.js    troca de ilustrações por imagens (Gemini etc.)
js/ui/…               visualizador, ilustrações, interações
css/…                 estilos e tokens de design
docs/                 guias: editar, imagens do Gemini, fontes de cada cartão
scripts/              conferência das citações e geração de docs/FONTES.md
```

## Direitos autorais e cuidados

- O livro (edição do Ellen G. White Estate) tem licença de uso pessoal e **não permite republicação nem obras derivadas**. Por isso este site **não reproduz o livro**: os textos são paráfrases em palavras próprias, e as citações literais são curtas (até 15 palavras), conferidas por script e sempre com capítulo e passagem. O PDF **não** faz parte deste repositório; o site aponta para a edição gratuita oficial.
- Conteúdo devocional e informativo, baseado em textos de mais de um século. **Não substitui a orientação de médico ou nutricionista.**
- Projeto independente, não oficial.
- Fontes: [Inter](https://rsms.me/inter/) e [Newsreader](https://github.com/productiontype/Newsreader), ambas SIL Open Font License 1.1.
