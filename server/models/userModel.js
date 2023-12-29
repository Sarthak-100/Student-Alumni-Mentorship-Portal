import mongoose from "mongoose";

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
  createdAt: {
    type: Date,
    default: Date.now(),
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
  img: {
    type: String,
    default: "",
  },
  removed: {
    type: Boolean,
    default: false,
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
  createdAt: {
    type: Date,
    default: Date.now(),
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
  work: {
    type: Object,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  img: {
    type: String,
    default: "",
  },
  removed: {
    type: Boolean,
    default: false,
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
  img: {
    type: String,
    default: "",
  },
});

export const Admin = mongoose.model("admin", adminSchema);

const blockedAlumniSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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
  img: {
    type: String,
    default: "",
  },
});
export const BlockedAlumni = mongoose.model(
  "blockedAlumni",
  blockedAlumniSchema
);

const blockedStudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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
  work: {
    type: Object,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  img: {
    type: String,
    default: "",
  },
});
export const BlockedStudent = mongoose.model(
  "blockedStudent",
  blockedStudentSchema
);