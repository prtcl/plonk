
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
        setTimeout(debounced, 0);
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
        time.should.be.a('number');
        i.should.be.a('number');
        stop.should.be.a('function');
        if (i === 2) stop(i);
        return i;
      }).should.eventually.equal(2);
    });
  });

  describe('env', function () {

  });

  describe('frames', function () {
    it('should be a wrapper for requestAnimationFrame that returns a promise', function () {
      plonk.should.have.property('frames');
      var start = plonk.now();
      return plonk.frames(function (time, start, i, stop) {
        plonk.now().should.be.above(start);
        stop();
      });
    });
    it('should pass the playback time, start time, iteration count, and stop function into the tick callback', function () {
      return plonk.frames(function (time, start, i, stop) {
        time.should.be.a('number');
        start.should.be.a('number');
        i.should.be.a('number');
        stop.should.be.a('function');
        if (i === 10) stop();
      });
    });
  });

  describe('log', function () {
    it('should scale a number in 0...1 range by eulers constant', function () {
      plonk.should.have.property('log');
      plonk.log(0).should.be.a('number').and.equal(0);
      plonk.log(0.5).should.be.a('number').and.equal(0.15195522325791297);
      plonk.log(1).should.be.a('number').and.equal(1);
      plonk.log(-3.12).should.be.a('number').and.equal(0);
    });
  });

  describe('metro', function () {
    it('should be a wrapper for setInterval that returns a promise', function () {
      plonk.should.have.property('metro');
      plonk.metro(10, function (i, stop) { stop(); }).should.be.an.instanceof(Promise);
      var start = plonk.now();
      return plonk.metro(10, function (i, stop) {
        plonk.now().should.be.above(start);
        stop();
      });
    });
    it('should pass a stop function and iteration count into the tick callback', function () {
      return plonk.metro(10, function (i, stop) {
        i.should.be.a('number');
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
        plonk.now().should.be.above(start);
        done();
      }, 10);
    });
  });

  describe('ramp', function () {

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
        plonk.now().should.be.above(start);
        stop();
      });
    });
    it('should pass a stop function, delay time, and iteration count into the tick callback', function () {
      return plonk.walk(10, 100, function (time, i, stop) {
        time.should.be.a('number');
        i.should.be.a('number');
        stop.should.be.a('function');
        if (i === 2) stop(i);
        return i;
      }).should.eventually.equal(2);
    });
  });

});
