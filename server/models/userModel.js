import mongoose from "mongoose";

const stdRegisteredSchema = mongoose.Schema({
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
  more_info: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  img: {
    type: String,
    default:
      "https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  chat_model: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
export const StudentRegistered = mongoose.model(
  "sudentRegistered",
  stdRegisteredSchema
);

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
  chat_model: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});
export const Alumni = mongoose.model("alumni", alumniSchema);

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
  img: {
    type: String,
    default:
      "https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  chat_model: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});
export const Admin = mongoose.model("admin", adminSchema);
