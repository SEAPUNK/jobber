'use strict'

const copromise = require('mini-copromise')

const Server = require('./server/Server')
const LocalApi = require('./api/Local')

// Creates a new server, and returns a local API instance.
exports.setup = copromise(function * setup () {
  const server = yield Server.createServer.apply(this, arguments)
  const api = LocalApi.createApi(server)
  return api
})
