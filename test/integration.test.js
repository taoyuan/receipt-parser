'use strict';

var t = require('chai').assert;
var Parser = require('../').Parser;
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


  it('should parse list for end beyond separator', function () {
    var parser = new Parser([{
      type: 'list',
      name: '商品',
      anchor: '--',
      pos: [4], // line 4 after anchor
      end: '原价金额',
      cols: [{
        name: '编号',
        pos: [0, 0]
      }, {
        name: '名称',
        pos: [0, 1, -1, ' ']
      }, {
        name: '原价',
        type: 'number',
        pos: [1, 0]
      }, {
        name: '折扣',
        type: 'number',
        pos: [1, 1]
      }, {
        name: '单价',
        type: 'number',
        pos: [1, 2]
      }, {
        name: '柜组',
        pos: [2, 0]
      }, {
        name: '数量',
        type: 'number',
        pos: [2, 1]
      }, {
        name: '金额',
        type: 'number',
        pos: [2, 2]
      }]
    }]);
    var result = parser.parse(receipt.text);
    t.deepEqual(receipt.expected['商品'], result['商品']);
  });

  it('should throw error for wrong primitive pos options', function () {
    var parser = new Parser([{
      name: '序号',
      anchor: 4, // line 4
      pos: 200
    }]);
    t.throw(function () {
      parser.parse(receipt.text);
    });
  });

  it('should throw error for wrong list pos option', function () {
    var parser = new Parser([{
      type: 'list',
      name: '商品',
      pos: 200
    }]);
    t.throw(function () {
      parser.parse(receipt.text);
    });
  });

});
