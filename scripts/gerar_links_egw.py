#!/usr/bin/env python3
"""Gera js/data/egw.js: para cada passagem numerada (§) do livro, o ID do parágrafo correspondente no site do EGW
(m.egwwritings.org/pt/book/11093), e confere se TODAS as referências do site ("Cap. 4, § 111") apontam para o lugar certo.

Entradas (ficam em _trabalho/, FORA do git, porque são texto do livro):
  _trabalho/livro.txt          texto do PDF, com as passagens numeradas
  _trabalho/egw/paras.json     parágrafos do site, baixados por scripts/baixar_egw.py
  _trabalho/egw/paginas.json   páginas do site (início de cada página)
Saída: js/data/egw.js — só números (IDs) e as frases curtas que o site já cita. Nenhum trecho do livro além delas.

Uso (na raiz do projeto):  python3 scripts/gerar_links_egw.py
Sai com erro se alguma referência não bater com o livro (capítulo errado, passagem inexistente, frase fora da passagem).
"""
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.parse

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRAB = os.path.join(RAIZ, '_trabalho')
EGW = os.path.join(TRAB, 'egw')
SAIDA = os.path.join(RAIZ, 'js', 'data', 'egw.js')


def chave(s):
    """Só letras e números, minúsculas, sem acento: compara textos ignorando hífen de fim de linha, espaços e pontuação."""
    s = unicodedata.normalize('NFKD', s.lower())
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if not unicodedata.combining(c)))


# ------------------------------------------------------------------ passagens numeradas no PDF
def cabecalho(l):
    s = l.strip()
    return (not s or s.startswith('=====[PAGINA') or re.fullmatch(r'\d{1,3}', s) or re.fullmatch(r'\d+ Conselhos sobre o Regime Alimentar', s)
            or re.fullmatch(r'Conselhos sobre o Regime Alimentar \d+', s) or re.fullmatch(r'.*\.\.\. \d+', s))


def passagens_pdf():
    L = open(os.path.join(TRAB, 'livro.txt'), encoding='utf-8').read().split('\n')
    ini_ap1 = next(i for i, l in enumerate(L) if i > 15000 and l.startswith('Apêndice 1 — Experiência pessoal'))
    secoes = {'cap': [], 'ap1': []}
    esperado, sec = 1, 'cap'
    for i in range(490, len(L)):
        if sec == 'cap' and i >= ini_ap1:
            sec, esperado = 'ap1', 1
        m = re.match(r'^(\d{1,3})\.\s+\S', L[i])
        if not m:
            continue
        n = int(m.group(1))
        if esperado <= n <= esperado + 2:  # tolera 1-2 passagens que o texto do PDF não deixou reconhecer
            abertura, j = L[i][m.end(1) + 1:], i + 1
            while len(chave(abertura)) < 70 and j < i + 6:
                if not cabecalho(L[j]):
                    abertura += ' ' + L[j]
                j += 1
            secoes[sec].append((n, chave(abertura)))
            esperado = n + 1
    return secoes


# ------------------------------------------------------------------ parágrafos do site
def carregar_site():
    paras = json.load(open(os.path.join(EGW, 'paras.json'), encoding='utf-8'))
    paginas = json.load(open(os.path.join(EGW, 'paginas.json'), encoding='utf-8'))
    pag_de = {}
    for p in paginas:
        for i in p['ids']:
            pag_de[i] = p['inicio']
    cap_de, atual, caps, ap = {}, None, {}, {}
    for p in paras:
        if p['tag'] == 'h3':
            m = re.match(r'Cap[ií]tulo (\d+)', p['text'])
            a = re.match(r'Ap[eê]ndice (\d+)', p['text'])
            atual = m.group(1) if m else ('a' + a.group(1) if a else None)
            if atual:
                caps[atual] = p['id']
        cap_de[p['id']] = atual
    return paras, pag_de, cap_de, caps


def numeradas(corpo):
    """{número da passagem: ID do parágrafo}, lendo o número que abre cada passagem no texto do site (em ordem crescente)."""
    out, esperado = {}, 1
    for p in corpo:
        m = re.match(r'^(\d{1,3})\.(?:\s|$)', p['text'])
        if m and esperado <= int(m.group(1)) <= esperado + 2:
            out[int(m.group(1))] = p['id']
            esperado = int(m.group(1)) + 1
    return out


