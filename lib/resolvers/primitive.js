'use strict';

var upcast = require('../upcast');

module.exports = function (options) {
  return function (context) {
    var token = options.tag ? context.find(options.tag) : 0;
    var result = context.fetch(token, options.pos);
    context.set(options.name || options.tag, upcast.to(result.text, options.type || 'string'));
  }
};
