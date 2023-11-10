import jwt from "jsonwebtoken";
import { StudentRegistered, Admin, Alumni } from "../models/userModel.js";

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "You are not logged in",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let out = await StudentRegistered.findById(decoded._id);
  if (out) {
    req.user = out;
    req.user_type = "student";
  } else {
    out = await Alumni.findById(decoded._id);
    req.user = out;
    req.user_type = "alumni";
    if (out === null) {
      out = await Admin.findById(decoded._id);
      req.user = out;
      req.user_type = "admin";
    }
  }
  next();
};

export default isAuthenticated;
