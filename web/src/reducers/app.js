import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { SHOW_ERROR, HIDE_ERROR, DESTROY_APP } from '../actions';

const initialState = {};

function app(state = initialState, { type, ...action }) {
  switch (type) {
    case SHOW_ERROR:
      return { ...state, error: { open: true, message: action.message } };
    case HIDE_ERROR:
      return { ...state, error: { ...state.error, open: false } };
    case DESTROY_APP:
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