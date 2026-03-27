import { Worker } from "bullmq";
import redisConnection from "../config/redis.config.js";

// funtion to simulate delay
const delay = (ms) => new Promise((resolve)=> setTimeout(resolve, ms));

const worker = new Worker(
    "eventQueue",
    async (job)=>{
        console.log(`Worker started processing Job`, job.id);
        console.log(`Processing Job`, job.data);

        const { events } = job.data;

        console.log(`Processing ${events.length} events`);

        // Aggregation logic
        const aggregation = {};

        for(const event of events){
            const type = event.eventType;

            if(!aggregation[type]){
                aggregation[type] = 0;
            }

            aggregation[type]++;
        }

        // Simulate processing
        await delay(2000);

        console.log("Aggregated Result:");
        console.log(aggregation);   

        return aggregation;
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

worker.on('completed', (job, result)=>{
    console.log(`Job completed ${ job.id }`, result);
});

worker.on('failed', (job, err)=>{
    console.log(`Job failed: ${ job.id }`, err.message);
});

console.log("Worker is running...");