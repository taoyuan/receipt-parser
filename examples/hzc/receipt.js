'use strict';

var fs = require('fs');
var path = require('path');
var Parser = require('../..').Parser;

var schema = [{
  name: '序号',
  anchor: '本机流水',
  pos: 2 // line 0 column 2
}, {
  //type: 'date',
  name: '日期',
  anchor: '销售日期',
  pos: [0, 2, 2, ' ']
}, {
  type: 'number',
  name: '收银员编号',
  anchor: '收银员',
  pos: 2
}, {
  name: '收银员姓名',
  anchor: '收银员',
  pos: 3
}, {
  name: '收银机号',
  anchor: '收银机号',
  pos: 2
}, {
  type: 'number',
  name: '原价金额',
  anchor: '原价金额',
  pos: 2
}, {
  type: 'number',
  name: '应付金额',
  anchor: '应付金额',
  pos: 2
}, {
  name: '大写金额',
  anchor: '大写金额',
  pos: 2
}, {
  type: 'number',
  name: '实收',
  anchor: '实收',
  pos: 2
}, {
  type: 'number',
  name: '找零',
  anchor: '找零',
  pos: 2
}, {
  name: '会员卡号',
  anchor: '会员卡号',
  pos: 2
}, {
  type: 'number',
  name: '本次积分',
  anchor: '本次积分',
  pos: 2
}, {
  type: 'number',
  name: '累计积分',
  anchor: '累计积分',
  pos: 2
}, {
  type: 'list',
  name: '商品',
  //anchor: 9, // or line 9
  anchor: '--',
  pos: [4], // line 4 column 0 after anchor
  end: '--',
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
}];

var parser = new Parser(schema);
var data = fs.readFileSync(path.resolve(__dirname, "receipt_1.txt"), "utf8").replace(/\\r\\n/g, '\n');
console.log(parser.parse(data));
