// import React, { useEffect, useState } from "react";
// import {
//   PlusIcon,
//   UploadCloudIcon,
//   FilePenLineIcon,
//   TrashIcon,
//   PencilIcon,
//   XIcon,
//   LoaderCircleIcon,
// } from "lucide-react";
// // import { dummyResumeData } from "../assets/assets";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import api from "../configs/api";
// import pdfToText from "react-pdftotext";

// const Dashboard = () => {
//   const { user, token } = useSelector((state) => state.auth);
//   const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
//   const [showCreateResume, setShowCreateResume] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showUploadResume, setShowUploadResume] = useState(false);
//   const [resume, setResume] = useState(null);
//   const [editResumeId, setEditResumeId] = useState("");
//   const [allResumes, setAllResumes] = useState([]);
//   const [title, setTitle] = useState("");
//   const navigate = useNavigate();
//   const loadAllResumes = async () => {
//     try {
//       const { data } = await api.get("/api/resumes", {
//         headers: { Authorization: token },
//       });
//       // setAllResumes(data.resumes);
//       setAllResumes(Array.isArray(data?.resumes) ? data.resumes : []);
//     } catch (err) {
//       // toast.error(err?.response?.data?.message || err.message);
//       toast.error(err?.response?.data?.message || "Failed to load resumes");
//     }
//   };
//   useEffect(() => {
//     // Load dummy resumes
//     loadAllResumes();
//   }, []);

//   const createResume = async (event) => {
//     try {
//       event.preventDefault();
//       const { data } = await api.post(
//         "/api/resumes/create",
//         { title },
//         {
//           headers: {
//             Authorization: token,
//           },
//         },
//       );
//       setAllResumes([...allResumes, data.resume]);
//       setTitle("");
//       setShowCreateResume(false);
//       navigate(`/app/builder/${data.resume._id}`);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   const uploadResume = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     try {
//       const resumeText = await pdfToText(resume);
//       const { data } = await api.post(
//         "/api/ai/upload-resume",
//         { title, resumeText },
//         { headers: { Authorization: token } },
//       );
//       setTitle("");
//       setResume(null);
//       setShowUploadResume(false);
//       navigate(`/app/builder/${data.resumeId}`);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//     setIsLoading(false);
//   };

//   const deleteResume = async (resumeId) => {
//     try {
//       const confirm = window.confirm(
//         "Are you sure you want to delete this resume?",
//       );
//       if (confirm) {
//         const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
//           headers: {
//             Authorization: token,
//           },
//         });
//         setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
//         toast.success(data.message);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   const editTitle = async (event) => {
//     try {
//       event.preventDefault();
//       const { data } = await api.put(
//         `/api/resumes/update`,
//         { resumeId: editResumeId, resumeData: { title } },
//         { headers: { Authorization: token } },
//       );
//       setAllResumes(
//         allResumes.map((resume) =>
//           resume._id === editResumeId ? { ...resume, title } : resume,
//         ),
//       );
//       setTitle("");
//       setEditResumeId("");
//       toast.success(data.message);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
//           Welcome, Joe Doe
//         </p>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mb-6">
//           <button
//             onClick={() => setShowCreateResume(true)}
//             className="w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
//           >
//             <PlusIcon
//               size={44}
//               className="p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full"
//             />
//             <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
//               Create Resume
//             </p>
//           </button>

//           <button
//             onClick={() => setShowUploadResume(true)}
//             className="w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
//           >
//             <UploadCloudIcon
//               size={44}
//               className="p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full"
//             />
//             <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
//               Upload Existing
//             </p>
//           </button>
//         </div>

//         <hr className="border-slate-300 my-6 sm:w-[305px]" />

//         {/* Resume Cards */}
//         <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
//           {allResumes.map((resume, index) => {
//             const baseColor = colors[index % colors.length];
//             return (
//               <button
//                 key={resume._id}
//                 onClick={() => navigate(`/app/builder/${resume._id}`)}
//                 className="relative w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300"
//                 style={{
//                   background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
//                   borderColor: baseColor + "40",
//                 }}
//               >
//                 <FilePenLineIcon
//                   size={28}
//                   style={{ color: baseColor }}
//                   className="group-hover:scale-105 transition-transform"
//                 />
//                 <p
//                   className="text-sm px-2 text-center group-hover:scale-105 transition-transform"
//                   style={{ color: baseColor }}
//                 >
//                   {resume.title}
//                 </p>
//                 <p
//                   className="absolute bottom-1 text-[11px] px-2 text-center transition-colors duration-300"
//                   style={{ color: baseColor + "90" }}
//                 >
//                   Updated on {new Date(resume.updatedAt).toLocaleDateString()}
//                 </p>
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
//                 >
//                   <TrashIcon
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteResume(resume._id);
//                     }}
//                     size={20}
//                     className="p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
//                   />
//                   <PencilIcon
//                     onClick={() => {
//                       setEditResumeId(resume._id);
//                       setTitle(resume.title);
//                     }}
//                     size={20}
//                     className="p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
//                   />
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Create Resume Modal */}
//       {showCreateResume && (
//         <div
//           onClick={() => setShowCreateResume(false)}
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center"
//         >
//           <form
//             onSubmit={createResume}
//             onClick={(e) => e.stopPropagation()}
//             className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
//           >
//             <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
//             <input
//               type="text"
//               onChange={(e) => setTitle(e.target.value)}
//               value={title}
//               placeholder="Enter resume title"
//               className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
//             >
//               Create Resume
//             </button>

