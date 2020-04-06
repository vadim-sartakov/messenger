export const GET_CHATS = `query {
  chats {
    _id
    participants {
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
      participants {
        _id
        name
      }
    }
  }
`;