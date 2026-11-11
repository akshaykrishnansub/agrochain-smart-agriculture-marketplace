import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { adminDeleteProduct, adminDeleteUser, adminUpdateUserRole, getAllCertifications, getAllUsers, getOrderStatistics, getProductStatistics, getUserStatistics, reviewCertification } from "../services/adminServices.js";
import { getAllProducts } from "../services/productService.js";
import { getOrders, updateOrderStatus } from "../services/orderService.js";

const getAdminDashboard=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication Required"});
    }

    try{
        const users=await getUserStatistics();
        const products=await getProductStatistics();
        const orders=await getOrderStatistics();

        return res.status(200).json({users,products,orders});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const getAllUsersController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }

    try{
        const users=await getAllUsers();
        return res.status(200).json({users});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const getAllProductsController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }

    try{
        const products=await getAllProducts();
        return res.status(200).json({products});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const adminUpdateUserRoleController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication Required"});
    }

    try{
        const {id}=req.params;
        const {role}=req.body;

        if(!["buyer","farmer","supplier","admin"].includes(role)){
            return res.status(400).json({message:"Invalid role"});
        }

        if(id===req.user.userId){
            return res.status(400).json({message:"You cannot change your own role"});
        }

        const user=await adminUpdateUserRole(id as string,role);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({message:"User role updated successfully",user});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const adminDeleteUserController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }

    try{
        const {id}=req.params;
        if(id===req.user.userId){
            return res.status(400).json({message:"You cannot delete your own account"});
        }

        const user=await adminDeleteUser(id as string);

        return res.status(200).json({message:"User deleted successfully",user});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const getAllOrdersController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }
    try{
        const orders=await getOrders(req.user.userId,req.user.role);
        return res.status(200).json({orders});
    }catch(err){
        return res.status(500).json({message:""})
    }
}

const adminDeleteProductController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }
    try{
        const {id}=req.params;
        const product=await adminDeleteProduct(id as string);

        if(!product){
            return res.status(404).json({message:"Product not found"});
        }

        return res.status(200).json({message:"Product deleted successfully"});
    }catch(err){
        return res.status(500).json({message:"Internal Server error"});
    }
}

const getAllCertificationsController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication Required"});
    }
    try{
        const certifications=await getAllCertifications();
        return res.status(200).json({certifications});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}


const reviewCertificationController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }
    try{
        const {id}=req.params;
        const {status,rejectionReason}=req.body;

        if(status!=="APPROVED" && status!=="REJECTED"){
            return res.status(400).json({message:"Invalid certification status"});
        }

        if(status==="REJECTED" && !rejectionReason.trim()){
            return res.status(400).json({message:"Rejection reason is required"});
        }

        const certification=await reviewCertification(id as string,status,rejectionReason);

        if(!certification){
            return res.status(404).json({message:"Certification not found"});
        }

        return res.status(200).json({message:"Certification approved successfully",certification});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const adminUpdateOrderStatusController=async(req:AuthRequest,res:Response)=>{
    if(!req.user){
        return res.status(401).json({message:"Authentication required"});
    }

    try{
        const {id}=req.params;
        const {status}=req.body;

        if(!status){
            return res.status(400).json({message:"Status is required"});
        }

        const order=await updateOrderStatus(id as string,req.user.userId,req.user.role,status);

        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

        return res.status(200).json({message:"Order updated successfully"});
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export {getAdminDashboard,getAllUsersController,getAllProductsController,getAllOrdersController,adminDeleteProductController,adminUpdateOrderStatusController,getAllCertificationsController,reviewCertificationController,adminUpdateUserRoleController,adminDeleteUserController}