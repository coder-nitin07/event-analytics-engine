import eventQueue from "../../events/event.queue.js";

export const getJobs = async (req, res) => {
    try {
        const jobs = await eventQueue.getJobs([
            "waiting",
            "active",
            "completed",
            "failed"
        ]);

        const formatted = jobs.map(job => ({
            id: job.id,
            name: job.name,
            data: job.data,
            status: job.finishedOn
                ? "completed"
                : job.failedReason
                ? "failed"
                : "waiting"
        }));

        res.status(200).json(formatted);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};