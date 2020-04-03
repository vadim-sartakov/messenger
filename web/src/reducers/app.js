import { LOGIN, LOGOUT } from '../actions';

const initialState = { user: undefined };

function app(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.user };
    case LOGOUT:
      return { ...state, user: undefined };
    default:
      return state;
  }
}

export default app;