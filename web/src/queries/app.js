export const ME = `
  query {
    me {
      _id
      name
      login
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