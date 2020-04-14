import getShortName from './getShortName';

describe('getShortName', () => {
  it('should return 2 first letters of each word on space separated strings', () => {
    expect(getShortName('First Second Third')).toBe('FS');
  });

  it('should return 2 first letters of one word', () => {
    expect(getShortName('FirstSecondThird')).toBe('FI');
  });
});