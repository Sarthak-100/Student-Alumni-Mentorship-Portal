import {
  StudentRegistered,
  Alumni,
  Student,
  Admin,
} from "../models/userModel.js";
import { ErrorHandler } from "../middlewares/error.js";
import sendCookie from "../utils/features.js";
import bcrypt, { hash } from "bcrypt";
import mongoose from "mongoose";

//identifying user type after login

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await StudentRegistered.findOne({ email });

    if (user) {
      return next(
        new ErrorHandler("User Already exists", 404
      ));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const urecord = await Student.findOne({ email: email });
    console.log(urecord, mail, password);
    if (!urecord)
      return next(
        new ErrorHandler("User not available in the organization", 404)
      );
    const more_info = urecord._id;

    user = await StudentRegistered.create({
      email: email,
      password: hashedPassword,
      more_info: more_info,
    });

    sendCookie(user, res, 201, "Created user successfully");

  }catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // console.log("1");
    // const { email, password, user_type } = req.body;
    const { email, password, user_type } = req.query;

    // console.log("2");

    if (user_type === "student") {
      // console.log("3");
      const user = await StudentRegistered.findOne({ email }).select(
        "+password"
      );

      if (!user)
        return next(new ErrorHandler("Invalid email or password", 404));

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const std = await Student.findOne({ _id: user.more_info });
        sendCookie(user, res, 200, `Welcome back, ${std.name}`);
        // console.log("4");
      } else {
        return next(new ErrorHandler("Invalid email or password", 404));
      }
    } else if (user_type === "alumni") {
      // console.log("5");
      const user = await Alumni.findOne({ email }).select("+password");

      if (!user)
        return next(new ErrorHandler("Invalid email or password", 404));

      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = password === user.password;

      if (isMatch) {
        sendCookie(user, res, 200, `Welcome back, ${user.name}`);
        // console.log("6");
      } else {
        return next(new ErrorHandler("Invalid email or password", 404));
      }
    } else {
      // console.log("7");
      console.log(email);
      console.log(password);
      const user = await Admin.findOne({ email }).select("+password");

      if (!user)
        return next(new ErrorHandler("Invalid email or password", 404));

      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = password === user.password;

      if (isMatch) {
        sendCookie(user, res, 200, `Welcome back, ${user.name}`);
        // console.log("8");
      } else {
        return next(new ErrorHandler("Invalid email or password", 404));
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    console.log("1");
    console.log(req.user_type);
    if (req.user_type === "student") {
      console.log("2");
      const user = req.user;
      const std = await Student.findOne({ _id: user.more_info });
      res.status(200).json({
        success: true,
        user_type: "student",
        _id: user._id,
        name: std.name,
        email: user.email,
        batch: std.batch,
        branch: std.branch,
        roll_no: std.roll_no,
        img: std.img,
      });
    } else if (req.user_type === "alumni") {
      const alumni = req.user;
      res.status(200).json({
        success: true,
        user_type: "alumni",
        _id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        batch: alumni.batch,
        branch: alumni.branch,
        current_work: alumni.current_work,
        img: alumni.img,
      });
    } else {
      const admin = req.user;
      res.status(200).json({
        success: true,
        user_type: "admin",
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        img: admin.img,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getMyToken = async (req, res, next) => {
  res.status(200).json({
    success: true,
    token: req.cookies.token,
  });
};

export const getUserProfile = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.query.id);
    console.log("$$$$$$$$$$$$$$$$$$$$$USERcONTROLLER", id);
    let user;
    let user_type = "";
    let out = await StudentRegistered.findById(id);
    if (out) {
      user = out;
      user_type = "student";
    } else {
      out = await Alumni.findById(id);
      user = out;
      if (out === null) {
        out = await Admin.findById(id);
        user = out;
      }
    }

    if (user_type === "student") {
      console.log("in ucontr", id);
      const std = await Student.findOne({ _id: user.more_info });
      res.status(200).json({
        name: std.name,
        email: user.email,
        img: user.img,
      });
    } else {
      console.log("in else ucontr", id);
      console.log(user);
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};
