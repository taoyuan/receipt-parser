'use strict';

var util = require('util');
var upcast = require('../upcast');

module.exports = function (options) {
  return function (context) {
    var token = options.anchor ? context.find(options.anchor) : 0;
    var result = context.fetch(token, options.pos, options.lex);
    if (!result) {
      throw new Error('Can not fetch for ' + util.inspect(options) + ' from token ' + token);
    }
    context.set(options.name || options.anchor, upcast.to(result.text, options.type || 'string'));
    return result.next;
  }
};
