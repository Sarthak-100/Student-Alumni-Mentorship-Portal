import mongoose from "mongoose";

const ReportsSchema = mongoose.Schema(
  {
    reporterId: {
      type: String,
    },
    reporterName: {
      type: String,
    },
    reportedId: {
      type: String,
    },
    reportedName: {
      type: String,
    },
    reportedUserType: {
      type: String,
    },
    reason: {
      type: String,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Reports = mongoose.model("Reports", ReportsSchema);