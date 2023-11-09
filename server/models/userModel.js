import { Int32 } from "mongodb";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  // user_type: {
  //   type: String,
  //   enum: ["student", "alumni", "admin"],
  //   required: true,
  // },
  // more_info: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   refPath: "user_type",
  //   default: null,
  // },
  more_info: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
export const User = mongoose.model("user", userSchema);

const alumniSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  current_work: {
    type: Object,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  img: {
    type: String,
    default:
      "https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
});
export const Alumni = mongoose.model("alumni", alumniSchema);

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  roll_no: {
    type: Number,
    required: true,
    unique: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
});
export const Student = mongoose.model("student", studentSchema);

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
export const Admin = mongoose.model("admin", adminSchema);
