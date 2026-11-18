import Order from "../models/Order.js";
import Product from "../models/Product.js"
import { createNotification } from "./notificationServices.js";

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

export {createOrder,getOrders,updateOrderStatus};