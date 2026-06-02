import env from "dotenv";
import express from "express";
import connectDB from "./config/DB.js";
import authRouter from "./src/routes/Auth.routes.js";

env.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
