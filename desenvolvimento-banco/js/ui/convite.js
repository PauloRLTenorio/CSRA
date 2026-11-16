// Convite, uma única vez, para guardar o caderno na nuvem. Aparece dentro da interação (reflexão, plano de 7 dias)
// logo depois que a pessoa escreve ou marca algo pela primeira vez. Se ela recusar, não perguntamos de novo.
import * as N from '../nuvem/nuvem.js';

export function oferecer(host, { toast = () => {} } = {}) {
  if (!host || !N.ativa() || N.consentimento() !== null) return;
  const raiz = host.querySelector('.w') || host;
  if (raiz.querySelector('.nv-convite')) return;
  const el = document.createElement('div');
  el.className = 'nv-convite';
  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', 'Guardar o caderno na nuvem?');
  el.innerHTML = `<p class="nv-convite__t"><b>Guardar na nuvem?</b> Assim você não perde o caderno ao trocar de aparelho. Sem cadastro.</p>
    <div class="nv-convite__a"><button type="button" class="w-btn w-btn--pri" data-sim>Guardar</button><button type="button" class="w-btn" data-nao>Agora não</button><button type="button" class="cv__link" data-saber>Como funciona</button></div>
    <p class="cv__erro" role="alert" hidden></p>`;
  raiz.appendChild(el);
  const erro = el.querySelector('.cv__erro');
  el.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-saber')) { window.dispatchEvent(new CustomEvent('csra:espaco')); return; }
    if (b.hasAttribute('data-nao')) { N.definirConsentimento('nao'); el.remove(); return; }
    if (b.hasAttribute('data-sim')) {
      b.disabled = true; b.textContent = 'Guardando…'; erro.hidden = true;
      try {
        const K = await import('../nuvem/caderno.js');
        await K.ativar();
        el.innerHTML = '<p class="nv-convite__t"><b>Pronto!</b> Seu caderno agora fica guardado na nuvem. Só você vê.</p>';
        toast('Caderno guardado na nuvem.');
        setTimeout(() => el.remove(), 4000);
      } catch (err) {
        const { mensagemDeErro } = await import('../nuvem/erros.js');
        b.disabled = false; b.textContent = 'Guardar';
        erro.hidden = false; erro.textContent = mensagemDeErro(err) || 'Não foi possível guardar agora.';
      }
    }
  });
}
