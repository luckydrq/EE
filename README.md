# EE
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Enhance node's EventEmitter.

## Install
`$ npm install power-ee`

## Example
You can see the [test cases](https://github.com/luckydrq/EE/blob/master/test/ee.test.js).

## Api

### listenTo(target, events[, callback])
- target(EventEmitter): required
- events(String|Array): required
- callback(Function): optional. Called each time the event of the list
  emitted.

### delegate(target, events[, callback])
- target(EventEmitter): required
- events(String|Array): required
- callback(Function): optional. Called each time the event of the list
  emitted.

** Note: The difference between #delegate and #listenTo is that the
  source ee object will emit the same event as the target just emits. **

### undelegate(target[, events])
** alias: stopListening **
- target(EventEmitter): required
- events(String|Array): optional. If omitted, all the events related
  will be removed.

## Lisence
MIT

[npm-image]: https://img.shields.io/npm/v/power-ee.svg?style=flat-square
[npm-url]: https://npmjs.org/package/power-ee
[travis-image]: https://img.shields.io/travis/luckydrq/EE/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/luckydrq/EE
[coveralls-image]: https://img.shields.io/coveralls/luckydrq/EE/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/luckydrq/EE?branch=master
