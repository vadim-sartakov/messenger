import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Ongoing from './Ongoing';

function OngoingContainer({ peerConnections, ...props }) {
  /*const [streams, setStreams] = useState([]);
  useEffect(function getRemoteStreams() {
    const onTrackAdd = event => {

    };
    return () => {
      peerConnections.forEach(con => con.removeEventListener('track', onTrackAdd));
    };
  }, [peerConnections]);*/
  console.log(peerConnections)
  return <Ongoing {...props} />;
}

function mapStateToProps(state) {
  return {
    peerConnections: state.call.peerConnections
  };
}

export default connect(mapStateToProps)(OngoingContainer);