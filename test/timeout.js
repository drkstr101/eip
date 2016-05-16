var Timeout = require("../lib/timeout")
  , sinon = require('sinon')
  , sandbox = sinon.sandbox.create({ useFakeServer: true, useFakeTimers: false });
require('should');

if (!global.describe) {
  global.describe = function () {
  };
}
function wait(delay) {
  return function (cb) {
    setTimeout(cb, delay);
  }
}

describe("Timeout", function () {

  before(function () {
    this.timeout = new Timeout("amqp://localhost", { name: 'test' }, 0, this.cb);
  })

  beforeEach(function () {
    this.cb = sandbox.stub();
    this.cb.callsArg(1);
    this.timeout.cb = this.cb;
  });

  afterEach(function () {
    delete this.cb;
    sandbox.restore();
  });

  it('should timeout', function* () {
    yield this.timeout.inject.bind(this.timeout, 100);
    yield wait(10);
    this.cb.calledOnce.should.be.ok;
    this.cb.args[0][0].should.eql('100');
  });

  it('should timeout twice', function* () {
    yield this.timeout.inject.bind(this.timeout, 100);
    yield this.timeout.inject.bind(this.timeout, 200);
    yield this.timeout.inject.bind(this.timeout, 300);
    yield wait(10);
    this.cb.calledThrice.should.be.true;
    this.cb.args[0][0].should.eql('100');
    this.cb.args[1][0].should.eql('200');
    this.cb.args[2][0].should.eql('300');
  })

});
