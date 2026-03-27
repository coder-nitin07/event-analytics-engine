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

        console.log(`📊 Processing ${events.length} events`);

        // Simulate processing
        await delay(2000);

        // Example aggregation (simple count)
        const count = events.length;

        console.log(`✅ Batch processed. Total events: ${count}`);

        return { processed: count };
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