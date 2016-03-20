'use strict'
var chai = require('chai'),
    expect = chai.expect,
    spies = require('chai-spies'),
    middleware = require('../../../middleware')

chai.use(spies)

describe('Ping middleware', function () {
  it('should return pong', function () {
    var spy = chai.spy()
    middleware.ping(null, { send: spy }, null)
    expect(spy).to.have.been.called.exactly(1)
    expect(spy).to.have.been.called.with('pong')
  })
})
