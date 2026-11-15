// Configuração da "nuvem" (comentários, caderno e conta). Só existe na versão em desenvolvimento.
// A configuração web do Firebase é PÚBLICA por desenho: quem protege os dados são as regras de segurança do Firestore
// (desenvolvimento/firestore.rules), não o sigilo destes valores.
export const NUVEM = {
  ativa: true,              // chave geral: false desliga tudo e o site volta a funcionar como a versão oficial
  comentarios: true,        // cartão "Conversa" no fim de cada parada
  admin: true,              // painel de moderação em #/admin (só funciona para quem estiver na lista de administradores)
  ambiente: 'desenvolvimento',
  sdk: '12.19.0',           // versão fixa do SDK do Firebase (carregada do gstatic só quando a pessoa usa a nuvem)
  firebase: {
    apiKey: 'AIzaSyC3SN3FtB0XEJ5rAJuMoct0cjw99YY4NN0',
    authDomain: 'csra-e60b2.firebaseapp.com',
    projectId: 'csra-e60b2',
    storageBucket: 'csra-e60b2.firebasestorage.app',
    messagingSenderId: '823174809135',
    appId: '1:823174809135:web:771db9a6b77d2a48f2e8da',
  },
};

// Paradas que aceitam comentário (mesmos ids de js/data/stories.js, sem o resumo "em-60-segundos")
export const PARADAS = [
  'primeiro-cardapio', 'corpo-emprestado', 'mesa-e-mente', 'simples-e-suficiente', 'ritmo-do-dia', 'fome-ou-vontade',
  'cozinha-que-cura', 'pequenos-a-mesa', 'sem-extremos', 'remedios-simples', 'mesa-que-abre-portas', 'proximo-passo',
];
