export const SELECT_CHAT = 'SELECT_CHAT';
export const CLEAR_APP = 'CLEAR_APP';

export function selectChat(id) {
  return { type: SELECT_CHAT, id };
}

export function clearApp() {
  return { type: CLEAR_APP };
}