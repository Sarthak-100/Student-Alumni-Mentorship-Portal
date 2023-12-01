import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Suite 3: User Profile", () => {
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
    
    it('GET http://localhost:4000/api/v1/users/myProfile should return correct user email', async () => {
      const userEmail = 'sarthak20576@iiitd.ac.in'; // Expected email
  
      const response = await request(app)
          .get('/api/v1/users/myProfile?email=sarthak20576@iiitd.ac.in');
  
      expect(response.status).toBe(200);
  
      const responseBody = response.body;
  
      // Check if the email in the response matches the expected email
      expect(responseBody.success).toBe(true);
      expect(responseBody.user.email).toBe(userEmail);
    });

    it('GET http://localhost:4000/api/v1/users/myProfile should return correct user email', async () => {
      const userEmail = 'sarthak11098@iiitd.ac.in'; // Expected email
  
      const response = await request(app)
          .get('/api/v1/users/myProfile?email=sarthak11098@iiitd.ac.in');
  
      expect(response.status).toBe(200);
  
      const responseBody = response.body;
  
      // Check if the email in the response matches the expected email
      expect(responseBody.success).toBe(true);
      expect(responseBody.user.email).toBe(userEmail);
    });

    it('GET http://localhost:4000/api/v1/users/myProfile should return correct user email', async () => {
      const userEmail = 'ad1@iiitd.ac.in'; // Expected email
  
      const response = await request(app)
          .get('/api/v1/users/myProfile?email=ad1@iiitd.ac.in');
  
      expect(response.status).toBe(200);
  
      const responseBody = response.body;
  
      // Check if the email in the response matches the expected email
      expect(responseBody.success).toBe(true);
      expect(responseBody.user.email).toBe(userEmail);
    });
  
    it('GET http://localhost:4000/api/v1/users/getUserProfile should return correct user ID', async () => {
        const userId = '6561175367dac2a1bc0257c5'; // Expected user ID
  
        const response = await request(app)
            .get('/api/v1/users/getUserProfile?id=6561175367dac2a1bc0257c5');
  
        expect(response.status).toBe(200);
  
        const responseBody = response.body;
  
        // Check if the ID in the response matches the expected user ID
        expect(responseBody.success).toBe(true);
        expect(responseBody.user._id).toBe(userId);
    });

    it('GET http://localhost:4000/api/v1/users/getUserProfile should return correct user ID', async () => {
        const userId = '6547cb605c2697d2853c0735'; // Expected user ID
  
        const response = await request(app)
            .get('/api/v1/users/getUserProfile?id=6547cb605c2697d2853c0735');
  
        expect(response.status).toBe(200);
  
        const responseBody = response.body;
  
        // Check if the ID in the response matches the expected user ID
        expect(responseBody.success).toBe(true);
        expect(responseBody.user._id).toBe(userId);
    });

    it('GET http://localhost:4000/api/v1/users/getUserProfile should return correct user ID', async () => {
        const userId = '6553bad492213e0210f5c8c9'; // Expected user ID
  
        const response = await request(app)
            .get('/api/v1/users/getUserProfile?id=6553bad492213e0210f5c8c9');
  
        expect(response.status).toBe(200);
  
        const responseBody = response.body;
  
        // Check if the ID in the response matches the expected user ID
        expect(responseBody.success).toBe(true);
        expect(responseBody.user._id).toBe(userId);
    });
  
  
  });