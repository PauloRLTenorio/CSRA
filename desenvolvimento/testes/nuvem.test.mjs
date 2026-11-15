// Testes das funções puras da "nuvem". Rodar (na raiz do repositório): node --test desenvolvimento/testes/nuvem.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mesclar, normalizar, canon, igual, vazio, paraNuvem } from '../js/nuvem/merge.js';
import { validarComentario, temLink, limparTexto, limparNome, quando, LIMITES } from '../js/nuvem/validar.js';
import { navegadorInterno } from '../js/nuvem/navegador.js';

const nota = (t, u, d = (u || '').slice(0, 10)) => ({ t, d, u });
const base = (extra = {}) => ({ ...vazio(), ...extra });

test('merge: vazio com vazio é vazio', () => {
  assert.deepEqual(mesclar(vazio(), vazio()), vazio());
  assert.deepEqual(mesclar(null, undefined), vazio());
});

test('merge: progresso vale o maior e as concluídas se somam', () => {
  const a = base({ pos: { x: 2, y: 5 }, done: ['x'] });
  const b = base({ pos: { x: 4, z: 1 }, done: ['y', 'x'] });
  const m = mesclar(a, b);
  assert.deepEqual(m.pos, { x: 4, y: 5, z: 1 });
  assert.deepEqual([...m.done].sort(), ['x', 'y']);
});

test('merge: plano sem data junta os dias marcados e fica com o início mais antigo', () => {
  const a = base({ plan: { start: '2026-11-15', checks: [0, 2], u: '' } });
  const b = base({ plan: { start: '2026-11-10', checks: [1, 2], u: '' } });
  const m = mesclar(a, b);
  assert.deepEqual(m.plan.checks, [0, 1, 2]);
  assert.equal(m.plan.start, '2026-11-10');
});

test('merge: plano com data vale o mais recente, inclusive "recomeçar"', () => {
  const velho = base({ plan: { start: '2026-11-10', checks: [0, 1, 2], u: '2026-11-11T10:00:00.000Z' } });
  const reset = base({ plan: { start: null, checks: [], u: '2026-11-12T09:00:00.000Z' } });
  assert.deepEqual(mesclar(velho, reset).plan.checks, []);
  assert.deepEqual(mesclar(reset, velho).plan.checks, []);
});

test('merge: anotação mais recente vence; apagada (texto vazio) vence a antiga', () => {
  const a = base({ notes: { p: nota('antiga', '2026-11-10T10:00:00.000Z') } });
  const b = base({ notes: { p: nota('nova', '2026-11-11T10:00:00.000Z') } });
  assert.equal(mesclar(a, b).notes.p.t, 'nova');
  assert.equal(mesclar(b, a).notes.p.t, 'nova');
  const apagada = base({ notes: { p: nota('', '2026-11-12T10:00:00.000Z') } });
  assert.equal(mesclar(a, apagada).notes.p.t, '');
  const reescrita = base({ notes: { p: nota('voltei', '2026-11-13T10:00:00.000Z') } });
  assert.equal(mesclar(apagada, reescrita).notes.p.t, 'voltei');
});

test('merge: nota antiga sem "u" usa a data (d) como referência', () => {
  const antiga = base({ notes: { p: { t: 'do celular velho', d: '2026-11-01' } } });
  const nova = base({ notes: { p: nota('mais nova', '2026-11-14T08:00:00.000Z') } });
  assert.equal(mesclar(antiga, nova).notes.p.t, 'mais nova');
});

test('merge: notas de paradas diferentes se somam', () => {
  const m = mesclar(base({ notes: { a: nota('A', '2026-11-10T10:00:00.000Z') } }), base({ notes: { b: nota('B', '2026-11-10T11:00:00.000Z') } }));
  assert.deepEqual(Object.keys(m.notes).sort(), ['a', 'b']);
});

test('merge: "recomeçar tudo" mais novo descarta o outro lado por inteiro', () => {
  const local = base({ epoch: '2026-11-14T10:00:00.000Z', pos: { x: 1 } });
  const nuvem = base({ epoch: '2026-11-12T10:00:00.000Z', pos: { x: 9, y: 3 }, done: ['x'], notes: { p: nota('velha', '2026-11-12T11:00:00.000Z') } });
  const m = mesclar(local, nuvem);
  assert.deepEqual(m.pos, { x: 1 });
  assert.deepEqual(m.done, []);
  assert.deepEqual(m.notes, {});
  assert.equal(m.epoch, '2026-11-14T10:00:00.000Z');
  assert.equal(igual(mesclar(nuvem, local), m), true);
});

test('merge: não depende da ordem (exceto "last") e é idempotente', () => {
  const a = base({ pos: { x: 3 }, done: ['x', 'y'], plan: { start: '2026-11-15', checks: [0], u: '2026-11-15T09:00:00.000Z' }, notes: { p: nota('a', '2026-11-15T09:00:00.000Z') }, frases: ['f1'] });
  const b = base({ pos: { x: 5, z: 2 }, done: ['z'], plan: { start: '2026-11-16', checks: [4], u: '2026-11-16T09:00:00.000Z' }, notes: { p: nota('b', '2026-11-16T09:00:00.000Z'), q: nota('q', '2026-11-16T09:00:00.000Z') }, frases: ['f2'] });
  assert.equal(igual(mesclar(a, b), mesclar(b, a)), true);
  const m = mesclar(a, b);
  assert.equal(igual(mesclar(m, m), m), true);
  assert.equal(igual(mesclar(m, a), m), true);
});

