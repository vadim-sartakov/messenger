export const GRAPHQL_FETCH_REQUESTED = 'GRAPHQL_FETCH_REQUESTED';
export const GRAPHQL_FETCH_SUCCEEDED = 'GRAPHQL_FETCH_SUCCEEDED';
export const GRAPHQL_FETCH_FAILED = 'GRAPHQL_FETCH_FAILED';
export const GRAPHQL_FETCH_CLEAR = 'GRAPHQL_FETCH_CLEAR';
export const GRAPHQL_SET_DATA = 'GRAPHQL_SET_DATA';

export function requestGraphqlFetch(id, query, variables, noCache) {
  return { type: GRAPHQL_FETCH_REQUESTED, id, query, variables, noCache };
}

export function graphqlFetchClear(id) {
  return { type: GRAPHQL_FETCH_CLEAR, id };
}

export function graphqlSetData(id, data) {
  return { type: GRAPHQL_SET_DATA, id, data };
}