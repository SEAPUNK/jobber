TODO
===

These are the things I want to add to Jobber.

- Job
  + [ ] state: active, inactive, failed, complete
  + [ ] deletion
  + [ ] updated_at
  + [ ] data (JSON)
  + [ ] cancelable jobs
  + [ ] additional states? sub-states?
  + [ ] run duration
  + [ ] priority
  + [ ] retrying
  + [ ] authentication
  + [ ] delays
  + [ ] better searching
  + [ ] additional data serialization (#3)
  + [ ] runner: progress
  + [ ] runner: logging

- Runner
  + [ ] concurrency
  + [ ] progress
  + [ ] logging
  + [ ] pausing (Kue)
  + [ ] identification (#8)

- Stores
  + [ ] Redis

- Server
  + [ ] graceful shutdown (Kue)
  + [ ] daemon (separate process)
  + [ ] statistics

- Server API
  + [ ] local API
  + [ ] WebSocket connection (?)
  + [ ] Redis pub-sub (?)

- [ ] Web UI
