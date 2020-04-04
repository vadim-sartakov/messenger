async function stubFetch(url, options) {
  switch (url) {
    case '/login':
      return {
        authToken: 'authToken',
        refreshToken: 'refreshToken',
        user: {
          id: 1,
          username: 'Jane Doe'
        }
      };
  }
}

export default stubFetch;