def alinhar(lista, corpo):
    """Casa cada passagem do PDF com o parágrafo do site que começa igual (em ordem, sem voltar atrás)."""
    res, j = {}, 0
    chaves = [chave(p['text'])[:40] for p in corpo]
    for n, k in lista:
        alvo, achou = k[:40], None
        for t in range(j, min(j + 80, len(corpo))):
            if chaves[t] == alvo:
                achou = t
                break
        if achou is None:  # tolera pequenas diferenças (ligaturas, hífens do PDF)
            melhor = (0, None)
            for t in range(j, min(j + 30, len(corpo))):
                r = difflib.SequenceMatcher(None, alvo, chaves[t]).ratio()
                if r > melhor[0]:
                    melhor = (r, t)
            if melhor[0] >= 0.88:
                achou = melhor[1]
        if achou is not None:
            res[n] = achou
            j = achou + 1
    return res


# ------------------------------------------------------------------ referências usadas no site
N = r'\d{1,3}'
ITEM = rf'{N}(?:\s*[–-]\s*{N})?'
LISTA = rf'{ITEM}(?:\s*(?:e|,)\s*{ITEM})*'
RE_REF = re.compile(rf'(Caps?\.|Apêndice)\s*(\d{{1,2}})(?:\s+e\s+(\d{{1,2}}))?(?:,\s*(?:(§§?)\s*({LISTA})|“([^”]{{3,100}})”))?')


def itens(lista):
    out = []
    for p in re.split(r'\s*(?:e|,)\s*', lista):
        ps = re.split(r'\s*[–-]\s*', p)
        out.append((int(ps[0]), int(ps[1]) if len(ps) > 1 else None))
    return out


def referencias_do_site():
    """[(texto, arquivo)] com todas as referências ao livro escritas no código do site."""
    achados = []
    for pasta, _, arqs in os.walk(os.path.join(RAIZ, 'js')):
        for a in arqs:
            if a.endswith('.js') and a not in ('egw.js', 'refs.js'):
                achados.append(os.path.join(pasta, a))
    achados.append(os.path.join(RAIZ, 'index.html'))
    out, soltos = [], []
    for f in achados:
        t = open(f, encoding='utf-8').read()
        spans = []
        for m in RE_REF.finditer(t):
            out.append((m, os.path.relpath(f, RAIZ)))
            spans.append(m.span())
        # todo "§" escrito no site precisa estar dentro de uma referência reconhecida, senão ficaria sem link
        for i, c in enumerate(t):
            if c == '§' and not any(a <= i < b for a, b in spans):
                soltos.append(f'{os.path.relpath(f, RAIZ)}: …{t[max(0, i - 25):i + 25]!r}…')
    return out, soltos


