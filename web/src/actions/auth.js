export const AUTH_REQUESTED = 'AUTH_REQUESTED';
export const AUTH_SUCCEEDED = 'AUTH_SUCCEEDED';
export const AUTH_FAILED = 'AUTH_FAILED';
export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
export const LOGOUT_SUCCEEDED = 'LOGOUT_SUCCEEDED';

export function login({ credentials, history, from }) {
  return { type: AUTH_REQUESTED, credentials, history, from };
}

export function logout(history) {
  return { type: LOGOUT_REQUESTED, history };
}