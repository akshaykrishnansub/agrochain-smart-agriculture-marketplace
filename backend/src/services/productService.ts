import Order from "../models/Order.js";
import Product from "../models/Product.js";

const createProduct=async(productData:{
name:string;
description:string;
price:number;
images?:string[];
ownerId:string;
category:string;
certifications:string[];
stock:number;
})=>{
    return await Product.create(productData);
}

const updateProduct=async(productId:string,
    ownerId:string,
    productData:{
        name?:string;
        description?:string;
        price?:number;
        category?:string;
        images?:string[];
        certifications?:string[],
        stock?:number
    }
)=>{
    return await Product.findByIdAndUpdate({_id:productId,ownerId:ownerId,},productData,{new:true, runValidators:true});
}

const getAllProducts=async()=>{
    return await Product.find();
}

const getProductById=async(productId:string)=>{
    return await Product.findById(productId);
}

const getMyProducts=async(ownerId:string)=>{
    return await Product.find({ownerId:ownerId});
}

const deleteProduct=async(productId:string,ownerId:string)=>{
    const product=await Product.findOne({
        _id:productId,
        ownerId:ownerId
    })

    if(!product){
        throw new Error("Product not found");
    }

    const existingOrder=await Order.exists({
        productId:productId
    })

    if(existingOrder){
        throw new Error("Cannot delete the product because orders already exist on this product");
    }

    return await Product.findOneAndDelete({_id:productId,ownerId:ownerId})
}

export {createProduct,updateProduct,getAllProducts,deleteProduct,getProductById,getMyProducts};