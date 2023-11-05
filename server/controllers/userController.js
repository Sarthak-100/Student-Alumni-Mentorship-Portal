import { User, Alumni, Student, Admin } from "../models/userModel.js";
import { ErrorHandler } from "../middlewares/error.js";
import sendCookie from "../utils/features.js";
import bcrypt, { hash } from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already exists", 404));

    const hashedPassword = await bcrypt.hash(password, 10);

    const urecord = await Student.find({ email: email });
    if (!urecord)
      return next(
        new ErrorHandler("User not available in the organization", 404)
      );
    const more_info = urecord[0]._id;

    user = await User.create({
      email: email,
      password: hashedPassword,
      more_info: more_info,
    });

    sendCookie(user, res, 201, "Created user successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, user_type } = req.body;

    if (user_type === "student") {
      const user = await User.findOne({ email }).select("+password");

      if (!user)
        return next(new ErrorHandler("Invalid email or password", 404));

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const std = await Student.findOne({ _id: user.more_info });
        sendCookie(user, res, 200, `Welcome back, ${std.name}`);
      } else {
        return next(new ErrorHandler("Invalid email or password", 404));
      }
    } else if (user_type === "alumni") {
      const user = await Alumni.findOne({ email }).select("+password");

      if (!user)
        return next(new ErrorHandler("Invalid email or password", 404));

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        sendCookie(user, res, 200, `Welcome back, ${user.name}`);
      } else {
        return next(new ErrorHandler("Invalid email or password", 404));
      }
    } else {
      const user = await Admin.findOne({ email }).select("+password");

      if (!user)
        return next(new ErrorHandler("Invalid email or password", 404));

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        sendCookie(user, res, 200, `Welcome back, ${user.name}`);
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
    if (req.user_type === "student") {
      const user = req.user;
      const std = await Student.findOne({ _id: user.more_info });
      res.status(200).json({
        success: true,
        user_type: "student",
        name: std.name,
        email: user.email,
        batch: std.batch,
        branch: std.branch,
        roll_no: std.roll_no,
      });
    } else if (req.user_type === "alumni") {
      const user = req.user;
      res.status(200).json({
        success: true,
        user_type: "alumni",
        name: user.name,
        email: user.email,
        batch: user.batch,
        branch: user.branch,
        current_work: user.current_work,
      });
    }
  } catch (error) {
    next(error);
  }
};
