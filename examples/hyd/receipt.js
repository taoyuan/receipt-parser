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
  pos: [[3, 0]],
  lex: 1
}, {
  name: '店员编号',
  pos: [[3, 0]],
  lex: 3
}, {
  name: '终端编号',
  pos: [[3, 0]],
  lex: 5
}, {
  name: '交易号',
  pos: [[3, 0]],
  lex: 7
}, {
  type: 'list',
  name: '商品',
  end: '总额',
  anchor: 4, // from line 4
  cols: {
    名称: [[0, 0]],
    编号: [[0, 1]],
    金额: {
      type: 'number',
      pos: [[0, 2]]
    }
  }
}, {
  name: '终端',
  anchor: "总额",
  pos: [[3, 2]]
}, {
  name: 'REF',
  anchor: "REF",
  pos: 2
}, {
  name: '凭证号',
  anchor: "凭证号",
  pos: 2
}];

var parser = new Parser(schema);
var data = fs.readFileSync("receipt.txt", "utf8").replace(/\\r\\n/g, '\n');
console.log(parser.parse(data));
