import mongoose from "mongoose";

const connectDB = async () => {
  // const MONGODB_URI = process.env.MONGO_URI;

  // await mongoose.connect(MONGODB_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // const db = mongoose.connection;

  // db.on("error", (err) => {
  //   console.error("MongoDB connection error:", err);
  //   process.exit(1);
  // });

  // db.once("open", () => {
  //   console.log("Connected to MongoDB");
  // });

  // Handle process termination (e.g., Ctrl+C)
  // process.on("SIGINT", () => {
  //   mongoose.connection.close(() => {
  //     console.log("MongoDB connection closed");
  //     process.exit(0);
  //   });
  // });
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
