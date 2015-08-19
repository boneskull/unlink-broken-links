'use strict';

var unlinkBrokenLinks = require('../lib');

describe('unlinkBrokenLinks', function() {
  it('should be a function', function() {
    expect(unlinkBrokenLinks).to.be.a('function');
  });
});
