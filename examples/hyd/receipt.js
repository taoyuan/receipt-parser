'use strict';

var fs = require('fs');
var Parser = require('../..');

var schema = [{
  name: '店名',
  pos: [[1, 0]]
}, {
  name: '地址',
  pos: [[2, 0]]
}, {
  name: '商店编号',
  pos: [[3, 0]]
}, {
  name: '店员编号',
  pos: [[3, 1]]
}, {
  name: '终端编号',
  pos: [[3, 2]]
}, {
  name: '交易号',
  pos: [[3, 3]]
}, {
  type: 'list',
  name: '商品',
  end: '总额',
  skip: 7,
  cols: {
    名称: [[0, 0]],
    编号: [[0, 1]],
    金额: {
      type: 'number',
      pos: [[0, 2]]
    }
  }
}];

var parser = new Parser(schema);
var data = fs.readFileSync("receipt.txt", "utf8").replace(/\\r\\n/g, '\n');
console.log(parser.parse(data));
