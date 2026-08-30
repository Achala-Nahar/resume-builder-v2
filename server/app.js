import "dotenv/config";
import express from "express";
import cors from "cors";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/resumes", resumeRouter);
app.use("/api/users", userRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("server is live");
});

export default app;
