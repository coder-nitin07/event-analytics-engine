import { Queue } from "bullmq";
import redisConnection from "../config/redis.config.js";

const eventQueue = new Queue('eventQueue', {
    connection: redisConnection
});

export default eventQueue;