'use strict';

var _ = require('lodash');
var tokenizee = require('tokenizee');
var Tokenizer = tokenizee.Tokenizer;
var Context = require('./context');

function Parser(schema) {
  this.lexer = this.createLexer();
  this.resolvers = this.build(schema);
}

Parser.prototype.createLexer = function () {
  var lexer = new Tokenizer();

  lexer.rule(/(\d{4}|\d{2})[-./](\d{2})[-./](\d{4}|\d{2})/, function (ctx, match) {
    ctx.accept("date")
  });

  lexer.rule(/(\d{2}:\d{2}:\d{2})|(\d{2}:\d{2})/, function (ctx, match) {
    ctx.accept("time")
  });

  lexer.rule(/[\-\*=]+/, function (ctx, match) {
    ctx.accept("separator")
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
    ctx.accept("char")
  });

  lexer.rule(/[\r\n]+/, function (ctx, match) {
    ctx.accept("EOL");
  });

  return lexer;
};

Parser.prototype.build = function (definitions) {
  return _.map(definitions, function (def) {
    if (def.type === 'list') {
      return require('./resolvers/list')(def);
    } else {
      return require('./resolvers/primitive')(def);
    }
  });
};

Parser.prototype.tokenize = function (text, mode2d) {
  var tokens = this.lexer.input(text).tokens();
  var result = [], line = 0, index = 0;
  var list = result, last;
  _.forEach(tokens, function (token) {
    if (token.type === 'EOL') {
      if (last) {
        last.eol = true; // mark last token if line to end of line
      }
      line++;
      return;
    }
    token.index = index++;

    if (mode2d) {
      if (!result[line]) {
        result[line] = [];
      }
      list = result[line];
    }

    list.push(token);
    last = token;
  });

  return result;
};

Parser.prototype.parse = function (text) {
  var tokens = this.tokenize(text);
  var context = new Context(tokens);
  _.forEach(this.resolvers, function (resolve) {
    resolve(context);
  });
  return context.result;
};

module.exports = Parser;
