import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getNotificationsController, markNotificationAsReadController } from "../controllers/notificationController.js";

const router=Router();

router.get("/",authenticateToken,getNotificationsController);
router.patch("/:notificationId/read",authenticateToken,markNotificationAsReadController);

export default router