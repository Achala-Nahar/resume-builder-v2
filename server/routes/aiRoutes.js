import express from "express";
import protect from "../middlewares/authMiddleware.js";
import aiRateLimiter from "../middlewares/aiRateLimiter.js";

import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

// Authenticate first, then apply the shared AI request limit.
aiRouter.use(protect);
aiRouter.use(aiRateLimiter);

aiRouter.post("/enhance-pro-sum", enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", enhanceJobDescription);
aiRouter.post("/upload-resume", uploadResume);

export default aiRouter;
