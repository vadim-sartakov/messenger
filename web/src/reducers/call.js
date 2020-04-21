import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  OUTGOING_CALL_REQUESTED,
  OUTGOING_CALL_SUCCEEDED,
  SWITCH_CAMERA,
  END_CALL
} from '../actions';

const initialState = {};

function call(state = initialState, { type, ...action }) {
  switch (type) {
    case OUTGOING_CALL_REQUESTED:
      return { ...state, outgoing: true, video: action.video, audio: action.audio };
    case OUTGOING_CALL_SUCCEEDED:
      return { ...state, outgoing: false, ongoing: true };
    case SWITCH_CAMERA:
      return { ...state, video: !state.video };
    case END_CALL:
      return initialState;
    default:
      return state;
  }
}

const persistConfig = {
  key: 'call',
  storage,
  whitelist: ['settings']
};

export default persistReducer(persistConfig, call);