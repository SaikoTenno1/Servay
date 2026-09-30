import { RELATIONS, DURATIONS, PERSONAL_FIELDS, PRIORITY_FIELD, sections } from './survey-data.js';
import { esc } from './utils.js';
import { MAX_PRIORITY_LEN } from './config.js';

const ICONS = [
  { id: 'i-user', tint: '#e8edf7', deep: '#33497a' },
  { id: 'i-users', tint: '#e4ebf7', deep: '#3c5a94' },
  { id: 'i-leaf', tint: '#e2f3e9', deep: '#1e7a52' },
  { id: 'i-bag', tint: '#f7ecd9', deep: '#a06a25' },
  { id: 'i-build', tint: '#e6eaf1', deep: '#55637e' },
  { id: 'i-bank', tint: '#efe6f5', deep: '#7a4f94' },
  { id: 'i-target', tint: '#f9e4de', deep: '#b0512f' },
];

function secIcon(icon) {
  return `<span class="sec-icon" style="--tint:${icon.tint};--deep:${icon.deep}"><svg class="sec-ic" aria-hidden="true"><use href="#${icon.id}"/></svg></span>`;
}

function optCard(name, value, type, check) {
  const hasOther = /أخرى|خدمات أخرى/.test(value);
  return `<label class="opt${check ? ' check' : ''}" data-val="${esc(value)}" data-other="${hasOther ? 1 : 0}">
    <input type="${type}" name="${esc(name)}" value="${esc(value)}">
    <span class="mark" aria-hidden="true"></span>
    <span class="txt">${esc(value)}</span>
  </label>`;
}

function personalHTML() {
  return `
  <div class="sec-head rv"><div class="sec-num">1</div>${secIcon(ICONS[0])}<h2>البيانات الأساسية</h2><div class="line"></div></div>
  <p class="sec-desc rv">معلومات عامة تساعدنا على فهم آراء مختلف الفئات</p>
  <div class="grid2">
    <div class="card field rv" data-field="الاسم">
      <label class="flabel" for="in-name">الاسم <span class="req">*</span></label>
      <input class="txt" id="in-name" name="الاسم" placeholder="مثال: أحمد محمد" autocomplete="name" maxlength="60">
      <div class="err-msg">من فضلك أدخل الاسم (حرفان على الأقل).</div>
    </div>
    <div class="card field rv" data-field="العمر">
      <label class="flabel" for="in-age">العمر <span class="req">*</span></label>
      <input class="txt" id="in-age" name="العمر" type="number" inputmode="numeric" min="5" max="120" placeholder="مثال: 30">
      <div class="err-msg">أدخل عمرًا صحيحًا من 5 إلى 120.</div>
    </div>
    <div class="card field rv" data-field="العلاقة بالمنطقة">
      <label class="flabel" for="in-rel">ما علاقتك بالمنطقة؟ <span class="req">*</span></label>
      <select class="txt" id="in-rel" name="العلاقة بالمنطقة">
        <option value="">— اختر —</option>
        ${RELATIONS.map((r) => `<option>${esc(r)}</option>`).join('')}
      </select>
      <div class="err-msg">من فضلك اختر علاقتك بالمنطقة.</div>
    </div>
    <div class="card field rv" data-field="مدة الإقامة">
      <label class="flabel" for="in-dur">منذ متى تقيم في المنطقة؟ <span class="req">*</span></label>
      <select class="txt" id="in-dur" name="مدة الإقامة">
        <option value="">— اختر —</option>
        ${DURATIONS.map((r) => `<option>${esc(r)}</option>`).join('')}
      </select>
      <div class="err-msg">من فضلك اختر مدة الإقامة.</div>
    </div>
  </div>
  <div class="card field rv" data-field="النوع" data-type="radio">
    <div class="q-head"><div class="q-title">النوع <span class="req">*</span></div></div>
    <div class="segmented">
      <label class="opt"><input type="radio" name="النوع" value="ذكر"><span class="mark"></span><span class="txt">ذكر</span></label>
      <label class="opt"><input type="radio" name="النوع" value="أنثى"><span class="mark"></span><span class="txt">أنثى</span></label>
    </div>
    <div class="err-msg">من فضلك اختر النوع.</div>
  </div>`;
}

