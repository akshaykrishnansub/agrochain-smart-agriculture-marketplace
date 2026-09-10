import mongoose,{ Schema } from "mongoose";

const orderSchema=new Schema({
    buyerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    totalPrice:{
        type:Number,
        required:true,
        min:0
    },
    status:{
        type:String,
        enum:["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"],
        default:"PENDING"
    },
    paymentStatus:{
        type:String,
        enum:["PENDING","PAID","FAILED","REFUNDED"],
        default:"PENDING"
    },
    paymentInfo:{
        type:Schema.Types.Mixed
    }
},
{timestamps:true}
)

const Order=mongoose.model("Order",orderSchema);

export default Order;