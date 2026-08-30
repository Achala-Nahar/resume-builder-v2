import "dotenv/config";
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import fs from "fs";
import path from "path";

process.env.JWT_SECRET = "test-secret";
process.env.GEMINI_MODEL = "test-model";

jest.unstable_mockModule("../configs/gemini.js", () => ({
  default: {
    models: {
      generateContent: jest.fn(),
    },
  },
}));

jest.unstable_mockModule("../configs/imageKit.js", () => ({
  default: {
    files: {
      upload: jest.fn(),
    },
    upload: jest.fn(),
  },
}));

const app = (await import("../app.js")).default;
const { default: gemini } = await import("../configs/gemini.js");

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

  jest.clearAllMocks();
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
      password: "12345678",
    });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("token");
  });

  it("should login existing user", async () => {
    const email = `login${Date.now()}@example.com`;
    const password = "12345678";

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

  it("should reject login with wrong password", async () => {
    const email = `wrong${Date.now()}@example.com`;

    await request(app).post("/api/users/register").send({
      name: "Wrong Password User",
      email,
      password: "12345678",
    });

    const res = await request(app).post("/api/users/login").send({
      email,
      password: "wrongpassword",
    });

    expect([400, 401]).toContain(res.statusCode);
  });

  it("should reject duplicate email registration", async () => {
    const email = `duplicate${Date.now()}@example.com`;

    await request(app).post("/api/users/register").send({
      name: "Duplicate User",
      email,
      password: "12345678",
    });

    const res = await request(app).post("/api/users/register").send({
      name: "Duplicate User Again",
      email,
      password: "12345678",
    });

    expect([400, 409]).toContain(res.statusCode);
  });

  it("should reject request without token", async () => {
    const res = await request(app).get("/api/users/data");

    expect(res.statusCode).toBe(401);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .get("/api/users/data")
      .set("Authorization", "Bearer invalid.token.value");

    expect(res.statusCode).toBe(401);
  });
});

describe("Resume API", () => {
  it("should deny user A from accessing user B resume", async () => {
    const userA = await request(app)
      .post("/api/users/register")
      .send({
        name: "User A",
        email: `userA${Date.now()}@example.com`,
        password: "12345678",
      });

    const userB = await request(app)
      .post("/api/users/register")
      .send({
        name: "User B",
        email: `userB${Date.now()}@example.com`,
        password: "12345678",
      });

    const tokenA = userA.body.token;
    const tokenB = userB.body.token;

    const resume = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Private Resume",
      });

    const resumeId = resume.body.resume._id;

    const res = await request(app)
      .get(`/api/resumes/get/${resumeId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(404);
  });

  it("should update user's own resume", async () => {
    const user = await request(app)
      .post("/api/users/register")
      .send({
        name: "Update User",
        email: `update${Date.now()}@example.com`,
        password: "12345678",
      });

    const token = user.body.token;

    const resume = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Original Resume",
      });

    const resumeId = resume.body.resume._id;

    const res = await request(app)
      .put(`/api/resumes/${resumeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          title: "Updated Resume",
          professional_summary: "Updated summary",
        },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.resume.title).toBe("Updated Resume");
    expect(res.body.resume.professional_summary).toBe("Updated summary");
  });

  it("should deny user A from updating user B resume", async () => {
    const userA = await request(app)
      .post("/api/users/register")
      .send({
        name: "User A",
        email: `updateA${Date.now()}@example.com`,
        password: "12345678",
      });

    const userB = await request(app)
      .post("/api/users/register")
      .send({
        name: "User B",
        email: `updateB${Date.now()}@example.com`,
        password: "12345678",
      });

    const tokenA = userA.body.token;
    const tokenB = userB.body.token;

    const resume = await request(app)
      .post("/api/resumes/create")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "User B Resume",
      });

    const resumeId = resume.body.resume._id;

    const res = await request(app)
      .put(`/api/resumes/${resumeId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        resumeData: {
          title: "Hacked Resume",
        },
      });

    expect(res.statusCode).toBe(404);

    const verify = await request(app)
      .get(`/api/resumes/get/${resumeId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(verify.statusCode).toBe(200);
    expect(verify.body.resume.title).toBe("User B Resume");
  });

  it("should upload a resume file", async () => {
    const user = await request(app)
      .post("/api/users/register")
      .send({
        name: "Upload User",
        email: `upload${Date.now()}@example.com`,
        password: "12345678",
      });

    const token = user.body.token;

    const testFile = path.join(process.cwd(), `test-resume-${Date.now()}.pdf`);

    fs.writeFileSync(testFile, "%PDF-1.4\nTest resume content\n%%EOF");

    try {
      const res = await request(app)
        .post("/api/resumes/upload")
        .set("Authorization", `Bearer ${token}`)
        .field("title", "Uploaded Resume")
        .attach("resume", testFile, {
          filename: "test-resume.pdf",
          contentType: "application/pdf",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("resume");
      expect(res.body.resume.title).toBe("Uploaded Resume");
      expect(res.body.resume.resume_file).toBeTruthy();
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });
});

describe("AI API", () => {
  it("should enhance professional summary using Gemini", async () => {
    gemini.models.generateContent.mockResolvedValue({
      text: "Experienced software engineer skilled in Java and React.",
    });

    const user = await request(app)
      .post("/api/users/register")
      .send({
        name: "AI User",
        email: `ai${Date.now()}@example.com`,
        password: "12345678",
      });

    const token = user.body.token;

    const res = await request(app)
      .post("/api/ai/enhance-pro-sum")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userContent: "I am a software developer with Java skills.",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.enhancedContent).toBe(
      "Experienced software engineer skilled in Java and React.",
    );
    expect(gemini.models.generateContent).toHaveBeenCalledTimes(1);
  });

  it("should enhance job description using Gemini", async () => {
    gemini.models.generateContent.mockResolvedValue({
      text: "Developed scalable web applications using React and Node.js.",
    });

    const user = await request(app)
      .post("/api/users/register")
      .send({
        name: "AI Job User",
        email: `aijob${Date.now()}@example.com`,
        password: "12345678",
      });

    const token = user.body.token;

    const res = await request(app)
      .post("/api/ai/enhance-job-desc")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userContent: "Worked on web applications.",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.enhancedContent).toBe(
      "Developed scalable web applications using React and Node.js.",
    );
    expect(gemini.models.generateContent).toHaveBeenCalledTimes(1);
  });

  it("should extract resume data using Gemini", async () => {
    gemini.models.generateContent.mockResolvedValue({
      text: JSON.stringify({
        professional_summary: "Software developer with strong backend skills.",
        skills: ["Java", "Node.js", "MongoDB"],
        personal_info: {
          image: "",
          full_name: "Test User",
          profession: "Software Developer",
          email: "test@example.com",
          phone: "",
          location: "Indore",
          linkedin: "",
          website: "",
        },
        experience: [],
        project: [],
        education: [],
      }),
    });

    const user = await request(app)
      .post("/api/users/register")
      .send({
        name: "Resume AI User",
        email: `resumeai${Date.now()}@example.com`,
        password: "12345678",
      });

    const token = user.body.token;

    const res = await request(app)
      .post("/api/ai/upload-resume")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "AI Resume",
        resumeText:
          "Test User is a software developer skilled in Java, Node.js and MongoDB.",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("resumeId");
    expect(gemini.models.generateContent).toHaveBeenCalledTimes(1);
  });
});
