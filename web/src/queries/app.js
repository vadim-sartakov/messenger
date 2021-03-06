export const HOME = `query {
  me {
    _id
    name
    color
  }
  chats: getChats {
    _id
    name
    owner
    inviteLink
    participants {
      _id
      name
      color
    }
    color
    messages(limit: 30) {
      _id
      author {
        _id
        name
        color
      }
      content
      createdAt
    }
  }
}`;

export const CREATE_CHAT = `mutation CreateChat($name: String!) {
  createChat(name: $name) {
    _id
    name
    owner
    inviteLink
    participants {
      _id
      name
    }
    color
    messages {
      _id
    }
  }
}`;

export const RENAME_CHAT = `mutation UpadateChat($id: ID!, $name: String!) {
  renameChat(id: $id, name: $name)
}`;

export const JOIN_CHAT = `mutation JoinChat($inviteLink: String!) {
  joinChat(inviteLink: $inviteLink) {
    _id
    name
    owner
    inviteLink
    participants {
      _id
      name
    }
    color
    messages(limit: 30) {
      _id
      author {
        _id
        name
        color
      }
      content
      createdAt
    }
  }
}`;

export const POST_MESSAGE = `mutation PostMessage($chatId: ID!, $text: String!) {
  message: postMessage(chatId: $chatId, text: $text) {
    _id
    createdAt
  }
}`;