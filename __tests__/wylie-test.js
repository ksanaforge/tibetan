jest.dontMock('../wylie.js');

var wylie = require('../wylie');

describe('wylie', function() {
  it('translate wylie to tibetan', function() {
    expect(wylie.fromWylie('byed.bcug')).toBe('བྱེད.བཅུག');
  });
});
