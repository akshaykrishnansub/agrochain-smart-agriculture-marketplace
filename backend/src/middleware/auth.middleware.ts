import type {Request,Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request{
    user?:{
        userId:string;
        role:string;
    }
}

export const authenticateToken=(req:AuthRequest,res:Response,next:NextFunction)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({error:'Access Denied'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as {userId:string,role:string}
        console.log(decoded);
        req.user=decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(403).json({error:'Invalid Token'});
    }
}