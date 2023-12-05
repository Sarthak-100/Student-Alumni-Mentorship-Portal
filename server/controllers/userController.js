import {
  // StudentRegistered,
  Alumni,
  Student,
  Admin,
} from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";
import mongoose from "mongoose";
import { json } from "express";

export const getMyProfile = async (req, res, next) => {
  try {
    const email = req.query.email;
    let user;
    let user_type;

    let out = await Student.find({ email: email });

    if (out.length !== 0) {
      user = out[0];
      user_type = "student";
    } else {
      out = await Alumni.find({ email: email });
      if (out.length !== 0) {
        user = out[0];
        user_type = "alumni";
      } else {
        out = await Admin.find({ email: email });
        if (out.length !== 0) {
          user = out[0];
          user_type = "admin";
        } else {
          return res.status(200).json({
            success: false,
            message: "Could not find the user",
          });
        }
      }
    }
    user["user_type"] = user_type;

    res.status(200).json({
      success: true,
      user_type: user_type,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.query.id);

    let user;
    let user_type;

    let out = await Student.find({ _id: id });

    if (out.length !== 0) {
      user = out[0];
      user_type = "student";
    } else {
      out = await Alumni.find({ _id: id });
      if (out.length !== 0) {
        user = out[0];
        user_type = "alumni";
      } else {
        out = await Admin.find({ _id: id });
        if (out.length !== 0) {
          user = out[0];
          user_type = "admin";
        } else {
          return res.status(404).json({
            success: false,
            message: "Could not find the user",
          });
        }
      }
    }

    user.user_type = user_type;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlumniProfile = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.query.userId);

    Alumni.updateOne({ _id: id }, { $set: req.body }, (err, result) => {
      if (err) {
        console.error("Error updating document:", err);
      } else {
        console.log("Document updated successfully:", result);
        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getBatchwiseCounts = async (req, res, next) => {
  try {
    const alumniCounts = await Alumni.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 },
        },
      },
    ]);

    const studentCounts = await Student.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      alumniCounts,
      studentCounts,
    });
  } catch (error) {
    next(error);
  }
};

