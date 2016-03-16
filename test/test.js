
var plonk = require('../lib');

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
      }, 500);
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

  });

  describe('env', function () {

  });

  describe('frames', function () {

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

  });

  describe('now', function () {
    it('should call performance.now and return a number', function () {
      plonk.should.have.property('now');
      plonk.now().should.be.a('number');
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

  });

  describe('wait', function () {
    it('should be a wrapper for setTimeout that returns a promise', function () {
      plonk.should.have.property('wait');
      return plonk.wait(Math.random() * 1000).should.eventually.be.a('number');
    });
  });

  describe('walk', function () {

  });

});
