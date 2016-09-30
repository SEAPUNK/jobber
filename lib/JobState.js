'use strict'

// Job is waiting in the system; no runner has decided
// to process this job.
exports.QUEUED = 'queued'

// Job is being processed by a runner.
exports.RUNNING = 'running'

// Job was unable to be processed.
exports.FAILED = 'failed'

// Job was successfully processed.
exports.COMPLETE = 'complete'
