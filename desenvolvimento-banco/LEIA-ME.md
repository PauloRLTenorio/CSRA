# CSRA — desenvolvimento COM banco (Firebase)

Endereço: <https://paulorltenorio.github.io/CSRA/desenvolvimento-banco/> (escondida do Google, com faixa laranja no topo).
A versão oficial (a raiz do site) **não muda** até alguém mandar "coloca em produção".

> **Pastas de desenvolvimento** (16/11/2026): `/desenvolvimento/` é a versão **sem banco**, onde se trabalha agora; `/desenvolvimento-banco/` (esta) guarda o que foi feito com o Firebase (comentários, caderno na nuvem, conta Google, `#/admin`). Esta pasta ficou **parada**: não há planos de levá-la à produção por enquanto.

## O que há de novo aqui

| Recurso | Onde aparece | Precisa de cadastro? |
| --- | --- | --- |
| **Cartão "Conversa"** | no fim de cada parada, depois da pergunta para levar | Não. Quem só lê não cria nada; ao enviar, o site cria um usuário anônimo |
| **Comentários com aprovação** | o comentário só aparece para os outros depois que o administrador aprova | Não |
| **Seu espaço** | botão de nuvem no cabeçalho e link no rodapé | Não |
| **Caderno na nuvem** | reflexões, plano de 7 dias e progresso passam a ser guardados no banco, se a pessoa autorizar (convite único dentro da interação) | Não |
| **Entrar com o Google** | opcional, em "Seu espaço": o caderno e os comentários acompanham a conta em qualquer aparelho | Opcional |
| **Painel de moderação** | `#/admin` (sem link em lugar nenhum) | Conta Google de administrador |

Tudo é opcional. Se o Firebase estiver fora do ar, bloqueado ou sem internet, o site funciona como a versão oficial.
Para desligar de vez: `ativa: false` em `js/nuvem/config.js`.

## Como funciona por dentro

- **Firebase** (projeto `csra-e60b2`, plano grátis, sem cartão, sem Analytics): Authentication (anônimo + Google) e Firestore (São Paulo).
- O SDK do Firebase (versão fixa, "lite" do Firestore) é carregado do gstatic **só** quando alguém abre o cartão Conversa ou autoriza o caderno. Quem apenas lê não faz nenhuma conexão com o Google.
- A configuração web do Firebase em `js/nuvem/config.js` é pública por desenho. **Quem protege os dados são as regras de segurança** (`firestore.rules`), testadas em `testes/regras.mjs`.

| Coleção | Conteúdo | Quem acessa |
| --- | --- | --- |
| `usuarios/{uid}` | caderno de cada pessoa | só ela |
| `comentarios_pendentes/{uid}_{parada}` | comentário aguardando aprovação | o dono (ler/apagar) e o administrador |
| `paradas/{parada}/comentarios/{uid}_{parada}` | comentário aprovado | todos leem; só o administrador cria; dono ou administrador apaga |
| `config/admin` | `{ uids: [...], emails: [...] }` do administrador | ninguém pelo site; só pelo console |

Regras do comentário: um por pessoa por parada, de 3 a 600 letras, nome opcional de até 40, sem links, e-mails nem `@`.

### Limites do plano grátis
50 mil leituras e 20 mil gravações por dia. A lista de comentários guarda 5 minutos em memória e traz no máximo 30 itens. Se passar do limite, o Firebase para até o dia virar, sem cobrar; o site continua funcionando sem comentários.

### Cuidados já tomados
- **Instagram**: o navegador interno do Instagram (e Facebook, TikTok…) bloqueia o login do Google. O site detecta e orienta a abrir no Chrome ou no Safari; o modo anônimo funciona em qualquer navegador.
- Usuário anônimo perde o acesso se limpar o navegador ou trocar de aparelho: o aviso está na tela e o login Google é a saída.
- "Seu espaço" permite **baixar** e **apagar** os próprios dados (caderno, comentários e a identidade).
- O texto que a pessoa digita nunca entra como HTML (sempre escapado).

## Moderação
1. Abra `…/desenvolvimento-banco/#/admin` no Chrome ou Safari e toque em **Entrar com o Google**, com a conta cadastrada em `config/admin`.
2. **Aguardando**: Aprovar (passa a aparecer para todos) ou Apagar. **Publicados**: escolha a parada e apague o que for preciso.
3. Se a conta não estiver na lista, o painel mostra um código; acrescente-o em `config/admin` → `uids` no Firestore.

## Testes
- Funções puras (junção do caderno, validação, detecção do navegador): `node --test desenvolvimento-banco/testes/nuvem.test.mjs`
- Regras do banco (cria usuários anônimos de teste no projeto real e apaga o que criou): `node desenvolvimento-banco/testes/regras.mjs --confirmo`
- Layout dos cartões: auditoria feita com um robô de Chrome sem janela (fora do repositório).

## Para publicar mudanças aqui
1. `node desenvolvimento-banco/scripts/gerar_sw.mjs` (atualiza o cache offline; o prefixo `devbanco-csra-` evita conflito com o da versão oficial).
2. `git add desenvolvimento-banco && git commit && git push` — o GitHub Pages leva 1–3 minutos.
3. Regras do Firestore: copiar `firestore.rules` no console (Firestore → Regras → Publicar).

## Quando for para produção (só quando o dono mandar)
1. Backup: `git tag antes-da-nuvem` na versão oficial.
2. Copiar `css/`, `js/`, `assets/`, `index.html`, `manifest.webmanifest` para a raiz, **sem** a faixa laranja, `noindex`, `canonical` de desenvolvimento e `[DEV]` no título.
3. Em `js/nuvem/config.js`: `ambiente: 'producao'`. No service worker da raiz o cache volta a ser `csra-…`.
4. Ajustar os textos que falam de "sem cadastro" e "sem rastreamento" (README e página inicial) se necessário, definir o contato para pedidos de remoção (LGPD) e conferir os avisos de privacidade.
5. Rodar as auditorias de layout e os testes de regras; publicar; conferir ao vivo.

## Pendências que dependem de decisão
- Contato para pedidos de remoção quando alguém perde o acesso ao próprio comentário (hoje o texto diz "fale com quem mantém o site").
- Reforçar a proteção contra abuso com **App Check** (reCAPTCHA) e restringir a chave de API do Firebase ao endereço do site.
- Enviar o livro por e-mail: o Firebase grátis não envia e-mail; exigiria outro serviço.
