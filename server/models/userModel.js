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
const User = mongoose.model("User", userSchema);

const studentSchema = mongoose.Schema({
  studentId: {
    type: String,
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
const Student = mongoose.model("User", studentSchema);

const alumniSchema = mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
  current_work: {
    // {company_name: "xyz", designation: "abc", work_exprerience: "2 years"}
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
const Alumni = mongoose.model("User", studentSchema);

export default { User, Student, Alumni };
