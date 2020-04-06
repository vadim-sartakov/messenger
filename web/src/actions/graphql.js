export const GRAPHQL_FETCH_REQUESTED = 'GRAPHQL_FETCH_REQUESTED';
export const GRAPHQL_FETCH_SUCCEEDED = 'GRAPHQL_FETCH_SUCCEEDED';
export const GRAPHQL_FETCH_FAILED = 'GRAPHQL_FETCH_FAILED';
export const GRAPHQL_FETCH_CLEAR = 'GRAPHQL_FETCH_CLEAR';

export function requestGraphqlFetch(id, query, variables) {
  return { type: GRAPHQL_FETCH_REQUESTED, id, query, variables };
}

export function graphqlFetchClear(id) {
  return { type: GRAPHQL_FETCH_CLEAR, id };
}