import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    // Define the structure of each event
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni' // Reference to the Alumni model
    },
    summary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    attendees: {
        type: Array,
        required: true,
    },
});

const Event = mongoose.model("eventSchema", eventSchema);
export {Event};
