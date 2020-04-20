import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { postMessage, startCall } from '../../actions';
import Chat from './Chat';

function ChatContainer({ postMessage, startCall, ...props }) {
  const handlePostMessage = useCallback(({ content }) => {
    postMessage(content);
  }, [postMessage]);
  return (
    <Chat
      {...props}
      onPostMessage={handlePostMessage}
      onStartCall={startCall}
    />
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    postMessage: text => dispatch(postMessage(ownProps.id, text)),
    startCall: options => dispatch(startCall(ownProps.id, options))
  }
}

export default connect(undefined, mapDispatchToProps)(ChatContainer);