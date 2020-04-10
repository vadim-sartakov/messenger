export const INITIALIZE_REQUESTED = 'INITIALIZE_REQUESTED';
export const INITIALIZE_SUCCEEDED = 'INITIALIZE_SUCCEEDED';
export const INITIALIZE_FAILED = 'INITIALIZE_FAILED';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const DESTROY_APP = 'DESTROY_APP';

export function initialize() {
  return { type: INITIALIZE_REQUESTED };
}

export function showError(message) {
  return { type: SHOW_ERROR, message };
}

export function hideError(message) {
  return { type: HIDE_ERROR, message };
}

export function destroyApp() {
  return { type: DESTROY_APP };
}