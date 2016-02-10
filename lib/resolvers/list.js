'use strict';

var _ = require('lodash');
var upcast = require('../upcast');

module.exports = function (options) {

  var cols = _.transform(options.cols, function (result, value, name) {
    result[name] = normalize(value);
  }, {});

  return function (context) {
    var token = options.tag ? context.find(options.tag) : 0;
    var from = _.isNumber(token) ? token : token.index;
    if (options.skip) from += options.skip;
    token = context.find(options.end, from);
    var end = token.index;

    var obj = [], result, item, last;
    var i = from;
    while (i < end) {
      last = i;
      item = {};
      _.forEach(cols, function (options, name) {
        result = context.fetch(i, options.pos);
        // get max position
        last = Math.max(last, (result && result.index) || 0);
        // exit if fetch null or over the end of list
        if (!result || last > end) {
          return false;
        }
        // set property
        item[name] = upcast.to(result.text, options.type || 'string');
        // exit if reached the end of list
        if (last === end) {
          return false;
        }
      });
      // exit if over the end of list
      if (!result || !result.index || result.index > end) {
        break;
      }
      i = last;
      obj.push(item);
    }
    context.set(options.name, obj);
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
