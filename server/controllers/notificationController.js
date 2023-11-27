import { Notification } from "../models/notificationModel.js";
import mongoose from "mongoose";

export const newNotification = async (req, res, next) => {
  const newNotification = new Notification(req.body);

  try {
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      receiverId: req.query.userId,
    });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const countNotifications = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      receiverId: req.query.userId,
    });

    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};
