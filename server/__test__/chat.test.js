import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Suite 1: Chat Feature", () => {
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

    it('GET http://localhost:4000/api/v1/conversations/getConversations should contain user ID in members array for all entities', async () => {
      const userId = '6557abab3edbce75ade9d46f'; // User ID to check

      const response = await request(app)
          .get('/api/v1/conversations/getConversations?user_id=6557abab3edbce75ade9d46f');

      expect(response.status).toBe(200);

      const responseArray = response.body;

      // Check if the user ID is present in the members array for all entities
      responseArray.forEach(entity => {
          expect(entity.members).toContain(userId);
      });
    });

    it('GET http://localhost:4000/api/v1/messages/getMessages?conversationId=6557cefaa2f06ac2f465cbeb should filter messages by given conversation Id', async () => {
      const response = await request(app).get('/api/v1/messages/getMessages?conversationId=6557cefaa2f06ac2f465cbeb');
      expect(response.status).toBe(200);

      const messages = response.body; // Assuming the response body contains the array of messages
      expect(Array.isArray(messages)).toBe(true); // Check if it's an array

      messages.forEach(message => {
          expect(message.conversationId).toBe('6557cefaa2f06ac2f465cbeb'); // Check if each _id matches the conversationId
      });
    });

    it('POST http://localhost:4000/api/v1/conversations/newConversation should include sender and receiver in members array in response', async () => {
      const requestBody = {
          "senderId": "6557abab3edbce75ade9d46f",
          "receiverId": "6553bf1092213e0210f5c8cf"
      };

      const response = await request(app)
          .post('/api/v1/conversations/newConversation')
          .send(requestBody);

      expect(response.status).toBe(200);

      const responseBody = response.body;
      expect(responseBody.members).toContain("6557abab3edbce75ade9d46f"); // Check if senderId is in members
      expect(responseBody.members).toContain("6553bf1092213e0210f5c8cf"); // Check if receiverId is in members
    });

    it('POST http://localhost:4000/api/v1/messages/newMessage should match sent parameters in response', async () => {
      const requestBody = {
          "sender": "6557abab3edbce75ade9d46f",
          "text": "newMessage",
          "conversationId": "6557cefaa2f06ac2f465cbeb"
      };
  
      const response = await request(app)
          .post('/api/v1/messages/newMessage')
          .send(requestBody);
  
      expect(response.status).toBe(200);
  
      const responseBody = response.body;
  
      // Check if the fields in the response match the corresponding fields in the request
      expect(responseBody.sender).toBe(requestBody.sender);
      expect(responseBody.text).toBe(requestBody.text);
      expect(responseBody.conversationId).toBe(requestBody.conversationId);
  });

  it('GET /api/v1/conversations/conversationsByDate should return status 200 and distinct IDs', async () => {
    // Simulate the API call or use a mock function to get the response
    const response = await request(app).get('/api/v1/conversations/conversationsByDate');
  
    // Verify the status code
    expect(response.status).toBe(200);
  
    // Parse the response body
    const responseBody = JSON.parse(response.text);
  
    // Verify that IDs are distinct
    const ids = responseBody.map(item => item._id);
    const uniqueIds = new Set(ids);
  
    expect(uniqueIds.size).toEqual(ids.length);
  });

});