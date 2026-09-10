import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { createOrder, getOrders, updateOrderStatus } from "../services/orderService.js";

export const createOrderController=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:"Authentication required"});
        }
        const {productId,quantity}=req.body;
        if(!productId||quantity===undefined){
            return res.status(400).json({message:'Product ID and quantity are required'});
        }

        const order=await createOrder(
            req.user.userId,
            productId,
            quantity
        )

        return res.status(201).json({message:'Order created successful',order});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

export const getOrdersController=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:"Authentication required"});
        }

        const orders=await getOrders(req.user.userId,req.user.role);

        return res.status(200).json({orders});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

export const updateOrderStatusController=async(req:AuthRequest,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication Required'});
        }
        const {id}=req.params;
        const {status}=req.body;

        if(!status){
            return res.status(400).json({message:'status is required'});
        }
        
        const order=await updateOrderStatus(id as string,req.user.userId,req.user.role,status);
        if(!order){
            return res.status(404).json({message:'Order not found'});
        }

        return res.status(200).json({message:'Order updated successfully'});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}