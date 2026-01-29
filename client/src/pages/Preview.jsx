// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../configs/api";
// import ResumePreview from "../components/ResumePreview";
// import { ArrowLeftIcon, Loader } from "lucide-react";

// const Preview = () => {
//   const { resumeId } = useParams();
//   const [isLoading, setIsLoading] = useState(true);
//   const [resumeData, setResumeData] = useState(null);

//   const loadResume = async () => {
//     try {
//       const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
//         headers: {
//           Authorization: token,
//         },
//       });

//       setResumeData(data.resume); // ✅ FIX: backend response
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Resume not found");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     loadResume();
//   }, [resumeId]);
//   return resumeData ? (
//     <div className="bg-slate-100">
//       <div className="max-w-3xl mx-auto py-10">
//         <ResumePreview
//           data={resumeData}
//           template={resumeData.template}
//           accentColor={resumeData.accent_color}
//           classes="py-4 bg-white"
//         />
//       </div>
//     </div>
//   ) : (
//     <div>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div
//           className="flex flex-col items-center justify-center
//       h-screen"
//         >
//           <p className="text-center text-6xl text-slate-400 font-medium">
//             Resume not found
//           </p>
//           <a
//             href="/"
//             className="mt-6 bg-green-500 hover:bg-green-600
// text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1
// ring-green-400 flex items-center transition-colors"
//           >
//             <ArrowLeftIcon className="mr-2 size-4" />
//             go to home page
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Preview;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon, Loader } from "lucide-react";
import api from "../configs/api"; // ✅ FIX: use backend instead of dummy data
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Preview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  // ✅ FIX: load resume from backend, not dummy data
  const loadResume = async () => {
    try {
      const { data } = await api.get(`/resumes/public/${resumeId}`);
      setResumeData(data.resume); // ✅ FIX: backend response
    } catch (error) {
      toast.error(error?.response?.data?.message || "Resume not found");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  // ✅ FIX: clean loading state handling
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin size-6 text-slate-500" />
      </div>
    );
  }

  // ✅ FIX: handle not found safely
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-4xl text-slate-400 font-medium">Resume not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-green-500 hover:bg-green-600
          text-white rounded-full px-6 h-9 ring-1 ring-green-400
          flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Go to home page
        </button>
      </div>
    );
  }

  // ✅ FIX: render only when resumeData is guaranteed
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  );
};

export default Preview;
