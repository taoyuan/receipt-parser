'use strict';

var fs = require('fs');
var path = require('path');

exports.receipt = {
  text: fs.readFileSync(path.resolve(__dirname, "fixtures/receipt.txt"), "utf8"),
  expected: {
    '序号': '1602061110170068',
    '日期': '2016-02-06 16:20',
    '收银员编号': 1110045,
    '收银员姓名': '张惠茜',
    '收银机号': '标准收银台17',
    '原价金额': 311.45,
    '应付金额': 295.88,
    '大写金额': '贰佰玖拾伍元捌角捌分',
    '实收': 300,
    '找零': 4.1,
    '会员卡号': '60000210310',
    '本次积分': 2,
    '累计积分': 3911,
    '商品': [{
      '编号': '101020200126',
      '名称': '木府土司饼干型牛肉',
      '原价': 168,
      '折扣': 0.05,
      '单价': 159.6,
      '柜组': '2310033号柜（',
      '数量': 0.336,
      '金额': 53.63
    },
      {
        '编号': '101020200063',
        '名称': '五香卤汁牛肉',
        '原价': 35,
        '折扣': 0.05,
        '单价': 33.25,
        '柜组': '2310033号柜（',
        '数量': 1,
        '金额': 33.25
      },
      {
        '编号': '101020100105',
        '名称': '320g 青稞酥',
        '原价': 25,
        '折扣': 0.05,
        '单价': 23.75,
        '柜组': '2310011号柜（',
        '数量': 4,
        '金额': 95
      },
      {
        '编号': '101020400122',
        '名称': '美味鸡枞',
        '原价': 15,
        '折扣': 0.05,
        '单价': 14.25,
        '柜组': '2310045号柜（',
        '数量': 4,
        '金额': 57
      },
      {
        '编号': '101020400123',
        '名称': '美味牛肝菌',
        '原价': 15,
        '折扣': 0.05,
        '单价': 14.25,
        '柜组': '2310045号柜（',
        '数量': 4,
        '金额': 57
      }]
  },
  // object cols
  schema1: [{
    name: '序号',
    // anchor: '本机流水',
    anchor: 4, // line 4
    pos: 2
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
    pos: 2,
    lex: [0, 2] // test for lex [index, count]
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
    anchor: '--',
    end: '--',
    pos: [4], // line 4 after anchor
    cols: {
      编号: [0, 0],
      名称: [[0, 1], -1, ' '], // or [0, 1, -1, ' ']
      原价: {
        type: 'number',
        pos: [1, 0]
      },
      折扣: {
        type: 'number',
        pos: [1, 1]
      },
      单价: {
        type: 'number',
        pos: [1, 2]
      },
      柜组: [2, 0],
      数量: {
        type: 'number',
        pos: [2, 1]
      },
      金额: {
        type: 'number',
        pos: [2, 2]
      }
    }
  }],
  // array cols
  schema2: [{
    name: '序号',
    anchor: '本机流水',
    pos: 2
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
    anchor: '--',
    pos: [4], // line 4 after anchor
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
  }]
};
