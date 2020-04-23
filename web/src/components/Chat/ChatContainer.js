import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { postMessage, initiateCall } from '../../actions';
import Chat from './Chat';

function ChatContainer({ postMessage, initiateCall, ...props }) {
  const handlePostMessage = useCallback(({ content }) => {
    postMessage(content);
  }, [postMessage]);
  return (
    <Chat
      {...props}
      onPostMessage={handlePostMessage}
      onInitiateCall={initiateCall}
    />
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    postMessage: text => dispatch(postMessage(ownProps.id, text)),
    initiateCall: options => dispatch(initiateCall(ownProps.id, options))
  }
}

export default connect(undefined, mapDispatchToProps)(ChatContainer);