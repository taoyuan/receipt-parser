'use strict';

var util = require('util');
var _ = require('lodash');
var upcast = require('../upcast');

module.exports = function (options) {

  var cols = [], def;
  _.forEach(options.cols, function (value, name) {
    def = normalize(value);
    def.name = def.name || name;
    cols.push(def);
  });

  return function (context) {
    var token = options.anchor ? context.find(options.anchor) : 0;
    var from = _.isNumber(token) ? token : token.index;
    // if (options.skip) from += options.skip;
    if (options.pos) {
      token = context.move(options.pos, from);
      if (!token) throw new Error('Can not move to ' + util.inspect(options.pos) + ' from ' + from);
      from = token.index;
    }

    token = context.find(options.end, from);
    var end = token.index;

    var obj = [], result, item, next, n;
    var i = from;
    while (i < end) {
      next = i;
      item = {};
      n = 0;
      _.forEach(cols, function (options) {
        result = context.fetch(i, options.pos, options.lex);
        // get max position
        next = Math.max(next, (result && result.next) || 0);
        // exit if fetch null or over the end of list
        if (!result || next > end) {
          return false;
        }
        // set property
        item[options.name] = upcast.to(result.text, options.type || 'string');
        n++;
        // exit if reached the end of list
        if (next === end) {
          return false;
        }
      });
      // exit if over the end of list
      if (!result || !result.next || result.next > end || n < cols.length) {
        break;
      }
      i = next;
      obj.push(item);
    }

    context.set(options.name, obj);

    return i;
  }

};

function normalize(options) {
  if (Array.isArray(options) || _.isNumber(options)) {
    options = {
      pos: options
    }
  }
  if (_.isNumber(options.pos)) {
    options.pos = [options.pos];
  }
  var pos = options.pos;
  if (pos.length < 2) pos[1] = 1;
  return options;
}