function sectionsHTML(fieldOrder) {
  let h = '';
  sections.forEach((s, si) => {
    h += `<div class="sec-head rv"><div class="sec-num">${si + 2}</div>${secIcon(ICONS[si + 1])}<h2>${esc(s.t)}</h2><div class="line"></div></div><p class="sec-desc rv">${esc(s.d)}</p>`;
    s.q.forEach((qq) => {
      const globalN = fieldOrder.length - 4;
      const type = qq.multi ? 'checkbox' : 'radio';
      const cols = qq.o.length <= 2 ? ' cols-1' : '';
      fieldOrder.push(qq.k);
      h += `<fieldset class="card field rv" data-field="${esc(qq.k)}" data-type="${type}">
        <div class="q-head"><div class="q-num">${globalN}</div><div class="q-title">${esc(qq.q)} <span class="req">*</span></div></div>
        ${qq.multi ? `<div class="hint">يمكنك اختيار أكثر من إجابة</div>` : ''}
        <div class="opts${cols}">${qq.o.map((o) => optCard(qq.k, o, type, !!qq.multi)).join('')}</div>
        ${
          qq.other
            ? `<div class="other-input" data-other-for="${esc(qq.k)}">
          <input class="txt" name="${esc(qq.k)}_أخرى" placeholder="حدد — اكتب هنا لو اخترت (أخرى)...">
          <div class="err-msg">من فضلك حدد إجابة (أخرى).</div></div>`
            : ''
        }
        <div class="err-msg" data-main-err>من فضلك أجب على هذا السؤال.</div>
      </fieldset>`;
    });
  });
  return h;
}

function priorityHTML() {
  return `
  <div class="sec-head rv"><div class="sec-num">7</div>${secIcon(ICONS[6])}<h2>الأولوية الأهم</h2><div class="line"></div></div>
  <p class="sec-desc rv">سؤال مفتوح — اكتب رأيك بكلماتك</p>
  <div class="card field rv" data-field="${esc(PRIORITY_FIELD)}">
    <label class="flabel" for="in-final">من وجهة نظرك، ما أهم أولوية يجب التركيز عليها لتطوير منطقة جديلة؟ <span class="req">*</span></label>
    <textarea class="txt" id="in-final" name="${esc(PRIORITY_FIELD)}" maxlength="${MAX_PRIORITY_LEN}" placeholder="مثال: تحسين النظافة وزيادة المساحات الخضراء وتنظيم مواقف السيارات..."></textarea>
    <div class="counter"><span id="ccount">0</span> / ${MAX_PRIORITY_LEN} — الحد الأدنى 10 أحرف</div>
    <div class="err-msg">اكتب 10 أحرف على الأقل (جملة مفيدة).</div>
  </div>`;
}

export function renderForm(body, fieldOrder) {
  fieldOrder.length = 0;
  PERSONAL_FIELDS.forEach((k) => fieldOrder.push(k));
  const html = personalHTML() + sectionsHTML(fieldOrder) + priorityHTML();
  fieldOrder.push(PRIORITY_FIELD);
  body.innerHTML = html;
}

export function toggleOther(input) {
  const label = input.closest('label.opt');
  if (!label || label.dataset.other !== '1') return;
  const card = input.closest('.card');
  const wrap = card?.querySelector('[data-other-for]');
  if (!wrap) return;
  const anyOther = [...card.querySelectorAll('label.opt[data-other="1"] input:checked')].length > 0;
  wrap.classList.toggle('show', anyOther);
  if (!anyOther) wrap.querySelector('input').value = '';
}

export function applyDraft(form, draft) {
  if (!draft) return;
  Object.entries(draft).forEach(([name, val]) => {
    const els = [...form.elements].filter((e) => e.name === name);
    if (!els.length || !val) return;
    if (els[0].type === 'radio' || els[0].type === 'checkbox') {
      const parts = String(val).split('، ');
      els.forEach((e) => {
        e.checked = parts.includes(e.value) || String(val).includes(e.value + ' —');
      });
    } else els[0].value = val;
  });
  [...form.querySelectorAll('input[type="radio"],input[type="checkbox"]')].forEach(toggleOther);
  const ta = form.querySelector('#in-final');
  if (ta) document.getElementById('ccount').textContent = ta.value.length;
}
