import mongoose from "mongoose";

//defining the schema for alumni

const alumniSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    batch: {
        type: Number,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    currentWork: {
      //company_name: "xyz", designation: "abc", timeperiod: "2 years"}
        type: Object,
        required: true,
    },
    events: [eventSchema],
  });

  const Alumni = mongoose.model("alumniSchema", alumniSchema);
  export default Alumni;