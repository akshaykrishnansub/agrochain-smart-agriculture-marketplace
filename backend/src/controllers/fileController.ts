import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const uploadFile=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication required'});
        }
        if(!req.file){
            return res.status(400).json({message:'File is required'});
        }
        res.status(200).json({message:'File uploaded successfully',file:req.file});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}