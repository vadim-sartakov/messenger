import { SELECT_CHAT, DESTROY_APP } from '../actions';

const initialState = {};

function app(state = initialState, { type, ...action }) {
  switch (type) {
    case SELECT_CHAT:
      return { ...state, selectedChat: action.id };
    case DESTROY_APP:
      return initialState;
    default:
      return state;
  }
}

export default app;