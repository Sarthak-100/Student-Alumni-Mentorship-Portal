import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
