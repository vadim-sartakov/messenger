import { LOGIN, LOGOUT } from '../actions';

const initialState = { user: undefined };

function app(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.user };
    case LOGOUT:
      return initialState;
    default:
      return initialState;
  }
}

export default app;