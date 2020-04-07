import React from 'react';
import EmptyChat from './EmptyChat';

function Chat({ chat }) {
  return chat.participants.length === 0 ? <EmptyChat chat={chat} /> : <div />;
}

export default Chat;