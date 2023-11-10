import Chat from "../models/Chat.js";
import { StudentRegistered, Student, Alumni, Admin } from "../models/userModel";

export const getChattedUsers = async (req, res, next) => {
  try {
    let users, tempChattedUsers;
    if (req.user_type === "student") {
      tempChattedUsers = await StudentRegistered.find({ _id: req.user_id })
        .chat_model.chattedUsers({})
        .select([user_id, user_type, lastMessage]);
    } else if (req.user_type === "alumni") {
      tempChattedUsers = await Alumni.find({ _id: req.user_id })
        .chat_model.chattedUsers({})
        .select([user_id, user_type, lastMessage]);
    } else {
      tempChattedUsers = await Admin.find({ _id: req.user_id })
        .chat_model.chattedUsers({})
        .select([user_id, user_type, lastMessage]);
    }
    users = tempUsers.map(async (user) => {
      let user_info;
      if (user.user_type === "student") {
        let tuser = await StudentRegistered.findOne(user.user_id);
        tuser.name = await Student.findOne({ _id: tuser.more_info }).name;
        user_info = { name: tuser.name, email: tuser.email, img: tuser.img };
      } else if (user.user_type === "alumni") {
        user_info = await Alumni.findOne(user.user_id).select([
          "name",
          "email",
          "img",
        ]);
      } else {
        user_info = await Admin.findOne(user.user_id).select([
          "name",
          "email",
          "img",
        ]);
      }
      return {
        user_id: user.user_id,
        user_type: user.user_type,
        name: user_info.name,
        email: user_info.email,
        img: user_info.img,
        lastMessage: user.lastMessage,
      };
    });
  } catch (error) {
    next(error);
  }
};
