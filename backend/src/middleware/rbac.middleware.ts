import type { Response,NextFunction } from "express"
import type { AuthRequest } from "./auth.middleware.js"

export const checkRole=(...allowedRoles:string[])=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        const user=req.user;
        if(!user){
            return res.status(401).json({error:'Authentication Required'});
        }

        if(!allowedRoles.includes(user.role)){
            return res.status(403).json({error:'Access Denied'});
        }
        next();
    }
}