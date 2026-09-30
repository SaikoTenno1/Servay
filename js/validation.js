import { MIN_NAME_LEN, MIN_AGE, MAX_AGE, MIN_PRIORITY_LEN } from './config.js';
import { elsByName } from './utils.js';

export function getVal(form, name) {
  const els = elsByName(form, name);
  if (!els.length) return '';
  if (els[0].type === 'radio') return (els.find((x) => x.checked) || {}).value || '';
  if (els[0].type === 'checkbox') return els.filter((x) => x.checked).map((x) => x.value);
  return els[0].value.trim();
}

export function isAnswered(form, name) {
  const els = elsByName(form, name);
  if (!els.length) return false;
  const t = els[0].type;
  if (t === 'radio') return els.some((x) => x.checked);
  if (t === 'checkbox') return els.some((x) => x.checked);
  if (els[0].tagName === 'SELECT') return els[0].value !== '';
  if (els[0].type === 'number') {
    const v = Number(els[0].value);
    return els[0].value !== '' && v >= MIN_AGE && v <= MAX_AGE;
  }
  if (name === 'الاسم') return els[0].value.trim().length >= MIN_NAME_LEN;
  if (name === 'أهم أولوية للتطوير') return els[0].value.trim().length >= MIN_PRIORITY_LEN;
  return els[0].value.trim() !== '';
}

export function validateField(form, body, name) {
  const card = body.querySelector(`[data-field="${CSS.escape(name)}"]`);
  if (!card) return true;
  let ok = true;

  if (name === 'الاسم') ok = getVal(form, name).length >= MIN_NAME_LEN;
  else if (name === 'العمر') {
    const v = Number(getVal(form, name));
    ok = getVal(form, name) !== '' && v >= MIN_AGE && v <= MAX_AGE;
  } else if (name === 'أهم أولوية للتطوير') ok = getVal(form, name).length >= MIN_PRIORITY_LEN;
  else {
    const els = elsByName(form, name);
    if (els.length && (els[0].type === 'radio' || els[0].type === 'checkbox'))
      ok = els.some((x) => x.checked);
    else ok = getVal(form, name) !== '';
  }

  const otherWrap = card.querySelector('[data-other-for]');
  if (otherWrap && ok) {
    const checked = elsByName(form, name)
      .filter((e) => e.checked)
      .map((e) => e.value);
    if (checked.some((v) => /أخرى/.test(v))) {
      const inp = otherWrap.querySelector('input');
      ok = inp.value.trim().length >= MIN_NAME_LEN;
      otherWrap.classList.toggle('show', true);
      otherWrap.querySelector('.err-msg').style.display = !ok ? 'block' : 'none';
      if (!ok) {
        card.classList.add('invalid');
        return false;
      }
    }
  }

  card.classList.toggle('invalid', !ok);
  return ok;
}

export function validateAll(form, body, fieldOrder, errBox) {
  let firstBad = null;
  fieldOrder.forEach((n) => {
    const good = validateField(form, body, n);
    if (!good && !firstBad) firstBad = body.querySelector(`[data-field="${CSS.escape(n)}"]`);
  });
  if (firstBad) {
    const left = fieldOrder.filter((n) => {
      const c = body.querySelector(`[data-field="${CSS.escape(n)}"]`);
      return c && c.classList.contains('invalid');
    }).length;
    errBox.textContent = `⚠ يوجد ${left} سؤال لم يُجب عنه — تم التمرير لأول سؤال ناقص.`;
    errBox.classList.add('show');
    firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(
      () => firstBad.querySelector('input,select,textarea')?.focus({ preventScroll: true }),
      450
    );
    return firstBad;
  }
  errBox.classList.remove('show');
  return null;
}
