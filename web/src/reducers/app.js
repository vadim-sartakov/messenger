import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  INITIALIZE_REQUESTED,
  INITIALIZE_SUCCEEDED,
  INITIALIZE_FAILED,
  SHOW_ERROR,
  HIDE_ERROR,
  ADD_CHAT,
  INITIALIZE_CHAT_REQUESTED,
  INITIALIZE_CHAT_SUCCEEDED,
  INITIALIZE_CHAT_FAILED,
  DESTROY_SUCCEEDED
} from '../actions';

const initialState = { isLoading: true, chat: { isLoading: true } };

function app(state = initialState, { type, ...action }) {
  switch (type) {
    case INITIALIZE_REQUESTED:
      return { ...state, isLoading: true };
    case INITIALIZE_SUCCEEDED:
      return { ...state, isLoading: false, me: action.data.me, chats: action.data.chats };
    case INITIALIZE_FAILED:
      return { ...state, isLoading: false, error: true };
    case SHOW_ERROR:
      return { ...state, error: { open: true, message: action.message } };
    case HIDE_ERROR:
      return { ...state, error: { ...state.error, open: false } };
    case ADD_CHAT:
      return { ...state, chats: [...state.chats, action.chat] };
    case INITIALIZE_CHAT_REQUESTED:
      return { ...state, chat: { isLoading: true } };
    case INITIALIZE_CHAT_SUCCEEDED:
      return { ...state, chat: action.data.chat };
    case INITIALIZE_CHAT_FAILED:
      return { ...state, chat: { error: true } };
    case DESTROY_SUCCEEDED:
      return initialState;
    default:
      return state;
  }
}

const persistConfig = {
  key: 'app',
  storage,
  blacklist: ['error']
};

export default persistReducer(persistConfig, app);