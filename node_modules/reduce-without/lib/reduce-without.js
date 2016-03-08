'use strict'
var testValue = require('test-value')

/**
 * @module reduce-without
 */
 module.exports = without

/**
 * Returns a new array with the same content as the input minus the specified values. It accepts the same query syntax as {@link module:array-tools.where}.
 *
 * @param {Array} - the input array
 * @param {any | any[]} - one, or more queries
 * @returns {Array}
 * @example
 * > a.without([ 1, 2, 3 ], 2)
 * [ 1, 3 ]
 *
 * > a.without([ 1, 2, 3 ], [ 2, 3 ])
 * [ 1 ]
 *
 * > data = [
 *     { name: "Dana", age: 30 },
 *     { name: "Yana", age: 20 },
 *     { name: "Zhana", age: 10 }
 * ]
 * > a.without(data, { name: /ana/ })
 * []
 *
 * @alias module:reduce-without
 */
function without (toRemove) {
  return function (prev, curr) {
    if (!Array.isArray(prev)) {
      prev = !testValue(prev, toRemove)
        ? [ prev ]
        : []
    }
    if (!testValue(curr, toRemove)) prev.push(curr)
    return prev
  }
}
