// import {Alumni} from "../models/alumniModel.js";
import {
  Student,
  Alumni,
  Admin,
  BlockedAlumni,
  BlockedStudent,
} from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { json } from "express";
import fs from "fs";

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

export const createProfile = async (req, res, next) => {
  // inserting single entry
  try {
    const newStudent = {
      name: "a2",
      email: "a2@iiitd.ac.in",
      batch: 2020,
      branch: "CSSS",
      // img is optional, as it has a default value in the schema
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
  // try {
  //   console.log("inside create profile");
  //   const newAlumni = {
  //     name: "Abhit Rana",
  //     email: "abhit20421@iiitd.ac.in",
  //     branch: "CSSS",
  //     batch: 2020,
  //     img: "",
  //     work: {
  //       role: "Software Engineer",
  //       organization: "Apple",
  //     },
  //     location: {
  //       city: "Silicon Valley",
  //       state: "California",
  //       country: "United States of America",
  //     },
  //   };
  //   const res1 = await Alumni.create(newAlumni);
  //   if (!res1) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Could not create the student",
  //     });
  //   }
  //   res.status(200).json({
  //     success: true,
  //     message: "Student created successfully",
  //   });
  // } catch (error) {
  //   next(error);
  // }
  // inserting entries using the file
  // const data = JSON.parse(
  //   fs.readFileSync("mentorship_portal.alumni_datas.json", "utf8")
  // );
  // // Extract the records and insert them into the database
  // data.forEach((item) => {
  //   const { _id, __v, ...dataWithoutIdAndV } = item; // Exclude _id and __v fields
  //   console.log(dataWithoutIdAndV);
  //   const document = new Alumni(dataWithoutIdAndV);
  //   document
  //     .save()
  //     .then((doc) => {
  //       console.log("Document inserted:", doc);
  //     })
  //     .catch((err) => {
  //       console.error("Error inserting document:", err);
  //     });
  // });
  // const data = JSON.parse(
  //   fs.readFileSync("mentorship_portal.students.json", "utf8")
  // );
  // // Extract the records and insert them into the database
  // data.forEach((item) => {
  //   const { _id, __v, ...dataWithoutIdAndV } = item; // Exclude _id and __v fields
  //   console.log(dataWithoutIdAndV);
  //   const document = new Student(dataWithoutIdAndV);
  //   document
  //     .save()
  //     .then((doc) => {
  //       console.log("Document inserted:", doc);
  //     })
  //     .catch((err) => {
  //       console.error("Error inserting document:", err);
  //     });
  // });
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
  // try {
  //   const documentIdToDelete = new mongoose.Types.ObjectId(req.query.id);
  //   const user_type = req.query.user_type;

  //   if (user_type === "student") {
  //     console.log("id", documentIdToDelete);
  //     const document = await Student.findByIdAndDelete(documentIdToDelete);
  //     if (!document) {
  //       console.error("Error finding and deleting document, student");
  //       return;
  //     }

  //     if (document) {
  //       // Insert the document into the new collection
  //       const res1 = BlockedStudent.create(document);
  //       console.log("res1", res1);
  //       if (!res1) {
  //         console.error("Error inserting document into new collection:");
  //         return;
  //       }

  //       console.log(
  //         "Document moved to new collection and deleted from Collection A."
  //       );
  //     } else {
  //       console.log(
  //         "No document found in Collection A with the specified _id."
  //       );
  //     }
  //   } else if (user_type === "alumni") {
  //     const document = await Alumni.findByIdAndDelete(documentIdToDelete);
  //     if (!document) {
  //       console.error("Error finding and deleting document, alumni");
  //       return;
  //     }

  //     if (document) {
  //       // Insert the document into the new collection
  //       const res1 = BlockedAlumni.create(document);
  //       if (!res1) {
  //         console.error("Error inserting document into new collection:");
  //         return;
  //       }

  //       console.log(
  //         "Document moved to new collection and deleted from Collection A."
  //       );
  //     } else {
  //       console.log(
  //         "No document found in Collection A with the specified _id."
  //       );
  //     }
  //   } else {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Could not find the user",
  //     });
  //   }

  //   res.status(200).json({
  //     success: true,
  //     message: "User deleted successfully",
  //   });
  // } catch (error) {
  //   next(error);
  // }
};
