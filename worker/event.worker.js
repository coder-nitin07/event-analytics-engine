import { Worker } from "bullmq";
import redisConnection from "../config/redis.config.js";
import connectDB from "../config/db.js";
import analyticsModel from "../models/analytics.model.js";
import emitter from "../events/emitter.js";
import logger from '../utils/logger.js';

// funtion to simulate delay
const delay = (ms) => new Promise((resolve)=> setTimeout(resolve, ms));

// connect DB
await connectDB();

const worker = new Worker(
    "eventQueue",
    async (job)=>{
        logger.info(
            { service: "worker", jobId: job.id },
            "Worker started processing job"
        );

        emitter.emit('job.processing', job.id);

        const { events } = job.data;

        logger.info(
            { service: "worker", jobId: job.id, eventCount: events.length },
            "Processing events"
        );

        // Aggregation logic
        const aggregation = {};

        for(const event of events){
            const type = event.eventType;

            if(!aggregation[type]){
                aggregation[type] = 0;
            }

            aggregation[type]++;
        }

       logger.info(
            { service: "worker", aggregation },
            "Aggregation completed"
        );

        // current date
        const today = new Date().toISOString().split('T')[0];

        try {
            // save to DB
            for(const [ eventType, count ] of Object.entries(aggregation)){
                await analyticsModel.updateOne(
                        { date: today, eventType },
                        { $inc: { count } }, 
                        { upsert: true }     
                )
            }

            logger.info(
                { service: "worker", jobId: job.id },
                "Data saved to DB"
            );

        } catch (error) {
            logger.error(
                { service: "worker", jobId: job.id, error: error.message },
                "DB operation failed"
            );

            throw error; // ✅ IMPORTANT for retry
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
   logger.info(
        { service: "worker", jobId: job.id, result },
        "Job completed"
    );
});

worker.on('failed', (job, err)=>{
     logger.error(
        { service: "worker", jobId: job?.id, error: err.message },
        "Job failed"
    );
});

logger.info({ service: "worker" }, "Worker is running...");