import { isAnswered } from './validation.js';

export function updateProgress(form, fieldOrder, ui) {
  const total = fieldOrder.length;
  const done = fieldOrder.filter((n) => isAnswered(form, n)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  ui.pfill.style.width = pct + '%';
  ui.ptxt.textContent = pct + '% مكتمل';
  ui.answered.textContent = `أجبت على ${done} من ${total} سؤالًا`;
}
