'use strict';

require('./patch');

// patch EventEmitter
exports.patch = function(ee) {
  if (!ee._listeners) {
    ee._listeners = {};
  }
  return ee;
};
