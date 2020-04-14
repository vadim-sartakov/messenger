import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { postMessage } from '../../actions';
import Chat from './Chat';

function ChatContainer({ id, chat, postMessage, ...props }) {
  const handlePostMessage = useCallback(({ content }) => {
    postMessage(id, content);
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
    postMessage: (chatId, text) => dispatch(postMessage(chatId, text))
  }
}

export default connect(undefined, mapDispatchToProps)(ChatContainer);