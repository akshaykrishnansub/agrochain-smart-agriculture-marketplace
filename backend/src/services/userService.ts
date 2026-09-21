import User from '../models/User.js'

const findUserByEmail=async(email:string)=>{
    return await User.findOne({email})
}

const createUser=async(userData:{
    name:string,
    email:string,
    passwordHash:string,
    role:"buyer"
})=>{
    return await User.create(userData);
}

const getUserById=async(userId:string)=>{
    return await User.findById(userId).select("-passwordHash");
}

const updateUser=async(userId:string,userData:{
    name?:string,
    email?:string
})=>{
    return await User.findByIdAndUpdate(
        userId,
        userData,
        {
            new:true,
            runValidators:true
        }
    ).select("-passwordHash");
}

const addCertification=async(userId:string,certificationUrl:string)=>{
    return await User.findByIdAndUpdate(
        userId,
        {
            $push:{
                certifications:certificationUrl
            }
        },
        {
            new:true
        }
    ).select("-passwordHash");
}

export {findUserByEmail,createUser,getUserById,updateUser,addCertification};