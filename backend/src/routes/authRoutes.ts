import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import type {AuthRequest} from '../middleware/auth.middleware.js'
import { checkRole } from "../middleware/rbac.middleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router=Router();

router.post('/register',register);
router.post('/login',login);

router.get("/profile/:id",authenticateToken,getProfile);
router.put("/profile/:id",authenticateToken,updateProfile);

router.get("/test",authenticateToken,checkRole("buyer"),(req:AuthRequest,res)=>{
    res.json({
        message:'Authentication and Authorization Successful',
        user:req.user
    })
})

export default router