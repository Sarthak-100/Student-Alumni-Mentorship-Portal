import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
