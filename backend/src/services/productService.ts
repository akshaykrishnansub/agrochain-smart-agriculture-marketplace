import Product from "../models/Product.js";

const createProduct=async(productData:{
name:string;
description:string;
price:number;
images?:string[];
ownerId:string;
category:string;
certifications:string[];
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
        certifications?:string[]
    }
)=>{
    return await Product.findByIdAndUpdate({_id:productId,ownerId:ownerId,},productData,{new:true, runValidators:true});
}

const getAllProducts=async()=>{
    return await Product.find();
}

const deleteProduct=async(productId:string,ownerId:string)=>{
    return await Product.findOneAndDelete({_id:productId,ownerId:ownerId})
}

export {createProduct,updateProduct,getAllProducts,deleteProduct};