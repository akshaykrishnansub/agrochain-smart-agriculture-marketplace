import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/rbac.middleware.js";
import { addCertificationController } from "../controllers/userController.js";

const router=Router();

router.post("/:id/certifications",authenticateToken,checkRole("farmer","supplier"),addCertificationController);

export default router;