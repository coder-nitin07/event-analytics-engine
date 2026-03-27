import { addToBuffer } from "../../buffer/event.buffer.js";
import emitter from "../../events/emitter.js";
import eventQueue from "../../events/event.queue.js";

export const handleEvent = async (eventData) =>{
    console.log('Event received', eventData);

    // emit internal event
    emitter.emit("event.received", eventData);

    // add job to Queue
    // await eventQueue.add('event-job', eventData);

    // send to buffer instead of Queue
    await addToBuffer(eventData);
};