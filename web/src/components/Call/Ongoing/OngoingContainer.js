import React from 'react';
import { connect } from 'react-redux';
import Ongoing from './Ongoing';

function OngoingContainer(props) {
  return <Ongoing {...props} />;
}

function mapStateToProps(state) {
  return {
    peerConnections: state.call.peerConnections
  };
}

export default connect(mapStateToProps)(OngoingContainer);