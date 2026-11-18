import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { getNotifications, markNotificationAsRead } from "../services/notificationServices.js";

const getNotificationsController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authorization required"});
    }

    try{
        const id=req.user.userId;
        const notifications=await getNotifications(id);

        return res.status(200).json({notifications});


    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const markNotificationAsReadController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication Required"});
    }

    try{
        const {notificationId}=req.params;
        const userId=req.user.userId;
        const notification=await markNotificationAsRead(notificationId as string,userId);
        if(!notification){
            return res.status(404).json({message:"Notification not found"});
        }
        
        return res.status(200).json({message:"Notification status updated",notification})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server error"});
    }
}

export {getNotificationsController,markNotificationAsReadController}