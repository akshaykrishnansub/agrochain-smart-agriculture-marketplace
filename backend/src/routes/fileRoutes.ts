import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/rbac.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {uploadFileController } from "../controllers/fileController.js";

const router=Router();

router.post("/",authenticateToken,checkRole("farmer","supplier"),upload.single("file"),uploadFileController);

export default router;