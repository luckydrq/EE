'use strict';

var assert = require('assert');
var EE = require('events').EventEmitter;
var patch = require('..').patch;

describe('EE test', function() {
  it('should patch EventEmitter', function() {
    var ee = new EE();
    assert.equal(typeof ee.delegate, 'function');
    assert.equal(typeof ee.listenTo, 'function');
    assert.equal(typeof ee.undelegate, 'function');
    assert.equal(typeof ee.stopListening, 'function');
  });

  it('should delegate', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();
    var ee3 = new EE();

    ee1.delegate(ee2, ['hi', 'hello']);
    ee3.delegate(ee2, 'hi');
    ee1.on('hi', function(msg) {
      assert.equal(msg, 'luckydrq');
    });
    ee1.on('hello', function(msg) {
      assert.equal(msg, 'world');
      done();
    });
    ee3.on('hi', function(msg) {
      assert.equal(msg, 'luckydrq');
    });

    ee2.emit('hi', 'luckydrq');
    ee2.emit('hello', 'world');
  });

  it('should callback async', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();
    var i = 0;

    ee1.delegate(ee2, 'hi', function() {
      assert.equal(i, 1);
      done();
    });
    ee2.emit('hi', 'luckydrq');
    ++i;
  });

  it('should emit async', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();
    var i = 0;

    ee1.delegate(ee2, 'hi');
    ee1.on('hi', function() {
      assert.equal(i, 1);
      done();
    });
    ee2.emit('hi', 'luckydrq');
    ++i;
  });

  it('should delegate with callback', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();

    var emitCount = 0;
    var callbackCount = 0;
    ee1.delegate(ee2, 'hi', function(msg) {
      assert.equal(msg, 'luckydrq');
      callbackCount++;
    });
    ee1.on('hi', function(msg) {
      assert.equal(msg, 'luckydrq');
      emitCount++;
      if (emitCount === 2 && callbackCount === 2) {
        done();
      }
    });
    ee2.emit('hi', 'luckydrq');
    ee2.emit('hi', 'luckydrq');
  });

  it('should listenTo', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();

    ee1.listenTo(ee2, 'hi', function(msg) {
      assert.equal(msg, 'luckydrq');
      done();
    });
    ee1.on('hi', function() {
      // will not trigger
      done();
    });
    ee2.emit('hi', 'luckydrq');
  });

  it('should listenTo with callback', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();

    var callbackCount = 0;
    ee1.listenTo(ee2, 'hi', function(msg) {
      assert.equal(msg, 'luckydrq');
      callbackCount++;
      if (callbackCount === 2) {
        done();
      }
    });
    ee2.emit('hi', 'luckydrq');
    ee2.emit('hi', 'luckydrq');
  });

  it('should undelegate or stopListening', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();

    ee1.delegate(ee2, ['hi', 'hello']);
    ee1.on('hi', function(msg) {
      // will not trigger
      done();
    });
    ee1.on('hello', function(msg) {
      assert.equal(msg, 'world');
      done();
    });
    ee1.undelegate(ee2, 'hi');
    ee2.emit('hi', 'luckydrq');
    ee2.emit('hello', 'world');
  });

  it('should undelegate all', function(done) {
    var ee1 = new EE();
    var ee2 = new EE();

    ee1.delegate(ee2, ['hi', 'hello']);
    ee1.undelegate(ee2);
    ee1.on('hi', function() {
      // will never come here
      done();
    });
    ee1.on('hello', function() {
      // will never come here
      done();
    });
    ee2.emit('hi');
    ee2.emit('hello');
    setTimeout(function() {
      done();
    }, 500);
  });

  it('should patch', function() {
    var ee = new EE();
    ee = patch(ee);
    assert(ee instanceof EE);
    assert(ee._listeners);
  });

  it('should return when delegate obj is not an instance of EventEmitter', function() {
    var ee1 = new EE();
    ee1.delegate({}, 'hi');
  });
});
