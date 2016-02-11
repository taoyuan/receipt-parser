'use strict';

var t = require('chai').assert;
var lexers = require('../lib/lexers');

describe('lexers', function () {

  describe('line lexer', function () {
    it('should tokenize line text', function () {
      var lexer = lexers.createLineLexer();
      var tokens = lexer.input('单号abc0021602071145250204收银002日期2016-01-01_12:12:12xyz:abc.def').tokens();
      var expected = ['单号', 'abc', '0021602071145250204', '收银', '002', '日期', '2016-01-01', '_', '12:12:12',
      'xyz', ':', 'abc', '.', 'def', '']; // last is EOF
      t.deepEqual(tokens.map(function (token) {
        return token.text;
      }), expected);
    });
  });
});
