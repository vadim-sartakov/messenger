const { hostname, port } = window.location;

export const API_URL = process.env.API_URL || '';
export const GRAPHQL_URL = process.env.GRAPHQL_URL || '';
// TODO: on production set 'wss'
export const WS_URL = process.env.WS_URL ||
  `${process.env.NODE_ENV === 'development' ? 'ws' : 'ws'}://${hostname}${port.length && ':' + port}/ws`;