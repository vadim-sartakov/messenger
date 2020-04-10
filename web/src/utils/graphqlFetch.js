function graphqlFetch(query, options = {}) {
  const {
    url,
    variables,
    token
  } = options;
  return new Promise((resolve, reject) => {
    const onContentParse = content => {
      resolve(content);
    };
    const onFetch = response => {
      if (!response.ok) reject(response);
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
    ).then(onFetch)
  });
}

export default graphqlFetch;