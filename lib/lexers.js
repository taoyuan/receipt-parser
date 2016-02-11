'use strict';

var Tokenizer = require('tokenizee').Tokenizer;

function createReceiptLexer() {
  var lexer = new Tokenizer();

  lexer.rule(/(\d{4}|\d{2})[-./](\d{2})[-./](\d{4}|\d{2})/, function (ctx, match) {
    ctx.accept("date");
  });

  lexer.rule(/(\d{2}:\d{2}:\d{2})|(\d{2}:\d{2})/, function (ctx, match) {
    ctx.accept("time");
  });

  lexer.rule(/[\-\*=]+/, function (ctx, match) {
    ctx.accept("separator");
  });

  // ":" 或中文 "：" 即 \uff1a
  lexer.rule(/[^ \t\r\n:\uff1a]+/, function (ctx, match) {
    ctx.accept('text');
  });

  // comment like // something comments \r\n
  lexer.rule(/\/\/[^\r\n]+\r?\n/, function (ctx, match) {
    ctx.ignore();
  });

  lexer.rule(/[ \t]+/, function (ctx, match) {
    ctx.ignore();
  });

  lexer.rule(/./, function (ctx, match) {
    ctx.accept("char");
  });

  lexer.rule(/[\r\n]+/, function (ctx, match) {
    ctx.accept("EOL");
  });

  return lexer;
}

function createLineLexer() {
  var lexer = new Tokenizer();

  lexer.rule(/(\d{4}|\d{2})[-./](\d{2})[-./](\d{4}|\d{2})/, function (ctx, match) {
    ctx.accept("date")
  });

  lexer.rule(/(\d{2}:\d{2}:\d{2})|(\d{2}:\d{2})/, function (ctx, match) {
    ctx.accept("time");
  });

  lexer.rule(/[+-]?[0-9]+/, function (ctx, match) {
    ctx.accept("number");
  });

  lexer.rule(/[\u4e00-\u9fa5]+/, function (ctx, match) {
    ctx.accept("text");
  });

  lexer.rule(/[a-zA-Z]+/, function (ctx, match) {
    ctx.accept("word");
  });

  lexer.rule(/[ \t]+/, function (ctx, match) {
    ctx.ignore();
  });

  lexer.rule(/./, function (ctx, match) {
    ctx.accept("char");
  });

  lexer.rule(/[\r\n]+/, function (ctx, match) {
    ctx.accept("EOL");
  });

  return lexer;
}

module.exports = {
  createReceiptLexer: createReceiptLexer,
  createLineLexer: createLineLexer,
  receiptLexer: createReceiptLexer(),
  lineLexer: createLineLexer()
};

