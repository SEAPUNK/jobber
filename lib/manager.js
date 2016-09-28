'use strict'

const AggregateError = require('aggregate-error')
const copromise = require('mini-copromise')

// Creates a new job manager instance.
exports.createManager = function createManager () {
  // Store the current date, as it will be used for ID generation.
  const now = Date.now()

  // Initialize the manager object with values.
  const manager = {
    _managerCreatedAt: now
  }

  // Now add bound methods to the manager object.
  // This is so we can bind the functions in the first place.
  return Object.assign(manager, {
    create: createJob.bind(null, manager)
  })
}

// Creates a job that needs to be processed.
//
// Params:
// - name (String, required): Job name.
// - data (Any, optional): Job data, that can be serializable to JSON.
// - options (Object, optional):
// - options.mergable (Boolean, default false):
//
//   Whether if a pending job exists with the same name,
//   we do not create a new job, but return the handler for that pending job
//   instead.
//
// Returns:
//  Job handler for requested job.
const createJob = copromise(function * createJob (manager, name, data, options) {
  // Job name validation
  if (!name) throw new Error('Job name must be provided.')
  if (typeof name !== 'string') throw new Error('Job name must be a string.')

  // Job data validation and serialization
  try {
    const serializedData = JSON.stringify(data)
  } catch (err) {
    throw new AggregateError([
      new Error(
        'Could not serialize data provided for job.' +
        ' Make sure the data can be turned into a JSON string.'
      ),
      err
    ])
  }
})
