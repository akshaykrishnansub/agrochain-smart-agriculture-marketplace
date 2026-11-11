import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import Certification from "../models/Certification.js"

const getUserStatistics=async()=>{
    return await User.aggregate([
        {
            $group:{
                _id:"$role",
                totalUsers:{$sum:1}
            }
        },
        {
            $sort:{
                _id:1
            }
        }
    ])
}

const getOrderStatistics=async()=>{
    return await Order.aggregate([
        {
            $group:{
                _id:null,
                totalOrders:{$sum:1},
                totalRevenue:{
                    $sum:{
                        $cond:[
                            {$eq:["$paymentStatus","PAID"]},
                            "$totalPrice",
                            0
                        ]
                    }
                },
                averageOrderValue:{
                $avg:{
                    $cond:[
                        {$eq:["$paymentStatus","PAID"]},
                        "$totalPrice",
                        null
                    ]
                }
            }
        }
    }
]);
}

const getProductStatistics=async()=>{
    return await Product.aggregate([
        {
            $group:{
                _id:null,
                totalProducts:{$sum:1},
                totalStock:{$sum:"$stock"},
                averagePrice:{$avg:"$price"},
                minimumPrice:{$min:"$price"},
                maximumPrice:{$max:"$price"}
            }
        }
    ])
}

const getAllUsers=async()=>{
    return await User.find().select("-passwordHash");
}

const getAllCertifications=async()=>{
    return await Certification.find().populate("ownerId");
}

const adminDeleteUser=async(userId:string)=>{
    const user=await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }

    const existingProduct=await Product.exists({ownerId:userId});

    if(existingProduct){
        throw new Error("Cannot delete user because products exist for this user");
    }

    const existingOrder=await Order.exists({buyerId:userId});

    if(existingOrder){
        throw new Error("Cannot delete user because orders exist for this user");
    }

    return await User.findByIdAndDelete(userId);
}

const reviewCertification=async(certificationId:string,status:"APPROVED"|"REJECTED",rejectionReason:string="")=>{
    return await Certification.findByIdAndUpdate(
        certificationId,
        {
            status,
            reviewedAt:new Date(),
            rejectionReason:status==="REJECTED"?rejectionReason:""
        },
        {
            new:true,
            runValidators:true
        }
    ).populate("ownerId");
}

const adminUpdateUserRole=async(userId:string,role:"buyer"|"farmer"|"supplier"|"admin")=>{
    return await User.findByIdAndUpdate(userId,{role},{new:true,runValidators:true}).select("-passwordHash");
}

const adminDeleteProduct=async(productId:string)=>{
    const product=await Product.findById(productId);

    if(!product){
        throw new Error("Product not found");
    }

    const existingOrder=await Order.exists({productId:productId});

    if(existingOrder){
        throw new Error("Cannot delete this product because orders already exist for this product");
    }

    return await Product.findByIdAndDelete(productId);
}

export {getUserStatistics,getOrderStatistics,getProductStatistics,getAllUsers,adminDeleteProduct,getAllCertifications,reviewCertification,adminUpdateUserRole,adminDeleteUser}