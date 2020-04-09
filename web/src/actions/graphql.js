export const GRAPHQL_FETCH_REQUESTED = 'GRAPHQL_FETCH_REQUESTED';
export const GRAPHQL_FETCH_SUCCEEDED = 'GRAPHQL_FETCH_SUCCEEDED';
export const GRAPHQL_FETCH_FAILED = 'GRAPHQL_FETCH_FAILED';
export const GRAPHQL_FETCH_CLEAR = 'GRAPHQL_FETCH_CLEAR';
export const GRAPHQL_FETCH_DESTROY = 'GRAPHQL_FETCH_DESTROY';
export const GRAPHQL_SET_DATA = 'GRAPHQL_SET_DATA';

export function requestGraphqlFetch(id, query, options = {}) {
  const { variables, noCache, onSuccess, onError } = options;
  return { type: GRAPHQL_FETCH_REQUESTED, id, query, variables, noCache, onSuccess, onError };
}

export function graphqlFetchClear(id) {
  return { type: GRAPHQL_FETCH_CLEAR, id };
}

export function graphqlFetchDestroy() {
  return { type: GRAPHQL_FETCH_DESTROY };
}

export function graphqlSetData(id, data) {
  return { type: GRAPHQL_SET_DATA, id, data };
}