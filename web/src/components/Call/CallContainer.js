import React from 'react';
import { connect } from 'react-redux';
import { showMessage, getLocalStream, startCall, endCall } from '../../actions';
import Call from './Call';

function CallContainer({ startCall, getLocalStream, endCall, setCallSettings, ...props }) {
  return (
    <Call
      {...props}
      onGetLocalStream={getLocalStream}
      onStartCall={startCall}
      onEndCall={endCall}
      onSettingsChange={setCallSettings}
    />
  )
}

function mapStateToProps(state) {
  return {
    settings: state.call.settings,
    outgoing: state.call.outgoing,
    audio: state.call.audio,
    video: state.call.video,
    ongoing: state.call.ongoing,
    audioStream: state.call.audioStream,
    videoStream: state.call.videoStream
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLocalStream: (kind, deviceId) => dispatch(getLocalStream(kind, deviceId)),
    startCall: () => dispatch(startCall()),
    endCall: () => dispatch(endCall()),
    showMessage: options => dispatch(showMessage(options))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer);