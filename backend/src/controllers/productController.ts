import type { AuthRequest } from "../middleware/auth.middleware.js";
import type {Request,Response} from 'express'
import { createProduct,deleteProduct,getAllProducts,updateProduct } from "../services/productService.js";

export const createProductController=async(req:AuthRequest,res:Response)=>{
    try{
        const {name,description,price,category,images,certifications,stock}=req.body;
        if(!name||!description||price===undefined||!category||stock===undefined){
           return res.status(400).json({message:'Name,Description,price,stock and category are required'});
        }

        if(!req.user){
            return res.status(401).json({message:'Authentication required'});
        }

        const product=await createProduct({
            name,
            description,
            price,
            category,
            images,
            certifications,
            ownerId:req.user.userId,
            stock
        })

        return res.status(201).json({message:'Product created successfully',product})

    }catch(err){
        console.error(err);
        res.status(500).json({message:'Internal Server error'});
    }
}

export const updateProductController=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        if(!req.user){
            return res.status(401).json({message:'Authentication Required'});
        }
        const product=await updateProduct(id as string,req.user.userId,req.body);
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }
        return res.status(200).json({message:'Product updated successfully',product});

    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

export const getAllProductsController=async(req:Request,res:Response)=>{
    try{
        const products=await getAllProducts();
        return res.status(200).json({products})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

export const deleteProductController=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        if(!req.user){
            return res.status(401).json({message:'Authentication Required'});
        }
        const product=await deleteProduct(id as string,req.user.userId);
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }

        return res.status(200).json({message:'Product deleted successfully'});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}