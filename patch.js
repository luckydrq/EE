'use strict';

var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var indexOf = require('array-index-of');

EventEmitter.prototype.listenTo = function(target, events, callback) {
  return this._addListener(false, target, events, callback);
};

EventEmitter.prototype.delegate = function(target, events, callback) {
  return this._addListener(true, target, events, callback);
};

EventEmitter.prototype.stopListening =
EventEmitter.prototype.undelegate = function(target, events) {
  if (!events) {
    return target._removeEvent(this, events);
  }

  if (typeof events === 'string') {
    events = [events];
  }
  assert(Array.isArray(events), '`events` should be array');
  events.forEach(function(evt) {
    return target._removeEvent(this, evt);
  }, this);

  return this;
};

EventEmitter.prototype._addListener = function(isEmit, target, events, callback) {
  if (!(target instanceof EventEmitter)) {
    return this;
  }
  target = require('./index').patch(target);

  if (typeof events === 'string') {
    events = [events];
  }
  assert(Array.isArray(events), '`events` should be array');

  // add to delegator list
  events.forEach(function(evt) {
    target._addEvent(isEmit, this, evt, callback);
  }, this);

  return this;
};

EventEmitter.prototype._addEvent = function(isEmit, listener, evt, callback) {
  if (!this._listeners[evt]) {
    this._listeners[evt] = [{
      listener: listener,
      callback: callback
    }];
    this.on(evt, function() {
      var args = Array.prototype.slice.call(arguments);
      this._listeners[evt].forEach(function(pair) {
        var listener = pair.listener;
        var callback = pair.callback;
        if (typeof callback === 'function') {
          process.nextTick(function() {
            callback.apply(listener, args);
          });
        }
        if (isEmit) {
          process.nextTick(function() {
            listener.emit.apply(listener, [evt].concat(args));
          });
        }
      });
    }.bind(this));
  } else {
    var pairs = this._listeners[evt];
    var index = indexOf(pairs, listener, function(p) {
      return p.listener === listener;
    });
    if (index === -1) {
      pairs.push({
        listener: listener,
        callback: callback
      });
    }
  }

  return this;
};

EventEmitter.prototype._removeEvent = function(listener, evt) {
  if (!evt) {
    // remove all
    Object.keys(this._listeners).forEach(function(e) {
      removePair(this._listeners[e], listener);
    }, this);
  } else {
    removePair(this._listeners[evt], listener);
  }

  function removePair(pairs, listener) {
    var index = indexOf(pairs, listener, function(pair) {
      return pair.listener === listener;
    });
    if (index !== -1) {
      pairs.splice(index, 1);
    }
  }

  return this;
};
