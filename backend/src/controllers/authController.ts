import type { Request,Response } from "express"
import bcrypt from 'bcrypt'
import { createUser, findUserByEmail } from "../services/userService.js";

export const register=async(req:Request,res:Response)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'All fields are required'});
        }

        const existingUser=await findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({message:'User already exists'});
        }

        const passwordHash=await bcrypt.hash(password,10);

        const user=await createUser({name,email,passwordHash,role:"buyer"});

        return res.status(201).json({message:'User Registered Successfully',user:{id:user._id,name:user.name,email:user.email,role:user.role}});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}