import { isRequired } from './validators';

describe('validators', () => {
  it('should return true on not empty string', () => {
    expect(isRequired('Test')).toBeTruthy();
  });
  it('should return false on empty string', () => {
    expect(isRequired('')).toBeFalsy();
  });
});