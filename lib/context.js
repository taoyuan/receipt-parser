'use strict';

var _ = require('lodash');

module.exports = Context;

function Context(tokens) {
  if (!(this instanceof Context)) {
    return new Context(tokens);
  }
  this.tokens = tokens;
  this.result = {};
}

Context.prototype.find = function (tag, from) {
  var tokens = this.tokens;
  var length = tokens.length;

  from = from || 0;

  if (from > length) return;

  for (var i = from; i < length; i++) {
    if (_.startsWith(tokens[i].text, tag)) {
      return tokens[i];
    }
  }

  throw new Error('Can not find tag "' + tag + '" from index ' + from);
};

Context.prototype.fetch = function (indexOrToken, pos) {
  var base = _.isNumber(indexOrToken) ? indexOrToken : indexOrToken.index;

  var from, count, separator, i, index;

  if (_.isNumber(pos)) {
    pos = [pos];
  }

  if (Array.isArray(pos)) {
    separator = pos[2];
    count = pos[1];
    from = pos[0];
  }

  from = Array.isArray(from) ? from : [0, from];
  for (i = from.length; i < 2; i++) {
    from[i] = 0;
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

  return {
    index: index,
    text: text
  };
};

Context.prototype.set = function (name, value) {
  this.result[name] = value;
};
