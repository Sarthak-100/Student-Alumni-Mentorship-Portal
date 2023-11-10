// import mongoose from "mongoose";

// const temp = mongoose.Schema({
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
//   more_info: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: null,
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
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//     required: true,
//   },
// });
// export const Chat = mongoose.model("sudentRegistered", temp);
