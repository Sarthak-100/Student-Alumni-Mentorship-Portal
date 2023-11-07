import request from "supertest";
// const app = require('../your-express-app'); // Make sure to import your Express app
import app from "../app.js";
import mongoose from "mongoose";

describe("GET /api/data", () => {
  beforeAll(async () => {
    // Connect to a test database before running tests
    await mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "mentorship_portal",
      })
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  afterAll(async () => {
    // Disconnect from the test database after running tests
    await mongoose.disconnect();
  });

  it("responds with JSON containing a message", async () => {
    const response = await request(app).get("/api/data");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "This is a sample response" });
  });

  it("User Login", async () => {
    const user = {
      email: "ad1@iiitd.ac.in",
      password: "ad1p",
      user_type: "admin",
    };
    const response = await request(app).get("/api/v1/users/login").send(user);
    expect(response.status).toBe(200);
  }, 30000);
});
