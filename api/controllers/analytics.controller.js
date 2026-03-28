import analyticsService from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
    try {
        const { page = 1, limit = 10, date, eventType } = req.query;

        const data = await analyticsService.getAnalytics({
            page: Number(page),
            limit: Number(limit),
            date,
            eventType
        });

        res.status(200).json(data);

    } catch (error) {
        console.log(error, "err");
        res.status(500).json({ message: "Internal Server Error" });
    }
};