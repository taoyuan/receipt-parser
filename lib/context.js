'use strict';

var _ = require('lodash');
var lexers = require('./lexers');

module.exports = Context;

function Context(tokens) {
  if (!(this instanceof Context)) {
    return new Context(tokens);
  }
  this.tokens = tokens;
  this.result = {};
}

/**
 * Find tag or line token from `from` index
 *
 * @param {String|Number} anchor The tag or line to find
 * @param from
 * @returns {*}
 */
Context.prototype.find = function (anchor, from) {
  var tokens = this.tokens;
  var length = tokens.length;
  var i;

  from = from || 0;

  if (from > length) return;

  if (_.isString(anchor)) {
    for (i = from; i < length; i++) {
      if (_.startsWith(tokens[i].text, anchor)) {
        return tokens[i];
      }
    }
  } else if (_.isNumber(anchor)) {
    for (i = from; i < length; i++) {
      if (anchor === 0) {
        return tokens[i];
      }
      if (tokens[i].eol) {
        anchor--;
      }
    }
  }

  throw new Error('Can not find anchor ' + anchor + ' from index ' + from);
};

Context.prototype.fetch = function (indexOrToken, pos, lex) {
  var base = _.isNumber(indexOrToken) ? indexOrToken : indexOrToken.index;

  var from, count, separator, i, index;

  if (_.isNumber(pos)) {
    pos = [0, pos];
  }

  if (Array.isArray(pos)) {
    if (Array.isArray(pos[0])) {
      from = pos[0];
      i = 1;
    } else {
      from = [pos[0], pos[1]];
      i = 2;
    }
    count = pos[i++];
    separator = pos[i];
  }

  count = count || 1;
  separator = separator || '';

  // find start index
  var tokens = this.tokens;
  var lines = 0, j = 0;
  for (i = base; i < tokens.length - 1; i++) {
    if (lines === from[0] && j === from[1]) {
      index = i;
      break;
    }
    if (tokens[i].eol) {
      lines++;
      j = 0;
    } else {
      j++;
    }
  }
  if (index === undefined) return;

  var text = '';
  while (count) {
    if (count > 0) count--;

    if (text.length > 0) text += separator;
    text += tokens[index].text;

    if (count < 0 && tokens[index].eol) break;

    index++;
  }

  // line lex
  if (text && !_.isUndefined(lex) && !_.isNull(lex)) {
    if (!Array.isArray(lex)) lex = [lex];
    if (lex.length < 2) lex[1] = 1;
    if (lex.length < 3) lex[2] = '';
    tokens = lexers.lineLexer.input(text).tokens();
    text = '';
    if (lex[0] < tokens.length) {
      if (lex[1] < 0) lex[1] = tokens.length;
      lex[1] = Math.min(lex[1], tokens.length);
      for (i = lex[0]; i < lex[0] + lex[1]; i++) {
        text += tokens[i].text;
        if (i < lex[0] + lex[1] - 1) {
          text += lex[3];
        }
      }
    }
  }

  return {
    index: index,
    text: text
  };
};

Context.prototype.set = function (name, value) {
  this.result[name] = value;
};
