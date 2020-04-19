import {
  CALL_REQUESTED,
  START_CALL,
  INCOMING_CALL,
  SWITCH_CAMERA,
  END_CALL
} from '../actions';

const initialState = {};

function call(state = initialState, { type, ...action }) {
  switch (type) {
    case CALL_REQUESTED:
      return { ...state, standBy: true, video: action.video, audio: action.audio };
    case START_CALL:
      return { ...state, standBy: false, call: true };
    case INCOMING_CALL:
      return { ...state, standBy: true, video: action.video, audio: action.audio };
    case SWITCH_CAMERA:
      return { ...state, video: !state.video };
    case END_CALL:
      return initialState;
    default:
      return state;
  }
}

export default call;