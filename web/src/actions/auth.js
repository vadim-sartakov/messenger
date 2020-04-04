export const AUTH_REQUESTED = 'AUTH_REQUESTED';
export const AUTH_SUCCEEDED = 'AUTH_SUCCEEDED';
export const AUTH_FAILED = 'AUTH_FAILED';
export const LOGOUT = 'LOGOUT';

export function login(credentials) {
  return { type: AUTH_REQUESTED, credentials };
}

export function logout() {
  return { type: LOGOUT };
}