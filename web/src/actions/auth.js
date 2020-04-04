export const AUTH_REQUESTED = 'AUTH_REQUESTED';
export const AUTH_SUCCEEDED = 'AUTH_SUCCEEDED';
export const AUTH_FAILED = 'AUTH_FAILED';
export const LOGOUT = 'LOGOUT';
export const TOKEN_EXPIRED = 'TOKEN_EXPIRED';

export function login({ credentials, onSuccess, onError }) {
  return { type: AUTH_REQUESTED, credentials, onSuccess, onError };
}

export function logout(history) {
  return { type: LOGOUT, history };
}