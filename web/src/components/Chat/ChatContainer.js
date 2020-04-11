import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { initializeChat, destroyChat, postMessage } from '../../actions';
import Chat from './Chat';

function ChatContainer({ id, chat, initializeChat, postMessage, ...props }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;

  useEffect(() => {
    initializeChat(id);
    return () => destroyChat(id);
  }, [id, initializeChat]);

  const handlePostMessage = useCallback(message => {
    postMessage(id, message);
  }, [id, postMessage]);

  return chat.isLoading || chat.error ? null : (
    <Chat
      {...props}
      chat={chat}
      location={location}
      postMessage={handlePostMessage}
    />
  );
}

function mapStateToProps(state) {
  return {
    chat: state.app.chat
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeChat: id => dispatch(initializeChat(id)),
    postMessage: (chatId, message) => dispatch(postMessage(chatId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);