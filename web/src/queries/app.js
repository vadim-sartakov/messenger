export const HOME = `query {
  me {
    _id
    name
    color
  }
  chats: getChats {
    _id
    name
    inviteLink
    participants {
      _id
      name
    }
    color
  }
}
`;

export const CHAT_DETAILS = `query GetChat($id: ID!){
  chat: getChat(id: $id) {
    _id
    name
    inviteLink
    participants {
      _id
      name
    }
    color
    messages {
      author {
        _id
        name
      }
      content
      createdAt
    }
  }
}
`;

export const CREATE_CHAT = `mutation CreateChat($value: ChatInput!) {
  createChat(value: $value) {
    _id
    name
    inviteLink
    participants {
      _id
      name
    }
    color
  }
}
`;

export const JOIN_CHAT = `mutation JoinChat($inviteLink: String!) {
  joinChat(inviteLink: $inviteLink) {
    _id
    name
  }
}
`;

export const POST_MESSAGE = `mutation PostMessage($chat: ID!, content: String!) {
  postMessage(chat: $chat, content: $content) {
    _id
    author {
      _id
      name
    }
    content
    createdAt
  }
}
`;