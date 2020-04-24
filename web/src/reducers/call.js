import {
  UPDATE_MEDIA_DEVICES_SUCCEEDED,
  INITIATE_CALL,
  OUTGOING_CALL_REQUESTED,
  OUTGOING_CALL_SUCCEEDED,
  ADD_PEER_CONNECTION,
  SWITCH_CAMERA,
  END_CALL_SUCCEEDED,
  GET_LOCAL_STREAM_SUCCEEDED
} from '../actions';

const initialState = {};

function call(state = initialState, { type, ...action }) {
  switch (type) {
    case INITIATE_CALL:
      return { ...state, settings: true, video: action.video, audio: action.audio };
    case UPDATE_MEDIA_DEVICES_SUCCEEDED:
      return { ...state, mics: action.mics, cams: action.cams, devicesInitialized: true };
    case GET_LOCAL_STREAM_SUCCEEDED:
      return { ...state, [`${action.kind}Stream`]: action.stream };
    case OUTGOING_CALL_REQUESTED:
      return { ...state, chatId: action.chatId, settings: false, outgoing: true };
    case OUTGOING_CALL_SUCCEEDED:
      return { ...state, outgoing: false, ongoing: true };
    case SWITCH_CAMERA:
      return { ...state, video: !state.video };
    case ADD_PEER_CONNECTION:
      return { ...state, peerConnections: [...(state.peerConnections || []), action.peerConnection] };
    case END_CALL_SUCCEEDED:
      return initialState;
    default:
      return state;
  }
}

export default call;