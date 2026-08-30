import fs from "fs";
import Resume from "../Models/resume.js";
import imagekit from "../configs/imageKit.js";

// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    const newResume = await Resume.create({
      userId,
      title,
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
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("CREATE RESUME ERROR:", error);

    return res.status(500).json({
      message: "Failed to create resume",
    });
  }
};

// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOneAndDelete({
      userId,
      _id: resumeId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESUME ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete resume",
    });
  }
};

// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      userId,
      _id: resumeId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("GET RESUME ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};

// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      public: true,
      _id: resumeId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("GET PUBLIC RESUME ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch public resume",
    });
  }
};

// PUT: /api/resumes/:resumeId
export const updateResume = async (req, res) => {
  const image = req.file;

  try {
    const userId = req.user.userId;
    const { resumeId } = req.params;
    const { resumeData, removeBackground } = req.body;

    let resumeDataCopy;

    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    if (!resumeDataCopy || typeof resumeDataCopy !== "object") {
      return res.status(400).json({
        message: "Invalid resume data",
      });
    }

    delete resumeDataCopy._id;
    delete resumeDataCopy.userId;
    delete resumeDataCopy.createdAt;
    delete resumeDataCopy.updatedAt;
    delete resumeDataCopy.__v;

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      resumeDataCopy.personal_info = {
        ...resumeDataCopy.personal_info,
        image: response.url,
      };
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: resumeId,
        userId,
      },
      {
        $set: resumeDataCopy,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume,
    });
  } catch (error) {
    console.error("UPDATE RESUME ERROR:", error);

    return res.status(500).json({
      message: "Failed to update resume",
    });
  } finally {
    if (image?.path) {
      try {
        await fs.promises.unlink(image.path);
      } catch (cleanupError) {
        console.error("TEMP FILE CLEANUP ERROR:", cleanupError);
      }
    }
  }
};

// GET: /api/resumes
export const getAllResumes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const resumes = await Resume.find({
      userId,
    });

    return res.status(200).json(resumes);
  } catch (error) {
    console.error("GET ALL RESUMES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch resumes",
    });
  }
};
