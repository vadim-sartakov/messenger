export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
export const LOGOUT_SUCCEEDED = 'LOGOUT_SUCCEEDED';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const TOKEN_EXPIRED = 'TOKEN_EXPIRED';

export function logIn(credentials, location, history) {
  return { type: LOGIN_REQUESTED, credentials, location, history };
}

export function logOut(history) {
  return { type: LOGOUT_REQUESTED, history };
}