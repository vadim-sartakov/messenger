function graphqlFetch(query, options = {}) {
  const {
    url = '/graphql',
    variables,
    token
  } = options;
  return new Promise((resolve, reject) => {
    return fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...token && { 'Authorization': `Bearer ${token}` }
        },
        body: JSON.stringify({ query, variables })
      }
    ).then(response => {
      if (!response.ok) reject();
      return response.json().then(content => {
        if (content.errors) {
          reject(content);
        } else {
          resolve(content)
        }
      });
    })
  });
}

export default graphqlFetch;