function graphqlFetch(query, options = {}) {
  const {
    url,
    variables,
    token
  } = options;
  return new Promise((resolve, reject) => {
    const onContentParse = content => {
      if (content.errors) reject(content);
      else resolve(content);
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
    ).then(onFetch).catch(() => reject())
  });
}

export default graphqlFetch;