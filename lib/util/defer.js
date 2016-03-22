
var Promise = require('promise/lib/es6-extensions'),
    tick = require('./tick');

/**
 * A very simple Deferred object that's extended to include notify/progress methods. This is mostly for internal use, but it's there if you need it.
 * @static
 * @memberof plonk
 * @name defer
 * @returns {deferred}
 * @example
 * function async () {
 *   var def = plonk.defer();
 *   setTimeout(function () { def.notify(1); }, 1);
 *   setTimeout(function () { def.resolve(10) }, 10);
 *   return def.promise; // a native Promise
 * }
 * async()
 *   .progress(function (val) {
 *     console.log(val);
 *     // => 1
 *   })
 *   .then(function (val) {
 *     console.log(val);
 *     // => 10
 *   });
 */
module.exports = function () {
  var _progressHandlers = [], _resolveHandler, _rejectHandler,
      _isResolved = false;

  var defer = {
    resolve: function (val) {
      if (_isResolved) return;
      _resolveHandler && _resolveHandler(val);
      _isResolved = true;
    },
    reject: function (val) {
      if (_isResolved) return;
      _rejectHandler && _rejectHandler(val);
      _isResolved = true;
    },
    notify: function (val) {
      if (_isResolved) return;
      tick(function () {
        for (var i = 0; i < _progressHandlers.length; i++) {
          _progressHandlers[i](val);
        }
      });
    },
    promise: new Promise(function (resolve, reject) {
      _resolveHandler = resolve;
      _rejectHandler = reject;
    })
  };

  defer.promise.progress = function (callback) {
    if (_isResolved) return defer.promise;
    if (typeof callback === 'function') {
      _progressHandlers.push(callback);
    }
    return defer.promise;
  };

  return defer;
};
