function graphqlFetch(query, options = {}) {
  const {
    url = '/graphql',
    variables,
    token
  } = options;
  return new Promise((resolve, reject) => {
    const onContentParse = content => {
      if (content.errors) {
        reject(content.errors);
      } else {
        resolve(content.data)
      }
    };
    const onFetchSuccess = response => {
      if (!response.ok) reject();
      return response.json().then(onContentParse);
    };
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
    ).then(onFetchSuccess)
  });
}

export default graphqlFetch;