import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js"
import { createNotification } from "./notificationServices.js";
import { getIO } from "../config/socket.js";

type OrderStatus="PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED";

const createOrder=async(
    buyerId:string,
    productId:string,
    quantity:number
)=>{
    const product=await Product.findById(productId);

    if(!product){
        throw new Error("Product not found");
    }

    if(quantity<=0){
        throw new Error("Quantity must be greater than zero"); //quantity should be positive
    }

    if(product.stock < quantity){
        throw new Error("Insufficient stock"); //prevents from ordering more than available stock
    }

    const totalPrice=product.price*quantity; //calculating total price

    const order=await Order.create({
        buyerId,
        productId,
        quantity,
        totalPrice
    })

    product.stock=product.stock-quantity; //calculate stock value after order is created
    await product.save(); // update the stock value in database

    await createNotification(product.ownerId.toString(),"You have received a new order","ORDER_PLACED",order._id.toString());

    return order;
}

const getOrders=async(userId:string,role:string)=>{
    if(role==="buyer"){
        return await Order.find({buyerId:userId}).populate("productId","name images category");
    }
    if(role==="farmer" || role==="supplier"){
        const products=await Product.find({
            ownerId:userId,
        }).select("_id");

        const productIds=products.map((product)=>product._id);

        return await Order.find({
            productId:{$in:productIds}
        }).populate("productId","name images category price stock");
    }

    if(role==="admin"){
        return await Order.find().populate("productId","name images category price stock").populate("buyerId","name email");
    }

    return [];
}

const updateOrderStatus=async(orderId:string,userId:string,role:string,status:OrderStatus)=>{
    const order=await Order.findById(orderId);
    if(!order){
        throw new Error("Order not found");
    }

    if(order.paymentStatus==="REFUND_PENDING"){
        throw new Error("Order refund is in progress");
    }

    if(role==="admin"){
        order.status=status;
        await order.save();

        await createNotification(order.buyerId.toString(),`Your order status has been changed to ${status}`,"ORDER_UPDATED",order._id.toString());

        return order;
    }
    if(role==="farmer"||role==="supplier"){
        const product=await Product.findOne({
            _id:order.productId,
            ownerId:userId
        })

        if(!product){
            throw new Error("Access Denied");
        }

        order.status=status;
        await order.save();

        await createNotification(order.buyerId.toString(),`Your order status has been updated to ${status}`,"ORDER_UPDATED",order._id.toString());

        return order;
    }

    throw new Error("Access Denied");
}


export const cancelOrder=async(orderId:string,buyerId:string)=>{
    const order=await Order.findOne({
        _id:orderId,
        buyerId
    })

    if(!order){
        throw new Error("Order not found");
    }

    if(!["PENDING","CONFIRMED","PROCESSING"].includes(order.status)){
        throw new Error("This order cannot be cancelled");
    }

    let paymentIntentId:string|undefined;

    if(order.paymentStatus==="PAID" || order.paymentStatus==="REFUND_PENDING"){
        paymentIntentId=order.paymentInfo?.paymentIntentId;

        if(!paymentIntentId){
            throw new Error("Payment Information not found");
        }
    }else if(order.paymentStatus!=="PENDING"){
        throw new Error("This order cannot be cancelled");
    }

    //claim the refund

    if(order.paymentStatus==="PAID"){
        const claimedOrder=await Order.findOneAndUpdate({
            _id:orderId,
            buyerId,
            status:{$in:["PENDING","CONFIRMED","PROCESSING"]},
            paymentStatus:"PAID"
        },
        {
            $set:{paymentStatus:"REFUND_PENDING"}
        },
        {new:true}
    )
    if(!claimedOrder){
        throw new Error("Order cannot be cancelled or refund is already in progress");
    }
    }

    //Refund paid orders through stripe
    if(order.paymentStatus==="PAID" || order.paymentStatus==="REFUND_PENDING"){
        await stripe.refunds.create({
            payment_intent:paymentIntentId!
        },
        {
            idempotencyKey:`order-refund-${order._id}`
        }
    )
    }



    const mongoSession=await mongoose.startSession();

    let cancelledOrder:typeof order|null=null;
    let createdNotification:any;

    try{
        await mongoSession.withTransaction(async()=>{
            cancelledOrder=await Order.findOneAndUpdate({
                _id:orderId,
                buyerId,
                status:{$in:["PENDING","CONFIRMED","PROCESSING"]},
                paymentStatus:order.paymentStatus==="PENDING"?"PENDING":"REFUND_PENDING"
            },
            {
                $set:{
                    status:"CANCELLED",
                    ...(order.paymentStatus!=="PENDING" ? {paymentStatus:"REFUNDED"}:{})
                }
            },
            {
                new:true,
                session:mongoSession
            }
        )

        if(!cancelledOrder){
            throw new Error("Order cannot be cancelled");
        }

        const product=await Product.findByIdAndUpdate(
            order.productId,
            {
                $inc:{stock:order.quantity}
            },
            {
                new:true,
                session:mongoSession
            }
        )

        if(!product){
            throw new Error("Product not found");
        }

        createdNotification=await createNotification(
            product.ownerId.toString(),
            "An order has been cancelled by the buyer",
            "ORDER_UPDATED",
            order._id.toString(),
            mongoSession
        )
        })

        if(createdNotification?.[0]){
            const notification=await createdNotification[0].populate({
                path:"orderId",
                select:"productId quantity totalPrice status",
                populate:{
                    path:"productId",
                    select:"name images category"
                }
            })

            getIO().to(notification.userId.toString()).emit("receive-notification",notification);
        }
        return cancelledOrder;
    }finally{
        await mongoSession.endSession();
    }
}


export {createOrder,getOrders,updateOrderStatus};