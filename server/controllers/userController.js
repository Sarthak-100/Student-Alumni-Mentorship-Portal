import {
  // StudentRegistered,
  Alumni,
  Student,
  Admin,
} from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
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
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const updateData = req.body;
    const filter = { _id: userId };
    const update = {
      $set: {
        "work.role": updateData.work.role,
        "work.organization": updateData.work.organization,
        "location.city": updateData.location.city,
        "location.state": updateData.location.state,
        "location.country": updateData.location.country,
      },
    };

    const result = await Alumni.updateOne(filter, update);

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Could not find the user or no changes were made",
      });
    }

    console.log("Document updated successfully");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
    // const userId = new mongoose.Types.ObjectId(req.query.userId);
    // const updateData = req.body;

    // const alum = await Alumni.findOne({ _id: userId });

    // if (!alum) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Could not find the user",
    //   });
    // }

    // const alum2 = alum.toJSON();

    // alum2.work.role = updateData.work.role;
    // alum2.work.organization = updateData.work.organization;

    // alum2.location.city = updateData.location.city;
    // alum2.location.state = updateData.location.state;
    // alum2.location.country = updateData.location.country;

    // console.log(alum2);

    // await Alumni.updateOne({ _id: userId }, { $set: alum2 });

    // // console.log("Document updated successfully:", updatedAlumni);

    // res.status(200).json({
    //   success: true,
    //   message: "Profile updated successfully",
    // });
  } catch (error) {
    next(error);
  }
};
