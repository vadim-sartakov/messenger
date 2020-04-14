import { LOGIN_REQUESTED, LOGIN_SUCCEEDED, TOKEN_EXPIRED } from '../actions';
import reducer from './auth';

describe('auth reducer', () => {
  it('should set loading on login request', () => {
    expect(reducer({}, { type: LOGIN_REQUESTED })).toEqual({ isLoading: true });
  });

  it('should set token on login success', () => {
    expect(reducer({}, { type: LOGIN_SUCCEEDED, token: 'token' })).toEqual({ token: 'token' });
  });

  it('should set token expired and preserve previous state', () => {
    expect(reducer({ prev: true }, { type: TOKEN_EXPIRED })).toEqual({ prev: true, tokenExpired: true });
  });
});