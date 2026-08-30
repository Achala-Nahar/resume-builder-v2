import express from "express";
import rateLimit from "express-rate-limit";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
} from "../controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginLimiter, loginUser);

userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter;
