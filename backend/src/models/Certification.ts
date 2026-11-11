import mongoose, { model, Schema } from "mongoose";

const certificationSchema=new Schema({
    ownerType:{
        type:String,
        enum:["User","Product"],
        required:true
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        required:true,
        refPath:"ownerType"
    },
    fileUrl:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["PENDING","APPROVED","REJECTED"],
        default:"PENDING"
    },
    reviewedAt:{
        type:Date,
        default:null
    },
    rejectionReason:{
        type:String,
        default:""
    }   
},{
    timestamps:true
})

const Certification=mongoose.model("Certification",certificationSchema);

export default Certification