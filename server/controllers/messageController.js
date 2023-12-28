import { Message } from "../models/messageModel.js";

export const newMessage = async (req, res, next) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.query.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};