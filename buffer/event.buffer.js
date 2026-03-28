import emitter from "../events/emitter.js";
import eventQueue from "../events/event.queue.js";

const BATCH_SIZE = 1;
let eventBuffer = [];

// add event to Buffer
export const addToBuffer = async (event)=> {
    eventBuffer.push(event);

    console.log(`Buffer size: ${ eventBuffer.length }`);

    // check Batch is redy to send
    if(eventBuffer.length >= BATCH_SIZE){
        const batch = eventBuffer.splice(0, BATCH_SIZE);

        console.log(`Creating Batch of size: `, batch.length);

        // emit batchig event
        emitter.emit('event.batched', batch);

        // send to queue
        await eventQueue.add('event batch-job', 
            { events: batch },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000
                }
            }
        );

        emitter.emit('job.queued', batch);

        console.log('Batch send to Queue');
    }
};