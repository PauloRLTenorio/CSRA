// Imprime (em JSON) todas as citações literais usadas no site. Uso: node scripts/exportar_citacoes.mjs > citacoes.json
import { todasCitacoes } from '../js/data/stories.js';
console.log(JSON.stringify([...new Set(todasCitacoes())], null, 1));
