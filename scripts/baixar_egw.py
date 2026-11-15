#!/usr/bin/env python3
"""Percorre o livro no site do EGW (m.egwwritings.org/pt/book/11093), seguindo "Next", e guarda em _trabalho/egw/
o ID e o texto de cada parágrafo. Serve só para descobrir a quais IDs apontar os links do CSRA.
Os dados ficam em _trabalho/egw/ (fora do git): o texto do livro NUNCA vai para o repositório.
Uso (na raiz do projeto):  python3 scripts/baixar_egw.py     (retoma de onde parou: as páginas já baixadas ficam em _trabalho/egw/html/)
Depois: python3 scripts/gerar_links_egw.py
"""
import html as H
import json
import os
import re
import sys
import time
import urllib.request

BOOK = 11093
HOST = 'https://m.egwwritings.org'
UA = 'Mozilla/5.0 (compatible; csra-link-builder/1.0)'
PAUSA = 0.8  # segundos entre pedidos (educado com o servidor)
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(RAIZ, '_trabalho', 'egw')
os.makedirs(os.path.join(OUT, 'html'), exist_ok=True)

WRAP = re.compile(r'<(p|h[1-6]|li|div)\b[^>]*\bdata-para-id="%d\.(\d+)"[^>]*>' % BOOK)
NEXT = re.compile(r'class="next">\s*<a[^>]*href="([^"]*)"')


def baixar(path):
    url = HOST + path
    for tent in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9'})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode('utf-8', 'replace'), r.geturl()
        except Exception as e:  # noqa: BLE001
            print(f'  falha ({tent + 1}/4) em {url}: {e}', flush=True)
            time.sleep(2 + tent * 3)
    raise SystemExit(f'não consegui baixar {url}')


def texto(seg):
    """Extrai o texto de um parágrafo (sem o código de referência no fim)."""
    i = seg.find('class="egw_content"')
    if i < 0:
        return ''
    j = seg.find('<span class="egw_refcode"', i)
    corpo = seg[i: j if j > 0 else len(seg)]
    corpo = corpo[corpo.find('>') + 1:]  # tira o resto da tag <span class="egw_content" ...>
    corpo = re.sub(r'<span class="page-break"[^>]*></span>', ' ', corpo)
    corpo = re.sub(r'<[^>]+>', '', corpo)
    return re.sub(r'\s+', ' ', H.unescape(corpo)).strip()


def paragrafos(h):
    out = []
    achados = list(WRAP.finditer(h))
    fim_pag = h.find('<div class="pager bottom">')
    for k, m in enumerate(achados):
        ini = m.start()
        fim = achados[k + 1].start() if k + 1 < len(achados) else (fim_pag if fim_pag > 0 else len(h))
        seg = h[ini:fim]
        ref = re.search(r'data-refcode="([^"]*)"', m.group(0))
        pg = re.findall(r'<span class="page-break"[^>]*data-page="(\d+)"', seg)
        out.append({'id': int(m.group(2)), 'tag': m.group(1), 'ref': ref.group(1) if ref else '', 'pg': [int(x) for x in pg], 'text': texto(seg)})
    return out


def main():
    path = f'/pt/book/{BOOK}.2'
    vistos = set()
    todas = []
    paginas = []
    n = 0
    while path:
        m = re.search(r'\.(\d+)$', path)
        inicio = int(m.group(1)) if m else -1
        if inicio in vistos:
            break
        vistos.add(inicio)
        cache = os.path.join(OUT, 'html', f'{inicio}.html')
        if os.path.exists(cache):
            h = open(cache, encoding='utf-8').read()
        else:
            h, final = baixar(path)
            open(cache, 'w', encoding='utf-8').write(h)
            time.sleep(PAUSA)
        ps = paragrafos(h)
        paginas.append({'inicio': inicio, 'n': len(ps), 'ids': [p['id'] for p in ps]})
        todas.extend(ps)
        n += 1
        if n % 20 == 0:
            print(f'{n} páginas, {len(todas)} parágrafos, último id {ps[-1]["id"] if ps else "?"}', flush=True)
        nx = NEXT.search(h)
        path = nx.group(1) if nx else None
        if n > 900:
            print('limite de segurança (900 páginas)', flush=True)
            break
    json.dump(todas, open(os.path.join(OUT, 'paras.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(paginas, open(os.path.join(OUT, 'paginas.json'), 'w', encoding='utf-8'))
    print(f'FIM: {n} páginas, {len(todas)} parágrafos, ids {todas[0]["id"]}..{todas[-1]["id"]}', flush=True)


if __name__ == '__main__':
    sys.exit(main())