//             <XIcon
//               size={24}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
//               onClick={() => setShowCreateResume(false)}
//             />
//           </form>
//         </div>
//       )}
//       {showUploadResume && (
//         <form
//           onSubmit={uploadResume}
//           onClick={() => setShowUploadResume(false)}
//           className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10
//   flex items-center justify-center"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="relative bg-slate-50
//     border shadow-md rounded-lg w-full max-w-sm p-6"
//           >
//             <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
//             <input
//               onChange={(e) => setTitle(e.target.value)}
//               value={title}
//               type="text"
//               placeholder="Enter resume title"
//               className="w-full px-4
//       py-2 mb-4 focus:border-green-600 ring-green-600"
//               required
//             />
//             <div>
//               <label
//                 htmlFor="resume-input"
//                 className="block text-sm text-slate-700"
//               >
//                 Select resume file
//                 <div
//                   className="flex flex-col items-center justify-center gap-2
//       border group text-slate-400 border-slate-400 border-dashed
//       rounded-md p-4 py-10 my-4 hover:border-green-500
//       hover:text-green-700 cursor-pointer transition-colors"
//                 >
//                   {resume ? (
//                     <p className="text-green-700">{resume.name}</p>
//                   ) : (
//                     <>
//                       <UploadCloudIcon className="size-14 stroke-1" />
//                       <p>Upload resume</p>
//                     </>
//                   )}
//                 </div>
//               </label>

//               <input
//                 type="file"
//                 id="resume-input"
//                 accept=".pdf"
//                 hidden
//                 onChange={(e) => setResume(e.target.files[0])}
//               />
//             </div>

//             <button
//               className="w-full py-2 bg-green-600 text-white rounded
//       hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//               disabled={isLoading}
//             >
//               {isLoading && (
//                 <LoaderCircleIcon className="animate-spin size-4 text-white" />
//               )}
//               {isLoading ? "Uploading..." : "Upload Resume"}
//             </button>
//             <XIcon
//               className="absolute top-4 right-4 text-slate-400
//       hover:text-slate-600 cursor-pointer transition-colors"
//               onClick={() => {
//                 setShowUploadResume(false);
//                 setTitle("");
//               }}
//             />
//           </div>
//         </form>
//       )}
//       {editResumeId && (
//         <div
//           onClick={() => setShowCreateResume(false)}
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center"
//         >
//           <form
//             onSubmit={editTitle}
//             onClick={() => setEditResumeId("")}
//             className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
//           >
//             <h2 className="text-xl font-bold mb-4">Edit resume title</h2>
//             <input
//               type="text"
//               onChange={(e) => setTitle(e.target.value)}
//               value={title}
//               placeholder="Enter resume title"
//               className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
//             >
//               Update
//             </button>

