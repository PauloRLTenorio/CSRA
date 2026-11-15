// "Uma pergunta para levar": reflexão com anotação opcional, guardada só no aparelho (caderno).
import { state } from '../../state.js';
import { $, esc } from './util.js';

export function mount(host, card, ctx) {
  const id = ctx.story.id;
  const saved = (state.notes()[id] || {}).t || '';
  const dica = (tem) => (tem ? (state.nuvemLigada() ? 'Guardado no seu caderno e na nuvem.' : 'Guardado no seu caderno.') : (state.nuvemLigada() ? 'Só você vê. Fica também na nuvem.' : 'Fica só no seu aparelho.'));
  host.innerHTML = `<div class="w w--split rq">
    <div class="w__main"><p class="rq__q">${esc(card.pergunta)}</p></div>
    <div class="w__side">
      <label class="sv__sr" for="rqT">Sua reflexão (opcional)</label>
      <textarea id="rqT" class="rq__t" rows="4" maxlength="600" placeholder="Escreva aqui, se quiser…">${esc(saved)}</textarea>
      <div class="rq__row"><span class="rq__hint" id="rqH">${dica(!!saved)}</span>
        <button type="button" class="w-btn w-btn--pri" id="rqB">Guardar no caderno</button></div>
    </div></div>`;
  const ta = $('#rqT', host), hint = $('#rqH', host);
  let t = 0;
  const guardar = (aviso) => {
    state.setNote(id, ta.value);
    hint.textContent = dica(!!ta.value.trim());
    if (aviso) ctx.toast(ta.value.trim() ? 'Guardado no seu caderno.' : 'Nada para guardar.');
    // a nuvem (se existir) oferece guardar o caderno lá, uma única vez
    if (ta.value.trim()) host.dispatchEvent(new CustomEvent('csra:caderno', { bubbles: true, detail: { host } }));
  };
  ta.addEventListener('input', () => { hint.textContent = 'Escrevendo…'; clearTimeout(t); t = setTimeout(() => guardar(false), 700); });
  $('#rqB', host).addEventListener('click', () => { clearTimeout(t); guardar(true); });
  return () => { clearTimeout(t); if (ta.value !== saved) state.setNote(id, ta.value); };
}
