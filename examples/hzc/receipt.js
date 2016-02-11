'use strict';

var fs = require('fs');
var path = require('path');
var Parser = require('../..');

var schema = [{
  name: '序号',
  origin: '本机流水',
  pos: 2
}, {
  //type: 'date',
  name: '日期',
  origin: '销售日期',
  pos: [2, 2, ' ']
}, {
  type: 'number',
  name: '收银员编号',
  origin: '收银员',
  pos: 2
}, {
  name: '收银员姓名',
  origin: '收银员',
  pos: 3
}, {
  name: '收银机号',
  origin: '收银机号',
  pos: 2
}, {
  type: 'number',
  name: '原价金额',
  origin: '原价金额',
  pos: 2
}, {
  type: 'number',
  name: '应付金额',
  origin: '应付金额',
  pos: 2
}, {
  name: '大写金额',
  origin: '大写金额',
  pos: 2
}, {
  type: 'number',
  name: '实收',
  origin: '实收',
  pos: 2
}, {
  type: 'number',
  name: '找零',
  origin: '找零',
  pos: 2
}, {
  name: '会员卡号',
  origin: '会员卡号',
  pos: 2
}, {
  type: 'number',
  name: '本次积分',
  origin: '本次积分',
  pos: 2
}, {
  type: 'number',
  name: '累计积分',
  origin: '累计积分',
  pos: 2
}, {
  type: 'list',
  name: '商品',
  origin: '--',
  skip: 14,
  //origin: 9,
  end: '--',
  cols: {
    编号: [[0, 0]],
    名称: [[0, 1], -1, ' '],
    原价: {
      type: 'number',
      pos: [[1, 0]]
    },
    折扣: {
      type: 'number',
      pos: [[1, 1]]
    },
    单价: {
      type: 'number',
      pos: [[1, 2]]
    },
    柜组: [[2, 0]],
    数量: {
      type: 'number',
      pos: [[2, 1]]
    },
    金额: {
      type: 'number',
      pos: [[2, 2]]
    }
  }
}];

var parser = new Parser(schema);
var data = fs.readFileSync(path.resolve(__dirname, "receipt_1.txt"), "utf8").replace(/\\r\\n/g, '\n');
console.log(parser.parse(data));
