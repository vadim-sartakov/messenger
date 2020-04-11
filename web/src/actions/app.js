export const INITIALIZE_REQUESTED = 'INITIALIZE_REQUESTED';
export const INITIALIZE_SUCCEEDED = 'INITIALIZE_SUCCEEDED';
export const INITIALIZE_FAILED = 'INITIALIZE_FAILED';
export const DESTROY_REQUESTED = 'DESTROY_REQUESTED';
export const DESTROY_SUCCEEDED = 'DESTROY_SUCCEEDED';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';

export const ADD_CHAT = 'ADD_CHAT';

export const POST_MESSAGE_REQUESTED = 'POST_MESSAGE_REQUESTED';
export const POST_MESSAGE_SUCCEEDED = 'POST_MESSAGE_SUCCEEDED';
export const POST_MESSAGE_FAILED = 'POST_MESSAGE_FAILED';

export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

export function initialize() {
  return { type: INITIALIZE_REQUESTED };
}

export function showError(message) {
  return { type: SHOW_ERROR, message };
}

export function hideError(message) {
  return { type: HIDE_ERROR, message };
}

export function addChat(chat) {
  return { type: ADD_CHAT, chat };
}

export function destroy() {
  return { type: DESTROY_REQUESTED };
}