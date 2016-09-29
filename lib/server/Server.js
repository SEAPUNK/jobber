'use strict'

// TODO: Server.shutdown

const copromise = require('mini-copromise')
const eventemitter3 = require('eventemitter3')

const MemoryStore = require('stores/Memory')

// Creates the jobber server.
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

  // Server event system.
  server.events = new eventemitter3.EventEmitter()

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
// - name (String, required): Job name.
//
// Returns:
//  Job ID.
const createJob = copromise(function * createJob (server, name) {
  // Job name validation
  if (!name) throw new Error('Job name must be provided.')
  if (typeof name !== 'string') throw new Error('Job name must be a string.')

  // Generate job ID.
  const id = generateJobId(server)

  // Create the job
  const job = {
    id: id,
    name: name,

    created_at: Date.now()
  }

  // Store the job.
  server._jobs.push(job)

  // TODO: Do we need to queue a recheck?

  return job.id
})

// Internal function
//
// Generates a unique job ID.
function generateJobId (server) {
  const id = `${server._date}-${server._jobIdCounter}`
  server._jobIdCounter++
  return id
}
