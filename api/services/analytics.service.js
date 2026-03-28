import analyticsModel from "../../models/analytics.model.js";

const getAnalytics = async ({ page, limit, date, eventType }) => {

    const filter = {};

    if (date) filter.date = date;
    if (eventType) filter.eventType = eventType;

    // pagination
    const skip = (page - 1) * limit;

    const data = await analyticsModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });

    // total events (sum of count)
    const allDocs = await analyticsModel.find(filter);

    let totalEvents = 0;
    allDocs.forEach(doc => {
        totalEvents += doc.count;
    });

    // events per day
    const eventsPerDayMap = {};

    allDocs.forEach(doc => {
        if (!eventsPerDayMap[doc.date]) {
            eventsPerDayMap[doc.date] = 0;
        }
        eventsPerDayMap[doc.date] += doc.count;
    });

    const eventsPerDay = Object.entries(eventsPerDayMap).map(
        ([date, count]) => ({ date, count })
    );

    // top event types
    const eventTypeMap = {};

    allDocs.forEach(doc => {
        if (!eventTypeMap[doc.eventType]) {
            eventTypeMap[doc.eventType] = 0;
        }
        eventTypeMap[doc.eventType] += doc.count;
    });

    const topEventTypes = Object.entries(eventTypeMap)
        .map(([eventType, count]) => ({ eventType, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        totalEvents,
        eventsPerDay,
        topEventTypes,
        data
    };
};

export default { getAnalytics };