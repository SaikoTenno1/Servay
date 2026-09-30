(() => {
  const { renderForm, toggleOther, applyDraft } = window.SurveyRenderer;
  const { validateField, validateAll } = window.SurveyValidation;
  const { updateProgress } = window.SurveyProgress;
  const { collect, submitSurvey } = window.SurveyApi;
  const { saveDraft, loadDraft, clearDraft } = window.SurveyStorage;
  const { debounce, $, $$ } = window.SurveyUtils;

  const form = $('#f');
  const body = $('#form-body');
  const errBox = $('#form-err');
  const btn = $('#btn');
  const ui = { pfill: $('#pfill'), ptxt: $('#ptxt'), answered: $('#answered') };
  const fieldOrder = [];

  const refresh = () => {
    updateProgress(form, fieldOrder, ui);
    saveDraft(collect(form));
  };
  const refreshDebounced = debounce(refresh, 250);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  function observeReveals() {
    $$('.rv', body).forEach((el, i) => {
      el.style.transitionDelay = Math.min((i % 6) * 60, 300) + 'ms';
      io.observe(el);
    });
  }

  function init() {
    renderForm(body, fieldOrder);
    applyDraft(form, loadDraft());
    updateProgress(form, fieldOrder, ui);
    observeReveals();

    const ta = $('#in-final');
    ta?.addEventListener('input', () => {
      $('#ccount').textContent = ta.value.length;
    });

    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('input[type="radio"],input[type="checkbox"]')) toggleOther(t);
      if (t.name) validateField(form, body, t.name);
      refresh();
    });

    form.addEventListener('input', (e) => {
      if (e.target.name && e.target.matches('input.txt,select.txt,textarea.txt')) {
        if (e.target.matches('select')) validateField(form, body, e.target.name);
        refreshDebounced();
      }
    });

    $('#clearBtn').addEventListener('click', () => {
      if (!confirm('هل تريد مسح كل الإجابات والبدء من جديد؟')) return;
      form.reset();
      clearDraft();
      body.querySelectorAll('.invalid').forEach((c) => c.classList.remove('invalid'));
      body.querySelectorAll('.other-input').forEach((o) => o.classList.remove('show'));
      errBox.classList.remove('show');
      $('#ccount').textContent = '0';
      updateProgress(form, fieldOrder, ui);
      scrollTo({ top: 0, behavior: 'smooth' });
    });

    $('#newBtn').addEventListener('click', () => {
      $('#done').style.display = 'none';
      form.style.display = 'block';
      form.reset();
      clearDraft();
      updateProgress(form, fieldOrder, ui);
      scrollTo({ top: 0, behavior: 'smooth' });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (validateAll(form, body, fieldOrder, errBox)) return;
      const data = collect(form);
      errBox.classList.remove('show');
      btn.disabled = true;
      btn.textContent = 'جاري الإرسال... ⏳';
      try {
        await submitSurvey(data);
        clearDraft();
        form.style.display = 'none';
        $('#done').style.display = 'block';
        scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {
        errBox.textContent = 'تعذر الإرسال — تأكد من الاتصال بالإنترنت وحاول مرة أخرى.';
        errBox.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'إرسال الإجابات ✓';
      }
    });
  }

  init();
})();
