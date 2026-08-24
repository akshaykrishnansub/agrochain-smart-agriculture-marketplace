import { model,Schema } from "mongoose";

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['farmer','supplier','buyer','admin'],
        required:true
    },
    certifications:{
        type:[String],
        default:[]
    },
},
{
    timestamps:true
})

const User=model('User',userSchema)

export default User