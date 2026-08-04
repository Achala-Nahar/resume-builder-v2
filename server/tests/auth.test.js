// import "dotenv/config";
// import { jest } from "@jest/globals";
// import mongoose from "mongoose";

// // ✅ Mock ImageKit before importing app
// jest.unstable_mockModule("../configs/imageKit.js", () => ({
//   default: {
//     upload: jest.fn(),
//   },
// }));

// // ✅ Mock OpenAI before importing app
// jest.unstable_mockModule("../configs/ai.js", () => ({
//   default: {
//     chat: {
//       completions: {
//         create: jest.fn(),
//       },
//     },
//   },
// }));

// // ✅ Import DB connector
// const connectDB = (await import("../configs/db.js")).default;

// // ✅ Import app AFTER mocks
// const app = (await import("../app.js")).default;

// import request from "supertest";

// // ✅ Connect database before tests
// beforeAll(async () => {
//   console.log("Connecting test database...");
//   await connectDB();
// });

// // ✅ Close database after tests
// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("Auth API", () => {
//   it("should register a new user", async () => {
//     const uniqueEmail = `test${Date.now()}@example.com`;

//     const res = await request(app).post("/api/users/register").send({
//       name: "Test User",
//       email: uniqueEmail,
//       password: "123456",
//     });

//     console.log("REGISTER RESPONSE:", res.body);

//     expect([200, 201]).toContain(res.statusCode);

//     expect(res.body).toHaveProperty("token");
//   }, 15000);

//   it("should login an existing user", async () => {
//     const uniqueEmail = `login${Date.now()}@example.com`;
//     const password = "123456";

//     // Step 1: Create user
//     await request(app).post("/api/users/register").send({
//       name: "Login Test User",
//       email: uniqueEmail,
//       password,
//     });

//     // Step 2: Login with same credentials
//     const res = await request(app).post("/api/users/login").send({
//       email: uniqueEmail,
//       password,
//     });

//     console.log("LOGIN RESPONSE:", res.body);

//     expect(res.statusCode).toBe(200);

//     expect(res.body).toHaveProperty("token");

//     expect(res.body.message).toBe("Login successful");
//   }, 15000);
// });

import "dotenv/config";
import { jest } from "@jest/globals";
import mongoose from "mongoose";

// ✅ Mock ImageKit before importing app
jest.unstable_mockModule("../configs/imageKit.js", () => ({
  default: {
    upload: jest.fn(),
  },
}));

// ✅ Mock OpenAI before importing app
jest.unstable_mockModule("../configs/ai.js", () => ({
  default: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

// ✅ Import DB connector
const connectDB = (await import("../configs/db.js")).default;

// ✅ Import app AFTER mocks
const app = (await import("../app.js")).default;

import request from "supertest";

// ✅ Connect database before tests
beforeAll(async () => {
  console.log("Connecting test database...");
  await connectDB();
});

// ✅ Close database after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: uniqueEmail,
      password: "123456",
    });

    console.log("REGISTER RESPONSE:", res.body);

    expect([200, 201]).toContain(res.statusCode);

    expect(res.body).toHaveProperty("token");
  }, 15000);

  it("should login an existing user", async () => {
    const uniqueEmail = `login${Date.now()}@example.com`;
    const password = "123456";

    // Step 1: Create user
    await request(app).post("/api/users/register").send({
      name: "Login Test User",
      email: uniqueEmail,
      password,
    });

    // Step 2: Login
    const res = await request(app).post("/api/users/login").send({
      email: uniqueEmail,
      password,
    });

    console.log("LOGIN RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("token");

    expect(res.body.message).toBe("Login successful");
  }, 15000);

  it("should get logged in user data", async () => {
    const uniqueEmail = `userdata${Date.now()}@example.com`;
    const password = "123456";

    // Register user
    await request(app).post("/api/users/register").send({
      name: "User Data Test",
      email: uniqueEmail,
      password,
    });

    // Login user
    const loginRes = await request(app).post("/api/users/login").send({
      email: uniqueEmail,
      password,
    });

    const token = loginRes.body.token;

    // Access protected endpoint
    const res = await request(app)
      .get("/api/users/data")
      .set("Authorization", `Bearer ${token}`);

    console.log("USER DATA RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("user");

    expect(res.body.user.email).toBe(uniqueEmail);
  }, 15000);

  it("should get user's resumes", async () => {
    const uniqueEmail = `resumes${Date.now()}@example.com`;
    const password = "123456";

    // Register user
    await request(app).post("/api/users/register").send({
      name: "Resume User",
      email: uniqueEmail,
      password,
    });

    // Login user
    const loginRes = await request(app).post("/api/users/login").send({
      email: uniqueEmail,
      password,
    });

    const token = loginRes.body.token;

    // Access protected endpoint
    const res = await request(app)
      .get("/api/users/resumes")
      .set("Authorization", `Bearer ${token}`);

    console.log("USER RESUMES RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("resumes");

    expect(Array.isArray(res.body.resumes)).toBe(true);
  }, 15000);

  it("should create a new resume", async () => {
    const uniqueEmail = `resume${Date.now()}@example.com`;
    const password = "123456";

    // Step 1: Register user
    const registerRes = await request(app).post("/api/users/register").send({
      name: "Resume Test User",
      email: uniqueEmail,
      password,
    });

    const token = registerRes.body.token;

    expect(token).toBeDefined();

    // Step 2: Create resume
    const res = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Software Engineer Resume",
      });

    console.log("CREATE RESUME RESPONSE:", res.body);

    expect(res.statusCode).toBe(201);

    expect(res.body.message).toBe("Resume created successfully");

    expect(res.body).toHaveProperty("resume");

    expect(res.body.resume.title).toBe("Software Engineer Resume");
  }, 15000);

  it("should get all resumes of logged in user", async () => {
    const uniqueEmail = `getresume${Date.now()}@example.com`;
    const password = "123456";

    // Step 1: Register user
    const registerRes = await request(app).post("/api/users/register").send({
      name: "Get Resume User",
      email: uniqueEmail,
      password,
    });

    const token = registerRes.body.token;

    expect(token).toBeDefined();

    // Step 2: Create a resume
    const createRes = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Frontend Developer Resume",
      });

    expect(createRes.statusCode).toBe(201);

    const resumeId = createRes.body.resume._id;

    expect(resumeId).toBeDefined();

    // Step 3: Fetch all resumes
    const res = await request(app)
      .get("/api/resumes/")
      .set("Authorization", `Bearer ${token}`);

    console.log("GET ALL RESUMES RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0]._id).toBe(resumeId);
  }, 15000);

  it("should get a resume by id", async () => {
    const uniqueEmail = `singleResume${Date.now()}@example.com`;
    const password = "123456";

    // Register user
    const registerRes = await request(app).post("/api/users/register").send({
      name: "Single Resume User",
      email: uniqueEmail,
      password,
    });

    const token = registerRes.body.token;

    expect(token).toBeDefined();

    // Create resume
    const createRes = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Backend Developer Resume",
      });

    expect(createRes.statusCode).toBe(201);

    const resumeId = createRes.body.resume._id;

    expect(resumeId).toBeDefined();

    // Fetch resume by id
    const res = await request(app)
      .get(`/api/resumes/get/${resumeId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("GET RESUME RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("resume");

    expect(res.body.resume._id).toBe(resumeId);

    expect(res.body.resume.title).toBe("Backend Developer Resume");
  }, 15000);
});
