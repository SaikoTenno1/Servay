import { STORE_KEY } from './config.js';

export function saveDraft(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (_) {
  }
}

export function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  } catch (_) {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch (_) {
  }
}
