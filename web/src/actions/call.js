export const OUTGOING_CALL_REQUESTED = 'OUTGOING_CALL_REQUESTED';
export const OUTGOING_CALL_SUCCEEDED = 'OUTGOING_CALL_SUCCEEDED';
export const OUTGOING_CALL_FAILED = 'OUTGOING_CALL_FAILED';
export const SWITCH_CAMERA = 'SWITCH_CAMERA';
export const ACCEPT_CALL = 'ACCEPT_CALL';
export const CANCEL_CALL = 'CANCEL_CALL';
export const END_CALL = 'END_CALL';

export function startCall(chatId, { audio, video }) {
  return { type: OUTGOING_CALL_REQUESTED, chatId, audio, video };
}

export function switchCamera() {
  return { type: SWITCH_CAMERA };
}

export function endCall() {
  return { type: END_CALL };
}

export function acceptCall() {
  return { type: ACCEPT_CALL };
}

export function cancelCall() {
  return { type: CANCEL_CALL };
}