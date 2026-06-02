import express from "express";
import AuthController from "../controller/auth.controller.js";
const authRouter = express.Router();
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
export default authRouter;
