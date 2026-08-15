import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
  testGeminiConnection,
  testGeminiChat,
} from "../controllers/aiController.js";

const aiRouter = express.Router();
aiRouter.get("/test-gemini-chat", testGeminiChat);
aiRouter.get("/test-gemini", testGeminiConnection);
aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);

export default aiRouter;
