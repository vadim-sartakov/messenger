import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { postMessage } from '../../actions';
import Chat from './Chat';

function ChatContainer({ id, chat, postMessage, ...props }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;

  const handlePostMessage = useCallback(message => {
    postMessage(id, message);
  }, [id, postMessage]);

  return (
    <Chat
      {...props}
      chat={chat}
      location={location}
      postMessage={handlePostMessage}
    />
  );
}

function mapDispatchToProps(dispatch) {
  return {
    postMessage: (chatId, message) => dispatch(postMessage(chatId, message))
  }
}

export default connect(undefined, mapDispatchToProps)(ChatContainer);