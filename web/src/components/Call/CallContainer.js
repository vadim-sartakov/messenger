import React from 'react';
import { connect } from 'react-redux';
import { showMessage, startCall, endCall } from '../../actions';
import Call from './Call';

function CallContainer({ startCall, endCall, setCallSettings, ...props }) {
  return (
    <Call
      {...props}
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
    ongoing: state.call.ongoing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startCall: (chatId, options) => dispatch(startCall(chatId, options)),
    endCall: () => dispatch(endCall()),
    showMessage: options => dispatch(showMessage(options))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer);