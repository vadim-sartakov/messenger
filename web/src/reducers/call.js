import {
  INITIATE_CALL,
  OUTGOING_CALL_REQUESTED,
  OUTGOING_CALL_SUCCEEDED,
  SWITCH_CAMERA,
  END_CALL
} from '../actions';

const initialState = {};

function call(state = initialState, { type, ...action }) {
  switch (type) {
    case INITIATE_CALL:
      return { ...state, settings: true, video: action.video, audio: action.audio };
    case OUTGOING_CALL_REQUESTED:
      return { ...state, settings: false, outgoing: true, video: action.video, audio: action.audio };
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

export default call;