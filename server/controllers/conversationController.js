import { Conversation } from "../models/conversationModel.js";

export const newConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user._id.toString()] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};
