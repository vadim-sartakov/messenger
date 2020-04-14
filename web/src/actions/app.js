export const INITIALIZE_REQUESTED = 'INITIALIZE_REQUESTED';
export const INITIALIZE_SUCCEEDED = 'INITIALIZE_SUCCEEDED';
export const INITIALIZE_FAILED = 'INITIALIZE_FAILED';
export const DESTROY_REQUESTED = 'DESTROY_REQUESTED';
export const DESTROY_SUCCEEDED = 'DESTROY_SUCCEEDED';
export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const HIDE_MESSAGE = 'HIDE_MESSAGE';

export const CREATE_CHAT_REQUESTED = 'CREATE_CHAT_REQUESTED';
export const CREATE_CHAT_SUCCEEDED = 'CREATE_CHAT_SUCCEEDED';

export const JOIN_CHAT_REQUESTED = 'JOIN_CHAT_REQUESTED';
export const JOIN_CHAT_SUCCEEDED = 'JOIN_CHAT_SUCCEEDED';

export const ADD_CHAT_PARTICIPANT = 'ADD_CHAT_PARTICIPANT';

export const POST_MESSAGE_REQUESTED = 'POST_MESSAGE_REQUESTED';
export const POST_MESSAGE_SUCCEEDED = 'POST_MESSAGE_SUCCEEDED';
export const POST_MESSAGE_FAILED = 'POST_MESSAGE_FAILED';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

export function initialize() {
  return { type: INITIALIZE_REQUESTED };
}

export function showMessage({ text, severity, autoHide }) {
  return { type: SHOW_MESSAGE, text, severity, autoHide };
}

export function hideMessage(message) {
  return { type: HIDE_MESSAGE, message };
}

export function createChat(chat, history) {
  return { type: CREATE_CHAT_REQUESTED, chat, history };
}

export function joinChat(inviteLink, history) {
  return { type: JOIN_CHAT_REQUESTED, inviteLink, history };
}

export function postMessage(chatId, message) {
  return { type: POST_MESSAGE_REQUESTED, chatId, message };
}

export function destroy() {
  return { type: DESTROY_REQUESTED };
}