import Order from "../models/Order.js";
import Product from "../models/Product.js"

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

    return order;
}

const getOrders=async(userId:string,role:string)=>{
    if(role==="buyer"){
        return await Order.find({buyerId:userId});
    }
    if(role==="farmer" || role==="supplier"){
        const products=await Product.find({
            ownerId:userId,
        }).select("_id");

        const productIds=products.map((product)=>product._id);

        return await Order.find({
            productId:{$in:productIds}
        })
    }

    if(role==="admin"){
        return await Order.find();
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
        return await order.save();
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
        return await order.save();
    }

    throw new Error("Access Denied");
}

export {createOrder,getOrders,updateOrderStatus};