// import React, { useEffect, useState } from "react";
// import { useParams, Link, data } from "react-router-dom";
// import { dummyResumeData } from "../assets/assets";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   ArrowLeftIcon,
//   User,
//   FileText,
//   Briefcase,
//   GraduationCap,
//   FolderIcon,
//   Sparkles,
// } from "lucide-react";
// import PersonalInfoForm from "../components/PersonalInfoForm";
// import ResumePreview from "../components/ResumePreview";

// const sections = [
//   { id: "personal", name: "Personal Info", icon: User },
//   { id: "summary", name: "Summary", icon: FileText },
//   { id: "experience", name: "Experience", icon: Briefcase },
//   { id: "education", name: "Education", icon: GraduationCap },
//   { id: "projects", name: "Projects", icon: FolderIcon },
//   { id: "skills", name: "Skills", icon: Sparkles },
// ];

// const ResumeBuilder = () => {
//   const [activeSectionIndex, setActiveSectionIndex] = useState(0);
//   const [removeBackground, setRemoveBackground] = useState(false);
//   const activeSection = sections[activeSectionIndex];
//   // const resumeId = useParams();
//   const { id: resumeId } = useParams();

//   console.log("URL resumeId:", resumeId);
//   console.log("Dummy resumes:", dummyResumeData);

//   const [resumeData, setResumeData] = useState({
//     _id: "",
//     title: "",
//     personal_info: {},
//     professional_summary: "",
//     experience: [],
//     education: [],
//     project: [],
//     skills: [],
//     template: "classic",
//     accent_color: "#3B82F6",
//     public: false,
//   });
//   // const loadExistingResume = async () => {
//   //   const resume = dummyResumeData.find((resume) => resume._id === resumeId);
//   //   if (resume) {
//   //     setResumeData(resume);
//   //     document.title = resume.title;
//   //   }
//   // };

//   const loadExistingResume = async () => {
//     if (!resumeId || resumeId === "new") return;
//     const resume = dummyResumeData.find((resume) => {
//       // console.log("Comparing:", resume._id, resumeId);
//       return String(resume._id) === String(resumeId);
//     });
//     if (resume) {
//       setResumeData(resume);
//       document.title = resume.title;
//     }
//   };

//   useEffect(() => {
//     loadExistingResume();
//   }, [resumeId]);
//   return (
//     <div>
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <Link
//           to={"/app"}
//           className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
//         >
//           <ArrowLeftIcon className="size-4" /> Back to Dashboard
//         </Link>
//       </div>
//       <div className="max-w-7xl mx-auto px-4 pb-8">
//         <div className="grid lg:grid-cols-12 gap-8">
//           {/* Left Panel - Form */}
//           <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
//               {/* progress bar using activeSectionIndex */}
//               <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
//               <hr
//                 className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
//                 style={{
//                   width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
//                 }}
//               />
//               {/* Section Navigation */}
//               <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
//                 <div></div>

//                 <div className="flex items-center">
//                   {activeSectionIndex !== 0 && (
//                     <button
//                       onClick={() =>
//                         setActiveSectionIndex((prevIndex) =>
//                           Math.max(prevIndex - 1, 0),
//                         )
//                       }
//                       className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
//                       disabled={activeSectionIndex === 0}
//                     >
//                       <ChevronLeft className="size-4" /> Previous
//                     </button>
//                   )}
//                   <button
//                     onClick={() =>
//                       setActiveSectionIndex((prevIndex) =>
//                         Math.min(prevIndex + 1, sections.length - 1),
//                       )
//                     }
//                     className={`flex
// items-center gap-1 p-3 rounded-lg text-sm font-medium
// text-gray-600 hover:bg-gray-50 transition-all $
// {activeSectionIndex === sections.length - 1 && 'opacity-50'}`}
//                     disabled={activeSectionIndex === sections.length - 1}
//                   >
//                     Next <ChevronRight className="size-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* form content */}
//               <div className="space-y-6">
//                 {activeSection.id === "personal" && (
//                   <PersonalInfoForm
//                     data={resumeData.personal_info}
//                     onChange={(data) => {
//                       setResumeData((prev) => ({
//                         ...prev,
//                         personal_info: data,
//                       }));
//                     }}
//                     removeBackground={removeBackground}
//                     setRemoveBackground={setRemoveBackground}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right panel */}
//           <div className="lg:col-span-7 max-lg:mt-6">
//             <div>{/* ---buttons--- */}</div>
//             <ResumePreview
//               data={resumeData}
//               template={resumeData.template}
//               accentColor={resumeData.accent_color}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeBuilder;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeftIcon,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
  EyeIcon,
  EyeOffIcon,
  Share2Icon,
  DownloadIcon,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
