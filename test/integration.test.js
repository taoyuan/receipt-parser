'use strict';

var t = require('chai').assert;
var Parser = require('../');
var resources = require('./resources');
var receipt = resources.receipt;

describe('integration', function () {
  it('should parse a receipt with object cols schema', function () {
    var parser = new Parser(receipt.schema1);
    var result = parser.parse(receipt.text);
    t.deepEqual(receipt.expected, result);
  });

  it('should parse a receipt with array cols schema', function () {
    var parser = new Parser(receipt.schema2);
    var result = parser.parse(receipt.text);
    t.deepEqual(receipt.expected, result);
  });
});
