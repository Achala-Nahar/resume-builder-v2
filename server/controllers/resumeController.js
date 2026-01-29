// controller for creating a new resume
import fs from "fs";
import Resume from "../Models/resume.js";
import imagekit from "../configs/imageKit.js";
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    // create new resume
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
    // return success message
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// controller for deleting a resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });

    // return success message
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//get user resume by id:
// /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Clean up the object before returning
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public
// GET: /api/resumes/public
// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    // Error handling as implied by previous patterns
    return res.status(400).json({ message: error.message });
  }
};
// controller for updating a resume
// PUT: /api/resumes/update
// export const updateResume = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { resumeId } = req.params;
//     console.log("BODY:", req.body);
//     console.log("FILES:", req.file);

//     const { resumeData, removeBackground } = req.body;
//     const image = req.file;

//     let resumeDataCopy;
//     if (typeof resumeData === "string") {
//       resumeDataCopy = JSON.parse(resumeData);
//     } else {
//       resumeDataCopy = structuredClone(resumeData);
//     }

//     if (image) {
//       const imageBufferData = fs.createReadStream(image.path);
//       const response = await imagekit.files.upload({
//         file: imageBufferData,
//         fileName: "resume.png",
//         folder: "user-resumes",
//         transformation: {
//           pre:
//             "w-300,h-300,fo-face,z-0.75" +
//             (removeBackground ? ",e-bgremove" : ""),
//         },
//       });
//       resumeDataCopy.personal_info.image = response.url;
//     }

//     const resume = await Resume.findOneAndUpdate(
//       { userId, _id: resumeId },
//       resumeDataCopy,
//       { new: true },
//     );
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }
//     return res.status(200).json({ message: "Saved successfully", resume });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };
export const updateResume = async (req, res) => {
  try {
    const userId = req.user.userId;

    // ❌ BUG 1 FIX: req.params is an object
    const { resumeId } = req.params;

    console.log("BODY:", req.body);
    console.log("FILES:", req.file);

    const { resumeData, removeBackground } = req.body;
    const image = req.file;

    // Parse resumeData safely
    let resumeDataCopy =
      typeof resumeData === "string"
        ? JSON.parse(resumeData)
        : structuredClone(resumeData);

    // ❌ BUG 2 FIX: remove immutable / forbidden fields
    delete resumeDataCopy._id;
    delete resumeDataCopy.userId;
    delete resumeDataCopy.createdAt;
    delete resumeDataCopy.updatedAt;
    delete resumeDataCopy.__v;

    // Handle image upload
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

    // ❌ BUG 3 FIX: validate ownership + id correctly
    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true },
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume,
    });
  } catch (error) {
    console.error("UPDATE RESUME ERROR:", error);
    return res.status(400).json({ message: error.message });
  }
};

// ✅ FIX: controller required for GET /api/resumes
export const getAllResumes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const resumes = await Resume.find({ userId });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
