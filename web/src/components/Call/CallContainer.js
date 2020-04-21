import React from 'react';
import { connect } from 'react-redux';
import { showMessage, endCall, setCallSettings } from '../../actions';
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
    settings: state.call.settings,
    outgoing: state.call.outgoing,
    audio: state.call.audio,
    video: state.call.video,
    ongoing: state.call.ongoing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    endCall: () => dispatch(endCall()),
    setCallSettings: () => dispatch(setCallSettings()),
    showMessage: options => dispatch(showMessage(options))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer);