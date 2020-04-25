import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';

function Ongoing({ peerConnections = [] }) {
  useEffect(function setStreams() {
    peerConnections.forEach(peerConnection => {
      const videoEl = document.getElementById(peerConnection.calleeId);
      videoEl.srcObject = peerConnection.remoteStream;
    });
  }, [peerConnections]);

  return (
    <Grid container>
      {peerConnections.map(connection => {
        return (
          <video
            key={connection.calleeId}
            id={connection.calleeId}
            autoPlay
            playsInline
            controls={false}
          />
        )
      })}
    </Grid>
  );
}

export default Ongoing;