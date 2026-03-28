import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Analytics', analyticsSchema);