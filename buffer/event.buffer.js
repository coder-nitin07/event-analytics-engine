import emitter from "../events/emitter.js";
import eventQueue from "../events/event.queue.js";
import logger from "../utils/logger.js";

const BATCH_SIZE = 1;
let eventBuffer = [];

// add event to Buffer
export const addToBuffer = async (event)=> {
    eventBuffer.push(event);

    logger .info(
        { service: "buffer", size: eventBuffer.length },
        "Event added to buffer"
    );

    // check Batch is redy to send
    if(eventBuffer.length >= BATCH_SIZE){
        const batch = eventBuffer.splice(0, BATCH_SIZE);

        logger.info(
            { service: "buffer", batchSize: batch.length },
            "Creating batch"
        );

        // emit batchig event
        emitter.emit('event.batched', batch);

        try {
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

            logger.info(
                { service: "buffer" },
                "Batch sent to queue"
            );

        } catch (error) {
            logger.error(
                { service: "buffer", error: error.message },
                "Failed to send batch to queue"
            );
        }
    }
};