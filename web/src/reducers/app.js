import { SELECT_CHAT } from '../actions';

const initialState = {};

function app(state = initialState, { type, ...action }) {
  switch (type) {
    case SELECT_CHAT:
      return { ...state, selectedChat: action.id };
    default:
      return state;
  }
}

export default app;