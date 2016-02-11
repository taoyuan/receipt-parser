'use strict';

var _ = require('lodash');
var lexers = require('./lexers');
var Context = require('./context');

function Parser(schema) {
  this.resolvers = this.build(schema);
}

Parser.prototype.build = function (definitions) {
  return _.map(definitions, function (def) {
    if (def.type === 'list') {
      return require('./resolvers/list')(def);
    } else {
      return require('./resolvers/primitive')(def);
    }
  });
};

/**
 * Tokenize a string
 *
 * @param {String} text The text to tokenize
 * @param {Boolean} [line] Using line lexer to tokenize
 * @returns {Array|*}
 */
Parser.prototype.tokenize = function (text, line) {
  var lexer = line ? lexers.lineLexer : lexers.receiptLexer;
  var tokens = lexer.input(text).tokens();

  var result, list, last, index = 0;

  result = list = [];
  _.forEach(tokens, function (token) {
    if (token.type === 'EOL' || token.type === 'EOF') {
      if (last) {
        if (token.type === 'EOL') {
          last.eol = true; // mark last token if line to end of line
        }
        if (token.type === 'EOF') {
          last.eof = true;
        }
      }
      return;
    }
    token.index = index++;
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
