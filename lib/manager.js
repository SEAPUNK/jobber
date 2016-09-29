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
//
// Returns:
//  Job handler for requested job.
const createJob = copromise(function * createJob (manager, name) {
  // Job name validation
  if (!name) throw new Error('Job name must be provided.')
  if (typeof name !== 'string') throw new Error('Job name must be a string.')
})
