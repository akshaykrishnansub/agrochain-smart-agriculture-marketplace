import type { Request,Response } from "express"
import Stripe from "stripe";
import stripe from "../config/stripe.js"
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { createNotification } from "../services/notificationServices.js";
import { getIO } from "../config/socket.js";

export const stripeWebhookController=async(req:Request,res:Response)=>{

    //verify signature
    const signature=req.headers["stripe-signature"];
    const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;

    if(!signature||!webhookSecret){
        return res.status(400).json({message:"Missing stripe signature or webhook secret"});
    }

    let event:Stripe.Event;

    let createdNotification:any;

    try{
        event=stripe.webhooks.constructEvent(req.body,signature,webhookSecret);
    }catch(err){
        console.error("Stripe signature verification failed",err);
        return res.status(400).json({message:"Invalid webhook signature"})
    }

    //Handle Expired checkout sessions
    if(event.type==="checkout.session.expired"){
        const expiredSession=event.data.object as Stripe.Checkout.Session;
        try{
            const cancelledOrder=await Order.findOneAndUpdate(
                {
                    stripeSessionId:expiredSession.id,
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

            console.log(cancelledOrder?"Abandoned checkout order cancelled":"No pending order found for expired checkout",expiredSession.id);
            return res.status(200).json({received:true});
        }catch(err){
            console.error("Expired checkout processing failed",err);
            return res.status(500).json({message:"Webhook processing failed"});
        }
    }

    //Ignore events other than checkout.session.completed
    if(event.type!=="checkout.session.completed"){
        return res.status(200).json({received:true});
    }

    const checkoutSession=event.data.object as Stripe.Checkout.Session;

    console.log("checkout session received:",{
        sessionId:checkoutSession.id,
        paymentStatus:checkoutSession.payment_status,
        metadata:checkoutSession.metadata
    })

    if(checkoutSession.payment_status!=="paid"){
        return res.status(200).json({received:true})
    }

    //Destructuring safely when no metadata is present
    const {orderId,buyerId,productId,quantity:quantityString}=checkoutSession.metadata??{};

    const quantity=Number(quantityString);

    console.log("Stripe webhook metadata:", {
    sessionId: checkoutSession.id,
    paymentStatus: checkoutSession.payment_status,
    buyerId,
    productId,
    quantityString
});

    if(!checkoutSession.id||!orderId||!buyerId||!productId||!Number.isInteger(quantity)||quantity<1||!mongoose.isValidObjectId(orderId)||!mongoose.isValidObjectId(buyerId)||!mongoose.isValidObjectId(productId)){
        return res.status(400).json("Invalid checkout session metadata");
    }

    const mongoSession=await mongoose.startSession();

    try{
        await mongoSession.withTransaction(async()=>{
            const existingOrder=await Order.findOne({
                _id:orderId,
                buyerId,
                productId,
                stripeSessionId:checkoutSession.id,
                status:"PENDING",
                paymentStatus:"PENDING"
            }).session(mongoSession);

            if(!existingOrder){
                const alreadyProcessed=await Order.findOne({
                    stripeSessionId:checkoutSession.id,
                    paymentStatus:"PAID"
                }).session(mongoSession);

                if(alreadyProcessed){
                    return;
                }
                throw new Error("Pending order not found");
            }

            const product=await Product.findOneAndUpdate(
                {
                    _id:productId,
                    stock:{$gte:quantity}
                },
                {
                    $inc:{stock:-quantity}
                },
                {
                    new:true,
                    session:mongoSession
                }
            );

            if(!product){
                throw new Error("Product not found or insufficient stock");
            }

            const updatedOrder=await Order.findOneAndUpdate(
                {
                    _id:orderId,
                    status:"PENDING",
                    paymentStatus:"PENDING"
                },
                {
                    $set:{
                        status:"CONFIRMED",
                        paymentStatus:"PAID",
                        paymentInfo:{
                            provider:"stripe",
                            paymentIntentId:typeof checkoutSession.payment_intent==="string"
                            ?checkoutSession.payment_intent
                            :null
                        }
                    }
                },
                {
                    new:true,
                    session:mongoSession
                }
            )

            if(!updatedOrder){
                throw new Error("Unable to update order");
            }

            createdNotification=await createNotification(
                product.ownerId.toString(),
                "You have received a new order",
                "ORDER_PLACED",
                updatedOrder._id.toString(),
                mongoSession
            )
        })

        console.log("Created notification:",createdNotification);
        if(createdNotification){
            const notification=createdNotification[0];
            if(notification){
                await notification.populate({
                    path:"orderId",
                    select:"productId quantity totalPrice status",
                    populate:{
                        path:"productId",
                        select:"name images category"
                    }
                })
                const io=getIO();
                console.log("Emitting Stripe notification to:",notification.userId.toString());
                io.to(notification.userId.toString()).emit("receive-notification",notification);
            }
            
        }

        return res.status(200).json({received:true});
    }catch(err){
        console.error("Stripe webhook processing failed",err);
        return res.status(500).json({message:"Webhook processing failed"});
    }finally{
        await mongoSession.endSession();
    }
}