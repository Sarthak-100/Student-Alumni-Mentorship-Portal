import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema(
  {
    receiverId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    senderName: {
      type: String,
    },
    messageType: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", NotificationSchema);