import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "mentorship_portal",
    })
    .then(() => {
      console.log("App database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDB;