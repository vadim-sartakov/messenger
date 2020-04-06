export const GET_CHATS_AND_FRIENDS = `
  query {
    chats {
      _id
      owner {
        _id
        name
      }
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
`;

export const CREATE_CHAT = `
  mutation CreateChat($value: ChatInput!) {
    createChat(value: $value) {
      _id
      name
      owner {
        name
      }
      participants {
        name
      }
    }
  }
`;