//             <XIcon
//               size={24}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
//               onClick={() => {
//                 setEditResumeId("");
//                 setTitle("");
//               }}
//             />
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  UploadCloudIcon,
  FilePenLineIcon,
  TrashIcon,
  PencilIcon,
  XIcon,
  LoaderCircleIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import axios from "axios";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const { user, token } = useSelector((state) => state.auth);
  console.log(token);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState(null); // uploaded file only
  const [editResumeId, setEditResumeId] = useState("");
  const [allResumes, setAllResumes] = useState([]);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();

  // Load all resumes from backend
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("RAW API DATA:", data);
      setAllResumes(Array.isArray(data) ? data : data?.resumes || []);
    } catch (err) {
      console.log("LOAD RESUMES ERROR:", err);
      console.log("RESPONSE:", err?.response);
      toast.error(err?.response?.data?.message || "Failed to load resumes");
    }
  };

  useEffect(() => {
    if (token) {
      loadAllResumes();
    }
  }, [token]);

  // Create new resume
  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Upload resume file
  // const uploadResume = async (event) => {
  //   try {
  //     event.preventDefault();
  //     if (!resume) return toast.error("Please select a PDF file");
  //     setIsLoading(true);

  //     const resumeText = await pdfToText(resume); // extract text from PDF
  //     const { data } = await api.post(
  //       "/api/ai/upload-resume",
  //       { title, resumeText },
  //       { headers: { Authorization: token } },
  //     );

  //     setTitle("");
  //     setResume(null);
  //     setShowUploadResume(false);
  //     navigate(`/app/builder/${data.resumeId}`);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const uploadResume = async (event) => {
  //   try {
  //     event.preventDefault();
  //     if (!resume) return toast.error("Please select a PDF file");
  //     if (!title) return toast.error("Please enter a title");

  //     setIsLoading(true);

  //     const resumeText = await pdfToText(resume);

  //     if (!resumeText || resumeText.trim().length === 0) {
  //       toast.error("Could not extract text from PDF. Try another file.");
  //       return;
  //     }

  //     const { data } = await api.post(
  //       "/api/ai/upload-resume",
  //       { title, resumeText },
  //       { headers: { Authorization: token } },
  //     );

  //     setTitle("");
  //     setResume(null);
  //     setShowUploadResume(false);
  //     navigate(`/app/builder/${data.resumeId}`);
  //   } catch (error) {
  //     // toast.error(error?.response?.data?.message || error);
  //     toast.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const uploadResume = async (event) => {
  //   try {
  //     event.preventDefault();

  //     if (!resume) return toast.error("Please select a PDF file");
  //     if (!title) return toast.error("Please enter a title");

  //     setIsLoading(true);

  //     const formData = new FormData();
  //     formData.append("resume", resume); // 'resume' must match backend field
  //     formData.append("title", title); // optional, for backend

  //     // wherever you store it
  //     console.log(token);
  //     const { data } = await axios.post(
  //       `/resumes/upload/${resumeId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`, // if your route is protected
  //         },
  //       },
  //     );

  //     toast.success("Resume uploaded successfully!");
  //     setTitle("");
  //     setResume(null);
  //     setShowUploadResume(false);
  //     navigate(`/app/builder/${data.resumeId}`); // use the ID returned by backend
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const uploadResume = async (event) => {
    event.preventDefault();

    try {
      if (!resume) return toast.error("Please select a PDF file");
      if (!title) return toast.error("Please enter a title");

      setIsLoading(true);

      const formData = new FormData();
      formData.append("resume", resume); // MUST match multer field
      formData.append("title", title);

      const { data } = await api.post(
        `/resumes/upload`, // or /resumes/upload if baseURL has /api
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Resume uploaded successfully!");
      setTitle("");
      setResume(null);
      setShowUploadResume(false);

      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a resume
  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?",
      );
      if (!confirm) return;

      const { data } = await api.delete(`/resumes/delete/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllResumes(allResumes.filter((r) => r._id !== resumeId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Edit resume title
  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        `/resumes/${editResumeId}`,
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAllResumes(
        allResumes.map((r) => (r._id === editResumeId ? { ...r, title } : r)),
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || "User"}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
          >
            <PlusIcon
              size={44}
              className="p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full"
            />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
          >
            <UploadCloudIcon
              size={44}
              className="p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full"
            />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        {/* Resume Cards */}
        {/* 
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-red-500"> */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            console.log("Rendering resume:", resume);
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}22, ${baseColor}66)`,
                  borderColor: baseColor + "55",
                }}
              >
                <FilePenLineIcon
                  size={28}
                  style={{ color: baseColor }}
                  className="group-hover:scale-105 transition-transform"
                />
                <p
                  className="text-sm px-2 text-center group-hover:scale-105 transition-transform"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] px-2 text-center transition-colors duration-300"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
                >
                  <TrashIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(resume._id);
                    }}
                    size={20}
                    className="p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    size={20}
                    className="p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <div
          onClick={() => setShowCreateResume(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center"
        >
          <form
            onSubmit={createResume}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Create Resume
            </button>
            <XIcon
              size={24}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => setShowCreateResume(false)}
            />
          </form>
        </div>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUploadResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
              required
            />
            <div>
              <label
                htmlFor="resume-input"
                className="block text-sm text-slate-700"
              >
                Select resume file
                <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloudIcon className="size-14 stroke-1" />
                      <p>Upload resume</p>
                    </>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="resume-input"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />
            </div>
            <button
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && (
                <LoaderCircleIcon className="animate-spin size-4 text-white" />
              )}
              {isLoading ? "Uploading..." : "Upload Resume"}
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
                setResume(null);
              }}
            />
          </div>
        </form>
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <div
          onClick={() => setEditResumeId("")}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center"
        >
          <form
            onSubmit={editTitle}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Edit resume title</h2>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Update
            </button>
            <XIcon
              size={24}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
