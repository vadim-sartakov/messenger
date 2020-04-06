export const ME = `query {
  me {
    _id
    name
    chats {
      _id
      participants {
        _id
        name
      }
    }
    friends {
      _id
      name
    }
  }
}
`;

export const CREATE_CHAT = `
  mutation CreateChat($value: ChatInput!) {
    createChat(value: $value) {
      _id
      name
      participants {
        _id
        name
      }
    }
  }
`;