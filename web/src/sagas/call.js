import { all, takeLatest, select, put, call, takeEvery } from 'redux-saga/effects';
import {
  UPDATE_MEDIA_DEVICES_REQUESTED,
  UPDATE_MEDIA_DEVICES_SUCCEEDED,
  OUTGOING_CALL_REQUESTED,
  OUTGOING_CALL_SUCCEEDED,
  OUTGOING_CALL_FAILED,
  GET_LOCAL_STREAM_REQUESTED,
  GET_LOCAL_STREAM_SUCCEEDED,
  GET_LOCAL_STREAM_FAILED,
  END_CALL_REQUESTED,
  END_CALL_SUCCEEDED,
  SHOW_MESSAGE,
} from '../actions';

export const streamsSelector = state => ({
  audioStream: state.call.audioStream,
  videoStream: state.call.videoStream,
});

export const audioVideoPropsSelector = state => ({
  audio: state.call.audio,
  video: state.call.video
});

export function* updateMediaDevices() {
  const { audio, video } = yield select(audioVideoPropsSelector);
  try {
    const constraints = { audio, video };
    // To be able to list all available devices it is required to
    // execute getUserMedia first
    const stream = yield call([navigator.mediaDevices, 'getUserMedia'], constraints);
    // Closing tracks right after permission granted to avoid leaks
    stream.getTracks().forEach(track => track.stop());
    const devices = yield call([navigator.mediaDevices, 'enumerateDevices']);
    const cams = devices.filter(device => device.kind === 'videoinput');
    const mics = devices.filter(device => device.kind === 'audioinput');
    yield put({ type: UPDATE_MEDIA_DEVICES_SUCCEEDED, mics, cams });
  } catch (err) {
    console.log(err);
    yield put({ type: SHOW_MESSAGE, severity: 'error', text: 'Failed to get camera and microphone data', autoHide: true });
    yield put({ type: END_CALL_REQUESTED });
  }
}

function* stopStream(kind) {
  const streams = yield select(streamsSelector); 
  const curStream = streams[`${kind}Stream`];
  curStream && curStream.getTracks().forEach(track => track.stop());
}

export function* getLocalStream({ kind, deviceId }) {
  yield call(stopStream, kind);
  const constraints = {
    [kind]: { deviceId }
  };
  try {
    const stream = yield navigator.mediaDevices.getUserMedia(constraints);
    yield put({ type: GET_LOCAL_STREAM_SUCCEEDED, kind, stream });
  } catch(err) {
    console.log(err);
    yield put({ type: SHOW_MESSAGE, severity: 'error', text: 'Failed to get stream' });
  }
}

export function* startCall() {

}

export function* stopStreams() {
  yield call(stopStream, 'audio');
  yield call(stopStream, 'video');
  yield put({ type: END_CALL_SUCCEEDED });
}

export default function* callSaga() {
  yield all([
    takeEvery(UPDATE_MEDIA_DEVICES_REQUESTED, updateMediaDevices),
    takeEvery(GET_LOCAL_STREAM_REQUESTED, getLocalStream),
    takeLatest(OUTGOING_CALL_REQUESTED, startCall),
    takeLatest(END_CALL_REQUESTED, stopStreams)
  ])
}