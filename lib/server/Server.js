'use strict'

const copromise = require('mini-copromise')
const delay = require('delay')
const uuid = require('uuid')

const MemoryStore = require('./stores/Memory')
const JobState = require('../JobState')

const JOB_CLEANUP_INTERVAL = 5000

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
    // Whether the server has shut down.
    _shutdown: false
  }

  // Initialize the storage mechanism.
  // TODO: Use 'yield', when we implement other storage mechanisms.
  server.store = MemoryStore.createStore()

  // TODO: Restore data with store?

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

    state: JobState.QUEUED,
    timeout: timeout,

    created_at: Date.now(),
    started_at: null,
    finished_at: null
  }

  // Store the job.
  yield server.store.jobs.set(job.id, job)

  return job.id
})

// Generates a unique job ID.
function _generateJobId (server) {
  return uuid.v4()
}

// Determines the job's timeout(s).
function _determineJobTimeout (timeout) {
  // If timeout is not defined at all
  if (!timeout && timeout !== 0) {
    return {total: JOB_DEFAULT_TOTAL_TIMEOUT, _type: 'total'}
  }

  // If timeout is a number
  if (typeof timeout === 'number') {
    if (timeout < 0) {
      throw new Error(`Invalid job timeout value: ${timeout}`)
    } else {
      return {total: timeout, _type: 'total'}
    }
  }

  // Else, timeout is an object (or object-like)

  // Check if timeout.total is defined, and use that
  if (timeout.total || timeout.total === 0) {
    // Validate the value
    if (timeout.total < 0) {
      throw new Error(`Invalid job timeout.total value: ${timeout}`)
    }
    return {total: timeout.total, _type: 'total'}
  }

  // Else, we use idle + run timeouts if at least one of them is defined.
  let idleTimeout = null
  let runTimeout = null

  if (timeout.idle || timeout.idle === 0) {
    idleTimeout = timeout.idle
  }
  if (timeout.run || timeout.run === 0) {
    runTimeout = timeout.run
  }

  // Do quick value validation.
  if (idleTimeout !== null && idleTimeout < 0) {
    throw new Error(`Invalid job timeout.idle value: ${timeout}`)
  }
  if (runTimeout !== null && runTimeout < 0) {
    throw new Error(`Invalid job timeout.run value: ${timeout}`)
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
