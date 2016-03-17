
var Promise = require('native-or-lie'),
    tick = require('./tick');

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
