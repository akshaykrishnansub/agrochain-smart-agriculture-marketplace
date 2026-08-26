import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import type {AuthRequest} from '../middleware/auth.middleware.js'

const router=Router();

router.post('/register',register);
router.post('/login',login);

router.get("/test",authenticateToken,(req:AuthRequest,res)=>{
    res.json({
        message:'Authentication Successful',
        user:req.user
    })
})

export default router