
var plonk = require('../lib');
var Promise = require('native-or-lie');

var chai = require('chai');
chai.use(require("chai-as-promised"));
var should = chai.should();

describe('plonk', function () {

  describe('constrain', function () {
    it('should constrain the input value to be in min...max range', function () {
      plonk.should.have.property('constrain');
      plonk.constrain(1.987345, -1, 1).should.be.a('number')
        .and.at.least(-1)
        .and.at.most(1);
      plonk.constrain(-33.2, -1, 1).should.be.a('number')
        .and.at.least(-1)
        .and.at.most(1);
    });
  });

  describe('debounce', function () {
    it('should be a factory', function () {
      plonk.should.have.property('debounce');
      plonk.debounce(100).should.be.a('function');
    });
    it('should only execute the callback once, N milliseconds after the last call', function (done) {
      var n = 0;
      var debounced = plonk.debounce(100, function () { n++; });
      for (var i = 0; i < 10; i++) {
        plonk.tick(debounced);
      }
      setTimeout(function () {
        n.should.equal(1);
        done();
      }, 200);
    });
    it('should should take an optional time argument', function (done) {
      var n = 0;
      var debounced = plonk.debounce(function () { n++; });
      for (var i = 0; i < 10; i++) {
        plonk.tick(debounced);
      }
      setTimeout(function () {
        n.should.equal(1);
        done();
      }, 200);
    });
  });

  describe('defer', function () {
    it('should return a wrapper around Promise with resolve, reject, and notify methods', function () {
      plonk.should.have.property('defer');
      var def = plonk.defer();
      def.should.be.a('object');
      def.should.have.property('resolve').that.is.a('function');
      def.should.have.property('reject').that.is.a('function');
      def.should.have.property('notify').that.is.a('function');
      def.promise.should.be.an.instanceof(Promise);
      def.promise.should.have.property('progress');
      def.promise.progress.should.be.a('function');
      def.promise.progress().should.equal(def.promise);
      setTimeout(function () {
        def.notify(50);
      }, 50);
      setTimeout(function () {
        def.resolve(100);
      }, 100);
      def.promise.progress(function (val) {
        val.should.equal(50);
      });
      return def.promise.should.eventually.equal(100);
    });
  });

  describe('delay', function () {
    it('should be a timer that returns a promise', function () {
      plonk.should.have.property('delay');
      plonk.delay(10, function (time, i, stop) { stop(); }).should.be.an.instanceof(Promise);
      var start = plonk.now();
      return plonk.delay(10, function (time, i, stop) {
        Math.round(plonk.now()).should.be.at.least(Math.round(start + 10));
        stop();
      });
    });
    it('should pass a stop function, delay time, and iteration count into the tick callback', function () {
      return plonk.delay(Math.random() * 100, function (time, i, stop) {
        time.should.be.a('number');
        Math.round(time).should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(120);
        i.should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(2);
        stop.should.be.a('function');
        if (i === 2) stop();
        return Math.random() * 100;
      }).should.eventually.be.a('number');
    });
    it('should update the next interval with the tick function return value', function () {
      return plonk.delay(10, function (time, i, stop) {
        if (i === 1) stop(time);
        return 20;
      }).should.eventually.be.at.least(30);
    });
  });

  describe('drunk', function () {
    it('should be a factory', function () {
      plonk.should.have.property('drunk');
      plonk.drunk(-1, 1).should.be.a('function');
    });
    it('should return a random number in min...max range', function () {
      var drunk = plonk.drunk(-1, 1);
      for (var i = 0; i < 100; i++) {
        drunk().should.be.a('number')
          .and.at.least(-1)
          .and.at.most(1);
      }
    });
    it('should accept 0-2 arguments', function () {
      var drunk = plonk.drunk(20);
      for (var i = 0; i < 100; i++) {
        drunk().should.be.a('number')
          .and.at.least(0)
          .and.at.most(20);
      }
    });
  });

  describe('dust', function () {
    it('should be a timer that returns a promise', function () {
      plonk.should.have.property('dust');
      plonk.dust(10, function (time, i, stop) { stop(); }).should.be.an.instanceof(Promise);
      var start = plonk.now();
      return plonk.dust(10, 100, function (time, i, stop) {
        plonk.now().should.be.above(start);
        stop();
      });
    });
    it('should pass a stop function, delay time, and iteration count into the tick callback', function () {
      return plonk.dust(10, 100, function (time, i, stop) {
        time.should.be.a('number')
          .and.be.at.least(10)
          .and.be.at.most(120);
        i.should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(2);
        stop.should.be.a('function');
        if (i === 2) stop();
      }).should.eventually.be.a('number');
    });
  });

  describe('env', function () {
    it('should interpolate between value and target over time', function () {
      plonk.should.have.property('env');
      return plonk.env(0, 1, 100)
        .progress(function (val) {
          val.should.be.a('number')
            .and.be.at.least(0)
            .and.be.at.most(1);
        })
        .should.eventually.equal(1);
    });
  });

  describe('exp', function () {
    it('should exponentially map a number in 0...1 range by eulers constant', function () {
      plonk.should.have.property('exp');
      plonk.exp(0).should.be.a('number').and.equal(0);
      plonk.exp(0.5).should.be.a('number').and.equal(0.15195522325791297);
      plonk.exp(1).should.be.a('number').and.equal(1);
      plonk.exp(-3.12).should.be.a('number').and.equal(0);
    });
  });

  describe('frames', function () {
    it('should be a wrapper for requestAnimationFrame that returns a promise', function () {
      plonk.should.have.property('frames');
      var start = plonk.now();
      return plonk.frames(function (interval, elapsed, i, stop) {
        if (i === 2) stop();
      })
      .progress(function (interval) {
        interval.should.be.a('number');
      })
      .then(function (elapsed) {
        elapsed.should.be.a('number');
      });
    });
    it('should pass the frame interval time, elapsed running time, iteration count, and stop function into the tick callback', function () {
      var frameRate = 60,
          start = plonk.now();
      return plonk.frames(frameRate, function (interval, elapsed, i, stop) {
        Math.floor(interval).should.be.a('number')
          .and.be.at.least(interval - start);
        Math.floor(elapsed).should.be.a('number')
          .and.be.at.least(elapsed - start);
        i.should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(10);
        stop.should.be.a('function');
        if (i === 10) stop();
      });
    });
  });

  describe('metro', function () {
    it('should be a wrapper for setInterval that returns a promise', function () {
      plonk.should.have.property('metro');
      plonk.metro(10, function (interval, i, stop) { stop(); }).should.be.an.instanceof(Promise);
      var start = plonk.now();
      return plonk.metro(10, function (interval, i, stop) {
        plonk.now().should.be.above(start + 9);
        stop();
      });
    });
    it('should pass a stop function, interval time, and iteration count into the tick callback', function () {
      return plonk.metro(10, function (interval, i, stop) {
        interval.should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(20);
        i.should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(2);
        stop.should.be.a('function');
        if (i === 2) stop(i);
        return i;
      }).should.eventually.equal(2);
    });
  });

  describe('now', function () {
    it('should be a fallback for performance.now and return a number', function (done) {
      plonk.should.have.property('now');
      plonk.now().should.be.a('number');
      var start = plonk.now();
      setTimeout(function () {
        plonk.now().should.be.above(start + 9);
        done();
      }, 10);
    });
  });

  describe('rand', function () {
    it('should return a random number in min...max range', function () {
      plonk.should.have.property('rand');
      for (var i = 0; i < 100; i++) {
        plonk.rand(-1, 1).should.be.a('number')
          .and.at.least(-1)
          .and.at.most(1);
      }
    });
    it('should accept 0-2 arguments', function () {
      /*jshint -W004 */
      for (var i = 0; i < 100; i++) {
        plonk.rand().should.be.a('number')
          .and.at.least(0)
          .and.at.most(1);
      }
      for (var i = 0; i < 100; i++) {
        plonk.rand(30).should.be.a('number')
          .and.at.least(0)
          .and.at.most(30);
      }
    });
  });

  describe('scale', function () {
    it('should be a linear map of input value from input range to output range', function () {
      plonk.should.have.property('scale');
      plonk.scale(0.5, 0, 1, -1, 1).should.be.a('number')
        .and.equal(0);
      plonk.scale(-0.876234, -1, 1, 0, 32).should.be.a('number')
        .and.equal(1.9802560000000007);
      plonk.scale(0.32, -1, 1, -100, 0).should.be.a('number')
        .and.equal(-34);
      plonk.scale(3.5, -1, 1, 0, 1).should.be.a('number')
        .and.equal(1);
    });
  });

  describe('sine', function () {
    it('should be a sine LFO that returns a promise', function () {
      var n = 0;
      return plonk.sine(100, function (val, elapsed, total, stop) {
        n++;
        if (n === 2) {
          stop(0);
        }
      })
      .progress(function (val) {
        val.should.be.a('number');
      }).should.eventually.equal(0);
    });
    it('should pass sine value, elapsed cycle time, total running time, and stop function into the tick callback', function () {
      return plonk.sine(100, function (val, cycle, total, stop) {
        val.should.be.a('number')
          .and.be.at.least(-1)
          .and.be.at.most(1);
        cycle.should.be.a('number')
          .and.be.at.least(3)
          .and.be.at.most(150);
        total.should.be.a('number')
          .and.be.at.least(3)
          .and.be.at.most(150);
        stop.should.be.a('function');
        if (cycle >= 90) stop(0);
      }).should.eventually.equal(0);
    });
  });

  describe('tick', function () {
    it('should be a fallback for process.nextTick', function (done) {
      plonk.should.have.property('tick');
      var n = 0;
      [1,2,3,4].forEach(function (n) {
        plonk.tick(function () {
          n++;
          n.should.be.a('number').and.equal(n);
        });
      });
      n.should.be.a('number').and.equal(0);
      setTimeout(done, 50);
    });
  });

  describe('toMilliseconds', function () {
    it('should be aliased by .ms()', function () {
      plonk.should.have.property('toMilliseconds');
      plonk.should.have.property('ms');
      plonk.toMilliseconds.should.equal(plonk.ms);
    });
    it('should return default when input is null, undefined, or NaN', function () {
      plonk.toMilliseconds(null).should.equal(0);
      var n;
      plonk.toMilliseconds(n, 's', 10).should.equal(10);
      plonk.toMilliseconds('abc').should.equal(0);
    });
    it('should pass unformatted value to output when set to milliseconds format', function () {
      plonk.toMilliseconds(100).should.equal(100);
      plonk.toMilliseconds('66ms').should.equal(66);
    });
    it('should multiply input by 1000 when set to seconds format', function () {
      plonk.toMilliseconds(1, 's').should.equal(1000);
      plonk.toMilliseconds('1s').should.equal(1000);
      plonk.toMilliseconds('0.875s').should.equal(875);
      var s = Math.random() * 3;
      plonk.toMilliseconds(s, 's').should.equal(s * 1000);
    });
    it('should convert from hertz to milliseconds using (1 / hz) * 1000', function () {
      plonk.toMilliseconds('1hz').should.equal(1000);
      plonk.toMilliseconds('0.5hz').should.equal(2000);
      plonk.toMilliseconds(2, 'hz').should.equal(500);
    });
  });

  describe('toNumber', function () {
    it('should take any input value, return the value if a number, or default value otherwise', function () {
      var x;
      plonk.should.have.property('toNumber');
      plonk.toNumber(10).should.equal(10);
      plonk.toNumber('10').should.equal(10);
      plonk.toNumber(x, 10).should.equal(10);
      plonk.toNumber('a2').should.equal(0);
    });
  });

  describe('wait', function () {
    it('should be a wrapper for setTimeout that returns a promise', function () {
      plonk.should.have.property('wait');
      return plonk.wait(10).should.eventually.be.a('number');
    });
  });

  describe('walk', function () {
    it('should be a timer that returns a promise', function () {
      plonk.should.have.property('walk');
      plonk.walk(10, function (time, i, stop) { stop(); }).should.be.an.instanceof(Promise);
      var start = plonk.now();
      return plonk.walk(10, 100, function (time, i, stop) {
        plonk.now().should.be.above(start + 9);
        stop();
      });
    });
    it('should pass a stop function, delay time, and iteration count into the tick callback', function () {
      return plonk.walk(10, 100, function (time, i, stop) {
        time.should.be.a('number')
          .and.be.at.least(9)
          .and.be.at.most(120);
        i.should.be.a('number')
          .and.be.at.least(0)
          .and.be.at.most(2);
        stop.should.be.a('function');
        if (i === 2) stop();
      }).should.eventually.be.a('number');
    });
  });

});
