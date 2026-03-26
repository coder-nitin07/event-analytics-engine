import EventEmitter from "events";
const emitter  = new EventEmitter();

// listener
emitter.on('event-received', (data)=>{
    console.log(`EventEmitter - event.received`, data);
    // emitter.emit("event.received", data);
});

export default emitter;