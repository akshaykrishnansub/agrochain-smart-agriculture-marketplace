import mongoose, { Schema } from "mongoose";

const notificationSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true,
        trim:true
    },
    event:{
        type:String,
        enum:["ORDER_PLACED","ORDER_UPDATED"],
        required:true
    },
    orderId:{
        type:Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification