import { LOG_IN, LOG_OUT } from '../actions';

const initialState = { user: undefined };

function app(state = initialState, action) {
  switch (action.type) {
    case LOG_IN:
      return { ...state, user: action.user };
    case LOG_OUT:
      return initialState;
    default:
      return initialState;
  }
}

export default app;