export const CREATE_CHAT = 'CREATE_CHAT';
export const SELECT_CHAT = 'SELECT_CHAT';
export const DESTROY_APP = 'DESTROY_APP';
export const SET_SYSTEM_ERROR = 'SET_SYSTEM_ERROR';

export function selectChat(id) {
  return { type: SELECT_CHAT, id };
}

export function destroyApp() {
  return { type: DESTROY_APP };
}

export function setSytemError() {
  return { type: SET_SYSTEM_ERROR };
}