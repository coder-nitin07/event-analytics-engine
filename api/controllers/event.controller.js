import logger from "../../utils/logger.js";
import { handleEvent } from "../services/event.service.js";

export const trackEvent = (req, res)=>{
    try {
        const { eventType, userId } = req.body;

        // validation
        if(!eventType || !userId){
            return res.status(400).json({
                error: "EventType and userId are required"
            });
        }

        logger.info(
            { service: 'api', eventType },
            "Incoming event received"
        )

        // call service
        handleEvent({ eventType, userId });

        return res.status(200).json({
            message: 'Event received'
        });
    } catch (err) {
        logger.error(
             { service: "api", error: err.message },
            "Error in trackEvent"
        );

        console.log("Error in trackEvent", err);
        return res.status(500).json({
            err: "Internal Server Error"
        });
    }
};