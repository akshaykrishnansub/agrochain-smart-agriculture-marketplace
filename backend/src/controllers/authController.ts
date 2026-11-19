import type { Request,Response } from "express"
import bcrypt from 'bcrypt'
import { createUser, findUserByEmail } from "../services/userService.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import redis from "../config/redis.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const register=async(req:Request,res:Response)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'All fields are required'});
        }

        const existingUser=await findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({message:'User already exists'});
        }

        const passwordHash=await bcrypt.hash(password,10);

        const user=await createUser({name,email,passwordHash,role:"buyer"});

        return res.status(201).json({message:'User Registered Successfully',user:{id:user._id,name:user.name,email:user.email,role:user.role}});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const login=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:'Email and Password are required'});
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({message:'Invalid email or password'});
        }

        const isValidPassword=await bcrypt.compare(password,user.passwordHash);

        if(!isValidPassword){
            return res.status(401).json({message:'Invalid email or password'});
        }

        const token=jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET!,{expiresIn:'1d'});

        await redis.set(`session:${user._id}`,token,"EX",86400);

        res.cookie('token',token,{
            path:'/',
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge:1*24*60*60*1000
        })

        return res.status(200).json({message:'Login Successful',accessToken:token,user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }})
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

export const logout=async(req:AuthRequest,res:Response)=>{
    try{
        await redis.del(`session:${req.user!.userId}`);
        res.clearCookie('token',{
            path:'/',
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })
        return res.status(200).json({message:"Logged out successfully"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}