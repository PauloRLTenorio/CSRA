# -*- coding: utf-8 -*-
"""Confere se cada citação literal do site existe no texto do livro.

Uso:
  1) Extraia o texto do PDF do livro para um arquivo (veja docs/COMO-EDITAR.md), por exemplo livro.txt
  2) node scripts/exportar_citacoes.mjs > citacoes.json
  3) python3 scripts/verificar_citacoes.py livro.txt citacoes.json

Normaliza espaços, hifenização de fim de linha, marcas de parágrafo ([123]) e cabeçalhos de página.
Também avisa se alguma citação tem mais de 15 palavras (limite adotado pelo projeto).
"""
import re
import sys
import json


def carregar(caminho):
    t = open(caminho, encoding='utf-8').read()
    t = re.sub(r'=====\[PAGINA \d+\]=====', ' ', t)
    t = re.sub(r'-\n', '', t)
    t = re.sub(r'\[\d+\]', ' ', t)
    t = re.sub(r'\b\d{1,3} Conselhos sobre o Regime Alimentar\b|Conselhos sobre o Regime Alimentar \d{1,3}\b', ' ', t)
    return re.sub(r'\s+', ' ', t)


def norm(s):
    s = s.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
    return re.sub(r'\s+', ' ', s).strip().casefold()


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    base = norm(carregar(sys.argv[1]))
    citacoes = json.load(open(sys.argv[2], encoding='utf-8'))
    ruins = 0
    for c in citacoes:
        q = norm(c).strip(' .,;:!?"')
        ok = q in base
        n = len(q.split())
        print(('OK   ' if ok else 'FALTA'), f'[{n:2d} palavras]', c)
        if not ok:
            ruins += 1
        if n > 15:
            print('   ^ MAIS DE 15 PALAVRAS')
            ruins += 1
    print('\nproblemas:', ruins)
    sys.exit(1 if ruins else 0)


if __name__ == '__main__':
    main()
