import { eventChannel } from 'redux-saga';
import { all, takeLatest, select, put, call, takeEvery, take, race, delay, fork, actionChannel } from 'redux-saga/effects';
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

export const socketSelector = state => state.app.socket;
export const meSelector = state => state.app.me;
export const chatsSelector = state => state.app.chats;
export const peerConnectionsSelector = state => state.call.peerConnections;
export const callMetaSelector = state => ({
  audio: state.call.audio,
  video: state.call.video,
  chatId: state.call.chatId,
  ongoing: state.call.ongoing
})

export function* updateMediaDevices() {
  const { audio, video } = yield select(callMetaSelector);
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

function handleRemoteStreamTrackAdded(peerConnection, track) {
  let remoteStream;
  if (peerConnection.remoteStream) remoteStream = peerConnection.remoteStream;
  else {
    peerConnection.remoteStream = new MediaStream();
    remoteStream = peerConnection.remoteStream;
  }
  remoteStream.addTrack(track);
}

function createPeerConnectionChannel(peerConnection) {
  return eventChannel(emit => {
    peerConnection.addEventListener('icecandidate', event => {
      emit({ type: messageTypes.ICE_CANDIDATE, candidate: event.candidate });
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      if (peerConnection.connectionState === 'connected') {
        //console.log('Connected %s', peerConnection.recipient);
        emit({ type: messageTypes.CALL_ESTABLISHED });
      }
    });

    peerConnection.addEventListener('track', event => {
      emit({ type: messageTypes.REMOTE_STREAM_TRACK_ADDED, track: event.track });
    });

    return () => peerConnection.close();
  });
}

function* watchPeerConnection({ peerConnection, socket, chat, recipient }) {
  const channel = createPeerConnectionChannel(peerConnection);
  while (true) {
    const { connection, timeout } = yield race({
      connection: take(channel),
      timeout: delay(10000)
    });
    if (timeout) {
      if (peerConnection.connectionState !== 'connected') {
        //console.log('Timeout connection %s, closing', peerConnection.recipient)
        peerConnection.close();
        return;
      }
      continue;
    }
    const { type, ...message } = connection;
    switch (type) {
      case messageTypes.ICE_CANDIDATE:
        //console.log('Sending ice candidate to %s', recipient);
        yield call([socket, 'send'], JSON.stringify({
          type: messageTypes.ICE_CANDIDATE,
          chat,
          recipient,
          candidate: message.candidate
        }));
        break;
      case messageTypes.CALL_ESTABLISHED:
        yield put({ type: ADD_PEER_CONNECTION, peerConnection });
        break;
      case messageTypes.REMOTE_STREAM_TRACK_ADDED:
        handleRemoteStreamTrackAdded(peerConnection, message.track);
        break;
      default:
    }
  }
}

export function* callOffer({ socket, chat, recipient }) {
  const { audioStream, videoStream } = yield select(streamsSelector);

  const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
  yield fork(watchPeerConnection, { peerConnection, socket, chat, recipient });

  peerConnection.recipient = recipient;
  audioStream.getTracks().forEach(track => peerConnection.addTrack(track));
  videoStream && videoStream.getTracks().forEach(track => peerConnection.addTrack(track));
  
  const offer = yield call([peerConnection, 'createOffer']);

  // After setLocalDescription ice candidates should start flowing
  yield call([peerConnection, 'setLocalDescription'], offer);
  
  //console.log('Sending call offer to %s', peerConnection.recipient);
  yield call([socket, 'send'], JSON.stringify({
    type: messageTypes.CALL_OFFER,
    chat,
    recipient,
    offer
  }));

  const receivedIceCandidatesChannel = yield actionChannel(action =>
    action.type === ICE_CANDIDATE_RECEIVED &&
    action.chat === chat &&
    action.sender === recipient
  );
  while (true) {
    const { answer } = yield take(action => action.type === CALL_ANSWER_RECEIVED &&
      action.chat === chat &&
      action.sender === recipient
    );
    //console.log('Answer received from %s', peerConnection.recipient);
    const remoteDesc = new RTCSessionDescription(answer);
    yield call([peerConnection, 'setRemoteDescription'], remoteDesc);
    yield fork(watchIncomingIceCandidates, { peerConnection, channel: receivedIceCandidatesChannel });
  }
}

function* watchIncomingIceCandidates({ channel, peerConnection }) {
  while (true) {
    const { candidate } = yield take(channel);
    //console.log('Received ice candidate from %s', peerConnection.recipient);
    if (candidate) yield call([peerConnection, 'addIceCandidate'], candidate);
  }
}

export function* listenForCall({ socket, chat, recipient }) {
  const iceCandidatesChannel = yield actionChannel(action =>
    action.type === ICE_CANDIDATE_RECEIVED &&
    action.chat === chat &&
    action.sender === recipient
  );
  while (true) {
    const offerAction = yield take(action =>
      action.type === CALL_OFFER_RECEIVED &&
      action.chat === chat &&
      action.sender === recipient
    );
    //console.log('Received call offer from %s', recipient);

    const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
    peerConnection.recipient = recipient;
    yield fork(watchPeerConnection, { peerConnection, socket, chat, recipient });

    const remoteDesc = new RTCSessionDescription(offerAction.offer);
    yield call([peerConnection, 'setRemoteDescription'], remoteDesc);

    // Should listen for ice candidates after setRemoteDescription
    yield fork(watchIncomingIceCandidates, { peerConnection, channel: iceCandidatesChannel });

    const { audioStream, videoStream } = yield select(streamsSelector);
    audioStream.getTracks().forEach(track => peerConnection.addTrack(track));
    videoStream && videoStream.getTracks().forEach(track => peerConnection.addTrack(track));

    const answer = yield call([peerConnection, 'createAnswer']);

    yield call([peerConnection, 'setLocalDescription'], answer);
    //console.log('Sending answer to %s', recipient);
    yield call([socket, 'send'], JSON.stringify({
      type: messageTypes.CALL_ANSWER,
      chat,
      recipient,
      answer
    }));
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
    //console.log('Making call to %s', participant.user._id);
    yield fork(callOffer, { socket, chat: chatId, recipient: participant.user._id })
  }

  yield put({ type: OUTGOING_CALL_SUCCEEDED });

  for (let i = 0; i < curChat.participants.length; i++) {
    const participant = curChat.participants[i];
    if (me._id === participant.user._id) continue;
    //console.log('Listening for a call from %s', participant.user._id);
    yield fork(listenForCall, { socket, chat: chatId, recipient: participant.user._id })
  }
}

function* stopStream(kind) {
  const streams = yield select(streamsSelector); 
  const curStream = streams[`${kind}Stream`];
  curStream && curStream.getTracks().forEach(track => track.stop());
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