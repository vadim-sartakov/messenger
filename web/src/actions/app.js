export const SELECT_CHAT = 'SELECT_CHAT';

export function selectChat(id) {
  return { type: SELECT_CHAT, id };
}