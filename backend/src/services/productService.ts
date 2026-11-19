import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Certification from "../models/Certification.js";
import redis from '../config/redis.js';

//cache invalidation
const clearProductCache=async()=>{
    const keys=await redis.keys("products:*");
    if(keys.length>0){
        await redis.del(...keys);
    }
}

const createProduct=async(productData:{
name:string;
description:string;
price:number;
images?:string[];
ownerId:string;
category:string;
certifications:string[];
stock:number;
location:string;
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

    await clearProductCache();
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
        stock?:number,
        location?:string
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

    await clearProductCache();
    return updatedProduct;
}

const getAllProducts=async(search?:string,location?:string,certification?:string,minPrice?:string,maxPrice?:string)=>{
    const cacheKey=`products:${JSON.stringify({search,location,certification,minPrice,maxPrice})}`;
    const cachedProducts=await redis.get(cacheKey);

    if(cachedProducts){
        console.log("Products fetched from redis");
        return JSON.parse(cachedProducts);
    }
    const filters:any={};

    if(search){
        filters.name={$regex:search,$options:"i"};
    }

    if(location){
        filters.location={$regex:location,$options:"i"};
    }

    if(certification){
        filters.certifications={$regex:certification,$options:"i"};
    }

    if(minPrice || maxPrice){
        filters.price={};

        if(minPrice){
            filters.price.$gte=Number(minPrice);
        }

        if(maxPrice){
            filters.price.$lte=Number(maxPrice);
        }
    }
    const products=await Product.find(filters).populate("ownerId","name email role");

    await redis.set(cacheKey,JSON.stringify(products));

    console.log("Products fetched from MongoDB");

    return products;

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

    await clearProductCache();

    return await Product.findOneAndDelete({_id:productId,ownerId:ownerId})
}

export {createProduct,updateProduct,getAllProducts,deleteProduct,getProductById,getMyProducts};