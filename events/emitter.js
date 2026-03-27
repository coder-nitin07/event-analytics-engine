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

export default emitter;