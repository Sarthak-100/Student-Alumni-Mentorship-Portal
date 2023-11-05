import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  user_name: {
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
  user_type: {
    type: String,
    enum: ["student", "alumni", "admin"],
    required: true,
  },
  more_info: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "user_type",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
export const User = mongoose.model("User", userSchema);
// export default User;

const studentSchema = mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
export const Student = mongoose.model("student", studentSchema);

const alumniSchema = mongoose.Schema({
  batch: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  current_work: {
    // {company_name: "xyz", designation: "abc", timeperiod: "2 years"}
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
export const Alumni = mongoose.model("alumni", alumniSchema);

const adminSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
export const Admin = mongoose.model("admin", adminSchema);
