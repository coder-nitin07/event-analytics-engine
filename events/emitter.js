import EventEmitter from "events";
const emitter  = new EventEmitter();

// listener
emitter.on('event.received', (data)=>{
    console.log(`EventEmitter - event.received`, data);
    // emitter.emit("event.received", data);
});

emitter.on('event.batched', (batch)=>{
    console.log(`Event batched ${ batch.length } events`);
});

emitter.on('job.queued', ()=>{
    console.log('Job.queued');
});

emitter.on("job.processing", (jobId) => {
  console.log(`job.processing: ${ jobId }`);
});

emitter.on("job.completed", (jobId) => {
  console.log(`job.completed: ${ jobId }`);
});

emitter.on("job.failed", ({ jobId, error }) => {
  console.log(`job.failed: ${ jobId }`, error.message);
});

export default emitter;