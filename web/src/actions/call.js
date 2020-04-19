export const CALL_REQUESTED = 'CALL_REQUESTED';
export const CALL_FAILED = 'CALL_FAILED';
export const INCOMING_CALL = 'INCOMING_CALL';
export const SWITCH_CAMERA = 'SWITCH_CAMERA';
export const START_CALL = 'START_CALL';
export const END_CALL = 'END_CALL';

export function call(chatId, { audio, video }) {
  return { type: CALL_REQUESTED, chatId, audio, video };
}

export function switchCamera() {
  return { type: SWITCH_CAMERA };
}

export function endCall() {
  return { type: END_CALL };
}