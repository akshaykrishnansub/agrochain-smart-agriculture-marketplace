import type {Request,Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'

export interface AuthRequest extends Request{
    user?:{
        userId:string;
        role:string;
    }
}

export const authenticateToken=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({error:'Access Denied'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as {userId:string,role:string};
        const storedToken=await redis.get(`session:${decoded.userId}`);
        if(!storedToken||storedToken!==token){
            return res.status(401).json({error:"Session expired or Invalid"});
        }
        console.log(decoded);
        req.user=decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(403).json({error:'Invalid Token'});
    }
}