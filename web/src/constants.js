const { hostname, port, protocol } = window.location;

export const API_URL = '/api';
export const GRAPHQL_URL = '/graphql';

export const WS_URL = `${protocol === 'http:' ? 'ws' : 'wss'}://${hostname}${port.length ? ':' + port : ''}/ws`;