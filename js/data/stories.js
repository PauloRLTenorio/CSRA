// Conteúdo do CSRA: 12 paradas. Texto em palavras próprias, inspirado no livro "Conselhos Sobre o Regime Alimentar".
// As citações (campo q) têm no máximo 15 palavras e são conferidas contra o texto do livro por _trabalho/verificar_citacoes.py.
// Cartões: say (afirmação), widget (interação). O cartão final ("end") é acrescentado automaticamente pelo visualizador.
// art: { items:[símbolos], layout:'one|two|three|four|five|orbit|row', anim:'float|sway|pulse|bounce' }

const say = (big, small, art, ref, extra = {}) => ({ k: 'say', big, small, art, ref, ...extra });
const widget = (w, big, small, extra = {}) => ({ k: 'widget', w, big, small, ...extra });

export const STORIES = [
  {
    id: 'primeiro-cardapio', n: 1, title: 'O primeiro cardápio',
    hook: 'Frutas, grãos, nozes e verduras: o que o Criador pôs na primeira mesa.',
    icon: 'basket', scene: 'garden',
    theme: { a: '#fff0c2', b: '#bfe4c6', ink: '#17382a', accent: '#2b6b4f', dark: false },
    recap: 'O ideal do livro é uma mesa de alimentos simples e naturais, da sua própria terra — alcançada passo a passo.',
    book: 'Cap. 4, “O regime original” (pp. 74–75) e Cap. 18, “Frutas, cereais e verduras” (pp. 264–279)',
    cards: [
      say('Antes de qualquer receita, existiu um cardápio.', 'O primeiro foi escolhido pelo próprio Criador, para um casal, num jardim.', { items: ['tree'], layout: 'one', anim: 'sway' }, 'Cap. 4, § 111'),
      say('Frutas. Grãos. Nozes. Verduras.', 'O livro chama esse quarteto de o regime escolhido pelo Criador: alimentos preparados do jeito mais simples e natural possível.', { items: ['apple', 'wheat', 'nut', 'leaf'], layout: 'four', anim: 'float' }, 'Cap. 4, § 111'),
      widget('prato', 'Monte o primeiro prato', 'Toque nos quatro grupos e veja o que o livro diz de cada um.'),
      say('Simples não é sem graça.', 'É o alimento chegando à mesa perto de como a natureza o fez, sem muito disfarce. O livro sugere cozinhar menos e comer mais frutas frescas.', { items: ['pear', 'grapes', 'orange'], layout: 'three', anim: 'bounce' }, 'Cap. 18, § 466'),
      say('Cada terra tem a sua mesa.', 'O livro pede alimentos de acordo com o clima, a estação e o que a sua região produz. Entre os exemplos citados estão arroz, milho, feijão e lentilha.', { items: ['corn', 'bowl', 'tomato'], layout: 'three', anim: 'float' }, 'Cap. 4, §§ 144–146'),
      say('O caminho de volta é passo a passo.', 'A autora fala em ser conduzido de volta ao plano original aos poucos, com cuidado e paciência, sem atropelar ninguém.', { items: ['feet', 'leaf'], layout: 'two', anim: 'sway' }, 'Cap. 23, § 648'),
      say('E o seu prato de hoje?', 'Sem nota e sem culpa: quantas cores da natureza ele tinha?', { items: ['plate', 'apple', 'leaf', 'carrot'], layout: 'orbit', anim: 'pulse' }, null),
    ],
  },

  {
    id: 'corpo-emprestado', n: 2, title: 'Um corpo emprestado',
    hook: 'Se a vida é um empréstimo, como investi-la bem?',
    icon: 'heart', scene: 'glow',
    theme: { a: '#ffe6c2', b: '#f7c58b', ink: '#3a2410', accent: '#b4532b', dark: false },
    recap: 'Cuidar do corpo é uma forma de gratidão — e recomeçar é sempre possível, sem culpa.',
    book: 'Cap. 1, “Razões para reforma” (pp. 16–40) e Cap. 2, “Regime e espiritualidade” (pp. 42–64)',
    cards: [
      say('A sua vida é um empréstimo.', 'É assim que o livro começa: se a vida foi emprestada, a pergunta é como investi-la bem em favor de Deus e das pessoas.', { items: ['heart'], layout: 'one', anim: 'pulse' }, 'Cap. 1, § 1', { q: 'A vida é-nos concedida apenas como um empréstimo' }),
      say('O corpo não é só seu.', 'Para o livro, o corpo foi criado e também resgatado por um preço alto. Cuidar dele é cuidar de algo que foi confiado a você.', { items: ['house', 'heart'], layout: 'two', anim: 'float' }, 'Cap. 1, § 10'),
      say('A pergunta que muda a mesa.', 'A questão não é o que o mundo faz. É como cada um trata a casa que recebeu.', { items: ['house'], layout: 'one', anim: 'sway' }, 'Cap. 1, § 10', { q: 'Como eu, que me declaro cristão, trato a habitação que Deus me deu?' }),
      say('Saber e não fazer pesa.', 'Muita gente diz: “sei mais do que pratico”. O livro responde que cada raio de luz recebido pede um passo.', { items: ['bulb', 'feet'], layout: 'two', anim: 'bounce' }, 'Cap. 1, §§ 12–13'),
      say('Saúde é um tesouro.', 'Dinheiro, estudo e prestígio perdem o sabor quando falta saúde. Nada compra de volta o que ela dá.', { items: ['star', 'heart', 'star'], layout: 'three', anim: 'float' }, 'Cap. 1, § 14', { q: 'A saúde é um tesouro.' }),
      say('Recomeçar é sempre possível.', 'O livro insiste que Deus é compassivo com quem, ao enxergar a luz, decide mudar. O ponto de partida é o cuidado, não a culpa.', { items: ['hands'], layout: 'one', anim: 'sway' }, 'Cap. 1, § 19'),
    ],
  },

  {
    id: 'mesa-e-mente', n: 3, title: 'A mesa e a mente',
    hook: 'O que pesa o estômago também embaça o pensamento.',
    icon: 'bulb', scene: 'sky',
    theme: { a: '#d6eef7', b: '#fff4dc', ink: '#17323f', accent: '#2a7aa0', dark: false },
    recap: 'Uma refeição simples ajuda a pensar, decidir e ouvir melhor.',
    book: 'Cap. 2, “Efeitos mentais da desobediência a leis físicas” (pp. 44–52) e Cap. 5 (pp. 91–104)',
    cards: [
      say('O que você come conversa com o que você pensa.', 'O livro vê o estômago e o cérebro como vizinhos de parede: o que acontece de um lado se sente do outro.', { items: ['bulb', 'plate'], layout: 'two', anim: 'float' }, 'Cap. 5, § 175'),
      widget('nuvem', 'Nuvem sobre a mente', 'Arraste e veja o que uma refeição pesada faz com o dia.'),
      say('Mente clara é um presente da mesa.', 'Comer, estudar e trabalhar com sabedoria é, para o livro, uma forma de honrar a inteligência que Deus nos deu.', { items: ['sun', 'bulb'], layout: 'two', anim: 'pulse' }, 'Cap. 5, § 153'),
      say('Quem manda: o hábito ou a decisão?', 'O livro inverte a ordem comum: a vontade deve conduzir o apetite, e não o contrário.', { items: ['adult'], layout: 'one', anim: 'sway' }, 'Cap. 1, § 35', { q: 'O corpo deve ser servo da mente, e não a mente serva do corpo.' }),
      say('Corpo esgotado, escolhas mais difíceis.', 'Tudo o que enfraquece o corpo, diz o livro, deixa a mente menos capaz de distinguir o bem do mal e a vontade menos firme para escolher o certo.', { items: ['cloud', 'moon'], layout: 'two', anim: 'float' }, 'Cap. 2, § 62'),
      say('Antes de algo importante, coma leve.', 'Para um culto, uma prova ou uma conversa decisiva, o livro sugere uma refeição mais simples e menor, para estar desperto.', { items: ['bread', 'glass'], layout: 'two', anim: 'bounce' }, 'Cap. 7, § 223'),
      say('Paz no prato, paz no humor.', 'O livro liga um estômago tranquilo a um temperamento mais tranquilo. Quem está bem por dentro tende a ser mais gentil por fora.', { items: ['heart', 'plate'], layout: 'two', anim: 'pulse' }, 'Cap. 5, § 187', { q: 'um estômago pacífico' }),
    ],
  },

  {
    id: 'simples-e-suficiente', n: 4, title: 'Simples é suficiente',
    hook: 'Poucos pratos, sabores honestos, mesa generosa sem exagero.',
    icon: 'bowl', scene: 'plain',
    theme: { a: '#e1efd2', b: '#fff6de', ink: '#26391c', accent: '#4a8a3a', dark: false },
    recap: 'Menos pratos por refeição, mais variedade entre uma refeição e outra — e casa aberta sem banquete.',
    book: 'Cap. 4, “O regime simples” (pp. 75–84) e Cap. 5, “Combinação de alimentos” (pp. 100–104)',
    cards: [
      say('Mais pratos, mais problemas?', 'O livro desconfia da mesa carregada demais: variedade excessiva numa só refeição cansa o corpo e tira o prazer de cada alimento.', { items: ['plate', 'bowl', 'bread'], layout: 'three', anim: 'bounce' }, 'Cap. 5, §§ 177–187'),
      widget('refeicao', 'Monte a refeição', 'Toque nos pratos para colocá-los na mesa. Quantos cabem em paz?'),
      say('Varie entre as refeições, não dentro delas.', 'Três ou quatro pratos já bastam; na refeição seguinte, mude. É aí que entra a criatividade de quem cozinha.', { items: ['bread', 'tomato', 'bowl', 'grapes'], layout: 'four', anim: 'float' }, 'Cap. 5, § 177'),
      say('O paladar aprende.', 'Quem se acostumou a sabores muito fortes demora a apreciar o simples. Mas o livro garante: persista, e o sabor delicado do alimento natural passa a agradar.', { items: ['lemon', 'leaf'], layout: 'two', anim: 'sway' }, 'Cap. 4, § 120', { q: 'Levará tempo até que o gosto se torne natural' }),
      say('Hospitalidade não precisa de banquete.', 'Jesus alimentou uma multidão com pão de cevada e peixe. O livro pede casas generosas e mesas simples, sem arruinar o orçamento nem o estômago de quem recebe.', { items: ['bread', 'hands'], layout: 'two', anim: 'float' }, 'Cap. 4, §§ 127–133'),
      say('O que sobra, serve.', 'O livro valoriza a economia: preparar de modo natural e barato, não desperdiçar sobras e usar o que se poupa para ajudar alguém.', { items: ['pot', 'hands'], layout: 'two', anim: 'pulse' }, 'Cap. 4, § 134; Cap. 14, § 386'),
    ],
  },

  {
    id: 'ritmo-do-dia', n: 5, title: 'O ritmo do dia',
    hook: 'Horários, intervalos e o descanso que o estômago também merece.',
    icon: 'clock', scene: 'sky',
    theme: { a: '#ffd9b5', b: '#f6a57f', ink: '#40200f', accent: '#b4532b', dark: false },
    recap: 'Horários regulares, intervalo entre as refeições e jantar leve — sem transformar isso em teste para ninguém.',
    book: 'Cap. 9, “Regularidade no comer” (pp. 153–162) e Cap. 5, “Comer devagar e mastigar bem” (pp. 97–99)',
    cards: [
      say('Seu estômago também precisa de descanso.', 'Em vez de trabalhar sem parar, o livro propõe dar a ele um tempo para terminar uma tarefa antes de começar outra.', { items: ['clock'], layout: 'one', anim: 'sway' }, 'Cap. 9, § 267', { q: 'alguma paz, sossego e descanso' }),
      widget('relogio', 'Relógio do dia', 'Arraste as refeições e veja o intervalo entre elas. Toque na linha para “beliscar”.'),
      say('Cinco horas, pelo menos.', 'É o intervalo que o livro recomenda entre uma refeição e outra: tempo para o estômago concluir um trabalho antes de receber o próximo.', { items: ['clock', 'plate'], layout: 'two', anim: 'float' }, 'Cap. 9, § 267', { q: 'Cinco horas, pelo menos, devem mediar entre cada refeição' }),
      say('Nada no meio.', 'A regra que mais surpreende: nem lanchinho nem beliscar na estrada. O prêmio prometido é chegar à mesa com fome de verdade e achar a comida uma delícia.', { items: ['apple'], layout: 'one', anim: 'bounce' }, 'Cap. 9, §§ 281–282', { note: 'Pessoas com diabetes, gestantes, crianças e quem usa medicação devem seguir a orientação do seu médico.' }),
      say('Duas ou três? O livro não faz disso um teste.', 'A autora preferia duas refeições, mas escreveu que ninguém deve ser obrigado: alguns se dão melhor com três leves. Persuasão, nunca imposição.', { items: ['plate', 'plate'], layout: 'two', anim: 'sway' }, 'Cap. 9, §§ 277–279'),
      say('Jantar leve — ou nenhum.', 'Uma ceia pesada, perto da hora de dormir, atrapalha o sono e o descanso do estômago. Se precisar comer à noite, o livro sugere algo bem leve, como pão torrado e fruta.', { items: ['moon', 'bread'], layout: 'two', anim: 'float' }, 'Cap. 9, §§ 272–273'),
      say('Devagar. Com gratidão.', 'Mastigar bem, sem pressa, e deixar as preocupações do lado de fora da mesa. O livro pede uma refeição calma e um coração agradecido.', { items: ['heart', 'plate'], layout: 'two', anim: 'pulse' }, 'Cap. 5, § 175', { q: 'comei devagar e satisfeitos, o coração cheio de gratidão' }),
    ],
  },

  {
    id: 'fome-ou-vontade', n: 6, title: 'Fome ou vontade?',
    hook: 'O apetite, a pausa de dez segundos e uma força que não vem só de nós.',
    icon: 'shield', scene: 'glow',
    theme: { a: '#2b5a48', b: '#1b3c31', ink: '#fff1d4', accent: '#f4b73f', dark: true },
    recap: 'Domínio próprio começa no coração, cabe em pequenas pausas e conta com ajuda maior que a nossa.',
    book: 'Cap. 8, “Controle do apetite” (pp. 128–152) e Cap. 1, “O exemplo de Daniel” (pp. 29–33)',
    cards: [
      say('Nem toda vontade é fome.', 'O livro observa que, às vezes, a “fome” é só um desejo da mente que ainda não aprendeu a esperar.', { items: ['plate'], layout: 'one', anim: 'pulse' }, 'Cap. 9, § 275'),
      widget('pausa', 'Pausa de 10 segundos', 'Antes de comer: pare, agradeça, escolha.'),
      say('A primeira batalha foi no prato.', 'Para o livro, a primeira tentação no Éden e a primeira de Jesus no deserto tiveram o mesmo terreno: o apetite. E foi ali que Cristo começou a vitória.', { items: ['apple', 'shield'], layout: 'two', anim: 'float' }, 'Cap. 8, §§ 237–240'),
      say('Daniel pediu dez dias.', 'Em Babilônia, Daniel propôs um teste curto: dez dias com comida simples. O livro conta que o resultado foi evidente, no semblante e no vigor.', { items: ['bowl', 'glass'], layout: 'two', anim: 'bounce' }, 'Cap. 1, § 34'),
      say('Primeiro o coração.', 'Tirar coisas do prato sem mudar por dentro não cura o apetite. A mudança verdadeira começa no coração e depois aparece na mesa.', { items: ['heart'], layout: 'one', anim: 'pulse' }, 'Cap. 1, § 39', { q: 'Nenhuma mera restrição de vossa dieta curará vosso apetite doentio.' }),
      say('Você não precisa vencer sozinho.', 'O livro afirma que uma vida vitoriosa sobre o apetite é possível a quem une a própria vontade, fraca e vacilante, à vontade de Deus.', { items: ['anchor', 'hands'], layout: 'two', anim: 'sway' }, 'Cap. 8, §§ 265–266'),
    ],
  },

  {
    id: 'cozinha-que-cura', n: 7, title: 'A cozinha que cura',
    hook: 'Cozinhar bem é um cuidado — e um serviço — que o livro leva muito a sério.',
    icon: 'pot', scene: 'glow',
    theme: { a: '#ffd7b0', b: '#f2a56c', ink: '#3f1e0b', accent: '#b4532b', dark: false },
    recap: 'Comida saudável só pega quando é saborosa. Aprender a cozinhar é parte da mudança.',
    book: 'Cap. 14, “Arte de cozinhar saudável” (pp. 216–229)',
    cards: [
      say('Quem cozinha, cuida.', 'O livro tem um carinho raro pela cozinheira: quem prepara bem a comida sustenta o corpo, o cérebro e o humor da casa inteira.', { items: ['pot'], layout: 'one', anim: 'sway' }, 'Cap. 14, § 369'),
      say('Saudável precisa ser gostoso.', 'Se a comida é sem sabor, o corpo aproveita menos e a pessoa desiste. O livro pede alimento escolhido com cuidado e preparado com inteligência e habilidade.', { items: ['bowl', 'lemon'], layout: 'two', anim: 'float' }, 'Cap. 14, § 390'),
      say('Não é a mudança que falha. É a panela.', 'A autora visitou muitas mesas e concluiu: quem desanima da reforma costuma estar sofrendo com comida mal preparada, não com a ideia em si.', { items: ['pot', 'leaf'], layout: 'two', anim: 'bounce' }, 'Cap. 14, §§ 374 e 379', { q: 'reforma de saúde é tornada deforma-saúde' }),
      say('Cozinhar é uma arte essencial.', 'O livro vai longe: põe as aulas de cozinha antes das de piano. Não despreza a música; só lembra o que sustenta a vida de todos os dias.', { items: ['pot', 'book'], layout: 'two', anim: 'float' }, 'Cap. 14, § 393', { q: 'A ciência culinária, porém, não é de pequena importância.' }),
      say('Aprenda — homens também.', 'O livro convoca homens e mulheres a aprender a cozinhar: um conhecimento que serve em casa, em viagem e na casa dos outros.', { items: ['adult', 'pot'], layout: 'two', anim: 'sway' }, 'Cap. 14, § 374', { q: 'Aprendam a cozinhar.' }),
      widget('horta', 'Plante algo', 'Toque nos canteiros: plante, regue e colha.'),
    ],
  },

  {
    id: 'pequenos-a-mesa', n: 8, title: 'Pequenos à mesa',
    hook: 'A primeira escola de comer é a mesa de casa.',
    icon: 'child', scene: 'sky',
    theme: { a: '#ffe9b8', b: '#ffc7c0', ink: '#44231f', accent: '#c0503c', dark: false },
    recap: 'Rotina, exemplo e firmeza amável ensinam mais que sermões.',
    book: 'Cap. 13, “A dieta infantil” (pp. 194–215) e Cap. 12 (pp. 189–193)',
    cards: [
      say('A primeira escola de comer é a mesa de casa.', 'O livro dedica capítulos à gestação e à infância: o que se vive à mesa nos primeiros anos molda hábitos para a vida toda.', { items: ['house', 'child'], layout: 'two', anim: 'float' }, 'Caps. 12 e 13'),
      say('Comer para viver, e não viver para comer.', 'É a ideia central do capítulo das crianças: ensinar cedo que a comida sustenta a vida, mas não é o objetivo dela.', { items: ['child', 'plate'], layout: 'two', anim: 'bounce' }, 'Cap. 13, § 346', { q: 'comer para viver, e não viver para comer' }),
      say('Rotina também é carinho.', 'Horários regulares e nada entre as refeições valem para os pequenos. Segundo o livro, acalmam o corpo e o humor.', { items: ['clock', 'child'], layout: 'two', anim: 'float' }, 'Cap. 13, §§ 343–346'),
      say('O exemplo ensina mais que o sermão.', 'O livro lembra que, quando os pais mantêm o próprio princípio à mesa, os filhos tendem a entrar na linha com naturalidade.', { items: ['adult', 'child'], layout: 'two', anim: 'sway' }, 'Cap. 13, § 344'),
      say('Dizer sim a tudo não é amor.', 'A autora usa uma expressão forte para ceder a todo desejo dos filhos só porque, no momento, é mais fácil do que negar.', { items: ['heart', 'hands'], layout: 'two', anim: 'pulse' }, 'Cap. 13, § 358', { q: 'bondade cruel' }),
      say('Ensine a ligar causa e efeito.', 'Em vez de só proibir, mostre o porquê. O livro pede que se ensine os filhos a raciocinar da causa para o efeito.', { items: ['bulb', 'child'], layout: 'two', anim: 'float' }, 'Cap. 25, § 783'),
    ],
  },

  {
    id: 'sem-extremos', n: 9, title: 'Sem extremos',
    hook: 'Entre o descuido e o rigor, existe o equilíbrio — e ele é gentil.',
    icon: 'scale', scene: 'plain',
    theme: { a: '#e6e1f7', b: '#fff0dc', ink: '#2a2347', accent: '#6a4bb5', dark: false },
    recap: 'Nutritivo e saboroso, adequado a cada corpo, passo a passo e sem impor nada a ninguém.',
    book: 'Cap. 11, “Extremos no regime alimentar” (pp. 170–188) e Apêndice 1 (pp. 413–426)',
    cards: [
      say('Existe um jeito de errar por zelo.', 'O livro avisa que a reforma de saúde pode virar o contrário do que pretende quando é levada ao extremo.', { items: ['scale'], layout: 'one', anim: 'sway' }, 'Cap. 11, § 324', { q: 'reforma de saúde torna-se a deformação da saúde' }),
      widget('balanca', 'A balança do equilíbrio', 'Arraste entre os dois extremos e procure o meio.'),
      say('Dieta pobre não é virtude.', 'Cortar sem substituir, comer pouco e mal: o livro diz que isso é erro. Quem muda precisa continuar bem nutrido.', { items: ['plate'], layout: 'one', anim: 'pulse' }, 'Cap. 4, § 135', { q: 'Ninguém deve adotar um regime paupérrimo.' }),
      say('Cada corpo é um corpo.', 'A autora contou que não podia comer feijão — e achava ridículo concluir que ninguém deveria. O que serve a um pode não servir a outro.', { items: ['bowl', 'adult'], layout: 'two', anim: 'float' }, 'Apêndice 1, § 26', { q: 'O que seria alimento para um, seria veneno para outro' }),
      say('Não faça da mesa um teste.', 'O livro pede persuasão, não imposição: ninguém deve ser medido pela forma de comer nem obrigado a mudar de uma vez.', { items: ['hands'], layout: 'one', anim: 'sway' }, 'Cap. 25, § 800', { q: 'Não fustigueis o povo. Guiai-o.' }),
      say('Ela mesma não vigiava os outros.', 'Em casa, cada um comia o que lhe fazia bem e, escreveu ela, não havia discussões. Ela procurava aprender o que era melhor para si e seguia em paz.', { items: ['house', 'heart'], layout: 'two', anim: 'float' }, 'Apêndice 1, § 25', { q: 'Não me faço critério para nenhuma outra pessoa.' }),
      say('Moderação à vista de todos.', 'O conselho bíblico citado no livro é um testemunho que se vê, não uma discussão que se vence.', { items: ['shield'], layout: 'one', anim: 'pulse' }, 'Cap. 21, § 592', { q: 'Seja a vossa moderação conhecida a todos os homens.' }),
    ],
  },

  {
    id: 'remedios-simples', n: 10, title: 'Remédios simples',
    hook: 'Ar, luz, água, descanso, movimento e confiança: a “farmácia” da natureza.',
    icon: 'drop', scene: 'water',
    theme: { a: '#c9efea', b: '#e6f6d4', ink: '#123b3a', accent: '#2a8a8a', dark: false },
    recap: 'Hábitos simples somam mais do que parece — e não dispensam o médico.',
    book: 'Cap. 17, “A dietética como remédio racional” (pp. 258–263) e Cap. 24, “Beber água” (pp. 360–361)',
    cards: [
      say('Oito remédios que não vêm em caixa.', 'O livro lista os “remédios” simples da natureza: ar puro, luz solar, abstinência do que faz mal, repouso, exercício, alimentação adequada, água e confiança em Deus.', { items: ['wind', 'sun', 'drop', 'moon'], layout: 'four', anim: 'float' }, 'Cap. 17, § 452', { q: 'Ar puro, luz solar, abstinência, repouso, exercício' }),
      widget('remedios', 'A roda dos oito remédios', 'Toque em cada um para ver o que o livro diz.'),
      say('A natureza trabalha devagar.', 'O livro reconhece que o processo de curar e construir é gradual e parece lento ao impaciente. Mas, quando não é atrapalhada, faz o seu trabalho bem.', { items: ['seedling'], layout: 'one', anim: 'sway' }, 'Cap. 17, § 452', { q: 'O processo da natureza para curar e construir, é gradual' }),
      say('Água: a melhor bebida.', 'O livro chama a água pura de uma das maiores bênçãos, na saúde e na doença. Bebida com generosidade, ajuda o corpo a fazer o seu trabalho.', { items: ['jug', 'glass'], layout: 'two', anim: 'bounce' }, 'Cap. 24, § 726'),
      say('Seja aluno do próprio corpo.', 'A autora escreveu que precisava conhecer a si mesma e aprender sempre como cuidar do corpo: ar, luz, exercício, roupa, comida e descanso.', { items: ['adult', 'book'], layout: 'two', anim: 'float' }, 'Cap. 17, § 454'),
      say('Fazer a parte — e confiar.', 'Orar por saúde e, ao mesmo tempo, fazer o que está ao alcance: o livro une fé e atitude. Deus ajuda a quem procura ajudar-se.', { items: ['anchor', 'hands'], layout: 'two', anim: 'sway' }, 'Cap. 1, §§ 29 e 38', { q: 'O Senhor ajuda aos que procuram ajudar-se' }),
      say('Remédio simples não substitui médico.', 'O livro valoriza hábitos saudáveis, e este site também. Mas doença pede avaliação profissional. Procure um médico e siga as orientações dele.', { items: ['shield'], layout: 'one', anim: 'pulse' }, null),
    ],
  },

  {
    id: 'mesa-que-abre-portas', n: 11, title: 'A mesa que abre portas',
    hook: 'Como cuidar da saúde cria pontes — e por que o livro pede ternura, não pressão.',
    icon: 'hands', scene: 'garden',
    theme: { a: '#ffe3a6', b: '#f7b267', ink: '#3a2205', accent: '#b4532b', dark: false },
    recap: 'Convide pelo exemplo, ensine com paciência e mantenha a saúde no seu lugar: um caminho, não o destino.',
    book: 'Cap. 3 (pp. 65–73) e Cap. 25, “Ensinando princípios saudáveis” (pp. 378–412)',
    cards: [
      say('Por que um livro de comida fala de missão?', 'Porque, para a autora, cuidar da saúde cria pontes: derruba preconceitos e abre portas para conversas que importam.', { items: ['house', 'hands'], layout: 'two', anim: 'float' }, 'Cap. 3, §§ 108–109'),
      say('Do jeito de Jesus.', 'O método que o livro destaca: conviver, simpatizar, atender às necessidades, ganhar a confiança — e só então convidar.', { items: ['hands', 'heart'], layout: 'two', anim: 'pulse' }, 'Cap. 25, § 791', { q: 'misturava-Se com os homens como uma pessoa que lhes desejava o bem' }),
      widget('cenario', 'O que você diria?', 'Três situações do dia a dia. Escolha como responder.'),
      say('Primeiro ensinar a cozinhar.', 'Antes de pedir mudanças, mostre como preparar comida saudável, saborosa e barata. O livro diz que não se deve apresentar as sugestões mais avançadas antes disso.', { items: ['pot', 'book'], layout: 'two', anim: 'float' }, 'Cap. 25, § 793', { q: 'instruir, instruir, instruir' }),
      say('Há tempo de falar e tempo de calar.', 'A autora não fazia palestras sobre comida a famílias pobres que recebiam um pouco de carne dos vizinhos. Primeiro, compaixão.', { items: ['heart'], layout: 'one', anim: 'pulse' }, 'Cap. 25, § 796', { q: 'Há tempo para falar, e tempo para calar.' }),
      say('Parte da mensagem, não a mensagem toda.', 'O livro é claro: a saúde é um ramo importante, mas não deve eclipsar o centro da fé. É um braço, não o corpo inteiro.', { items: ['anchor'], layout: 'one', anim: 'sway' }, 'Cap. 3, §§ 103–104'),
    ],
  },

  {
    id: 'proximo-passo', n: 12, title: 'Seu próximo passo',
    hook: 'Um plano de sete dias, uma frase para levar e um convite.',
    icon: 'tree', scene: 'night',
    theme: { a: '#1e4437', b: '#0f2a23', ink: '#fff1d4', accent: '#f4b73f', dark: true },
    recap: 'Um passo pequeno, repetido, vale mais que uma mudança grande abandonada.',
    book: 'O livro inteiro: 25 capítulos e dois apêndices',
    cards: [
      say('Você chegou até aqui.', 'Corpo emprestado, mesa simples, ritmo, domínio com graça, cozinha, lar, equilíbrio, remédios simples e portas abertas. Que passo cabe na sua semana?', { items: ['tree', 'apple', 'star'], layout: 'orbit', anim: 'float' }, null),
      widget('plano', 'Plano de 7 dias', 'Um gesto pequeno por dia. Marque o que fizer.'),
      widget('frase', 'Leve uma frase', 'Vire a carta e guarde uma frase curta do livro.'),
      widget('compartilhar', 'Convide alguém', 'Mostre a um amigo, sem explicar demais.'),
      say('Para ler tudo no livro.', 'O livro completo é gratuito em PDF. Cada parada indicou os capítulos para você ir direto ao ponto.', { items: ['book'], layout: 'one', anim: 'sway' }, null, { link: { href: 'https://media4.egwwritings.org/pdf/pt_CRA%28CD%29.pdf', txt: 'Abrir o PDF gratuito' } }),
    ],
  },
];

