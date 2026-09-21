import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { getFileUrl, uploadFile } from "../services/fileServices.js";

export const uploadFileController=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication required'});
        }
        if(!req.file){
            return res.status(400).json({message:'File is required'});
        }

        const file=await uploadFile(req.file);
        const fileUrl=getFileUrl(file.fileKey)
        res.status(200).json({message:'File uploaded successfully',fileUrl});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

export const getFileUrlController=(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication required'});
        }

        const {filename}=req.params;
        if(!filename){
            return res.status(400).json({message:'Filename is required'});
        }
        const fileUrl=getFileUrl(filename as string);

        return res.status(200).json({fileUrl})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}