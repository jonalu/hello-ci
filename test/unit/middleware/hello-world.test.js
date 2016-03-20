'use strict'
var chai = require('chai'),
    expect = chai.expect,
    spies = require('chai-spies'),
    middleware = require('../../../middleware')

chai.use(spies)

describe('Ping middleware', function () {
  it('should return hello world', function () {
    var spy = chai.spy()
    middleware.helloWorld(null, { send: spy }, null)
    expect(spy).to.have.been.called.exactly(1)
    expect(spy).to.have.been.called.with('hello world')
  })
})