test('merge: normalizar descarta lixo e corta texto grande', () => {
  const n = normalizar({ pos: { a: -1, b: 'x', c: 2.9 }, done: ['a', 1, 'a'], plan: { checks: [0, 7, -1, 'x', 3, 3], start: 5 }, notes: { p: { t: 'a'.repeat(700), d: 5 }, q: 'lixo' }, last: 7, frases: 'não' });
  assert.deepEqual(n.pos, { c: 2 });
  assert.deepEqual(n.done, ['a']);
  assert.deepEqual(n.plan.checks, [0, 3]);
  assert.equal(n.plan.start, null);
  assert.equal(n.notes.p.t.length, 600);
  assert.equal(n.notes.q, undefined);
  assert.equal(n.last, null);
  assert.deepEqual(n.frases, []);
});

test('merge: canon ignora a ordem das chaves e das listas; paraNuvem não traz campos extras', () => {
  assert.equal(canon({ pos: { b: 1, a: 2 }, done: ['y', 'x'] }), canon({ done: ['x', 'y'], pos: { a: 2, b: 1 } }));
  assert.deepEqual(Object.keys(paraNuvem({ lixo: 1, pos: {} })).sort(), ['done', 'epoch', 'frases', 'last', 'notes', 'plan', 'pos']);
});

test('validar: limites do texto', () => {
  assert.equal(validarComentario({ texto: 'ok' }).ok, false);
  assert.equal(validarComentario({ texto: '   ab   ' }).ok, false);
  assert.equal(validarComentario({ texto: 'abc' }).ok, true);
  assert.equal(validarComentario({ texto: 'a'.repeat(LIMITES.textoMax) }).ok, true);
  assert.equal(validarComentario({ texto: 'a'.repeat(LIMITES.textoMax + 1) }).ok, false);
});

test('validar: links, e-mails e @ são recusados; frases normais passam', () => {
  for (const ruim of ['veja http://x.com', 'https://abc', 'acesse www.algo', 'fale com fulano@gmail.com', 'meusite.com.br', 'site.io hoje', '@fulano gostei', 'Veja EXEMPLO.COM']) {
    assert.equal(temLink(ruim), true, ruim);
    assert.equal(validarComentario({ texto: ruim + ' vale a pena' }).ok, false, ruim);
  }
  for (const boa of ['Gostei. Muito bom!', 'Vou fazer o plano... em 7 dias.', 'Deus é bom, o tempo todo.', 'Li o capítulo 4, § 111.', 'a.b']) {
    assert.equal(temLink(boa), false, boa);
  }
});

test('validar: nome e limpeza', () => {
  assert.equal(validarComentario({ texto: 'comentário ok', nome: 'n'.repeat(41) }).ok, false);
  assert.equal(validarComentario({ texto: 'comentário ok', nome: 'n'.repeat(40) }).ok, true);
  assert.equal(validarComentario({ texto: 'comentário ok', nome: '@fulano' }).ok, false);
  assert.equal(validarComentario({ texto: 'comentário ok', nome: '  Ana   Maria ' }).nome, 'Ana Maria');
  assert.equal(limparTexto('a  \r\nb\n\n\n\nc  '), 'a\nb\n\nc');
  assert.equal(limparNome('  a   b '), 'a b');
});

test('navegador: reconhece os navegadores embutidos', () => {
  const ios = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22B83 Instagram 360.0.0.30.109 (iPhone15,2; iOS 18_1; pt_BR; pt; scale=3.00; 1170x2532; 650018721)';
  const andr = 'Mozilla/5.0 (Linux; Android 14; SM-S911B Build/UP1A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36 Instagram 360.0.0.52.192 Android (34/14; 480dpi; 1080x2340; samsung; SM-S911B; dm1q; qcom; pt_BR; 650018721)';
  const fb = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/21A329 [FBAN/FBIOS;FBAV/430.0.0.40.109;FBBV/1;FBDV/iPhone15,2]';
  const tt = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36 musical_ly_2023 BytedanceWebview/d8a21c6';
  const wv = 'Mozilla/5.0 (Linux; Android 12; Pixel 5 Build/SQ1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0 Mobile Safari/537.36';
  assert.equal(navegadorInterno(ios), 'Instagram');
  assert.equal(navegadorInterno(andr), 'Instagram');
  assert.equal(navegadorInterno(fb), 'Facebook');
  assert.equal(navegadorInterno(tt), 'TikTok');
  assert.equal(navegadorInterno(wv), 'aplicativo');
  const safari = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
  const chrome = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
  const desktop = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
  for (const ua of [safari, chrome, desktop, '']) assert.equal(navegadorInterno(ua), null);
});

test('quando: datas curtas', () => {
  const agora = new Date('2026-11-15T12:00:00Z');
  const antes = (s) => new Date(agora - s * 1000);
  assert.equal(quando(antes(20), agora), 'agora');
  assert.equal(quando(antes(5 * 60), agora), 'há 5 min');
  assert.equal(quando(antes(3 * 3600), agora), 'há 3 h');
  assert.equal(quando(antes(86400), agora), 'ontem');
  assert.equal(quando(antes(3 * 86400), agora), 'há 3 dias');
  assert.equal(quando(null, agora), '');
});
