import {
  INITIALIZE_REQUESTED,
  INITIALIZE_SUCCEEDED,
  INITIALIZE_FAILED,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  CREATE_CHAT_SUCCEEDED,
  ADD_CHAT_PARTICIPANT,
  RENAME_CHAT_SUCCEEDED
} from '../actions';
import reducer from './app';

describe('app reducer', () => {
  it('should preserve prev state and set load state on initialize request', () => {
    const action = { type: INITIALIZE_REQUESTED };
    expect(reducer({ prev: true }, action)).toEqual({ prev: true, isLoading: true });
  });

  it('should preserve prev state, reset isLoading and set \'me\' and \'chats\' data on initialize succeed', () => {
    const action = { type: INITIALIZE_SUCCEEDED, data: { me: 'me', chats: 'chats' } };
    expect(reducer({ prev: true }, action)).toEqual({ prev: true, isLoading: false, me: 'me', chats: 'chats' });
  });

  it('should preserve prev state, reset isLoading, set error on initialize fail', () => {
    const action = { type: INITIALIZE_FAILED };
    expect(reducer({ prev: true }, action)).toEqual({ prev: true, isLoading: false, error: true });
  });

  it('should show message with specified props', () => {
    const prevState = { prev: true };
    const action = { type: SHOW_MESSAGE, text: 'test' };
    expect(reducer(prevState, action)).toEqual({ prev: true, message: { open: true, text: 'test' } });
  });

  it('should hide message and preserve it\'s previous state', () => {
    const prevState = { prev: true, message: { open: true, text: 'test' } };
    const action = { type: HIDE_MESSAGE };
    expect(reducer(prevState, action)).toEqual({ prev: true, message: { open: false, text: 'test' } });
  });

  it('should add chat', () => {
    const prevState = { prev: true, chats: [{ name: 'chat' }] };
    const action = { type: CREATE_CHAT_SUCCEEDED, chat: { name: 'new chat' } };
    expect(reducer(prevState, action)).toEqual({
      prev: true,
      chats: [{ name: 'chat' }, { name: 'new chat' }]
    });
  });

  it('should add chat participant', () => {
    const prevState = { prev: true, chats: [{ _id: 0, name: 'chat', participants: [{ name: 'First' }] }] };
    const action = { type: ADD_CHAT_PARTICIPANT, chatId: 0, participant: { name: 'Second' } };
    expect(reducer(prevState, action)).toEqual({
      prev: true,
      chats: [{
        _id: 0,
        name: 'chat',
        participants: [{ name: 'First' }, { name: 'Second' }]
      }]
    });
  });

  it('should rename chat', () => {
    const prevState = { prev: true, chats: [{ _id: 0, name: 'chat' }] };
    const action = { type: RENAME_CHAT_SUCCEEDED, chatId: 0, name: 'renamed chat' };
    expect(reducer(prevState, action)).toEqual({
      prev: true,
      chats: [{
        _id: 0,
        name: 'renamed chat'
      }]
    });
  });
});