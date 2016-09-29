'use strict'

// Memory store.
// This stores all jobs in, well, the program's memory, and
// all data is wiped when the process is shutdown.
//
// This store is not recommended if you want your jobs to persist between
// failures.

exports.createStore = function () {
  const store = {
    _jobs: new Map()
  }

  return Object.assign(store, {
    jobs: {
      set: jobSet.bind(null, store)
    }
  })
}

// Sets id -> job
function jobSet (store, id, job) {
  store._jobs.set(id, job)
}
