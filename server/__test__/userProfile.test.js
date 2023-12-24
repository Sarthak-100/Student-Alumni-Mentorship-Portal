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
      const userEmail = 'admin@iiitd.ac.in'; // Expected email
  
      const response = await request(app)
          .get('/api/v1/users/myProfile?email=admin@iiitd.ac.in');
  
      expect(response.status).toBe(200);
  
      const responseBody = response.body;
  
      // Check if the email in the response matches the expected email
      expect(responseBody.success).toBe(true);
      expect(responseBody.user.email).toBe(userEmail);
    });
  
    //Student
    it('GET http://localhost:4000/api/v1/users/getUserProfile should return correct user ID', async () => {
        const userId = '65739750934a5781e193615f'; // Expected user ID
  
        const response = await request(app)
            .get('/api/v1/users/getUserProfile?id=65739750934a5781e193615f');
  
        expect(response.status).toBe(200);
  
        const responseBody = response.body;
  
        // Check if the ID in the response matches the expected user ID
        expect(responseBody.success).toBe(true);
        expect(responseBody.user._id).toBe(userId);
    });

    //Alumni
    it('GET http://localhost:4000/api/v1/users/getUserProfile should return correct user ID', async () => {
        const userId = '657396f6a4b2925807819af2'; // Expected user ID
  
        const response = await request(app)
            .get('/api/v1/users/getUserProfile?id=657396f6a4b2925807819af2');
  
        expect(response.status).toBe(200);
  
        const responseBody = response.body;
  
        // Check if the ID in the response matches the expected user ID
        expect(responseBody.success).toBe(true);
        expect(responseBody.user._id).toBe(userId);
    });

    //Admin
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


    it('GET http://localhost:4000/api/v1/users/getBatchwiseCounts should return unique batches', async () => {
      // Simulate the API call or use a mock function to get the response
      const response = await request(app).get('/api/v1/users/getBatchwiseCounts');
    
      expect(response.status).toBe(200);
      
      // Parse the response text to extract the JSON content
      const responseBody = JSON.parse(response.text);
    
      // Verify if the parsed JSON content has the expected structure
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody).toHaveProperty('alumniCounts');
      expect(responseBody).toHaveProperty('studentCounts');
    
      // Verify alumniCounts data
      const alumniCounts = responseBody.alumniCounts;
      const alumniIds = alumniCounts.map(item => item._id);
      const uniqueAlumniIds = new Set(alumniIds);
      expect(uniqueAlumniIds.size).toEqual(alumniIds.length);
    
      // Verify studentCounts data
      const studentCounts = responseBody.studentCounts;
      const studentIds = studentCounts.map(item => item._id);
      const uniqueStudentIds = new Set(studentIds);
      expect(uniqueStudentIds.size).toEqual(studentIds.length);
    });
  
  });