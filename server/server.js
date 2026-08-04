// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import connectDB from "./configs/db.js";
// import userRouter from "./routes/userRoutes.js";
// import resumeRouter from "./routes/resumeRoutes.js";
// import aiRouter from "./routes/aiRoutes.js";
// const app = express();
// const PORT = process.env.PORT || 3000;
// //db connection
// await connectDB();
// app.use(express.json());
// app.use(cors());
// app.use("/api/resumes", resumeRouter);
// app.use("/api/users", userRouter);
// app.use("/api/ai", aiRouter);
// app.get("/", (req, res) => {
//   res.send("server is live");
// });
// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });

// server/server.js

import "dotenv/config";
import connectDB from "./configs/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// DB connection
await connectDB();

// start server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
