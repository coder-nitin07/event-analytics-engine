import { Queue } from "bullmq";
import redisConnection from "../config/redis.config.js";
import logger from "../utils/logger.js";

const eventQueue = new Queue('eventQueue', {
    connection: redisConnection
});

eventQueue.on("waiting", (jobId) => {
  logger.info(
    { service: "queue", jobId },
    "Job waiting in queue"
  );
});

eventQueue.on("completed", (job) => {
  logger.info(
    { service: "queue", jobId: job.id },
    "Job completed"
  );
});

eventQueue.on("failed", (job, err) => {
  logger.error(
    { service: "queue", jobId: job?.id, error: err.message },
    "Job failed"
  );
});

export default eventQueue;