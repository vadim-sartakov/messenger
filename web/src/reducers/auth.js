import { AUTH_REQUESTED, AUTH_SUCCEEDED, AUTH_FAILED, LOGOUT, TOKEN_EXPIRED } from '../actions';

const initialState = {};

function auth(state = initialState, { type, user, token }) {
  switch (type) {
    case AUTH_REQUESTED:
      return { ...state, user: { isLoading: true } };
    case AUTH_SUCCEEDED:
      return { ...state, user, token };
    case AUTH_FAILED:
      return { ...state, error: true, isLoading: false };
    case TOKEN_EXPIRED:
      return { ...state, tokenExpired: true };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default auth;