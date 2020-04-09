export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const DESTROY_APP = 'DESTROY_APP';

export function showError(message) {
  return { type: SHOW_ERROR, message };
}

export function hideError(message) {
  return { type: HIDE_ERROR, message };
}

export function destroyApp() {
  return { type: DESTROY_APP };
}