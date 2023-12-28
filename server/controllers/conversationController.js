import { Conversation } from "../models/conversationModel.js";
import mongoose from "mongoose";

export const newConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    unseenMessages: {
      [String(req.body.senderId)]: 0,
      [String(req.body.receiverId)]: 0,
    },
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
    const conversations = await Conversation.find({
      members: { $in: [req.query.user_id.toString()] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.query.conversationId),
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(updatedConversation);
  } catch (error) {
    next(error);
  }
};

export const conversationsByDate = async (req, res, next) => {
  try {
    let pipeline = [
      {
        $project: {
          yearMonthDay: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: "$yearMonthDay",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ];

    // Check if month and year parameters are provided in the request
    if (req.query.month && req.query.year) {
      const selectedMonth = parseInt(req.query.month);
      const selectedYear = parseInt(req.query.year);

      // Add $match stage to filter by selected month and year
      pipeline.unshift({
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, selectedYear] },
              { $eq: [{ $month: "$createdAt" }, selectedMonth] },
            ],
          },
        },
      });
    }

    const conversations = await Conversation.aggregate(pipeline);

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};