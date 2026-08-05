// server/app.js

import express from "express";
import cors from "cors";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
// ✅ CORS FIX (put this BEFORE everything)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// middlewares
app.use(express.json());

// routes
app.use("/api/resumes", resumeRouter);
app.use("/api/users", userRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("server is live");
});

export default app;
