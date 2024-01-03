import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Suite 2: Filtering Alumni", () => {
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

  it('GET /api/v1/student/filter-alumni/values should retrieve distinct values', async () => {
    const response = await request(app).get('/api/v1/student/filter-alumni/values');
    expect(response.status).toBe(200);
    
    const responseBody = response.body;
    // Iterate through keys in the response body to check for distinctness
    Object.keys(responseBody).forEach((key) => {
      const values = responseBody[key];
      expect(new Set(values).size).toBe(values.length);
    });
  });

  it('GET /api/v1/student/filter-alumni/alumniPrefix?prefix=s should filter by prefix s', async () => {
    const response = await request(app).get('/api/v1/student/filter-alumni/alumniPrefix?prefix=s');
    expect(response.status).toBe(200);
    
    const entities = response.body.result; // Assuming the entities are under 'result' key
    // Validate if the 'name' field of each entity starts with 's'
    entities.forEach((entity) => {
      expect(entity.name.toLowerCase().startsWith('s')).toBe(true);
    });
  });

  it('GET /api/v1/student/filter-alumni/search?current_role=Software+Engineer should filter alumni profiles with current_role=Software+Engineer', async () => {
    const response = await request(app).get('/api/v1/student/filter-alumni/search?current_role=Software+Engineer');
    expect(response.status).toBe(200);
    
    const entities = response.body.result; // Assuming the entities are under 'result' key

    entities.forEach((entity) => {
      expect(entity.work.role).toBe('Software Engineer');
    });
  });

  it('GET api/v1/student/filter-alumni/getAlumniNameById?alumniId=x should return alumni name with id x', async () => {
    const response = await request(app).get('/api/v1/student/filter-alumni/getAlumniNameById?alumniId=657396f6a4b2925807819b05');
    const expectedResponse = {
        alumniName: 'Harshit Jain'
      };
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
    
  });
  

});