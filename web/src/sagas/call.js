import { all, takeLatest, select, put, call, takeEvery } from 'redux-saga/effects';
import {
  UPDATE_MEDIA_DEVICES_REQUESTED,
  UPDATE_MEDIA_DEVICES_SUCCEEDED,
  OUTGOING_CALL_REQUESTED,
  GET_LOCAL_STREAM_REQUESTED,
  GET_LOCAL_STREAM_SUCCEEDED,
  ADD_PEER_CONNECTION,
  CALL_OFFER_RECEIVED,
  CALL_ANSWER_RECEIVED,
  ICE_CANDIDATE,
  END_CALL_REQUESTED,
  END_CALL_SUCCEEDED,
  SHOW_MESSAGE,
} from '../actions';
import * as messageTypes from './messageTypes';

const RTC_CONFIGURATION = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

export const streamsSelector = state => ({
  audioStream: state.call.audioStream,
  videoStream: state.call.videoStream,
});

export const audioVideoPropsSelector = state => ({
  audio: state.call.audio,
  video: state.call.video
});

export const socketSelector = state => state.app.socket;
export const meSelector = state => state.app.me;
export const chatsSelector = state => state.app.chats;
export const peerConnectionsSelector = state => state.call.peerConnections;

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

export function* callOffer({ socket, chatId, calleeId }) {
  const { audioStream, videoStream } = yield select(streamsSelector);

  const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
  peerConnection.calleeId = calleeId;
  audioStream.getTracks().forEach(track => peerConnection.addTrack(track));
  videoStream && videoStream.getTracks().forEach(track => peerConnection.addTrack(track));

  const offer = yield call([peerConnection, 'createOffer']);

  peerConnection.onicecandidate = event => {
    event.candidate && socket.send(JSON.stringify({
      type: messageTypes.ICE_CANDIDATE,
      chatId,
      calleeId,
      candidate: event.candidate
    }));
  };

  peerConnection.onconnectionstatechange = () => {
    if (peerConnection.connectionState === 'connected') {
      console.log('Connected!');
    }
  };

  yield call([peerConnection, 'setLocalDescription'], offer);
  yield call([socket, 'send'], JSON.stringify({
    type: messageTypes.CALL_OFFER,
    chatId,
    calleeId,
    offer
  }));
  yield put({ type: ADD_PEER_CONNECTION, peerConnection });
}

function* getOrCreatePeerConnection(calleeId) {
  const peerConnections = yield select(peerConnectionsSelector);
  let peerConnection;
  peerConnection = peerConnections && peerConnections.find(con => con.calleeId === calleeId);
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
    peerConnection.calleeId = calleeId;
    yield put({ type: ADD_PEER_CONNECTION, peerConnection });
  }
  return peerConnection;
}

export function* callOfferReceived({ chatId, callerId, calleeId, offer }) {
  const socket = yield select(socketSelector);
  const peerConnection = yield call(getOrCreatePeerConnection, calleeId);
  const remoteDesc = new RTCSessionDescription(offer);
  yield call([peerConnection, 'setRemoteDescription'], remoteDesc);
  const answer = yield call([peerConnection, 'createAnswer']);
  yield call([peerConnection, 'setLocalDescription'], answer);

  peerConnection.addEventListener('connectionstatechange', () => {
    if (peerConnection.connectionState === 'connected') {
      console.log('Connected!');
    }
  });

  yield call([socket, 'send'], JSON.stringify({
    type: messageTypes.CALL_ANSWER,
    chatId,
    callerId,
    calleeId,
    answer
  }));
}

export function* receiveCallAnswer({ calleeId, answer }) {
  const peerConnections = yield select(peerConnectionsSelector);
  const curPeerConnection = peerConnections.find(con => con.calleeId === calleeId);
  const remoteDesc = new RTCSessionDescription(answer);
  // Mutating object inside redux state. This is not ideal solution, but
  // taking in count that we are doing almost everything with sagas, doing it this way for now
  yield call([curPeerConnection, 'setRemoteDescription'], remoteDesc);
}

export function* receiveIceCandidate({ calleeId, candidate }) {
  const curPeerConnection = yield getOrCreatePeerConnection(calleeId);
  try {
    yield call([curPeerConnection, 'addIceCandidate'], candidate);
  } catch (err) {
    console.log(err);
  }
}

export function* startCall({ chatId }) {
  const socket = yield select(socketSelector);
  const me = yield select(meSelector);
  const chats = yield select(chatsSelector);
  const curChat = chats.find(chat => chat._id === chatId);
  for (let i = 0; i < curChat.participants.length; i++) {
    const participant = curChat.participants[i];
    if (me._id === participant.user._id) continue;
    yield call(callOffer, { socket, chatId, calleeId: participant.user._id });
  }
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
    takeLatest(END_CALL_REQUESTED, stopStreams),
    takeEvery(CALL_OFFER_RECEIVED, callOfferReceived),
    takeEvery(CALL_ANSWER_RECEIVED, receiveCallAnswer),
    takeEvery(ICE_CANDIDATE, receiveIceCandidate)
  ])
}