window.SurveyStorage = (() => {
  const { STORE_KEY } = window.SurveyConfig;

  function saveDraft(data) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (_) {
    }
  }

  function loadDraft() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (_) {
    }
  }

  return { saveDraft, loadDraft, clearDraft };
})();
