import "dotenv/config";
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

jest.unstable_mockModule("../configs/imageKit.js", () => ({
  default: {
    upload: jest.fn(),
  },
}));

jest.unstable_mockModule("../configs/ai.js", () => ({
  default: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

const app = (await import("../app.js")).default;

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());

  console.log("Connected to in-memory MongoDB");
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();

  await mongoServer.stop();

  console.log("Closed in-memory MongoDB");
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const email = `test${Date.now()}@example.com`;

    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email,
      password: "123456",
    });

    expect([200, 201]).toContain(res.statusCode);

    expect(res.body).toHaveProperty("token");
  });

  it("should login existing user", async () => {
    const email = `login${Date.now()}@example.com`;

    const password = "123456";

    await request(app).post("/api/users/register").send({
      name: "Login User",
      email,
      password,
    });

    const res = await request(app).post("/api/users/login").send({
      email,
      password,
    });

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("token");
  });

  // TASK 4 TEST 1
  it("should reject login with wrong password", async () => {
    const email = `wrong${Date.now()}@example.com`;

    await request(app).post("/api/users/register").send({
      name: "Wrong Password User",
      email,
      password: "123456",
    });

    const res = await request(app).post("/api/users/login").send({
      email,
      password: "wrongpassword",
    });

    expect([400, 401]).toContain(res.statusCode);
  });

  // TASK 4 TEST 2
  it("should reject duplicate email registration", async () => {
    const email = `duplicate${Date.now()}@example.com`;

    await request(app).post("/api/users/register").send({
      name: "Duplicate User",
      email,
      password: "123456",
    });

    const res = await request(app).post("/api/users/register").send({
      name: "Duplicate User Again",
      email,
      password: "123456",
    });

    expect([400, 409]).toContain(res.statusCode);
  });

  // TASK 4 TEST 3
  it("should reject request without token", async () => {
    const res = await request(app).get("/api/users/data");

    expect(res.statusCode).toBe(401);
  });

  // TASK 4 TEST 4
  it("should reject invalid token", async () => {
    const res = await request(app)
      .get("/api/users/data")
      .set("Authorization", "Bearer invalid.token.value");

    expect(res.statusCode).toBe(401);
  });

  it("should deny user A accessing user B resume", async () => {
    // Create User A

    const userA = await request(app)
      .post("/api/users/register")
      .send({
        name: "User A",
        email: `userA${Date.now()}@example.com`,
        password: "123456",
      });

    const tokenA = userA.body.token;

    // Create User B

    const userB = await request(app)
      .post("/api/users/register")
      .send({
        name: "User B",
        email: `userB${Date.now()}@example.com`,
        password: "123456",
      });

    const tokenB = userB.body.token;

    // User B creates resume

    const resume = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Private Resume",
      });

    const resumeId = resume.body.resume._id;

    // User A tries accessing User B resume

    const res = await request(app)
      .get(`/api/resumes/get/${resumeId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect([401, 403, 404]).toContain(res.statusCode);
  });
});
