import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_SUCCEEDED,
  TOKEN_EXPIRED
} from '../actions';

const initialState = {};

function auth(state = initialState, { type, token }) {
  switch (type) {
    case LOGIN_REQUESTED:
      return { isLoading: true };
    case LOGIN_SUCCEEDED:
      return { token };
    case LOGIN_FAILED:
      return { error: true };
    case TOKEN_EXPIRED:
      return { ...state, tokenExpired: true };
    case LOGOUT_SUCCEEDED:
      return initialState;
    default:
      return state;
  }
}

export default auth;