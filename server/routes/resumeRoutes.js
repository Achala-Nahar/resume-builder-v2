import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
  getAllResumes,
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";
import Resume from "../Models/resume.js";

const resumeRouter = express.Router();
resumeRouter.get("/", protect, getAllResumes);
resumeRouter.post("/create", protect, createResume);
// resumeRouter.post("/upload", protect, upload.single("resume"), (req, res) => {
//   console.log(req.file);
//   res.json({ message: "File uploaded successfully!" });
// });
resumeRouter.post(
  "/upload",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { title } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resume = await Resume.create({
        userId,
        title,
        resume_file: req.file.filename,
        personal_info: {},
        professional_summary: "",
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: "classic",
        accent_color: "#3B82F6",
        public: false,
      });

      return res.status(201).json({
        message: "Resume uploaded successfully",
        resume,
      });
    } catch (err) {
      console.error("UPLOAD RESUME ERROR:", err);
      return res.status(500).json({ message: err.message });
    }
  },
);

// resumeRouter.put("/update", protect, upload.single("image"), updateResume);
resumeRouter.put("/:resumeId", protect, upload.single("image"), updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResumeById);

export default resumeRouter;
