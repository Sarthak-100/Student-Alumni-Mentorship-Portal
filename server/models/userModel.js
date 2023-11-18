import mongoose from "mongoose";

// const stdRegisteredSchema = mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   more_info: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: null,
//   },
//   img: {
//     type: String,
//     default: "",
//   },
// });
// export const StudentRegistered = mongoose.model(
//   "sudentRegistered",
//   stdRegisteredSchema
// );

export const Student = mongoose.model("student", {});

export const Alumni = mongoose.model("Alumni_Data", {});

// export const Alumni = mongoose.model("alumni", alumniSchema);
// const adminSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//   },
//   img: {
//     type: String,
//     default:
//       "https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600",
//   },
//   chat_model: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: null,
//   },
// });

export const Admin = mongoose.model("admin", {});
