import type { ClientSession } from "mongoose";
import Notification from "../models/Notification.js"
import { getIO } from "../config/socket.js";

const createNotification=async(userId:string,message:string,event:"ORDER_PLACED"|"ORDER_UPDATED",orderId:string,session?:ClientSession)=>{
    const notification=await Notification.create([{
        userId,
        message,
        event,
        orderId
    }],session?{session}:{});

    if(!session){
        const io=getIO();
        const populatedNotification=await Notification.findById(notification[0]!._id)
        .populate({
            path:"orderId",
            select:"productId quantity totalPrice status",
            populate:{
                path:"productId",
                select:"name images category"
            }
        })
        console.log("Emitting notification to:",userId);
        io.to(userId).emit("receive-notification",populatedNotification);
    }

    return notification;
}

const getNotifications=async(userId:string)=>{
    return await Notification.find({userId})
    .populate({
        path:"orderId",
        select:"productId quantity totalPrice status",
        populate:{
            path:"productId",
            select:"name images category"
        }
    })
    .sort({createdAt:-1});
}

const markNotificationAsRead=async(notificationId:string,userId:string)=>{
    const notification=await Notification.findOneAndUpdate({
        _id:notificationId,
        userId
    },
    {
        isRead:true
    },
    {
        new:true
    });

    if(!notification){
        throw new Error("Notification not found");
    }

    return notification;
}
export {createNotification,getNotifications,markNotificationAsRead}