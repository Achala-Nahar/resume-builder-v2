import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import ResumeBuilder from "./pages/ResumeBuilder";
import { useDispatch } from "react-redux";
import { login, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";
import api from "./configs/api";
const App = () => {
  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get("/users/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<Dashboard />} />
          <Route path="view/:resumeId" element={<Preview />} />
          <Route path="login" element={<Login />}></Route>
        </Route>
      </Routes> */}
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/view/:resumeId" element={<Preview />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="builder/:resumeId" element={<ResumeBuilder />} /> */}
          {/* <Route path="resume/:id" element={<ResumeBuilder />} /> */}
          {/* <Route path="view/:resumeId" element={<Preview />} /> */}
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
