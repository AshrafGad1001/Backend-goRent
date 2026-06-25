import express from "express";
import { verifyAuth } from "../../Middleware/Auth.Middleware.js";
import { getUserNotifications, markAsRead, markAllAsRead } from "./notification.controller.js";

const router = express.Router();

router.use(verifyAuth);

router.get("/", getUserNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;