export const BY_ID = Object.fromEntries(STORIES.map((s) => [s.id, s]));

// Frases curtas (<= 15 palavras) do livro, conferidas por script. Usadas no sorteio "Leve uma frase".
export const FRASES = [
  { q: 'A saúde é um tesouro.', ref: 'Cap. 1, § 14', glosa: 'Nada compra de volta o que ela dá.' },
  { q: 'O corpo deve ser servo da mente, e não a mente serva do corpo.', ref: 'Cap. 1, § 35', glosa: 'Quem decide à mesa: o hábito ou você?' },
  { q: 'O perigo para nós não está na carência, mas na abundância.', ref: 'Cap. 1, § 33', glosa: 'Hoje, o desafio costuma ser o excesso.' },
  { q: 'O Senhor ajuda aos que procuram ajudar-se', ref: 'Cap. 1, § 38', glosa: 'Fazer a sua parte, e confiar.' },
  { q: 'Nenhuma mera restrição de vossa dieta curará vosso apetite doentio.', ref: 'Cap. 1, § 39', glosa: 'Mudança verdadeira começa por dentro.' },
  { q: 'Ninguém deve adotar um regime paupérrimo.', ref: 'Cap. 4, § 135', glosa: 'Cuidar de si não é passar privação.' },
  { q: 'Levará tempo até que o gosto se torne natural', ref: 'Cap. 4, § 120', glosa: 'O paladar aprende com paciência.' },
  { q: 'Na hora da refeição, expulsai o cuidado e os pensamentos ansiosos', ref: 'Cap. 5, § 175', glosa: 'Deixe a pressa do lado de fora.' },
  { q: 'Não penseis absolutamente nela.', ref: 'Cap. 5, § 174', glosa: 'Sobre ansiedade com comida: coma e descanse.' },
  { q: 'Comei em períodos regulares.', ref: 'Cap. 8, § 264', glosa: 'O ritmo cuida de você.' },
  { q: 'Cristo feriu a batalha no terreno do apetite, e saiu vitorioso', ref: 'Cap. 8, § 265', glosa: 'Você não luta sozinho.' },
  { q: 'comer para viver, e não viver para comer', ref: 'Cap. 13, § 346', glosa: 'A comida serve à vida.' },
  { q: 'reforma de saúde é tornada deforma-saúde', ref: 'Cap. 14, § 393', glosa: 'Comida ruim espanta qualquer mudança.' },
  { q: 'Aprendam a cozinhar.', ref: 'Cap. 14, § 374', glosa: 'Um convite direto, para homens e mulheres.' },
  { q: 'Não fustigueis o povo. Guiai-o.', ref: 'Cap. 25, § 800', glosa: 'Ternura convence mais que pressão.' },
  { q: 'Há tempo para falar, e tempo para calar.', ref: 'Cap. 25, § 796', glosa: 'Às vezes, o melhor sermão é o silêncio.' },
  { q: 'instruir, instruir, instruir', ref: 'Cap. 25, § 793', glosa: 'Ensine antes de cobrar.' },
  { q: 'Não me faço critério para nenhuma outra pessoa.', ref: 'Apêndice 1, § 25', glosa: 'Cada um cuida do seu prato.' },
];

// Citações usadas nos cartões, reunidas para a conferência automática.
export function todasCitacoes() {
  const out = [];
  for (const s of STORIES) for (const c of s.cards) if (c.q) out.push(c.q);
  for (const f of FRASES) out.push(f.q);
  return out;
}
