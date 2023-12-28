import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();

// Connect to MongoDB database
mongoose.connect("mongodb://localhost/myapp", { useNewUrlParser: true });

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create user model
const User = mongoose.model("User", userSchema);

// Use body-parser middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Define route for registering a user
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Create new user object
  const user = new User({ name, email, password });

  // Save user to database
  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error registering user");
    } else {
      res.send("User registered successfully");
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});