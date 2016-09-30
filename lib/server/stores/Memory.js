'use strict'

// Memory store.
// This stores all jobs in, well, the program's memory, and
// all data is wiped when the process is shutdown.
//
// All operations are atomic.
//
// This store is not recommended if you want your jobs to persist between
// failures.

exports.createStore = function () {
  const store = {
    _clients: [],
    _jobs: [],
    _handlers: [],
    _runners: []
  }

  return Object.assign(store, {
    clients: {
      add: clientAdd.bind(null, store)
    },
    jobs: {
      add: jobAdd.bind(null, store),
      remove: jobRemove.bind(null, store)
    },
    handlers: {
      add: handlerAdd.bind(null, store)
    },
    runners: {
      add: runnerAdd.bind(null, store),
      remove: runnerRemove.bind(null, store)
    }
  })
}

// Adds client.
function clientAdd (store, client) {
  store._clients.push(client)
}

// TODO @ FEAT: client timeout
// // Removes a client, and all related data with it.
// //
// // true if client existed, false if client didn't exist
// function clientRemove (store, clientId) {
//   for (let [idx, client] of store._clients.entries()) {
//     if (client.id === clientId) {
//       // Remove the client
//       store._clients.splice(idx, 1)

//       // Remove handlers for client
//       _removeHandlersForClient(store, client.id)

//       // Remove runner for client
//       _removeRunnersForClient(store, client.id)

//       return true
//     }
//   }
//   return false
// }

// // Removes all handlers for a client.
// function _removeHandlersForClient (store, clientId) {
//   for (let [idx, handler] of store._handlers.entries()) {
//     if (handler.client === clientId) {
//       store._handlers.splice(idx, 1)
//     }
//   }
// }

// // Removes all runners for client.
// function _removeRunnersForClient (store, clientId) {
//   for (let job of store._jobs) {
//     if (job.runner === clientId) {
//       job.runner = null
//     }
//   }
// }

// Adds job.
function jobAdd (store, job) {
  store._jobs.push(job)
}

// Removes job.
//
// Returns:
// - true if job existed and was removed
// - false if job did not exist
function jobRemove (store, jobId) {
  for (let [idx, job] of store._jobs.entries()) {
    if (job.id === jobId) {
      // Remove the job
      store._jobs.splice(idx, 1)

      // Remove the handlers
      _removeHandlersForJob(store, job.id)

      return true
    }
  }
  throw new Error('Job does not exist')
}

// Adds handler to a job.
function handlerAdd (store, clientId, jobId) {
  store._handlers.push({client: clientId, job: jobId})
}

// Removes handler from job.
function _removeHandlersForJob (store, jobId) {
  for (let [idx, handler] of store._handlers.entries()) {
    if (handler.job === jobId) {
      store._handlers.splice(idx, 1)
    }
  }
}
