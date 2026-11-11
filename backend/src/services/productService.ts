import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Certification from "../models/Certification.js";

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
    const product=await Product.create(productData);

    if(productData.certifications && productData.certifications.length>0){
        await Certification.insertMany(
            productData.certifications.map((fileUrl)=>({
                ownerType:"Product",
                ownerId:product._id,
                fileUrl,
                status:"PENDING"
            }))
        )
    }
    return product;
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
    //Identify the existing product
    const existingProduct=await Product.findOne({_id:productId,ownerId:ownerId});
    if(!existingProduct){
        return null;
    }

    const updatedProduct=await Product.findByIdAndUpdate({_id:productId,ownerId:ownerId,},productData,{new:true, runValidators:true});

    if(productData.certifications!==undefined){
        //identify the removed certifications
        const removedCertifications=existingProduct.certifications.filter((url)=>!productData.certifications!.includes(url));
        //identify the newly added certifications
        const addedCertifications=productData.certifications.filter((url)=>!existingProduct.certifications.includes(url));
        if(removedCertifications.length>0){
            await Certification.deleteMany({
                ownerType:"Product",
                ownerId:existingProduct._id,
                fileUrl:{$in:removedCertifications}
            })
        }

        if(addedCertifications.length>0){
            await Certification.insertMany(
                addedCertifications.map((fileUrl)=>({
                    ownerType:"Product",
                    ownerId:existingProduct._id,
                    fileUrl,
                    status:"PENDING"
                }))
            )
        }
    }
    return updatedProduct;
}

const getAllProducts=async()=>{
    return await Product.find().populate("ownerId","name email role");
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