import React from 'react';
import { connect } from 'react-redux';
import { endCall, setCallSettings } from '../../actions';
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
    incoming: state.call.incoming,
    ongoing: state.call.ongoing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    endCall: () => dispatch(endCall()),
    setCallSettings: () => dispatch(setCallSettings())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer);