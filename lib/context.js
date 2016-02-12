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

Context.prototype.move = function (pos, from) {

  if (_.isNumber(pos)) {
    pos = [0, pos];
  }

  if (Array.isArray(pos[0])) pos = pos[0];

  if (pos.length < 2) pos[1] = 0;
  from = from || 0;

  // find start index
  var tokens = this.tokens;
  var lines = 0, columns = 0, i;
  for (i = from; i < tokens.length; i++) {
    if (lines === pos[0] && columns === pos[1]) {
      break;
    } else if (lines > pos[0] || (lines === pos[0] && columns > pos[1])) {
      throw new Error('Can not move to (' + pos[0] + ', ' + pos[1] + ') from ' + tokens[from]);
    } else {
      if (tokens[i].eol) {
        lines++;
        columns = 0;
      } else {
        columns++;
      }
    }
  }
  if (i >= tokens.length) {
    throw new Error('Can not move to (' + pos[0] + ', ' + pos[1] + ') from ' + tokens[from]);
  }
  return tokens[i];
};

Context.prototype.fetch = function (indexOrToken, pos, lex) {
  var base = _.isNumber(indexOrToken) ? indexOrToken : indexOrToken.index;

  var from, count, separator, index, i;

  if (_.isNumber(pos)) {
    pos = [0, pos];
  }

  if (Array.isArray(pos)) {
    if (Array.isArray(pos[0])) {
      from = pos[0];
      i = 1;
    } else {
      from = pos.slice(0, Math.min(2, pos.length));
      i = 2;
    }
    count = pos[i++];
    separator = pos[i];
  }

  if (from.length < 2) from[1] = 0; // default column 0

  count = count || 1;
  separator = separator || '';

  var tokens = this.tokens;
  index = this.move(pos, base).index;

  var text = '', token;
  while (count) {
    if (count > 0) count--;

    if (text.length > 0) {
      text += separator;
    }
    token = tokens[index++];
    text += token.text;
    if (count < 0 && token.eol) break;
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
          text += lex[2];
        }
      }
    }
  }

  return {
    next: index,
    text: text
  };
};

Context.prototype.set = function (name, value) {
  this.result[name] = value;
};
