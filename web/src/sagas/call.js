import { eventChannel } from 'redux-saga';
import { all, takeLatest, select, put, call, takeEvery, take, race, delay, fork } from 'redux-saga/effects';
import {
  UPDATE_MEDIA_DEVICES_REQUESTED,
  UPDATE_MEDIA_DEVICES_SUCCEEDED,
  OUTGOING_CALL_REQUESTED,
  OUTGOING_CALL_SUCCEEDED,
  GET_LOCAL_STREAM_REQUESTED,
  GET_LOCAL_STREAM_SUCCEEDED,
  ADD_PEER_CONNECTION,
  CALL_OFFER_RECEIVED,
  CALL_ANSWER_RECEIVED,
  ICE_CANDIDATE_RECEIVED,
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
export const callMetaSelector = state => ({
  chatId: state.call.chatId,
  ongoing: state.call.ongoing
})

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

function createPeerConnectionChannel(peerConnection) {
  return eventChannel(emit => {
    peerConnection.addEventListener('icecandidate', event => {
      emit({ type: messageTypes.ICE_CANDIDATE, iceCandidate: event.candidate });
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      if (peerConnection.connectionState === 'connected') {
        emit({ type: messageTypes.CALL_ESTABLISHED });
      }
    });
  });
}

function* watchConnection({ peerConnection, socket, chatId, calleeId }) {
  const channel = createPeerConnectionChannel(peerConnection);
  while (true) {
    const { connection, timeout } = yield race({
      connection: take(channel),
      timeout: delay(20000)
    });
    if (timeout) {
      peerConnection.close();
      return;
    }
    const { type, ...message } = connection;
    switch (type) {
      case messageTypes.ICE_CANDIDATE:
        yield call([socket, 'send'], JSON.stringify({
          type: messageTypes.ICE_CANDIDATE,
          chatId,
          calleeId,
          candidate: message.candidate
        }));
        break;
      case messageTypes.CALL_ESTABLISHED:
        yield put({ type: ADD_PEER_CONNECTION, peerConnection });
        return;
      default:
    }
  }
}

export function* callOffer({ socket, chatId, calleeId }) {
  const { audioStream, videoStream } = yield select(streamsSelector);

  const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
  peerConnection.calleeId = calleeId;
  audioStream.getTracks().forEach(track => peerConnection.addTrack(track));
  videoStream && videoStream.getTracks().forEach(track => peerConnection.addTrack(track));
  
  const offer = yield call([peerConnection, 'createOffer']);
  yield call([peerConnection, 'setLocalDescription'], offer);
  yield call([socket, 'send'], JSON.stringify({
    type: messageTypes.CALL_OFFER,
    chatId,
    calleeId,
    offer
  }));
  yield fork(watchConnection, { peerConnection, socket, chatId, calleeId });
  while (true) {
    const { calleeId: answerCalleeId, answer } = yield take(CALL_ANSWER_RECEIVED);
    if (calleeId !== answerCalleeId) continue;
    const remoteDesc = new RTCSessionDescription(answer);
    yield call([peerConnection, 'setRemoteDescription'], remoteDesc);
  }
}

export function* callOfferOrIceCandidateReceived() {
  const socket = yield select(socketSelector);
  let peerConnection, channel;
  while (true) {
    const winner = yield race({
      iceCandidate: take(ICE_CANDIDATE_RECEIVED),
      callOffer: take(CALL_OFFER_RECEIVED)
    });

    const { chatId, callerId, calleeId } = winner.iceCandidate || winner.callOffer;
    const candidate = winner.iceCandidate && winner.iceCandidate.candidate;
    const offer = winner.callOffer && winner.callOffer.offer;

    if (!peerConnection) {
      peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
      peerConnection.calleeId = calleeId;
      channel = createPeerConnectionChannel(peerConnection);
    }

    if (candidate) {
      yield call([peerConnection, 'addIceCandidate'], candidate);
    }

    if (offer) {
      const remoteDesc = new RTCSessionDescription(offer);
      yield call([peerConnection, 'setRemoteDescription'], remoteDesc);
      const answer = yield call([peerConnection, 'createAnswer']);
      yield call([peerConnection, 'setLocalDescription'], answer);
      yield call([socket, 'send'], JSON.stringify({
        type: messageTypes.CALL_ANSWER,
        chatId,
        callerId,
        calleeId,
        answer
      }));
    }

    const { connection, timeout } = yield race({
      connection: take(channel),
      timeout: delay(20000)
    });
    if (timeout) {
      peerConnection.close();
      return;
    }
    const { type } = connection;
    switch (type) {
      case messageTypes.CALL_ESTABLISHED:
        yield put({ type: ADD_PEER_CONNECTION, peerConnection });
        break;
      default:
    }
  }
}

export function* startCall({ chatId }) {
  const socket = yield select(socketSelector);
  const me = yield select(meSelector);
  const chats = yield select(chatsSelector);
  const curChat = chats.find(chat => chat._id === chatId);
  const calls = [];
  for (let i = 0; i < curChat.participants.length; i++) {
    const participant = curChat.participants[i];
    if (me._id === participant.user._id) continue;
    calls.push(
      call(callOffer, { socket, chatId, calleeId: participant.user._id })
    );
  }
  yield all(calls);
  yield put({ type: OUTGOING_CALL_SUCCEEDED });
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
    call(callOfferOrIceCandidateReceived)
  ])
}