export const HOME = `query {
  me {
    _id
    name
    color
  }
  chats {
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