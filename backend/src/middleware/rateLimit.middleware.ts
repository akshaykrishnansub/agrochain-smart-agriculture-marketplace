import type { Request,Response,NextFunction } from "express";
import redis from "../config/redis.js";

export const loginRateLimiter=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const key=`rate-limit:login:${req.ip}`; 
        const requests=await redis.incr(key); //increment request counter for that IP
        if(requests===1){
            await redis.expire(key,60); //set a 60 second expiry when the counter is first created
        }

        if(requests>5){
            return res.status(429).json({message:"Too many login attempts, please try again after 60 seconds"});
        }

        next();
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}