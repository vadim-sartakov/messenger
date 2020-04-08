import React from 'react';

function JoinChat({ error }) {
  return error ? (
    <div>
      Invalid id
    </div>
  ) : null;
}

export default JoinChat;