'use strict'

const copromise = require('mini-copromise')

// Local API.
//
// No connection needed, this is a direct interface to the server.

exports.createApi = function (server) {
  const api = {
    _server: server
  }

  return Object.assign({
    createJob: createJob.bind(null, api),
    handleJob: handleJob.bind(null, api),

    processJob: processJob.bind(null, api),
    searchJob: searchJob.bind(null, api),
    getJob: getJob.bind(null, api)
  })
}

// Creates a job.
//
// Params: See Server.createJob
//
// Returns:
//  Handler for job.
const createJob = copromise(function * createJob (api, type) {
  const jobId = yield api._server.createJob(type)
  return yield handleJob(api, jobId)
})

// Creates a handler instance for the job.
//
// Params:
// - id (String, required): Job ID.
//
// Throws:
// - If job with that ID does not exist
//
// Returns:
//   Handler instance for the job.
const handleJob = copromise(function * handleJob (api, jobId) {
  // TODO
})

//
// process
// Registers a job processor.
//
// search
// Look for a job that meets specific requirements.
// (currently, it's rudimentary, with only type field supported)
// returns array of raw jobs
//
// handle
// returns a Handler for a given job id
// throws an error if no job found
//
// get
// gets the raw data for a job
// returns job data or null
