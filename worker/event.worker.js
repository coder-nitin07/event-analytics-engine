import { Worker } from "bullmq";
import redisConnection from "../config/redis.config.js";
import connectDB from "../config/db.js";
import analyticsModel from "../models/analytics.model.js";

// funtion to simulate delay
const delay = (ms) => new Promise((resolve)=> setTimeout(resolve, ms));

// connect DB
await connectDB();

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

       

        console.log("Aggregated Result:");
        console.log(aggregation);   

        // current date
        const today = new Date().toISOString().split('T')[0];

        // save to DB
        for(const [ eventType, count ] of Object.entries(aggregation)){
            await analyticsModel.updateOne(
                    { date: today, eventType },
                    { $inc: { count } }, 
                    { upsert: true }     
            )
        }

        // Simulate processing
        await delay(2000);

        console.log("Data saved to DB");

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