const sections = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "summary", name: "Summary", icon: FileText },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "projects", name: "Projects", icon: FolderIcon },
  { id: "skills", name: "Skills", icon: Sparkles },
];

const ResumeBuilder = () => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const activeSection = sections[activeSectionIndex];
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
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

  //
  const loadExistingResume = async () => {
    if (!resumeId || resumeId === "new") return;
    console.log("resumeId:", resumeId);
    console.log(token);
    try {
      const { data } = await api.get(`/resumes/get/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.resume) {
        setResumeData((prev) => ({
          ...prev,
          ...data.resume,
        }));

        document.title = data.resume.title;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load resume");
    }
  };

  useEffect(() => {
    if (resumeId && token) {
      loadExistingResume();
    }
  }, [resumeId, token]);

  const changeResumeVisibility = async (params) => {
    if (!resumeId || resumeId === "new") {
      toast.error("Save the resume first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );
      console.log("SENDING RESUME DATA:", formData);

      const { data } = await api.put(`/resumes/${resumeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumeData((prev) => ({ ...prev, public: !prev.public }));
      // setResumeData({ ...resumeData, public: !resumeData.public });
      console.log(data.message);
      toast.success(data.message);
    } catch (error) {
      console.log("SAVE RESUME ERROR FULL:", error);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("STATUS:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to save resume");
    }
  };
  // const handleShare = () => {
  //   const frontendUrl = window.location.href.split("/app/")[0];
  //   const resumeUrl = frontendUrl + "/view/" + resumeId;
  //   if (navigator.share) {
  //     navigator.share({ url: resumeUrl, text: "My resume" });
  //   } else {
  //     alert("Share not supported on this browser");
  //   }
  // };
  const handleShare = async () => {
    const frontendUrl = window.location.origin;
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume",
          text: "Check out my resume",
          url: resumeUrl,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      await navigator.clipboard.writeText(resumeUrl);
      alert("Link copied to clipboard");
    }
  };

  const saveResume = async () => {
    if (!resumeId || resumeId === "new") {
      console.log(resumeId);
      toast.error("Save the resume first");
      return;
    }

    try {
      let updatedResumeData = structuredClone(resumeData);

      // remove image from updatedResumeData
      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === "object" &&
        formData.append("image", resumeData.personal_info.image);

      // Your API call logic would likely go here
      const { data } = await api.put(`/resumes/${resumeId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumeData((prev) => ({
        ...prev,
        ...data.resume,
      }));

      // navigate(`/app/builder/${data.resume._id}`, { replace: true });
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadResume = () => {
    window.print();
  };
  // if (!resumeData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <Link
            to={"/app"}
            className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700"
          >
            <ArrowLeftIcon className="size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-8">
        {/* Force a strict grid with no overflow */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Panel: Fixed Width for Form */}
          <div className="w-full lg:w-[450px] sticky top-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1 bg-gray-100 w-full">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{
                    width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                  }}
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6 ">
                  <div className="flex items-center gap-2">
                    <TemplateSelector
                      selectedTemplate={resumeData.template || "classic"}
                      onChange={(template) =>
                        setResumeData((prev) => ({ ...prev, template }))
                      }
                    />

                    <ColorPicker
                      selectedColor={resumeData.accent_color || "#3B82F6"}
                      onChange={(color) =>
                        setResumeData((prev) => ({
                          ...prev,
                          accent_color: color,
                        }))
                      }
                    />
                  </div>
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    className="text-sm font-medium text-gray-500"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1),
                      )
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Next
                  </button>
                </div>

                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>
              {/* <button
                  onClick={() => {
                    toast.promise(saveResume, { loading: "Saving.." });
                  }}
                  className="bg-gradient-to-br from-green-100 to-green-200
  ring-green-300 text-green-600 ring hover:ring-green-400
  transition-all rounded-md px-6 py-2 mt-6 mb-5 ml-6 text-sm"
                >
                  Save Changes
                </button>  */}
              <button
                onClick={() =>
                  toast.promise(saveResume, {
                    loading: "Saving...",
                  })
                }
                className="bg-gradient-to-br from-green-100 to-green-200
  ring-green-300 text-green-600 ring hover:ring-green-400
  transition-all rounded-md px-6 py-2 mt-6 mb-5 ml-6 text-sm
  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel: The Preview "Viewbox" */}
          {/* <div className="flex-1 w-full bg-gray-200 rounded-xl p-6 min-h-[800px] flex justify-center overflow-hidden"> */}
          <div className="relative w-full max-w-[800px] bg-white shadow-2xl h-fit justify-center mt-1.5 ">
            {/* THIS DIV IS THE KEY: It traps the resume inside */}
            <div className="relative w-full max-w-[800px] bg-white shadow-2xl justify-center ">
              <div className="relative w-full">
                <div className=" absolute bottom-3 top-[-100px] left-0 right-0 flex items-center justify-end gap-2">
                  {resumeData.public && (
                    <button
                      onClick={handleShare}
                      className="flex items-center p-2 px-4 gap-2 text-xs
    bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
    rounded-lg ring-blue-300 hover:ring transition-colors"
                    >
                      <Share2Icon className="size-4" /> Share
                    </button>
                  )}
                  <button
                    onClick={changeResumeVisibility}
                    className="flex items-center p-2 px-4 gap-2 text-xs
  bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600
  ring-purple-300 rounded-lg hover:ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resumeData.public ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                    {resumeData.public ? "Public" : "Private"}
                  </button>
                  <button
                    onClick={downloadResume}
                    className="flex items-center gap-2 px-6 py-2 text-xs
  bg-gradient-to-br from-green-100 to-green-200 text-green-600
  rounded-lg ring-green-300 hover:ring transition-colors"
                  >
                    <DownloadIcon className="size-4" /> Download
                  </button>
                </div>
              </div>
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   ArrowLeftIcon,
//   User,
//   FileText,
//   Briefcase,
//   GraduationCap,
//   FolderIcon,
//   Sparkles,
//   EyeIcon,
//   EyeOffIcon,
//   Share2Icon,
//   DownloadIcon,
// } from "lucide-react";

// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import api from "../configs/api";

// import PersonalInfoForm from "../components/PersonalInfoForm";
// import ResumePreview from "../components/ResumePreview";
// import TemplateSelector from "../components/TemplateSelector";
// import ColorPicker from "../components/ColorPicker";
// import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
// import ExperienceForm from "../components/ExperienceForm";
// import EducationForm from "../components/EducationForm";
// import ProjectForm from "../components/ProjectForm";
// import SkillsForm from "../components/SkillsForm";

// const sections = [
//   { id: "personal", name: "Personal Info", icon: User },
//   { id: "summary", name: "Summary", icon: FileText },
//   { id: "experience", name: "Experience", icon: Briefcase },
//   { id: "education", name: "Education", icon: GraduationCap },
//   { id: "projects", name: "Projects", icon: FolderIcon },
//   { id: "skills", name: "Skills", icon: Sparkles },
// ];

// const ResumeBuilder = () => {
//   const { resumeId } = useParams(); // ✅ FIX: correct param name
//   const { token } = useSelector((state) => state.auth);

//   const [activeSectionIndex, setActiveSectionIndex] = useState(0);
//   const [removeBackground, setRemoveBackground] = useState(false);

//   const [resumeData, setResumeData] = useState({
//     title: "",
//     personal_info: {},
//     professional_summary: "",
//     experience: [],
//     education: [],
//     project: [],
//     skills: [],
//     template: "classic",
//     accent_color: "#3B82F6",
//     public: false,
//   });

//   /* =========================
//      LOAD RESUME FROM BACKEND
//      ========================= */
//   const loadExistingResume = async () => {
//     try {
//       const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
//         headers: { Authorization: token },
//       });

//       setResumeData(data.resume); // ✅ FIX: backend source
//       document.title = data.resume.title;
//     } catch (error) {
//       toast.error("Failed to load resume");
//     }
//   };

//   useEffect(() => {
//     if (resumeId) loadExistingResume();
//   }, [resumeId]);

//   /* =========================
//      SAVE RESUME
//      ========================= */
//   const saveResume = async () => {
//     try {
//       const { data } = await api.put(
//         "/api/resumes/update",
//         {
//           resumeId,
//           resumeData,
//           removeBackground,
//         },
//         { headers: { Authorization: token } },
//       );

//       setResumeData(data.resume);
//       toast.success("Saved successfully");
//     } catch (error) {
//       toast.error("Failed to save resume");
//     }
//   };

//   /* =========================
//      TOGGLE PUBLIC / PRIVATE
//      ========================= */
//   const changeResumeVisibility = async () => {
//     try {
//       const updated = { ...resumeData, public: !resumeData.public };
//       setResumeData(updated);

//       await api.put(
//         "/api/resumes/update",
//         { resumeId, resumeData: updated },
//         { headers: { Authorization: token } },
//       );
//     } catch {
//       toast.error("Failed to update visibility");
//     }
//   };

//   /* =========================
//      SHARE & DOWNLOAD
//      ========================= */
//   const handleShare = () => {
//     const url = `${window.location.origin}/view/${resumeId}`;
//     navigator.share
//       ? navigator.share({ url, text: "My Resume" })
//       : navigator.clipboard.writeText(url);
//   };

//   const downloadResume = () => window.print();

//   const activeSection = sections[activeSectionIndex];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-white border-b mb-6">
//         <div className="max-w-[1400px] mx-auto px-4 py-4">
//           <Link to="/app" className="flex items-center gap-2 text-slate-500">
//             <ArrowLeftIcon className="size-4" /> Back to Dashboard
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-[1400px] mx-auto px-4 pb-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* LEFT PANEL */}
//           <div className="w-full lg:w-[450px] sticky top-6">
//             <div className="bg-white rounded-xl shadow border overflow-hidden">
//               <div className="p-6">
//                 <TemplateSelector
//                   selectedTemplate={resumeData.template}
//                   onChange={(template) =>
//                     setResumeData((p) => ({ ...p, template }))
//                   }
//                 />
//                 <ColorPicker
//                   selectedColor={resumeData.accent_color}
//                   onChange={(color) =>
//                     setResumeData((p) => ({ ...p, accent_color: color }))
//                   }
//                 />

//                 {activeSection.id === "personal" && (
//                   <PersonalInfoForm
//                     data={resumeData.personal_info}
//                     onChange={(data) =>
//                       setResumeData((p) => ({ ...p, personal_info: data }))
//                     }
//                     removeBackground={removeBackground}
//                     setRemoveBackground={setRemoveBackground}
//                   />
//                 )}

//                 {activeSection.id === "summary" && (
//                   <ProfessionalSummaryForm
//                     data={resumeData.professional_summary}
//                     onChange={(data) =>
//                       setResumeData((p) => ({
//                         ...p,
//                         professional_summary: data,
//                       }))
//                     }
//                   />
//                 )}

//                 {activeSection.id === "experience" && (
//                   <ExperienceForm
//                     data={resumeData.experience}
//                     onChange={(data) =>
//                       setResumeData((p) => ({ ...p, experience: data }))
//                     }
//                   />
//                 )}

//                 {activeSection.id === "education" && (
//                   <EducationForm
//                     data={resumeData.education}
//                     onChange={(data) =>
//                       setResumeData((p) => ({ ...p, education: data }))
//                     }
//                   />
//                 )}

//                 {activeSection.id === "projects" && (
//                   <ProjectForm
//                     data={resumeData.project}
//                     onChange={(data) =>
//                       setResumeData((p) => ({ ...p, project: data }))
//                     }
//                   />
//                 )}

//                 {activeSection.id === "skills" && (
//                   <SkillsForm
//                     data={resumeData.skills}
//                     onChange={(data) =>
//                       setResumeData((p) => ({ ...p, skills: data }))
//                     }
//                   />
//                 )}

//                 <button
//                   onClick={saveResume}
//                   className="mt-6 w-full bg-green-600 text-white py-2 rounded"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT PREVIEW */}
//           <div className="flex-1 bg-white shadow rounded">
//             <div className="flex justify-end gap-2 p-4">
//               {resumeData.public && (
//                 <button onClick={handleShare}>
//                   <Share2Icon />
//                 </button>
//               )}
//               <button onClick={changeResumeVisibility}>
//                 {resumeData.public ? <EyeIcon /> : <EyeOffIcon />}
//               </button>
//               <button onClick={downloadResume}>
//                 <DownloadIcon />
//               </button>
//             </div>

//             <ResumePreview
//               data={resumeData}
//               template={resumeData.template}
//               accentColor={resumeData.accent_color}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeBuilder;
