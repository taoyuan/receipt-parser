'use strict';

var fs = require('fs');
var Parser = require('../..');

var schema = [{
  name: '序号',
  tag: '本机流水',
  pos: 2
}, {
  //type: 'date',
  name: '日期',
  tag: '销售日期',
  pos: [2, 2, ' ']
}, {
  type: 'number',
  name: '收银员编号',
  tag: '收银员',
  pos: 2
}, {
  name: '收银员姓名',
  tag: '收银员',
  pos: 3
}, {
  name: '收银机号',
  tag: '收银机号',
  pos: 2
}, {
  type: 'number',
  name: '原价金额',
  tag: '原价金额',
  pos: 2
}, {
  type: 'number',
  name: '应付金额',
  tag: '应付金额',
  pos: 2
}, {
  name: '大写金额',
  tag: '大写金额',
  pos: 2
}, {
  type: 'number',
  name: '实收',
  tag: '实收',
  pos: 2
}, {
  type: 'number',
  name: '找零',
  tag: '找零',
  pos: 2
}, {
  name: '会员卡号',
  tag: '会员卡号',
  pos: 2
}, {
  type: 'number',
  name: '本次积分',
  tag: '本次积分',
  pos: 2
}, {
  type: 'number',
  name: '累计积分',
  tag: '累计积分',
  pos: 2
}, {
  type: 'list',
  name: '商品',
  tag: '--',
  end: '--',
  skip: 14,
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
var data = fs.readFileSync("receipt_3.txt", "utf8").replace(/\\r\\n/g, '\n');
console.log(parser.parse(data));
