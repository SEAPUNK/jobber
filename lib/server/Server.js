'use strict'

const copromise = require('mini-copromise')

const MemoryStore = require('stores/Memory')

const JOB_DEFAULT_TOTAL_TIMEOUT = 120000
const JOB_DEFAULT_IDLE_TIMEOUT = 120000
const JOB_DEFAULT_RUN_TIMEOUT = 120000

// Creates the jobber server.
//
// TODO: Server.shutdown
//
// TODO: Options
// TODO: Options -> storage mechanism
// TODO: Options -> API mechanism
exports.createServer = copromise(function * createServer () {
  // Initialize the server object with values.
  const server = {
    // Store the date the server was started on, as it will be used for ID generation.
    _date: Date.now(),
    // We need to keep a counter for job ID generation.
    _jobIdCounter: 0
  }

  // Initialize the storage mechanism.
  // TODO: Use 'yield', when we implement other storage mechanisms.
  server.store = MemoryStore.createStore()

  // Now add bound methods to the server object.
  // This is so we can bind the functions in the first place.
  return Object.assign(server, {
    createJob: createJob.bind(null, server)
  })
})

// Creates a job that needs to be processed.
//
// Params:
// - type (String, required): Job type.
//
// Returns:
//  Job ID.
const createJob = copromise(function * createJob (server, type) {
  // Job type validation
  if (!type) throw new Error('Job type must be provided.')
  if (typeof type !== 'string') throw new Error('Job type must be a string.')

  const options = {} // options

  const timeout = _determineJobTimeout(options.timeout)

  // Generate job ID.
  const id = _generateJobId(server)

  // Create the job
  const job = {
    id: id,
    type: type,

    timeout: timeout,
    created_at: Date.now()
  }

  // Store the job.
  yield server.store.jobs.set(job.id, job)

  return job.id
})

// Generates a unique job ID.
function _generateJobId (server) {
  const id = `${server._date}-${server._jobIdCounter}`
  server._jobIdCounter++
  return id
}

// Determines the job's timeout(s).
function _determineJobTimeout (_timeout) {
  // If timeout is not defined at all
  if (!_timeout && _timeout !== 0) {
    return {total: JOB_DEFAULT_TOTAL_TIMEOUT, _type: 'total'}
  }

  // If timeout is a number
  if (typeof _timeout === 'number') {
    if (_timeout < 0) {
      throw new Error(`Invalid job timeout value: ${_timeout}`)
    } else {
      return {total: _timeout, _type: 'total'}
    }
  }

  // Else, timeout is an object (or object-like)

  // Check if timeout.total is defined, and use that
  if (_timeout.total || _timeout.total === 0) {
    // Validate the value
    if (_timeout.total < 0) {
      throw new Error(`Invalid job timeout.total value: ${_timeout}`)
    }
    return {total: _timeout.total, _type: 'total'}
  }

  // Else, we use idle + run timeouts if at least one of them is defined.
  let idleTimeout = null
  let runTimeout = null

  if (_timeout.idle || _timeout.idle === 0) {
    idleTimeout = _timeout.idle
  }
  if (_timeout.run || _timeout.run === 0) {
    runTimeout = _timeout.run
  }

  // Do quick value validation.
  if (idleTimeout !== null && idleTimeout < 0) {
    throw new Error(`Invalid job timeout.idle value: ${_timeout}`)
  }
  if (runTimeout !== null && runTimeout < 0) {
    throw new Error(`Invalid job timeout.run value: ${_timeout}`)
  }

  // If neither of them are defined, then default to timeout.total
  if (idleTimeout === null && runTimeout === null) {
    return {total: JOB_DEFAULT_TOTAL_TIMEOUT, _type: 'total'}
  }

  if (idleTimeout === null) {
    idleTimeout = JOB_DEFAULT_IDLE_TIMEOUT
  }
  if (runTimeout === null) {
    runTimeout = JOB_DEFAULT_RUN_TIMEOUT
  }

  return {
    idle: idleTimeout,
    run: runTimeout,
    _type: 'individual'
  }
}
