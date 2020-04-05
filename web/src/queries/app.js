export const GET_OVERVIEW = `
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