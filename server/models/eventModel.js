import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    // Define the structure of each event
    googleEventId: {
        type: String,
        required: false,
    },
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
        required: false,
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    attendees: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student', // Reference to the Student model
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }]
});

const studentEventSchema = new mongoose.Schema({
    // Define the structure of each event
    googleEventId: {
        type: String,
        required: true,
    },
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
});

const Event = mongoose.model("eventSchema", eventSchema);
const studentEvent = mongoose.model("studentEvent", studentEventSchema);

export {Event, studentEvent};