import rateLimit from "express-rate-limit";

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user.userId.toString(),
  message: {
    message: "AI request limit reached. Please try again in 15 minutes.",
  },
});

export default aiRateLimiter;
