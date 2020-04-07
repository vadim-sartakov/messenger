import { AUTH_REQUESTED, AUTH_SUCCEEDED, AUTH_FAILED, LOGOUT, TOKEN_EXPIRED } from '../actions';

const initialState = {};

function auth(state = initialState, { type, token }) {
  switch (type) {
    case AUTH_REQUESTED:
      return { isLoading: true };
    case AUTH_SUCCEEDED:
      return { token };
    case AUTH_FAILED:
      return { error: true };
    case TOKEN_EXPIRED:
      return { ...state, tokenExpired: true };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default auth;