def citacoes_do_site():
    js = ("import {STORIES,RESUMO,FRASES} from './js/data/stories.js';const o=[];"
          "for(const s of [...STORIES,RESUMO])for(const c of s.cards)if(c.q)o.push({q:c.q,ref:c.ref});"
          "for(const f of FRASES)o.push({q:f.q,ref:f.ref});console.log(JSON.stringify(o));")
    r = subprocess.run(['node', '--input-type=module', '-e', js], cwd=RAIZ, capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def enc(s):
    return urllib.parse.quote(s, safe='').replace('-', '%2D')


def diretiva(sub):
    """Texto do destaque (#:~:text=) que o navegador aplica na página do livro."""
    ws = sub.split()
    limpa = lambda x: x.strip(' .,;:!?“”"\'()[]—')  # noqa: E731
    if len(ws) <= 8:
        return enc(limpa(sub))
    return enc(limpa(' '.join(ws[:4]))) + ',' + enc(limpa(' '.join(ws[-4:])))


def main():
    erros, avisos = [], []
    paras, pag_de, cap_de, caps = carregar_site()
    pdf = passagens_pdf()
    ids_ap1 = caps['a1']
    ids_ap2 = caps['a2']
    corpo_cap = [p for p in paras if p['tag'] == 'p' and caps['1'] <= p['id'] < ids_ap1]
    corpo_ap1 = [p for p in paras if p['tag'] == 'p' and ids_ap1 <= p['id'] < ids_ap2]

    # o texto do site traz o número de cada passagem ("111. A fim de saber..."): é daí que vem o mapa
    pas = numeradas(corpo_cap)
    ap1 = numeradas(corpo_ap1)
    print(f'Site: {len(pas)} passagens numeradas (cap. 1-25), {len(ap1)} no Apêndice 1')
    falt = [n for n in range(1, 823) if n not in pas]
    if falt:
        erros.append(f'passagens sem número no site: {falt[:40]}')

    # conferência cruzada: o começo de cada passagem no PDF (de onde tirei as referências) é o do parágrafo de mesmo número no site?
    por_id0 = {p['id']: p for p in paras}
    dif = []
    for nome, lista, mapa in (('', pdf['cap'], pas), ('ap', pdf['ap1'], ap1)):
        for n, k in lista:
            if n not in mapa:
                continue
            sitek = chave(re.sub(r'^\d+\.\s*', '', por_id0[mapa[n]]['text']))[:40]
            if sitek != k[:40] and difflib.SequenceMatcher(None, sitek, k[:40]).ratio() < 0.88:
                dif.append(f'{nome}{n}')
    print(f'PDF: {len(pdf["cap"])} passagens lidas (cap. 1-25) e {len(pdf["ap1"])} no Apêndice 1; comparadas com o site pelo número')
    if dif:
        erros.append(f'o começo do texto no PDF difere do site em: {dif[:40]}')
    else:
        print('Numeração do PDF e do site: idêntica em todas as passagens lidas.')
    # ordem crescente de IDs? (se não, o alinhamento errou)
    for nome, d in (('cap', pas), ('ap1', ap1)):
        ordem = [d[n] for n in sorted(d)]
        if ordem != sorted(ordem):
            erros.append(f'IDs fora de ordem em {nome}')

    # ---- confere cada referência escrita no site
    usadas, titulos_pedidos = set(), set()
    refs, soltos = referencias_do_site()
    erros += [f'"§" fora de uma referência reconhecida (ficaria sem link): {s}' for s in soltos]
    for m, arq in refs:
        rot, c1, c2, _, lista, titulo = m.groups()
        ap = rot == 'Apêndice'
        cap = f'a{c1}' if ap else c1
        if cap not in caps:
            erros.append(f'{arq}: "{m.group(0)}" — capítulo inexistente')
            continue
        if c2 and c2 not in caps:
            erros.append(f'{arq}: "{m.group(0)}" — capítulo {c2} inexistente')
        if titulo:
            titulos_pedidos.add((cap, titulo))
        if lista:
            for a, b in itens(lista):
                for n in ([a] if not b else range(a, b + 1)):
                    mapa = ap1 if ap else pas
                    if n not in mapa:
                        erros.append(f'{arq}: "{m.group(0)}" — passagem {n} sem par no site')
                    elif cap_de.get(mapa[n]) != cap:
                        erros.append(f'{arq}: "{m.group(0)}" — a passagem {n} está no capítulo {cap_de.get(mapa[n])}, não no {cap}')
                    else:
                        usadas.add((ap, n))

    # ---- títulos de partes ("Cap. 4, “O regime original”")
    titulos = {}
    for cap, titulo in sorted(titulos_pedidos):
        achado = None
        for p in paras:
            if p['tag'] in ('h3', 'h4', 'h5', 'h6') and cap_de.get(p['id']) == cap:
                t = re.sub(r'^(Cap[ií]tulo|Parte|Ap[eê]ndice) \d+\s*—\s*', '', p['text'])
                if chave(t) == chave(titulo):
                    achado = p['id']
                    break
        if achado is None:
            erros.append(f'título não encontrado no capítulo {cap}: “{titulo}”')
        else:
            titulos[f'{cap}:{titulo}'] = achado

    # ---- citações literais: em qual parágrafo está cada frase? (confere todos os pares frase+referência)
    def paragrafos_da(mapa, n, limite):
        """parágrafos do site que formam a passagem n: do que a abre até o que antecede a próxima passagem"""
        ini = mapa[n]
        prox = next((i for i in sorted(mapa.values()) if i > ini), limite)
        return [p for p in paras if p['tag'] == 'p' and ini <= p['id'] < prox]

    cit = {}
    for par in citacoes_do_site():
        q, ref = par['q'], par['ref']
        ap_ref = 'Apêndice' in ref
        mapa, limite = (ap1, ids_ap2) if ap_ref else (pas, ids_ap1)
        nums = []
        for m in RE_REF.finditer(ref):
            if m.group(5):
                for a, b in itens(m.group(5)):
                    nums += list(range(a, (b or a) + 1))
        achou = None
        for n in nums:
            if n in mapa:
                achou = next(((n, p) for p in paragrafos_da(mapa, n, limite) if chave(q) in chave(p['text'])), None)
                if achou:
                    break
        if not achou:
            erros.append(f'a frase não está na passagem indicada ({ref}): “{q}”')
            continue
        n, p = achou
        palavras = re.findall(r'\w+', q)
        mm = re.search(r'\W+'.join(re.escape(w) for w in palavras), p['text'], flags=re.IGNORECASE)
        if not mm:
            avisos.append(f'sem destaque (texto não localizado literalmente): “{q}”')
        destino = {'n': n, 'ap': ap_ref, 'u': [pag_de[p['id']], p['id'], diretiva(mm.group(0)) if mm else '']}
        if q in cit and cit[q]['u'][:2] != destino['u'][:2]:
            erros.append(f'a mesma frase aparece com referências que levam a parágrafos diferentes: “{q}” ({ref})')
        cit.setdefault(q, destino)

    # ---- saída
    def par(i):
        return f'[{pag_de[i]}, {i}]'

    def bloco(d, por_linha=6):
        itens_ = [f'{k}: {v}' for k, v in d]
        linhas = [', '.join(itens_[i:i + por_linha]) for i in range(0, len(itens_), por_linha)]
        return '{\n  ' + ',\n  '.join(linhas) + ',\n}'

    corpo = [
        '// GERADO por scripts/gerar_links_egw.py — não edite à mão. Só números: IDs dos parágrafos do livro no site do Ellen G. White Writings',
        '// (m.egwwritings.org/pt/book/11093.<página>#<parágrafo>), mais as frases curtas que o site já cita (para destacá-las na página do livro).',
        '// Chaves: CAPS = início de cada capítulo; PASSAGENS = nº da passagem (§) -> [página, parágrafo]; AP1 = o mesmo no Apêndice 1;',
        '// TITULOS = partes citadas por título ("capítulo:título" -> [página, parágrafo]); CITACOES = frase -> passagem (n) e destino com destaque (u).',
        '',
        'export const CAPS = ' + bloco([(k if k.isdigit() else f"'{k}'", v) for k, v in sorted(caps.items(), key=lambda x: (not x[0].isdigit(), int(re.sub(r"\D", "", x[0]))))], 6) + ';',
        '',
        'export const PASSAGENS = ' + bloco([(n, par(i)) for n, i in sorted(pas.items())], 5) + ';',
        '',
        'export const AP1 = ' + bloco([(n, par(i)) for n, i in sorted(ap1.items())], 5) + ';',
        '',
        'export const TITULOS = {\n' + ''.join(f'  {json.dumps(k, ensure_ascii=False)}: {par(i)},\n' for k, i in sorted(titulos.items())) + '};',
        '',
        'export const CITACOES = {\n' + ''.join(f'  {json.dumps(q, ensure_ascii=False)}: {{ n: {v["n"]}, {"ap: true, " if v["ap"] else ""}u: [{v["u"][0]}, {v["u"][1]}, {json.dumps(v["u"][2])}] }},\n' for q, v in sorted(cit.items())) + '};',
        '',
    ]
    # CAPS guarda só o ID do capítulo (página = ID)
    fonte = '\n'.join(corpo)
    print(f'referências conferidas: {len(usadas)} passagens distintas; títulos: {len(titulos)}; citações com destino: {len(cit)}')
    for a in avisos:
        print('aviso:', a)
    if erros:
        print('\nERROS:')
        for e in erros:
            print(' -', e)
        if '--forcar' not in sys.argv:
            sys.exit(1)
        print('(--forcar: escrevendo mesmo assim)')
    open(SAIDA, 'w', encoding='utf-8').write(fonte)
    print('escrevi', os.path.relpath(SAIDA, RAIZ), f'({len(fonte)} bytes)')


if __name__ == '__main__':
    main()
