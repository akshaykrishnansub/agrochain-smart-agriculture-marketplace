import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { getUserById, updateUser } from "../services/userService.js";

export const getProfile=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication Required'});
        }
        const user=await getUserById(req.user.userId);

        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        return res.status(200).json({user});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

export const updateProfile=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication Required'});
        }
        const {id}=req.params;
        const {name,email}=req.body;
        if(req.user.userId!==id){
            return res.status(403).json({message:'Only you can update your own profile'});
        }

        const user=await updateUser(id,{name,email});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        return res.status(200).json({message:'Profile updated successfully'});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}