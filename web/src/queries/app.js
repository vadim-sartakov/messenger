export const ME = `query {
  me {
    _id
    name
    colors {
      ...colorsFields
    }
    chats {
      _id
      name
      participants {
        _id
        name
      }
      colors {
        ...colorsFields
      }
    }
  }
}

fragment colorsFields on Colors {
  text
  background
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
      colors {
        text
        background
      }
    }
  }
`;