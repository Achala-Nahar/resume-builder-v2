import gemini from "../configs/gemini.js";
import Resume from "../Models/resume.js";

// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || !userContent.trim()) {
      return res.status(400).json({
        message: "Professional summary is required",
      });
    }

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: userContent,
      config: {
        systemInstruction:
          "You are an expert resume writer. Enhance the user's professional summary into 1-2 concise, compelling, ATS-friendly sentences. Highlight relevant skills, experience, achievements, and career objectives. Return only the improved professional summary.",
      },
    });

    const enhancedContent = response.text;

    if (!enhancedContent) {
      return res.status(500).json({
        message: "Gemini returned an empty response",
      });
    }

    return res.status(200).json({
      enhancedContent,
    });
  } catch (error) {
    console.error("PROFESSIONAL SUMMARY AI ERROR:", error);

    return res.status(error.status || 500).json({
      message: "Failed to enhance professional summary",
    });
  }
};

// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || !userContent.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: userContent,
      config: {
        systemInstruction:
          "You are an expert resume writer. Enhance the job description into 1-2 concise, compelling, ATS-friendly sentences. Highlight key responsibilities and achievements. Use strong action verbs and quantifiable results where possible. Return only the improved job description.",
      },
    });

    const enhancedContent = response.text;

    if (!enhancedContent) {
      return res.status(500).json({
        message: "Gemini returned an empty response",
      });
    }

    return res.status(200).json({
      enhancedContent,
    });
  } catch (error) {
    console.error("JOB DESCRIPTION AI ERROR:", error);

    return res.status(error.status || 500).json({
      message: "Failed to enhance job description",
    });
  }
};

// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.user.userId;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    const userPrompt = `Extract structured data from this resume:

${resumeText}

Provide data in the following JSON format with no additional text before or after:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}`;

    const systemPrompt =
      "You are an expert AI agent that extracts structured information from resumes. Return only valid JSON matching the requested structure. Do not include markdown, explanations, or additional text.";

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const extractedData = response.text;

    if (!extractedData) {
      return res.status(500).json({
        message: "Gemini returned an empty response",
      });
    }

    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.status(200).json({
      resumeId: newResume._id,
    });
  } catch (error) {
    console.error("RESUME UPLOAD AI ERROR:", error);

    return res.status(error.status || 500).json({
      message: "Failed to process resume",
    });
  }
};
