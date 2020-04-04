import { AUTH_REQUESTED, AUTH_SUCCEEDED, AUTH_FAILED, LOGOUT } from '../actions';

const initialState = {};

function auth(state = initialState, { type, user, accessToken, refreshToken }) {
  switch (type) {
    case AUTH_REQUESTED:
      return { ...state, user: { isLoading: true } };
    case AUTH_SUCCEEDED:
      return { ...state, user, accessToken, refreshToken };
    case AUTH_FAILED:
      return { ...state, error: true, isLoading: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default auth;