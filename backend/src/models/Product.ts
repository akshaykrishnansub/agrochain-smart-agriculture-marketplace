import mongoose, { Schema } from "mongoose"

const productSchema=new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            required:true,
            trim:true
        },
        price:{
            type:Number,
            required:true,
            min:0
        },
        images:{
            type:[String],
            default:[]
        },
        ownerId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        category:{
            type:String,
            required:true,
            trim:true
        },
        certifications:{
            type:[String],
            default:[]
        },
        stock:{
            type:Number,
            required:true,
            min:0
        }
    },
    {
        timestamps:true
    }
)

const Product=mongoose.model("Product",productSchema);

export default Product