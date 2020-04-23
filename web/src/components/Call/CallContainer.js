import React from 'react';
import { connect } from 'react-redux';
import { endCall } from '../../actions';
import Call from './Call';

function CallContainer(props) {
  return <Call {...props} />;
}

function mapStateToProps(state) {
  return {
    settings: state.call.settings,
    outgoing: state.call.outgoing,
    ongoing: state.call.ongoing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onEndCall: () => dispatch(endCall())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer);