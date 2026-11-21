import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import Product from "../models/Product.js";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";



export const createCheckoutSessionController=async(req:AuthRequest,res:Response)=>{
    let pendingOrderId:string|null=null;
    try{
        if(!req.user){
            return res.status(401).json({message:"Authentication required"});
        }
        const {productId,quantity}=req.body;

        if(typeof productId!=="string"||!productId||!Number.isInteger(quantity)||quantity<1){
            return res.status(400).json({message:"Valid product ID and quantity are required"});
        }

        const product=await Product.findById(productId);

        if(!product){
            return res.status(404).json({message:"Product not found"});
        }

        if(product.price<=0 || !Number.isFinite(product.price)){
            return res.status(400).json({message:"Product price is invalid"});
        }

        if(product.stock<quantity){
            return res.status(400).json({message:"Insufficient Stock"});
        }

        const pendingOrder=await Order.create({
            buyerId:req.user.userId,
            productId:product._id,
            quantity,
            totalPrice:product.price*quantity,
            status:"PENDING",
            paymentStatus:"PENDING"
        })

        pendingOrderId=pendingOrder._id.toString();

        const frontendUrl=process.env.FRONTEND_URL||'http://localhost:5000';

        const session=await stripe.checkout.sessions.create({
            mode:"payment",

            line_items:[
                {
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:product.name,
                        },
                        unit_amount:Math.round(product.price*100),
                    },
                    quantity
                },
            ],
            metadata:{
                orderId:pendingOrder._id.toString(),
                buyerId:req.user.userId,
                productId:product._id.toString(),
                quantity:quantity.toString()
            },

            success_url:`${frontendUrl}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${frontendUrl}/checkout?payment=cancelled&orderId=${pendingOrder._id.toString()}`,
        })

        await Order.findByIdAndUpdate(pendingOrder._id,{stripeSessionId:session.id})
        return res.status(200).json({url:session.url});
    }catch(err){
        console.error(err);

        if(pendingOrderId){
            await Order.findByIdAndDelete(pendingOrderId);
        }
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const cancelCheckoutController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication Required"});
    }

    try{
        const {orderId}=req.params;

        const pendingOrder=await Order.findOne({
            _id:orderId,
            buyerId:req.user.userId,
            status:"PENDING",
            paymentStatus:"PENDING"
        })

        if(!pendingOrder){
            return res.status(404).json({message:"Pending Order not found or already processed"});
        }

        if(!pendingOrder.stripeSessionId){
            return res.status(400).json({message:"Stripe Checkout session not found"});
        }

        const session=await stripe.checkout.sessions.retrieve(pendingOrder.stripeSessionId);

        if(session.status==="complete"){
            return res.status(409).json({message:"Payment has already been completed or is being processed"});
        }

        if(session.status==="open"){
            await stripe.checkout.sessions.expire(session.id);
        }

        const cancelledOrder=await Order.findOneAndUpdate({
            _id:orderId,
            buyerId:req.user.userId,
            status:"PENDING",
            paymentStatus:"PENDING"
        },
        {
            $set:{
                status:"CANCELLED"
            }
        },
        {
            new:true
        }
    )

    if(!cancelledOrder){
        return res.status(404).json({message:"Pending order not found or already processed"});
    }

    return res.status(200).json({message:"Checkout cancelled successfully",order:cancelledOrder});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}