import {
  Student,
  Alumni,
  Admin,
} from "../models/userModel.js";
import mongoose from "mongoose";

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
    user.user_type = user_type;

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
      user_type: user_type,
    });
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (req, res, next) => {
  // inserting single entry
  try {
    const newStudent = {
      name: "a2",
      email: "a2@iiitd.ac.in",
      batch: 2020,
      branch: "CSSS",
    };
    const res1 = await Student.create(newStudent);
    if (!res1) {
      return res.status(404).json({
        success: false,
        message: "Could not create the student",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlumniProfile = async (req, res, next) => {
  //code for inserting alumni data into database

  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const { work, location } = req.body;
    console.log(work, location);

    const alumni = await Alumni.findOne({ _id: userId });
    const updated = { ...alumni };

    updated.work = work;
    updated.location = location;

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Could not find the alumni",
      });
    } else {
      await Alumni.updateOne(
        { _id: userId },
        { $set: { work: work, location: location } }
      );
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const insertAvatar = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.query.userId);
    const image = req.body.avatar;

    let user;
    let user_type;
    let model;

    let out = await Student.findOne({ _id: id }).lean();

    if (out !== null) {
      user = out;
      user_type = "student";
      model = Student;
    } else {
      out = await Alumni.findOne({ _id: id }).lean();
      if (out !== null) {
        user = out;
        user_type = "alumni";
        model = Alumni;
      } else {
        out = await Admin.findOne({ _id: id }).lean();
        if (out !== null) {
          user = out;
          user_type = "admin";
          model = Admin;
        } else {
          return res.status(404).json({
            success: false,
            message: "Could not find the user",
          });
        }
      }
    }

    await model.updateOne({ _id: id }, { $set: { img: image } });
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
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

export const removeUser = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.query.id);
    const user_type = req.query.user_type;
    let result;
    if (user_type === "student") {
      result = await Student.findByIdAndUpdate(
        id,
        { removed: true },
        { new: true }
      );
    } else {
      result = await Alumni.findByIdAndUpdate(
        id,
        { removed: true },
        { new: true }
      );
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};