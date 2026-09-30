window.SurveyApi = (() => {
  const { SCRIPT_URL } = window.SurveyConfig;

  function collect(form) {
    const data = {};
    const names = new Set([...form.elements].map((el) => el.name).filter(Boolean));
    names.forEach((name) => {
      const els = [...form.elements].filter((el) => el.name === name);
      if (!els.length) return;
      if (els[0].type === 'radio') data[name] = (els.find((x) => x.checked) || {}).value || '';
      else if (els[0].type === 'checkbox')
        data[name] = els.filter((x) => x.checked).map((x) => x.value).join('، ');
      else data[name] = els[0].value.trim();
    });
    Object.keys(data)
      .filter((k) => k.endsWith('_أخرى'))
      .forEach((k) => {
        const base = k.replace('_أخرى', '');
        if (data[k]) data[base] = (data[base] ? data[base] + ' — توضيح: ' : '') + data[k];
        delete data[k];
      });
    return data;
  }

  function submitSurvey(data) {
    return fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });
  }

  return { collect, submitSurvey };
})();
