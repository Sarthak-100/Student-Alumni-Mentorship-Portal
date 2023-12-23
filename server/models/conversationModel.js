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
    lastMessage: {
      type: String,
      default: "",
    },
    unseenMessages: {
      type: Object, // Use Object type
      default: {},
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
