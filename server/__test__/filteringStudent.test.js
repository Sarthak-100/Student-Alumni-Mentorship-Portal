import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Suite 4: Filtering Student", () => {
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

  it('GET api/v1/filter-student/student_values should retrieve distinct values', async () => {
    const response = await request(app).get('/api/v1/filter-student/student_values');
    expect(response.status).toBe(200);
    
    const responseBody = response.body;
    // Iterate through keys in the response body to check for distinctness
    Object.keys(responseBody).forEach((key) => {
      const values = responseBody[key];
      expect(new Set(values).size).toBe(values.length);
    });
  });

  it('GET api/v1/filter-student/student_prefix?prefix=s should filter by prefix s', async () => {
    const response = await request(app).get('/api/v1/filter-student/student_prefix?prefix=s');
    expect(response.status).toBe(200);
    
    const entities = response.body.result; // Assuming the entities are under 'result' key
    // Validate if the 'name' field of each entity starts with 's'
    entities.forEach((entity) => {
      expect(entity.name.toLowerCase().startsWith('s')).toBe(true);
    });
  });

  it('GET api/v1/filter-student/getStudentNameById?studentId=x should return student name with id x', async () => {
    const response = await request(app).get('/api/v1/filter-student/getStudentNameById?studentId=65739750934a5781e193615f');
    const expectedResponse = {
        studentName: 'Sarthak Maini'
      };
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
    
  });

  it('GET api/v1/filter-student/student_filter?batch=2020 should filter student profiles with batch = 2020', async () => {
    const response = await request(app).get('/api/v1/filter-student/student_filter?batch=2020');
    expect(response.status).toBe(200);
    
    const entities = response.body.result; // Assuming the entities are under 'result' key

    entities.forEach((entity) => {
      expect(entity.batch).toBe(2020);
    });
    });

  });