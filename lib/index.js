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

// TODO: Docs: Job creation could be duplicated in the case
//       of a faulty connection, or another condition.

// in async function

// register the job runner
await jobber.process('email', emailHandler)
// if the promise resolves, that means the job runner registration was successful

// job: job instance
// the handler's data is returned; run through Promise.resolve(), for the async handlers
async function emailHandler (job) {
  // do some emailing
  return await sendSomeEmails(job.data)
}
