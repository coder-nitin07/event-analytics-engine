import { Worker } from "bullmq";
import redisConnection from "../config/redis.config.js";

const worker = new Worker(
    "eventQueue",
    async (job)=>{
        console.log(`Processing Job`, job.data);


        return true;
    },
    {
        connection: redisConnection
    }
);

worker.on('completed', (job)=>{
    console.log(`Job completed ${ job.id }`);
});

worker.on('failed', (job, err)=>{
    console.log(`Job failed: ${ job.id }`, err);
});