import React from 'react';
import { connect } from 'react-redux';
import { showMessage, endCall } from '../../actions';
import Call from './Call';

function CallContainer({ endCall, setCallSettings, ...props }) {
  return (
    <Call
      {...props}
      onEndCall={endCall}
      onSettingsChange={setCallSettings}
    />
  )
}

function mapStateToProps(state) {
  return {
    outgoing: state.call.outgoing,
    audio: state.call.audio,
    video: state.call.video,
    ongoing: state.call.ongoing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    endCall: () => dispatch(endCall()),
    showMessage: options => dispatch(showMessage(options))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer);